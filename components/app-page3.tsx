// 'use client'

// import React, { useState, useEffect } from 'react'
// import { motion, AnimatePresence } from 'framer-motion'
// import { Moon, Sun, Code, Layout, Cpu, Upload, MessageSquare, PenTool, ChevronRight } from 'lucide-react'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Switch } from "@/components/ui/switch"
// import Link from 'next/link'
// import Image from 'next/image'

// // Utility function for class names
// const cn = (...classes: string[]) => classes.filter(Boolean).join(' ')

// // BorderBeam component
// const BorderBeam = ({
//   className,
//   size = 200,
//   duration = 15,
//   anchor = 90,
//   borderWidth = 1.5,
//   colorFrom = "#ffaa40",
//   colorTo = "#9c40ff",
//   delay = 0,
// }) => {
//   return (
//     <div
//       style={{
//         "--size": size,
//         "--duration": duration,
//         "--anchor": anchor,
//         "--border-width": borderWidth,
//         "--color-from": colorFrom,
//         "--color-to": colorTo,
//         "--delay": `-${delay}s`,
//       } as React.CSSProperties}
//       className={cn(
//         "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
//         "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
//         "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
//         className
//       )}
//     />
//   );
// };

// export function Page() {
//   const [darkMode, setDarkMode] = useState(false)
//   const [isScrolled, setIsScrolled] = useState(false)

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//   }

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10)
//     }
//     window.addEventListener('scroll', handleScroll)
//     return () => window.removeEventListener('scroll', handleScroll)
//   }, [])

//   return (
//     <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
//       <div className="absolute inset-0 z-0">
//         <div className={`absolute inset-0 bg-gradient-to-br ${darkMode ? 'from-gray-800 to-gray-900' : 'from-indigo-100 to-purple-100'}`} />
//         <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
//           <defs>
//             <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
//               <path d="M 40 0 L 0 0 0 40" fill="none" stroke={darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
//             </pattern>
//           </defs>
//           <rect width="100%" height="100%" fill="url(#grid)" />
//         </svg>
//         <MovingBlob darkMode={darkMode} />
//       </div>
//       <div className="relative z-10">
//         <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : ''}`}>
//           <div className="container mx-auto px-4 py-4 flex justify-between items-center">
//             <motion.h1
//               className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//             >
//               AI Website Builder
//             </motion.h1>
//             <nav className="flex items-center space-x-6">
//               <Link href="#features" className="hover:text-indigo-500 transition-colors text-sm font-medium">Features</Link>
//               <Link href="#how-it-works" className="hover:text-indigo-500 transition-colors text-sm font-medium">How It Works</Link>
//               <Link href="#pricing" className="hover:text-indigo-500 transition-colors text-sm font-medium">Pricing</Link>
//               <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
//               <AnimatePresence mode="wait" initial={false}>
//                 <motion.div
//                   key={darkMode ? 'dark' : 'light'}
//                   initial={{ y: -20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   exit={{ y: 20, opacity: 0 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
//                 </motion.div>
//               </AnimatePresence>
//             </nav>
//           </div>
//         </header>

//         <main className="pt-16">
//           <HeroSection darkMode={darkMode} />
//           <FeaturesSection darkMode={darkMode} />
//           <HowItWorksSection darkMode={darkMode} />
//           <TestimonialsSection darkMode={darkMode} />
//           <PricingSection darkMode={darkMode} />
//           <CtaSection darkMode={darkMode} />
//         </main>

//         <Footer darkMode={darkMode} />
//       </div>
//     </div>
//   )
// }

// function MovingBlob({ darkMode }) {
//   return (
//     <motion.div
//       className={`absolute top-0 left-0 w-[800px] h-[800px] rounded-full ${
//         darkMode
//           ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30'
//           : 'bg-gradient-to-r from-indigo-300/30 to-purple-300/30'
//       } opacity-30 blur-3xl`}
//       animate={{
//         x: [0, 100, 0],
//         y: [0, 50, 0],
//         scale: [1, 1.1, 1],
//       }}
//       transition={{
//         duration: 20,
//         repeat: Infinity,
//         repeatType: "reverse",
//       }}
//     />
//   )
// }

