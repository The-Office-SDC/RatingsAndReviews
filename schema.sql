-- RUN NPM RUN DATABASE TO RESEED THE DATABASE

DROP DATABASE IF EXISTS rr;
CREATE DATABASE rr;

\c rr;

CREATE TABLE reviews (
  id              serial NOT NULL PRIMARY KEY,
  product_id      integer NOT NULL,
  rating          smallint NOT NULL,
  date            text NOT NULL,
  summary         text NOT NULL,
  body            text NOT NULL,
  recommend       boolean NOT NULL DEFAULT false,
  reported        boolean NOT NULL DEFAULT false,
  reviewer_name   text NOT NULL,
  reviewer_email  text NOT NULL,
  response        text,
  helpfulness     integer NOT NULL DEFAULT 0
);

CREATE TABLE reviews_photos (
  id            serial NOT NULL PRIMARY KEY,
  review_id     integer REFERENCES reviews(id) NOT NULL,
  url           text NOT NULL DEFAULT '{}'
);

CREATE TABLE characteristics (
  id            serial PRIMARY KEY NOT NULL,
  product_id    integer REFERENCES reviews NOT NULL,
  name          text
);

CREATE TABLE characteristic_reviews (
  id                    serial PRIMARY KEY NOT NULL,
  characteristics_id    integer REFERENCES characteristics(id),
  review_id             integer REFERENCES reviews(id),
  value                 integer NOT NULL
);

-- SEED ALL TABLES WITH DATA
COPY reviews FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/reviews.csv' csv header;
COPY characteristics FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/characteristics.csv' csv header;
COPY characteristic_reviews FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/characteristic_reviews.csv' csv header;
COPY reviews_photos FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/reviews_photos.csv' csv header;

-- RE SYNC SEQUENCER
SELECT setval(pg_get_serial_sequence('characteristics', 'id'), coalesce(max(id)+1, 1), false) FROM characteristics;
SELECT setval(pg_get_serial_sequence('characteristic_reviews', 'id'), coalesce(max(id)+1, 1), false) FROM characteristic_reviews;
SELECT setval(pg_get_serial_sequence('reviews_photos', 'id'), coalesce(max(id)+1, 1), false) FROM reviews_photos;
SELECT setval(pg_get_serial_sequence('reviews', 'id'), coalesce(max(id)+1, 1), false) FROM reviews;