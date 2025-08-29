import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PerformanceChart, 
  MetricsComparison, 
  AllocationChart,
  DrawdownChart 
} from "@/components/charts/financial-charts";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart,
  Activity,
  Download,
  Eye,
  EyeOff
} from "lucide-react";

interface Strategy {
  id: string;
  name: string;
  type: 'conservative' | 'moderate' | 'aggressive';
  period: string;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  isSelected: boolean;
}

const mockStrategies: Strategy[] = [
  {
    id: '1',
    name: 'Carteira Conservadora',
    type: 'conservative',
    period: '2020-2023',
    totalReturn: 42.3,
    annualizedReturn: 12.5,
    volatility: 11.2,
    sharpeRatio: 1.12,
    maxDrawdown: -8.5,
    isSelected: true
  },
  {
    id: '2', 
    name: 'Carteira Moderada',
    type: 'moderate',
    period: '2020-2023',
    totalReturn: 78.4,
    annualizedReturn: 21.1,
    volatility: 18.3,
    sharpeRatio: 1.15,
    maxDrawdown: -15.2,
    isSelected: true
  },
  {
    id: '3',
    name: 'Carteira Agressiva',
    type: 'aggressive', 
    period: '2020-2023',
    totalReturn: 124.7,
    annualizedReturn: 31.2,
    volatility: 28.5,
    sharpeRatio: 1.09,
    maxDrawdown: -28.7,
    isSelected: false
  },
  {
    id: '4',
    name: 'Benchmark IBOV',
    type: 'moderate',
    period: '2020-2023',
    totalReturn: 65.2,
    annualizedReturn: 17.8,
    volatility: 22.1,
    sharpeRatio: 0.81,
    maxDrawdown: -32.1,
    isSelected: false
  }
];

// Mock data para gráficos
const performanceData = [
  { date: '2020-01', portfolio: 0, benchmark: 0 },
  { date: '2020-06', portfolio: 8.5, benchmark: 5.2 },
  { date: '2021-01', portfolio: 15.2, benchmark: 12.1 },
  { date: '2021-06', portfolio: 28.7, benchmark: 18.9 },
  { date: '2022-01', portfolio: 35.1, benchmark: 22.4 },
  { date: '2022-06', portfolio: 18.9, benchmark: 8.7 },
  { date: '2023-01', portfolio: 42.3, benchmark: 28.1 },
  { date: '2023-12', portfolio: 78.4, benchmark: 65.2 }
];

const metricsComparisonData = [
  { metric: 'Retorno Total (%)', portfolio1: 42.3, portfolio2: 78.4, portfolio3: 124.7 },
  { metric: 'Sharpe Ratio', portfolio1: 1.12, portfolio2: 1.15, portfolio3: 1.09 },
  { metric: 'Volatilidade (%)', portfolio1: 11.2, portfolio2: 18.3, portfolio3: 28.5 },
  { metric: 'Max Drawdown (%)', portfolio1: -8.5, portfolio2: -15.2, portfolio3: -28.7 }
];

const allocationData = [
  { name: 'ITUB4', value: 25, sector: 'Financeiro' },
  { name: 'VALE3', value: 20, sector: 'Mineração' },
  { name: 'PETR4', value: 15, sector: 'Energia' },
  { name: 'WEGE3', value: 12, sector: 'Industrial' },
  { name: 'ABEV3', value: 10, sector: 'Consumo' },
  { name: 'Outros', value: 18, sector: 'Diversos' }
];

const drawdownData = [
  { date: '2020-01', drawdown: 0 },
  { date: '2020-03', drawdown: -12.1 },
  { date: '2020-06', drawdown: -5.2 },
  { date: '2020-12', drawdown: -3.1 },
  { date: '2021-06', drawdown: -8.7 },
  { date: '2022-01', drawdown: -15.2 },
  { date: '2022-06', drawdown: -22.8 },
  { date: '2023-01', drawdown: -8.4 },
  { date: '2023-12', drawdown: -2.1 }
];

