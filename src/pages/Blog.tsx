function Blog() {
  const posts = [
    {
      id: 1,
      title: "Getting Started with React",
      excerpt: "Learn the basics of React and start building modern web applications.",
      date: "2024-02-15",
      author: "John Doe",
    },
    {
      id: 2,
      title: "Mastering TypeScript",
      excerpt: "Dive deep into TypeScript features and best practices.",
      date: "2024-02-14",
      author: "Jane Smith",
    },
    {
      id: 3,
      title: "The Power of Tailwind CSS",
      excerpt: "Discover how Tailwind CSS can streamline your styling workflow.",
      date: "2024-02-13",
      author: "Mike Johnson",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {post.title}
            </h2>
            <div className="text-sm text-gray-500 mb-4">
              <span>{post.date}</span> • <span>{post.author}</span>
            </div>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <button className="text-blue-600 hover:text-blue-800">
              Read more →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Blog;