// function HeroSection({ darkMode }) {
//   return (
//     <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center">
//       <div className="md:w-1/2 mb-10 md:mb-0">
//         <motion.h2
//           className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           Build Your Dream Website with AI
//         </motion.h2>
//         <motion.p
//           className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//         >
//           Create stunning, personalized websites in minutes with our AI-powered platform. No coding required.
//         </motion.p>
//         <motion.div
//           className="flex space-x-4"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//         >
//           <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full relative overflow-hidden">
//             Get Started
//             <BorderBeam />
//           </Button>
//           <Button size="lg" variant="outline" className={`border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 px-8 py-3 rounded-full relative overflow-hidden ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
//             Watch Demo
//             <BorderBeam colorFrom="#9c40ff" colorTo="#ffaa40" />
//           </Button>
//         </motion.div>
//       </div>
//       <motion.div
//         className="md:w-1/2"
//         initial={{ opacity: 0, x: 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5, delay: 0.2 }}
//       >
//         <Image
//           src="/placeholder.svg?height=400&width=600"
//           alt="AI Website Builder"
//           width={600}
//           height={400}
//           className="rounded-lg shadow-2xl"
//         />
//       </motion.div>
//     </section>
//   )
// }

// function FeaturesSection({ darkMode }) {
//   const features = [
//     { icon: <MessageSquare className="h-8 w-8 mb-4 text-indigo-500" />, title: "AI-Powered Chat", description: "Describe your website and let our AI do the rest" },
//     { icon: <Layout className="h-8 w-8 mb-4 text-indigo-500" />, title: "Stunning Designs", description: "Choose from a variety of beautiful, customizable templates" },
//     { icon: <PenTool className="h-8 w-8 mb-4 text-indigo-500" />, title: "Easy Customization", description: "Edit any part of your website with simple instructions" },
//     { icon: <Code className="h-8 w-8 mb-4 text-indigo-500" />, title: "Code Export", description: "Download your website's code for further customization" },
//     { icon: <Upload className="h-8 w-8 mb-4 text-indigo-500" />, title: "One-Click Publish", description: "Publish your website to a free subdomain instantly" },
//     { icon: <Cpu className="h-8 w-8 mb-4 text-indigo-500" />, title: "AI-Driven Optimization", description: "Automatically optimize your site for performance and SEO" },
//   ]

//   return (
//     <section id="features" className="container mx-auto px-4 py-20">
//       <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Powerful Features</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//         {features.map((feature, index) => (
//           <motion.div
//             key={index}
//             className={`p-6 rounded-xl ${
//               darkMode
//                 ? 'bg-gray-800/30 backdrop-blur-md border border-gray-700/50'
//                 : 'bg-white/30 backdrop-blur-md border border-gray-200/50'
//             } shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//             whileHover={{ scale: 1.05 }}
//           >
//             {feature.icon}
//             <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
//             <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
//             <BorderBeam />
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }

// function HowItWorksSection({ darkMode }) {
//   const steps = [
//     { title: "Describe Your Vision", description: "Chat with our AI and describe the website you want to create" },
//     { title: "AI Generates Design", description: "Our AI creates a stunning design based on your requirements" },
//     { title: "Customize and Refine", description: "Easily modify any part of your website with simple instructions" },
//     { title: "Publish and Share", description: "Publish your website to a free subdomain or export the code" },
//   ]

//   return (
//     <section id="how-it-works" className="container mx-auto px-4 py-20">
//       <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">How It Works</h2>
//       <div className="max-w-4xl mx-auto">
//         {steps.map((step, index) => (
//           <motion.div
//             key={index}
//             className="flex items-center mb-12 last:mb-0"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.2 }}
//           >
//             <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xl mr-6 relative overflow-hidden">
//               {index + 1}
//               <BorderBeam />
//             </div>
//             <div>
//               <h3 className="text-2xl font-semibold mb-2">{step.title}</h3>
//               <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{step.description}</p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }

// function TestimonialsSection({ darkMode }) {
//   const testimonials = [
//     { name: "John Doe", role: "Entrepreneur", quote: "This AI website builder saved me so much time and money. I was able to create a professional-looking website for my business in just a few hours!", avatar: "/placeholder.svg?height=80&width=80" },
//     { name: "Jane Smith", role: "Freelance Designer", quote: "As a designer, I was skeptical at first, but the AI-generated designs are impressive. It's a great starting point for my projects.", avatar: "/placeholder.svg?height=80&width=80" },
//     { name: "Mike Johnson", role: "Small Business Owner", quote: "I'm not tech-savvy, but this platform made it easy for me to create and maintain my own website. It's a game-changer!", avatar: "/placeholder.svg?height=80&width=80" },
//   ]

