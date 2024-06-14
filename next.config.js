const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://127.0.0.1:5000/api/:path*'
          : '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
