import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Confetti from "@/components/ui/confetti";

export const GeneratingInterface = ({
  progress,
  showConfetti,
}: {
  progress: number;
  showConfetti: boolean;
}) => {
  return (
    <motion.div className="h-[600px] bg-[#0F1729] rounded-lg overflow-hidden border border-cyan-500/20 flex items-center justify-center">
      <div className="text-center space-y-6">
        <Sparkles className="w-12 h-12 text-cyan-500 mx-auto animate-spin" />
        <p className="text-cyan-500">Generating your website...</p>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-violet-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500">{Math.floor(progress)}%</p>
      </div>
      {showConfetti && <Confetti />}
    </motion.div>
  );
};
