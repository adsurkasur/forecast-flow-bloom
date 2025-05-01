
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForecastingTool from './ForecastingTool';
import LinearOptimizationTool from './LinearOptimizationTool';
import { InfoIcon } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-pale-white-green">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-pale-green mb-2">
            Forecast Flow
          </h1>
          <p className="text-muted-foreground">
            Data Forecasting & Linear Optimization Tools
          </p>
        </header>
        
        <Tabs defaultValue="forecasting" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="forecasting" className="text-base">
              <div className="flex items-center gap-2">
                SMA Forecasting
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-sm">
                    Simple Moving Average (SMA) is a forecasting method that predicts future values by averaging the most recent data points. It's great for quick, easy-to-understand predictions.
                  </HoverCardContent>
                </HoverCard>
              </div>
            </TabsTrigger>
            <TabsTrigger value="optimization" className="text-base">
              <div className="flex items-center gap-2">
                Linear Optimization
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3 text-sm">
                    Linear optimization helps find the best solution to problems with limited resources. It's useful for maximizing profit, minimizing cost, or making the most efficient use of what you have.
                  </HoverCardContent>
                </HoverCard>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecasting">
            <ForecastingTool />
          </TabsContent>
          
          <TabsContent value="optimization">
            <LinearOptimizationTool />
          </TabsContent>
        </Tabs>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 Forecast Flow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
