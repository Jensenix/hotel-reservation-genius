import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullName || !formData.email || !formData.password || !formData.phoneNumber) {
      setError('All fields are required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For now, simulate registration (we'll implement actual auth later)
      const newUser = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        role: 'guest'
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);
      
      // Auto-login after successful registration
      setTimeout(() => {
        const userData = {
          id: Date.now(), // Temporary ID
          email: formData.email,
          fullName: formData.fullName,
          role: 'guest'
        };
        login(userData);
        navigate('/');
      }, 2000);

    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-light text-slate-800 mb-2 tracking-tight">
              Registration <span className="font-semibold text-emerald-600">Successful!</span>
            </h2>
            <p className="text-slate-600 mb-6">
              Your account has been created successfully. You'll be redirected to the homepage shortly.
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
          
          {/* Logo and Header */}
          <div className="text-center mb-8 relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-white font-bold text-2xl">GSH</span>
            </div>
            <h1 className="text-3xl font-light text-slate-800 mb-2 tracking-tight">
              Create <span className="font-semibold text-emerald-600">Account</span>
            </h1>
            <p className="text-slate-500 text-sm tracking-wide uppercase">Join Genius Society Hotel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Create a password (min. 6 characters)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-600">
                I agree to the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500 transition-colors">
                  Terms and Conditions
                </a>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Creating Account...
                </div>
              ) : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-emerald-500"></div>
              <span className="text-emerald-600 text-xs font-semibold tracking-widest mx-4">OR</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-emerald-500"></div>
            </div>
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
