// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         w-10 h-10 rounded-md cursor-grab active:cursor-grabbing select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//       `}
//             draggable
//             onDragStart={(e) => onDragStart(e, candy)}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 width={40}
//                 height={40}
//                 className="w-full h-full object-contain pointer-events-none"
//                 draggable={false}
//             />
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl"
//             style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                             onDrop={(e) => onDrop(e, candy)}
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             {goal.type === "score" ? (
//                 <div className="text-lg font-bold text-white">
//                     Score: <span className="text-yellow-300">{score}</span>/{goal.target}
//                 </div>
//             ) : goal.type === "jelly" ? (
//                 <div className="text-lg font-bold text-white">
//                     Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                 </div>
//             ) : null}
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         const grid = initializeGrid(levelConfig.gridSize);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//     }, [levelConfig]);

//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();
//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }
//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }
//         setIsAnimating(true);
//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);
//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);
//             const { finalGrid, finalJellyGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies
//             );
//             setGrid(finalGrid);
//             if (levelConfig.goal.type === "jelly") {
//                 setJellyGrid(finalJellyGrid);
//             }
//             if (
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) ||
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0)
//             ) {
//                 setGameStatus("won");
//             } else if (movesLeft - 1 <= 0) {
//                 setGameStatus("lost");
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }
//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const resetGame = () => {
//         const grid = initializeGrid(levelConfig.gridSize);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         router.push(`/game/${levelConfig.id + 1}`);
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-lg w-full"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>
//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />
//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}
//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>
//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}
//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>
//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}
//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;





// "use client";

// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly, candySize }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         rounded-md cursor-grab active:cursor-grabbing select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//       `}
//             style={{
//                 width: candySize,
//                 height: candySize,
//             }}
//             draggable
//             onDragStart={(e) => onDragStart(e, candy)}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 fill
//                 className="rounded-md object-contain pointer-events-none"
//                 draggable={false}
//             />
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     // Calculate candy size based on screen size and grid size
//     // Mobile: smaller base size, Desktop: larger base size
//     const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
//     const baseSize = isMobile ? 45 : 60; // Base size in pixels
//     const maxSize = isMobile ? 50 : 80; // Maximum size in pixels

//     // Calculate size that fits within container considering padding and gaps
//     const availableWidth = isMobile ?
//         Math.min(window.innerWidth * 0.9, 400) : // Mobile: 90% of screen width, max 400px
//         Math.min(window.innerWidth * 0.6, 600);   // Desktop: 60% of screen width, max 600px

//     // Account for container padding (24px total) and gaps (4px * (gridSize - 1))
//     const containerPadding = 24;
//     const totalGaps = 4 * (gridSize - 1);
//     const availableCandySpace = availableWidth - containerPadding - totalGaps;
//     const calculatedSize = Math.floor(availableCandySpace / gridSize);

//     // Use the smaller of calculated size or max size, but not smaller than base size
//     const candySize = Math.max(baseSize, Math.min(calculatedSize, maxSize));

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
//             style={{
//                 gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
//                 width: 'fit-content',
//                 maxWidth: '95vw', // Prevent any overflow
//             }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             style={{
//                                 width: candySize,
//                                 height: candySize,
//                             }}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                             onDrop={(e) => onDrop(e, candy)}
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                                 candySize={`${candySize}px`}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>
//                 {goal.type === "jelly" && (
//                     <span>
//                         {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                     </span>
//                 )}
//                 {goal.type === "score" && (
//                     <span>
//                         {" / "}<span className="text-yellow-300">{goal.target}</span>
//                     </span>
//                 )}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);

//     const router = useRouter();

//     useEffect(() => {
//         const grid = initializeGrid(levelConfig.gridSize);
//         setGrid(grid);

//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//     }, [levelConfig]);

//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     useEffect(() => {
//         if (gameStatus === "playing" && !isAnimating) {
//             if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
//                 console.log("Jelly level won! Remaining jellies:", remainingJellies);
//                 setGameStatus("won");
//             } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
//                 console.log("Score level won! Score:", score, "Target:", levelConfig.goal.target);
//                 setGameStatus("won");
//             }
//         }
//     }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

//     useEffect(() => {
//         if (gameStatus === "playing" && movesLeft === 0) {
//             const goalMet =
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
//             if (!goalMet) {
//                 console.log("Game lost! Moves left:", movesLeft);
//                 setGameStatus("lost");
//             }
//         }
//     }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();

//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }

//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }

//         setIsAnimating(true);

//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);

//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);

//             const { finalGrid, finalJellyGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies,
//                 setJellyGrid
//             );

//             setGrid(finalGrid);

//             if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
//                 setJellyGrid(finalJellyGrid);
//                 const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
//                 setRemainingJellies(newRemainingJellies);
//                 console.log("Updated remaining jellies:", newRemainingJellies);
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }

//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const resetGame = () => {
//         const newGrid = initializeGrid(levelConfig.gridSize);
//         setGrid(newGrid);

//         if (levelConfig.goal.type === "jelly") {
//             const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(newJellyGrid);
//             setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         }

//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         router.push(`/game/${levelConfig.id + 1}`);
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>

//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />

//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}

//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>

//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}

//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>

//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}

//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
//     initializeShellGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly, shell, candySize }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         rounded-md select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//         ${shell && shell.hits > 0 ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
//       `}
//             style={{
//                 width: candySize,
//                 height: candySize,
//             }}
//             draggable={!(shell && shell.hits > 0)}
//             onDragStart={(e) => {
//                 if (shell && shell.hits > 0) {
//                     e.preventDefault();
//                     return;
//                 }
//                 onDragStart(e, candy);
//             }}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: shell && shell.hits > 0 ? 1 : 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 fill
//                 className="rounded-md object-contain pointer-events-none"
//                 draggable={false}
//             />
//             {shell && shell.hits > 0 && (
//                 <div className="absolute inset-0 bg-gray-500/50 rounded-md flex items-center justify-center">
//                     <span className="text-white font-bold">{shell.hits}</span>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     shellGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//     const baseSize = isMobile ? 45 : 60;
//     const maxSize = isMobile ? 50 : 80;
//     const availableWidth = isMobile
//         ? Math.min(window.innerWidth * 0.9, 400)
//         : Math.min(window.innerWidth * 0.6, 600);
//     const containerPadding = 24;
//     const totalGaps = 4 * (gridSize - 1);
//     const availableCandySpace = availableWidth - containerPadding - totalGaps;
//     const candySize = Math.max(baseSize, Math.min(Math.floor(availableCandySpace / gridSize), maxSize));

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
//             style={{
//                 gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
//                 width: "fit-content",
//                 maxWidth: "95vw",
//             }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             style={{
//                                 width: candySize,
//                                 height: candySize,
//                             }}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                         // Removed onDrop to prevent bubbling
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                                 shell={shellGrid ? shellGrid[rowIndex][colIndex] : null}
//                                 candySize={`${candySize}px`}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>
//                 {goal.type === "jelly" && (
//                     <span>
//                         {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                     </span>
//                 )}
//                 {goal.type === "score" && (
//                     <span>
//                         {" / "}<span className="text-yellow-300">{goal.target}</span>
//                     </span>
//                 )}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [shellGrid, setShellGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const lastDropTimestamp = useRef(0); // Debounce drop events
//     const router = useRouter();

