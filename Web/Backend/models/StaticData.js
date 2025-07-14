// models/StaticData.js

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  light_1: { type: Boolean, required: true, default: false },
  light_2: { type: Boolean, required: true, default: false }
}, { _id: false });

const machineSchema = new mongoose.Schema({
  name:              { type: String, required: true },
  manufacturer:      { type: String, required: true },
  model:             { type: String, required: true },
  installation_date: { type: Date,   required: true },
  location:          { type: String, required: true }
}, { _id: false });

const staticDataSchema = new mongoose.Schema({
  rooms:       { type: [roomSchema],    default: [] },
  machines:    { type: [machineSchema], default: [] },
  cartons_num: { type: Number,          required: true, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('StaticData', staticDataSchema);
