// Due to an issue with Glitch's proxy (a 'glitch with Glitch', one might say)
// where the `x-forwarded-proto` header is set to 'https,http,http' instead of 'https'.
// This may break applications that (rightfully) assume this header contains a single protocol.
// This tiny bit of middleware fixes that header before we send it to other middleware.

// Info on the header: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-Proto
// Info on the issue: https://support.glitch.com/t/x-forwarded-proto-contains-multiple-protocols/17219

module.exports = function(app) {
  app.use((req, res, next) => {
    req.headers['x-forwarded-proto'] = req.protocol;
    next();
  });
};
