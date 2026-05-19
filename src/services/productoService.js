import api from "./api";
import { productos } from "@/data/mockData";
import { createMockCrudService } from "./serviceHelpers";

export const productoService = createMockCrudService("/productos", api, productos);
