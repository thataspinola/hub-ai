'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Empty } from '@/components/ui/empty'
import { Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react'

export function PopularityEditor({
  globalRanking,
  products,
  onSetGlobalRanking,
}: {
  globalRanking: string[]
  products: { url: string; name: string; category: string }[]
  onSetGlobalRanking: (urls: string[]) => void
}) {
  const moveItem = (arr: string[], from: number, to: number): string[] => {
    const result = [...arr]
    const [removed] = result.splice(from, 1)
    result.splice(to, 0, removed)
    return result
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Popularidade Global</CardTitle>
          <CardDescription>
            Ranking geral de todos os produtos ordenados por popularidade
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select
              onValueChange={(url) => {
                if (!globalRanking.includes(url))
                  onSetGlobalRanking([...globalRanking, url])
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Adicionar produto ao ranking" />
              </SelectTrigger>
              <SelectContent>
                {products
                  .filter((p) => !globalRanking.includes(p.url))
                  .map((p) => (
                    <SelectItem key={p.url} value={p.url}>
                      {p.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {globalRanking.length === 0 ? (
              <Empty
                title="Ranking vazio"
                description="Adicione produtos ao ranking global"
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {globalRanking.map((url, index) => {
                  const product = products.find((p) => p.url === url)
                  return (
                    <div
                      key={url}
                      className="flex items-center gap-2 p-2 rounded-md bg-slate-50"
                    >
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => {
                            if (index > 0)
                              onSetGlobalRanking(
                                moveItem(globalRanking, index, index - 1),
                              )
                          }}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5"
                          onClick={() => {
                            if (index < globalRanking.length - 1)
                              onSetGlobalRanking(
                                moveItem(globalRanking, index, index + 1),
                              )
                          }}
                          disabled={index === globalRanking.length - 1}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-medium text-slate-500 w-6">
                        {index + 1}.
                      </span>
                      <GripVertical className="h-4 w-4 text-slate-400" />
                      <span className="flex-1 truncate">
                        {product?.name || url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          onSetGlobalRanking(
                            globalRanking.filter((u) => u !== url),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
