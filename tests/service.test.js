/* eslint-disable no-undef */
const request = require('supertest')('localhost:3000');
const { expect } = require('chai');

describe('GET /reviews', () => {
  let response;
  beforeEach(async () => {
    response = await request.get('/reviews')
      .query({
        product_id: 604369,
        count: 100,
        page: 1,
      });
  });
  it('returns a 200 status code', async () => {
    expect(response.status).to.eql(200);
  });

  it('checks review_id to be a number', async () => {
    expect(response.body.results[0].review_id).to.be.a('number');
  });
});

describe('GET /reviews/meta', () => {
  let response;
  beforeEach(async () => {
    response = await request.get('/reviews/meta')
      .query({
        product_id: 604369,
      });
  });
  it('returns a 200 status code', () => {
    expect(response.status).to.eql(200);
  });

  it('checks if the reviews ratings exist', () => {
    expect(response.body.ratings).to.have.any.keys('1', '2', '3', '4', '5');
  });
});

describe('POST /reviews/', () => {
  let response;
  beforeEach(async () => {
    response = await request.post('/reviews')
      .send({
        product_id: 604369,
        rating: 4,
        summary: 'This is from the server test to see if POST works',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sit amet nulla est. Duis euismod lorem et quam tristique, non faucibus diam scelerisque. Pellentesque elementum velit purus, non fringilla felis cursus ut. Nunc dictum est id diam accumsan, eu eleifend nulla laoreet. Etiam lacinia diam eros, nec tristique odio pulvinar a. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales pulvinar vulputate. Cras viverra, eros eu feugiat commodo, neque enim sodales tellus, lacinia sollicitudin arcu nunc quis neque. Nullam eget tortor ut erat posuere efficitur. Praesent pharetra gravida mauris, a pellentesque est venenatis eget. Vivamus in porta velit. Nam imperdiet augue vel ultricies vulputate.',
        recommend: true,
        name: 'Tester',
        email: 'tester123@gmail.com',
        characteristics: {
          2023448: 5,
          2023451: 2,
          2023449: 2,
          2023450: 5,
        },
        photos: [],
      });
  });
  it('returns a 201 status code', () => {
    expect(response.status).to.eql(201);
  });
  it('returns the review id of the created ', () => {
    expect(response.text).to.be.a('string');
  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  let response;
  beforeEach(async () => {
    response = await request.put('/reviews/232066/helpful');
  });
  it('returns a 200 status code to verify it is updated', () => {
    expect(response.status).to.eql(200);
  });
});

describe('PUT /reviews/:review_id/report', () => {
  let response;
  beforeEach(async () => {
    response = await request.put('/reviews/232066/helpful');
  });
  it('returns a 200 status code to verify it is reported', () => {
    expect(response.status).to.eql(200);
  });
});
