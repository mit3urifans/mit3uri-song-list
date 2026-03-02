module.exports = {
  trailingSlash: true,
  swcMinify: false,
  exportPathMap: function () {
    return {
      '/': {page: "/"},
      '/404': {page: "/404"},
      '/stats': {page: "/stats"}
    }
  },
  images: {
    loader: "custom"
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/:path*`
      }
    ]
  }
};
