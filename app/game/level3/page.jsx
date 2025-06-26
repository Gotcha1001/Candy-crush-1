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
// } from "../../data/gameUtils";

// const GRID_SIZE = 8;
// const MOVES = 30;
// const JELLY_COUNT = 15;

// const Candy = ({
//     candy,
//     onDragStart,
//     onDragOver,
//     onDrop,
//     isDragging,
//     isMatched,
//     isJelly,
// }) => {
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
//             {(candy.type === "striped-horizontal" || candy.type === "striped-vertical") && (
//                 <div className="absolute inset-0 flex items-center justify-center">
//                     <motion.div
//                         className="w-8 h-8 bg-yellow-300 rounded-full"
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1.5, opacity: 0 }}
//                         transition={{ duration: 0.5, repeat: Infinity }}
//                     />
//                 </div>
//             )}
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
// }) => {
//     return (
//         <div className="grid grid-cols-8 gap-1 bg-white/20 p-3 rounded-xl">
//             <AnimatePresence>
//                 {grid.map((row, rowIndex) =>
//                     row.map((candy, colIndex) => (
//                         <motion.div
//                             key={`${rowIndex}-${colIndex}`}
//                             className={`relative ${jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""
//                                 }`}
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
//                                 isJelly={jellyGrid[rowIndex][colIndex]}
//                             />
//                         </motion.div>
//                     ))
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// };

// const ScoreDisplay = ({ movesLeft, remainingJellies }) => {
//     return (
//         <motion.div
//             className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//         >
//             <div className="text-lg font-bold text-white">
//                 Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
//             </div>
//             <div className="text-lg font-bold text-white">
//                 Moves: <span className="text-yellow-300">{movesLeft}</span>
//             </div>
//         </motion.div>
//     );
// };

// const CandyCrushLevel3 = () => {
//     const [grid, setGrid] = useState([]);
//     const [jellyGrid, setJellyGrid] = useState([]);
//     const [score, setScore] = useState(0);
//     const [movesLeft, setMovesLeft] = useState(MOVES);
//     const [remainingJellies, setRemainingJellies] = useState(JELLY_COUNT);
//     const [gameStatus, setGameStatus] = useState("playing");
//     const [draggedCandy, setDraggedCandy] = useState(null);
//     const [matchedCandies, setMatchedCandies] = useState(new Set());
//     const [isAnimating, setIsAnimating] = useState(false);
//     const router = useRouter();

//     useEffect(() => {
//         const newJellyGrid = initializeJellyGrid(GRID_SIZE, JELLY_COUNT);
//         const newGrid = initializeGrid(GRID_SIZE);
//         setGrid(newGrid);
//         setJellyGrid(newJellyGrid);
//         setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
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

//         if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
//             setGrid(swappedGrid);
//             setMovesLeft((prev) => prev - 1);

//             const { finalGrid, finalJellyGrid } = await processCascadingMatches(
//                 swappedGrid,
//                 GRID_SIZE,
//                 setGrid,
//                 setScore,
//                 setMatchedCandies,
//                 { candy1: draggedCandy, candy2: targetCandy },
//                 jellyGrid,
//                 setRemainingJellies
//             );

//             setGrid(finalGrid);
//             setJellyGrid(finalJellyGrid);

//             if (remainingJellies === 0) {
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
//         const newJellyGrid = initializeJellyGrid(GRID_SIZE, JELLY_COUNT);
//         const newGrid = initializeGrid(GRID_SIZE);
//         setGrid(newGrid);
//         setJellyGrid(newJellyGrid);
//         setScore(0);
//         setMovesLeft(MOVES);
//         setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//         setGameStatus("playing");
//         setDraggedCandy(null);
//         setMatchedCandies(new Set());
//         setIsAnimating(false);
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
//                     Candy Crush - Level 3
//                 </h1>
//                 <ScoreDisplay movesLeft={movesLeft} remainingJellies={remainingJellies} />
//                 <GameGrid
//                     grid={grid}
//                     jellyGrid={jellyGrid}
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
//                         🎯 Goal: Clear all jellies in {MOVES} moves
//                     </p>
//                     <p className="text-white/60 text-sm mt-1">
//                         Match 3 to clear candies, 4 for a striped candy to clear a row/column, or 5 for a rainbow candy to clear a color when swapped!
//                     </p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default CandyCrushLevel3;



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
    initializeJellyGrid,
} from "../../data/gameUtils";

