const isDev = process.env.NODE_ENV === 'development';

const exportConfig = isDev ? {} : {
  output: 'export',
  exportPathMap: function () {
    const fs = require('fs');
    const path = require('path');
    const musicList = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'public', 'music_list.json'), 'utf-8')
    );
    const paths = {
      '/': { page: "/" },
      '/404': { page: "/404" },
      '/stats': { page: "/stats" }
    };
    musicList.forEach(song => {
      paths[`/song/${song.index}`] = { page: '/song/[id]', query: { id: String(song.index) } };
    });
    return paths;
  },
};

module.exports = {
  ...exportConfig,
  trailingSlash: true,
  swcMinify: false,
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
