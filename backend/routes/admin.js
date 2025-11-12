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
    
    console.log('Before update:', user.profile);
    
    // Apply the requested changes - properly update each field
    if(!user.profile) user.profile = {};
    
    // Update each field individually to ensure Mongoose tracks changes
    if(editRequest.requestedChanges.name !== undefined) user.profile.name = editRequest.requestedChanges.name;
    if(editRequest.requestedChanges.rollNumber !== undefined) user.profile.rollNumber = editRequest.requestedChanges.rollNumber;
    if(editRequest.requestedChanges.branch !== undefined) user.profile.branch = editRequest.requestedChanges.branch;
    if(editRequest.requestedChanges.cgpa !== undefined) user.profile.cgpa = editRequest.requestedChanges.cgpa;
    if(editRequest.requestedChanges.phone !== undefined) user.profile.phone = editRequest.requestedChanges.phone;
    if(editRequest.requestedChanges.skills !== undefined) user.profile.skills = editRequest.requestedChanges.skills;
    
    console.log('After update:', user.profile);
    
    // Mark the profile as modified for Mongoose
    user.markModified('profile');
    await user.save();
    
    console.log('Saved to database');
    
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
    
    res.json({ msg: 'Permission request rejected' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
