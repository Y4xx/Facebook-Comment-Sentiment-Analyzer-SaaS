import { useParams, useNavigate } from "react-router-dom";
import { useAnalysis } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Loader2,
  ArrowLeft,
  Download,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Link as LinkIcon,
} from "lucide-react";

const COLORS = {
  positive: "#22c55e",
  neutral: "#eab308",
  negative: "#ef4444",
};

export function AnalysisDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: analysis, isLoading, error } = useAnalysis(Number(id));

  const handleExportCSV = () => {
    if (!analysis?.comments) return;

    const headers = ["Comment", "Sentiment", "Score"];
    const rows = analysis.comments.map((c) => [
      `"${c.comment_text.replace(/"/g, '""')}"`,
      c.sentiment,
      c.score.toString(),
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analysis-${id}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-muted-foreground">Analysis not found</p>
        <Button variant="outline" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const pieData = [
    { name: "Positive", value: analysis.positive_count, color: COLORS.positive },
    { name: "Neutral", value: analysis.neutral_count, color: COLORS.neutral },
    { name: "Negative", value: analysis.negative_count, color: COLORS.negative },
  ];

  const barData = [
    { name: "Positive", count: analysis.positive_count, fill: COLORS.positive },
    { name: "Neutral", count: analysis.neutral_count, fill: COLORS.neutral },
    { name: "Negative", count: analysis.negative_count, fill: COLORS.negative },
  ];

  const getPercentage = (count: number) => {
    if (analysis.total_comments === 0) return 0;
    return (count / analysis.total_comments) * 100;
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case "negative":
        return <ThumbsDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const variant = sentiment as "positive" | "neutral" | "negative";
    return (
      <Badge variant={variant}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold">Analysis Details</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <LinkIcon className="h-4 w-4" />
            <span className="truncate max-w-[400px]">{analysis.post_url}</span>
          </p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {analysis.overall_sentiment && getSentimentIcon(analysis.overall_sentiment)}
              <span className="text-2xl font-bold capitalize">
                {analysis.overall_sentiment || "N/A"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Score: {analysis.overall_score?.toFixed(2) || "N/A"} / 5
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-500">
              Positive
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.positive_count}</div>
            <Progress
              value={getPercentage(analysis.positive_count)}
              className="mt-2 h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {getPercentage(analysis.positive_count).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-500">
              Neutral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.neutral_count}</div>
            <Progress
              value={getPercentage(analysis.neutral_count)}
              className="mt-2 h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {getPercentage(analysis.neutral_count).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500">
              Negative
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.negative_count}</div>
            <Progress
              value={getPercentage(analysis.negative_count)}
              className="mt-2 h-2"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {getPercentage(analysis.negative_count).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Charts and Comments */}
      <Tabs defaultValue="charts">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="comments">
            Comments ({analysis.total_comments})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sentiment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
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
                      outerRadius={100}
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
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Comment Count by Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Comment-Level Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.comments && analysis.comments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Comment</TableHead>
                      <TableHead>Sentiment</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analysis.comments.map((comment) => (
                      <TableRow key={comment.id}>
                        <TableCell className="max-w-[400px]">
                          <p className="line-clamp-2">{comment.comment_text}</p>
                        </TableCell>
                        <TableCell>{getSentimentBadge(comment.sentiment)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {comment.score}/5
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No comments to display
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Analysis ID</p>
              <p className="font-medium">{analysis.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">
                {new Date(analysis.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Comments</p>
              <p className="font-medium">{analysis.total_comments}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Post URL</p>
              <a
                href={analysis.post_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline truncate block"
              >
                View Post
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
