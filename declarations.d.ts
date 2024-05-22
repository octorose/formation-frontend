import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add type definitions for HTML intrinsic elements used in your project
      div: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLDivElement>,
        HTMLDivElement
      >;
      span: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
      >;
      // Add more elements as needed
    }
  }
}
