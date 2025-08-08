const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: [
        'last 2 versions',
        '> 1%',
        'not dead',
        'not ie 11',
        'Chrome >= 90',
        'Firefox >= 88',
        'Safari >= 14',
        'Edge >= 90',
        'iOS >= 14',
        'Samsung >= 14'
      ],
      grid: 'autoplace',
      flexbox: 'no-2009',
      supports: true,
      add: true,
      remove: false
    },
  },
};

export default config;
