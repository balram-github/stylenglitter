import { request } from "@/lib/request";
import { GetCategoriesResponse } from "./categories.types";

export const getCategories = async () => {
  const {
    data: { data },
  } = await request.get<GetCategoriesResponse>("/categories");

  return data;
};
