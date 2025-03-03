import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  status: 'processing' | 'generating' | 'draft' | 'published';
  created_at: string;
  youtube_url: string;
  thumbnail_url?: string;
}

function Dashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadArticles();
    }
  }, [user]);

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error loading articles:', error);
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      toast.success('Article deleted successfully');
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const getStatusColor = (status: Article['status']) => {
    switch (status) {
      case 'published':
        return 'bg-green-500/20 text-green-300';
      case 'processing':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'generating':
        return 'bg-purple-500/20 text-purple-300';
      default:
        return 'bg-blue-500/20 text-blue-300';
    }
  };

  const getStatusText = (status: Article['status']) => {
    switch (status) {
      case 'generating':
        return 'Generating content';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">Your Articles</h1>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-8 text-center text-gray-300">
            <p>No articles yet. Start by converting a YouTube video!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Video
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {article.thumbnail_url && (
                          <img 
                            src={article.thumbnail_url} 
                            alt="Video thumbnail" 
                            className="w-24 h-auto rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (target.src.includes('maxresdefault')) {
                                // Fallback to hqdefault if maxresdefault fails
                                target.src = target.src.replace('maxresdefault', 'hqdefault');
                              }
                            }}
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-400">{article.youtube_url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(article.status)}`}>
                        {getStatusText(article.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <button
                        onClick={() => navigate(`/edit/${article.id}`)}
                        className="text-blue-400 hover:text-blue-300 mr-4 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;