export function StrategyComparison() {
  const [strategies, setStrategies] = useState(mockStrategies);

  const selectedStrategies = strategies.filter(s => s.isSelected);

  const handleStrategyToggle = (id: string) => {
    setStrategies(prev => 
      prev.map(strategy => 
        strategy.id === id 
          ? { ...strategy, isSelected: !strategy.isSelected }
          : strategy
      )
    );
  };

  const getTypeColor = (type: string) => {
    const colors = {
      conservative: 'bg-info/10 text-info border-info/20',
      moderate: 'bg-warning/10 text-warning border-warning/20', 
      aggressive: 'bg-success/10 text-success border-success/20'
    };
    return colors[type as keyof typeof colors] || colors.moderate;
  };

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-bullish' : 'text-bearish';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Comparação de Estratégias</h1>
          <p className="text-muted-foreground">
            Analise e compare performance de diferentes estratégias de investimento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar Relatório
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90">
            <BarChart3 className="w-4 h-4 mr-2" />
            Nova Comparação
          </Button>
        </div>
      </div>

      {/* Strategy Selection */}
      <Card className="bg-gradient-card border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Selecionar Estratégias para Comparação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {strategies.map((strategy) => (
              <Card 
                key={strategy.id}
                className={`cursor-pointer transition-smooth ${
                  strategy.isSelected 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleStrategyToggle(strategy.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Checkbox 
                      checked={strategy.isSelected}
                      onChange={() => handleStrategyToggle(strategy.id)}
                    />
                    <Badge className={getTypeColor(strategy.type)}>
                      {strategy.type === 'conservative' ? 'Conservador' :
                       strategy.type === 'moderate' ? 'Moderado' : 'Agressivo'}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{strategy.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{strategy.period}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Retorno Total:</span>
                      <span className={`text-sm font-medium ${getReturnColor(strategy.totalReturn)}`}>
                        {strategy.totalReturn.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sharpe:</span>
                      <span className="text-sm font-medium">
                        {strategy.sharpeRatio.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 text-sm text-muted-foreground">
            {selectedStrategies.length} estratégia(s) selecionada(s) para comparação
          </div>
        </CardContent>
      </Card>

      {/* Charts and Analysis */}
      {selectedStrategies.length > 0 && (
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
            <TabsTrigger value="allocation">Alocação</TabsTrigger>
            <TabsTrigger value="risk">Risco</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Acumulada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PerformanceChart 
                  data={performanceData} 
                  height={400}
                  showBenchmark={strategies.some(s => s.isSelected && s.name.includes('Benchmark'))}
                />
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              {selectedStrategies.slice(0, 3).map((strategy) => (
                <Card key={strategy.id} className="bg-gradient-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{strategy.name}</h4>
                      <Badge className={getTypeColor(strategy.type)}>
                        {strategy.type === 'conservative' ? 'C' :
                         strategy.type === 'moderate' ? 'M' : 'A'}
                      </Badge>
                    </div>
                    <div className={`text-2xl font-bold ${getReturnColor(strategy.totalReturn)}`}>
                      {strategy.totalReturn.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Retorno Total • {strategy.period}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Comparação de Métricas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsComparison data={metricsComparisonData} height={400} />
              </CardContent>
            </Card>

            {/* Detailed Metrics Table */}
            <Card>
              <CardHeader>
                <CardTitle>Métricas Detalhadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2">Métrica</th>
                        {selectedStrategies.map((strategy) => (
                          <th key={strategy.id} className="text-right py-3 px-2">
                            {strategy.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium">Retorno Total</td>
                        {selectedStrategies.map((strategy) => (
                          <td key={strategy.id} className={`py-2 px-2 text-right font-medium ${getReturnColor(strategy.totalReturn)}`}>
                            {strategy.totalReturn.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium">Retorno Anualizado</td>
                        {selectedStrategies.map((strategy) => (
                          <td key={strategy.id} className={`py-2 px-2 text-right font-medium ${getReturnColor(strategy.annualizedReturn)}`}>
                            {strategy.annualizedReturn.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium">Volatilidade</td>
                        {selectedStrategies.map((strategy) => (
                          <td key={strategy.id} className="py-2 px-2 text-right font-medium text-warning">
                            {strategy.volatility.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium">Sharpe Ratio</td>
                        {selectedStrategies.map((strategy) => (
                          <td key={strategy.id} className="py-2 px-2 text-right font-medium text-info">
                            {strategy.sharpeRatio.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-2 font-medium">Max Drawdown</td>
                        {selectedStrategies.map((strategy) => (
                          <td key={strategy.id} className="py-2 px-2 text-right font-medium text-bearish">
                            {strategy.maxDrawdown.toFixed(1)}%
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="allocation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Alocação de Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-4">Distribuição por Ativo</h4>
                    <AllocationChart data={allocationData} height={300} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Exposição por Setor</h4>
                    <div className="space-y-3">
                      {allocationData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.sector}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{item.value}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Análise de Drawdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DrawdownChart data={drawdownData} height={300} />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Risco</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>VaR (95%, 1 dia)</span>
                    <span className="font-medium text-bearish">-2.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected Shortfall</span>
                    <span className="font-medium text-bearish">-3.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Beta vs IBOV</span>
                    <span className="font-medium">0.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Correlação c/ Benchmark</span>
                    <span className="font-medium">0.73</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card">
                <CardHeader>
                  <CardTitle className="text-lg">Análise de Concentração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Maior Exposição Individual</span>
                    <span className="font-medium">25.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Top 3 Posições</span>
                    <span className="font-medium">60.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Herfindahl Index</span>
                    <span className="font-medium">0.185</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Diversificação</span>
                    <span className="font-medium text-success">Boa</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {selectedStrategies.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted/50 rounded-full mx-auto mb-4 flex items-center justify-center">
              <EyeOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma estratégia selecionada</h3>
            <p className="text-muted-foreground">
              Selecione pelo menos uma estratégia para começar a comparação
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}