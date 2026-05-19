import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/query-client";
import MainLayout from "@/layouts/MainLayout";
import Catalogo from "@/pages/Catalogo";
import Categorias from "@/pages/Categorias";
import Clientes from "@/pages/Clientes";
import Dashboard from "@/pages/Dashboard";
import PedidoDetalle from "@/pages/PedidoDetalle";
import Pedidos from "@/pages/Pedidos";
import ProductoDetalle from "@/pages/ProductoDetalle";
import Productos from "@/pages/Productos";
import Proveedores from "@/pages/Proveedores";
import Stock from "@/pages/Stock";
import PageNotFound from "@/lib/PageNotFound";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/pedidos/:id" element={<PedidoDetalle />} />
            <Route path="/catalogo" element={<Catalogo />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
