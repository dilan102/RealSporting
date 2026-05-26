"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { easeOut } from "@/lib/motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function RevealSection({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    amount: 0.16,
    margin: "-6% 0px -6% 0px",
    once: true,
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
          transition: { duration: 0.68, delay, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
