// "use client";

// import { ReactNode } from "react";
// import { AnimatePresence } from "framer-motion";
// import { usePathname } from "next/navigation";
// import PageTransition from "./PageTransition";

// interface AnimatedLayoutProps {
//   children: ReactNode;
// }

// export default function AnimatedLayout({ children }: AnimatedLayoutProps) {
//   const pathname = usePathname();

//   return (
//     <AnimatePresence mode="wait" initial={false}>
//       <PageTransition key={pathname}>{children}</PageTransition>
//     </AnimatePresence>
//   );
// }
// //
