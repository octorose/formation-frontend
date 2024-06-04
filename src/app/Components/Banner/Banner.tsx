"use client";
import { useScroll, useTransform } from "framer-motion";
import React from "react";
import { GoogleGeminiEffect } from "../GoogleGeminiEffect/GoogleGeminiEffect";
import { AuroraBackground } from "../Aurora/aurora";

function Banner() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.7], [0, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.5], [0, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.3], [0, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.1], [0, 1.2]);

  return (
    <AuroraBackground>
      <div className="h-[400vh] relative w-full gr overflow-clip" ref={ref}>
        <GoogleGeminiEffect
          title="Leoni HR-Core"
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
      </div>
    </AuroraBackground>
  );
}

export default Banner;
