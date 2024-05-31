import { LeapFrog } from "@uiball/loaders";
import { motion, MotionConfig } from "framer-motion";

const MotionLoaderWithSpiner = () => {
  return (
    <div className=" w-full h-screen  flex justify-center items-center">
      <MotionConfig reducedMotion="user">
        <div className="example-container">
          <motion.div
            animate={{
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1],
              repeat: Infinity,
              repeatDelay: 1,
            }}
          >
            <LeapFrog size={80} speed={1.75} color="blue" />
          </motion.div>
        </div>
      </MotionConfig>
    </div>
  );
};

export default MotionLoaderWithSpiner;
