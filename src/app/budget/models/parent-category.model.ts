import { Category } from './category.model';

export interface ParentCategory {
  id: string;
  name: string;
  children: Category[];
}