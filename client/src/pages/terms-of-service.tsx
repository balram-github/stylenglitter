import { TermsOfServiceSeo } from "@/seo/terms-of-service";
import Head from "next/dist/shared/lib/head";
import React from "react";

const TermsOfService = () => {
  return (
    <>
      <Head>
        <TermsOfServiceSeo />
      </Head>
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Terms of Service
          </h1>
          <div className="text-gray-700">
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              By accessing or using our platform, you agree to comply with and
              be bound by these terms. Please read them carefully.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              1. Acceptance of Terms:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              By accessing or using the Style Glitter website and services, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service. If you do not agree with any part of
              these terms, please refrain from using our platform.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              2. Product Information:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Style Glitter strives to provide accurate and up-to-date
              information about our products. However, we do not warrant the
              accuracy, completeness, or reliability of any product descriptions
              or information on our website. The use of our products is at your
              own risk.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              3. Orders and Payments:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              When you place an order on the Style Glitter website, you agree to
              provide accurate and complete information. All payments are
              processed securely, and we do not store any payment information on
              our servers. Prices are subject to change without notice.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              4. Shipping and Delivery:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              We aim to process and ship orders promptly. However, delivery
              times may vary based on location and other factors. Style Glitter
              is not responsible for any delays or issues caused by third-party
              shipping carriers.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              5. Returns and Refunds:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Please refer to our Return Policy for information on returns,
              replacements, and refunds. By making a purchase on Style Glitter,
              you agree to abide by the terms outlined in our Return Policy.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              6. User Accounts:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Creating an account on the Style Glitter website may be required
              for certain services. You are responsible for maintaining the
              confidentiality of your account information, including your
              username and password. Any actions taken under your account are
              your responsibility.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              7. Intellectual Property:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              All content on the Style Glitter website, including images, text,
              logos, and designs, is the intellectual property of Style Glitter.
              You may not use, reproduce, or distribute our content without
              express written permission.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              8. Privacy:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Your privacy is important to us. By using Style Glitter, you agree
              to the terms outlined in our Privacy Policy, which describes how
              we collect, use, and protect your personal information.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              9. Governing Law:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              These Terms of Service are governed by and constructed in
              accordance with the laws of Haryana. Any disputes arising from
              these terms will be subject to the exclusive jurisdiction of the
              courts in Haryana.
            </p>
            <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
              10. Changes to Terms:
            </h3>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              Style Glitter reserves the right to update, modify, or replace
              these Terms of Service at any time. Changes will be effective upon
              posting to the website. Continued use of our platform after any
              changes constitute acceptance of the revised terms.
            </p>
            <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
              If you have any questions or concerns about these terms, please
              contact us at{" "}
              <a href="mailto:styleglitter001@gmail.com" className="underline">
                styleglitter001@gmail.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsOfService;
