"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode, ElementType } from "react";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export function StaggerSection({ children, className, id }: { children: ReactNode, className?: string, id?: string }) {
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

export function StaggerDiv({ children, className }: { children: ReactNode, className?: string }) {
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

export function FadeUpDiv({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <motion.div variants={fadeUpVariant} className={className}>
      {children}
    </motion.div>
  );
}

export function FadeUpSection({ children, className }: { children: ReactNode, className?: string }) {
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

export function FadeUpH1({ children, className }: { children: ReactNode, className?: string }) {
  return <motion.h1 variants={fadeUpVariant} className={className}>{children}</motion.h1>;
}

export function FadeUpH2({ children, className }: { children: ReactNode, className?: string }) {
  return <motion.h2 variants={fadeUpVariant} className={className}>{children}</motion.h2>;
}

export function FadeUpP({ children, className }: { children: ReactNode, className?: string }) {
  return <motion.p variants={fadeUpVariant} className={className}>{children}</motion.p>;
}
