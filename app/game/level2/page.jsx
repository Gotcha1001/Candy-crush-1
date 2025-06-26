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
// } from "../../data/gameUtils";

// const GRID_SIZE = 8;
// const TARGET_SCORE = 1000;

// // Candy component with drag functionality and animations
// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched }) => {
//     return (
//         <motion.div
//             layout
//             key={candy.id}
//             className={`
//                 w-10 h-10 rounded-md cursor-grab active:cursor-grabbing select-none
//                 ${isDragging ? "z-50 opacity-80" : "z-10"}
//                 ${isMatched ? "opacity-20" : ""}
//                 relative
//             `}
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
//                 alt={`${candy.color} candy`}
//                 width={40}
//                 height={40}
//                 className="w-full h-full object-contain pointer-events-none"
//                 draggable={false}
//             />
//         </motion.div>
//     );
// };

// // Game grid component with enhanced falling animations
// const GameGrid = ({
//     grid,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
// }) => {
//     return (
//         <div className="grid grid-cols-8 gap-1 bg-white/20 p-3 rounded-xl">
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className="relative"
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
//                                 isDragging={
//                                     draggedCandy &&
//                                     draggedCandy.row === rowIndex &&
//                                     draggedCandy.col === colIndex
//                                 }
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// // Score display component
// const ScoreDisplay = ({ score, movesLeft, target }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>/{target}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// // Main game component
// const CandyCrushLevel2 = () => {
//     const [grid, setGrid] = useState([]);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(25);
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         setGrid(initializeGrid(GRID_SIZE));
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

//         if (
//             !draggedCandy ||
//             !targetCandy ||
//             isAnimating ||
//             gameStatus !== "playing"
//         ) {
//             setDraggedCandy(null);
//             return;
//         }

//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }

//         setIsAnimating(true);

//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, GRID_SIZE);

//         if (matches.size > 0 || draggedCandy.type === "multicolor" || targetCandy.type === "multicolor") {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);

//             await processCascadingMatches(
//                 swappedGrid,
//                 GRID_SIZE,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy }
//             );

