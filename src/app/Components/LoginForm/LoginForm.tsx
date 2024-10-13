"use client";
import React, { useState } from "react";
import { Label } from "@/Components/Custominput/Customlabel";
import { Input } from "@/Components/Custominput/Custominput";
import { cn } from "@/utils/cn";
import { useUser } from "@/Context/UserContext";
import { decodeToken } from "@/utils/jwt";
import { getRoleFromToken } from "@/utils/getRoleFromToken";

interface LoginFormProps {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const [nomUtilisateur, setNomUtilisateur] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [afficherMotDePasse, setAfficherMotDePasse] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const { setRole, role } = useUser();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: nomUtilisateur,
          password: motDePasse,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Quelque chose s'est mal passé");
      }
      const data = await response.json();
      const decodedToken = decodeToken(data.access);
      setRole(decodedToken.role);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      if (getRoleFromToken() == "Personnel") {
        window.location.href = "/Dashboard";
      } else {
        window.location.href = "/Dashboard";
      }
    } catch (error) {
      if (error instanceof Error) {
        setErreur(error.message);
        console.error("Erreur de connexion:", error.message);
      } else {
        setErreur("Une erreur inconnue s'est produite");
        console.error("Erreur de connexion:", error);
      }
    }
  };
  const toggleAfficherMotDePasse = () => {
    setAfficherMotDePasse(!afficherMotDePasse);
  };
  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 z-20 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Bienvenue chez Leoni HRCore
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Connectez-vous pour commencer
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="nomUtilisateur">Nom d&lsquo;utilisateur</Label>
          <Input
            id="nomUtilisateur"
            placeholder="Votre Nom d'utilisateur"
            type="text"
            value={nomUtilisateur}
            onChange={(e) => setNomUtilisateur(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="motDePasse">Mot de passe</Label>
          <div className="relative">
            <Input
              id="motDePasse"
              placeholder="••••••••"
              type={afficherMotDePasse ? "text" : "password"}
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleAfficherMotDePasse}
              className="absolute text-sm inset-y-0 right-0 flex items-center px-4 text-gray-600 dark:text-gray-400"
            >
              {afficherMotDePasse ? "Cacher" : "Montrer"}
            </button>
          </div>
          <a
            href="/PasswordReset"
            className="text-cyan-500 text-sm dark:text-cyan-400"
          >
            <p className="text-neutral-600 text-sm dark:text-neutral-300">
              Mot de passe oublié?
            </p>
          </a>
        </LabelInputContainer>
        {erreur && <p className="text-red-500 text-sm mb-4">{erreur}</p>}

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Connexion
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

export default LoginForm;