//     useEffect(() => {
//         console.log("Initializing level:", levelConfig.id, "Total levels:", levels.length);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//     }, [levelConfig]);

//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     useEffect(() => {
//         if (gameStatus === "playing" && !isAnimating) {
//             if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
//                 console.log("Jelly level won! Level:", levelConfig.id, "Remaining jellies:", remainingJellies);
//                 setGameStatus("won");
//             } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
//                 console.log("Score level won! Level:", levelConfig.id, "Score:", score, "Target:", levelConfig.goal.target);
//                 setGameStatus("won");
//             }
//         }
//     }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

//     useEffect(() => {
//         if (gameStatus === "playing" && movesLeft === 0) {
//             const goalMet =
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
//             if (!goalMet) {
//                 console.log("Game lost! Level:", levelConfig.id, "Moves left:", movesLeft, "Jellies left:", remainingJellies, "Score:", score);
//                 setGameStatus("lost");
//             }
//         }
//     }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         const { row, col } = candy;
//         if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();
//         e.stopPropagation(); // Stop event bubbling
//         const now = Date.now();
//         if (now - lastDropTimestamp.current < 300) {
//             console.log("Debounced duplicate drop event, timestamp:", now);
//             setDraggedCandy(null);
//             return;
//         }
//         lastDropTimestamp.current = now;

//         console.log("handleDrop called, draggedCandy:", JSON.stringify(draggedCandy), "targetCandy:", JSON.stringify(targetCandy));
//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }
//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }
//         const { row: row1, col: col1 } = draggedCandy;
//         const { row: row2, col: col2 } = targetCandy;
//         if (
//             (shellGrid[row1][col1] && shellGrid[row1][col1].hits > 0) ||
//             (shellGrid[row2][col2] && shellGrid[row2][col2].hits > 0)
//         ) {
//             setDraggedCandy(null);
//             return;
//         }

//         setIsAnimating(true);
//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);

//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);
//             const { finalGrid, finalJellyGrid, finalShellGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies,
//                 setJellyGrid,
//                 shellGrid,
//                 setShellGrid,
//                 levelConfig.id
//             );
//             setGrid(finalGrid);
//             if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
//                 setJellyGrid(finalJellyGrid);
//                 const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
//                 setRemainingJellies(newRemainingJellies);
//                 console.log("Updated remaining jellies for level", levelConfig.id, ":", newRemainingJellies);
//             }
//             if (finalShellGrid) {
//                 setShellGrid(finalShellGrid);
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }

//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const resetGame = () => {
//         console.log("Resetting game for level:", levelConfig.id);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(newJellyGrid);
//             setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         const nextLevelId = levelConfig.id + 1;
//         if (nextLevelId <= levels.length) {
//             console.log("Navigating to next level:", nextLevelId);
//             router.push(`/game/${nextLevelId}`);
//         } else {
//             console.log("No more levels available, redirecting to home");
//             router.push("/");
//         }
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>
//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />
//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         shellGrid={shellGrid}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}
//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>
//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}
//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>
//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}
//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color! Break shells by making matches nearby!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;




// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
//     initializeShellGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly, shell, candySize }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         rounded-md select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//         ${shell && shell.hits > 0 ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
//       `}
//             style={{
//                 width: candySize,
//                 height: candySize,
//             }}
//             draggable={!(shell && shell.hits > 0)}
//             onDragStart={(e) => {
//                 if (shell && shell.hits > 0) {
//                     e.preventDefault();
//                     return;
//                 }
//                 onDragStart(e, candy);
//             }}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: shell && shell.hits > 0 ? 1 : 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 fill
//                 className="rounded-md object-contain pointer-events-none"
//                 draggable={false}
//             />
//             {shell && shell.hits > 0 && (
//                 <div className="absolute inset-0 bg-gray-500/50 rounded-md flex items-center justify-center">
//                     <span className="text-white font-bold">{shell.hits}</span>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     shellGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//     const baseSize = isMobile ? 45 : 60;
//     const maxSize = isMobile ? 50 : 80;
//     const availableWidth = isMobile
//         ? Math.min(window.innerWidth * 0.9, 400)
//         : Math.min(window.innerWidth * 0.6, 600);
//     const containerPadding = 24;
//     const totalGaps = 4 * (gridSize - 1);
//     const availableCandySpace = availableWidth - containerPadding - totalGaps;
//     const candySize = Math.max(baseSize, Math.min(Math.floor(availableCandySpace / gridSize), maxSize));

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
//             style={{
//                 gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
//                 width: "fit-content",
//                 maxWidth: "95vw",
//             }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             style={{
//                                 width: candySize,
//                                 height: candySize,
//                             }}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                         // Removed onDrop to prevent bubbling
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                                 shell={shellGrid ? shellGrid[rowIndex][colIndex] : null}
//                                 candySize={`${candySize}px`}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>
//                 {goal.type === "jelly" && (
//                     <span>
//                         {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                     </span>
//                 )}
//                 {goal.type === "score" && (
//                     <span>
//                         {" / "}<span className="text-yellow-300">{goal.target}</span>
//                     </span>
//                 )}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [shellGrid, setShellGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const lastDropTimestamp = useRef(0); // Debounce drop events
//     const router = useRouter();

//     useEffect(() => {
//         console.log("Initializing level:", levelConfig.id, "Total levels:", levels.length);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//     }, [levelConfig]);

//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     useEffect(() => {
//         if (gameStatus === "playing" && !isAnimating) {
//             if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
//                 console.log("Jelly level won! Level:", levelConfig.id, "Remaining jellies:", remainingJellies);
//                 setGameStatus("won");
//             } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
//                 console.log("Score level won! Level:", levelConfig.id, "Score:", score, "Target:", levelConfig.goal.target);
//                 setGameStatus("won");
//             }
//         }
//     }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

