/* eslint-disable quotes */
const express = require('express');
const app = express();
const pool = require('../model/db.js');

const PORT = 3000 || process.env.PORT;
app.use(express.json());

app.get('/reviews', (req, res) => {
  const { page, count, sort, product_id } = req.query;

  const sorter = function(srt) {
    if(srt === 'helpful') {
      return 'r.helpfulness'
    } else if(srt === 'newest') {
      return 'r.date'
    } else {
      return 'r.helpfulness'
    }
  }

  // makes it so it doesn't populate data on page ZERO
  const offset = (page * count) - count;

  pool.query(`
  SELECT r.id review_id, r.rating, r.summary, r.recommend, r.response, r.body, r.date, r.reviewer_name, r.helpfulness, json_agg(rp) photos FROM reviews r LEFT OUTER JOIN reviews_photos rp ON rp.review_id = r.id WHERE r.product_id = $2 AND r.reported = FALSE GROUP BY r.id, rp.* ORDER BY ${sorter(sort)} DESC LIMIT $1 OFFSET $3
  `, [count, product_id, offset], (err, results) => {
    if (err) throw err;
    res.send(results.rows);
  });
})

app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;
  pool.query(`
  SELECT r.product_id, ( SELECT json_object_agg(objthree, objtwo) FROM ( SELECT reviews.rating AS objthree, COUNT(*) AS objtwo FROM reviews WHERE reviews.product_id = $1 GROUP BY reviews.rating) AS objone ) ratings, ( SELECT json_object_agg(objtwo, objone) FROM ( SELECT r.recommend AS objtwo, COUNT (*) AS objone FROM reviews r WHERE r.product_id = $1 GROUP BY r.recommend ) AS objthree ) recommended, ( SELECT json_object_agg(c.name, json_build_object('value', cr.value,'id', cr.id)) FROM characteristic_reviews cr FULL OUTER JOIN characteristics c ON cr.id = c.id WHERE c.product_id = $1 ) characteristics FROM reviews r WHERE r.product_id = $1
  `, [product_id], (err, results) => {
    res.send(results.rows[0]);
  })
})

const date = new Date();

// !FIX ARRAYS IN PHOTOS
app.post('/reviews', async (req, res) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics
} = req.body;
  const review_id = await pool.query(`
    INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reviewer_name, reviewer_email) VALUES ($1::integer, $2::integer, $3::text, $4, $5, $6, $7, $8) RETURNING id;
  `, [product_id, rating, +date, summary, body, recommend, name, email]);

  if (photos.length !== 0) {
    pool.query(`INSERT INTO reviews_photos (review_id, url) VALUES ($1::integer, $2::text)
    `, [review_id.rows[0].id, photos]);
  }

  if (Object.keys(characteristics).length > 0) {
    for (const char_key in characteristics) {
      pool.query(`
        INSERT INTO characteristic_reviews (characteristics_id, review_id, value) VALUES ($1::integer, $2::integer, $3::integer)
      `, [char_key, review_id.rows[0].id, characteristics[char_key]]);
    }
  }
  res.send('yusssss');
});

app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  pool.query(`
    UPDATE reviews
    SET helpfulness = helpfulness + 1
    WHERE id = $1
  `, [review_id]);
  res.sendStatus(200);
})
app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  pool.query(`
  UPDATE reviews
  SET reported = TRUE
  WHERE id = $1
`, [review_id]);
  res.sendStatus(200);
})

app.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});
