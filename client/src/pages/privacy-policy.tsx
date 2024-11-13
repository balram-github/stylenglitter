import { PrivacyPolicySeo } from "@/seo/privacy-policy.seo";
import Head from "next/dist/shared/lib/head";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <PrivacyPolicySeo />
      </Head>
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Privacy Policy
          </h1>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            This Privacy Policy outlines the types of information we collect,
            how we use it, and the measures we take to protect your privacy. By
            using our website or any of our services, you agree to the terms
            outlined in this policy.
          </p>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Information We Collect:
          </h3>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Personal Information:</strong> When you make a purchase,
              register for an account,we may collect personal information such
              as your name, email address, shipping address, and payment
              details.
            </li>
            <li>
              <strong>Browsing Information:</strong> We may collect non-personal
              information, including your IP address, browser type, and device
              information, to enhance your experience on our website.
            </li>
            <li>
              <strong>Cookies:</strong> We use cookies to improve site
              functionality and personalize your experience. You can control
              cookie preferences through your browser settings.
            </li>
          </ul>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            How We Use Your Information:
          </h3>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Order Processing:</strong> We use your personal
              information to process and fulfill your orders, communicate with
              you regarding your purchase, and provide customer support.
            </li>
            <li>
              <strong>Improving User Experience:</strong> Non-personal
              information helps us analyze website usage patterns, optimize site
              functionality, and enhance user experience.
            </li>
          </ul>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Information Security:
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Style Glitter</strong> employs industry-standard security
            measures to protect your personal information. We use secure sockets
            layer (SSL) technology to encrypt data during transmission, and we
            regularly update our security protocols to ensure the integrity of
            your information.
          </p>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Third-Party Disclosure:
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            We do not sell, trade, or transfer your personal information to
            third parties without your consent. However, we may share
            information with trusted third parties who assist us in operating
            our website, conducting business, or serving you, provided that they
            agree to keep the information confidential.
          </p>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Your Rights:
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            You have the right to access, update, or delete your personal
            information. To exercise these rights or inquire about the
            information we hold, please contact us at{" "}
            <a href="mailto:styleglitter001@gmail.com" className="underline">
              styleglitter001@gmail.com
            </a>
          </p>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Contact Information:
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            If you have any questions or concerns regarding this Privacy Policy
            or the security of your information, please contact us at{" "}
            <a href="mailto:styleglitter001@gmail.com" className="underline">
              styleglitter001@gmail.com
            </a>
          </p>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Changes to the Privacy Policy:
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Style Glitter</strong> reserves the right to update or
            modify this Privacy Policy at any time. We recommend reviewing this
            page periodically to stay informed about how we collect, use, and
            protect your information.
          </p>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;
