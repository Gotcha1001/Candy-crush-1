// "use client";

// import { motion } from "framer-motion";
// import Link from "next/link";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 flex flex-col items-center justify-center p-4">
//       <motion.div
//         className="text-center max-w-2xl"
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//       >
//         <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
//           Candy Crush Saga
//         </h1>
//         <p className="text-xl text-white/80 mb-8">
//           Embark on a sweet adventure! Match candies, complete levels, and
//           satisfy your sweet tooth!
//         </p>
//         <Link href="/game/level1">
//           <motion.button
//             className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 rounded-xl text-xl font-semibold"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Play Now
//           </motion.button>
//         </Link>
//       </motion.div>
//     </div>
//   );
// }

// "use client";

// import { motion, useAnimation } from "framer-motion";
// import Link from "next/link";
// import { useEffect } from "react";

// export default function Home() {
//   const candyControls = useAnimation();

//   useEffect(() => {
//     // Animate floating candies
//     candyControls.start({
//       y: [0, -20, 0],
//       rotate: [0, 10, -10, 0],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     });
//   }, [candyControls]);

//   const floatingCandies = [
//     { emoji: "🍭", delay: 0, x: "10%", y: "20%" },
//     { emoji: "🍬", delay: 0.5, x: "85%", y: "15%" },
//     { emoji: "🧁", delay: 1, x: "15%", y: "70%" },
//     { emoji: "🍪", delay: 1.5, x: "80%", y: "75%" },
//     { emoji: "🍰", delay: 2, x: "50%", y: "10%" },
//   ];

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Background image with overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: "url(/images/candy-background1.jpg)",
//         }}
//       >
//         <div className="absolute inset-0 bg-black/30"></div>
//       </div>

//       {/* Floating candy decorations */}
//       {floatingCandies.map((candy, index) => (
//         <motion.div
//           key={index}
//           className="absolute text-4xl md:text-6xl opacity-70 pointer-events-none z-10"
//           style={{ left: candy.x, top: candy.y }}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{
//             opacity: 0.7,
//             scale: 1,
//             y: [0, -30, 0],
//             rotate: [0, 15, -15, 0],
//           }}
//           transition={{
//             delay: candy.delay,
//             duration: 0.8,
//             y: {
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: candy.delay,
//             },
//             rotate: {
//               duration: 6,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: candy.delay + 1,
//             },
//           }}
//         >
//           {candy.emoji}
//         </motion.div>
//       ))}

//       {/* Sparkling particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-70"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               scale: [0, 1, 0],
//               opacity: [0, 1, 0],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: i * 0.2,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
//         <motion.div
//           className="text-center max-w-4xl"
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           {/* Game logo with enhanced styling */}
//           <motion.div
//             className="mb-8"
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{
//               delay: 0.3,
//               duration: 0.8,
//               type: "spring",
//               bounce: 0.4,
//             }}
//           >
//             <motion.h1
//               className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4 drop-shadow-2xl"
//               style={{
//                 textShadow:
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                 filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
//               }}
//               animate={{
//                 textShadow: [
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                   "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,105,180,0.5)",
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                 ],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               CANDY
//             </motion.h1>
//             <motion.h2
//               className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300"
//               style={{
//                 textShadow: "0 0 30px rgba(255,255,255,0.5)",
//                 filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
//               }}
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//             >
//               CRUSH SAGA
//             </motion.h2>
//           </motion.div>

//           {/* Subtitle with typewriter effect */}
//           <motion.p
//             className="text-xl md:text-3xl text-white font-bold mb-12 max-w-3xl mx-auto leading-relaxed"
//             style={{
//               textShadow: "0 4px 8px rgba(0,0,0,0.5)",
//               background:
//                 "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//               backdropFilter: "blur(10px)",
//               borderRadius: "16px",
//               padding: "24px",
//               border: "1px solid rgba(255,255,255,0.2)",
//             }}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7, duration: 0.8 }}
//           >
//             🌟 Match magical candies in the sweetest puzzle adventure! 🌟
//             <br />
//             <span className="text-lg md:text-xl text-yellow-200 font-semibold">
//               Crush your way through hundreds of deliciously challenging levels!
//             </span>
//           </motion.p>

