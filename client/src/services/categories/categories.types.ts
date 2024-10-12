export interface Category {
  id: number;
  name: string;
  slug: string;
  coverImgUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetCategoriesResponse {
  success: boolean;
  data: Category[];
}
