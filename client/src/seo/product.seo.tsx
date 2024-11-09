import { Product } from "@/services/products/products.types";
import React from "react";

interface ProductSeoProps {
  product: Product;
}

export const ProductSeo = ({ product }: ProductSeoProps) => {
  return (
    <>
      <title>{product.name}</title>
      <meta name="description" content={product.description} />
      <meta name="robots" content="index, follow" />
      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`}
      />
      <meta
        name="keywords"
        content={`${product.name}, ${product.category?.name}, Style Glitter, fashion accessories, online shopping`}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:title" content={product.name} />
      <meta property="og:description" content={product.description} />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`}
      />
      <meta
        property="product:price:amount"
        content={product.amount.price.toString()}
      />
      <meta property="product:price:currency" content="INR" />
      <meta
        property="og:availability"
        content={product.qty > 0 ? "instock" : "outofstock"}
      />

      {/* Twitter */}
      <meta name="twitter:card" content="product" />
      <meta name="twitter:title" content={product.name} />
      <meta name="twitter:description" content={product.description} />
      <meta name="twitter:image" content={product.images[0].url} />

      {/* Enhanced Open Graph Tags */}
      <meta property="og:site_name" content="Style Glitter" />
      <meta
        property="og:price:standard_amount"
        content={product.amount.price.toString()}
      />
      <meta property="og:brand" content="Style Glitter" />
      <meta property="og:color" content={product.color || ""} />
      <meta property="og:condition" content="new" />
      <meta property="og:category" content={product.category?.name} />

      {/* Multiple images support */}
      {product.images.map((image, index) => (
        <React.Fragment key={index}>
          <meta property="og:image" content={image.url} />
          <meta
            property="og:image:alt"
            content={`${product.name} - View ${index + 2}`}
          />
        </React.Fragment>
      ))}

      {/* Additional product details */}
      <meta property="product:age_group" content="adult" />
      <meta property="product:target_gender" content="female" />
      <meta
        property="product:retailer_item_id"
        content={product.id.toString()}
      />
      <meta
        property="product:item_group_id"
        content={product.category?.id.toString()}
      />

      {/* Pinterest specific */}
      <meta name="pinterest:price:currency" content="INR" />
      <meta
        name="pinterest:price:amount"
        content={product.amount.price.toString()}
      />
      <meta
        name="pinterest:product:availability"
        content={product.qty > 0 ? "in stock" : "out of stock"}
      />

      {/* Additional Product Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.images.map((img) => img.url),
            sku: product.slug,
            mpn: product.slug,
            brand: {
              "@type": "Brand",
              name: "Style Glitter",
            },
            offers: {
              "@type": "Offer",
              url: `${process.env.NEXT_PUBLIC_APP_URL}/products/${product.slug}`,
              priceCurrency: "INR",
              price: product.amount.price,
              availability:
                product.qty > 0
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
            },
            category: {
              "@type": "Thing",
              name: product.category?.name,
            },
          }),
        }}
      />
    </>
  );
};
