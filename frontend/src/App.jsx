import { useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './hooks/auth/useAuth';
import MainLayout from '@/layouts/MainLayout';
import Loading from '@/components/ui/Loading';

import { routesConfig } from '@/routes';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function AppRoutes() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Suspense fallback={<Loading fullScreen title="Loading page..." />}>
      <Routes>
        {routesConfig.map((route) => {
          const Component = route.component;

          let renderedElement = <Component />;

          if (route.layout) {
            renderedElement = <MainLayout>{renderedElement}</MainLayout>;
          }

          const missingProtectedAuth = route.type === 'protected' && !isAuthenticated;
          const missingAdminAuth = route.type === 'admin' && (!isAuthenticated || !isAdmin);

          if (missingProtectedAuth || missingAdminAuth) {
            renderedElement = <Navigate to="/login" replace />;
          }

          return (
            <Route
              key={route.path}
              path={route.path}
              element={renderedElement}
            />
          );
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;