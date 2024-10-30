import { ParsedProductData } from '../types/parsed-product-data';

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

    products.push({
      code,
      name,
      description,
      categoryName,
      productThemeName,
      price: parseFloat(price),
      basePrice: parseFloat(basePrice),
      qty: parseInt(quantity, 10),
      images: imageUrls.filter((url) => url?.trim()), // Filter out empty URLs
    });
  }

  return products;
}
