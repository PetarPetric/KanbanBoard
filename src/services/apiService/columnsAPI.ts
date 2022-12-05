import { api } from './configs/axiosConfig';
import { ResourcePaths } from '@/types/resourceEnums';

export default {
  get() {
    return api.get(`${ResourcePaths.COLUMNS}`);
  },
  getSingle(id: number) {
    return api.get(`${ResourcePaths.COLUMNS}/${id}`);
  },
  create<B>(payload: B) {
    return api.post(`${ResourcePaths.COLUMNS}`, payload);
  },
  update<B>(payload: B, id: number) {
    return api.put(`${ResourcePaths.COLUMNS}/${id}`, payload);
  },
  patch<B>(payload: B, id: number) {
    return api.patch(`${ResourcePaths.COLUMNS}/${id}`, payload);
  },
  delete(id: number) {
    return api.delete(`${ResourcePaths.COLUMNS}/${id}`);
  },
};