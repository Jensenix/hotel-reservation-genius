import React from 'react';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-32">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
