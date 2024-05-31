import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// @ts-ignore
export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}