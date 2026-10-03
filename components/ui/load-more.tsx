import { Button } from "@/components/ui/button"

type Props = {
  hasMore: boolean
  loading: boolean
  onLoadMore: () => void
  /** e.g. "Showing 20 of 54" */
  summary?: string
}

/** "Load more" footer for paginated lists; renders nothing when everything is loaded. */
export function LoadMore({ hasMore, loading, onLoadMore, summary }: Props) {
  if (!hasMore) return null
  return (
    <div className="mt-4 flex flex-col items-center gap-1">
      <Button variant="outline" onClick={onLoadMore} disabled={loading}>
        {loading ? "Loading..." : "Load more"}
      </Button>
      {summary && <p className="text-xs text-muted-foreground">{summary}</p>}
    </div>
  )
}
