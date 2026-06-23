"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react"
import { createPortal } from "react-dom"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type Anchor = React.RefObject<Element | null> | null

type LoadingContext = {
  startLoading: (anchor?: Anchor) => void
  stopLoading: () => void
  isLoading: boolean
}

const LoadingContext = createContext<LoadingContext | null>(null)

function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const stackRef = useRef<Anchor[]>([])

  const startLoading = useCallback((anchor?: Anchor) => {
    const a = anchor ?? null
    stackRef.current.push(a)
    setAnchorEl(a?.current ?? null)
    setIsLoading(true)
  }, [])

  const stopLoading = useCallback(() => {
    stackRef.current.pop()
    if (stackRef.current.length === 0) {
      setIsLoading(false)
      setAnchorEl(null)
    } else {
      const top = stackRef.current[stackRef.current.length - 1]
      setAnchorEl(top?.current ?? null)
    }
  }, [])

  const value = useMemo(
    () => ({ startLoading, stopLoading, isLoading }),
    [startLoading, stopLoading, isLoading],
  )

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && !anchorEl && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex items-center justify-center",
            "bg-background/60 backdrop-blur-xs",
          )}
        >
          <Spinner className="size-8" />
        </div>
      )}
      {isLoading &&
        anchorEl &&
        createPortal(
          <Spinner className="size-4" />,
          anchorEl,
        )}
    </LoadingContext.Provider>
  )
}

function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) {
    throw new Error("useLoading must be used within a LoadingProvider")
  }
  return ctx
}

export { LoadingProvider, useLoading }
