import express from 'express';
import Gig from '../models/Gig.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all gigs
router.get('/', async (req, res) => {
    try {
        const { search, status = 'open' } = req.query;
        let query = { status };
        if (search) {
            query.$text = { $search: search };
        }
        const gigs = await Gig.find(query).populate('ownerId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, count: gigs.length, gigs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching gigs', error: error.message });
    }
});

// Get single gig
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
        res.json({ success: true, gig });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching gig', error: error.message });
    }
});

// Create new gig
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description, budget } = req.body;
        if (!title || !description || !budget) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const gig = await Gig.create({ title, description, budget, ownerId: req.userId });
        const populatedGig = await Gig.findById(gig._id).populate('ownerId', 'name email');
        res.status(201).json({ success: true, message: 'Gig created successfully', gig: populatedGig });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating gig', error: error.message });
    }
});

export default router;
