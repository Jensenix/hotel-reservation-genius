import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import AuthHeader from '@/components/auth/AuthHeader';
import { useLogin } from '@/hooks/auth/useLogin';

const Login = () => {
  const {
    formData,
    loading,
    error,
    handleChange,
    handleSubmit,
    fillDemoCredentials,
  } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>

          <AuthHeader
            title="Welcome"
            highlight="Back"
            subtitle="Genius Society Hotel Portal"
          />

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-600 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 bg-white shadow-sm"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label
                htmlFor="rememberMe"
                className="flex items-center cursor-pointer"
              >
                <input
                  id="rememberMe"
                  type="checkbox"
                  className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a
                href="#reset"
                className="text-sm text-amber-600 hover:text-amber-500 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials Snippet */}
          <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-4 flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Quick Demo Login
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                onClick={() => fillDemoCredentials('admin')}
                variant="outline"
                className="text-sm bg-white hover:bg-amber-50 border-amber-300 text-amber-700 py-3 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Admin</span>
                  <span className="text-xs opacity-75 text-center break-all mt-1">
                    admin@geniussocietyhotel.com
                  </span>
                </div>
              </Button>
              <Button
                onClick={() => fillDemoCredentials('user')}
                variant="outline"
                className="text-sm bg-white hover:bg-amber-50 border-amber-300 text-amber-700 py-3 transition-all duration-200"
              >
                <div className="flex flex-col items-center">
                  <span className="font-medium">Guest</span>
                  <span className="text-xs opacity-75 text-center break-all mt-1">
                    john.doe@example.com
                  </span>
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center relative">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-xs font-semibold tracking-widest mx-4">
                OR
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <p className="text-slate-600">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-amber-600 hover:text-amber-500 font-medium transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
