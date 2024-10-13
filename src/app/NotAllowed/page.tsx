import React from "react";
import Notallowed from "@/images/6909923.jpg";
import Image from "next/image";

function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Access non autorisé
      </h1>
      <Image
        src={Notallowed}
        alt="Not allowed"
        width={500}
        height={500}
        className="border-4 rounded-lg border-red-500 shadow-lg"
      />
    </div>
  );
}

export default Page;
