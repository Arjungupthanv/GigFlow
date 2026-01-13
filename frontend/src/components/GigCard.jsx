import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
    return (
        <Link to={`/gigs/${gig._id}`} className="block group">
            <div className="card p-6 h-full hover:scale-105 transition-transform">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-600 transition-colors flex-1 pr-3">
                        {gig.title}
                    </h3>
                    <span className={`badge ${gig.status === 'open' ? 'badge-open' : 'badge-assigned'}`}>
                        {gig.status}
                    </span>
                </div>

                <p className="text-slate-600 mb-4 line-clamp-3">{gig.description}</p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-200">
                    <div>
                        <p className="text-sm text-slate-500 mb-1">Budget</p>
                        <p className="text-2xl font-bold text-purple-600">
                            ${gig.budget.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-slate-500 mb-1">Posted by</p>
                        <p className="font-semibold text-slate-700">{gig.ownerId?.name || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default GigCard;