//           {/* Enhanced action buttons */}
//           <motion.div
//             className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9, duration: 0.6 }}
//           >
//             <Link href="/game/level1">
//               <motion.button
//                 className="group relative px-12 py-5 text-2xl font-black text-white overflow-hidden rounded-2xl"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 50%, #ff6b6b 100%)",
//                   boxShadow:
//                     "0 8px 32px rgba(255,107,107,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
//                 }}
//                 whileHover={{
//                   scale: 1.08,
//                   boxShadow:
//                     "0 12px 40px rgba(255,107,107,0.6), inset 0 1px 2px rgba(255,255,255,0.4)",
//                   y: -2,
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.6 }}
//                 />
//                 <span className="relative z-10 flex items-center gap-3">
//                   🎮 PLAY NOW
//                 </span>
//               </motion.button>
//             </Link>

//             <Link href="/about">
//               <motion.button
//                 className="group px-12 py-5 text-2xl font-bold text-white border-3 border-white rounded-2xl backdrop-blur-sm"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//                   boxShadow:
//                     "0 8px 32px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.2)",
//                 }}
//                 whileHover={{
//                   scale: 1.05,
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
//                   boxShadow: "0 12px 40px rgba(255,255,255,0.2)",
//                   y: -2,
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <span className="flex items-center gap-3">✨ LEARN MORE</span>
//               </motion.button>
//             </Link>
//           </motion.div>

//           {/* Feature highlights */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.1, duration: 0.8 }}
//           >
//             {[
//               { icon: "🍭", title: "Sweet Challenges", desc: "200+ Levels" },
//               {
//                 icon: "💎",
//                 title: "Special Candies",
//                 desc: "Power-ups Galore",
//               },
//               { icon: "🏆", title: "Epic Rewards", desc: "Daily Bonuses" },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="p-6 rounded-2xl backdrop-blur-md"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//                 }}
//                 whileHover={{
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//                 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <div className="text-4xl mb-3">{feature.icon}</div>
//                 <h3 className="text-xl font-bold text-white mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-white/80 font-semibold">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { motion, useAnimation } from "framer-motion";
// import Link from "next/link";
// import { useEffect } from "react";

// export default function Home() {
//   const candyControls = useAnimation();

//   useEffect(() => {
//     // Animate floating candies
//     candyControls.start({
//       y: [0, -20, 0],
//       rotate: [0, 10, -10, 0],
//       transition: {
//         duration: 3,
//         repeat: Infinity,
//         ease: "easeInOut",
//       },
//     });
//   }, [candyControls]);

//   const floatingCandies = [
//     { emoji: "🍭", delay: 0, x: "10%", y: "20%" },
//     { emoji: "🍬", delay: 0.5, x: "85%", y: "15%" },
//     { emoji: "🧁", delay: 1, x: "15%", y: "70%" },
//     { emoji: "🍪", delay: 1.5, x: "80%", y: "75%" },
//     { emoji: "🍰", delay: 2, x: "50%", y: "10%" },
//   ];

//   return (
//     <div className="min-h-screen relative overflow-hidden">
//       {/* Animated gradient background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-900 to-pink-900">
//         <div className="absolute inset-0 bg-gradient-to-tl from-yellow-300/20 via-transparent to-cyan-300/20 animate-pulse"></div>
//       </div>

//       {/* Floating candy decorations */}
//       {floatingCandies.map((candy, index) => (
//         <motion.div
//           key={index}
//           className="absolute text-4xl md:text-6xl opacity-70 pointer-events-none z-10"
//           style={{ left: candy.x, top: candy.y }}
//           initial={{ opacity: 0, scale: 0 }}
//           animate={{
//             opacity: 0.7,
//             scale: 1,
//             y: [0, -30, 0],
//             rotate: [0, 15, -15, 0],
//           }}
//           transition={{
//             delay: candy.delay,
//             duration: 0.8,
//             y: {
//               duration: 4,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: candy.delay,
//             },
//             rotate: {
//               duration: 6,
//               repeat: Infinity,
//               ease: "easeInOut",
//               delay: candy.delay + 1,
//             },
//           }}
//         >
//           {candy.emoji}
//         </motion.div>
//       ))}

