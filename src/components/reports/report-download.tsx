import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportDownloadProps {
  runId: string;
  format?: "html" | "pdf" | "png";
}

export function ReportDownload({ runId, format = "pdf" }: ReportDownloadProps) {
  const href = `/api/runs/${runId}/report?format=${format}`;
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Download className="w-4 h-4 mr-2" />
        Download {format.toUpperCase()}
      </a>
    </Button>
  );
}
