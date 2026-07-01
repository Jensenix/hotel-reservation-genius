import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * @returns {import('react').ContextType<typeof AuthContext>}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
