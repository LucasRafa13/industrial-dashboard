import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">
        404 - Página não encontrada
      </h1>
      <p className="mt-4">
        Voltar para o{' '}
        <Link to="/" className="text-blue-500 underline">
          Dashboard
        </Link>
      </p>
    </div>
  )
}
