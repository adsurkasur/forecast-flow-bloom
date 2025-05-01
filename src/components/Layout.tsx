
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ForecastingTool from './ForecastingTool';
import LinearOptimizationTool from './LinearOptimizationTool';
import { InfoIcon, TrendingUp, Calculator, Menu } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";
import { LayoutList } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("forecasting");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="p-2">
              <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground">
                Forecast Flow
              </h2>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton tooltip="Features">
                          <LayoutList className="h-4 w-4" />
                          <span>Features</span>
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-56">
                        <DropdownMenuItem onClick={() => setActiveTab("forecasting")}>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          <span>SMA Forecasting</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveTab("optimization")}>
                          <Calculator className="mr-2 h-4 w-4" />
                          <span>Linear Optimization</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="About">
                    <InfoIcon className="h-4 w-4" />
                    <span>About</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="container mx-auto p-4">
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-dark-pale-green mb-2">
                Forecast Flow
              </h1>
              <p className="text-muted-foreground">
                Data Forecasting & Linear Optimization Tools
              </p>
            </header>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="forecasting" className="text-base">
                  <div className="flex items-center gap-2">
                    SMA Forecasting
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 max-w-[20rem] p-3 text-sm">
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
                      <HoverCardContent className="w-80 max-w-[20rem] p-3 text-sm">
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
