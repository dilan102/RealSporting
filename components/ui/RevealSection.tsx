"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function RevealSection({ children, className, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "-6% 0px -6% 0px", threshold: 0.16 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className || ""} group/reveal`}
      data-visible={visible}
    >
      <div
        className="translate-y-6 scale-[0.985] opacity-0 transition-all duration-700 ease-out group-data-[visible=true]/reveal:translate-y-0 group-data-[visible=true]/reveal:scale-100 group-data-[visible=true]/reveal:opacity-100"
        style={{ transitionDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}
