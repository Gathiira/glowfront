"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Props = {
  open: boolean
  onClose: () => void
}

export function ReviewModal({ open, onClose }: Props) {
  const [rating, setRating] = useState(0)
  const [text, setText] = useState("")

  if (!open) return null

  const handleSubmit = () => {
    if (rating === 0 || !text.trim()) return
    toast.success("Review submitted!")
    setRating(0)
    setText("")
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">Write a Review</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          How was your experience?
        </p>

        <div className="mb-4 flex justify-center gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i + 1)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={cn(
                  "size-8",
                  i < rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground",
                )}
              />
            </button>
          ))}
        </div>

        <Textarea
          placeholder="Tell us about your experience..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="mb-4"
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || !text.trim()}
          >
            Submit Review
          </Button>
        </div>
      </div>
    </div>
  )
}
