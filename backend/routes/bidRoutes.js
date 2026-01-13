import express from 'express';
import Bid from '../models/Bid.js';
import Gig from '../models/Gig.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Submit a bid
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { gigId, message, price } = req.body;
        if (!gigId || !message || !price) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }
        const gig = await Gig.findById(gigId);
        if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
        if (gig.status !== 'open') return res.status(400).json({ success: false, message: 'This gig is no longer accepting bids' });
        if (gig.ownerId.toString() === req.userId) {
            return res.status(400).json({ success: false, message: 'You cannot bid on your own gig' });
        }
        const bid = await Bid.create({ gigId, freelancerId: req.userId, message, price });
        const populatedBid = await Bid.findById(bid._id).populate('freelancerId', 'name email').populate('gigId', 'title');
        res.status(201).json({ success: true, message: 'Bid submitted successfully', bid: populatedBid });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already submitted a bid for this gig' });
        }
        res.status(500).json({ success: false, message: 'Error submitting bid', error: error.message });
    }
});

// Get all bids for a gig
router.get('/:gigId', authMiddleware, async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.gigId);
        if (!gig) return res.status(404).json({ success: false, message: 'Gig not found' });
        if (gig.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to view bids for this gig' });
        }
        const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email').sort({ createdAt: -1 });
        res.json({ success: true, count: bids.length, bids });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching bids', error: error.message });
    }
});

// Hire a freelancer (simplified without transactions)
router.patch('/:bidId/hire', authMiddleware, async (req, res) => {
    try {
        const bid = await Bid.findById(req.params.bidId).populate('gigId');
        if (!bid) {
            return res.status(404).json({ success: false, message: 'Bid not found' });
        }

        const gig = bid.gigId;
        if (gig.ownerId.toString() !== req.userId) {
            return res.status(403).json({ success: false, message: 'You are not authorized to hire for this gig' });
        }

        if (gig.status !== 'open') {
            return res.status(400).json({ success: false, message: 'This gig has already been assigned' });
        }

        // Update gig status
        await Gig.findByIdAndUpdate(gig._id, { status: 'assigned' });

        // Update hired bid
        await Bid.findByIdAndUpdate(req.params.bidId, { status: 'hired' });

        // Reject other pending bids
        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: req.params.bidId }, status: 'pending' },
            { status: 'rejected' }
        );

        // Get updated bid
        const updatedBid = await Bid.findById(req.params.bidId)
            .populate('freelancerId', 'name email')
            .populate('gigId', 'title status');

        res.json({ success: true, message: 'Freelancer hired successfully', bid: updatedBid });
    } catch (error) {
        console.error('Hire error:', error);
        res.status(500).json({ success: false, message: 'Error hiring freelancer', error: error.message });
    }
});

export default router;
