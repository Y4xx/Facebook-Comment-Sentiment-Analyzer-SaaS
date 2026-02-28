import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
};

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

interface SentimentPieChartProps {
  data: SentimentData;
  title?: string;
}

export function SentimentPieChart({ data, title = "Sentiment Distribution" }: SentimentPieChartProps) {
  const pieData = [
    { name: "Positive", value: data.positive, color: COLORS.positive },
    { name: "Neutral", value: data.neutral, color: COLORS.neutral },
    { name: "Negative", value: data.negative, color: COLORS.negative },
  ];

  const total = data.positive + data.neutral + data.negative;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name ?? ""}: ${((percent ?? 0) * 100).toFixed(0)}%`
              }
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value} comments`, "Count"]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface SentimentBarChartProps {
  data: SentimentData;
  title?: string;
}

export function SentimentBarChart({ data, title = "Comment Distribution" }: SentimentBarChartProps) {
  const barData = [
    { name: "Positive", count: data.positive, fill: COLORS.positive },
    { name: "Neutral", count: data.neutral, fill: COLORS.neutral },
    { name: "Negative", count: data.negative, fill: COLORS.negative },
  ];

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              animationBegin={0}
              animationDuration={800}
            >
              {barData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
