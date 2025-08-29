import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  Activity,
  Shield,
  Zap
} from "lucide-react";
import { ReportDownload } from "./report-download";

interface BacktestResult {
  id: string;
  portfolioName: string;
  startDate: string;
  endDate: string;
  totalReturn: number;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  status: 'completed' | 'running' | 'failed';
}

const mockResults: BacktestResult[] = [
  {
    id: '1',
    portfolioName: 'Carteira Moderada',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    totalReturn: 85.5,
    annualizedReturn: 21.5,
    volatility: 18.2,
    sharpeRatio: 1.18,
    sortinoRatio: 1.65,
    maxDrawdown: -15.3,
    winRate: 68.5,
    totalTrades: 47,
    status: 'completed'
  },
  {
    id: '2',
    portfolioName: 'Carteira Agressiva',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    totalReturn: 124.7,
    annualizedReturn: 31.2,
    volatility: 28.5,
    sharpeRatio: 1.09,
    sortinoRatio: 1.45,
    maxDrawdown: -28.7,
    winRate: 62.1,
    totalTrades: 58,
    status: 'completed'
  },
  {
    id: '3',
    portfolioName: 'Carteira Conservadora',
    startDate: '2021-06-01',
    endDate: '2023-12-31',
    totalReturn: 42.3,
    annualizedReturn: 15.8,
    volatility: 12.1,
    sharpeRatio: 1.31,
    sortinoRatio: 1.85,
    maxDrawdown: -8.9,
    winRate: 74.2,
    totalTrades: 31,
    status: 'completed'
  }
];

interface BacktestResultsProps {
  results?: BacktestResult[];
}

export function BacktestResults({ results = mockResults }: BacktestResultsProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'success',
      running: 'warning',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {status === 'completed' ? 'Concluído' : 
         status === 'running' ? 'Executando' : 'Falha'}
      </Badge>
    );
  };

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'text-bullish' : 'text-bearish';
  };

  const getReturnIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relatórios de Backtest</h2>
          <p className="text-muted-foreground">
            Histórico de simulações e análise de performance
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar Todos
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((result) => (
          <Card key={result.id} className="bg-gradient-card border-primary/10 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    {result.portfolioName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(result.startDate).toLocaleDateString('pt-BR')} - {new Date(result.endDate).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </div>
                <div className="text-right">
                  {getStatusBadge(result.status)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Retorno Total */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4" />
                    Retorno Total
                  </div>
                  <div className={`text-xl font-bold flex items-center gap-1 ${getReturnColor(result.totalReturn)}`}>
                    {getReturnIcon(result.totalReturn)}
                    {result.totalReturn.toFixed(1)}%
                  </div>
                </div>

                {/* Retorno Anualizado */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    Retorno Anualizado
                  </div>
                  <div className={`text-xl font-bold ${getReturnColor(result.annualizedReturn)}`}>
                    {result.annualizedReturn.toFixed(1)}%
                  </div>
                </div>

                {/* Volatilidade */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    Volatilidade
                  </div>
                  <div className="text-xl font-bold text-warning">
                    {result.volatility.toFixed(1)}%
                  </div>
                </div>

                {/* Max Drawdown */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingDown className="w-4 h-4" />
                    Max Drawdown
                  </div>
                  <div className="text-xl font-bold text-bearish">
                    {result.maxDrawdown.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Métricas Avançadas */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="w-4 h-4" />
                    Sharpe Ratio
                  </div>
                  <div className="text-lg font-semibold text-info">
                    {result.sharpeRatio.toFixed(2)}
                  </div>
                  <Progress 
                    value={Math.min(result.sharpeRatio * 50, 100)} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    Sortino Ratio
                  </div>
                  <div className="text-lg font-semibold text-success">
                    {result.sortinoRatio.toFixed(2)}
                  </div>
                  <Progress 
                    value={Math.min(result.sortinoRatio * 40, 100)} 
                    className="h-2" 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    Taxa de Acerto
                  </div>
                  <div className="text-lg font-semibold text-bullish">
                    {result.winRate.toFixed(1)}%
                  </div>
                  <Progress 
                    value={result.winRate} 
                    className="h-2" 
                  />
                </div>
              </div>

              {/* Ações */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Ver Gráficos
                </Button>
                <ReportDownload runId={result.id} />
                <Button variant="outline" size="sm">
                  <Activity className="w-4 h-4 mr-2" />
                  Análise Detalhada
                </Button>
                <div className="ml-auto">
                  <Badge variant="outline" className="text-xs">
                    {result.totalTrades} operações
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {results.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum backtest encontrado</h3>
            <p className="text-muted-foreground">
              Execute sua primeira simulação para ver os resultados aqui
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}