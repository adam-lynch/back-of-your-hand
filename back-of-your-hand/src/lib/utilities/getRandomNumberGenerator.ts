// @ts-nocheck
/* eslint-disable */
// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript

const xmur3 = (str) => {
  for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
    (h = Math.imul(h ^ str.charCodeAt(i), 3432918353)),
      (h = (h << 13) | (h >>> 19));
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
};

const sfc32 = (a, b, c, d): (() => number) => {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    var t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export default (input: string): (() => number) => {
  // Create xmur3 state:
  const seed = xmur3(input);
  // Output four 32-bit hashes to provide the seed for sfc32.
  return sfc32(seed(), seed(), seed(), seed());
};
