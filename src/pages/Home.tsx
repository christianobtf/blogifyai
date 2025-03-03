import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-white mb-6">
          Transform YouTube Videos into Professional Blog Posts
        </h1>
        <p className="text-xl text-white mb-8">
          Use AI to automatically convert your favorite YouTube content into
          SEO-optimized blog articles ready for WordPress
        </p>
        <Link
          to="/convert"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Converting
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-blue-600/70 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-white">Quick Conversion</h3>
          <p className="text-white">
            Simply paste a YouTube URL and get a professionally written blog post in minutes
          </p>
        </div>
        <div className="bg-blue-600/70 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-white">AI-Powered</h3>
          <p className="text-white">
            Advanced AI ensures high-quality, engaging content optimized for SEO
          </p>
        </div>
        <div className="bg-blue-600/70 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-white">WordPress Ready</h3>
          <p className="text-white">
            Direct integration with WordPress for seamless publishing
          </p>
        </div>
      </div>

      <div className="bg-blue-600/70 rounded-lg shadow-md p-8 mb-16">
        <h2 className="text-3xl font-bold mb-6 text-white">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">1</div>
            <h3 className="font-semibold mb-2 text-white">Paste YouTube URL</h3>
            <p className="text-white">Enter the URL of any YouTube video</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">2</div>
            <h3 className="font-semibold mb-2 text-white">AI Processing</h3>
            <p className="text-white">Our AI transcribes and reformats the content</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">3</div>
            <h3 className="font-semibold mb-2 text-white">Customize</h3>
            <p className="text-white">Edit and refine the generated article</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-2">4</div>
            <h3 className="font-semibold mb-2 text-white">Publish</h3>
            <p className="text-white">Post directly to your WordPress blog</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;