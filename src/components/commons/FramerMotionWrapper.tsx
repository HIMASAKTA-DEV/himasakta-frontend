import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: VariantKey;
  duration?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
  className?: string;
  id?: string;
}

type VariantKey =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "fadeLeft"
  | "fadeRight"
  | "zoomIn"
  | "blurIn"
  | "rotateIn";

const variantsMap: Record<VariantKey, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  },
  fadeDown: {
    hidden: { opacity: 0, y: -40 },
    show: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -60 },
    show: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 60 },
    show: { opacity: 1, x: 0 },
  },
  zoomIn: {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    show: { opacity: 1, filter: "blur(0px)" },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -10, scale: 0.9 },
    show: { opacity: 1, rotate: 0, scale: 1 },
  },
};

export default function FramerMotionWrapper({
  children,
  variant = "fadeUp",
  duration = 0.6,
  delay = 0,
  once = false,
  amount = 0.2,
  className = "",
  id,
}: Props) {
  const selected = variantsMap[variant];

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      variants={selected}
      transition={{ duration, delay, ease: "easeOut" }}
      viewport={{ once, amount }}
      className={className}
      id={id}
    >
      {children}
    </motion.section>
  );
}
