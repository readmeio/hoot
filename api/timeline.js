const router = require('express').Router();
const mongoose = require('mongoose');

const Hoot = mongoose.model('Hoot');

/*
 * @oas [get] /timeline
 * summary: List hoots
 * description: Get a list of all hoots in reverse chronological order
 * tags: ['Timeline']
 * responses:
 *   '200':
 *     description: successfully retrieved all hoots
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BigHoot'
 * security:
 *   - basicAuth: []
 */

router.get('/', (req, res) => {
  Hoot.find({})
    .sort('-createdAt')
    .limit(500)
    .populate('replyto')
    .exec((err, hoots) => {
      res.json(hoots);
    });
});

/*
 * @oas [get] /timeline/{username}
 * summary: List user's hoots
 * description: Get a list of all tweets from a user
 * tags: ['Timeline']
 * parameters:
 *   - (path) username* {string} The username you want to see hoots for
 * responses:
 *   '200':
 *     description: successfully retrieved user's hoots
 *     content:
 *       application/json:
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BigHoot'
 * security:
 *   - basicAuth: []
 */

router.get('/:username', (req, res) => {
  Hoot.find({ username: req.params.username })
    .sort('-createdAt')
    .populate('replyto')
    .exec((err, hoots) => {
      res.json(hoots);
    });
});

module.exports = router;
