type Frequency = "Y" | "M";

/**
 * Utility function to find a price value in a sentence
 * @param {string} value 
 * @returns 
 */
export function findPrice(value: string) {
  // TODO: Implement regex that can traverse complex html/xml strings
  // Match any sequence of digits followed by a dot and more digits
  const regex = /\d+\.\d+/g;
  
  // Search for the regex pattern in the sentence
  const match = value.match(regex);

  // If there is no match, return null
  if (!match) {
    return null;
  }

  // Otherwise, return the first match as a number
  return parseFloat(match[0]);
}

/**
 * Utility function to find frequency in a string
 * @param {string} value 
 * @returns 
 */
export function findFrequency(value: string): Frequency {
  const yearlyRegex = /year|annu/i;
  
  // TODO: implement more frequencies, daily/weekly/quarterly
  if (yearlyRegex.test(value)) {
    return "Y";
  } else {
    // By default set it to Monthly
    return "M";
  }
}

/**
 * 
 * @param {number} price 
 * @param frequency 
 * @param targetFrequency 
 * @returns 
 */
export function getTargetFrequencyPrice(price: number, frequency: Frequency,  targetFrequency: Frequency) {
  if (frequency === targetFrequency) return price;
  switch (targetFrequency) {
    case "Y": return price * 12;
    case "M": return price / 12;
    default: return price;
  }
}