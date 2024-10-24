import Image from "next/image";
import React from "react";
import Banner from "../../../../../public/images/banners/banner-1.jpeg";

export const Banners = () => {
  return (
    <div className="relative w-full md:my-4">
      <Image
        priority
        src={Banner}
        alt="700k Sale"
        sizes="100vw"
        style={{
          width: "100%",
          height: "auto",
        }}
      />
    </div>
  );
};
