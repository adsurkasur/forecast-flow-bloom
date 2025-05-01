
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForecastingTool from './ForecastingTool';
import LinearOptimizationTool from './LinearOptimizationTool';

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
              SMA Forecasting
            </TabsTrigger>
            <TabsTrigger value="optimization" className="text-base">
              Linear Optimization
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
