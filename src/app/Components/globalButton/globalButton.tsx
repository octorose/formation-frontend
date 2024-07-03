/* eslint-disable react/display-name */
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { forwardRef, ButtonHTMLAttributes, DetailedHTMLProps } from "react";

// @Desc : red , Black, white, gray
type color = "ft-lp" | "ft-ls" | "ft-lt" | "ft-ts";

// @Desc : create
type textColor = "text-ft-lp" | "text-ft-ls" | "text-ft-lt" | "text-ft-ts" | "";
type bgColor = "bg-ft-lp" | "bg-ft-ls" | "bg-ft-lt" | "bg-ft-ts" | "";
type onHovertextColor =
  | "hover:text-ft-lp"
  | "hover:text-ft-ls"
  | "hover:text-ft-lt"
  | "hover:text-ft-ts";
type onHoverBgColor =
  | "hover:bg-ft-lp"
  | "hover:bg-ft-ls"
  | "hover:bg-ft-lt"
  | "hover:bg-ft-ts";

// @Desc : button type
interface buttonType
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: any;
  bgColor?: bgColor;
  textColor?: textColor;
  onHoverBgColor?: onHoverBgColor;
  onHoverTextColor?: onHovertextColor;
  isDisabled?: boolean;
  className?: string;
  link?: string;
  rest?: any;
  ref?: any;
  openNewTab?: boolean;
  isLoading?: boolean;
}

// @Desc : Custom Button
const Button = forwardRef(
  (
    {
      children,
      onHoverBgColor,
      bgColor,
      textColor,
      onHoverTextColor,
      className,
      isDisabled,
      isLoading,
      ...rest
    }: any,
    ref
  ): JSX.Element => {
    return (
      <motion.button
        disabled={isDisabled || isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`transition-colors duration-[250ms] tracking-[.13rem] disabled:cursor-not-allowed disabled:bg-gray-400  ${
          className ||
          "bg-ft-lp px-10 py-1 font-medium text-white text-base rounded-lg capitalize cursor-pointer"
        } ${bgColor || ""} ${textColor || ""} ${onHoverBgColor || ""} ${
          onHoverTextColor || ""
        } `}
        {...rest}
        innerref={ref}
      >
        {isLoading ? (
          <span className="w-full cursor-not-allowed text-base md:text-lg flex items-center justify-center font-medium text-white h-10 bg-ft-ts/70 rounded-lg">
            <svg
              className="animate-spin h-5 md:h-6 w-5 text-ft-lt"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

/**
 * This Button Component can be link button or simple button by using `link` attribute .
 * @params `bgColor, onHoverBgColor, textColor, onHoverTextColor` for background and text color
 * @params `isDisabled` for disable button
 * @params `className` for add class
 * @params `link` for link button
 * @params `rest` for rest attribute
 * @params `children` for button text
 * @returns `button`
 */
const GlobalButton = forwardRef(
  (
    {
      children,
      bgColor,
      textColor,
      isDisabled = false,
      onHoverBgColor,
      onHoverTextColor,
      className,
      link,
      openNewTab = false,
      isLoading,
      ...rest
    }: buttonType,
    ref
  ): JSX.Element => {
    // const router = useRouter();

    if (link) {
      if (openNewTab) {
        return (
          <a href={link} target={"_blank"} rel="noreferrer">
            <Button
              {...{
                isLoading,
                onHoverBgColor,
                bgColor,
                textColor,
                onHoverTextColor,
                className,
                isDisabled,
                children,
              }}
              {...rest}
              innerref={ref}
            />
          </a>
        );
      }
      return (
        <Link passHref href={link}>
          <Button
            {...{
              isLoading,
              onHoverBgColor,
              bgColor,
              textColor,
              onHoverTextColor,
              className,
              isDisabled,
              children,
            }}
            {...rest}
            innerref={ref}
          />
        </Link>
      );
    }

    return (
      <Button
        {...{
          isLoading,
          onHoverBgColor,
          bgColor,
          textColor,
          onHoverTextColor,
          className,
          isDisabled,
          children,
        }}
        {...rest}
        innerref={ref}
      />
    );
  }
);

export default GlobalButton;
