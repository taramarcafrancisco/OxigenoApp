 

import { apiFetch } from "./apiClient";

export const RutinasApi = {
  getMyRoutine: async () => {
    return apiFetch("rutinas/mia");
  },
};