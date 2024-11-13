import { AboutUsSeo } from "@/seo/about-us.seo";
import Head from "next/head";
import React from "react";

const AboutUs = () => {
  return (
    <>
      <Head>
        <AboutUsSeo />
      </Head>
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            About Us
          </h1>
          <div className="text-gray-700">
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Welcome to <strong>Style Glitter</strong>, where the essence of
              elegance dances with the allure of sparkle! Our brand is a
              celebration of individuality, offering a curated collection of
              fashion jewelry that speaks to the heart of every style
              enthusiast.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              At <strong>Style Glitter</strong>, we understand that jewelry is
              more than just an accessory, it&apos;s a reflection of who you
              are. Our designs blend classic sophistication with modern
              aesthetics, ensuring that each piece tells its own unique story.
              From shimmering earrings that catch the light to delicate
              necklaces that layer beautifully, our collection invites you to
              explore your creativity and express your personal style.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Crafted with love and attention to detail, every item in our
              collection is made to last, combining high-quality materials with
              innovative designs. Whether you&apos;re dressing up for a night
              out or seeking that perfect finishing touch for your everyday
              ensemble, Style Glitter empowers you to shine brightly in every
              moment.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Join us on this sparkling journey, and discover the magic of
              accessorizing with Style Glitter—where every piece is a
              celebration of you!
            </p>
            <h2 className="text-base md:text-lg font-bold my-6 md:my-8">
              Why Choose Style Glitter?
            </h2>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              <strong>Trendy Designs:</strong> Our collections are inspired by
              the latest fashion trends, ensuring that you always stay ahead of
              the curve.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              <strong>Affordable Luxury:</strong> We make high-quality, stylish
              jewelry accessible to everyone, offering the perfect balance of
              affordability and elegance.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              <strong>Unforgettable Pieces:</strong> Each piece is crafted with
              care and attention to detail, designed to be cherished and
              remembered.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutUs;
