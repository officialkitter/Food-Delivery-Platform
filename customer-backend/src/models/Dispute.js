const { mongoose } = require('../config/clients');

const DisputeSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  user_id: { type: String, required: true },
  merchant_id: { type: String, required: true },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'resolved', 'closed'],
    default: 'submitted',
    required: true,
  },
  original_claim_text: { type: String, required: true, immutable: true },
  correlation_id: { type: String, required: true },
}, { timestamps: true });

const Dispute = mongoose.models.Dispute || mongoose.model('Dispute', DisputeSchema);

module.exports = {
  Dispute,
};
