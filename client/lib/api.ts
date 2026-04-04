const BASE_URL = 'http://localhost:3001';

export const api = {
  getObjects: () =>
    fetch(`${BASE_URL}/objects`).then((r) => r.json()),

  getObject: (id: string) =>
    fetch(`${BASE_URL}/objects/${id}`).then((r) => r.json()),

  createObject: (formData: FormData) =>
    fetch(`${BASE_URL}/objects`, {
      method: 'POST',
      body: formData,
    }).then((r) => r.json()),

  deleteObject: (id: string) =>
    fetch(`${BASE_URL}/objects/${id}`, { method: 'DELETE' }),
};