
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
 * Calculates the Mean Absolute Error (MAE)
 * @param actualValues - Array of actual values
 * @param forecastValues - Array of forecasted values (same length as actualValues)
 * @returns The Mean Absolute Error
 */
export const calculateMAE = (actualValues: number[], forecastValues: number[]): number => {
  if (actualValues.length !== forecastValues.length) {
    throw new Error('Actual and forecast arrays must be the same length');
  }
  
  if (actualValues.length === 0) {
    return 0;
  }
  
  const sumAbsErrors = actualValues.reduce((sum, actual, index) => {
    return sum + Math.abs(actual - forecastValues[index]);
  }, 0);
  
  return sumAbsErrors / actualValues.length;
};

/**
 * Calculates the Mean Absolute Percentage Error (MAPE)
 * @param actualValues - Array of actual values
 * @param forecastValues - Array of forecasted values (same length as actualValues)
 * @returns The Mean Absolute Percentage Error
 */
export const calculateMAPE = (actualValues: number[], forecastValues: number[]): number => {
  if (actualValues.length !== forecastValues.length) {
    throw new Error('Actual and forecast arrays must be the same length');
  }
  
  const percentageErrors = actualValues.map((actual, index) => {
    if (actual === 0) return 0; // Avoid division by zero
    return Math.abs((actual - forecastValues[index]) / actual);
  });
  
  const sum = percentageErrors.reduce((acc, val) => acc + val, 0);
  return (sum / percentageErrors.length) * 100; // Return as percentage
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

/**
 * Generates one-step-ahead forecasts for historical data to evaluate accuracy
 * @param values - Array of historical values
 * @param windowSize - Size of the moving average window
 * @returns Array of forecasted values (first windowSize values will be null)
 */
export const generateHistoricalForecasts = (values: number[], windowSize: number): (number | null)[] => {
  const forecasts: (number | null)[] = Array(windowSize).fill(null);
  
  for (let i = windowSize; i < values.length; i++) {
    const windowValues = values.slice(i - windowSize, i);
    forecasts.push(calculateSMA(windowValues, windowSize));
  }
  
  return forecasts;
};
