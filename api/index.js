const router = require('express').Router();

router.use('/hoot', require('./hoot'));
router.use('/timeline', require('./timeline'));

module.exports = router;
