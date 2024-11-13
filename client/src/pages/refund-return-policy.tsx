import { CONTACT_EMAIL, CONTACT_PHONE } from "@/constants";
import { RefundReturnPolicySeo } from "@/seo/refund-return-policy.seo";
import Head from "next/dist/shared/lib/head";
import React from "react";

const RefundReturnPolicy = () => {
  return (
    <>
      <Head>
        <RefundReturnPolicySeo />
      </Head>
      <main className="container px-4 mx-auto">
        <div className="py-6 md:py-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-8 md:mb-12">
            Refund & Return Policy
          </h1>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Refund Policy
          </h3>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Refund Approval:</strong>
              <ul className="list-disc list-inside">
                <li>
                  We would require a proper opening video of the damaged
                  product, we will notify you of the approval or rejection of
                  your refund.
                </li>
                <li>
                  Refunds related to product quality will not be entertained.
                </li>
              </ul>
            </li>
          </ul>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Refund Process:</strong>
              <ul className="list-disc list-inside">
                <li>
                  If approved, your refund will be processed within 2-5 working
                  days.
                </li>
                <li>
                  The refund will be issued to your original method of payment.
                </li>
              </ul>
            </li>
          </ul>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Cancellation Policy
          </h3>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Cancellation Period:</strong> Orders once placed cannot be
              canceled.
            </li>
          </ul>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Contact Information
          </h3>
          <ul className="list-disc list-inside text-base md:text-lg mb-4 md:mb-8 leading-8">
            <li>
              <strong>Email:</strong>{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <strong>WhatsApp:</strong>{" "}
              <a href={`https://wa.me/${CONTACT_PHONE}`} className="underline">
                {CONTACT_PHONE}
              </a>
            </li>
          </ul>
          <h3 className="text-base md:text-lg mb-4 font-bold leading-8">
            Policy Changes
          </h3>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            <strong>Style Glitter</strong> reserves the right to amend this
            Return, Refund, and Cancellation Policy at any time. Any changes
            will be posted on this page, and customers will be notified via
            email.
          </p>
          <p className="text-base md:text-lg mb-4 md:mb-8 leading-8">
            By shopping with <strong>Style Glitter</strong>, you agree to this
            Return, Refund, and Cancellation Policy. Thank you for your
            understanding and cooperation.
          </p>
        </div>
      </main>
    </>
  );
};

export default RefundReturnPolicy;
