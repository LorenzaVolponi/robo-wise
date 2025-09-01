import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { memo, useMemo } from "react";

interface NavigationProps {
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

const steps = [
  { id: 1, label: "Onboarding", description: "Perfil de risco" },
  { id: 2, label: "Simulação", description: "Carteira modelo" },
  { id: 3, label: "Relatórios", description: "Análise de resultados" },
  { id: 4, label: "Comparação", description: "Estratégias" },
  { id: 5, label: "Risco", description: "Gestão avançada" }
];

export const Navigation = memo(function Navigation({
  currentStep,
  onStepChange,
}: NavigationProps) {
  const stepButtons = useMemo(() => {
    if (typeof currentStep === "undefined" || !onStepChange) return null;
    return steps.map((step) => (
      <Button
        key={step.id}
        variant={currentStep === step.id ? "default" : "ghost"}
        onClick={() => onStepChange(step.id)}
        className={cn(
          "flex flex-col items-center h-auto py-2 px-4 transition-smooth",
          currentStep === step.id &&
            "bg-gradient-primary text-primary-foreground shadow-glow"
        )}
      >
        <span className="font-medium text-xs">{step.label}</span>
        <span className="text-xs opacity-80">{step.description}</span>
      </Button>
    ));
  }, [currentStep, onStepChange]);

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RA</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              RoboAdvisor
            </span>
          </NavLink>

          <div className="hidden md:flex items-center space-x-1">{stepButtons}</div>

          <div className="flex items-center space-x-2">
            <NavLink to="/compare">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"}>
                  Comparar
                </Button>
              )}
            </NavLink>
            <NavLink to="/risk">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"}>Risco</Button>
              )}
            </NavLink>
            <NavLink to="/docs">
              {({ isActive }) => (
                <Button variant={isActive ? "default" : "ghost"}>Docs</Button>
              )}
            </NavLink>
            <Button variant="outline" size="sm">
              Ajuda
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = "Navigation";
