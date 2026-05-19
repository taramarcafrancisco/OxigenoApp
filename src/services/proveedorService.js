import api from "./api";
import { proveedores } from "@/data/mockData";
import { createMockCrudService } from "./serviceHelpers";

export const proveedorService = createMockCrudService("/proveedores", api, proveedores);
