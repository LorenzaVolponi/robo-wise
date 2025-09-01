/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  PieChart, 
  BarChart3,
  Activity,
  DollarSign,
  Percent
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  symbol: string;
  name: string;
  weight: number;
  expectedReturn: number;
  risk: number;
  sector: string;
}

const modelPortfolios = {
  conservative: {
    name: "Conservador",
    description: "Foco na preservação de capital",
    icon: <Shield className="w-5 h-5" />,
    color: "text-info",
    assets: [
      { symbol: "ITUB4", name: "Itaú Unibanco", weight: 25, expectedReturn: 8.5, risk: 15, sector: "Financeiro" },
      { symbol: "BBDC4", name: "Bradesco", weight: 20, expectedReturn: 8.2, risk: 14, sector: "Financeiro" },
      { symbol: "VALE3", name: "Vale", weight: 15, expectedReturn: 12.0, risk: 22, sector: "Mineração" },
      { symbol: "PETR4", name: "Petrobras", weight: 15, expectedReturn: 15.0, risk: 28, sector: "Energia" },
      { symbol: "WEGE3", name: "WEG", weight: 10, expectedReturn: 14.0, risk: 20, sector: "Industrial" },
      { symbol: "RENT3", name: "Localiza", weight: 10, expectedReturn: 13.5, risk: 25, sector: "Serviços" },
      { symbol: "BPAC11", name: "BTG Pactual", weight: 5, expectedReturn: 11.0, risk: 18, sector: "Financeiro" }
    ]
  },
  moderate: {
    name: "Moderado",
    description: "Equilíbrio entre crescimento e segurança",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "text-warning",
    assets: [
      { symbol: "PETR4", name: "Petrobras", weight: 20, expectedReturn: 15.0, risk: 28, sector: "Energia" },
      { symbol: "VALE3", name: "Vale", weight: 18, expectedReturn: 12.0, risk: 22, sector: "Mineração" },
      { symbol: "ITUB4", name: "Itaú Unibanco", weight: 15, expectedReturn: 8.5, risk: 15, sector: "Financeiro" },
      { symbol: "WEGE3", name: "WEG", weight: 12, expectedReturn: 14.0, risk: 20, sector: "Industrial" },
      { symbol: "ABEV3", name: "Ambev", weight: 10, expectedReturn: 10.5, risk: 18, sector: "Consumo" },
      { symbol: "MGLU3", name: "Magazine Luiza", weight: 8, expectedReturn: 18.0, risk: 35, sector: "Varejo" },
      { symbol: "SUZB3", name: "Suzano", weight: 8, expectedReturn: 16.0, risk: 30, sector: "Papel e Celulose" },
      { symbol: "BBAS3", name: "Banco do Brasil", weight: 9, expectedReturn: 9.0, risk: 16, sector: "Financeiro" }
    ]
  },
  aggressive: {
    name: "Agressivo",
    description: "Máximo potencial de crescimento",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-success",
    assets: [
      { symbol: "MGLU3", name: "Magazine Luiza", weight: 15, expectedReturn: 18.0, risk: 35, sector: "Varejo" },
      { symbol: "PETR4", name: "Petrobras", weight: 15, expectedReturn: 15.0, risk: 28, sector: "Energia" },
      { symbol: "VALE3", name: "Vale", weight: 15, expectedReturn: 12.0, risk: 22, sector: "Mineração" },
      { symbol: "WEGE3", name: "WEG", weight: 12, expectedReturn: 14.0, risk: 20, sector: "Industrial" },
      { symbol: "SUZB3", name: "Suzano", weight: 10, expectedReturn: 16.0, risk: 30, sector: "Papel e Celulose" },
      { symbol: "HAPV3", name: "Hapvida", weight: 8, expectedReturn: 20.0, risk: 40, sector: "Saúde" },
      { symbol: "RADL3", name: "Raia Drogasil", weight: 8, expectedReturn: 13.0, risk: 25, sector: "Saúde" },
      { symbol: "RENT3", name: "Localiza", weight: 7, expectedReturn: 13.5, risk: 25, sector: "Serviços" },
      { symbol: "RAIL3", name: "Rumo", weight: 5, expectedReturn: 17.0, risk: 32, sector: "Logística" },
      { symbol: "PETZ3", name: "Petz", weight: 5, expectedReturn: 22.0, risk: 45, sector: "Varejo" }
    ]
  }
};

