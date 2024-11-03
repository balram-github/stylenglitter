import { ParsedCategoryData } from '../types/parsed-category-data';
import { ParsedProductData } from '../types/parsed-product-data';
import { ParsedProductThemeData } from '../types/parsed-product-theme-data';

export function parseSheetDataToProductData(rows: any[][]) {
  const products: ParsedProductData[] = [];

  for (let i = 1; i < rows.length; i++) {
    // Assuming the first row is the header
    const [
      code,
      name,
      description,
      categoryName,
      productThemeName,
      basePrice,
      price,
      quantity,
      ,
      ,
      ...imageUrls // Remaining columns will be treated as image URLs
    ] = rows[i];

    if (!code) {
      continue;
    }

    products.push({
      code,
      name,
      description,
      categoryName,
      productThemeName,
      price: parseFloat(price),
      baseAmount: parseFloat(basePrice),
      qty: parseInt(quantity, 10),
      images: imageUrls.filter((url) => url?.trim()), // Filter out empty URLs
    });
  }

  return products;
}

export function parseSheetDataToCategoryData(rows: any[][]) {
  const categories: ParsedCategoryData[] = [];

  for (let i = 1; i < rows.length; i++) {
    // Assuming the first row is the header
    const [name, , coverImgUrl] = rows[i];

    categories.push({
      name,
      coverImgUrl,
    });
  }

  return categories;
}

export function parseSheetDataToProductThemeData(rows: any[][]) {
  const productThemes: ParsedProductThemeData[] = [];

  for (let i = 1; i < rows.length; i++) {
    // Assuming the first row is the header
    const [name, , coverImgUrl] = rows[i];

    productThemes.push({
      name,
      coverImgUrl,
    });
  }

  return productThemes;
}