//     useEffect(() => {
//         if (gameStatus === "playing" && movesLeft === 0) {
//             const goalMet =
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
//             if (!goalMet) {
//                 console.log("Game lost! Level:", levelConfig.id, "Moves left:", movesLeft, "Jellies left:", remainingJellies, "Score:", score);
//                 setGameStatus("lost");
//             }
//         }
//     }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         const { row, col } = candy;
//         if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();
//         e.stopPropagation(); // Stop event bubbling
//         const now = Date.now();
//         if (now - lastDropTimestamp.current < 300) {
//             console.log("Debounced duplicate drop event, timestamp:", now);
//             setDraggedCandy(null);
//             return;
//         }
//         lastDropTimestamp.current = now;

//         console.log("handleDrop called, draggedCandy:", JSON.stringify(draggedCandy), "targetCandy:", JSON.stringify(targetCandy));
//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }
//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }
//         const { row: row1, col: col1 } = draggedCandy;
//         const { row: row2, col: col2 } = targetCandy;
//         if (
//             (shellGrid[row1][col1] && shellGrid[row1][col1].hits > 0) ||
//             (shellGrid[row2][col2] && shellGrid[row2][col2].hits > 0)
//         ) {
//             setDraggedCandy(null);
//             return;
//         }

//         setIsAnimating(true);
//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);

//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);
//             const { finalGrid, finalJellyGrid, finalShellGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies,
//                 setJellyGrid,
//                 shellGrid,
//                 setShellGrid,
//                 levelConfig.id
//             );
//             setGrid(finalGrid);
//             if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
//                 setJellyGrid(finalJellyGrid);
//                 const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
//                 setRemainingJellies(newRemainingJellies);
//                 console.log("Updated remaining jellies for level", levelConfig.id, ":", newRemainingJellies);
//             }
//             if (finalShellGrid) {
//                 setShellGrid(finalShellGrid);
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }

//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const resetGame = () => {
//         console.log("Resetting game for level:", levelConfig.id);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(newJellyGrid);
//             setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         const nextLevelId = levelConfig.id + 1;
//         if (nextLevelId <= levels.length) {
//             console.log("Navigating to next level:", nextLevelId);
//             router.push(`/game/${nextLevelId}`);
//         } else {
//             console.log("No more levels available, redirecting to home");
//             router.push("/");
//         }
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>
//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />
//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         shellGrid={shellGrid}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}
//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>
//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}
//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>
//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}
//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color! Break shells by making matches nearby!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;




// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
//     initializeShellGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";
// import SaveLoadComponent from "./SaveLoadComponent";


// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly, shell, candySize }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         rounded-md select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//         ${shell && shell.hits > 0 ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
//       `}
//             style={{
//                 width: candySize,
//                 height: candySize,
//             }}
//             draggable={!(shell && shell.hits > 0)}
//             onDragStart={(e) => {
//                 if (shell && shell.hits > 0) {
//                     e.preventDefault();
//                     return;
//                 }
//                 onDragStart(e, candy);
//             }}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: shell && shell.hits > 0 ? 1 : 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 fill
//                 className="rounded-md object-contain pointer-events-none"
//                 draggable={false}
//             />
//             {shell && shell.hits > 0 && (
//                 <div className="absolute inset-0 bg-gray-500/50 rounded-md flex items-center justify-center">
//                     <span className="text-white font-bold">{shell.hits}</span>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     shellGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//     const baseSize = isMobile ? 45 : 60;
//     const maxSize = isMobile ? 50 : 80;
//     const availableWidth = isMobile
//         ? Math.min(window.innerWidth * 0.9, 400)
//         : Math.min(window.innerWidth * 0.6, 600);
//     const containerPadding = 24;
//     const totalGaps = 4 * (gridSize - 1);
//     const availableCandySpace = availableWidth - containerPadding - totalGaps;
//     const candySize = Math.max(Math.min(Math.floor(availableCandySpace / gridSize), maxSize), baseSize);

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
//             style={{
//                 gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
//                 width: "fit-content",
//                 maxWidth: "95vw",
//             }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             style={{
//                                 width: candySize,
//                                 height: candySize,
//                             }}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                                 shell={shellGrid ? shellGrid[rowIndex][colIndex] : null}
//                                 candySize={`${candySize}px`}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>
//                 {goal.type === "jelly" && (
//                     <span>
//                         {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                     </span>
//                 )}
//                 {goal.type === "score" && (
//                     <span>
//                         {" / "}<span className="text-yellow-300">{goal.target}</span>
//                     </span>
//                 )}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [shellGrid, setShellGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const lastDropTimestamp = useRef(0);
//     const router = useRouter();

//     // Initialize game state
//     useEffect(() => {
//         console.log("Initializing level:", levelConfig.id, "Total levels:", levels.length);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(jellyGrid);
//             setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//     }, [levelConfig]);

//     // Background music
//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     // Check win condition
//     useEffect(() => {
//         if (gameStatus === "playing" && !isAnimating) {
//             if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
//                 console.log("Jelly level won! Level:", levelConfig.id, "Remaining jellies:", remainingJellies);
//                 setGameStatus("won");
//             } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
//                 console.log("Score level won! Level:", levelConfig.id, "Score:", score, "Target:", levelConfig.goal.target);
//                 setGameStatus("won");
//             }
//         }
//     }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

//     // Check lose condition
//     useEffect(() => {
//         if (gameStatus === "playing" && movesLeft === 0) {
//             const goalMet =
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
//             if (!goalMet) {
//                 console.log("Game lost! Level:", levelConfig.id, "Moves left:", movesLeft, "Jellies left:", remainingJellies, "Score:", score);
//                 setGameStatus("lost");
//             }
//         }
//     }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         const { row, col } = candy;
//         if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();
//         e.stopPropagation();
//         const now = Date.now();
//         if (now - lastDropTimestamp.current < 300) {
//             console.log("Debounced duplicate drop event, timestamp:", now);
//             setDraggedCandy(null);
//             return;
//         }
//         lastDropTimestamp.current = now;
//         console.log("handleDrop called, draggedCandy:", JSON.stringify(draggedCandy), "targetCandy:", JSON.stringify(targetCandy));
//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }
//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }
//         const { row: row1, col: col1 } = draggedCandy;
//         const { row: row2, col: col2 } = targetCandy;
//         if (
//             (shellGrid[row1][col1] && shellGrid[row1][col1].hits > 0) ||
//             (shellGrid[row2][col2] && shellGrid[row2][col2].hits > 0)
//         ) {
//             setDraggedCandy(null);
//             return;
//         }
//         setIsAnimating(true);
//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);
//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);
//             const { finalGrid, finalJellyGrid, finalShellGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies,
//                 setJellyGrid,
//                 shellGrid,
//                 setShellGrid,
//                 levelConfig.id
//             );
//             setGrid(finalGrid);
//             if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
//                 setJellyGrid(finalJellyGrid);
//                 const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
//                 setRemainingJellies(newRemainingJellies);
//                 console.log("Updated remaining jellies for level", levelConfig.id, ":", newRemainingJellies);
//             }
//             if (finalShellGrid) {
//                 setShellGrid(finalShellGrid);
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }
//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const handleLoadGame = (loadedState) => {
//         setGrid(loadedState.grid);
//         setJellyGrid(loadedState.jellyGrid);
//         setShellGrid(loadedState.shellGrid);
//         setScore(loadedState.score);
//         setMovesLeft(loadedState.movesLeft);
//         setRemainingJellies(loadedState.remainingJellies);
//         setGameStatus(loadedState.gameStatus);
//         setMatchedCandies(loadedState.matchedCandies);
//         setIsAnimating(loadedState.isAnimating);
//     };

