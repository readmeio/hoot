const atob = require('atob');

module.exports = function(app) {
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      try {
        const b64 = req.headers.authorization.split(' ')[1];
        const [user] = atob(b64).split(':');
        req.user = user;
      } catch (e) {} // eslint-disable-line no-empty
    } else {
      req.user = req.cookies.username;
    }
    res.locals.user = req.user;
    next();
  });
};
