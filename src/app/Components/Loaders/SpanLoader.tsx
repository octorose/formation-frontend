import { LeapFrog } from "@uiball/loaders";
import { motion } from "framer-motion";

function SpanLoader() {
  return (
    <div className="py-1 flex justify-center items-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { scale: 0.5, opacity: 0 },
          visible: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
        }}
      >
        <LeapFrog size={25} speed={1.75} color="black" />
      </motion.div>
    </div>
  );
}

export default SpanLoader;
