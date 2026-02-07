const express = require('express');
const router = express.Router();
const Package = require('../models/Package');

// Get all active packages (public)
router.get('/', async (req, res) => {
    try {
        const packages = await Package.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
        res.json({ success: true, packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all packages (admin)
router.get('/all', async (req, res) => {
    try {
        const packages = await Package.find().sort({ displayOrder: 1, createdAt: -1 });
        res.json({ success: true, packages });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single package
router.get('/:id', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
        res.json({ success: true, package: pkg });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create package (admin)
router.post('/', async (req, res) => {
    try {
        const pkg = new Package(req.body);
        const saved = await pkg.save();
        res.status(201).json({ success: true, package: saved });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Update package (admin)
router.put('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
        res.json({ success: true, package: pkg });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// Delete package (admin)
router.delete('/:id', async (req, res) => {
    try {
        const pkg = await Package.findByIdAndDelete(req.params.id);
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
        res.json({ success: true, message: 'Package deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Toggle package active status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
        pkg.isActive = !pkg.isActive;
        await pkg.save();
        res.json({ success: true, package: pkg });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
