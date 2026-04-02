"use client"

import { useState, useRef } from "react"
import { useRecommendationStore } from "@/lib/recommendations/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, FileJson, Copy, Check, AlertCircle, RefreshCw, Eye } from "lucide-react"
import { toast } from "sonner"

export function RecommendationImportExport() {
  const { data, importData, exportData, resetData } = useRecommendationStore()
  
  const [importText, setImportText] = useState("")
  const [importDialogOpen, setImportDialogOpen] = useState(false)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const jsonString = exportData()
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `recommendation-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Arquivo JSON exportado com sucesso!")
  }

  const handleCopyToClipboard = async () => {
    const jsonString = exportData()
    try {
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      toast.success("JSON copiado para a área de transferência!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Erro ao copiar para a área de transferência")
    }
  }

  const handleImportFromText = () => {
    setImportError(null)
    
    if (!importText.trim()) {
      setImportError("O texto do JSON não pode estar vazio")
      return
    }

    try {
      const success = importData(importText)
      if (success) {
        setImportDialogOpen(false)
        setImportText("")
        toast.success("Dados importados com sucesso!")
      } else {
        setImportError("Estrutura JSON inválida. Verifique se o arquivo contém 'catalog' e 'recommendationRules'.")
      }
    } catch {
      setImportError("Erro ao processar o JSON. Verifique se o formato está correto.")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      setImportText(text)
      setImportDialogOpen(true)
    }
    reader.onerror = () => {
      toast.error("Erro ao ler o arquivo")
    }
    reader.readAsText(file)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleReset = () => {
    resetData()
    setResetDialogOpen(false)
    toast.success("Dados resetados para valores padrão")
  }

  const jsonPreview = exportData()
  const stats = {
    products: data.catalog.products.length,
    categories: data.catalog.categories.length,
    affinityByCategory: Object.keys(data.recommendationRules.types.affinity_manual.maps.byCategory).length,
    affinityByUrl: Object.keys(data.recommendationRules.types.affinity_manual.maps.byUrl).length,
    globalRanking: data.recommendationRules.types.popularity_global.ranking.urls.length,
    slots: Object.keys(data.recommendationRules.types.context_slot.slots).length,
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Produtos</CardDescription>
            <CardTitle className="text-2xl">{stats.products}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Categorias</CardDescription>
            <CardTitle className="text-2xl">{stats.categories}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Afinidade (Cat.)</CardDescription>
            <CardTitle className="text-2xl">{stats.affinityByCategory}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Afinidade (URL)</CardDescription>
            <CardTitle className="text-2xl">{stats.affinityByUrl}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Ranking Global</CardDescription>
            <CardTitle className="text-2xl">{stats.globalRanking}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription>Slots</CardDescription>
            <CardTitle className="text-2xl">{stats.slots}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Exportar Dados
            </CardTitle>
            <CardDescription>Exporte os dados de configuração para um arquivo JSON</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleExport} className="bg-indigo-600 hover:bg-indigo-700">
                <FileJson className="h-4 w-4 mr-2" />
                Baixar JSON
              </Button>
              <Button variant="outline" onClick={handleCopyToClipboard}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copiado!" : "Copiar JSON"}
              </Button>
              <Button variant="outline" onClick={() => setPreviewDialogOpen(true)}>
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              O arquivo exportado contém o catálogo completo e todas as regras de recomendação configuradas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Importar Dados
            </CardTitle>
            <CardDescription>Importe dados de um arquivo JSON existente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => fileInputRef.current?.click()} className="bg-indigo-600 hover:bg-indigo-700">
                <FileJson className="h-4 w-4 mr-2" />
                Selecionar Arquivo
              </Button>
              <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                <Copy className="h-4 w-4 mr-2" />
                Colar JSON
              </Button>
              <Button variant="destructive" onClick={() => setResetDialogOpen(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Resetar
              </Button>
            </div>
            <p className="text-sm text-slate-500">
              A importação substituirá todos os dados atuais. Faça backup antes de importar.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      </div>

      {/* JSON Preview Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Estrutura do JSON</CardTitle>
          <CardDescription>Visualização da estrutura atual dos dados de recomendação</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="structure">
            <TabsList>
              <TabsTrigger value="structure">Estrutura</TabsTrigger>
              <TabsTrigger value="raw">JSON Bruto</TabsTrigger>
            </TabsList>
            
            <TabsContent value="structure" className="mt-4">
              <div className="space-y-4 text-sm">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold mb-2">catalog</h4>
                  <ul className="ml-4 space-y-1 text-slate-500">
                    <li>products[] - Lista de produtos com url, name, category, etc.</li>
                    <li>categories[] - Lista de categorias únicas</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <h4 className="font-semibold mb-2">recommendationRules</h4>
                  <ul className="ml-4 space-y-1 text-slate-500">
                    <li>defaults - Configurações padrão (limit, minItems, filters)</li>
                    <li>types.same_category - Regra de mesma categoria</li>
                    <li>types.affinity_manual - Afinidades manuais por categoria/URL</li>
                    <li>types.history_recent - Configuração do histórico recente</li>
                    <li>types.popularity_global - Ranking global de popularidade</li>
                    <li>types.campaign - Campanhas por utm_campaign</li>
                    <li>types.context_slot - Slots com cascatas de regras</li>
                    <li>types.profile_static - Perfis de usuário (novo/retornante)</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="raw" className="mt-4">
              <div className="relative">
                <pre className="p-4 rounded-lg bg-slate-100 overflow-auto max-h-96 text-xs">
                  {jsonPreview}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Importar JSON</DialogTitle>
            <DialogDescription>Cole o conteúdo do arquivo JSON abaixo para importar os dados</DialogDescription>
          </DialogHeader>
          
          {importError && (
            <Alert variant="destructive" className="flex-shrink-0">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro na importação</AlertTitle>
              <AlertDescription>{importError}</AlertDescription>
            </Alert>
          )}
          
          <div className="flex-1 min-h-0 overflow-hidden">
            <Textarea
              value={importText}
              onChange={(e) => { setImportText(e.target.value); setImportError(null) }}
              placeholder='{"version": "2.0.0", "catalog": {...}, "recommendationRules": {...}}'
              className="font-mono text-xs h-full min-h-[200px] max-h-[50vh] resize-none"
            />
          </div>
          
          <DialogFooter className="flex-shrink-0">
            <Button variant="outline" onClick={() => { setImportDialogOpen(false); setImportText(""); setImportError(null) }}>
              Cancelar
            </Button>
            <Button onClick={handleImportFromText} className="bg-indigo-600 hover:bg-indigo-700">
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Preview do JSON</DialogTitle>
            <DialogDescription>Visualização completa dos dados que serão exportados</DialogDescription>
          </DialogHeader>
          <div className="relative flex-1 overflow-hidden">
            <pre className="p-4 rounded-lg bg-slate-100 overflow-auto max-h-[60vh] text-xs">
              {jsonPreview}
            </pre>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>Fechar</Button>
            <Button onClick={() => { handleCopyToClipboard(); setPreviewDialogOpen(false) }} className="bg-indigo-600 hover:bg-indigo-700">
              <Copy className="h-4 w-4 mr-2" />
              Copiar JSON
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reset</DialogTitle>
            <DialogDescription>
              Esta ação irá limpar todos os dados e restaurar os valores padrão. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Atenção</AlertTitle>
            <AlertDescription>
              Você perderá {stats.products} produtos, {stats.affinityByCategory + stats.affinityByUrl} regras de afinidade e {stats.globalRanking} itens no ranking global.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleReset}>Confirmar Reset</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
