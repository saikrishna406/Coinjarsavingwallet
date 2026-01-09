"use client";
import { motion } from "framer-motion";

export const ScrollIndicator = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer z-20"
            onClick={() => {
                const featuresSection = document.getElementById("features");
                featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
        >
            <div className="w-[30px] h-[50px] rounded-full border-2 border-white/30 flex justify-center items-start p-2">
                <motion.div
                    animate={{
                        y: [0, 24, 0],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatType: "loop",
                    }}
                    className="w-1 h-1 rounded-full bg-white mb-1"
                />
            </div>
        </motion.div>
    );
};
