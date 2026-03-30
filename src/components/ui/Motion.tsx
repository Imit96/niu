"use client";

import { motion, Variants, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

function useFadeUpVariant(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 30 },
    visible: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.8, ease: "easeOut" } },
  };
}

function useStaggerContainer(): Variants {
  const reduce = useReducedMotion();
  return {
    hidden: { opacity: reduce ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.2 },
    },
  };
}

export function StaggerSection({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const staggerContainer = useStaggerContainer();
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" as any }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function StaggerDiv({ children, className }: { children: ReactNode; className?: string }) {
  const staggerContainer = useStaggerContainer();
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10%" as any }}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeUpDiv({ children, className }: { children: ReactNode; className?: string }) {
  const fadeUpVariant = useFadeUpVariant();
  return (
    <motion.div variants={fadeUpVariant} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeUpSection({ children, className }: { children: ReactNode; className?: string }) {
  const fadeUpVariant = useFadeUpVariant();
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" as any }}
      variants={fadeUpVariant}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export function FadeUpH1({ children, className }: { children: ReactNode; className?: string }) {
  const fadeUpVariant = useFadeUpVariant();
  return <motion.h1 variants={fadeUpVariant} className={className}>{children}</motion.h1>;
}

export function FadeUpH2({ children, className }: { children: ReactNode; className?: string }) {
  const fadeUpVariant = useFadeUpVariant();
  return <motion.h2 variants={fadeUpVariant} className={className}>{children}</motion.h2>;
}

export function FadeUpP({ children, className }: { children: ReactNode; className?: string }) {
  const fadeUpVariant = useFadeUpVariant();
  return <motion.p variants={fadeUpVariant} className={className}>{children}</motion.p>;
}
