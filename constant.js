const MIN = 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

const secret_key = "adshfklawjebrklasdyhfkzsbdrfiweuryhsldjkfh";

const expiretime = {
  "5 minutes": 5 * MIN,
  "10 minutes": 10 * MIN,
  "1 hour": 1 * HOUR,
  "1 day": 1 * DAY,
  "1 week": 1 * WEEK,
  "1 month": 1 * MONTH,
  "1 year": 1 * YEAR,
};

module.exports = {
  expiretime,
  MONTH,
  secret_key,
};
