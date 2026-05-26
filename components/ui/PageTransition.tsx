"use client";

import { motion } from "framer-motion";
import { pageVariants } from "@/lib/motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate="visible"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
}
