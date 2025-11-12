/**
 * CompanyPermissionRequest model
 * - Represents a student's request to apply to a company after already being selected
 * - Admin approves/rejects these requests
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyPermissionRequestSchema = new Schema({
  studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  requestedAt: { type: Date, default: Date.now },
  respondedAt: Date,
  adminNote: String
});

module.exports = mongoose.model('CompanyPermissionRequest', CompanyPermissionRequestSchema);
