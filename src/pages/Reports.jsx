import React, { useState } from 'react';
import AppLayout from '../components/app/AppLayout';
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Download, Printer, Share2 } from 'lucide-react';
import { toast } from "sonner";

function ReportsContent({ user }) {
  const [selectedUser, setSelectedUser] = useState('EL CALLAO');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-08');

  const mockData = [
  ];

  const handleDownload = () => {
    toast.success('Descargando reporte...');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Preparando impresión...');
  };

  const handleShare = () => {
    toast.success('Compartiendo reporte...');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-500">Reportes</h1>
        <p className="text-cyan-500 mt-2 text-lg">en línea</p>
      </div>

      <div className="text-center text-sm text-slate-600 uppercase tracking-wide">
        ACCEDE A LOS REPORTES DE DIRECCIONES CLASIFICADOS POR FECHA
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Usuario
            </label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                               <SelectItem value="OTRO USUARIO">  USUARIO</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Desde (dd/mm/aaaa)
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Hasta (dd/mm/aaaa)
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
            BUSCAR
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-semibold text-slate-900">FECHA</TableHead>
                <TableHead className="font-semibold text-slate-900">USUARIO</TableHead>
                <TableHead className="font-semibold text-slate-900">CUENTA</TableHead>
                <TableHead className="font-semibold text-slate-900">CANTIDAD</TableHead>
                <TableHead className="font-semibold text-slate-900">VERIFICADOS</TableHead>
                <TableHead className="font-semibold text-slate-900">DESISTIDOS</TableHead>
                <TableHead className="font-semibold text-slate-900">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockData.map((row, index) => (
                <TableRow key={index} className="hover:bg-slate-50">
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.usuario}</TableCell>
                  <TableCell>{row.cuenta}</TableCell>
                  <TableCell>{row.cantidad.toLocaleString()}</TableCell>
                  <TableCell>{row.verificados.toLocaleString()}</TableCell>
                  <TableCell>{row.desistidos.toLocaleString()}</TableCell>
                  <TableCell>{row.porcentaje}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleDownload}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Descargar
        </Button>
        <Button 
          onClick={handlePrint}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
        <Button 
          onClick={handleShare}
          className="bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </Button>
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <AppLayout>
      <ReportsContent />
    </AppLayout>
  );
}