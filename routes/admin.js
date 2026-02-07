const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');

// Allowed admin emails (can be extended)
const ALLOWED_ADMINS = [
    'surajcreationinfinity@gmail.com',
    // Add more admin emails here
];

// Verify admin access
router.post('/verify', async (req, res) => {
    try {
        const { email, name, picture } = req.body;
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        // Check if email is in allowed list
        if (!ALLOWED_ADMINS.includes(email.toLowerCase())) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. You are not authorized as an admin.',
                isAdmin: false 
            });
        }

        // Update or create admin record
        let admin = await Admin.findOne({ email: email.toLowerCase() });
        
        if (admin) {
            admin.lastLogin = new Date();
            admin.name = name || admin.name;
            admin.picture = picture || admin.picture;
            await admin.save();
        } else {
            admin = new Admin({
                email: email.toLowerCase(),
                name,
                picture,
                lastLogin: new Date()
            });
            await admin.save();
        }

        res.json({ 
            success: true, 
            isAdmin: true, 
            admin: {
                email: admin.email,
                name: admin.name,
                picture: admin.picture
            }
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all admins (super admin only)
router.get('/list', async (req, res) => {
    try {
        const admins = await Admin.find().select('-__v');
        res.json({ success: true, admins, allowedEmails: ALLOWED_ADMINS });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