//     const resetGame = () => {
//         console.log("Resetting game for level:", levelConfig.id);
//         const { grid, levelId } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(newJellyGrid);
//             setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         const nextLevelId = levelConfig.id + 1;
//         if (nextLevelId <= levels.length) {
//             console.log("Navigating to next level:", nextLevelId);
//             router.push(`/game/${nextLevelId}`);
//         } else {
//             console.log("No more levels available, redirecting to home");
//             router.push("/");
//         }
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     const gameState = {
//         grid,
//         jellyGrid,
//         shellGrid,
//         score,
//         movesLeft,
//         remainingJellies,
//         gameStatus,
//         matchedCandies,
//         isAnimating,
//         levelConfig,
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>
//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />
//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         shellGrid={shellGrid}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}
//                 <SaveLoadComponent gameState={gameState} onLoadGame={handleLoadGame} />
//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>
//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}
//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>
//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}
//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color! Break shells by making matches nearby!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;



// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import {
//     initializeGrid,
//     swapCandies,
//     areAdjacent,
//     processCascadingMatches,
//     findMatches,
//     initializeJellyGrid,
//     initializeShellGrid,
// } from "../data/gameUtils";
// import { levels } from "../data/levels";
// import SaveGameComponent from "./SaveGameComponent";

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched, isJelly, shell, candySize }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//         rounded-md select-none
//         ${isDragging ? "z-50 opacity-80" : "z-10"}
//         ${isMatched ? "opacity-20" : ""}
//         relative
//         ${shell && shell.hits > 0 ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"}
//       `}
//             style={{
//                 width: candySize,
//                 height: candySize,
//             }}
//             draggable={!(shell && shell.hits > 0)}
//             onDragStart={(e) => {
//                 if (shell && shell.hits > 0) {
//                     e.preventDefault();
//                     return;
//                 }
//                 onDragStart(e, candy);
//             }}
//             onDragOver={(e) => onDragOver(e, candy)}
//             onDrop={(e) => onDrop(e, candy)}
//             onDragEnd={(e) => e.preventDefault()}
//             animate={{
//                 scale: isDragging ? 1.2 : 1,
//                 opacity: isMatched ? 0 : 1,
//             }}
//             transition={{
//                 type: "spring",
//                 stiffness: 300,
//                 damping: 20,
//                 opacity: { duration: 0.3 },
//                 scale: { duration: 0.3 },
//             }}
//             whileHover={{ scale: shell && shell.hits > 0 ? 1 : 1.1 }}
//         >
//             <Image
//                 src={candy.image}
//                 alt={isJelly ? "jelly" : `${candy.color} candy`}
//                 fill
//                 className="rounded-md object-contain pointer-events-none"
//                 draggable={false}
//             />
//             {shell && shell.hits > 0 && (
//                 <div className="absolute inset-0 bg-gray-500/50 rounded-md flex items-center justify-center">
//                     <span className="text-white font-bold">{shell.hits}</span>
//                 </div>
//             )}
//         </motion.div>
//     );
// };

// const GameGrid = ({
//     grid,
//     jellyGrid,
//     shellGrid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
//     gridSize,
// }) => {
//     if (!grid || !grid[0] || !grid[0].length) {
//         return null;
//     }

//     const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
//     const baseSize = isMobile ? 45 : 60;
//     const maxSize = isMobile ? 50 : 80;
//     const availableWidth = isMobile
//         ? Math.min(window.innerWidth * 0.9, 400)
//         : Math.min(window.innerWidth * 0.6, 600);
//     const containerPadding = 24;
//     const totalGaps = 4 * (gridSize - 1);
//     const availableCandySpace = availableWidth - containerPadding - totalGaps;
//     const candySize = Math.max(Math.min(Math.floor(availableCandySpace / gridSize), maxSize), baseSize);

//     return (
//         <div
//             className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
//             style={{
//                 gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
//                 width: "fit-content",
//                 maxWidth: "95vw",
//             }}
//         >
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
//                             style={{
//                                 width: candySize,
//                                 height: candySize,
//                             }}
//                             initial={{ y: -100, opacity: 0 }}
//                             animate={{ y: 0, opacity: 1 }}
//                             transition={{
//                                 type: "spring",
//                                 stiffness: 100,
//                                 damping: 20,
//                                 delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
//                             }}
//                             onDragOver={(e) => onDragOver(e, candy)}
//                         >
//                             <Candy
//                                 candy={candy}
//                                 onDragStart={onDragStart}
//                                 onDragOver={onDragOver}
//                                 onDrop={onDrop}
//                                 isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                                 isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
//                                 shell={shellGrid ? shellGrid[rowIndex][colIndex] : null}
//                                 candySize={`${candySize}px`}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>
//                 {goal.type === "jelly" && (
//                     <span>
//                         {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//                     </span>
//                 )}
//                 {goal.type === "score" && (
//                     <span>
//                         {" / "}<span className="text-yellow-300">{goal.target}</span>
//                     </span>
//                 )}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const GameComponent = ({ levelConfig }) => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState(null);
//     const [shellGrid, setShellGrid] = useState(null);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
//     const [remainingJellies, setRemainingJellies] = useState(
//         levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
//     );
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const lastDropTimestamp = useRef(0);
//     const router = useRouter();

