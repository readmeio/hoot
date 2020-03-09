const router = require('express').Router();
const fs = require('fs');

fs.readdirSync(__dirname).forEach(file => {
  // Do not attempt to require non-js files
  if (!file.match(/.js$/) || file === 'index.js') return;

  const fileName = file.split('.')[0];

  // eslint-disable-next-line import/no-dynamic-require, global-require
  router.use(`/${fileName}`, require(`${__dirname}/${file}`));
});

module.exports = router;
