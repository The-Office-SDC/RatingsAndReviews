/* eslint-disable quotes */
const express = require('express');
const app = express();
const pool = require('../model/db.js');

const PORT = 3000 || process.env.PORT;
app.use(express.json());

app.get('/reviews', (req, res) => {
  const { page, count, sort, product_id } = req.query;

  pool.query(`SELECT json_build_object('product', $1::integer, 'page', $2::integer, 'count', $3::integer, 'results', json_agg(json_build_object('review_id', r.id, 'rating', r.rating, 'summary', r.summary, 'recommend', r.recommend, 'response', r.response, 'body', r.body, 'date', to_timestamp(r.date/1000), 'reviewer_name', r.reviewer_name, 'helpfulness', r.helpfulness, 'photos', json_build_array(rp)))) FROM reviews r INNER JOIN reviews_photos rp ON rp.review_id = r.id WHERE product_id = $1`, [product_id, page, count], (err, results) => {
    if (err) throw err;
    res.send(results.rows[0]);
  });
})
app.get('/reviews/meta', (req, res) => {
  const { product_id } = req.query;
  res.send(product_id)
})
app.post('/reviews', (req, res) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
  res.send(product_id);
})
app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  res.send(review_id)
})
app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  res.send(review_id)
})

app.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`)
});
