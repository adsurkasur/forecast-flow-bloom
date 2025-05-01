
import React, { useState, useEffect } from 'react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from 'lucide-react';

const ForecastingTool: React.FC = () => {
  const [periods, setPeriods] = useState<number>(6);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const [forecast, setForecast] = useState<number | null>(null);
  const [mae, setMae] = useState<number | null>(null);
  const [mape, setMape] = useState<number | null>(null);
  const [liveChart, setLiveChart] = useState<boolean>(true);

  // Effect for live updates
  useEffect(() => {
    if (liveChart) {
      try {
        updateForecast(false);
      } catch (error) {
        // Silent fail for live updates
      }
    }
  }, [values, windowSize]);

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
    updateForecast(false);
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
        toast.error("Please enter valid numeric values for all periods");
      }
      return;
    }

    if (periods < windowSize) {
      if (showToast) {
        toast.error(`You need at least ${windowSize} periods for SMA(${windowSize})`);
      }
      return;
    }

    try {
      // Convert string values to numbers
      const numericValues = values.map(v => parseFloat(v));
      
      // Calculate forecast
      const forecastValue = calculateSMA(numericValues, windowSize);
      setForecast(parseFloat(forecastValue.toFixed(2)));
      
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
        toast.success("Forecast calculated successfully");
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
                  <Label htmlFor="periods">Number of Historical Periods</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      Enter the number of past data points you have available (e.g., 6 months of sales data, 12 weeks of website traffic)
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
                      The number of periods to include in the moving average calculation. A larger window size creates a smoother forecast but is less responsive to recent changes. SMA(3) means averaging the last 3 periods.
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
                <Label>Historical Values</Label>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-sm">
                    Enter the values for each historical period. For example, monthly sales figures, website visitors, or any other numeric data you want to forecast.
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: periods }).map((_, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label htmlFor={`period-${index+1}`} className="w-20">Period {index+1}:</Label>
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
              <h3 className="text-lg font-medium mb-2">Next Period Forecast</h3>
              <p className="text-3xl font-bold text-dark-pale-green">
                {forecast !== null ? forecast : '-'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Based on SMA({windowSize}) of the last {windowSize} periods
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
                        These metrics show how accurately the SMA model would have predicted past values. Lower numbers indicate better forecast accuracy.
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
                          Mean Absolute Error: The average absolute difference between forecasted values and actual values.
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
                          Mean Absolute Percentage Error: The average percentage difference between forecasted values and actual values.
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="h-[200px]">
              <ForecastChart 
                historicalValues={values.map(v => parseFloat(v) || 0)} 
                forecast={forecast || 0} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForecastingTool;
