module.exports = {
  minutesAgo(diff) {
    return new Date(new Date().getTime() - diff * 60000);
  },
};
