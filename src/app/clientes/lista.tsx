import { Cliente } from '@/types/cliente';

export default function Lista({ clientes }: { clientes: Cliente[] }) {
  if (clientes.length > 0) {
    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>Lista de clientes</h2>
        {clientes.map((cliente) => (
          <div key={cliente.codigo}>
            <span>{cliente.codigo} - {cliente.nome.toLowerCase()} - {cliente.email}</span>
          </div>
        ))}
      </div>
    )
  } else {
    return (
      <p>Nenhum cliente cadastrado</p>
    )
  }
}
