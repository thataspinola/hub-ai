'use client'

import { useState } from 'react'
import { useRecommendationStore } from '@/lib/recommendations/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Empty } from '@/components/ui/empty'
import { RecommendationProductForm } from './RecommendationProductForm'
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Package,
  Tags,
  ExternalLink,
} from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/lib/recommendations/types'

export function RecommendationCatalog() {
  const {
    data,
    addProduct,
    updateProduct,
    removeProduct,
    addCategory,
    removeCategory,
  } = useRecommendationStore()
  const { products, categories } = data.catalog

  const [productFormOpen, setProductFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const [newCategoryName, setNewCategoryName] = useState('')
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [deleteCategoryConfirmOpen, setDeleteCategoryConfirmOpen] =
    useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.url.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductFormOpen(true)
  }

  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.url, product)
    } else {
      addProduct(product)
    }

    setEditingProduct(undefined)
  }

  const handleDeleteProduct = (url: string) => {
    setProductToDelete(url)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteProduct = () => {
    if (productToDelete) {
      removeProduct(productToDelete)
      setProductToDelete(null)
    }

    setDeleteConfirmOpen(false)
  }

  const handleAddCategory = () => {
    if (
      newCategoryName.trim() &&
      !categories.includes(newCategoryName.trim())
    ) {
      addCategory(newCategoryName.trim())
      setNewCategoryName('')
      setCategoryDialogOpen(false)
    }
  }

  const handleDeleteCategory = (category: string) => {
    setCategoryToDelete(category)
    setDeleteCategoryConfirmOpen(true)
  }

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      removeCategory(categoryToDelete)
      setCategoryToDelete(null)
    }

    setDeleteCategoryConfirmOpen(false)
  }

  const productsInCategory = (category: string) => {
    return products.filter((p) => p.category === category).length
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="products" className="gap-2">
            <Package className="h-4 w-4" />
            Produtos ({products.length})
          </TabsTrigger>

          <TabsTrigger value="categories" className="gap-2">
            <Tags className="h-4 w-4" />
            Categorias ({categories.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Produtos</CardTitle>

                  <CardDescription>
                    Gerencie o catálogo de produtos para recomendações
                  </CardDescription>
                </div>

                <Button
                  onClick={() => {
                    setEditingProduct(undefined)
                    setProductFormOpen(true)
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <Input
                    placeholder="Buscar por nome ou URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </CardHeader>

            <CardContent>
              {filteredProducts.length === 0 ? (
                <Empty
                  title="Nenhum produto encontrado"
                  description={
                    products.length === 0
                      ? 'Adicione seu primeiro produto ao catálogo'
                      : 'Tente ajustar os filtros de busca'
                  }
                />
              ) : (
                <div className="rounded-md border border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Badges</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.url}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.imageUrl && (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded object-cover bg-slate-100"
                                  onError={(e) => {
                                    ;(
                                      e.target as HTMLImageElement
                                    ).style.display = 'none'
                                  }}
                                />
                              )}

                              <div className="min-w-0">
                                <p className="font-medium truncate max-w-xs">
                                  {product.name}
                                </p>

                                <a
                                  href={product.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-slate-400 hover:text-indigo-500 truncate max-w-xs flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3 shrink-0" />

                                  <span className="truncate">
                                    {product.url}
                                  </span>
                                </a>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>

                          <TableCell>
                            {product.price ? (
                              <span className="text-sm">
                                {product.price.prefix && (
                                  <span className="text-slate-400">
                                    {product.price.prefix}{' '}
                                  </span>
                                )}

                                {product.price.value.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: product.price.currency,
                                })}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </TableCell>

                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {product.badges?.map((badge, i) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {badge.text}
                                </Badge>
                              ))}

                              {(!product.badges ||
                                product.badges.length === 0) && (
                                <span className="text-slate-400 text-sm">
                                  -
                                </span>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteProduct(product.url)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Categorias</CardTitle>

                  <CardDescription>
                    Gerencie as categorias de produtos
                  </CardDescription>
                </div>

                <Button
                  onClick={() => setCategoryDialogOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Categoria
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {categories.length === 0 ? (
                <Empty
                  title="Nenhuma categoria encontrada"
                  description="Adicione uma categoria ou importe produtos com categorias"
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <div
                      key={category}
                      className="flex items-center justify-between rounded-lg border border-slate-200 p-4 bg-white"
                    >
                      <div>
                        <p className="font-medium">{category}</p>

                        <p className="text-sm text-slate-500">
                          {productsInCategory(category)} produto(s)
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={productsInCategory(category) > 0}
                        title={
                          productsInCategory(category) > 0
                            ? 'Remova os produtos desta categoria primeiro'
                            : 'Excluir categoria'
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Product Form Dialog */}
      <RecommendationProductForm
        open={productFormOpen}
        onOpenChange={(open) => {
          setProductFormOpen(open)
          if (!open) setEditingProduct(undefined)
        }}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />

      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Categoria</DialogTitle>

            <DialogDescription>
              Digite o nome da nova categoria
            </DialogDescription>
          </DialogHeader>

          <Input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome da categoria"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancelar
            </Button>

            <Button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>

            <DialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancelar
            </Button>

            <Button variant="destructive" onClick={confirmDeleteProduct}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <Dialog
        open={deleteCategoryConfirmOpen}
        onOpenChange={setDeleteCategoryConfirmOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>

            <DialogDescription>
              Tem certeza que deseja excluir a categoria &quot;
              {categoryToDelete}&quot;? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteCategoryConfirmOpen(false)}
            >
              Cancelar
            </Button>

            <Button variant="destructive" onClick={confirmDeleteCategory}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
