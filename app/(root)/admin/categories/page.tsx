"use client"

import { useEffect, useState, useCallback } from "react"
import { PageHeader } from "@/components/dashboard/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { fetchBusinessCategories } from "@/lib/api"
import {
  createAdminCategory,
  deleteAdminCategory,
} from "@/lib/api/admin"
import type { BusinessCategoryDto } from "@/lib/types"
import { EmptyState } from "@/components/ui/empty-state"
import { Plus, Trash2, Tag } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export default function AdminCategories() {
  const [categories, setCategories] = useState<BusinessCategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", displayName: "" })
  const [deleteTarget, setDeleteTarget] = useState<BusinessCategoryDto | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBusinessCategories()
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
      setError("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddCategory = async () => {
    if (!newCategory.name || !newCategory.displayName) {
      toast.error("Please fill in all fields")
      return
    }
    try {
      await createAdminCategory({
        name: newCategory.name.toUpperCase().replace(/\s+/g, "_"),
        displayName: newCategory.displayName,
      })
      toast.success("Category created")
      setAddDialogOpen(false)
      setNewCategory({ name: "", displayName: "" })
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create category")
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await deleteAdminCategory(deleteTarget.id)
      toast.success("Category deleted")
      setDeleteTarget(null)
      fetchData()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category")
    }
  }

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Manage business categories"
      >
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="size-3" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Key *</label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="e.g. HAIR_SALON"
                />
                <p className="text-xs text-muted-foreground">
                  Internal key. Will be uppercased and spaces replaced with underscores.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Display Name *</label>
                <Input
                  value={newCategory.displayName}
                  onChange={(e) => setNewCategory({ ...newCategory, displayName: e.target.value })}
                  placeholder="e.g. Hair Salon"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddCategory}>Create Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-muted-foreground">
          Loading...
        </div>
      ) : error ? (
        <div className="flex h-40 items-center justify-center rounded-lg border text-sm text-destructive">
          {error}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState message="No categories found" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Tag className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cat.displayName}</p>
                    <p className="text-xs text-muted-foreground">{cat.name}</p>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon-xs" className="text-destructive">
                      <Trash2 className="size-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogMedia>
                        <Trash2 className="size-6 text-destructive" />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Delete Category</AlertDialogTitle>
                      <AlertDialogDescription>
                        Delete &quot;{cat.displayName}&quot;? This may affect businesses using this category.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => { setDeleteTarget(cat); handleDelete() }}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
