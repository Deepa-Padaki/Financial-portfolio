import { ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Bar } from 'recharts';
import { cn } from '@/lib/utils';

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  className?: string;
  height?: number;
}

export function CandlestickChart({ data, className, height = 400 }: CandlestickChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className={cn(className)}>
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          domain={['dataMin', 'dataMax']}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            color: 'hsl(var(--popover-foreground))',
          }}
        />
        <Bar 
          dataKey="high" 
          fill="hsl(var(--secondary))" 
          opacity={0.8}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
