import { BadRequestException, Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { ProductService } from '../product/product.service';
import { CategoryService } from '../category/category.service';
import { ProductThemeService } from '../product-theme/product-theme.service';
import {
  parseSheetDataToCategoryData,
  parseSheetDataToProductData,
  parseSheetDataToProductThemeData,
} from './utils/xlsx-parser';

@Injectable()
export class SystemService {
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private productThemeService: ProductThemeService,
  ) {}

  async uploadProducts(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const productSheetName = workbook.SheetNames.find(
      (name) => name === 'Products',
    );

    if (!productSheetName) {
      throw new BadRequestException('Products sheet not found');
    }

    const sheet = workbook.Sheets[productSheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    const productsData = parseSheetDataToProductData(sheetData);

    for (const data of productsData) {
      const category = await this.categoryService.getOne({
        where: { name: data.categoryName },
      });

      const productTheme = await this.productThemeService.getOne({
        where: { name: data.productThemeName },
      });

      if (!category || !productTheme) {
        throw new BadRequestException(
          `Category or product theme not found ${data.categoryName} ${data.productThemeName}`,
        );
      }
      console.log('Upserting product code', data.code);
      await this.productService.upsert({
        amount: data.price,
        baseAmount: data.baseAmount,
        categoryId: category.id,
        code: data.code,
        description: data.description,
        name: data.name,
        productImages: data.images,
        qty: data.qty,
        productThemeId: productTheme.id,
      });
      console.log('Upserted product code', data.code);
    }

    return { message: 'Products created/updated successfully' };
  }

  async uploadCategories(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const categorySheetName = workbook.SheetNames.find(
      (name) => name === 'Categories',
    );

    if (!categorySheetName) {
      throw new BadRequestException('Categories sheet not found');
    }

    const sheet = workbook.Sheets[categorySheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    const categoriesData = parseSheetDataToCategoryData(sheetData);

    for (const data of categoriesData) {
      await this.categoryService.upsert(
        { where: { name: data.name } },
        {
          name: data.name,
          coverImgUrl: data.coverImgUrl,
        },
      );
    }

    return { message: 'Categories created successfully' };
  }

  async uploadProductThemes(file: Express.Multer.File) {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const productThemeSheetName = workbook.SheetNames.find(
      (name) => name === 'Product Themes',
    );

    if (!productThemeSheetName) {
      throw new BadRequestException('Product themes sheet not found');
    }

    const sheet = workbook.Sheets[productThemeSheetName];
    const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    const productThemesData = parseSheetDataToProductThemeData(sheetData);

    for (const data of productThemesData) {
      await this.productThemeService.upsert(
        { where: { name: data.name } },
        {
          name: data.name,
          coverImgUrl: data.coverImgUrl,
        },
      );
    }

    return { message: 'Product themes created successfully' };
  }
}
