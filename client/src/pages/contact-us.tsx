import { ContactUsSeo } from "@/seo/contact-us.seo";
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_HOURS, ADDRESS } from "@/constants";
import React from "react";

const ContactUs = () => {
  return (
    <>
      <ContactUsSeo />
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Contact Us
          </h1>
        </div>
        <div className="text-gray-700">
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Contact:</strong>{" "}
            <a href={`tel:${CONTACT_PHONE}`} className="underline">
              {CONTACT_PHONE}
            </a>{" "}
            ({CONTACT_HOURS})
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Email:</strong>{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Address:</strong> {ADDRESS}
          </p>
        </div>
      </main>
    </>
  );
};

export default ContactUs;
