import { useDispatch } from 'react-redux';
import { hireBid } from '../store/gigSlice';

const BidCard = ({ bid, isOwner }) => {
    const dispatch = useDispatch();

    const handleHire = async () => {
        if (window.confirm(`Are you sure you want to hire ${bid.freelancerId?.name}?`)) {
            await dispatch(hireBid(bid._id));
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5 mb-3 border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h4 className="text-lg font-bold text-slate-800">{bid.freelancerId?.name}</h4>
                    <p className="text-sm text-slate-500">{bid.freelancerId?.email}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500">Bid Amount</p>
                    <p className="text-xl font-bold text-purple-600">${bid.price.toLocaleString()}</p>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-xs font-semibold text-slate-600 mb-1">Proposal:</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded">{bid.message}</p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <span className={`badge ${bid.status === 'pending' ? 'badge-pending' :
                        bid.status === 'hired' ? 'badge-hired' :
                            'badge-rejected'
                    }`}>
                    {bid.status.toUpperCase()}
                </span>

                {isOwner && bid.status === 'pending' && (
                    <button
                        onClick={handleHire}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all"
                    >
                        Hire Freelancer
                    </button>
                )}
            </div>

            <p className="text-xs text-slate-400 mt-2">
                Submitted {new Date(bid.createdAt).toLocaleDateString()}
            </p>
        </div>
    );
};

export default BidCard;
