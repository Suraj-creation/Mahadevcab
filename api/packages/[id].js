const connectDB = require('../../lib/mongodb');
const Package = require('../../models/Package');

module.exports = async function handler(req, res) {
    const { id } = req.query;

    await connectDB();

    if (req.method === 'GET') {
        try {
            const pkg = await Package.findById(id);
            if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
            return res.status(200).json({ success: true, package: pkg });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    if (req.method === 'PUT') {
        try {
            const pkg = await Package.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
            if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
            return res.status(200).json({ success: true, package: pkg });
        } catch (err) {
            return res.status(400).json({ success: false, error: err.message });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const pkg = await Package.findByIdAndDelete(id);
            if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
            return res.status(200).json({ success: true, message: 'Package deleted successfully' });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    if (req.method === 'PATCH') {
        try {
            const pkg = await Package.findById(id);
            if (!pkg) return res.status(404).json({ success: false, error: 'Package not found' });
            pkg.isActive = !pkg.isActive;
            await pkg.save();
            return res.status(200).json({ success: true, package: pkg });
        } catch (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
};
