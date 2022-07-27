-- RUN NPM RUN DATABASE TO RESEED THE DATABASE

DROP DATABASE IF EXISTS rr;
CREATE DATABASE rr;

\c rr;

CREATE TABLE reviews (
  id              integer NOT NULL PRIMARY KEY,
  product_id      integer NOT NULL,
  rating          smallint NOT NULL,
  date            bigint NOT NULL,
  summary         text NOT NULL,
  body            text NOT NULL,
  recommend       boolean NOT NULL,
  reported        boolean NOT NULL,
  reviewer_name   text NOT NULL,
  reviewer_email  text NOT NULL,
  response        text,
  helpfulness     integer NOT NULL
);

CREATE TABLE reviews_photos (
  id            integer NOT NULL PRIMARY KEY,
  review_id     integer REFERENCES reviews(id) NOT NULL,
  url           text NOT NULL
);

CREATE TABLE characteristics (
  id            integer PRIMARY KEY NOT NULL,
  product_id    integer REFERENCES reviews NOT NULL,
  name          text
);

CREATE TABLE characteristic_reviews (
  id                    integer PRIMARY KEY NOT NULL,
  characteristics_id    integer REFERENCES characteristics(id),
  review_id             integer REFERENCES reviews(id),
  value                 integer NOT NULL
);



COPY reviews FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/reviews.csv' csv header;
COPY characteristics FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/characteristics.csv' csv header;
COPY characteristic_reviews FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/characteristic_reviews.csv' csv header;
COPY reviews_photos FROM '/Users/gianlazaro/Desktop/RatingsAndReviews/reviews_photos.csv' csv header;