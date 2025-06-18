"use client";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const PlaceholderIllustration = () => {
  return (
    <svg
      width="500"
      height="500"
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <rect width="500" height="500" rx="12" fill="#f3f4f6" />
      <circle cx="250" cy="200" r="50" fill="#e5e7eb" />
      <rect x="150" y="280" width="200" height="8" rx="4" fill="#e5e7eb" />
      <rect x="175" y="310" width="150" height="6" rx="3" fill="#f3f4f6" />
    </svg>
  );
};

export const PlaceholderDemo = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {

  return (
    <div className={cn("relative group", className)}>
      <AnimatePresence>
        {(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {children || <PlaceholderIllustration />}
      </div>
    </div>
  );
}; 