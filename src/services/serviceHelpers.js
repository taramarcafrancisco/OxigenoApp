export const withMockFallback = async (request, fallback) => {
  try {
    const response = await request();
    return response?.data ?? fallback;
  } catch (error) {
    console.warn("Usando datos mock por error de API:", error?.message);
    return fallback;
  }
};

export const createMockCrudService = (basePath, api, initialData) => ({
  listar: () => withMockFallback(() => api.get(basePath), initialData),
  obtener: (id) =>
    withMockFallback(
      () => api.get(`${basePath}/${id}`),
      initialData.find((item) => String(item.id) === String(id)) || null,
    ),
  crear: (payload) => withMockFallback(() => api.post(basePath, payload), { id: Date.now(), ...payload }),
  actualizar: (id, payload) =>
    withMockFallback(() => api.put(`${basePath}/${id}`, payload), { id, ...payload }),
  cambiarEstado: (id, estado) =>
    withMockFallback(() => api.patch(`${basePath}/${id}/estado`, { estado }), { id, estado }),
});
