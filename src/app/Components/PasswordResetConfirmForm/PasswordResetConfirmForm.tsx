"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/Components/Custominput/Customlabel";
import { Input } from "@/Components/Custominput/Custominput";
import { cn } from "@/utils/cn";
import { env } from "process";

interface ResetPasswordConfirmFormProps {
  uidb64: string;
  token: string;
}

const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  uidb64,
  token,
}) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const URL = process.env.NEXT_PUBLIC_API_URL;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
       const response = await fetch(
         `${URL}/api/password_reset_confirm/${uidb64}/${token}/`,
         {
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
           body: JSON.stringify({ password: newPassword }),
         }
       );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Something went wrong");
      }

      setSuccess("Password has been reset successfully.");
      setError(null);
      setTimeout(() => {
        router.push("/Signin");
      }, 3000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        console.error("Password reset error:", error.message);
      } else {
        setError("An unknown error occurred");
        console.error("Password reset error:", error);
      }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 z-20 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Reset Your Password
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Enter your new password
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="new-password">New Password</Label>
          <Input
            id="new-password"
            placeholder="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </LabelInputContainer>
        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Reset Password
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default ResetPasswordConfirmForm;
