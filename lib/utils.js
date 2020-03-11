module.exports = {
  minutesAgo(diff) {
    return new Date(new Date().getTime() - diff * 60000);
  },

  getPort() {
    // Listen on specified port
    return process.env.PORT || 4007;
  },

  getBaseUrl() {
    // CUSTOM_DOMAIN should include protocol and omit trailing slash
    if (process.env.CUSTOM_DOMAIN) return process.env.CUSTOM_DOMAIN;
    // Used for Glitch! See: https://glitch.com/help/project/
    else if (process.env.PROJECT_DOMAIN) return `https://${process.env.PROJECT_DOMAIN}.glitch.me`;
    return `http://localhost:${this.getPort()}`;
  },
};
