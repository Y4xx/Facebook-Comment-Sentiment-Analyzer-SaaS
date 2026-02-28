import { useNavigate } from "react-router-dom";
import { useAnalyses } from "@/hooks";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, PlusCircle, ExternalLink } from "lucide-react";

export function HistoryPage() {
  const navigate = useNavigate();
  const { data: analyses, isLoading } = useAnalyses();

  const getSentimentBadge = (sentiment: string | null) => {
    if (!sentiment) return <Badge variant="outline">N/A</Badge>;
    const variant = sentiment as "positive" | "neutral" | "negative";
    return (
      <Badge variant={variant}>
        {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analysis History"
        description="View all your past sentiment analyses"
      >
        <Button onClick={() => navigate("/new")} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          New Analysis
        </Button>
      </PageHeader>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5" />
            All Analyses
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} columns={6} />
          ) : analyses && analyses.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="min-w-[200px]">Post URL</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead className="text-right">Positive</TableHead>
                    <TableHead className="text-right">Neutral</TableHead>
                    <TableHead className="text-right">Negative</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyses.map((analysis) => (
                    <TableRow
                      key={analysis.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => navigate(`/analysis/${analysis.id}`)}
                    >
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatDate(analysis.created_at)}
                      </TableCell>
                      <TableCell>
                        <span className="truncate block max-w-[200px]">
                          {analysis.post_url}
                        </span>
                      </TableCell>
                      <TableCell>
                        {getSentimentBadge(analysis.overall_sentiment)}
                      </TableCell>
                      <TableCell className="text-right text-green-500 font-medium">
                        {analysis.positive_count}
                      </TableCell>
                      <TableCell className="text-right text-yellow-500 font-medium">
                        {analysis.neutral_count}
                      </TableCell>
                      <TableCell className="text-right text-red-500 font-medium">
                        {analysis.negative_count}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {analysis.total_comments}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/analysis/${analysis.id}`);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={History}
              title="No analyses yet"
              description="Start by analyzing your first Facebook post to see the results here"
              action={{
                label: "Start First Analysis",
                onClick: () => navigate("/new"),
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
