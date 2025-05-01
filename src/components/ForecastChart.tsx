
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ForecastChartProps {
  historicalValues: number[];
  forecast: number;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ historicalValues, forecast }) => {
  // Prepare data for the chart
  const chartData = [
    ...historicalValues.map((value, index) => ({
      period: `P${index + 1}`,
      value,
    })),
    {
      period: `P${historicalValues.length + 1}`,
      value: null, // Empty value for historical
      forecast, // Forecast value
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="period" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip 
          formatter={(value: number) => [value.toFixed(2), 'Value']}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
          }}
        />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#4A8B63" 
          strokeWidth={2}
          dot={{ r: 4, fill: '#4A8B63' }}
          activeDot={{ r: 6 }}
          name="Historical"
        />
        <Line 
          type="monotone" 
          dataKey="forecast" 
          stroke="#A7F0C1" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ r: 5, fill: '#A7F0C1', stroke: '#4A8B63' }}
          name="Forecast"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ForecastChart;
