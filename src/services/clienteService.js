import api from "./api";
import { clientes } from "@/data/mockData";
import { createMockCrudService } from "./serviceHelpers";

export const clienteService = createMockCrudService("/clientes", api, clientes);
