
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { 
  calculateSMA, 
  validateNumericInputs, 
  calculateMAE,
  calculateMAPE,
  generateHistoricalForecasts
} from '@/utils/forecastingUtils';
import ForecastChart from '@/components/ForecastChart';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from 'lucide-react';

const ForecastingTool: React.FC = () => {
  const [periods, setPeriods] = useState<number>(6);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const [forecast, setForecast] = useState<number | null>(null);
  const [mae, setMae] = useState<number | null>(null);
  const [mape, setMape] = useState<number | null>(null);
  const [chartData, setChartData] = useState<{historicalValues: number[], forecast: number}>({
    historicalValues: Array(6).fill(0),
    forecast: 0
  });

  const handlePeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPeriods = parseInt(e.target.value, 10) || 0;
    if (newPeriods > 0 && newPeriods <= 24) {
      setPeriods(newPeriods);
      setValues(Array(newPeriods).fill(''));
      setForecast(null);
      setMae(null);
      setMape(null);
    }
  };

  const handleWindowSizeChange = (value: string) => {
    const newWindowSize = parseInt(value, 10);
    setWindowSize(newWindowSize);
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
  };

  const updateForecast = (showToast: boolean = true) => {
    // Validate inputs
    if (!validateNumericInputs(values)) {
      if (showToast) {
        toast.error("Please enter valid numeric values for all growing seasons");
      }
      return;
    }

    if (periods < windowSize) {
      if (showToast) {
        toast.error(`You need at least ${windowSize} growing seasons for SMA(${windowSize})`);
      }
      return;
    }

    try {
      // Convert string values to numbers
      const numericValues = values.map(v => parseFloat(v));
      
      // Calculate forecast
      const forecastValue = calculateSMA(numericValues, windowSize);
      setForecast(parseFloat(forecastValue.toFixed(2)));
      
      // Update chart data
      setChartData({
        historicalValues: numericValues,
        forecast: parseFloat(forecastValue.toFixed(2))
      });
      
      // Calculate error metrics for historical data
      if (numericValues.length > windowSize) {
        const historicalForecasts = generateHistoricalForecasts(numericValues, windowSize);
        const actualValues = numericValues.slice(windowSize);
        const forecastValues = historicalForecasts.filter(f => f !== null) as number[];
        
        const maeValue = calculateMAE(actualValues, forecastValues);
        const mapeValue = calculateMAPE(actualValues, forecastValues);
        
        setMae(parseFloat(maeValue.toFixed(2)));
        setMape(parseFloat(mapeValue.toFixed(2)));
      } else {
        setMae(null);
        setMape(null);
      }
      
      if (showToast) {
        toast.success("Crop yield forecast calculated successfully");
      }
    } catch (error) {
      if (showToast) {
        toast.error(error instanceof Error ? error.message : "An error occurred");
      }
      setForecast(null);
      setMae(null);
      setMape(null);
    }
  };

  const handleForecast = () => {
    updateForecast(true);
  };

  return (
    <div className="space-y-6">
      <Card className="forecast-card">
        <CardHeader>
          <CardTitle className="text-dark-pale-green">SMA Forecasting Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="periods">Number of Historical Growing Seasons</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      Enter the number of past growing seasons you have yield data for (e.g., 6 seasons of corn yields, 12 quarters of vegetable production)
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Input
                  id="periods"
                  type="number"
                  value={periods}
                  onChange={handlePeriodsChange}
                  min={1}
                  max={24}
                  className="input-field"
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="window-size">SMA Window Size</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      The number of growing seasons to include in your yield average calculation. A larger window creates a smoother forecast but is less responsive to recent climate or soil condition changes. SMA(3) means averaging yields from the last 3 growing seasons.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Select onValueChange={handleWindowSizeChange} defaultValue={windowSize.toString()}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Select window size" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6].map((size) => (
                      <SelectItem key={size} value={size.toString()} disabled={size > periods}>
                        SMA({size})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleForecast} 
                  className="app-button w-full"
                >
                  Calculate Forecast
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Historical Yield Values</Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-sm">
                    Enter the crop yield values for each historical growing season. For example, bushels per acre, tons of harvest, or any other agricultural production metric you want to forecast.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: periods }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label htmlFor={`period-${index+1}`} className="w-20">Season {index+1}:</Label>
                      <Input
                        id={`period-${index+1}`}
                        type="number"
                        value={values[index]}
                        onChange={(e) => handleValueChange(index, e.target.value)}
                        className="input-field"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="forecast-card">
        <CardHeader>
          <CardTitle className="text-dark-pale-green">Forecast Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bright-pale-green/20 p-6 rounded-lg border border-bright-pale-green">
              <h3 className="text-lg font-medium mb-2">Next Season Yield Forecast</h3>
              <p className="text-3xl font-bold text-dark-pale-green">
                {forecast !== null ? forecast : '-'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on SMA({windowSize}) of the last {windowSize} growing seasons
              </p>
              
              {/* Error metrics section */}
              {mae !== null && mape !== null && (
                <div className="mt-4 pt-4 border-t border-bright-pale-green/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium">Accuracy Metrics</h4>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-3 text-sm">
                        These metrics show how accurately the SMA model would have predicted past yields. Lower numbers indicate better forecast accuracy for your specific crop and growing conditions.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">MAE</p>
                      <p className="font-medium">{mae}</p>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help inline ml-1" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-3 text-sm">
                          Mean Absolute Error: The average absolute difference between forecasted crop yields and actual yields. This shows the average amount your forecast might be off in the same units as your yield measurements.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">MAPE</p>
                      <p className="font-medium">{mape}%</p>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <InfoIcon className="h-3 w-3 text-muted-foreground cursor-help inline ml-1" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 p-3 text-sm">
                          Mean Absolute Percentage Error: The average percentage difference between forecasted crop yields and actual yields. This shows how accurate your forecast is as a percentage regardless of crop type or yield magnitude.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-[200px]">
              <ForecastChart 
                historicalValues={chartData.historicalValues} 
                forecast={chartData.forecast} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastingTool;
