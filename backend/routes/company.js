const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Job = require('../models/Job');
const Application = require('../models/Application');

const User = require('../models/User');

// get current company profile
router.get('/me', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    res.json(req.user);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// create job posting
router.post('/jobs', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const payload = req.body;
    const job = new Job(Object.assign({}, payload, { companyId: req.user._id }));
    await job.save();
    res.status(201).json(job);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// list companies and their jobs (for students/admin)
router.get('/', auth.requireAuth, async (req, res)=>{
  try{
    // only allow students and admin to use this endpoint
    if(!['student','admin'].includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
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

// edit job
router.put('/jobs/:id', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: 'Job not found' });
    if(job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Close recruitment for a job (mark as completed/closed)
router.patch('/jobs/:id/close', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: 'Job not found' });
    if(job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

    const { status, reason, hiredCount } = req.body || {};
    const appCount = await Application.countDocuments({ jobId: job._id });

    // Update job status
    job.recruitmentStatus = status || 'completed';
    job.closureReason = reason || 'Recruitment completed';
    job.closedAt = new Date();
    job.isActive = false;
    if(hiredCount !== undefined) job.hiredCount = hiredCount;
    
    await job.save();

    // Record closure request for admin tracking
    try{
      const JobDeletionRequest = require('../models/JobDeletionRequest');
      await JobDeletionRequest.create({
        jobId: job._id,
        jobTitle: job.title || '',
        companyId: req.user._id,
        reason: reason || 'Recruitment completed',
        otherReason: `Hired: ${hiredCount || 0} candidates`,
        numApplications: appCount,
        status: 'finished'
      });
    }catch(e){
      console.error('Failed to record closure', e);
    }

    return res.json({ msg: 'Recruitment closed successfully', job });
  }catch(err){
    console.error('Error closing recruitment:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// Legacy delete endpoint - now closes recruitment instead of deleting
router.delete('/jobs/:id', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const job = await Job.findById(req.params.id);
    if(!job) return res.status(404).json({ error: 'Job not found' });
    if(job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });

    const { reason, otherReason } = req.body || {};
    const appCount = await Application.countDocuments({ jobId: job._id });

    // Close recruitment instead of deleting
    job.recruitmentStatus = 'closed';
    job.closureReason = reason || 'Recruitment closed';
    job.closedAt = new Date();
    job.isActive = false;
    await job.save();

    // record closure for admin tracking
    try{
      const JobDeletionRequest = require('../models/JobDeletionRequest');
      await JobDeletionRequest.create({
        jobId: job._id,
        jobTitle: job.title || '',
        companyId: req.user._id,
        reason: reason || 'Recruitment closed',
        otherReason: otherReason || '',
        numApplications: appCount,
        status: 'finished'
      });
    }catch(e){
      console.error('Failed to record closure', e);
    }

    return res.json({ msg: 'Recruitment closed successfully' });
  }catch(err){
    console.error('Error closing recruitment:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

// list my jobs
router.get('/jobs/my', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  const jobs = await Job.find({ companyId: req.user._id });
  res.json(jobs);
});

// get applications for a job
router.get('/jobs/:jobId/applications', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if(!job) return res.status(404).json({ error: 'Job not found' });
    if(job.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    const apps = await Application.find({ jobId }).populate('studentId', '-passwordHash');
    res.json(apps);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// shortlist / update application status
router.post('/applications/:id/status', auth.requireAuth, auth.requireRole(['company']), async (req, res)=>{
  try{
    const { id } = req.params;
    const { status } = req.body;
    const app = await Application.findById(id).populate('jobId');
    if(!app) return res.status(404).json({ error: 'Application not found' });
    if(app.jobId.companyId.toString() !== req.user._id.toString()) return res.status(403).json({ error: 'Forbidden' });
    app.status = status;
    await app.save();
    res.json({ msg: 'Status updated' });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