//       {/* Sparkling particles */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         {[...Array(15)].map((_, i) => (
//           <motion.div
//             key={i}
//             className="absolute w-2 h-2 bg-white rounded-full opacity-70"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//             }}
//             animate={{
//               scale: [0, 1, 0],
//               opacity: [0, 1, 0],
//             }}
//             transition={{
//               duration: 2,
//               repeat: Infinity,
//               delay: i * 0.2,
//               ease: "easeInOut",
//             }}
//           />
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
//         <motion.div
//           className="text-center max-w-4xl"
//           initial={{ opacity: 0, y: 100 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1, ease: "easeOut" }}
//         >
//           {/* Game logo with enhanced styling */}
//           <motion.div
//             className="mb-8"
//             initial={{ scale: 0.5, opacity: 0 }}
//             animate={{ scale: 1, opacity: 1 }}
//             transition={{
//               delay: 0.3,
//               duration: 0.8,
//               type: "spring",
//               bounce: 0.4,
//             }}
//           >
//             <motion.h1
//               className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-400 to-purple-900 mb-4 drop-shadow-2xl"
//               style={{
//                 textShadow:
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                 filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
//               }}
//               animate={{
//                 textShadow: [
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                   "0 0 40px rgba(255,255,255,0.8), 0 0 80px rgba(255,105,180,0.5)",
//                   "0 0 30px rgba(255,255,255,0.5), 0 0 60px rgba(255,105,180,0.3)",
//                 ],
//               }}
//               transition={{
//                 duration: 3,
//                 repeat: Infinity,
//                 ease: "easeInOut",
//               }}
//             >
//               CANDY
//             </motion.h1>
//             <motion.h2
//               className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-teal-500 to-indigo-500"
//               style={{
//                 textShadow: "0 0 30px rgba(255,255,255,0.5)",
//                 filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
//               }}
//               initial={{ x: -50, opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               transition={{ delay: 0.5, duration: 0.8 }}
//             >
//               CRUSH SAGA
//             </motion.h2>
//           </motion.div>

//           {/* Subtitle with typewriter effect */}
//           <motion.p
//             className="text-xl md:text-3xl text-white font-bold mb-12 max-w-3xl mx-auto leading-relaxed"
//             style={{
//               textShadow: "0 4px 8px rgba(0,0,0,0.5)",
//               background:
//                 "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//               backdropFilter: "blur(10px)",
//               borderRadius: "16px",
//               padding: "24px",
//               border: "1px solid rgba(255,255,255,0.2)",
//             }}
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.7, duration: 0.8 }}
//           >
//             🌟 Match magical candies in the sweetest puzzle adventure! 🌟
//             <br />
//             <span className="text-lg md:text-xl text-teal-500 font-semibold">
//               Crush your way through hundreds of deliciously challenging levels!
//             </span>
//           </motion.p>

//           {/* Enhanced action buttons */}
//           <motion.div
//             className="flex flex-col sm:flex-row justify-center gap-6 mb-12"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.9, duration: 0.6 }}
//           >
//             <Link href="/game/1">
//               <motion.button
//                 className="group relative px-12 py-5 text-2xl font-black text-white overflow-hidden rounded-2xl"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, #20b2aa 0%, #48d1cc 50%, #20b2aa 100%)",
//                   boxShadow:
//                     "0 8px 32px rgba(32,178,170,0.4), inset 0 1px 2px rgba(255,255,255,0.3)",
//                 }}
//                 whileHover={{
//                   scale: 1.08,
//                   boxShadow:
//                     "0 12px 40px rgba(255,107,107,0.6), inset 0 1px 2px rgba(255,255,255,0.4)",
//                   y: -2,
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                   initial={{ x: "-100%" }}
//                   whileHover={{ x: "100%" }}
//                   transition={{ duration: 0.6 }}
//                 />
//                 <span className="relative z-10 flex items-center gap-3">
//                   🎮 PLAY NOW
//                 </span>
//               </motion.button>
//             </Link>

