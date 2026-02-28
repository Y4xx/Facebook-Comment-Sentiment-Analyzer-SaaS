import { useParams, useNavigate } from "react-router-dom";
import { useAnalysis } from "@/hooks";
import { PageHeader } from "@/components/PageHeader";
import { SentimentPieChart, SentimentBarChart } from "@/components/SentimentChart";
import { CardSkeleton, ChartSkeleton, TableSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
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
  ArrowLeft,
  Download,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Link as LinkIcon,
  Calendar,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <ChartSkeleton />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <ChartSkeleton />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="pt-6">
            <TableSkeleton rows={5} columns={3} />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analysis Not Found" />
        <Card>
          <CardContent className="py-0">
            <EmptyState
              icon={AlertCircle}
              title="Analysis not found"
              description="The analysis you're looking for doesn't exist or has been deleted."
              action={{
                label: "Back to Dashboard",
                onClick: () => navigate("/"),
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <PageHeader
        title="Analysis Details"
        description={
          <span className="flex items-center gap-2 text-sm">
            <LinkIcon className="h-4 w-4" />
            <span className="truncate max-w-[400px]">{analysis.post_url}</span>
          </span>
        }
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleExportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </PageHeader>

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Sentiment
            </CardTitle>
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
        
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
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
              {getPercentage(analysis.positive_count).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">
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
              {getPercentage(analysis.neutral_count).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-l-4 border-l-red-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">
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
              {getPercentage(analysis.negative_count).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Charts and Comments */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="charts" className="gap-2">
            Charts
          </TabsTrigger>
          <TabsTrigger value="comments" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({analysis.total_comments})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <SentimentPieChart
              data={{
                positive: analysis.positive_count,
                neutral: analysis.neutral_count,
                negative: analysis.negative_count,
              }}
            />
            <SentimentBarChart
              data={{
                positive: analysis.positive_count,
                neutral: analysis.neutral_count,
                negative: analysis.negative_count,
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="comments">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Comment-Level Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.comments && analysis.comments.length > 0 ? (
                <div className="overflow-x-auto">
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
                        <TableRow key={comment.id} className="hover:bg-muted/50">
                          <TableCell className="max-w-[400px]">
                            <p className="line-clamp-2">{comment.comment_text}</p>
                          </TableCell>
                          <TableCell>{getSentimentBadge(comment.sentiment)}</TableCell>
                          <TableCell className="text-right font-medium">
                            <span className="inline-flex items-center gap-1">
                              {comment.score.toFixed(1)}
                              <span className="text-muted-foreground text-xs">/5</span>
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState
                  icon={MessageSquare}
                  title="No comments"
                  description="No comments were found for this analysis"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Metadata */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Analysis Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <span className="text-sm font-bold">ID</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Analysis ID</p>
                <p className="font-medium">#{analysis.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(analysis.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Comments</p>
                <p className="font-medium">{analysis.total_comments}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
                <ExternalLink className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Post URL</p>
                <a
                  href={analysis.post_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:underline text-sm"
                >
                  View Original Post
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
