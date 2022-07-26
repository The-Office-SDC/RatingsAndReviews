/* eslint-disable quotes */
const express = require('express');
const app = express();
require('dotenv').config();
const {
  getAll,
  getMeta,
  postReview,
  updateHelpful,
  updateReported,
} = require('../controllers/index.js');

const PORT = 3000 || process.env.PORT;
app.use(express.json());
app.use(express.static('./static'));

app.get('/test', (req, res) => {
  res.send('this is a test route');
});

app.get('/', (req, res) => {
  res.send()
});
app.get('/reviews', getAll);
app.get('/reviews/meta', getMeta);
app.post('/reviews', postReview);
app.put('/reviews/:review_id/helpful', updateHelpful);
app.put('/reviews/:review_id/report', updateReported);

app.listen(PORT, () => {
  console.log(`server listening on PORT: ${PORT}`);
});