const GRID_SIZE = 8;
const MOVES = 30;
const JELLY_COUNT = 15;

const Candy = ({
    candy,
    onDragStart,
    onDragOver,
    onDrop,
    isDragging,
    isMatched,
    isJelly,
}) => {
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
                alt={isJelly ? "jelly" : `${candy.color} candy`}
                width={40}
                height={40}
                className="w-full h-full object-contain pointer-events-none"
                draggable={false}
            />
            {(candy.type === "striped-horizontal" || candy.type === "striped-vertical") && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className="w-8 h-8 bg-yellow-300 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </div>
            )}
        </motion.div>
    );
};

const GameGrid = ({
    grid,
    jellyGrid,
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
                            className={`relative ${jellyGrid[rowIndex][colIndex] ? "bg-blue-300/50 rounded-md p-1" : ""}`}
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
                                isJelly={jellyGrid[rowIndex][colIndex]}
                            />
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};

const ScoreDisplay = ({ movesLeft, remainingJellies }) => {
    return (
        <motion.div
            className="flex justify-between items-center mb-4 p-3 bg-white/30 rounded-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-lg font-bold text-white">
                Jellies Left: <span className="text-yellow-300">{remainingJellies}</span>
            </div>
            <div className="text-lg font-bold text-white">
                Moves: <span className="text-yellow-300">{movesLeft}</span>
            </div>
        </motion.div>
    );
};

const CandyCrushLevel3 = () => {
    const [grid, setGrid] = useState([]);
    const [jellyGrid, setJellyGrid] = useState([]);
    const [score, setScore] = useState(0);
    const [movesLeft, setMovesLeft] = useState(MOVES);
    const [remainingJellies, setRemainingJellies] = useState(JELLY_COUNT);
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
        const newJellyGrid = initializeJellyGrid(GRID_SIZE, JELLY_COUNT);
        const newGrid = initializeGrid(GRID_SIZE);
        setGrid(newGrid);
        setJellyGrid(newJellyGrid);
        setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
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

        if (matches.size > 0 || draggedCandy.type || targetCandy.type) {
            setGrid(swappedGrid);
            setMovesLeft((prev) => prev - 1);
            const { finalGrid, finalJellyGrid } = await processCascadingMatches(
                swappedGrid,
                GRID_SIZE,
                setGrid,
                setScore,
                setMatchedCandies,
                { candy1: draggedCandy, candy2: targetCandy },
                jellyGrid,
                setRemainingJellies
            );
            setGrid(finalGrid);
            setJellyGrid(finalJellyGrid);

            if (remainingJellies === 0) {
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
        const newJellyGrid = initializeJellyGrid(GRID_SIZE, JELLY_COUNT);
        const newGrid = initializeGrid(GRID_SIZE);
        setGrid(newGrid);
        setJellyGrid(newJellyGrid);
        setScore(0);
        setMovesLeft(MOVES);
        setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
        setGameStatus("playing");
        setDraggedCandy(null);
        setMatchedCandies(new Set());
        setIsAnimating(false);
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
                    Candy Crush - Level 3
                </h1>
                <ScoreDisplay movesLeft={movesLeft} remainingJellies={remainingJellies} />
                <GameGrid
                    grid={grid}
                    jellyGrid={jellyGrid}
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
                        🎯 Goal: Clear all jellies in {MOVES} moves
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                        Match 3 to clear candies, 4 for a striped candy to clear a row/column, or 5 for a rainbow candy to clear a color when swapped!
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default CandyCrushLevel3;