//     // Initialize game state and check for loaded state
//     useEffect(() => {
//         console.log(
//             "Initializing level:",
//             levelConfig.id,
//             "Type:",
//             typeof levelConfig.id,
//             "Total levels:",
//             levels.length
//         );
//         const savedState = sessionStorage.getItem("loadedGameState");
//         if (savedState) {
//             try {
//                 const parsedState = JSON.parse(savedState);
//                 parsedState.matchedCandies = new Set(parsedState.matchedCandies);
//                 const savedLevelId = Number(parsedState.levelConfig.id);
//                 console.log("Restoring saved state for level:", savedLevelId, "Current level:", levelConfig.id);
//                 if (savedLevelId === Number(levelConfig.id)) {
//                     setGrid(parsedState.grid);
//                     setJellyGrid(parsedState.jellyGrid);
//                     setShellGrid(parsedState.shellGrid);
//                     setScore(parsedState.score);
//                     setMovesLeft(parsedState.movesLeft);
//                     setRemainingJellies(parsedState.remainingJellies);
//                     setGameStatus(parsedState.gameStatus);
//                     setMatchedCandies(parsedState.matchedCandies);
//                     setIsAnimating(parsedState.isAnimating);
//                     console.log("Game state restored for level:", levelConfig.id);
//                     sessionStorage.removeItem("loadedGameState"); // Clear after successful restore
//                 } else {
//                     console.warn(
//                         "Level mismatch on restore: saved level",
//                         savedLevelId,
//                         "vs current level",
//                         levelConfig.id,
//                         "Initializing fresh game."
//                     );
//                     // Initialize fresh game without alerting
//                     const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//                     setGrid(grid);
//                     if (levelConfig.goal.type === "jelly") {
//                         const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//                         setJellyGrid(jellyGrid);
//                         setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//                     }
//                     const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//                     setShellGrid(newShellGrid);
//                     sessionStorage.removeItem("loadedGameState"); // Clear after mismatch
//                 }
//             } catch (error) {
//                 console.warn("Error restoring saved state, initializing fresh game:", error);
//                 // Initialize fresh game without alerting
//                 const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//                 setGrid(grid);
//                 if (levelConfig.goal.type === "jelly") {
//                     const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//                     setJellyGrid(jellyGrid);
//                     setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//                 }
//                 const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//                 setShellGrid(newShellGrid);
//                 sessionStorage.removeItem("loadedGameState"); // Clear after error
//             }
//         } else {
//             console.log("No saved state found, initializing fresh game for level:", levelConfig.id);
//             const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//             setGrid(grid);
//             if (levelConfig.goal.type === "jelly") {
//                 const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//                 setJellyGrid(jellyGrid);
//                 setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
//             }
//             const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//             setShellGrid(newShellGrid);
//         }
//     }, [levelConfig]);

//     // Background music
//     useEffect(() => {
//         const audio = new Audio("/sounds/background-music.mp3");
//         audio.loop = true;
//         audio.play().catch((error) => console.error("Error playing audio:", error));
//         return () => {
//             audio.pause();
//             audio.currentTime = 0;
//         };
//     }, []);

//     // Check win condition
//     useEffect(() => {
//         if (gameStatus === "playing" && !isAnimating) {
//             if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
//                 console.log("Jelly level won! Level:", levelConfig.id, "Remaining jellies:", remainingJellies);
//                 setGameStatus("won");
//             } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
//                 console.log("Score level won! Level:", levelConfig.id, "Score:", score, "Target:", levelConfig.goal.target);
//                 setGameStatus("won");
//             }
//         }
//     }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

//     // Check lose condition
//     useEffect(() => {
//         if (gameStatus === "playing" && movesLeft === 0) {
//             const goalMet =
//                 (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
//                 (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
//             if (!goalMet) {
//                 console.log("Game lost! Level:", levelConfig.id, "Moves left:", movesLeft, "Jellies left:", remainingJellies, "Score:", score);
//                 setGameStatus("lost");
//             }
//         }
//     }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

//     const handleDragStart = (e, candy) => {
//         if (isAnimating || gameStatus !== "playing") {
//             e.preventDefault();
//             return;
//         }
//         const { row, col } = candy;
//         if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
//             e.preventDefault();
//             return;
//         }
//         setDraggedCandy(candy);
//         e.dataTransfer.effectAllowed = "move";
//         e.dataTransfer.setData("text/plain", JSON.stringify(candy));
//     };

//     const handleDragOver = (e, candy) => {
//         e.preventDefault();
//         e.dataTransfer.dropEffect = "move";
//     };

//     const handleDrop = async (e, targetCandy) => {
//         e.preventDefault();
//         e.stopPropagation();
//         const now = Date.now();
//         if (now - lastDropTimestamp.current < 300) {
//             console.log("Debounced duplicate drop event, timestamp:", now);
//             setDraggedCandy(null);
//             return;
//         }
//         lastDropTimestamp.current = now;
//         console.log("handleDrop called, draggedCandy:", JSON.stringify(draggedCandy), "targetCandy:", JSON.stringify(targetCandy));
//         if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
//             setDraggedCandy(null);
//             return;
//         }
//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }
//         const { row: row1, col: col1 } = draggedCandy;
//         const { row: row2, col: col2 } = targetCandy;
//         if (
//             (shellGrid[row1][col1] && shellGrid[row1][col1].hits > 0) ||
//             (shellGrid[row2][col2] && shellGrid[row2][col2].hits > 0)
//         ) {
//             setDraggedCandy(null);
//             return;
//         }
//         setIsAnimating(true);
//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, levelConfig.gridSize);
//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);
//             const { finalGrid, finalJellyGrid, finalShellGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 levelConfig.gridSize,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies,
//                 setJellyGrid,
//                 shellGrid,
//                 setShellGrid,
//                 levelConfig.id
//             );
//             setGrid(finalGrid);
//             if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
//                 setJellyGrid(finalJellyGrid);
//                 const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
//                 setRemainingJellies(newRemainingJellies);
//                 console.log("Updated remaining jellies for level", levelConfig.id, ":", newRemainingJellies);
//             }
//             if (finalShellGrid) {
//                 setShellGrid(finalShellGrid);
//             }
//         } else {
//             setGrid(swappedGrid);
//             setTimeout(() => {
//                 setGrid(grid);
//             }, 300);
//         }
//         setIsAnimating(false);
//         setDraggedCandy(null);
//     };

//     const resetGame = () => {
//         console.log("Resetting game for level:", levelConfig.id);
//         sessionStorage.removeItem("loadedGameState"); // Clear sessionStorage on reset
//         const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
//         setGrid(grid);
//         if (levelConfig.goal.type === "jelly") {
//             const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
//             setJellyGrid(newJellyGrid);
//             setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         }
//         const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
//         setShellGrid(newShellGrid);
//         setScore(0);
//         setMovesLeft(levelConfig.moves);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         const nextLevelId = Number(levelConfig.id) + 1;
//         sessionStorage.removeItem("loadedGameState"); // Clear sessionStorage before navigating
//         if (nextLevelId <= levels.length) {
//             console.log("Navigating to next level:", nextLevelId);
//             router.push(`/game/${nextLevelId}`);
//         } else {
//             console.log("No more levels available, redirecting to home");
//             router.push("/");
//         }
//     };

