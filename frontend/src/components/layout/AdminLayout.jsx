import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('AdminLayout rendered - Current path:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <main className="pt-20 py-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
