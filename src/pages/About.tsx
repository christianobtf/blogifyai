function About() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">About Blogify</h1>
      
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="text-gray-600 mb-6">
          Blogify was created with a simple mission: to provide a beautiful, 
          easy-to-use platform for writers and content creators to share their 
          stories with the world. We believe in the power of words and their 
          ability to connect, inspire, and transform.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 mb-6">
          We strive to create a community where ideas flourish and voices are 
          heard. Our platform is designed to make blogging accessible to everyone, 
          whether you're a seasoned writer or just starting your journey.
        </p>
        
        <h2 className="text-2xl font-semibold mb-4">Join Us</h2>
        <p className="text-gray-600">
          Whether you're here to share your expertise, document your journey, or 
          connect with like-minded individuals, Blogify is your platform. Start 
          your blogging journey with us today.
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          Have questions or suggestions? We'd love to hear from you!
        </p>
        <a 
          href="mailto:contact@blogify.com"
          className="text-blue-600 hover:text-blue-800"
        >
          contact@blogify.com
        </a>
      </div>
    </div>
  );
}

export default About;