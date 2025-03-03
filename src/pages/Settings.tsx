import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface WordPressSite {
  id: string;
  url: string;
  name: string;
}

function Settings() {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [wpSiteUrl, setWpSiteUrl] = useState('');
  const [wpSiteName, setWpSiteName] = useState('');
  const [wpSites, setWpSites] = useState<WordPressSite[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWordPressSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('wordpress_sites')
        .insert([
          {
            user_id: user?.id,
            url: wpSiteUrl,
            name: wpSiteName
          }
        ]);

      if (error) throw error;
      toast.success('WordPress site added successfully');
      setWpSiteUrl('');
      setWpSiteName('');
      // Refresh sites list
      loadWordPressSites();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add WordPress site');
    } finally {
      setIsLoading(false);
    }
  };

  const loadWordPressSites = async () => {
    try {
      const { data, error } = await supabase
        .from('wordpress_sites')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      setWpSites(data || []);
    } catch (error) {
      console.error('Error loading WordPress sites:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-8">
        {/* Account Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
          
          <div className="mb-6">
            <p className="text-gray-400">Email: {user?.email}</p>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                minLength={6}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="neon-button"
            >
              <span>Update Password</span>
            </button>
          </form>
        </div>

        {/* WordPress Integration */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">WordPress Integration</h2>
          
          <form onSubmit={handleAddWordPressSite} className="space-y-4 mb-8">
            <div>
              <label htmlFor="wp-name" className="block text-sm font-medium mb-2">
                Site Name
              </label>
              <input
                type="text"
                id="wp-name"
                value={wpSiteName}
                onChange={(e) => setWpSiteName(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="wp-url" className="block text-sm font-medium mb-2">
                WordPress URL
              </label>
              <input
                type="url"
                id="wp-url"
                value={wpSiteUrl}
                onChange={(e) => setWpSiteUrl(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="https://your-blog.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="neon-button"
            >
              <span>Add WordPress Site</span>
            </button>
          </form>

          <div className="space-y-4">
            {wpSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{site.name}</h3>
                  <p className="text-sm text-gray-400">{site.url}</p>
                </div>
                <button
                  onClick={() => {/* TODO: Implement remove site */}}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <div className="text-center">
          <button
            onClick={() => signOut()}
            className="text-red-400 hover:text-red-300"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;