//             if (score >= TARGET_SCORE) {
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
//         setGrid(initializeGrid(GRID_SIZE));
//         setScore(0);
//         setMovesLeft(25);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         router.push("/game/level3");
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{
//                 backgroundImage: "url(/images/candy-background.jpg)",
//             }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-lg w-full"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level 2
//                 </h1>

//                 <ScoreDisplay score={score} movesLeft={movesLeft} target={TARGET_SCORE} />

//                 <GameGrid
//                     grid={grid}
//                     onDragStart={handleDragStart}
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     draggedCandy={draggedCandy}
//                     matchedCandies={matchedCandies}
//                     isAnimating={isAnimating}
//                 />

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
//                         {gameStatus === "won" ? (
//                             <>
//                                 <button
//                                     onClick={goToNextLevel}
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Next Level
//                                 </button>
//                                 <button
//                                     onClick={resetGame}
//                                     className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Play Again
//                                 </button>
//                                 <button
//                                     onClick={() => router.push("/")}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                                 >
//                                     Back to Home
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <button
//                                     onClick={resetGame}
//                                     className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Play Again
//                                 </button>
//                                 <button
//                                     onClick={() => router.push("/")}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                                 >
//                                     Back to Home
//                                 </button>
//                             </>
//                         )}
//                     </motion.div>
//                 )}

//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: Score {TARGET_SCORE} points in 25 moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default CandyCrushLevel2;


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
// } from "../../data/gameUtils";

// const GRID_SIZE = 8;
// const TARGET_SCORE = 1500;

// const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched }) => {
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
//                 alt={`${candy.color} candy`}
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
//     onDragStart,
//     onDragOver,
//     onDrop,
//     draggedCandy,
//     matchedCandies,
//     isAnimating,
// }) => {
//     return (
//         <div className="grid grid-cols-8 gap-1 bg-white/20 p-3 rounded-xl">
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className="relative"
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
//                                 isDragging={
//                                     draggedCandy &&
//                                     draggedCandy.row === rowIndex &&
//                                     draggedCandy.col === colIndex
//                                 }
//                                 isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ score, movesLeft, target }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Score: <span className="text-yellow-300">{score}</span>/{target}
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const CandyCrushLevel2 = () => {
//     const [grid, setGrid] = useState([]);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(20);
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         setGrid(initializeGrid(GRID_SIZE));
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

//         if (
//             !draggedCandy ||
//             !targetCandy ||
//             isAnimating ||
//             gameStatus !== "playing"
//         ) {
//             setDraggedCandy(null);
//             return;
//         }

//         if (!areAdjacent(draggedCandy, targetCandy)) {
//             setDraggedCandy(null);
//             return;
//         }

//         setIsAnimating(true);

//         const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
//         const { matches } = findMatches(swappedGrid, GRID_SIZE);

//         if (matches.size > 0 || draggedCandy.type === "multicolor" || targetCandy.type === "multicolor") {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);

//             await processCascadingMatches(
//                 swappedGrid,
//                 GRID_SIZE,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy }
//             );

//             if (score >= TARGET_SCORE) {
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
//         setGrid(initializeGrid(GRID_SIZE));
//         setScore(0);
//         setMovesLeft(20);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
//     };

//     const goToNextLevel = () => {
//         router.push("/game/level3");
//     };

//     return (
//         <div
//             className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
//             style={{
//                 backgroundImage: "url(/images/candy-background.jpg)",
//             }}
//         >
//             <motion.div
//                 className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-lg w-full"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5 }}
//             >
//                 <h1 className="text-3xl font-bold text-white text-center mb-6">
//                     Candy Crush - Level 2
//                 </h1>

//                 <ScoreDisplay score={score} movesLeft={movesLeft} target={TARGET_SCORE} />

//                 <GameGrid
//                     grid={grid}
//                     onDragStart={handleDragStart}
//                     onDragOver={handleDragOver}
//                     onDrop={handleDrop}
//                     draggedCandy={draggedCandy}
//                     matchedCandies={matchedCandies}
//                     isAnimating={isAnimating}
//                 />

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
//                         {gameStatus === "won" ? (
//                             <>
//                                 <button
//                                     onClick={goToNextLevel}
//                                     className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Next Level
//                                 </button>
//                                 <button
//                                     onClick={resetGame}
//                                     className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Play Again
//                                 </button>
//                                 <button
//                                     onClick={() => router.push("/")}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                                 >
//                                     Back to Home
//                                 </button>
//                             </>
//                         ) : (
//                             <>
//                                 <button
//                                     onClick={resetGame}
//                                     className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
//                                 >
//                                     Play Again
//                                 </button>
//                                 <button
//                                     onClick={() => router.push("/")}
//                                     className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold"
//                                 >
//                                     Back to Home
//                                 </button>
//                             </>
//                         )}
//                     </motion.div>
//                 )}

//                 <div className="mt-4 text-center">
//                     <p className="text-white/70 text-sm">
//                         🎯 Goal: Score {TARGET_SCORE} points in 20 moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default CandyCrushLevel2;


"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    initializeGrid,
    swapCandies,
    areAdjacent,
    processCascadingMatches,
    findMatches,
} from "../../data/gameUtils";

const GRID_SIZE = 8;
const TARGET_SCORE = 1500;

const Candy = ({ candy, onDragStart, onDragOver, onDrop, isDragging, isMatched }) => {
    return (
        <motion.div
            layout
            key={candy.id}
            className={`
        w-10 h-10 rounded-md cursor-grab active:cursor-grabbing select-none
        ${isDragging ? "z-50 opacity-80" : "z-10"}
        ${isMatched ? "opacity-20" : ""}
        relative
      `}
            draggable
            onDragStart={(e) => onDragStart(e, candy)}
            onDragOver={(e) => onDragOver(e, candy)}
            onDrop={(e) => onDrop(e, candy)}
            onDragEnd={(e) => e.preventDefault()}
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
            whileHover={{ scale: 1.1 }}
        >
            <Image
                src={candy.image}
                alt={`${candy.color} candy`}
                width={40}
                height={40}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
            />
        </motion.div>
    );
};

const GameGrid = ({
    grid,
    onDragStart,
    onDragOver,
    onDrop,
    draggedCandy,
    matchedCandies,
    isAnimating,
}) => {
    return (
        <div className="grid grid-cols-8 gap-1 bg-white/20 p-3 rounded-xl">
            <AnimatePresence>
                {grid.map((row, rowIndex) =>
                    row.map((candy, colIndex) => (
                        <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            className="relative"
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                delay: (rowIndex + colIndex * 0.1) * 0.05 + Math.random() * 0.1,
                            }}
                            onDragOver={(e) => onDragOver(e, candy)}
                            onDrop={(e) => onDrop(e, candy)}
                        >
                            <Candy
                                candy={candy}
                                onDragStart={onDragStart}
                                onDragOver={onDragOver}
                                onDrop={onDrop}
                                isDragging={
                                    draggedCandy &&
                                    draggedCandy.row === rowIndex &&
                                    draggedCandy.col === colIndex
                                }
                                isMatched={matchedCandies.has(`${rowIndex}-${colIndex}`)}
                            />
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};

const ScoreDisplay = ({ score, movesLeft, target }) => {
    return (
        <motion.div
            className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-lg font-bold text-white">
                Score: <span className="text-yellow-300">{score}</span>/{target}
            </div>
            <div className="text-lg font-bold text-white">
                Moves: <span className="text-yellow-300">{movesLeft}</span>
            </div>
        </motion.div>
    );
};

const CandyCrushLevel2 = () => {
    const [grid, setGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [movesLeft, setMovesLeft] = useState(20);
    const [gameStatus, setGameStatus] = useState("playing");
    const [draggedCandy, setDraggedCandy] = useState(null);
    const [matchedCandies, setMatchedCandies] = useState(new Set());
    const [isAnimating, setIsAnimating] = useState(false);
    const router = useRouter();

    // Play background music continuously
    useEffect(() => {
        const audio = new Audio('/sounds/background-music.mp3');
        audio.loop = true;
        audio.play().catch((error) => console.error("Error playing audio:", error));

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    useEffect(() => {
        setGrid(initializeGrid(GRID_SIZE));
    }, []);

    const handleDragStart = (e, candy) => {
        if (isAnimating || gameStatus !== "playing") {
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
        if (
            !draggedCandy ||
            !targetCandy ||
            isAnimating ||
            gameStatus !== "playing"
        ) {
            setDraggedCandy(null);
            return;
        }
        if (!areAdjacent(draggedCandy, targetCandy)) {
            setDraggedCandy(null);
            return;
        }

        setIsAnimating(true);
        const swappedGrid = swapCandies(grid, draggedCandy, targetCandy);
        const { matches } = findMatches(swappedGrid, GRID_SIZE);

        if (matches.size > 0 || draggedCandy.type === "multicolor" || targetCandy.type === "multicolor") {
            setGrid(swappedGrid);
            setMovesLeft((prev) => prev - 1);
            await processCascadingMatches(
                swappedGrid,
                GRID_SIZE,
                setGrid,
                setScore,
                setMatchedCandies,
                { candy1: draggedCandy, candy2: targetCandy }
            );

            if (score >= TARGET_SCORE) {
                setGameStatus("won");
            } else if (movesLeft - 1 <= 0) {
                setGameStatus("lost");
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

    const resetGame = () => {
        setGrid(initializeGrid(GRID_SIZE));
        setScore(0);
        setMovesLeft(20);
        setGameStatus("playing");
        setDraggedCandy(null);
        setMatchedCandies(new Set());
        setIsAnimating(false);
    };

    const goToNextLevel = () => {
        router.push("/game/level3");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
            style={{
                backgroundImage: "url(/images/candy-background.jpg)",
            }}
        >
            <motion.div
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 max-w-lg w-full"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-white text-center mb-6">
                    Candy Crush - Level 2
                </h1>
                <ScoreDisplay score={score} movesLeft={movesLeft} target={TARGET_SCORE} />
                <GameGrid
                    grid={grid}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    draggedCandy={draggedCandy}
                    matchedCandies={matchedCandies}
                    isAnimating={isAnimating}
                />
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
                        {gameStatus === "won" ? (
                            <>
                                <button
                                    onClick={goToNextLevel}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold mr-2"
                                >
                                    Next Level
                                </button>
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
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </motion.div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-white/70 text-sm">
                        🎯 Goal: Score {TARGET_SCORE} points in 20 moves
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        Drag candies to make matches of 3 or more! Swap a rainbow candy with any candy to clear all of that color!
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CandyCrushLevel2;

