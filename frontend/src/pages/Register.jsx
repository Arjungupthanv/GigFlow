import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        return () => dispatch(clearError());
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }
        if (formData.password.length < 6) {
            setValidationError('Password must be at least 6 characters');
            return;
        }
        const result = await dispatch(register({ name: formData.name, email: formData.email, password: formData.password }));
        if (result.type === 'auth/register/fulfilled') {
            navigate('/');
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="card max-w-md w-full p-8 animate-slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold gradient-text mb-2">Join GigFlow</h1>
                    <p className="text-slate-600">Create your account to get started</p>
                </div>
                {(error || validationError) && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">{error || validationError}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input-field" placeholder="John Doe" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" placeholder="••••••••" />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Creating account...' : 'Sign Up'}</button>
                </form>
                <p className="text-center text-slate-600 mt-6">
                    Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
