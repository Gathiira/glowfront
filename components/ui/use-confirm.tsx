"use client"

import { useCallback, useState, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export type ConfirmOptions = {
  title: string
  description?: ReactNode
  confirmLabel: string
  cancelLabel?: string
  /** Red confirm button for actions that remove, reject or undo something. */
  destructive?: boolean
  /** Extra classes for the dialog (e.g. the staff portal's "sp-dialog" styling). */
  className?: string
  /** Extra classes for the confirm button. */
  actionClassName?: string
}

/**
 * Promise-based confirmation dialog.
 *
 *   const [confirm, confirmDialog] = useConfirm()
 *   if (!(await confirm({ title: "Approve leave?", confirmLabel: "Approve" }))) return
 *   ...
 *   return <>{page}{confirmDialog}</>
 */
export function useConfirm() {
  const [state, setState] = useState<(ConfirmOptions & { resolve: (ok: boolean) => void }) | null>(null)

  const confirm = useCallback(
    (options: ConfirmOptions) => new Promise<boolean>((resolve) => setState({ ...options, resolve })),
    []
  )

  const close = (ok: boolean) => {
    state?.resolve(ok)
    setState(null)
  }

  const dialog = (
    <AlertDialog open={state !== null} onOpenChange={(open) => !open && close(false)}>
      <AlertDialogContent className={state?.className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.title}</AlertDialogTitle>
          {state?.description && <AlertDialogDescription>{state.description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => close(false)}>{state?.cancelLabel ?? "Go back"}</AlertDialogCancel>
          <AlertDialogAction
            variant={state?.destructive ? "destructive" : "default"}
            className={state?.actionClassName}
            onClick={() => close(true)}
          >
            {state?.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return [confirm, dialog] as const
}
