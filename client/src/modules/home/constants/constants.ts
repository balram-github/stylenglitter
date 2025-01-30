// import DreamyCollectionsBanner from "../../../../public/images/banners/dreamy-collections.jpeg";
// import EarringsSaleBanner from "../../../../public/images/banners/earrings-sale.jpeg";
// import AntiTarnishSaleBanner from "../../../../public/images/banners/anti-tarnish-necklace-sale.jpeg";
import EarringsBuyTwoGetOne from "../../../../public/images/banners/earrings-buy-two-get-one-free.jpeg";
import NecklacesBuyTwoGetOne from "../../../../public/images/banners/necklaces-buy-two-get-one-free.jpeg";

export const REVALIDATE_HOME_PAGE = 60 * 60; // 1hr

export const BannersData = [
  // {
  //   title: "Shop your dreamy collections",
  //   image: DreamyCollectionsBanner,
  // },
  // {
  //   title: "Shop any 5 earrings for just Rs. 499",
  //   image: EarringsSaleBanner,
  //   redirectUrl: "/product-themes/earrings-sale",
  // },
  // {
  //   title: "Shop any 3 Anti Tarnish Necklaces for just Rs. 699",
  //   image: AntiTarnishSaleBanner,
  //   redirectUrl: "/product-themes/necklace-sale",
  // },
  {
    title: "Buy 2 Necklaces, Get 1 Free",
    image: NecklacesBuyTwoGetOne,
    redirectUrl: "/product-themes/necklace-sale",
  },
  {
    title: "Buy 2 Earrings, Get 1 Free",
    image: EarringsBuyTwoGetOne,
    redirectUrl: "/product-themes/earrings-sale",
  },
];
