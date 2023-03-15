import { findFrequency, findPrice, getTargetFrequencyPrice } from './utils';

describe('findPrice', () => {
  it('should return null if no price is found in the sentence', () => {
    const sentence = 'This is a sentence without any price.';
    expect(findPrice(sentence)).toBeNull();
  });

  it('should return the price as a number if found in the sentence', () => {
    const sentence = 'The price of the item is $9.99.';
    expect(findPrice(sentence)).toEqual(9.99);
  });

  it('should return the first price found in the sentence', () => {
    const sentence = 'The price of the item is $9.99, and the discount price is $7.99.';
    expect(findPrice(sentence)).toEqual(9.99);
  });

  it('should work with prices in different currencies', () => {
    const sentence = 'The price of the item is €10.99.';
    expect(findPrice(sentence)).toEqual(10.99);
  });
});

describe('findFrequency', () => {
  it('should return "Y" for values containing "year"', () => {
    const value = 'annual report';
    const result = findFrequency(value);
    expect(result).toBe('Y');
  });

  it('should return "Y" for values containing "annu"', () => {
    const value = 'annually';
    const result = findFrequency(value);
    expect(result).toBe('Y');
  });

  it('should return "M" for other values', () => {
    const value = 'monthly report';
    const result = findFrequency(value);
    expect(result).toBe('M');
  });
});

describe('getTargetFrequencyPrice', () => {
  it('should return the same price if the frequency and targetFrequency are the same', () => {
    const price = 100;
    const frequency = 'Y';
    const targetFrequency = 'Y';
    expect(getTargetFrequencyPrice(price, frequency, targetFrequency)).toEqual(price);
  });

  it('should convert yearly price to monthly price if targetFrequency is "M"', () => {
    const price = 1200;
    const frequency = 'Y';
    const targetFrequency = 'M';
    expect(getTargetFrequencyPrice(price, frequency, targetFrequency)).toEqual(100);
  });

  it('should convert monthly price to yearly price if targetFrequency is "Y"', () => {
    const price = 100;
    const frequency = 'M';
    const targetFrequency = 'Y';
    expect(getTargetFrequencyPrice(price, frequency, targetFrequency)).toEqual(1200);
  });

  it('should return the same price if targetFrequency is not "Y" or "M"', () => {
    const price = 100;
    const frequency = 'Y';
    const targetFrequency = 'W';
    // @ts-ignore
    expect(getTargetFrequencyPrice(price, frequency, targetFrequency)).toEqual(price);
  });
});