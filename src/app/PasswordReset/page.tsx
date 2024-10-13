"use client";
import Image from "next/image";
import logo from "@/images/blacklogo.png";
import React, { useEffect } from "react";
import { AuroraBackground } from "@/Components/Aurora/aurora";
import ResetPwdForm from "@/Components/ResestPwdForm/ResetPwdForm";

function Login() {
  useEffect(() => {
    const responst = fetch("api/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application",
        Authorization: `Bearer ${localStorage.getItem("refresh")}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Failed to refresh token");
      })
      .then((data) => {
        localStorage.setItem("access", data.access);
      })
      .then(() => {
        window.location.href = "/Dashboard";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  return (
    <AuroraBackground className="h-screen">
      <nav className="flex justify-between m-10">
        <Image src={logo} alt="logo" width={300} />
      </nav>
      <ResetPwdForm />
    </AuroraBackground>
  );
}

export default Login;
