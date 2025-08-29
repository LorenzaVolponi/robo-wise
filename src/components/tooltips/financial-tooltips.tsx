import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  HelpCircle, 
  TrendingUp, 
  Activity, 
  Shield, 
  BarChart3,
  DollarSign,
  Zap,
  Info
} from "lucide-react";

interface MetricTooltipProps {
  title: string;
  description: string;
  formula?: string;
  example?: string;
  children: React.ReactNode;
}

export function MetricTooltip({ 
  title, 
  description, 
  formula, 
  example, 
  children 
}: MetricTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            {children}
            <HelpCircle className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-2">
            <div className="font-medium">{title}</div>
            <div className="text-sm">{description}</div>
            {formula && (
              <div className="text-xs bg-muted/50 p-2 rounded font-mono">
                {formula}
              </div>
            )}
            {example && (
              <div className="text-xs text-muted-foreground">
                Exemplo: {example}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface FinancialTermModalProps {
  term: string;
  definition: string;
  explanation: string;
  pros?: string[];
  cons?: string[];
  example?: string;
  children: React.ReactNode;
}

export function FinancialTermModal({
  term,
  definition,
  explanation,
  pros,
  cons,
  example,
  children
}: FinancialTermModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            {term}
          </DialogTitle>
          <DialogDescription>
            {definition}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-medium mb-2">Como funciona</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {explanation}
              </p>
            </CardContent>
          </Card>

          {(pros || cons) && (
            <div className="grid md:grid-cols-2 gap-4">
              {pros && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-success flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Vantagens
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-success">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {cons && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-warning flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Considerações
                    </h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-warning">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {example && (
            <Card className="bg-muted/30">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Exemplo Prático</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {example}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Componentes pré-configurados para métricas comuns
export function SharpeRatioTooltip({ children }: { children: React.ReactNode }) {
  return (
    <MetricTooltip
      title="Sharpe Ratio"
      description="Mede o retorno ajustado ao risco de um investimento. Quanto maior, melhor o retorno por unidade de risco."
      formula="(Retorno da Carteira - Taxa Livre de Risco) / Volatilidade"
      example="Sharpe de 1.5 indica 1.5% de retorno extra por cada 1% de risco"
    >
      {children}
    </MetricTooltip>
  );
}

export function VolatilityTooltip({ children }: { children: React.ReactNode }) {
  return (
    <MetricTooltip
      title="Volatilidade"
      description="Mede a variação dos retornos de um investimento. Maior volatilidade = maior risco."
      formula="Desvio Padrão dos Retornos × √252"
      example="20% significa que os retornos variam cerca de 20% do valor médio"
    >
      {children}
    </MetricTooltip>
  );
}

export function DrawdownTooltip({ children }: { children: React.ReactNode }) {
  return (
    <MetricTooltip
      title="Max Drawdown"
      description="Maior perda contínua da carteira desde o pico até o vale. Indica o pior cenário histórico."
      formula="(Valor do Vale - Valor do Pico) / Valor do Pico"
      example="-15% significa que a carteira perdeu 15% do valor no pior período"
    >
      {children}
    </MetricTooltip>
  );
}

export function RebalancingModal({ children }: { children: React.ReactNode }) {
  return (
    <FinancialTermModal
      term="Rebalanceamento de Carteira"
      definition="Processo de ajustar os pesos dos ativos para manter a alocação desejada"
      explanation="O rebalanceamento é uma estratégia fundamental para manter sua carteira alinhada com seus objetivos. Com o tempo, alguns ativos podem crescer mais que outros, alterando a proporção original. O rebalanceamento vende ativos que subiram muito e compra os que ficaram defasados, mantendo o perfil de risco desejado."
      pros={[
        "Mantém o perfil de risco original",
        "Força a venda na alta e compra na baixa",
        "Reduz a concentração de risco",
        "Melhora retornos de longo prazo"
      ]}
      cons={[
        "Pode gerar custos de transação",
        "Requer disciplina para executar",
        "Pode reduzir retornos no curto prazo"
      ]}
      example="Se sua carteira deveria ter 60% ações e 40% renda fixa, mas as ações subiram e agora representam 70%, o rebalanceamento venderia 10% das ações e compraria renda fixa para voltar à proporção original."
    >
      {children}
    </FinancialTermModal>
  );
}

export function BacktestingModal({ children }: { children: React.ReactNode }) {
  return (
    <FinancialTermModal
      term="Backtesting"
      definition="Simulação de uma estratégia usando dados históricos para avaliar performance"
      explanation="O backtesting permite testar como sua estratégia de investimento teria performado no passado. Usando dados históricos reais, simulamos compras, vendas e rebalanceamentos para calcular retornos, riscos e outras métricas importantes. É uma ferramenta essencial para validar estratégias antes de investir dinheiro real."
      pros={[
        "Testa estratégias sem risco real",
        "Identifica problemas antes da implementação",
        "Fornece métricas objetivas de performance",
        "Ajuda a definir expectativas realistas"
      ]}
      cons={[
        "Performance passada não garante resultados futuros",
        "Pode não considerar custos de transação reais",
        "Dados históricos podem não refletir condições futuras"
      ]}
      example="Testamos uma carteira 70% ações brasileiras e 30% renda fixa de 2020 a 2023, simulando rebalanceamento trimestral. O resultado mostra retorno de 85% com volatilidade de 18% e Sharpe Ratio de 1.15."
    >
      {children}
    </FinancialTermModal>
  );
}

export function RiskManagementModal({ children }: { children: React.ReactNode }) {
  return (
    <FinancialTermModal
      term="Gestão de Risco"
      definition="Conjunto de práticas para identificar, medir e controlar riscos em investimentos"
      explanation="A gestão de risco é fundamental para proteger seu capital e alcançar objetivos de longo prazo. Inclui diversificação, limites de exposição, stop-loss, e monitoramento contínuo. O objetivo não é eliminar todos os riscos, mas sim assumi-los de forma consciente e controlada, sempre alinhados com seu perfil e objetivos."
      pros={[
        "Protege contra perdas excessivas",
        "Melhora a consistência dos retornos",
        "Reduz stress e ansiedade",
        "Permite crescimento sustentável"
      ]}
      cons={[
        "Pode limitar retornos potenciais",
        "Requer monitoramento constante",
        "Pode ser complexa de implementar"
      ]}
      example="Definir que nenhum ativo pode representar mais que 20% da carteira, ou que se a carteira perder 15% do valor, será feita uma revisão completa da estratégia."
    >
      {children}
    </FinancialTermModal>
  );
}