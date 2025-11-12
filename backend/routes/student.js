const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const ProfileEditRequest = require('../models/ProfileEditRequest');
const CompanyPermissionRequest = require('../models/CompanyPermissionRequest');

const auth = require('../middleware/auth');

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${req.user._id.toString()}-${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// get my profile
router.get('/me', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  res.json(req.user);
});

// update my profile (request edit if locked)
router.put('/me', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const payload = req.body;
    const user = await User.findById(req.user._id);
    if(user.profileLocked){
      // create a profile edit request (for now, we store in metadata)
      user.metadata = user.metadata || {};
      user.metadata.editRequest = payload;
      await user.save();
      return res.json({ msg: 'Profile locked by admin. Edit request submitted.' });
    }
    user.profile = Object.assign({}, user.profile || {}, payload);
    await user.save();
    res.json({ msg: 'Profile updated' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// upload resume
router.post('/upload-resume', auth.requireAuth, auth.requireRole(['student']), upload.single('resume'), async (req, res)=>{
  try{
    if(!req.file) return res.status(400).json({ error: 'Missing file' });
    const user = await User.findById(req.user._id);
    user.profile = user.profile || {};
    user.profile.resumePath = req.file.filename;
    await user.save();
    res.json({ msg: 'Uploaded', path: `/uploads/${req.file.filename}` });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list eligible jobs for student based on CGPA/branch/skills
router.get('/eligible-jobs', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const user = await User.findById(req.user._id);
    const cgpa = user.profile?.cgpa || 0;
    const branch = user.profile?.branch;
    const skills = user.profile?.skills || [];

    const jobs = await Job.find({ isActive: true, cgpaCutoff: { $lte: cgpa }, eligibleBranches: { $in: [branch] } }).lean();
    // basic skill match scoring
    const enriched = jobs.map(j=>{
      const matchSkills = j.requiredSkills.filter(s=>skills.includes(s)).length;
      return Object.assign({}, j, { matchSkills });
    }).sort((a,b)=> b.matchSkills - a.matchSkills);
    res.json(enriched);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// apply to job
router.post('/apply/:jobId', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if(!job) return res.status(404).json({ error: 'Job not found' });
    const existing = await Application.findOne({ jobId, studentId: req.user._id });
    if(existing) return res.status(400).json({ error: 'Already applied' });
    const student = await User.findById(req.user._id);
    const app = new Application({ jobId, studentId: req.user._id, resumeSnapshotPath: student.profile?.resumePath });
    await app.save();
    // create notification for company? (optional) - here we notify student that application recorded
    try{
      await Notification.create({ userId: req.user._id, type: 'application', title: 'Application submitted', message: `You applied to ${job.title}`, data: { jobId: job._id, applicationId: app._id } });
    }catch(e){ console.error('notif error', e) }
    res.json({ msg: 'Applied' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list my applications
router.get('/applications', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const apps = await Application.find({ studentId: req.user._id })
      .populate({
        path: 'jobId',
        populate: {
          path: 'companyId',
          select: 'email profile'
        }
      });
    res.json(apps);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list my notifications
router.get('/notifications', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const notifs = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifs);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// submit profile edit request
router.post('/profile-edit-request', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const { name, rollNumber, branch, cgpa, skills, phone } = req.body;
    const editRequest = new ProfileEditRequest({
      studentId: req.user._id,
      requestedChanges: { name, rollNumber, branch, cgpa, skills, phone }
    });
    await editRequest.save();
    res.json({ msg: 'Profile edit request submitted for admin approval' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list my profile edit requests
router.get('/profile-edit-requests', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const requests = await ProfileEditRequest.find({ studentId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// check if student has any selected (offer) applications
router.get('/has-offer', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const selectedApp = await Application.findOne({ studentId: req.user._id, status: 'Selected' });
    res.json({ hasOffer: !!selectedApp });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// request permission to apply to a company (when already placed)
router.post('/request-company-permission', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const { companyId, reason } = req.body;
    
    if(!companyId || !reason) {
      return res.status(400).json({ error: 'Company ID and reason are required' });
    }

    // Check if already requested
    const existing = await CompanyPermissionRequest.findOne({
      studentId: req.user._id,
      companyId,
      status: 'Pending'
    });
    
    if(existing) {
      return res.status(400).json({ error: 'Permission request already pending for this company' });
    }

    const request = new CompanyPermissionRequest({
      studentId: req.user._id,
      companyId,
      reason
    });
    
    await request.save();
    
    // Notify admin
    try{
      const admins = await User.find({ role: 'admin' });
      for(const admin of admins) {
        await Notification.create({
          userId: admin._id,
          type: 'permission_request',
          title: 'Company Permission Request',
          message: `Student has requested permission to apply to a company after being placed`,
          data: { requestId: request._id, studentId: req.user._id }
        });
      }
    }catch(e){ console.error('notif error', e) }
    
    res.json({ msg: 'Permission request submitted successfully' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list my company permission requests
router.get('/company-permission-requests', auth.requireAuth, auth.requireRole(['student']), async (req, res)=>{
  try{
    const requests = await CompanyPermissionRequest.find({ studentId: req.user._id })
      .populate('companyId', 'email profile')
      .sort({ requestedAt: -1 });
    res.json(requests);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
