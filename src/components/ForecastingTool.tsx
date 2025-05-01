
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { calculateSMA, validateNumericInputs } from '@/utils/forecastingUtils';
import ForecastChart from '@/components/ForecastChart';

const ForecastingTool: React.FC = () => {
  const [periods, setPeriods] = useState<number>(6);
  const [windowSize, setWindowSize] = useState<number>(3);
  const [values, setValues] = useState<string[]>(Array(6).fill(''));
  const [forecast, setForecast] = useState<number | null>(null);
  const [showChart, setShowChart] = useState<boolean>(false);

  const handlePeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPeriods = parseInt(e.target.value, 10) || 0;
    if (newPeriods > 0 && newPeriods <= 24) {
      setPeriods(newPeriods);
      setValues(Array(newPeriods).fill(''));
      setForecast(null);
      setShowChart(false);
    }
  };

  const handleWindowSizeChange = (value: string) => {
    const newWindowSize = parseInt(value, 10);
    setWindowSize(newWindowSize);
    setForecast(null);
    setShowChart(false);
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    setForecast(null);
    setShowChart(false);
  };

  const handleForecast = () => {
    // Validate inputs
    if (!validateNumericInputs(values)) {
      toast.error("Please enter valid numeric values for all periods");
      return;
    }

    if (periods < windowSize) {
      toast.error(`You need at least ${windowSize} periods for SMA(${windowSize})`);
      return;
    }

    try {
      // Convert string values to numbers
      const numericValues = values.map(v => parseFloat(v));
      
      // Calculate forecast
      const forecastValue = calculateSMA(numericValues, windowSize);
      setForecast(parseFloat(forecastValue.toFixed(2)));
      setShowChart(true);
      
      toast.success("Forecast calculated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
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
                <Label htmlFor="periods">Number of Historical Periods</Label>
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
                <Label htmlFor="window-size">SMA Window Size</Label>
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
              <Label>Historical Values</Label>
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
      
      {forecast !== null && (
        <Card className="forecast-card">
          <CardHeader>
            <CardTitle className="text-dark-pale-green">Forecast Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bright-pale-green/20 p-6 rounded-lg border border-bright-pale-green">
                <h3 className="text-lg font-medium mb-2">Next Period Forecast</h3>
                <p className="text-3xl font-bold text-dark-pale-green">{forecast}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Based on SMA({windowSize}) of the last {windowSize} periods
                </p>
              </div>
              
              {showChart && (
                <div className="h-[200px]">
                  <ForecastChart 
                    historicalValues={values.map(v => parseFloat(v))} 
                    forecast={forecast} 
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ForecastingTool;
