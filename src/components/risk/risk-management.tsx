import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown, 
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RiskControl {
  id: string;
  name: string;
  description: string;
  value: number;
  maxValue: number;
  unit: string;
  isActive: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  violationStatus: 'ok' | 'warning' | 'violation';
}

interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  assets: Array<{
    symbol: string;
    name: string;
    allocation: number;
    value: number;
    riskScore: number;
  }>;
}

const mockPortfolio: Portfolio = {
  id: '1',
  name: 'Carteira Moderada',
  totalValue: 100000,
  assets: [
    { symbol: 'ITUB4', name: 'Itaú Unibanco', allocation: 25, value: 25000, riskScore: 3 },
    { symbol: 'VALE3', name: 'Vale', allocation: 22, value: 22000, riskScore: 7 },
    { symbol: 'PETR4', name: 'Petrobras', allocation: 18, value: 18000, riskScore: 8 },
    { symbol: 'WEGE3', name: 'WEG', allocation: 15, value: 15000, riskScore: 4 },
    { symbol: 'BBDC4', name: 'Bradesco', allocation: 10, value: 10000, riskScore: 3 },
    { symbol: 'ABEV3', name: 'Ambev', allocation: 10, value: 10000, riskScore: 2 }
  ]
};

export function RiskManagement() {
  const [portfolio] = useState(mockPortfolio);
  const [autoRebalance, setAutoRebalance] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const { toast } = useToast();

  const [riskControls, setRiskControls] = useState<RiskControl[]>([
    {
      id: 'max_exposure',
      name: 'Exposição Máxima por Ativo',
      description: 'Limite máximo de concentração em um único ativo',
      value: 25,
      maxValue: 50,
      unit: '%',
      isActive: true,
      riskLevel: 'medium',
      violationStatus: 'ok'
    },
    {
      id: 'max_drawdown',
      name: 'Drawdown Máximo',
      description: 'Perda máxima tolerável antes de alerta',
      value: 15,
      maxValue: 30,
      unit: '%',
      isActive: true,
      riskLevel: 'high',
      violationStatus: 'warning'
    },
    {
      id: 'min_diversification',
      name: 'Diversificação Mínima',
      description: 'Número mínimo de ativos na carteira',
      value: 5,
      maxValue: 20,
      unit: 'ativos',
      isActive: true,
      riskLevel: 'low',
      violationStatus: 'ok'
    },
    {
      id: 'max_sector_exposure',
      name: 'Exposição Máxima por Setor',
      description: 'Limite de concentração por setor',
      value: 40,
      maxValue: 60,
      unit: '%',
      isActive: true,
      riskLevel: 'medium',
      violationStatus: 'violation'
    },
    {
      id: 'volatility_limit',
      name: 'Limite de Volatilidade',
      description: 'Volatilidade máxima da carteira',
      value: 20,
      maxValue: 40,
      unit: '%',
      isActive: false,
      riskLevel: 'high',
      violationStatus: 'ok'
    }
  ]);

  const handleControlChange = (id: string, field: string, value: any) => {
    setRiskControls(prev => 
      prev.map(control => 
        control.id === id 
          ? { ...control, [field]: value }
          : control
      )
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'violation': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Info className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'text-success border-success/20 bg-success/10';
      case 'warning': return 'text-warning border-warning/20 bg-warning/10';
      case 'violation': return 'text-destructive border-destructive/20 bg-destructive/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-border';
    }
  };

  const handleRebalanceNow = () => {
    toast({
      title: "Rebalanceamento iniciado",
      description: "Analisando carteira e calculando nova alocação..."
    });
  };

  const handleRunRiskCheck = () => {
    toast({
      title: "Verificação de risco executada",
      description: "Controles de risco atualizados com sucesso"
    });
  };

  const activeViolations = riskControls.filter(c => c.isActive && c.violationStatus === 'violation').length;
  const activeWarnings = riskControls.filter(c => c.isActive && c.violationStatus === 'warning').length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestão de Risco</h1>
          <p className="text-muted-foreground">
            Configure e monitore controles de risco para sua carteira
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRunRiskCheck}>
            <Shield className="w-4 h-4 mr-2" />
            Verificar Riscos
          </Button>
          <Button 
            onClick={handleRebalanceNow}
            className="bg-gradient-primary hover:opacity-90"
          >
            <Settings className="w-4 h-4 mr-2" />
            Rebalancear Agora
          </Button>
        </div>
      </div>

      {/* Risk Status Overview */}
      {(activeViolations > 0 || activeWarnings > 0) && (
        <Alert className={activeViolations > 0 ? "border-destructive/50" : "border-warning/50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {activeViolations > 0 && (
              <span className="text-destructive font-medium">
                {activeViolations} violação(ões) detectada(s). 
              </span>
            )}
            {activeWarnings > 0 && (
              <span className="text-warning font-medium">
                {" "}{activeWarnings} alerta(s) ativo(s).
              </span>
            )}
            {" "}Recomendamos revisar os controles e rebalancear a carteira.
          </AlertDescription>
        </Alert>
      )}

      {/* Portfolio Overview */}
      <Card className="bg-gradient-card border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Visão Geral da Carteira
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">R$ {portfolio.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{portfolio.assets.length}</div>
              <div className="text-sm text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">18.5%</div>
              <div className="text-sm text-muted-foreground">Volatilidade</div>
            </div>
          </div>

          {/* Asset Allocation */}
          <div className="space-y-3">
            <h4 className="font-medium">Alocação Atual</h4>
            {portfolio.assets.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{asset.symbol}</span>
                  <span className="text-sm text-muted-foreground">{asset.name}</span>
                  <Badge 
                    className={`text-xs ${
                      asset.allocation > 20 ? 'bg-warning/10 text-warning border-warning/20' :
                      asset.allocation > 15 ? 'bg-info/10 text-info border-info/20' :
                      'bg-success/10 text-success border-success/20'
                    }`}
                  >
                    Risco {asset.riskScore}/10
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="font-medium">{asset.allocation}%</div>
                  <div className="text-sm text-muted-foreground">
                    R$ {asset.value.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Controles de Risco
          </CardTitle>
          <CardDescription>
            Configure limites e alertas para monitoramento automático
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {riskControls.map((control) => (
            <div key={control.id} className="p-4 rounded-lg border border-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{control.name}</h4>
                    <Badge className={getRiskLevelColor(control.riskLevel)}>
                      {control.riskLevel === 'low' ? 'Baixo' :
                       control.riskLevel === 'medium' ? 'Médio' : 'Alto'}
                    </Badge>
                    <Badge className={getStatusColor(control.violationStatus)}>
                      {getStatusIcon(control.violationStatus)}
                      {control.violationStatus === 'ok' ? 'OK' :
                       control.violationStatus === 'warning' ? 'Alerta' : 'Violação'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{control.description}</p>
                </div>
                <Switch
                  checked={control.isActive}
                  onCheckedChange={(checked) => 
                    handleControlChange(control.id, 'isActive', checked)
                  }
                />
              </div>

              {control.isActive && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="min-w-[100px]">Limite:</Label>
                    <div className="flex-1">
                      <Slider
                        value={[control.value]}
                        onValueChange={(value) => 
                          handleControlChange(control.id, 'value', value[0])
                        }
                        max={control.maxValue}
                        min={0}
                        step={control.unit === '%' ? 1 : 1}
                        className="flex-1"
                      />
                    </div>
                    <div className="min-w-[80px] text-right">
                      <Input
                        type="number"
                        value={control.value}
                        onChange={(e) => 
                          handleControlChange(control.id, 'value', Number(e.target.value))
                        }
                        className="w-20 text-right"
                        min={0}
                        max={control.maxValue}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[40px]">
                      {control.unit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilização atual</span>
                      <span className="font-medium">
                        {Math.min(control.value * 0.8, control.maxValue).toFixed(1)}{control.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(Math.min(control.value * 0.8, control.maxValue) / control.value) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Rebalancing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Configurações de Rebalanceamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Rebalanceamento Automático</Label>
              <p className="text-sm text-muted-foreground">
                Rebalancear automaticamente quando limites forem violados
              </p>
            </div>
            <Switch
              checked={autoRebalance}
              onCheckedChange={setAutoRebalance}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Alertas por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber notificações quando controles forem violados
              </p>
            </div>
            <Switch
              checked={alertsEnabled}
              onCheckedChange={setAlertsEnabled}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Tolerância de Rebalanceamento</Label>
              <div className="flex items-center gap-2 mt-2">
                <Slider
                  value={[5]}
                  max={20}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-12">5%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Desvio mínimo para acionar rebalanceamento
              </p>
            </div>

            <div>
              <Label>Frequência de Verificação</Label>
              <div className="flex items-center gap-2 mt-2">
                <select className="flex-1 h-10 px-3 py-2 text-sm bg-background border border-input rounded-md">
                  <option value="daily">Diário</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Frequência de verificação dos controles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Bell className="w-4 h-4 mr-2" />
          Configurar Alertas
        </Button>
        <Button 
          onClick={handleRebalanceNow}
          className="bg-gradient-primary hover:opacity-90"
        >
          <Settings className="w-4 h-4 mr-2" />
          Aplicar Configurações
        </Button>
      </div>
    </div>
  );
}