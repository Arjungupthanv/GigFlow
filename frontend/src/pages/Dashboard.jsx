import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../store/gigSlice';
import GigCard from '../components/GigCard';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { gigs, loading } = useSelector((state) => state.gigs);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchGigs());
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchGigs(searchQuery));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold gradient-text mb-4">
                    Find Your Next Opportunity
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    Browse open gigs and submit your bids to land your next freelance project
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search gigs by title or description..."
                        className="input-field flex-1"
                    />
                    <button type="submit" className="btn-primary">
                        Search
                    </button>
                </div>
            </form>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
                </div>
            )}

            {/* Gigs Grid */}
            {!loading && gigs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigs.map((gig) => (
                        <GigCard key={gig._id} gig={gig} />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && gigs.length === 0 && (
                <div className="text-center py-12">
                    <svg className="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-bold text-slate-700 mb-2">No gigs found</h3>
                    <p className="text-slate-500">
                        {searchQuery ? 'Try adjusting your search query' : 'Be the first to post a gig!'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
