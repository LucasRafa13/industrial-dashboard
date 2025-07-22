import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.tsx'
import NotFound from './pages/NotFound.tsx'
import DashboardLayout from './layouts/DashboardLayout.tsx'

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
