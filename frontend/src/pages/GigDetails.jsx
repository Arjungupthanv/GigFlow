import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById, fetchBidsForGig, submitBid, clearCurrentGig, clearSuccess, clearError } from '../store/gigSlice';
import BidCard from '../components/BidCard';

const GigDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentGig, bids, loading, success, error } = useSelector((state) => state.gigs);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [bidForm, setBidForm] = useState({ message: '', price: '' });
    const [showBidForm, setShowBidForm] = useState(false);

    const isOwner = currentGig && user && currentGig.ownerId._id === user.id;
    const hasUserBid = bids.some(bid => bid.freelancerId._id === user?.id);

    useEffect(() => {
        dispatch(fetchGigById(id));
        return () => dispatch(clearCurrentGig());
    }, [dispatch, id]);

    useEffect(() => {
        if (currentGig && isOwner) {
            dispatch(fetchBidsForGig(id));
        }
    }, [dispatch, id, currentGig, isOwner]);

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(clearSuccess());
                if (success.includes('hired')) {
                    dispatch(fetchBidsForGig(id));
                    dispatch(fetchGigById(id));
                } else {
                    setShowBidForm(false);
                    setBidForm({ message: '', price: '' });
                }
            }, 2000);
        }
    }, [success, dispatch, id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        await dispatch(submitBid({ gigId: id, message: bidForm.message, price: parseFloat(bidForm.price) }));
    };

    if (loading && !currentGig) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
            </div>
        );
    }

    if (!currentGig) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-2xl font-bold text-slate-700">Gig not found</h2>
                <button onClick={() => navigate('/')} className="btn-primary mt-4">Back to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-700 font-medium mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </button>

            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">{success}</div>}
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-fade-in">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-8 animate-slide-up">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{currentGig.title}</h1>
                                <p className="text-slate-500">Posted by <span className="font-semibold text-slate-700">{currentGig.ownerId?.name}</span></p>
                            </div>
                            <span className={`badge ${currentGig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>{currentGig.status}</span>
                        </div>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-slate-700 mb-3">Description</h3>
                            <p className="text-slate-600 whitespace-pre-wrap">{currentGig.description}</p>
                        </div>
                        <div className="pt-6 border-t border-slate-200">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-slate-500">Budget</p>
                                    <p className="text-3xl font-bold text-primary-600">${currentGig.budget.toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Posted</p>
                                    <p className="font-semibold text-slate-700">{new Date(currentGig.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isOwner && isAuthenticated && currentGig.status === 'open' && !hasUserBid && (
                        <div className="card p-6 animate-slide-up">
                            {!showBidForm ? (
                                <button onClick={() => setShowBidForm(true)} className="btn-primary w-full">Submit a Bid</button>
                            ) : (
                                <form onSubmit={handleBidSubmit} className="space-y-4">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Submit Your Bid</h3>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Your Proposal</label>
                                        <textarea id="message" value={bidForm.message} onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })} required maxLength={500} rows={4} className="input-field resize-none" placeholder="Explain why you're the best fit for this project..." />
                                        <p className="text-xs text-slate-500 mt-1">{bidForm.message.length}/500 characters</p>
                                    </div>
                                    <div>
                                        <label htmlFor="price" className="block text-sm font-semibold text-slate-700 mb-2">Your Bid Amount ($)</label>
                                        <input type="number" id="price" value={bidForm.price} onChange={(e) => setBidForm({ ...bidForm, price: e.target.value })} required min="0" step="0.01" className="input-field" placeholder="500" />
                                    </div>
                                    <div className="flex gap-4">
                                        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Submitting...' : 'Submit Bid'}</button>
                                        <button type="button" onClick={() => setShowBidForm(false)} className="btn-secondary flex-1">Cancel</button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}

                    {!isOwner && hasUserBid && (
                        <div className="card p-6 bg-blue-50 border-blue-200">
                            <p className="text-blue-700 font-semibold">✓ You have already submitted a bid for this gig</p>
                        </div>
                    )}

                    {!isAuthenticated && currentGig.status === 'open' && (
                        <div className="card p-6 text-center">
                            <p className="text-slate-600 mb-4">Please login to submit a bid</p>
                            <button onClick={() => navigate('/login')} className="btn-primary">Login</button>
                        </div>
                    )}
                </div>

                {isOwner && (
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24 animate-slide-up">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">Bids ({bids.length})</h3>
                            {loading && bids.length === 0 ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
                                </div>
                            ) : bids.length > 0 ? (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    {bids.map((bid) => (
                                        <BidCard key={bid._id} bid={bid} isOwner={isOwner} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <svg className="w-16 h-16 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-slate-500">No bids yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GigDetails;
