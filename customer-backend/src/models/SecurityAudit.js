const { mongoose } = require('../config/clients');

const SecurityAuditSchema = new mongoose.Schema({
  actor_id: { type: String, required: true },
  action_type: {
    type: String,
    enum: ['lockout', 'vault_reset', 'high_risk_payout'],
    required: true,
  },
  source_ip: { type: String, required: true },
  correlation_id: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

SecurityAuditSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next(new Error('Playbook Error: System audit structures are strictly append-only. Updates are rejected.'));
  }
  return next();
});

const SecurityAudit = mongoose.models.SecurityAudit || mongoose.model('SecurityAudit', SecurityAuditSchema);

module.exports = {
  SecurityAudit,
};
