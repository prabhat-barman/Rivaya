import React, { useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminAPI.login(username, password);
      login(res.token);
      onLoginSuccess();
    } catch (error: any) {
      setError(error.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl tracking-wider mb-2">ADMIN LOGIN</h1>
            <p className="text-sm text-gray-600">Rivaya Jewellery</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-sm tracking-wider hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>LOGIN</span>
                </>
              )}
            </button>
          </form>

          {/* Default Credentials Notice */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded text-sm">
            <p className="text-amber-800 mb-1">Default Credentials:</p>
            <p className="text-amber-700">Username: <strong>admin</strong></p>
            <p className="text-amber-700">Password: <strong>admin123</strong></p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠️ Please change these credentials after first login
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
