export interface Produto {
  id: number;
  nome: string;
  categoria: string;
  preco: number;
  precoPromocional?: number;
  imagem: string;
  tags: string[];
  vendas: number;
}
