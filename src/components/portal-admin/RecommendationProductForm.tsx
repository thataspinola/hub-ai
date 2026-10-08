"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import type { Product, Badge as BadgeType } from "@/lib/recommendations/types"

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product?: Product
  categories: string[]
  onSave: (product: Product) => void
}

const BADGE_VARIANTS = [
  { value: "success", label: "Sucesso" },
  { value: "warning", label: "Aviso" },
  { value: "info", label: "Info" },
  { value: "default", label: "Padrão" },
] as const

const CTA_STYLES = [
  { value: "primary", label: "Primário" },
  { value: "secondary", label: "Secundário" },
] as const

export function RecommendationProductForm({ open, onOpenChange, product, categories, onSave }: ProductFormProps) {
  const isEditing = !!product
  
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      url: "",
      name: "",
      category: "",
      description: "",
      imageUrl: "",
      price: undefined,
      cta: undefined,
      badges: [],
    }
  )
  
  const [newBadgeText, setNewBadgeText] = useState("")
  const [newBadgeVariant, setNewBadgeVariant] = useState<BadgeType["variant"]>("default")
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategory, setShowNewCategory] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.url || !formData.name || !formData.category) {
      return
    }
    
    onSave(formData as Product)
    onOpenChange(false)
  }

  const addBadge = () => {
    if (!newBadgeText.trim()) return
    
    const newBadge: BadgeType = {
      text: newBadgeText.trim(),
      variant: newBadgeVariant,
    }
    
    setFormData((prev) => ({
      ...prev,
      badges: [...(prev.badges || []), newBadge],
    }))
    
    setNewBadgeText("")
    setNewBadgeVariant("default")
  }

  const removeBadge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      badges: prev.badges?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleCategoryChange = (value: string) => {
    if (value === "__new__") {
      setShowNewCategory(true)
    } else {
      setFormData((prev) => ({ ...prev, category: value }))
    }
  }

  const confirmNewCategory = () => {
    if (newCategory.trim()) {
      setFormData((prev) => ({ ...prev, category: newCategory.trim() }))
      setShowNewCategory(false)
      setNewCategory("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>URL *</FieldLabel>
              <Input
                value={formData.url || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                placeholder="https://exemplo.com/produto"
                required
              />
            </Field>
            
            <Field>
              <FieldLabel>Nome *</FieldLabel>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do produto"
                required
              />
            </Field>
            
            <Field>
              <FieldLabel>Categoria *</FieldLabel>
              {showNewCategory ? (
                <div className="flex gap-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Nome da nova categoria"
                    autoFocus
                  />
                  <Button type="button" onClick={confirmNewCategory} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                    Confirmar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewCategory(false)} size="sm">
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Select value={formData.category || ""} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                    <SelectItem value="__new__">+ Nova categoria</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </Field>
            
            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Textarea
                value={formData.description || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição do produto"
                rows={3}
              />
            </Field>
            
            <Field>
              <FieldLabel>URL da Imagem</FieldLabel>
              <Input
                value={formData.imageUrl || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </Field>
            
            {/* Price Section */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <Label className="text-sm font-medium mb-3 block">Preço (opcional)</Label>
              <div className="grid grid-cols-3 gap-3">
                <Field>
                  <FieldLabel className="text-xs">Prefixo</FieldLabel>
                  <Input
                    value={formData.price?.prefix || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: { ...prev.price, prefix: e.target.value, value: prev.price?.value || 0, currency: prev.price?.currency || "BRL" },
                      }))
                    }
                    placeholder="A partir de"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Valor</FieldLabel>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price?.value || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: { ...prev.price, value: parseFloat(e.target.value) || 0, prefix: prev.price?.prefix, currency: prev.price?.currency || "BRL" },
                      }))
                    }
                    placeholder="0.00"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Moeda</FieldLabel>
                  <Input
                    value={formData.price?.currency || "BRL"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: { ...prev.price, currency: e.target.value, value: prev.price?.value || 0, prefix: prev.price?.prefix },
                      }))
                    }
                    placeholder="BRL"
                  />
                </Field>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <Label className="text-sm font-medium mb-3 block">CTA (opcional)</Label>
              <div className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel className="text-xs">Texto</FieldLabel>
                  <Input
                    value={formData.cta?.text || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        cta: { text: e.target.value, style: prev.cta?.style || "primary" },
                      }))
                    }
                    placeholder="Agendar"
                  />
                </Field>
                <Field>
                  <FieldLabel className="text-xs">Estilo</FieldLabel>
                  <Select
                    value={formData.cta?.style || "primary"}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        cta: { text: prev.cta?.text || "", style: value as "primary" | "secondary" },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CTA_STYLES.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
            
            {/* Badges Section */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <Label className="text-sm font-medium mb-3 block">Badges (opcional)</Label>
              
              {formData.badges && formData.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.badges.map((badge, index) => (
                    <Badge
                      key={index}
                      variant={badge.variant === "success" ? "default" : badge.variant === "warning" ? "secondary" : "outline"}
                      className="gap-1"
                    >
                      {badge.text}
                      <button
                        type="button"
                        onClick={() => removeBadge(index)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2">
                <Input
                  value={newBadgeText}
                  onChange={(e) => setNewBadgeText(e.target.value)}
                  placeholder="Texto do badge"
                  className="flex-1"
                />
                <Select value={newBadgeVariant} onValueChange={(v) => setNewBadgeVariant(v as BadgeType["variant"])}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BADGE_VARIANTS.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={addBadge}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </FieldGroup>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              {isEditing ? "Salvar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
