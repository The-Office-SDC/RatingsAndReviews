import http from 'k6/http';
import { sleep } from 'k6';
import { URL } from 'https://jslib.k6.io/url/1.0.0/index.js';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  vus: 100,
  duration: '30s',
};

export default function k6test() {
  const url = new URL('http://localhost:3000/reviews/meta');

  url.searchParams.append('product_id', randomIntBetween(900000, 999999));
  url.searchParams.append('count', 100);
  url.searchParams.append('page', 1);

  http.get(url.toString());
  sleep(1);
}