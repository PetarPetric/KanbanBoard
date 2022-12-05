import columnAPI from './columnsAPI';
import taskAPI from './tasksAPI';
import { ResourceNames } from '@/types/resourceEnums';

const repositories: any = {
  [ResourceNames.COLUMNS]: columnAPI,
  [ResourceNames.TASKS]: taskAPI
}

export default {
  get: (name: string) => { return repositories[name] }
};