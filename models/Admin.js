const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    picture: { type: String },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
