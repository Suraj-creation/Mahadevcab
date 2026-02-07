const connectDB = require('../../lib/mongodb');
const Package = require('../../models/Package');

module.exports = async function handler(req, res) {
    await connectDB();

    if (req.method === 'GET') {
        try {
            const packages = await Package.find().sort({ displayOrder: 1, createdAt: -1 });
            return res.status(200).json({ success: true, packages });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
};
