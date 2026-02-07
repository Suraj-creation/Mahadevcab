const mongoose = require('mongoose');

// Itinerary Stop Schema (sub-document)
const itineraryStopSchema = new mongoose.Schema({
    place: { type: String, required: true },
    duration: { type: String, required: true } // e.g., "30 min", "1 hour"
});

// Package Schema
const packageSchema = new mongoose.Schema({
    // Basic Info
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String },
    
    // Package Details
    monuments: { type: Number, default: 0 },
    fuelIncluded: { type: Boolean, default: true },
    parkingIncluded: { type: Boolean, default: true },
    tollsIncluded: { type: Boolean, default: true },
    
    // Pricing
    priceOriginal: { type: Number, required: true },
    priceDiscounted: { type: Number, required: true },
    discount: { type: String }, // e.g., "20% OFF"
    
    // Duration
    duration: { type: String }, // e.g., "Full Day", "2 Days"
    
    // Itinerary
    itinerary: [itineraryStopSchema],
    moreSpots: { type: Number, default: 0 }, // "+4 more spots"
    
    // Car Options
    carType: { type: String, enum: ['dzire', 'ertiga', 'crysta', 'all'], default: 'all' },
    
    // Image
    imageName: { type: String, required: true }, // e.g., "package-delhi-sightseeing.jpg"
    imageAlt: { type: String },
    
    // Badge/Tag
    badge: { type: String }, // e.g., "Bestseller", "Most Popular"
    badgeType: { type: String, enum: ['bestseller', 'popular', 'new', 'featured', ''], default: '' },
    
    // Display Order
    displayOrder: { type: Number, default: 0 },
    
    // Status
    isActive: { type: Boolean, default: true },
    
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