//   return (
//     <section className="container mx-auto px-4 py-20">
//       <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">What Our Users Say</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
//         {testimonials.map((testimonial, index) => (
//           <motion.div
//             key={index}
//             className={`p-6 rounded-xl ${
//               darkMode
//                 ? 'bg-gray-800/30 backdrop-blur-md border border-gray-700/50'
//                 : 'bg-white/30 backdrop-blur-md border border-gray-200/50'
//             } shadow-lg relative overflow-hidden`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//           >
//             <div className="flex items-center mb-4">
//               <Image src={testimonial.avatar} alt={testimonial.name} width={60} height={60} className="rounded-full mr-4" />
//               <div>
//                 <p className="font-semibold">{testimonial.name}</p>
//                 <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{testimonial.role}</p>
//               </div>
//             </div>
//             <p className={`italic ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>"{testimonial.quote}"</p>
//             <BorderBeam />
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }

// function PricingSection({ darkMode }) {
//   const plans = [
//     { name: "Basic", price: "$9.99/mo", features: ["AI Website Generation", "Free Subdomain", "Basic Customization", "24/7 Support"] },
//     { name: "Pro", price: "$19.99/mo", features: ["Everything in Basic", "Custom Domain", "Advanced AI Editing", "Priority Support", "SEO Tools"] },
//     { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Dedicated Account Manager", "Custom AI Training", "SLA", "White-label Solution"] },
//   ]

//   return (
//     <section id="pricing" className="container mx-auto px-4 py-20">
//       <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Choose Your Plan</h2>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
//         {plans.map((plan, index) => (
//           <motion.div
//             key={index}
//             className={`p-8 rounded-xl ${
//               darkMode
//                 ? 'bg-gray-800/30 backdrop-blur-md border border-gray-700/50'
//                 : 'bg-white/30 backdrop-blur-md border border-gray-200/50'
//             } shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: index * 0.1 }}
//           >
//             <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
//             <p className="text-4xl font-bold mb-6 text-indigo-600">{plan.price}</p>
//             <ul className="space-y-3 mb-8">
//               {plan.features.map((feature, featureIndex) => (
//                 <li key={featureIndex} className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   <ChevronRight className="h-5 w-5 mr-2 text-indigo-500" />
//                   {feature}
//                 </li>
//               ))}
//             </ul>
//             <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full relative overflow-hidden">
//               Choose Plan
//               <BorderBeam />
//             </Button>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }

// function CtaSection({ darkMode }) {
//   return (
//     <section className="py-20 relative overflow-hidden">
//       <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90' : 'bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90'}`} />
//       <div className="container mx-auto px-4 text-center relative z-10">
//         <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Build Your Dream Website?</h2>
//         <p className="text-xl mb-8 max-w-2xl mx-auto text-white opacity-90">Join thousands of satisfied users and create your stunning website today with our AI-powered platform.</p>
//         <Button size="lg" className={`${darkMode ? 'bg-white text-indigo-900' : 'bg-indigo-100 text-indigo-600'} hover:bg-opacity-90 px-8 py-3 rounded-full text-lg font-semibold relative overflow-hidden`}>
//           Get Started for Free
//           <BorderBeam colorFrom="#9c40ff" colorTo="#ffaa40" />
//         </Button>
//       </div>
//     </section>
//   )
// }

// function Footer({ darkMode }) {
//   return (
//     <footer className={darkMode ? 'bg-gray-800 py-12' : 'bg-gray-100 py-12'}>
//       <div className="container mx-auto px-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-lg font-semibold mb-4 text-indigo-600">AI Website Builder</h3>
//             <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Creating stunning websites with the power of AI</p>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4 text-indigo-600">Product</h4>
//             <ul className="space-y-2">
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Features</Link></li>
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</Link></li>
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>FAQ</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4 text-indigo-600">Company</h4>
//             <ul className="space-y-2">
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>About Us</Link></li>
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Careers</Link></li>
//               <li><Link href="#" className={`hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Contact</Link></li>
//             </ul>
//           </div>
//           <div>
//             <h4 className="text-lg font-semibold mb-4 text-indigo-600">Stay Updated</h4>
//             <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Subscribe to our newsletter for the latest updates</p>
//             <form className="flex">
//               <Input type="email" placeholder="Enter your email" className={`rounded-l-full ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} />
//               <Button type="submit" className="rounded-r-full bg-indigo-600 hover:bg-indigo-700 text-white relative overflow-hidden">
//                 Subscribe
//                 <BorderBeam />
//               </Button>
//             </form>
//           </div>
//         </div>
//         <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//           <p>&copy; {new Date().getFullYear()} AI Website Builder. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }
