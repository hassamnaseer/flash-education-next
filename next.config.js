/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig


// const withCSS = require('@zeit/next-css');
const compose = require('next-compose');
cssConfig = {};
module.exports = compose([
  {
    env: {
      REACT_APP_RE_CAPTCHA_KEY: process.env.REACT_APP_RE_CAPTCHA_KEY,
    },
    webpack(config, options) {
      config.module.rules.push({
        test: /\.mp3$/,
        use: {
          loader: 'file-loader',
        }
      });
      return config;
    },
  },
]);

// module.exports = {
//   reactStrictMode: true,
//   swcMinify: true,
//   env: {
//     REACT_APP_RE_CAPTCHA_KEY: process.env.REACT_APP_RE_CAPTCHA_KEY,
//   },
// }