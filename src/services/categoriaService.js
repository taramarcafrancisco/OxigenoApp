import api from "./api";
import { categorias } from "@/data/mockData";
import { createMockCrudService } from "./serviceHelpers";

export const categoriaService = createMockCrudService("/categorias", api, categorias);
