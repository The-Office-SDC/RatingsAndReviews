const productSchema = new Schema({
  characteristics: {
    type: Object, // {fit: 2.7, ...}
    required: true,
  },
  rating: {
    type: Number, // will be the average of all review ratings in the database
    required: true,
  },
  recommended: {
    type: Object, // {"false": 12, "true": 26}
    required: true,
  }
});

const photoSchema = new Schema({
  type: Array,
  required: false,
});

// the flatter, the better (normalization)
const reviewSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  product_id: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  recommend: {
    type: Boolean,
    required: true,
  },
  reported: {
    type: Boolean,
    required: true,
  },
  reviewer_name: {
    type: String,
    required: true,
  },
  reviewer_email: {
    type: String,
    required: true,
  },
  response: {
    type: Boolean,
    required: false,
  },
  helpfulness: {
    type: Number,
    required: true,
  },
  photos: {
    type: [photoSchema], // [url1, url2, url3]
  },
  characteristics: {
    type: Object, // {size: 2, ...}
    required: true,
  },
});