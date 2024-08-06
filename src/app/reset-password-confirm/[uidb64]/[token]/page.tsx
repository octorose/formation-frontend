"use client";
import React from "react";
import ResetPasswordConfirmForm from "@/Components/PasswordResetConfirmForm/PasswordResetConfirmForm";

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

  return <ResetPasswordConfirmForm uidb64={uidb64} token={token} />;
};

export default ResetPasswordConfirmPage;