//             {/* <Link href="/about">
//               <motion.button
//                 className="group px-12 py-5 text-2xl font-bold text-white border-3 border-white rounded-2xl backdrop-blur-sm"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
//                   boxShadow:
//                     "0 8px 32px rgba(255,255,255,0.1), inset 0 1px 2px rgba(255,255,255,0.2)",
//                 }}
//                 whileHover={{
//                   scale: 1.05,
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
//                   boxShadow: "0 12px 40px rgba(255,255,255,0.2)",
//                   y: -2,
//                 }}
//                 whileTap={{ scale: 0.95 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               >
//                 <span className="flex items-center gap-3">✨ LEARN MORE</span>
//               </motion.button>
//             </Link> */}
//           </motion.div>

//           {/* Feature highlights */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 1.1, duration: 0.8 }}
//           >
//             {[
//               { icon: "🍭", title: "Sweet Challenges", desc: "200+ Levels" },
//               {
//                 icon: "💎",
//                 title: "Special Candies",
//                 desc: "Power-ups Galore",
//               },
//               { icon: "🏆", title: "Epic Rewards", desc: "Daily Bonuses" },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className="p-6 rounded-2xl backdrop-blur-md"
//                 style={{
//                   background:
//                     "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
//                   border: "1px solid rgba(255,255,255,0.2)",
//                   boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
//                 }}
//                 whileHover={{
//                   scale: 1.05,
//                   y: -5,
//                   boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
//                 }}
//                 transition={{ type: "spring", stiffness: 300 }}
//               >
//                 <div className="text-4xl mb-3">{feature.icon}</div>
//                 <h3 className="text-xl font-bold text-white mb-2">
//                   {feature.title}
//                 </h3>
//                 <p className="text-white/80 font-semibold">{feature.desc}</p>
//               </motion.div>
//             ))}
//           </motion.div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }
"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  const candyControls = useAnimation();

  useEffect(() => {
    // Animate floating candies
    candyControls.start({
      y: [0, -20, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [candyControls]);

  const floatingCandies = [
    { emoji: "🍭", delay: 0, x: "8%", y: "15%" },
    { emoji: "🍬", delay: 0.7, x: "88%", y: "12%" },
    { emoji: "🧁", delay: 1.2, x: "12%", y: "68%" },
    { emoji: "🍪", delay: 1.8, x: "85%", y: "72%" },
    { emoji: "🍰", delay: 2.3, x: "52%", y: "8%" },
    { emoji: "🍩", delay: 0.4, x: "25%", y: "85%" },
    { emoji: "🎂", delay: 1.5, x: "75%", y: "45%" },
    { emoji: "🍫", delay: 2.1, x: "5%", y: "45%" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced animated gradient background with darker purples */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900">
        <div className="absolute inset-0 bg-gradient-to-tl from-pink-800/30 via-transparent to-cyan-700/25 animate-pulse"></div>
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800/20 to-transparent animate-pulse"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        ></div>
      </div>

      {/* Enhanced floating candy decorations with random movements */}
      {floatingCandies.map((candy, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl md:text-6xl opacity-80 pointer-events-none z-10"
          style={{ left: candy.x, top: candy.y }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0.6, 0.9, 0.7, 0.8],
            scale: [0.8, 1.1, 0.9, 1],
            x: [
              0,
              Math.sin(index * 0.5) * 40 + Math.random() * 30 - 15,
              0,
              Math.cos(index * 0.7) * 35 + Math.random() * 25 - 12,
            ],
            y: [
              0,
              Math.cos(index * 0.3) * 50 + Math.random() * 40 - 20,
              0,
              Math.sin(index * 0.9) * 45 + Math.random() * 35 - 17,
            ],
            rotate: [
              0,
              Math.random() * 30 - 15,
              Math.random() * 40 - 20,
              Math.random() * 25 - 12,
              0,
            ],
          }}
          transition={{
            delay: candy.delay,
            duration: 0.8,
            opacity: {
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: candy.delay,
            },
            scale: {
              duration: 5 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: candy.delay + 0.5,
            },
            x: {
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: candy.delay,
            },
            y: {
              duration: 7 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: candy.delay + 0.3,
            },
            rotate: {
              duration: 9 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: candy.delay + 1,
            },
          }}
        >
          {candy.emoji}
        </motion.div>
      ))}

      {/* Enhanced sparkling particles with varied sizes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full opacity-70 ${
              i % 3 === 0
                ? "w-3 h-3 bg-white"
                : i % 3 === 1
                ? "w-2 h-2 bg-yellow-300"
                : "w-1.5 h-1.5 bg-pink-300"
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.2, 0.8, 1, 0],
              opacity: [0, 0.8, 1, 0.6, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          className="text-center max-w-4xl"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Enhanced game logo */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              type: "spring",
              bounce: 0.4,
            }}
          >
            <motion.h1
              className="text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-4 drop-shadow-2xl"
              style={{
                textShadow:
                  "0 0 40px rgba(255,192,203,0.6), 0 0 80px rgba(147,51,234,0.4)",
                filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.4))",
              }}
              animate={{
                textShadow: [
                  "0 0 40px rgba(255,192,203,0.6), 0 0 80px rgba(147,51,234,0.4)",
                  "0 0 60px rgba(255,192,203,0.8), 0 0 100px rgba(147,51,234,0.6)",
                  "0 0 40px rgba(255,192,203,0.6), 0 0 80px rgba(147,51,234,0.4)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              CANDY
            </motion.h1>
            <motion.h2
              className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-400 to-violet-400"
              style={{
                textShadow: "0 0 40px rgba(196,181,253,0.6)",
                filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.4))",
              }}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              CRUSH SAGA
            </motion.h2>
          </motion.div>

          {/* Enhanced subtitle */}
          <motion.p
            className="text-xl md:text-3xl text-white font-bold mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow: "0 4px 12px rgba(0,0,0,0.6)",
              background:
                "linear-gradient(135deg, rgba(139,69,193,0.3) 0%, rgba(88,28,135,0.2) 100%)",
              backdropFilter: "blur(15px)",
              borderRadius: "20px",
              padding: "28px",
              border: "2px solid rgba(196,181,253,0.3)",
              boxShadow: "0 8px 32px rgba(139,69,193,0.2)",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            🌟 Match magical candies in the sweetest puzzle adventure! 🌟
            <br />
            <span className="text-lg md:text-xl text-pink-300 font-semibold">
              Crush your way through hundreds of deliciously challenging levels!
            </span>
          </motion.p>

          {/* Enhanced play button */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href="/game/1">
              <motion.button
                className="group relative px-16 py-6 text-3xl font-black text-white overflow-hidden rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)",
                  boxShadow:
                    "0 12px 40px rgba(236,72,153,0.5), inset 0 2px 4px rgba(255,255,255,0.3)",
                }}
                whileHover={{
                  scale: 1.1,
                  boxShadow:
                    "0 16px 50px rgba(236,72,153,0.7), inset 0 2px 4px rgba(255,255,255,0.4)",
                  y: -4,
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center gap-4">
                  🎮 PLAY NOW
                </span>
              </motion.button>
            </Link>
          </motion.div>

          {/* Enhanced feature highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {[
              { icon: "🍭", title: "Sweet Challenges", desc: "200+ Levels" },
              {
                icon: "💎",
                title: "Special Candies",
                desc: "Power-ups Galore",
              },
              { icon: "🏆", title: "Epic Rewards", desc: "Daily Bonuses" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-3xl backdrop-blur-md"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139,69,193,0.25) 0%, rgba(88,28,135,0.15) 100%)",
                  border: "2px solid rgba(196,181,253,0.3)",
                  boxShadow: "0 12px 40px rgba(139,69,193,0.15)",
                }}
                whileHover={{
                  scale: 1.08,
                  y: -8,
                  boxShadow: "0 20px 60px rgba(139,69,193,0.25)",
                  background:
                    "linear-gradient(135deg, rgba(139,69,193,0.35) 0%, rgba(88,28,135,0.25) 100%)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-purple-200 font-semibold text-lg">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
