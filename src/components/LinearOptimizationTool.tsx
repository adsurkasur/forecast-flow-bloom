
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimplexInput, SimplexResult, solveSimplex, validateSimplexInput } from '@/utils/simplexUtils';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { InfoIcon } from 'lucide-react';

const LinearOptimizationTool: React.FC = () => {
  const [numVars, setNumVars] = useState<number>(2);
  const [numConstraints, setNumConstraints] = useState<number>(2);
  const [variableNames, setVariableNames] = useState<string[]>(["x1", "x2"]);
  const [objectiveType, setObjectiveType] = useState<'max' | 'min'>('max');
  const [objectiveCoefficients, setObjectiveCoefficients] = useState<string[]>(["1", "1"]);
  const [constraints, setConstraints] = useState<Array<{
    coefficients: string[];
    operator: '<=' | '>=' | '=';
    rhs: string;
  }>>([
    { coefficients: ["1", "0"], operator: "<=", rhs: "10" },
    { coefficients: ["0", "1"], operator: "<=", rhs: "10" }
  ]);
  const [result, setResult] = useState<SimplexResult | null>(null);

  const handleNumVarsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumVars = parseInt(e.target.value, 10) || 1;
    if (newNumVars > 0 && newNumVars <= 10) {
      setNumVars(newNumVars);
      setVariableNames(Array(newNumVars).fill("").map((_, i) => `x${i+1}`));
      setObjectiveCoefficients(Array(newNumVars).fill("1"));
      
      // Reset constraints with new variable count
      setConstraints(
        Array(numConstraints).fill(null).map(() => ({
          coefficients: Array(newNumVars).fill("0"),
          operator: "<=",
          rhs: "10"
        }))
      );
      setResult(null);
    }
  };

  const handleNumConstraintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumConstraints = parseInt(e.target.value, 10) || 1;
    if (newNumConstraints > 0 && newNumConstraints <= 10) {
      setNumConstraints(newNumConstraints);
      
      // Keep existing constraints or add new ones
      if (newNumConstraints > constraints.length) {
        const newConstraints = [...constraints];
        for (let i = constraints.length; i < newNumConstraints; i++) {
          newConstraints.push({
            coefficients: Array(numVars).fill("0"),
            operator: "<=",
            rhs: "10"
          });
        }
        setConstraints(newConstraints);
      } else {
        setConstraints(constraints.slice(0, newNumConstraints));
      }
      setResult(null);
    }
  };

  const handleVariableNameChange = (index: number, value: string) => {
    const newVariableNames = [...variableNames];
    newVariableNames[index] = value || `x${index+1}`;
    setVariableNames(newVariableNames);
    setResult(null);
  };

  const handleObjectiveCoefficientChange = (index: number, value: string) => {
    const newCoefficients = [...objectiveCoefficients];
    newCoefficients[index] = value;
    setObjectiveCoefficients(newCoefficients);
    setResult(null);
  };

  const handleConstraintCoefficientChange = (
    constraintIndex: number,
    varIndex: number,
    value: string
  ) => {
    const newConstraints = [...constraints];
    newConstraints[constraintIndex].coefficients[varIndex] = value;
    setConstraints(newConstraints);
    setResult(null);
  };

  const handleConstraintOperatorChange = (constraintIndex: number, value: '<=' | '>=' | '=') => {
    const newConstraints = [...constraints];
    newConstraints[constraintIndex].operator = value;
    setConstraints(newConstraints);
    setResult(null);
  };

  const handleConstraintRhsChange = (constraintIndex: number, value: string) => {
    const newConstraints = [...constraints];
    newConstraints[constraintIndex].rhs = value;
    setConstraints(newConstraints);
    setResult(null);
  };

  const handleSolve = () => {
    // Parse all numeric inputs
    try {
      const input: SimplexInput = {
        numVars,
        variableNames,
        objectiveCoefficients: objectiveCoefficients.map(c => parseFloat(c) || 0),
        objectiveType,
        constraints: constraints.map(c => ({
          coefficients: c.coefficients.map(coeff => parseFloat(coeff) || 0),
          operator: c.operator,
          rhs: parseFloat(c.rhs) || 0
        }))
      };

      // Validate input
      const validationError = validateSimplexInput(input);
      if (validationError) {
        toast.error(validationError);
        return;
      }

      // Solve the problem
      const solution = solveSimplex(input);
      setResult(solution);
      
      if (solution.feasible) {
        toast.success("Problem solved successfully");
      } else {
        toast.error(solution.message);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="forecast-card">
        <CardHeader>
          <CardTitle className="text-dark-pale-green">Linear Optimization Tool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-bright-pale-green/10 p-4 rounded-lg text-sm border border-bright-pale-green">
            <p>Linear optimization helps find the best solution (like maximum profit or minimum cost) by adjusting variables while respecting limits. This tool makes it easy to set up and solve these problems!</p>
          </div>
          
          <Tabs defaultValue="setup" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="setup">Problem Setup</TabsTrigger>
              <TabsTrigger value="objective">Objective Function</TabsTrigger>
              <TabsTrigger value="constraints">Constraints</TabsTrigger>
            </TabsList>
            
            <TabsContent value="setup" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="num-vars">Number of Decision Variables</Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-3 text-sm">
                        Decision variables are the quantities you want to determine (e.g., how many products to make, how much to invest). Each variable represents a different choice you can make.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="num-vars"
                    type="number"
                    value={numVars}
                    onChange={handleNumVarsChange}
                    min={1}
                    max={10}
                    className="input-field mt-2"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="num-constraints">Number of Constraints</Label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80 p-3 text-sm">
                        Constraints are the limitations or requirements your solution must respect (e.g., limited resources, minimum requirements). Each constraint is a separate condition your solution must satisfy.
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  <Input
                    id="num-constraints"
                    type="number"
                    value={numConstraints}
                    onChange={handleNumConstraintsChange}
                    min={1}
                    max={10}
                    className="input-field mt-2"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Label>Variable Names</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      Give each variable a meaningful name to make it easier to understand your problem (e.g., 'chairs', 'tables', 'investment1'). By default, they're named x1, x2, etc.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                  {variableNames.map((name, index) => (
                    <div key={`var-${index}`}>
                      <Input
                        value={name}
                        onChange={(e) => handleVariableNameChange(index, e.target.value)}
                        className="input-field"
                        placeholder={`x${index+1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="objective" className="space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Label>Optimization Goal</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      Choose whether you want to maximize something good (like profit) or minimize something you want to reduce (like cost or time).
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <Select 
                  onValueChange={(value) => setObjectiveType(value as 'max' | 'min')} 
                  defaultValue={objectiveType}
                >
                  <SelectTrigger className="input-field mt-2 w-full md:w-1/3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="max">Maximize</SelectItem>
                    <SelectItem value="min">Minimize</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center space-x-2">
                  <Label>Objective Function Coefficients</Label>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      These values represent how much each variable contributes to your goal. For example, if each chair gives $10 profit, the coefficient would be 10 for the chair variable.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-2">
                  {objectiveCoefficients.map((coeff, index) => (
                    <div key={`obj-coeff-${index}`} className="flex items-center gap-2">
                      <Label className="w-12">{variableNames[index]}</Label>
                      <Input
                        value={coeff}
                        onChange={(e) => handleObjectiveCoefficientChange(index, e.target.value)}
                        className="input-field"
                        type="number"
                        step="0.1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="constraints" className="space-y-4">
              <div className="bg-bright-pale-green/10 p-4 rounded-lg text-sm border border-bright-pale-green mb-4">
                <p>Constraints represent the limitations in your problem. For example, if you can't use more than 100 hours of labor, you would create a constraint where the total labor used is ≤ 100.</p>
              </div>
              
              {constraints.map((constraint, constraintIndex) => (
                <div key={`constraint-${constraintIndex}`} className="p-4 bg-pale-green/10 rounded-lg">
                  <h3 className="font-medium mb-3">Constraint {constraintIndex + 1}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <Label>Coefficients</Label>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80 p-3 text-sm">
                            These values show how much of the resource each variable uses. For example, if each chair needs 2 hours of labor, enter 2 for the chair variable.
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {constraint.coefficients.map((coeff, varIndex) => (
                          <div key={`constraint-${constraintIndex}-var-${varIndex}`} className="flex items-center gap-2">
                            <Label className="w-12">{variableNames[varIndex]}</Label>
                            <Input
                              value={coeff}
                              onChange={(e) => handleConstraintCoefficientChange(
                                constraintIndex, 
                                varIndex, 
                                e.target.value
                              )}
                              className="input-field"
                              type="number"
                              step="0.1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Label>Operator</Label>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 p-3 text-sm">
                                ≤ means "less than or equal to" (for maximum limits)
                                <br />
                                ≥ means "greater than or equal to" (for minimum requirements)
                                <br />
                                = means "equal to exactly" (for fixed requirements)
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                          <Select 
                            onValueChange={(value) => handleConstraintOperatorChange(
                              constraintIndex, 
                              value as '<=' | '>=' | '='
                            )} 
                            defaultValue={constraint.operator}
                          >
                            <SelectTrigger className="input-field mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="<=">≤</SelectItem>
                              <SelectItem value=">=">≥</SelectItem>
                              <SelectItem value="=">=</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <Label>Value</Label>
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 p-3 text-sm">
                                The limit for this constraint. For example, if you have at most 100 hours available, enter 100.
                              </HoverCardContent>
                            </HoverCard>
                          </div>
                          <Input
                            value={constraint.rhs}
                            onChange={(e) => handleConstraintRhsChange(constraintIndex, e.target.value)}
                            className="input-field mt-2"
                            type="number"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
          
          <div className="mt-6">
            <Button 
              onClick={handleSolve} 
              className="app-button w-full"
            >
              Solve Optimization Problem
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (
        <Card className="forecast-card">
          <CardHeader>
            <CardTitle className="text-dark-pale-green">Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-bright-pale-green/20 p-6 rounded-lg border border-bright-pale-green">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium mb-2">Optimal Value</h3>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      This is the best possible value for your objective function - the maximum profit or minimum cost you can achieve while satisfying all constraints.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <p className="text-3xl font-bold text-dark-pale-green">
                  {result.optimalValue.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {objectiveType === 'max' ? 'Maximum' : 'Minimum'} objective function value
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-pale-green">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium mb-2">Variable Values</h3>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80 p-3 text-sm">
                      These are the optimal amounts for each decision variable - the values that give you the best possible result while satisfying all constraints.
                    </HoverCardContent>
                  </HoverCard>
                </div>
                <div className="space-y-2">
                  {Object.entries(result.variableValues).map(([varName, value]) => (
                    <div key={varName} className="flex justify-between items-center">
                      <span className="font-medium">{varName} =</span>
                      <span className="text-dark-pale-green">{value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {!result.feasible && (
              <div className="mt-4 p-4 bg-destructive/10 rounded-lg text-destructive">
                {result.message}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinearOptimizationTool;
