const mongoose = require('mongoose');

const chatbotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  assistantId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  model: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: false
  },
  instructions: {
    type: String,
    required: false
  }
});

const Chatbot = mongoose.model('Chatbot', chatbotSchema);

module.exports = Chatbot;