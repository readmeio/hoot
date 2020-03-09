const atob = require('atob');

module.exports = function(app) {
  app.use((req, res, next) => {
    // Authorization headers are used to authenticate requests from the HTTP API
    // Basic Auth is also how we log users into the documentation! See middlewares/jwt.js
    if (req.headers.authorization) {
      try {
        const b64 = req.headers.authorization.split(' ')[1];
        const [user] = atob(b64).split(':');
        req.user = user;
      } catch (e) {} // eslint-disable-line no-empty
    } else {
      // Otherwise if the user is just on the website, we just look for their username cookie
      // This is purely for demonstrative purposes!
      // We do not recommend performing actual authentication this easily!
      req.user = req.cookies.username;
    }
    res.locals.user = req.user;
    next();
  });
};
