"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Edit, Copy, Trash2, Plus, Calendar, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { getFormsIndex, deleteForm, duplicateForm } from "@/lib/form-wizard/forms-storage"
import type { FormIndexEntry } from "@/lib/form-wizard/types"

export default function FormWizardListPage() {
  const [forms, setForms] = useState<FormIndexEntry[]>([])
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadForms()
  }, [])

  const loadForms = () => {
    const index = getFormsIndex()
    setForms(index.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()))
    setIsLoading(false)
  }

  const handleDuplicate = (slug: string) => {
    const newForm = duplicateForm(slug)
    if (newForm) {
      loadForms()
    }
  }

  const handleDelete = () => {
    if (deleteSlug) {
      deleteForm(deleteSlug)
      loadForms()
      setDeleteSlug(null)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading forms...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold">Form Wizard Builder</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus formulários wizard</p>
          </div>
          <Button asChild>
            <Link href="/form-wizard/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo Form
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {forms.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <h2 className="mb-2 text-lg font-semibold">Nenhum formulário ainda</h2>
              <p className="mb-6 text-sm text-muted-foreground">Crie seu primeiro wizard form para começar.</p>
              <Button asChild>
                <Link href="/form-wizard/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Form
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {forms.map((form) => (
              <Card key={form.id} className="group transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{form.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-mono">/{form.slug}</span>
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {form.stepsCount} step{form.stepsCount !== 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(form.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button variant="ghost" size="sm" asChild title="Edit">
                      <Link href={`/form-wizard/${form.slug}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDuplicate(form.slug)} title="Duplicate">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteSlug(form.slug)}
                      title="Delete"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteSlug} onOpenChange={() => setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Formulário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
