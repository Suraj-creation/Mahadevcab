const connectDB = require('../../lib/mongodb');
const Admin = require('../../models/Admin');

// Allowed admin emails
const ALLOWED_ADMINS = [
    'surajcreationinfinity@gmail.com',
];

module.exports = async function handler(req, res) {
    await connectDB();

    if (req.method === 'POST') {
        try {
            const { email, name, picture } = req.body;

            if (!email) {
                return res.status(400).json({ success: false, error: 'Email is required' });
            }

            if (!ALLOWED_ADMINS.includes(email.toLowerCase())) {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. You are not authorized as an admin.',
                    isAdmin: false
                });
            }

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

            return res.status(200).json({
                success: true,
                isAdmin: true,
                admin: {
                    email: admin.email,
                    name: admin.name,
                    picture: admin.picture
                }
            });

        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
};
