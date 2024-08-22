'use client';
import React from "react";
import Notallowed from "@/images/6909923.jpg";
import Image from "next/image";
import { Verified } from "lucide-react";
import logo from "@/images/blacklogo.png";
function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <Image src={logo} alt="logo" width={300} />
      <h1 className="text-4xl font-bold text-gray-800 mt-8 ">
        Verification terminer avec succès
      </h1>
        <Verified size={100} />
        <p className="text-gray-800 mt-8">
            Félicitation votre compte a été vérifié avec succès
        </p>
        <p className="text-gray-800 mt-8">
            Vous pouvez maintenant vous connecter apres que votre group ait été validé par un administrateur
        </p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8" onClick = {() => window.location.href = "/Signin"}>
            retourner à la page de connexion
        </button>
    </div>
  );
}

export default Page;
