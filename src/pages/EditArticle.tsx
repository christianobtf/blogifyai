import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  status: 'processing' | 'generating' | 'draft' | 'published';
  youtube_url: string;
  thumbnail_url?: string;
  transcript?: string;
  video_id?: string;
}

function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (id && user) {
      loadArticle();
    }
  }, [id, user]);

  const loadArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      if (!data) {
        toast.error('Article not found');
        navigate('/dashboard');
        return;
      }

      setArticle(data);
    } catch (error) {
      console.error('Error loading article:', error);
      toast.error('Failed to load article');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!article) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('articles')
        .update({
          title: article.title,
          content: article.content,
          status: 'draft'
        })
        .eq('id', article.id);

      if (error) throw error;
      toast.success('Article saved successfully');
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error('Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!article?.transcript) {
      toast.error('No transcript available to generate content');
      return;
    }

    setGenerating(true);
    try {
      // Update status to generating
      const { error: statusError } = await supabase
        .from('articles')
        .update({
          status: 'generating'
        })
        .eq('id', article.id);
        
      if (statusError) throw statusError;
      
      setArticle(prev => prev ? {
        ...prev,
        status: 'generating'
      } : null);

      // Simulate ChatGPT API call with the French SEO prompt
      const prompt = `Tu es un journaliste professionnel spécialisé dans la rédaction d'articles de blog optimisés pour le référencement SEO en français. À partir de la transcription de cette vidéo YouTube, crée un article 100 % original avec tous les détails et long et optimisé pour une bonne position sur Google. Voici les consignes que tu dois respecter :

Structure de l'article :
Titre accrocheur : Le titre doit inclure des mots-clés importants pour le SEO.
Sous-titre : Résume l'article en une phrase claire et percutante.
Résumé : Fournis une introduction engageante en 2-3 phrases qui donne envie de lire.
Corps de l'article : Développe le sujet en plusieurs sous-sections bien structurées avec des titres et sous-titres pertinents. Intègre des informations clés de la vidéo et des éléments contextuels pour enrichir le contenu.
Conclusion : Résume les points importants et propose une réflexion ou une ouverture sur le sujet.
Optimisation SEO :
Mets en gras les mots-clés principaux pour améliorer le référencement.
Utilise des expressions naturelles mais riches en mots-clés pour maximiser la visibilité.
Ajoute cinq mots-clés séparés par des virgules à la fin de l'article.
Style et originalité :
Assure-toi que l'article est bien écrit, fluide et agréable à lire.
Reformule les idées pour produire une version totalement originale et éviter toute forme de plagiat.
Appuie-toi sur les propos de la vidéo, mais enrichis-les avec des informations contextuelles provenant d'autres sources fiables.
Transcription de la vidéo : ${article.transcript}`;

      // Simulate API delay
      setTimeout(async () => {
        // Generate mock content based on the video ID
        const mockTitle = `Comment Optimiser Votre Présence en Ligne: Stratégies Efficaces pour 2025`;
        const mockContent = `# ${mockTitle}

## Les clés du succès digital expliquées simplement

*Un guide complet pour améliorer votre visibilité sur internet et atteindre vos objectifs.*

Dans un monde où la présence digitale est devenue incontournable, **optimiser sa stratégie en ligne** n'a jamais été aussi crucial. Cette vidéo nous plonge au cœur des techniques les plus efficaces pour se démarquer sur internet en 2025. Découvrons ensemble comment transformer votre approche digitale.

## Les fondamentaux d'une présence en ligne réussie

La base d'une stratégie digitale performante repose sur plusieurs piliers essentiels. Tout d'abord, **l'authenticité** reste la valeur la plus importante pour créer une connexion durable avec votre audience. Comme l'explique la vidéo, les consommateurs sont de plus en plus sensibles à la transparence des marques.

> "L'authenticité n'est pas une option, c'est une nécessité dans l'environnement digital actuel."

### Optimisation technique: la fondation invisible

Le **référencement technique** constitue la colonne vertébrale de votre présence en ligne. La vidéo souligne l'importance de:

- Optimiser la vitesse de chargement des pages
- Structurer correctement les données
- Assurer la compatibilité mobile
- Sécuriser votre site avec HTTPS

Ces éléments techniques, bien que moins visibles, sont déterminants pour votre positionnement sur les moteurs de recherche.

### Création de contenu stratégique

Le **contenu de qualité** reste roi dans l'univers digital. La vidéo met en lumière l'importance de:

1. Identifier les intentions de recherche de votre audience
2. Créer du contenu qui répond précisément à ces besoins
3. Utiliser les bons mots-clés de manière naturelle
4. Varier les formats (texte, vidéo, infographies)

## Les nouvelles tendances à adopter en 2025

L'année 2025 apporte son lot de nouvelles opportunités dans le domaine digital. La **recherche vocale** continue sa progression fulgurante, modifiant les stratégies SEO traditionnelles. Les **expériences immersives** deviennent également incontournables pour engager efficacement les utilisateurs.

### L'intelligence artificielle au service de votre stratégie

L'**IA** n'est plus réservée aux grandes entreprises. La vidéo démontre comment les petites structures peuvent désormais:

- Personnaliser l'expérience utilisateur
- Analyser les données comportementales
- Automatiser certaines tâches marketing
- Prédire les tendances émergentes

## Conclusion: préparer l'avenir digital

Pour rester compétitif dans le paysage numérique en constante évolution, l'adaptation et l'apprentissage continu sont essentiels. La vidéo nous rappelle que les stratégies digitales efficaces combinent innovation technologique et compréhension profonde des besoins humains.

En intégrant ces conseils à votre approche, vous serez bien positionné pour tirer pleinement parti des opportunités qu'offre le monde digital en 2025 et au-delà.

*Mots-clés: stratégie digitale, optimisation SEO, présence en ligne, marketing digital, tendances 2025*`;

        // Update the article with the generated content
        const { error: updateError } = await supabase
          .from('articles')
          .update({
            content: mockContent,
            title: mockTitle,
            status: 'draft'
          })
          .eq('id', article.id);

        if (updateError) {
          console.error('Error updating article:', updateError);
          return;
        }
        
        // Update local state
        setArticle(prev => prev ? {
          ...prev,
          content: mockContent,
          title: mockTitle,
          status: 'draft'
        } : null);
        
        toast.success('Article generated successfully');
        setGenerating(false);
      }, 3000);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Article</h1>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || article.status === 'generating'}
            className="neon-button"
          >
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Video Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Video Information</h2>
          {article.thumbnail_url && (
            <img
              src={article.thumbnail_url}
              alt="Video thumbnail"
              className="w-full rounded-lg mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('maxresdefault')) {
                  // Fallback to hqdefault if maxresdefault fails
                  target.src = target.src.replace('maxresdefault', 'hqdefault');
                }
              }}
            />
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube URL
            </label>
            <input
              type="text"
              value={article.youtube_url}
              readOnly
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className={`px-3 py-2 rounded-md inline-block ${
              article.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
              article.status === 'generating' ? 'bg-purple-500/20 text-purple-300' :
              article.status === 'published' ? 'bg-green-500/20 text-green-300' :
              'bg-blue-500/20 text-blue-300'
            }`}>
              {article.status === 'generating' ? 'Generating content...' : article.status}
            </div>
          </div>
        </div>

        {/* Transcript and Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Content</h2>
          
          {article.status === 'processing' ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-300">
                Retrieving video transcript...
              </p>
            </div>
          ) : article.status === 'generating' ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-300">
                Generating article from transcript using AI...
              </p>
              <p className="text-gray-400 text-sm mt-2">
                This may take a minute or two
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle({ ...article, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {article.transcript && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Video Transcript
                    </label>
                    <button
                      onClick={handleGenerateContent}
                      disabled={generating}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {generating ? 'Generating...' : 'Generate Content from Transcript'}
                    </button>
                  </div>
                  <div className="bg-gray-700 rounded-md p-4 text-gray-300 max-h-60 overflow-y-auto">
                    {article.transcript}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Blog Content
                </label>
                <textarea
                  value={article.content || ''}
                  onChange={(e) => setArticle({ ...article, content: e.target.value })}
                  className="w-full h-96 px-4 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500"
                  placeholder={article.transcript ? "Click 'Generate Content from Transcript' to create blog content" : "Waiting for transcript..."}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditArticle;