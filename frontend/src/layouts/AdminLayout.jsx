import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminHeader from './adminHeader/AdminHeader';
import PropTypes from 'prop-types';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    console.log('AdminLayout rendered - Current path:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        {children}
      </main>
    </div>
  );
};

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminLayout;
