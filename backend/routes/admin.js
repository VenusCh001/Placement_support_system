/**
 * Admin routes
 * - Exposes admin-only endpoints for user management, analytics, and deletion request review
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Job = require('../models/Job');
const JobDeletionRequest = require('../models/JobDeletionRequest');
const ProfileEditRequest = require('../models/ProfileEditRequest');
const CompanyPermissionRequest = require('../models/CompanyPermissionRequest');
const Notification = require('../models/Notification');

// get current admin profile
router.get('/me', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    res.json(req.user);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// admin: list students
router.get('/students', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  const students = await User.find({ role: 'student' }).select('-passwordHash');
  res.json(students);
});

// admin: list companies
router.get('/companies', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const companies = await User.find({ role: 'company' }).select('email profile companyVerified');
    // attach jobs per company
    const result = await Promise.all(companies.map(async c=>{
      const jobs = await Job.find({ companyId: c._id, isActive: true });
      return { company: c, jobs };
    }));
    res.json(result);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// admin: approve company
router.post('/companies/:id/verify', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  const id = req.params.id;
  const comp = await User.findById(id);
  if(!comp || comp.role !== 'company') return res.status(404).json({ error: 'Company not found' });
  comp.companyVerified = true;
  await comp.save();
  res.json({ msg: 'Company verified' });
});

// admin: view edit requests and approve
router.get('/profile-edit-requests', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const requests = await ProfileEditRequest.find().populate('studentId', 'email profile').sort({ createdAt: -1 });
    res.json(requests);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/profile-edit-requests/:id/approve', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const id = req.params.id;
    const editRequest = await ProfileEditRequest.findById(id);
    if(!editRequest) return res.status(404).json({ error: 'Request not found' });
    
    const user = await User.findById(editRequest.studentId);
    if(!user) return res.status(404).json({ error: 'Student not found' });
    
    // Apply the requested changes
    user.profile = Object.assign({}, user.profile || {}, editRequest.requestedChanges);
    await user.save();
    
    // Update request status
    editRequest.status = 'approved';
    editRequest.reviewedBy = req.user._id;
    editRequest.reviewedAt = new Date();
    editRequest.adminComments = req.body.comments || '';
    await editRequest.save();
    
    res.json({ msg: 'Profile edit approved' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/profile-edit-requests/:id/reject', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const id = req.params.id;
    const editRequest = await ProfileEditRequest.findById(id);
    if(!editRequest) return res.status(404).json({ error: 'Request not found' });
    
    editRequest.status = 'rejected';
    editRequest.reviewedBy = req.user._id;
    editRequest.reviewedAt = new Date();
    editRequest.adminComments = req.body.comments || '';
    await editRequest.save();
    
    res.json({ msg: 'Profile edit rejected' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// admin analytics: simple counts
router.get('/analytics', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  const totalStudents = await User.countDocuments({ role: 'student' });
  const perBranch = await User.aggregate([
    { $match: { role: 'student', 'profile.branch': { $exists: true } } },
    { $group: { _id: '$profile.branch', count: { $sum: 1 } } }
  ]);
  const jobs = await Job.countDocuments();
  res.json({ totalStudents, perBranch, jobs });
});

// list job deletion requests
router.get('/deletion-requests', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    // Populate company for display; jobId may be null after deletion, but we also store jobTitle
    const reqs = await JobDeletionRequest.find().populate('companyId', 'email profile').populate('jobId');
    res.json(reqs);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// update deletion request (status/comments)
router.patch('/deletion-requests/:id', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const id = req.params.id;
    const reqDoc = await JobDeletionRequest.findById(id);
    if(!reqDoc) return res.status(404).json({ error: 'Request not found' });
    const { status, comments } = req.body;
    if(status) reqDoc.status = status;
    if(comments !== undefined) reqDoc.comments = comments;
    await reqDoc.save();
    res.json({ msg: 'Updated' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list all company permission requests
router.get('/company-permission-requests', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const requests = await CompanyPermissionRequest.find()
      .populate('studentId', 'email profile')
      .populate('companyId', 'email profile')
      .sort({ requestedAt: -1 });
    res.json(requests);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// approve company permission request
router.post('/company-permission-requests/:id/approve', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const id = req.params.id;
    const request = await CompanyPermissionRequest.findById(id);
    if(!request) return res.status(404).json({ error: 'Request not found' });
    
    request.status = 'Approved';
    request.respondedAt = new Date();
    request.adminNote = req.body.note || '';
    await request.save();
    
    // Notify student
    try{
      await Notification.create({
        userId: request.studentId,
        type: 'permission_approved',
        title: 'Permission Approved',
        message: 'Your request to apply to a company has been approved by admin',
        data: { requestId: request._id, companyId: request.companyId }
      });
    }catch(e){ console.error('notif error', e) }
    
    res.json({ msg: 'Permission request approved' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// reject company permission request
router.post('/company-permission-requests/:id/reject', auth.requireAuth, auth.requireRole(['admin']), async (req, res)=>{
  try{
    const id = req.params.id;
    const request = await CompanyPermissionRequest.findById(id);
    if(!request) return res.status(404).json({ error: 'Request not found' });
    
    request.status = 'Rejected';
    request.respondedAt = new Date();
    request.adminNote = req.body.note || '';
    await request.save();
    
    // Notify student
    try{
      await Notification.create({
        userId: request.studentId,
        type: 'permission_rejected',
        title: 'Permission Rejected',
        message: 'Your request to apply to a company has been rejected by admin',
        data: { requestId: request._id, companyId: request.companyId }
      });
    }catch(e){ console.error('notif error', e) }
    
    res.json({ msg: 'Permission request rejected' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
