import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout'
import LandingPage from './pages/landingpage'
import Dashboard from './pages/Dashboard'
import SalesOrders from './pages/SalesOrders'
import BOM from './pages/BOM'
import Procurement from './pages/Procurement'
import ProductionOrders from './pages/ProductionOrders'
import QualityControl from './pages/QualityControl'
import Inventory from './pages/Inventory'
import Shipping from './pages/Shipping'
import Invoices from './pages/Invoices'
import Machines from './pages/Machines'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login, { Register } from './forms/login'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected / Authenticated layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Sales & Procurement */}
        <Route path="/sales" element={<SalesOrders />} />
        <Route path="/procurement" element={<Procurement />} />

        {/* Production & BOM */}
        <Route path="/bom" element={<BOM />} />
        <Route path="/production" element={<ProductionOrders />} />
        <Route path="/quality" element={<QualityControl />} />

        {/* Inventory & Logistics */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/billing" element={<Invoices />} />

        {/* Assets & Support */}
        <Route path="/machines" element={<Machines />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}

export default App