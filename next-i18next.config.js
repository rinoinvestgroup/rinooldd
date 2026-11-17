module.exports = {
  i18n: {
    locales: ['en', 'ar', 'es', 'zh', 'de', 'hi', 'ur', 'fa'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  fallbackLng: {
    default: ['en'],
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  
  /**
   * To turn on console.log for debugging
   */
  // debug: true,
}
