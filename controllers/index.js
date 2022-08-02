const pool = require('../model/db.js');

module.exports = {
  getAll: async (req, res) => {
    const { page = 1, count = 5, sort, product_id } = req.query;
    console.log(pool.options);
    const sorter = function (srt) {
      if (srt === 'helpful') {
        return 'r.helpfulness'
      } else if (srt === 'newest') {
        return 'r.date'
      } else {
        return 'r.helpfulness'
      }
    }

    // makes it so it doesn't populate data on page ZERO
    const offset = (page * count) - count;
    const results = await pool
      .query(`SELECT json_agg(objone) results FROM ( SELECT r.id review_id, r.rating, r.summary, r.recommend, NULLIF(r.response, 'null') response, r.body, to_timestamp(r.date::bigint/1000) date, r.reviewer_name, r.helpfulness, COALESCE((SELECT json_agg(rp.*) FROM reviews_photos rp WHERE rp.review_id = r.id), '[]') photos FROM reviews r WHERE r.product_id = $2 AND r.reported = FALSE GROUP BY r.id ORDER BY ${sorter(sort)} DESC LIMIT $1 OFFSET $3::integer ) AS objone
  `, [count, product_id, offset]);

    res.send(results.rows[0]);
  },
  getMeta: async (req, res) => {
    const { product_id } = req.query;
    const results = await pool.query(`
  SELECT r.product_id, ( SELECT json_object_agg(objthree, objtwo) FROM ( SELECT reviews.rating AS objthree, COUNT(*) AS objtwo FROM reviews WHERE reviews.product_id = $1 GROUP BY reviews.rating) AS objone ) ratings, ( SELECT json_object_agg(objtwo, objone) FROM ( SELECT r.recommend AS objtwo, COUNT (*) AS objone FROM reviews r WHERE r.product_id = $1 GROUP BY r.recommend ) AS objthree ) recommended, ( SELECT json_object_agg(objtwo, json_build_object('value', objthree, 'id', objfour)) FROM ( SELECT c.name AS objtwo, AVG(cr.value) AS objthree, c.id AS objfour FROM characteristic_reviews cr FULL OUTER JOIN characteristics c ON cr.characteristics_id = c.id WHERE c.product_id = $1 GROUP BY c.name, c.id ) AS objone ) characteristics FROM reviews r WHERE r.product_id = $1
  `, [product_id]);

    res.send(results.rows[0]);
  },
  postReview: async (req, res) => {
    const date = new Date();
    const { product_id, rating, summary, body, recommend, name, email, photos, characteristics
    } = req.body;
    const review_id = await pool.query(`
        INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1::integer, $2::integer, $3::text, $4, $5, $6, $7, $8) RETURNING id;
      `, [product_id, rating, +date, summary, body, recommend, name, email]);

    if (photos.length > 0) {
      photos.forEach((photo_url) => {
        pool.query(`INSERT INTO reviews_photos (review_id, url) VALUES ($1::integer, $2::text)
          `, [review_id.rows[0].id, photo_url]);
      })
    }

    if (Object.keys(characteristics).length > 0) {
      for (const char_key in characteristics) {
        pool.query(`
            INSERT INTO characteristic_reviews (characteristics_id, review_id, value) VALUES ($1::integer, $2::integer, $3::integer)
          `, [char_key, review_id.rows[0].id, characteristics[char_key]]);
      }
    }

    res.status(201).send(`${review_id.rows[0].id}`);
  },
  updateHelpful: (req, res) => {
    const { review_id } = req.params;
    pool.query(`
      UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = $1
    `, [review_id]);
    res.sendStatus(200);
  },
  updateReported: (req, res) => {
    const { review_id } = req.params;
    pool.query(`
    UPDATE reviews SET reported = TRUE WHERE id = $1
  `, [review_id]);
    res.sendStatus(200);
  },
};
