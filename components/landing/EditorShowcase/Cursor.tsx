import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
// import { cn } from "../../lib/utils";

interface CursorProps {
  position: { x: number; y: number };
  clicking?: boolean;
  className?: string;
}

export const Cursor = ({ position, clicking, className }: CursorProps) => {
  return (
    <motion.div
      className={cn("pointer-events-none z-50", className)}
      animate={{
        x: position.x - 5,
        y: position.y - 5,
        scale: clicking ? 0.8 : 1,
      }}
      transition={{
        duration: 0.15,
        ease: "linear",
      }}
    >
      {/* Cursor */}
      <div className="w-5 h-5">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.16667 15.8333L5.35834 16.6417L16.6417 5.35833L15.8333 4.16666L4.16667 15.8333Z"
            fill="white"
          />
          <path
            d="M2 2L2 12.5L5.35833 16.6417L15.8333 4.16667L2 2Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Click effect */}
      {clicking && (
        <motion.div
          className="absolute inset-0 bg-white/30 rounded-full"
          initial={{ scale: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};