//     const getGoalText = (goal) => {
//         if (goal.type === "score") {
//             return `Score ${goal.target} points`;
//         } else if (goal.type === "jelly") {
//             return `Clear all jellies`;
//         }
//         return "";
//     };

//     const gameState = {
//         grid,
//         jellyGrid,
//         shellGrid,
//         score,
//         movesLeft,
//         remainingJellies,
//         gameStatus,
//         matchedCandies,
//         isAnimating,
//         levelConfig,
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level {levelConfig.id}
//                 </h1>
//                 <ScoreDisplay
//                     goal={levelConfig.goal}
//                     score={score}
//                     movesLeft={movesLeft}
//                     remainingJellies={remainingJellies}
//                 />
//                 {grid.length > 0 && (
//                     <GameGrid
//                         grid={grid}
//                         jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
//                         shellGrid={shellGrid}
//                         onDragStart={handleDragStart}
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                         draggedCandy={draggedCandy}
//                         matchedCandies={matchedCandies}
//                         isAnimating={isAnimating}
//                         gridSize={levelConfig.gridSize}
//                     />
//                 )}
//                 <SaveGameComponent gameState={gameState} />
//                 {gameStatus !== "playing" && (
//                     <motion.div
//                         className="mt-6 text-center"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.5 }}
//                     >
//                         <h2 className="text-2xl font-bold text-white mb-4">
//                             {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
//                         </h2>
//                         <p className="text-white/60 mb-4">Final Score: {score}</p>
//                         {gameStatus === "won" && levelConfig.id < levels.length && (
//                             <button
//                                 onClick={goToNextLevel}
//                                 className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                             >
//                                 Next Level
//                             </button>
//                         )}
//                         <button
//                             onClick={resetGame}
//                             className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                         >
//                             Play Again
//                         </button>
//                         <button
//                             onClick={() => router.push("/")}
//                             className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                         >
//                             Back to Home
//                         </button>
//                     </motion.div>
//                 )}
//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color! Break shells by making matches nearby!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default GameComponent;




"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    initializeGrid,
    swapCandies,
    areAdjacent,
    processCascadingMatches,
    findMatches,
    initializeJellyGrid,
    initializeShellGrid,
} from "../data/gameUtils";
import { levels } from "../data/levels";
import SaveGameComponent from "./SaveGameComponent";

const Candy = ({ candy, onDragStart, onDragOver, onDrop, onTouchStart, onTouchMove, onTouchEnd, isDragging, isMatched, isJelly, shell, candySize }) => {
    return (
        <motion.div
            layout
            key={candy.id}
            className={`
        rounded-md select-none
        ${isDragging ? "z-50 opacity-80" : "z-10"}
        ${isMatched ? "opacity-20" : ""}
        relative
        ${shell && shell.hits > 0 ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing touch-pinch-zoom"}
      `}
            style={{
                width: candySize,
                height: candySize,
                touchAction: shell && shell.hits > 0 ? "auto" : "none",
            }}
            draggable={!(shell && shell.hits > 0)}
            onDragStart={(e) => {
                if (shell && shell.hits > 0) {
                    e.preventDefault();
                    return;
                }
                onDragStart(e, candy);
            }}
            onDragOver={(e) => onDragOver(e, candy)}
            onDrop={(e) => onDrop(e, candy)}
            onDragEnd={(e) => e.preventDefault()}
            onTouchStart={(e) => {
                if (shell && shell.hits > 0) {
                    e.preventDefault();
                    return;
                }
                onTouchStart(e, candy);
            }}
            onTouchMove={onTouchMove}
            onTouchEnd={(e) => onTouchEnd(e, candy)}
            animate={{
                scale: isDragging ? 1.2 : 1,
                opacity: isMatched ? 0 : 1,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                opacity: { duration: 0.3 },
                scale: { duration: 0.3 },
            }}
            whileHover={{ scale: shell && shell.hits > 0 ? 1 : 1.1 }}
        >
            <Image
                src={candy.image}
                alt={isJelly ? "jelly" : `${candy.color} candy`}
                fill
                className="rounded-md object-contain pointer-events-none"
                draggable={false}
            />
            {shell && shell.hits > 0 && (
                <div className="absolute inset-0 bg-gray-500/50 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold">{shell.hits}</span>
                </div>
            )}
        </motion.div>
    );
};

