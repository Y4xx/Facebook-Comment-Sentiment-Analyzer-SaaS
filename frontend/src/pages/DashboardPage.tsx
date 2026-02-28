import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyses, useCreateAnalysis } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Loader2,
  Search,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  Minus,
  TrendingUp,
} from "lucide-react";

const COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: analyses, isLoading } = useAnalyses();
  const createAnalysis = useCreateAnalysis();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Please enter a Facebook post URL");
      return;
    }

    try {
      const analysis = await createAnalysis.mutateAsync({
        facebook_post_url: url,
      });
      setUrl("");
      navigate(`/analysis/${analysis.id}`);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || "Analysis failed. Please try again.");
    }
  };

  // Calculate aggregate statistics
  const stats = analyses?.reduce(
    (acc, a) => ({
      totalAnalyses: acc.totalAnalyses + 1,
      totalComments: acc.totalComments + a.total_comments,
      totalPositive: acc.totalPositive + a.positive_count,
      totalNeutral: acc.totalNeutral + a.neutral_count,
      totalNegative: acc.totalNegative + a.negative_count,
    }),
    {
      totalAnalyses: 0,
      totalComments: 0,
      totalPositive: 0,
      totalNeutral: 0,
      totalNegative: 0,
    }
  ) || {
    totalAnalyses: 0,
    totalComments: 0,
    totalPositive: 0,
    totalNeutral: 0,
    totalNegative: 0,
  };

  const pieData = [
    { name: "Positive", value: stats.totalPositive, color: COLORS.positive },
    { name: "Neutral", value: stats.totalNeutral, color: COLORS.neutral },
    { name: "Negative", value: stats.totalNegative, color: COLORS.negative },
  ];

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return <Badge variant="outline">N/A</Badge>;
    const variant = sentiment as "positive" | "neutral" | "negative";
    return <Badge variant={variant}>{sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* New Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Analyze Facebook Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Paste Facebook post URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={createAnalysis.isPending}
              className="sm:w-auto"
            >
              {createAnalysis.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analyze
                </>
              )}
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Comments</CardTitle>
            <ThumbsUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {stats.totalPositive}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Neutral Comments</CardTitle>
            <Minus className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {stats.totalNeutral}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negative Comments</CardTitle>
            <ThumbsDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {stats.totalNegative}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart and History */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalComments > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
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
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No data available yet. Start by analyzing a post!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : analyses && analyses.length > 0 ? (
              <div className="max-h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead className="text-right">Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyses.slice(0, 5).map((analysis) => (
                      <TableRow
                        key={analysis.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => navigate(`/analysis/${analysis.id}`)}
                      >
                        <TableCell className="font-medium">
                          {new Date(analysis.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getSentimentBadge(analysis.overall_sentiment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {analysis.total_comments}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No analyses yet. Start by analyzing a post!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full History Table */}
      {analyses && analyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Post URL</TableHead>
                  <TableHead>Sentiment</TableHead>
                  <TableHead className="text-right">Positive</TableHead>
                  <TableHead className="text-right">Neutral</TableHead>
                  <TableHead className="text-right">Negative</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyses.map((analysis) => (
                  <TableRow
                    key={analysis.id}
                    className="cursor-pointer hover:bg-muted"
                    onClick={() => navigate(`/analysis/${analysis.id}`)}
                  >
                    <TableCell>
                      {new Date(analysis.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {analysis.post_url}
                    </TableCell>
                    <TableCell>
                      {getSentimentBadge(analysis.overall_sentiment)}
                    </TableCell>
                    <TableCell className="text-right text-green-500">
                      {analysis.positive_count}
                    </TableCell>
                    <TableCell className="text-right text-yellow-500">
                      {analysis.neutral_count}
                    </TableCell>
                    <TableCell className="text-right text-red-500">
                      {analysis.negative_count}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {analysis.total_comments}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
