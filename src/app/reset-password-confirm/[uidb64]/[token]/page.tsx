"use client";
import React from "react";
import ResetPasswordConfirmForm from "@/Components/PasswordResetConfirmForm/PasswordResetConfirmForm";
import Image from "next/image";
import logo from "@/images/blacklogo.png"; 
import { AuroraBackground } from "@/Components/Aurora/aurora";

interface ResetPasswordConfirmPageProps {
  params: { uidb64: string; token: string };
}

const ResetPasswordConfirmPage: React.FC<ResetPasswordConfirmPageProps> = ({
  params,
}) => {
  const { uidb64, token } = params;
  console.log(params);
  
  console.log("UID:", uidb64);
  console.log("Token:", token);

  if (!uidb64 || !token) {
    return <div>Invalid reset password link.</div>;
  }

  return (
     <AuroraBackground className="h-screen">
      <nav className="flex justify-between m-10">
        <Image src={logo} alt="logo" width={300} />
      </nav>
      
      <ResetPasswordConfirmForm uidb64={uidb64} token={token} />
    </AuroraBackground>
 );
};

export default ResetPasswordConfirmPage;
