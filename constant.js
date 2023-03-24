const MIN = 60;
const HOUR = MIN * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

const secret_key = "d1a3b9fe4c3f9aa4b0fb5be8e08809b2";

const secret = {
  iv: Buffer.from("8e800da9971a12010e738df5fdfe0bb7", "hex"),
  key: Buffer.from(
    "dfebb958a1687ed42bf67166200e6bac5f8b050fc2f6552d0737cefe483d3f1c",
    "hex"
  ),
};
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
  secret,
};
