import { api } from './configs/axiosConfig';
import { ResourcePaths } from '@/types/resourceEnums';

export default {
  get(columnId: number) {
    return api.get(`${ResourcePaths.TASKS}`, columnId ? {
      params: {
        columnId
      }
    } : undefined);
  },
  getSingle(id: number) {
    return api.get(`${ResourcePaths.TASKS}/${id}`);
  },
  create<B>(payload: B) {
    return api.post(`${ResourcePaths.TASKS}`, payload);
  },
  update<B>(payload: B, id: number) {
    return api.put(`${ResourcePaths.TASKS}/${id}`, payload);
  },
  patch<B>(payload: B, id: number) {
    return api.patch(`${ResourcePaths.TASKS}/${id}`, payload)
  },
  delete(id: number) {
    return api.delete(`${ResourcePaths.TASKS}/${id}`)
  },
};