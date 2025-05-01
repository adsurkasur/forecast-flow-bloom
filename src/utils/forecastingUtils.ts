
/**
 * Calculates the Simple Moving Average forecast
 * @param values - Array of historical values
 * @param windowSize - Size of the moving average window
 * @returns The forecasted next value
 */
export const calculateSMA = (values: number[], windowSize: number): number => {
  if (values.length < windowSize) {
    throw new Error('Not enough data points for the selected window size');
  }
  
  // Get the last n values based on window size
  const lastNValues = values.slice(-windowSize);
  
  // Calculate the sum
  const sum = lastNValues.reduce((acc, val) => acc + val, 0);
  
  // Return the average
  return sum / windowSize;
};

/**
 * Validates if inputs are valid numbers
 * @param values - Array of values to validate
 * @returns True if all values are valid numbers
 */
export const validateNumericInputs = (values: string[]): boolean => {
  return values.every(value => {
    const num = parseFloat(value);
    return !isNaN(num) && isFinite(num) && num >= 0;
  });
};
