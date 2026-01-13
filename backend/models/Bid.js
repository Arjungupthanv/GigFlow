import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
    gigId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gig',
        required: true
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Bid message is required'],
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Bid price is required'],
        min: [0, 'Price must be a positive number']
    },
    status: {
        type: String,
        enum: ['pending', 'hired', 'rejected'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Compound index to prevent duplicate bids
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });
bidSchema.index({ status: 1 });

const Bid = mongoose.model('Bid', bidSchema);

export default Bid;
