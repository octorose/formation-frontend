import { LeapFrog } from "@uiball/loaders";
import { motion } from "framer-motion";

function GlobalLoader() {
  return (
    <div className=" w-screen h-screen  flex justify-center items-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
        }}
      >
        <LeapFrog size={60} speed={1.75} color="red" />;
      </motion.div>
    </div>
  );
}

export default GlobalLoader;
