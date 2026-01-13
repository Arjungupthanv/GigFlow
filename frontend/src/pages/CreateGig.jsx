import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createGig, clearSuccess, clearError } from '../store/gigSlice';

const CreateGig = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, success, error } = useSelector((state) => state.gigs);
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });

    useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(clearSuccess());
                navigate('/');
            }, 2000);
        }
    }, [success, navigate, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
            dispatch(clearSuccess());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createGig({ ...formData, budget: parseFloat(formData.budget) }));
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12">
            <div className="card p-8 animate-slide-up">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">Post a New Gig</h1>
                    <p className="text-slate-600">Fill in the details to create your job posting</p>
                </div>
                {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">{success} Redirecting...</div>}
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">Gig Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required maxLength={100} className="input-field" placeholder="e.g., Build a responsive landing page" />
                        <p className="text-xs text-slate-500 mt-1">{formData.title.length}/100 characters</p>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} required maxLength={1000} rows={6} className="input-field resize-none" placeholder="Describe your project requirements, deliverables, and any specific skills needed..." />
                        <p className="text-xs text-slate-500 mt-1">{formData.description.length}/1000 characters</p>
                    </div>
                    <div>
                        <label htmlFor="budget" className="block text-sm font-semibold text-slate-700 mb-2">Budget ($)</label>
                        <input type="number" id="budget" name="budget" value={formData.budget} onChange={handleChange} required min="0" step="0.01" className="input-field" placeholder="500" />
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Posting...' : 'Post Gig'}</button>
                        <button type="button" onClick={() => navigate('/')} className="btn-secondary flex-1">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGig;
