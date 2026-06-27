import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden relative w-full">
      <Header />
      <main className="flex-1 pt-16 md:pt-[120px] flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;