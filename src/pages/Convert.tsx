import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

function Convert() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate YouTube URL
      const videoId = extractVideoId(youtubeUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Get video thumbnail (maxresdefault for highest quality)
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      
      // Create article in database
      const { data: article, error: dbError } = await supabase
        .from('articles')
        .insert([
          {
            user_id: user?.id,
            title: 'Processing Video...',
            youtube_url: youtubeUrl,
            thumbnail_url: thumbnailUrl,
            status: 'processing',
            video_id: videoId,
          }
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      // Simulate fetching transcript and processing
      // TODO: Replace with actual YouTube API call
      setTimeout(async () => {
        const mockTranscript = `Bonjour à tous et bienvenue dans cette nouvelle vidéo sur l'optimisation de votre présence en ligne. 
Aujourd'hui, nous allons explorer les stratégies les plus efficaces pour améliorer votre visibilité sur internet en 2025.

Commençons par les fondamentaux. L'authenticité est plus importante que jamais dans l'environnement digital actuel. Les consommateurs recherchent des marques transparentes et honnêtes.

Ensuite, parlons de l'aspect technique. Votre site doit être rapide, bien structuré, compatible mobile et sécurisé avec HTTPS. Ces éléments techniques sont essentiels pour votre référencement.

Pour le contenu, concentrez-vous sur la qualité plutôt que la quantité. Identifiez les intentions de recherche de votre audience et créez du contenu qui répond précisément à ces besoins. Utilisez les bons mots-clés naturellement et variez les formats.

En 2025, nous voyons de nouvelles tendances émerger. La recherche vocale continue sa progression, ce qui modifie les stratégies SEO traditionnelles. Les expériences immersives deviennent également incontournables.

L'intelligence artificielle est maintenant accessible à tous. Même les petites entreprises peuvent l'utiliser pour personnaliser l'expérience utilisateur, analyser les données, automatiser certaines tâches et prédire les tendances.

Pour conclure, restez adaptable dans ce paysage numérique en constante évolution. Les stratégies digitales efficaces combinent innovation technologique et compréhension des besoins humains.

Merci d'avoir regardé cette vidéo. N'oubliez pas de vous abonner pour plus de conseils sur l'optimisation de votre présence en ligne.`;

        const { error: updateError } = await supabase
          .from('articles')
          .update({
            transcript: mockTranscript,
            status: 'draft'
          })
          .eq('id', article.id);

        if (updateError) {
          console.error('Error updating article:', updateError);
          return;
        }
      }, 2000);

      toast.success('Video processing started! Click Edit to view progress.');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to convert video');
    } finally {
      setLoading(false);
    }
  };

  const extractVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Convert YouTube Video to Blog Post
      </h1>
      
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="youtube-url"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              YouTube Video URL
            </label>
            <input
              type="url"
              id="youtube-url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              required
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-200">Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Writing Style
                </label>
                <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500">
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                  <option value="seo">SEO Optimized</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Blog Category
                </label>
                <select className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500">
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="lifestyle">Lifestyle</option>
                  <option value="education">Education</option>
                </select>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="neon-button w-full"
          >
            <span>{loading ? 'Converting...' : 'Convert to Blog Post'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Convert;