import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    portfolio: number;
    benchmark?: number;
  }>;
  height?: number;
  showBenchmark?: boolean;
}

export function PerformanceChart({ 
  data, 
  height = 300, 
  showBenchmark = false 
}: PerformanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        <Area
          type="monotone"
          dataKey="portfolio"
          stroke="hsl(var(--success))"
          fillOpacity={1}
          fill="url(#portfolioGradient)"
          strokeWidth={2}
          name="Carteira"
        />
        
        {showBenchmark && (
          <Area
            type="monotone"
            dataKey="benchmark"
            stroke="hsl(var(--muted-foreground))"
            fillOpacity={1}
            fill="url(#benchmarkGradient)"
            strokeWidth={2}
            name="Benchmark"
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface AllocationChartProps {
  data: Array<{
    name: string;
    value: number;
    sector: string;
  }>;
  height?: number;
}

export function AllocationChart({ data, height = 300 }: AllocationChartProps) {
  const COLORS = [
    'hsl(var(--success))',
    'hsl(var(--info))', 
    'hsl(var(--warning))',
    'hsl(var(--destructive))',
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.sector}</p>
          <p className="text-sm font-medium">{data.value.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface MetricsComparisonProps {
  data: Array<{
    metric: string;
    portfolio1: number;
    portfolio2?: number;
    portfolio3?: number;
  }>;
  height?: number;
}

export function MetricsComparison({ data, height = 300 }: MetricsComparisonProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-card">
          <p className="text-sm font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="metric" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        
        <Bar 
          dataKey="portfolio1" 
          fill="hsl(var(--success))" 
          name="Carteira 1"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="portfolio2" 
          fill="hsl(var(--info))" 
          name="Carteira 2"
          radius={[2, 2, 0, 0]}
        />
        <Bar 
          dataKey="portfolio3" 
          fill="hsl(var(--warning))" 
          name="Carteira 3"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DrawdownChartProps {
  data: Array<{
    date: string;
    drawdown: number;
  }>;
  height?: number;
}

export function DrawdownChart({ data, height = 200 }: DrawdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))" 
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Drawdown']}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px'
          }}
        />
        
        <Area
          type="monotone"
          dataKey="drawdown"
          stroke="hsl(var(--destructive))"
          fillOpacity={1}
          fill="url(#drawdownGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}