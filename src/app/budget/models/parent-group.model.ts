import { ParentCategory } from './parent-category.model';

export interface ParentGroup {
  id: string;
  name: string;
  children: ParentCategory[];
}