import {
  BadgeCheck,
  Droplets,
  Flame,
  Hammer,
  Leaf,
  Package,
  Pipette,
  ShowerHead,
  Wrench,
} from "lucide-react";

export const categorias = [
  {
    id: "agua",
    nombre: "Agua",
    descripcion: "Cañerías, conexiones, llaves y piezas para instalaciones de agua fría y caliente.",
    icon: Droplets,
    color: "bg-blue-50 text-blue-700 border-blue-100",
  },
  {
    id: "gas",
    nombre: "Gas",
    descripcion: "Materiales certificados para instalaciones domiciliarias y comerciales.",
    icon: Flame,
    color: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    id: "cloaca",
    nombre: "Cloaca",
    descripcion: "Tubos, curvas, ramales y accesorios para desagues cloacales.",
    icon: Pipette,
    color: "bg-slate-50 text-slate-700 border-slate-200",
  },
  {
    id: "riego",
    nombre: "Riego",
    descripcion: "Mangueras, aspersores, programadores y soluciones para espacios verdes.",
    icon: Leaf,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    id: "redes-gas",
    nombre: "Redes de Gas",
    descripcion: "Caños, accesorios y sistemas para redes de gas natural y envasado.",
    icon: BadgeCheck,
    color: "bg-orange-50 text-orange-700 border-orange-100",
  },
  {
    id: "sanitarios",
    nombre: "Sanitarios",
    descripcion: "Griferías, descargas, flexibles, válvulas y repuestos sanitarios.",
    icon: ShowerHead,
    color: "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
  {
    id: "tanques",
    nombre: "Tanques",
    descripcion: "Tanques, flotantes, conexiones y accesorios para reserva de agua.",
    icon: Package,
    color: "bg-indigo-50 text-indigo-700 border-indigo-100",
  },
  {
    id: "canos",
    nombre: "Caños",
    descripcion: "PVC, polipropileno, termofusion, corrugados y conducciones varias.",
    icon: Wrench,
    color: "bg-zinc-50 text-zinc-700 border-zinc-200",
  },
  {
    id: "accesorios",
    nombre: "Accesorios",
    descripcion: "Codos, cuplas, uniones, abrazaderas, selladores y piezas complementarias.",
    icon: Package,
    color: "bg-stone-50 text-stone-700 border-stone-200",
  },
  {
    id: "termofusion",
    nombre: "Termofusión",
    descripcion: "Tubos, conexiones y herramientas para sistemas de termofusion.",
    icon: Flame,
    color: "bg-red-50 text-red-700 border-red-100",
  },
  {
    id: "herramientas",
    nombre: "Herramientas",
    descripcion: "Cortadoras, terrajas, pinzas, mechas y herramientas de instalador.",
    icon: Hammer,
    color: "bg-yellow-50 text-yellow-800 border-yellow-100",
  },
];

export const productos = [
  {
    id: 1,
    nombre: "Caño PP-R termofusion 20 mm",
    marca: "AcquaSystem",
    categoria: "Termofusión",
    precio: 1850,
    unidad: "metro",
    stock: 144,
    stockMinimo: 30,
    ubicacion: "Pasillo 2 - Rack A",
    estado: "activo",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    nombre: "Codo PVC cloacal 110 mm 90 grados",
    marca: "Duratop",
    categoria: "Cloaca",
    precio: 2380,
    unidad: "unidad",
    stock: 16,
    stockMinimo: 24,
    ubicacion: "Deposito - C3",
    estado: "activo",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    nombre: "Llave esferica gas aprobada 1/2",
    marca: "Sigas",
    categoria: "Gas",
    precio: 6420,
    unidad: "unidad",
    stock: 32,
    stockMinimo: 10,
    ubicacion: "Mostrador tecnico",
    estado: "activo",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    nombre: "Tanque tricapa 1000 litros",
    marca: "Rotoplas",
    categoria: "Tanques",
    precio: 298500,
    unidad: "unidad",
    stock: 5,
    stockMinimo: 3,
    ubicacion: "Patio externo",
    estado: "activo",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1604079628040-94301bb21b91?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    nombre: "Manguera riego reforzada 3/4",
    marca: "Pluvius",
    categoria: "Riego",
    precio: 1260,
    unidad: "metro",
    stock: 220,
    stockMinimo: 50,
    ubicacion: "Pasillo 5",
    estado: "activo",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    nombre: "Flexible mallado sanitario 40 cm",
    marca: "FV",
    categoria: "Sanitarios",
    precio: 3150,
    unidad: "unidad",
    stock: 9,
    stockMinimo: 25,
    ubicacion: "Mostrador - B2",
    estado: "activo",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    nombre: "Caño PEAD gas 25 mm",
    marca: "Sigas",
    categoria: "Redes de Gas",
    precio: 2750,
    unidad: "metro",
    stock: 85,
    stockMinimo: 40,
    ubicacion: "Deposito red gas",
    estado: "activo",
    destacado: true,
    imagen: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    nombre: "Abrazadera omega galvanizada 1",
    marca: "Genérica",
    categoria: "Accesorios",
    precio: 380,
    unidad: "unidad",
    stock: 0,
    stockMinimo: 30,
    ubicacion: "Pasillo 1 - C",
    estado: "inactivo",
    destacado: false,
    imagen: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
  },
];

export const clientes = [
  { id: 1, nombre: "Instalaciones Norte", razonSocial: "Instalaciones Norte SRL", cuit: "30-71584219-6", email: "compras@instalacionesnorte.com", telefono: "11 4821-3320", estado: "activo" },
  { id: 2, nombre: "Obra San Martin", razonSocial: "Constructora San Martin SA", cuit: "30-69857412-1", email: "obra@sanmartin.com", telefono: "11 4098-1102", estado: "activo" },
  { id: 3, nombre: "Gasista Miguel Perez", razonSocial: "Miguel Angel Perez", cuit: "20-22333444-5", email: "miguel.perez@email.com", telefono: "11 6204-9920", estado: "inactivo" },
];

export const proveedores = [
  { id: 1, razonSocial: "AcquaSystem Argentina", cuit: "30-64111222-3", email: "ventas@acquasystem.com", telefono: "11 4700-1100", rubro: "Agua y termofusion", estado: "activo" },
  { id: 2, razonSocial: "Sigas Materiales", cuit: "30-70888777-4", email: "pedidos@sigas.com", telefono: "11 4555-9080", rubro: "Gas y redes", estado: "activo" },
  { id: 3, razonSocial: "Rotoplas Distribución", cuit: "30-65000111-8", email: "comercial@rotoplas.com", telefono: "11 4010-4433", rubro: "Tanques", estado: "activo" },
];

export const pedidos = [
  {
    id: 1001,
    clienteId: 1,
    cliente: "Instalaciones Norte",
    fecha: "2026-05-16",
    estado: "pendiente",
    observaciones: "Retira por mostrador.",
    items: [
      { productoId: 1, nombre: "Caño PP-R termofusion 20 mm", cantidad: 40, precioUnitario: 1850 },
      { productoId: 6, nombre: "Flexible mallado sanitario 40 cm", cantidad: 6, precioUnitario: 3150 },
    ],
  },
  {
    id: 1002,
    clienteId: 2,
    cliente: "Obra San Martin",
    fecha: "2026-05-15",
    estado: "preparacion",
    observaciones: "Enviar con remito a obra.",
    items: [
      { productoId: 4, nombre: "Tanque tricapa 1000 litros", cantidad: 1, precioUnitario: 298500 },
      { productoId: 2, nombre: "Codo PVC cloacal 110 mm 90 grados", cantidad: 12, precioUnitario: 2380 },
    ],
  },
  {
    id: 1003,
    clienteId: 3,
    cliente: "Gasista Miguel Perez",
    fecha: "2026-05-13",
    estado: "entregado",
    observaciones: "",
    items: [
      { productoId: 3, nombre: "Llave esferica gas aprobada 1/2", cantidad: 4, precioUnitario: 6420 },
      { productoId: 7, nombre: "Caño PEAD gas 25 mm", cantidad: 20, precioUnitario: 2750 },
    ],
  },
];

export const getPedidoTotal = (pedido) =>
  pedido?.items?.reduce((total, item) => total + Number(item.cantidad || 0) * Number(item.precioUnitario || 0), 0) || 0;

export const dashboard = {
  get productos() {
    return productos.length;
  },
  get pedidosPendientes() {
    return pedidos.filter((pedido) => ["pendiente", "preparacion"].includes(pedido.estado)).length;
  },
  get stockBajo() {
    return productos.filter((producto) => Number(producto.stock) <= Number(producto.stockMinimo)).length;
  },
  get proveedoresActivos() {
    return proveedores.filter((proveedor) => proveedor.estado === "activo").length;
  },
};
