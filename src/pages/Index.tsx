import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { RiskAssessment } from "@/components/onboarding/risk-assessment";
import { PortfolioSimulation } from "@/components/portfolio/portfolio-simulation";
import { BacktestResults } from "@/components/reports/backtest-results";
import { StrategyComparison } from "@/components/comparison/strategy-comparison";
import { RiskManagement } from "@/components/risk/risk-management";
import { Documentation } from "@/pages/Documentation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Shield, BarChart3, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

const Index = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleRiskProfileComplete = (profile: RiskProfile) => {
    setRiskProfile(profile);
    setHasCompletedOnboarding(true);
    setCurrentStep(2);
  };

  const handleRunBacktest = (assets: any[]) => {
    // Simulate backtest execution
    console.log('Running backtest with assets:', assets);
    setCurrentStep(3);
  };

  const getRiskProfileInfo = (profile: RiskProfile) => {
    const profiles = {
      conservative: {
        name: "Conservador",
        description: "Foco na preservação de capital",
        icon: <Shield className="w-6 h-6" />,
        color: "text-info"
      },
      moderate: {
        name: "Moderado", 
        description: "Equilíbrio entre crescimento e segurança",
        icon: <BarChart3 className="w-6 h-6" />,
        color: "text-warning"
      },
      aggressive: {
        name: "Agressivo",
        description: "Máximo potencial de crescimento", 
        icon: <TrendingUp className="w-6 h-6" />,
        color: "text-success"
      }
    };
    return profiles[profile];
  };

  // Hero Section (when no onboarding completed)
  if (!hasCompletedOnboarding && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <Navigation currentStep={currentStep} onStepChange={setCurrentStep} />
        
        {/* Hero Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
          <div 
            className="h-[600px] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="relative container mx-auto px-4 h-full flex items-center">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="text-primary font-medium">RoboAdvisor Lite</span>
                </div>
                
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Investimentos
                  <span className="bg-gradient-primary bg-clip-text text-transparent"> Inteligentes</span>
                  <br />para seu Futuro
                </h1>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Descubra seu perfil de investidor, simule carteiras personalizadas 
                  e analise performance histórica com nossa plataforma de robo-advisor.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow transition-smooth"
                    onClick={() => setCurrentStep(1)}
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Começar Análise
                  </Button>
                  <Button size="lg" variant="outline">
                    Ver Demo
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-semibold">Análise de Risco</div>
                    <div className="text-sm text-muted-foreground">Perfil personalizado</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-semibold">Backtest</div>
                    <div className="text-sm text-muted-foreground">Performance histórica</div>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="font-semibold">Otimização</div>
                    <div className="text-sm text-muted-foreground">Carteiras inteligentes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Comece sua Jornada de Investimentos</h2>
              <p className="text-muted-foreground text-lg">
                3 passos simples para otimizar seus investimentos
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-gradient-card border-primary/10 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary-foreground">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">Análise de Perfil</h3>
                      <p className="text-muted-foreground mb-4">
                        Responda algumas perguntas para identificarmos seu perfil de risco e objetivos de investimento.
                      </p>
                      <Button 
                        onClick={() => setCurrentStep(1)}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        Iniciar Questionário
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentStep={currentStep} onStepChange={setCurrentStep} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header (when onboarding completed) */}
        {hasCompletedOnboarding && riskProfile && (
          <Card className="mb-8 bg-gradient-card border-primary/20 shadow-glow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ${getRiskProfileInfo(riskProfile).color}`}>
                  {getRiskProfileInfo(riskProfile).icon}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    Perfil: {getRiskProfileInfo(riskProfile).name}
                  </h2>
                  <p className="text-muted-foreground">
                    {getRiskProfileInfo(riskProfile).description}
                  </p>
                </div>
                <div className="ml-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setHasCompletedOnboarding(false);
                      setRiskProfile(null);
                      setCurrentStep(1);
                    }}
                  >
                    Refazer Análise
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content based on current step */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Análise de Perfil de Investidor</h1>
              <p className="text-muted-foreground text-lg">
                Vamos identificar o melhor perfil de investimento para você
              </p>
            </div>
            <RiskAssessment onComplete={handleRiskProfileComplete} />
          </div>
        )}

        {currentStep === 2 && riskProfile && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Simulação de Carteira</h1>
              <p className="text-muted-foreground text-lg">
                Configure e simule sua carteira de investimentos
              </p>
            </div>
            <PortfolioSimulation 
              riskProfile={riskProfile} 
              onRunBacktest={handleRunBacktest}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div>
            <StrategyComparison />
          </div>
        )}

        {currentStep === 5 && (
          <div>
            <RiskManagement />
          </div>
        )}

        {currentStep === 6 && (
          <div>
            <Documentation />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;