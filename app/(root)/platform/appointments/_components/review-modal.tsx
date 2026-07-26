"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  text: z.string().min(1, "Please write a review").max(1000),
})

type ReviewFormData = z.infer<typeof reviewSchema>

type Props = {
  open: boolean
  onClose: () => void
}

export function ReviewModal({ open, onClose }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, text: "" },
    mode: "onChange",
  })

  const rating = watch("rating")

  const onSubmit = () => {
    toast.success("Review submitted!")
    reset()
    onClose()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          reset()
          onClose()
        }
      }}
    >
      <DialogContent className="max-h-[90vh] rounded-b-none sm:rounded-b-lg">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            How was your experience?
          </p>

          <div className="flex justify-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setValue("rating", i + 1, { shouldValidate: true })
                }
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={cn(
                    "size-8",
                    i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground"
                  )}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-center text-xs text-destructive">
              {errors.rating.message}
            </p>
          )}

          <Textarea
            placeholder="Tell us about your experience..."
            {...register("text")}
            rows={4}
          />
          {errors.text && (
            <p className="text-xs text-destructive">{errors.text.message}</p>
          )}
        </form>
        <DialogFooter>
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => handleSubmit(onSubmit)()} disabled={!isValid}>
              Submit Review
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
