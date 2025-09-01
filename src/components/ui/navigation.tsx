import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

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

export function Navigation({ currentStep, onStepChange }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">RA</span>
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              RoboAdvisor
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            {typeof currentStep !== "undefined" && onStepChange &&
              steps.map((step) => (
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
              ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button asChild variant="ghost">
              <Link to="/compare">Comparar</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/risk">Risco</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/docs">Docs</Link>
            </Button>
            <Button variant="outline" size="sm">
              Ajuda
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}