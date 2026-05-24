"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { easeOut } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function RevealSection({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.18,
    margin: "-8% 0px -8% 0px",
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {
          opacity: 0,
          y: 36,
          scale: 0.985,
          filter: "blur(10px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.62, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
