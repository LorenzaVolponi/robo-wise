import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Book,
  Code,
  Database,
  GitBranch,
  Server,
  Zap,
  ExternalLink,
  FileText,
  Settings,
  Play,
  Shield
} from "lucide-react";

export function Documentation() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Documentação</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Guia completo para entender, usar e contribuir com o RoboAdvisor Lite
        </p>
      </div>

      {/* Quick Start */}
      <Card className="bg-gradient-card border-primary/20 shadow-glow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Início Rápido
          </CardTitle>
          <CardDescription>
            Primeiros passos para usar o RoboAdvisor
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Análise de Perfil</h3>
              <p className="text-sm text-muted-foreground">
                Complete o questionário de suitability para identificar seu perfil de risco
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Configure Carteira</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste os pesos dos ativos conforme sua preferência e tolerância
              </p>
            </div>
            <div className="text-center p-4 rounded-lg border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Execute Backtest</h3>
              <p className="text-sm text-muted-foreground">
                Simule a performance histórica e analise os resultados
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Architecture */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Arquitetura Frontend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">React + TypeScript</span>
                <Badge variant="outline">Framework</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Vite</span>
                <Badge variant="outline">Build Tool</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">TailwindCSS</span>
                <Badge variant="outline">Styling</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Shadcn/ui</span>
                <Badge variant="outline">Components</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Recharts</span>
                <Badge variant="outline">Charts</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Arquitetura Backend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Vercel Functions</span>
                <Badge variant="outline">Serverless</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Python Runtime</span>
                <Badge variant="outline">Language</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Supabase</span>
                <Badge variant="outline">Database</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">PostgreSQL</span>
                <Badge variant="outline">Storage</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Cron Jobs</span>
                <Badge variant="outline">Automation</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Documentação Técnica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4" />
                  <span className="font-medium">Modelo de Dados</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Esquema do banco, tabelas e relacionamentos
                </p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">API Endpoints</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Documentação completa das APIs
                </p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="w-4 h-4" />
                  <span className="font-medium">Algoritmos</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Cálculos financeiros e backtesting
                </p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Settings className="w-4 h-4" />
                  <span className="font-medium">Deployment</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Guia de deploy no Vercel
                </p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Configuração</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Variáveis de ambiente e setup
                </p>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <Code className="w-4 h-4" />
                  <span className="font-medium">Contribuição</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Como contribuir com o projeto
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Libraries and Dependencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Bibliotecas Principais
          </CardTitle>
          <CardDescription>
            Dependências e ferramentas utilizadas no projeto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Frontend</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">React Router</span>
                  <Badge variant="outline">Navegação</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">React Query</span>
                  <Badge variant="outline">Estado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">React Hook Form</span>
                  <Badge variant="outline">Formulários</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Lucide React</span>
                  <Badge variant="outline">Ícones</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Backend (Futuro)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">backtesting.py</span>
                  <Badge variant="outline">Backtest</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">QuantStats</span>
                  <Badge variant="outline">Relatórios</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">PyPortfolioOpt</span>
                  <Badge variant="outline">Otimização</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">yfinance</span>
                  <Badge variant="outline">Dados</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Recursos Externos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://github.com/kernc/backtesting.py" target="_blank" rel="noopener noreferrer">
                <GitBranch className="w-4 h-4 mr-2" />
                Backtesting.py
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://github.com/ranaroussi/quantstats" target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4 mr-2" />
                QuantStats
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://github.com/robertmartin8/PyPortfolioOpt" target="_blank" rel="noopener noreferrer">
                <Settings className="w-4 h-4 mr-2" />
                PyPortfolioOpt
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://vercel.com/docs/functions/serverless-functions/runtimes/python" target="_blank" rel="noopener noreferrer">
                <Server className="w-4 h-4 mr-2" />
                Vercel Python
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://recharts.org/en-US" target="_blank" rel="noopener noreferrer">
                <Code className="w-4 h-4 mr-2" />
                Recharts
              </a>
            </Button>

            <Button variant="outline" className="justify-start" asChild>
              <a href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                <Database className="w-4 h-4 mr-2" />
                Supabase Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Environment Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuração do Ambiente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Variáveis de Ambiente</h4>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                <div># Frontend</div>
                <div>VITE_SUPABASE_URL=your_supabase_url</div>
                <div>VITE_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                <div className="mt-2"># Backend (Vercel)</div>
                <div>SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</div>
                <div>DATABASE_URL=your_postgres_connection_string</div>
                <div>PYTHON_PATH=/vercel/path0/.venv/bin/python</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Comandos de Desenvolvimento</h4>
              <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm space-y-1">
                <div># Instalar dependências</div>
                <div>npm install</div>
                <div className="mt-2"># Desenvolvimento</div>
                <div>npm run dev</div>
                <div className="mt-2"># Build para produção</div>
                <div>npm run build</div>
                <div className="mt-2"># Deploy no Vercel</div>
                <div>vercel --prod</div>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

      {/* Compliance Notice */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Conformidade e Riscos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            As informações fornecidas têm caráter educacional e não constituem
            recomendação de investimento.
          </p>
          <p>
            Rentabilidade passada não representa garantia de rentabilidade
            futura.
          </p>
          <p>
            A plataforma observa as diretrizes da CVM 19/21 e da SEC Marketing
            Rule 206(4)-1.
          </p>
        </CardContent>
      </Card>

      </div>
    );
  }