import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth/useAuth';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

/**
 * @returns {{
 *   formData: Object,
 *   loading: boolean,
 *   error: string,
 *   handleChange: Function,
 *   handleSubmit: Function,
 *   fillDemoCredentials: Function
 * }}
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const fillDemoCredentials = (role) => {
    const demoCredentials = {
      admin: { email: 'admin@geniussocietyhotel.com', password: 'admin123' },
      user: { email: 'john.doe@example.com', password: 'password123' }, // eslint-disable-line
    };
    setFormData(demoCredentials[role]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiService.auth.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        const userData = response.data.data;
        login(userData);
        navigate(userData.role === 'admin' ? '/admin' : '/');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      logger.error('Login error:', err);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    fillDemoCredentials,
  };
};