interface PortfolioSimulationProps {
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  onRunBacktest: (assets: Asset[]) => void;
}

export function PortfolioSimulation({ riskProfile, onRunBacktest }: PortfolioSimulationProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(riskProfile);
  const [customWeights, setCustomWeights] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const currentPortfolio = modelPortfolios[selectedPortfolio];
  const assets = currentPortfolio.assets.map(asset => ({
    ...asset,
    weight: customWeights[asset.symbol] || asset.weight
  }));

  const totalWeight = assets.reduce((sum, asset) => sum + asset.weight, 0);
  const isValidPortfolio = Math.abs(totalWeight - 100) < 0.1;

  const portfolioMetrics = {
    expectedReturn: assets.reduce((sum, asset) => sum + (asset.expectedReturn * asset.weight / 100), 0),
    risk: Math.sqrt(assets.reduce((sum, asset) => sum + Math.pow(asset.risk * asset.weight / 100, 2), 0)),
    sharpeRatio: 0
  };
  
  portfolioMetrics.sharpeRatio = portfolioMetrics.expectedReturn / portfolioMetrics.risk;

  const handleWeightChange = (symbol: string, newWeight: number[]) => {
    setCustomWeights(prev => ({
      ...prev,
      [symbol]: newWeight[0]
    }));
  };

  const handleRunBacktest = () => {
    if (!isValidPortfolio) {
      toast({
        title: "Erro na carteira",
        description: "A soma dos pesos deve ser 100%",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Backtest iniciado",
      description: "Simulando performance histórica da carteira..."
    });

    onRunBacktest(assets);
  };

  const resetWeights = () => {
    setCustomWeights({});
    toast({
      title: "Pesos resetados",
      description: "Voltou para a configuração original"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Portfolio Selection */}
      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(modelPortfolios).map(([key, portfolio]) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-smooth hover:shadow-glow ${
              selectedPortfolio === key 
                ? 'ring-2 ring-primary bg-gradient-card' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedPortfolio(key as any)}
          >
            <CardHeader className="text-center">
              <div className={`w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-2 ${portfolio.color}`}>
                {portfolio.icon}
              </div>
              <CardTitle className="text-lg">{portfolio.name}</CardTitle>
              <CardDescription>{portfolio.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="composition" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="composition">Composição</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="backtest">Backtest</TabsTrigger>
        </TabsList>

        <TabsContent value="composition" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Carteira {currentPortfolio.name}
                  </CardTitle>
                  <CardDescription>
                    Ajuste os pesos dos ativos conforme sua preferência
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {totalWeight.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${isValidPortfolio ? 'text-success' : 'text-bearish'}`}>
                    {isValidPortfolio ? 'Válida' : 'Inválida'}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assets.map((asset) => (
                  <div key={asset.symbol} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{asset.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {asset.sector}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {asset.name}
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <div className="font-medium">{asset.weight.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">
                          Ret: {asset.expectedReturn.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <Slider
                      value={[asset.weight]}
                      onValueChange={(value) => handleWeightChange(asset.symbol, value)}
                      max={50}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                  </div>
                ))}
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={resetWeights} variant="outline" className="flex-1">
                    Resetar Pesos
                  </Button>
                  <Button 
                    onClick={handleRunBacktest}
                    disabled={!isValidPortfolio}
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Rodar Backtest
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-success" />
                  <span className="font-medium">Retorno Esperado</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {portfolioMetrics.expectedReturn.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">ao ano</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5 text-warning" />
                  <span className="font-medium">Volatilidade</span>
                </div>
                <div className="text-2xl font-bold text-warning">
                  {portfolioMetrics.risk.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">desvio padrão</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-info" />
                  <span className="font-medium">Sharpe Ratio</span>
                </div>
                <div className="text-2xl font-bold text-info">
                  {portfolioMetrics.sharpeRatio.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">retorno/risco</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="backtest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simulação de Performance</CardTitle>
              <CardDescription>
                Execute um backtest para ver como sua carteira teria performado historicamente
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground mb-4">
                Configure sua carteira e execute o backtest para ver resultados detalhados
              </p>
              <Button 
                onClick={handleRunBacktest}
                disabled={!isValidPortfolio}
                size="lg"
                className="bg-gradient-primary hover:opacity-90"
              >
                <Activity className="w-4 h-4 mr-2" />
                Executar Backtest
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}