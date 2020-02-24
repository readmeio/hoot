const router = require('express').Router();
const mongoose = require('mongoose');

const Hoot = mongoose.model('Hoot');

const Filter = require('bad-words');

const filter = new Filter({
  placeHolder: 'X',
});

/*
 * @oas [post] /hoot
 * summary: Create a hoot
 * description: Post a new hoot to the site
 * tags: ['Hoots']
 * requestBody:
 *   description: The hoot you want to post
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */
router.post('/', (req, res) => {
  if (!req.body.post) return res.status(400).send('MissingBody: You need to include a body');
  const tweet = new Hoot({
    post: filter.clean(req.body.post),
    replyto: req.body.replyto || undefined,
    username: req.user,
  });

  return tweet.save((err, _tweet) => {
    if (err) {
      const errors = [];
      Object.keys(err.errors).forEach(key => {
        errors.push(err.errors[key].message);
      });
      return res.status(500).send(errors[0]);
    }

    return _tweet.populate('replyto', (_err, __tweet) => {
      res.json(__tweet);
    });
  });
});

/*
 * @oas [get] /hoot/{id}
 * summary: Get a hoot
 * tags: ['Hoots']
 * description: Get a specific hoot
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 */
router.get('/:id', (req, res) => {
  if (!req.params.id) return res.status(400).send('You need to include a hoot id!');
  return Hoot.findOne({ _id: req.params.id }, (err, hoot) => {
    if (err) return res.status(404).send('Unable to locate that specified hoot id!');

    return res.json(hoot);
  });
});

/*
 * @oas [post] /hoot/{id}/favorite
 * summary: Favorite hoot
 * tags: ['Hoots']
 * description: Add a favorite to a hoot
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           favorited:
 *             type: boolean
 *             description: Boolean based on if you're adding/removing a favorite (defaults to toggle)
 *
 * parameters:
 *   - (path) id* {string} The id of the hoot you want
 * responses:
 *   '200':
 *     description: successful operation
 *     content:
 *       application/json:
 *         schema:
 *           $ref: '#/components/schemas/Hoot'
 * security:
 *   - basicAuth: []
 */
router.post('/:id/favorite', (req, res) => {
  if (!req.params.id) return res.status(400).send('You need to include a hoot id!');
  return Hoot.findOne({ _id: req.params.id }, (err, hoot) => {
    if (err) return res.status(404).send('Unable to locate that specified hoot id!');
    const previouslyLiked = hoot.favorites.includes(req.user);
    hoot.favorites = hoot.favorites.filter(favorite => favorite !== req.user);

    if (
      req.body.favorited === true ||
      req.body.favorited === 'true' ||
      (req.body.favorited === undefined && !previouslyLiked)
    ) {
      hoot.favorites.push(req.user);
    }
    return hoot.save((_err, _hoot) => {
      return res.json(_hoot);
    });
  });
});

module.exports = router;