const GameGrid = ({
    grid,
    jellyGrid,
    shellGrid,
    onDragStart,
    onDragOver,
    onDrop,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    draggedCandy,
    matchedCandies,
    isAnimating,
    gridSize,
}) => {
    if (!grid || !grid[0] || !grid[0].length) {
        return null;
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const baseSize = isMobile ? 50 : 60; // Increased baseSize for mobile
    const maxSize = isMobile ? 55 : 80;
    const availableWidth = isMobile
        ? Math.min(window.innerWidth * 0.9, 400)
        : Math.min(window.innerWidth * 0.6, 600);
    const containerPadding = 24;
    const totalGaps = 4 * (gridSize - 1);
    const availableCandySpace = availableWidth - containerPadding - totalGaps;
    const candySize = Math.max(Math.min(Math.floor(availableCandySpace / gridSize), maxSize), baseSize);

    return (
        <div
            className="grid gap-1 bg-white/20 p-3 rounded-xl mx-auto"
            style={{
                gridTemplateColumns: `repeat(${gridSize}, ${candySize}px)`,
                width: "fit-content",
                maxWidth: "95vw",
            }}
        >
            <AnimatePresence>
                {grid.map((row, rowIndex) =>
                    row.map((candy, colIndex) => (
                        <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className={`relative ${jellyGrid && jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
                            style={{
                                width: candySize,
                                height: candySize,
                            }}
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
                            }}
                            onDragOver={(e) => onDragOver(e, candy)}
                            data-row={rowIndex}
                            data-col={colIndex}
                        >
                            <Candy
                                candy={candy}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onTouchEnd}
                                isDragging={draggedCandy && draggedCandy.row === rowIndex && draggedCandy.col === colIndex}
                                isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
                                isJelly={jellyGrid && jellyGrid[rowIndex][colIndex]}
                                shell={shellGrid ? shellGrid[rowIndex][colIndex] : null}
                                candySize={`${candySize}px`}
                            />
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};

const ScoreDisplay = ({ goal, score, movesLeft, remainingJellies }) => {
    return (
        <motion.div
            className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-lg font-bold text-white">
                Score: <span className="text-yellow-300">{score}</span>
                {goal.type === "jelly" && (
                    <span>
                        {" | "}Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
                    </span>
                )}
                {goal.type === "score" && (
                    <span>
                        {" / "}<span className="text-yellow-300">{goal.target}</span>
                    </span>
                )}
            </div>
            <div className="text-lg font-bold text-white">
                Moves: <span className="text-yellow-300">{movesLeft}</span>
            </div>
        </motion.div>
    );
};

const GameComponent = ({ levelConfig }) => {
    const [grid, setGrid] = useState([]);
    const [jellyGrid, setJellyGrid] = useState(null);
    const [shellGrid, setShellGrid] = useState(null);
    const [score, setScore] = useState(0);
    const [movesLeft, setMovesLeft] = useState(levelConfig.moves);
    const [remainingJellies, setRemainingJellies] = useState(
        levelConfig.goal.type === "jelly" ? levelConfig.goal.count : 0
    );
    const [gameStatus, setGameStatus] = useState("playing");
    const [draggedCandy, setDraggedCandy] = useState(null);
    const [matchedCandies, setMatchedCandies] = useState(new Set());
    const [isAnimating, setIsAnimating] = useState(false);
    const lastDropTimestamp = useRef(0);
    const touchStartCandy = useRef(null);
    const touchStartPos = useRef(null);
    const touchTargetCandy = useRef(null);
    const router = useRouter();

    // Initialize game state and check for loaded state
    useEffect(() => {
        console.log(
            "Initializing level:",
            levelConfig.id,
            "Type:",
            typeof levelConfig.id,
            "Total levels:",
            levels.length
        );
        const savedState = sessionStorage.getItem("loadedGameState");
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                parsedState.matchedCandies = new Set(parsedState.matchedCandies);
                const savedLevelId = Number(parsedState.levelConfig.id);
                console.log("Restoring saved state for level:", savedLevelId, "Current level:", levelConfig.id);
                if (savedLevelId === Number(levelConfig.id)) {
                    setGrid(parsedState.grid);
                    setJellyGrid(parsedState.jellyGrid);
                    setShellGrid(parsedState.shellGrid);
                    setScore(parsedState.score);
                    setMovesLeft(parsedState.movesLeft);
                    setRemainingJellies(parsedState.remainingJellies);
                    setGameStatus(parsedState.gameStatus);
                    setMatchedCandies(parsedState.matchedCandies);
                    setIsAnimating(parsedState.isAnimating);
                    console.log("Game state restored for level:", levelConfig.id);
                    sessionStorage.removeItem("loadedGameState");
                } else {
                    console.warn(
                        "Level mismatch on restore: saved level",
                        savedLevelId,
                        "vs current level",
                        levelConfig.id,
                        "Initializing fresh game."
                    );
                    const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
                    setGrid(grid);
                    if (levelConfig.goal.type === "jelly") {
                        const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
                        setJellyGrid(jellyGrid);
                        setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
                    }
                    const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
                    setShellGrid(newShellGrid);
                    sessionStorage.removeItem("loadedGameState");
                }
            } catch (error) {
                console.warn("Error restoring saved state, initializing fresh game:", error);
                const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
                setGrid(grid);
                if (levelConfig.goal.type === "jelly") {
                    const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
                    setJellyGrid(jellyGrid);
                    setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
                }
                const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
                setShellGrid(newShellGrid);
                sessionStorage.removeItem("loadedGameState");
            }
        } else {
            console.log("No saved state found, initializing fresh game for level:", levelConfig.id);
            const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
            setGrid(grid);
            if (levelConfig.goal.type === "jelly") {
                const jellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
                setJellyGrid(jellyGrid);
                setRemainingJellies(jellyGrid.flat().filter(Boolean).length);
            }
            const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
            setShellGrid(newShellGrid);
        }
    }, [levelConfig]);

    // Background music
    useEffect(() => {
        const audio = new Audio("/sounds/background-music.mp3");
        audio.loop = true;
        audio.play().catch((error) => console.error("Error playing audio:", error));
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    // Check win condition
    useEffect(() => {
        if (gameStatus === "playing" && !isAnimating) {
            if (levelConfig.goal.type === "jelly" && remainingJellies === 0) {
                console.log("Jelly level won! Level:", levelConfig.id, "Remaining jellies:", remainingJellies);
                setGameStatus("won");
            } else if (levelConfig.goal.type === "score" && score >= levelConfig.goal.target) {
                console.log("Score level won! Level:", levelConfig.id, "Score:", score, "Target:", levelConfig.goal.target);
                setGameStatus("won");
            }
        }
    }, [remainingJellies, score, gameStatus, isAnimating, levelConfig]);

    // Check lose condition
    useEffect(() => {
        if (gameStatus === "playing" && movesLeft === 0) {
            const goalMet =
                (levelConfig.goal.type === "jelly" && remainingJellies === 0) ||
                (levelConfig.goal.type === "score" && score >= levelConfig.goal.target);
            if (!goalMet) {
                console.log("Game lost! Level:", levelConfig.id, "Moves left:", movesLeft, "Jellies left:", remainingJellies, "Score:", score);
                setGameStatus("lost");
            }
        }
    }, [movesLeft, gameStatus, remainingJellies, score, levelConfig]);

    const handleDragStart = (e, candy) => {
        if (isAnimating || gameStatus !== "playing") {
            e.preventDefault();
            return;
        }
        const { row, col } = candy;
        if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
            e.preventDefault();
            return;
        }
        setDraggedCandy(candy);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify(candy));
    };

    const handleDragOver = (e, candy) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e, targetCandy) => {
        e.preventDefault();
        e.stopPropagation();
        const now = Date.now();
        if (now - lastDropTimestamp.current < 300) {
            console.log("Debounced duplicate drop event, timestamp:", now);
            setDraggedCandy(null);
            return;
        }
        lastDropTimestamp.current = now;
        console.log("handleDrop called, draggedCandy:", JSON.stringify(draggedCandy), "targetCandy:", JSON.stringify(targetCandy));
        if (!draggedCandy || !targetCandy || isAnimating || gameStatus !== "playing") {
            setDraggedCandy(null);
            return;
        }
        if (!areAdjacent(draggedCandy, targetCandy)) {
            setDraggedCandy(null);
            return;
        }
        const { row: row1, col: col1 } = draggedCandy;
        const { row: row2, col: col2 } = targetCandy;
        if (
            (shellGrid[row1][col1] && shellGrid[row1][col1].hits > 0) ||
            (shellGrid[row2][col2] && shellGrid[row2][col2].hits > 0)
        ) {
            setDraggedCandy(null);
            return;
        }
        setIsAnimating(true);
        const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
        const { matches } = findMatches(swappedGrid, levelConfig.gridSize);
        if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
            setGrid(swappedGrid);
            setMovesLeft((prev) => prev - 1);
            const { finalGrid, finalJellyGrid, finalShellGrid } = await processCascadingMatches(
                swappedGrid,
                levelConfig.gridSize,
                setGrid,
                setScore,
                setMatchedCandies,
                { candy1: draggedCandy, candy2: targetCandy },
                jellyGrid,
                setRemainingJellies,
                setJellyGrid,
                shellGrid,
                setShellGrid,
                levelConfig.id
            );
            setGrid(finalGrid);
            if (levelConfig.goal.type === "jelly" && finalJellyGrid) {
                setJellyGrid(finalJellyGrid);
                const newRemainingJellies = finalJellyGrid.flat().filter(Boolean).length;
                setRemainingJellies(newRemainingJellies);
                console.log("Updated remaining jellies for level", levelConfig.id, ":", newRemainingJellies);
            }
            if (finalShellGrid) {
                setShellGrid(finalShellGrid);
            }
        } else {
            setGrid(swappedGrid);
            setTimeout(() => {
                setGrid(grid);
            }, 300);
        }
        setIsAnimating(false);
        setDraggedCandy(null);
    };

    // Touch event handlers
    const handleTouchStart = (e, candy) => {
        if (isAnimating || gameStatus !== "playing") {
            e.preventDefault();
            return;
        }
        const { row, col } = candy;
        if (shellGrid && shellGrid[row][col] && shellGrid[row][col].hits > 0) {
            e.preventDefault();
            return;
        }
        touchStartCandy.current = candy;
        touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        setDraggedCandy(candy);
        console.log("Touch start on candy:", JSON.stringify(candy), "at", touchStartPos.current);
    };

    const handleTouchMove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const dx = touch.clientX - touchStartPos.current.x;
        const dy = touch.clientY - touchStartPos.current.y;
        const candySizeNum = parseFloat(candySize);
        const gridElement = document.querySelector(".grid");
        if (!gridElement || !touchStartCandy.current) return;

        const gridRect = gridElement.getBoundingClientRect();
        const rowCount = grid.length;
        const colCount = grid[0].length;

        // Calculate the swipe direction
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        let targetRow = touchStartCandy.current.row;
        let targetCol = touchStartCandy.current.col;

        if (absDx > absDy && absDx > candySizeNum * 0.3) {
            targetCol += dx > 0 ? 1 : -1;
        } else if (absDy > absDx && absDy > candySizeNum * 0.3) {
            targetRow += dy > 0 ? 1 : -1;
        }

        // Ensure target is within grid bounds
        if (targetRow >= 0 && targetRow < rowCount && targetCol >= 0 && targetCol < colCount) {
            touchTargetCandy.current = grid[targetRow][targetCol];
            console.log("Touch move to candy:", JSON.stringify(touchTargetCandy.current), "dx:", dx, "dy:", dy);
        } else {
            touchTargetCandy.current = null;
            console.log("Touch move out of bounds: row", targetRow, "col", targetCol);
        }
    };

    const handleTouchEnd = (e) => {
        e.preventDefault();
        if (touchStartCandy.current && touchTargetCandy.current && areAdjacent(touchStartCandy.current, touchTargetCandy.current)) {
            console.log("Touch end, attempting swap:", JSON.stringify(touchStartCandy.current), "to", JSON.stringify(touchTargetCandy.current));
            handleDrop(e, touchTargetCandy.current);
        } else {
            console.log("No valid swipe detected, start:", JSON.stringify(touchStartCandy.current), "target:", JSON.stringify(touchTargetCandy.current));
        }
        touchStartCandy.current = null;
        touchStartPos.current = null;
        touchTargetCandy.current = null;
        setDraggedCandy(null);
    };

    const resetGame = () => {
        console.log("Resetting game for level:", levelConfig.id);
        sessionStorage.removeItem("loadedGameState");
        const { grid } = initializeGrid(levelConfig.gridSize, levelConfig.id);
        setGrid(grid);
        if (levelConfig.goal.type === "jelly") {
            const newJellyGrid = initializeJellyGrid(levelConfig.gridSize, levelConfig.goal.count);
            setJellyGrid(newJellyGrid);
            setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
        }
        const newShellGrid = initializeShellGrid(levelConfig.gridSize, levelConfig.id);
        setShellGrid(newShellGrid);
        setScore(0);
        setMovesLeft(levelConfig.moves);
        setGameStatus("playing");
        setDraggedCandy(null);
        setMatchedCandies(new Set());
        setIsAnimating(false);
    };

    const goToNextLevel = () => {
        const nextLevelId = Number(levelConfig.id) + 1;
        sessionStorage.removeItem("loadedGameState");
        if (nextLevelId <= levels.length) {
            console.log("Navigating to next level:", nextLevelId);
            router.push(`/game/${nextLevelId}`);
        } else {
            console.log("No more levels available, redirecting to home");
            router.push("/");
        }
    };

    const getGoalText = (goal) => {
        if (goal.type === "score") {
            return `Score ${goal.target} points`;
        } else if (goal.type === "jelly") {
            return `Clear all jellies`;
        }
        return "";
    };

    const gameState = {
        grid,
        jellyGrid,
        shellGrid,
        score,
        movesLeft,
        remainingJellies,
        gameStatus,
        matchedCandies,
        isAnimating,
        levelConfig,
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{ backgroundImage: "url(/images/candy-background.jpg)" }}
        >
            <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 w-full max-w-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Candy Crush - Level {levelConfig.id}
                </h1>
                <ScoreDisplay
                    goal={levelConfig.goal}
                    score={score}
                    movesLeft={movesLeft}
                    remainingJellies={remainingJellies}
                />
                {grid.length > 0 && (
                    <GameGrid
                        grid={grid}
                        jellyGrid={levelConfig.goal.type === "jelly" ? jellyGrid : null}
                        shellGrid={shellGrid}
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        draggedCandy={draggedCandy}
                        matchedCandies={matchedCandies}
                        isAnimating={isAnimating}
                        gridSize={levelConfig.gridSize}
                    />
                )}
                <SaveGameComponent gameState={gameState} />
                {gameStatus !== "playing" && (
                    <motion.div
                        className="mt-6 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {gameStatus === "won" ? "🎉 You Won!" : "💔 Game Over"}
                        </h2>
                        <p className="text-white/60 mb-4">Final Score: {score}</p>
                        {gameStatus === "won" && levelConfig.id < levels.length && (
                            <button
                                onClick={goToNextLevel}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
                            >
                                Next Level
                            </button>
                        )}
                        <button
                            onClick={resetGame}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
                        >
                            Play Again
                        </button>
                        <button
                            onClick={() => router.push("/")}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
                        >
                            Back to Home
                        </button>
                    </motion.div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-white/70 text-sm">
                        🎯 Goal: {getGoalText(levelConfig.goal)} in {levelConfig.moves} moves
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        Swipe candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color! Break shells by making matches nearby!
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default GameComponent;