// const CANDIES = [
//   { color: "red", image: "/images/candies/red-candy.png" },
//   { color: "blue", image: "/images/candies/blue-candy.png" },
//   { color: "green", image: "/images/candies/green-candy.png" },
//   { color: "yellow", image: "/images/candies/yellow-candy.png" },
//   { color: "purple", image: "/images/candies/purple-candy.png" },
//   {
//     color: "multicolor",
//     image: "/images/candies/rainbow.png",
//     type: "multicolor",
//   },
// ];

// export const createCandy = (
//   row,
//   col,
//   avoidColors = [],
//   forceMulticolor = false
// ) => {
//   let availableCandies = forceMulticolor
//     ? CANDIES.filter((candy) => candy.type === "multicolor")
//     : CANDIES.filter(
//         (candy) => !avoidColors.includes(candy.color) && !candy.type
//       );
//   if (availableCandies.length === 0)
//     availableCandies = CANDIES.filter((candy) => !candy.type);
//   const candy =
//     availableCandies[Math.floor(Math.random() * availableCandies.length)];
//   return {
//     id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//     row,
//     col,
//     ...candy,
//   };
// };

// export const initializeGrid = (gridSize) => {
//   const newGrid = [];
//   for (let row = 0; row < gridSize; row++) {
//     const newRow = [];
//     for (let col = 0; col < gridSize; col++) {
//       let avoidColors = [];
//       if (
//         col >= 2 &&
//         newRow[col - 1] &&
//         newRow[col - 2] &&
//         newRow[col - 1].color === newRow[col - 2].color
//       ) {
//         avoidColors.push(newRow[col - 1].color);
//       }
//       if (
//         row >= 2 &&
//         newGrid[row - 1] &&
//         newGrid[row - 2] &&
//         newGrid[row - 1][col].color === newGrid[row - 2][col].color
//       ) {
//         avoidColors.push(newGrid[row - 1][col].color);
//       }
//       newRow.push(createCandy(row, col, avoidColors));
//     }
//     newGrid.push(newRow);
//   }
//   return newGrid;
// };

// export const findMatches = (currentGrid, gridSize) => {
//   const matches = new Set();
//   let multicolorPosition = null;

//   for (let row = 0; row < gridSize; row++) {
//     let count = 1;
//     let startCol = 0;
//     let currentColor = currentGrid[row][0].color;

//     for (let col = 1; col <= gridSize; col++) {
//       if (
//         col < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 4) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           if (!multicolorPosition) {
//             multicolorPosition = { row, col: startCol + Math.floor(count / 2) };
//           }
//         } else if (count >= 3) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//         }
//         if (col < gridSize) {
//           count = 1;
//           startCol = col;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   for (let col = 0; col < gridSize; col++) {
//     let count = 1;
//     let startRow = 0;
//     let currentColor = currentGrid[0][col].color;

//     for (let row = 1; row <= gridSize; row++) {
//       if (
//         row < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 4) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           if (!multicolorPosition) {
//             multicolorPosition = { row: startRow + Math.floor(count / 2), col };
//           }
//         } else if (count >= 3) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//         }
//         if (row < gridSize) {
//           count = 1;
//           startRow = row;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   return { matches, multicolorPosition };
// };

// export const processMatches = async (
//   currentGrid,
//   gridSize,
//   setMatchedCandies,
//   lastSwap = null
// ) => {
//   const { matches, multicolorPosition } = findMatches(currentGrid, gridSize);

//   if (matches.size === 0 && !lastSwap) {
//     return { newGrid: currentGrid, matchCount: 0 };
//   }

//   let explosionMatches = new Set();

//   // Handle multicolor candy swap
//   if (lastSwap) {
//     const { candy1, candy2 } = lastSwap;
//     let targetColor = null;

//     // Determine which candy is multicolor and get the target color
//     if (candy1.type === "multicolor") {
//       targetColor = candy2.color;
//       explosionMatches.add(`${candy1.row}-${candy1.col}`);
//     } else if (candy2.type === "multicolor") {
//       targetColor = candy1.color;
//       explosionMatches.add(`${candy2.row}-${candy2.col}`);
//     }

//     // If a multicolor candy was swapped, mark all candies of the target color
//     if (targetColor && targetColor !== "multicolor") {
//       for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//           if (currentGrid[row][col].color === targetColor) {
//             explosionMatches.add(`${row}-${col}`);
//           }
//         }
//       }
//     }
//   }

//   const allMatches = new Set([...matches, ...explosionMatches]);

//   setMatchedCandies(allMatches);
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const newGrid = currentGrid.map((row) => [...row]);

//   if (multicolorPosition) {
//     newGrid[multicolorPosition.row][multicolorPosition.col] = createCandy(
//       multicolorPosition.row,
//       multicolorPosition.col,
//       [],
//       true
//     );
//   }

//   for (let col = 0; col < gridSize; col++) {
//     const column = [];
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const key = `${row}-${col}`;
//       if (
//         !allMatches.has(key) ||
//         (multicolorPosition &&
//           row === multicolorPosition.row &&
//           col === multicolorPosition.col)
//       ) {
//         column.push(newGrid[row][col]);
//       }
//     }
//     for (let row = gridSize - 1; row >= 0; row--) {
//       if (column.length > 0) {
//         const candy = column.shift();
//         newGrid[row][col] = { ...candy, row, col };
//       } else {
//         newGrid[row][col] = createCandy(row, col);
//       }
//     }
//   }

//   setMatchedCandies(new Set());
//   return { newGrid, matchCount: allMatches.size };
// };

// export const processCascadingMatches = async (
//   initialGrid,
//   gridSize,
//   setGrid,
//   setScore,
//   setMatchedCandies,
//   lastSwap = null
// ) => {
//   let currentGrid = initialGrid;
//   let totalMatches = 0;
//   let combo = 1;

//   while (true) {
//     const { newGrid, matchCount } = await processMatches(
//       currentGrid,
//       gridSize,
//       setMatchedCandies,
//       lastSwap
//     );

//     if (matchCount === 0) break;

//     totalMatches += matchCount;
//     currentGrid = newGrid;
//     setGrid(currentGrid);
//     setScore((prev) => prev + matchCount * 10 * combo);
//     combo++;

//     await new Promise((resolve) => setTimeout(resolve, 500));
//     lastSwap = null; // Clear lastSwap after first iteration
//   }

//   return { finalGrid: currentGrid, totalMatches };
// };

// export const areAdjacent = (candy1, candy2) => {
//   if (!candy1 || !candy2) return false;
//   const rowDiff = Math.abs(candy1.row - candy2.row);
//   const colDiff = Math.abs(candy1.col - candy2.col);
//   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
// };

// export const swapCandies = (grid, candy1, candy2) => {
//   const newGrid = grid.map((row) => [...row]);
//   const temp = { ...newGrid[candy1.row][candy1.col] };
//   newGrid[candy1.row][candy1.col] = {
//     ...newGrid[candy2.row][candy2.col],
//     row: candy1.row,
//     col: candy1.col,
//   };
//   newGrid[candy2.row][candy2.col] = {
//     ...temp,
//     row: candy2.row,
//     col: candy2.col,
//   };
//   return newGrid;
// };

// const CANDIES = [
//   { color: "red", image: "/images/candies/red-candy.png" },
//   { color: "blue", image: "/images/candies/blue-candy.png" },
//   { color: "green", image: "/images/candies/green-candy.png" },
//   { color: "yellow", image: "/images/candies/yellow-candy.png" },
//   { color: "purple", image: "/images/candies/purple-candy.png" },
//   {
//     color: "multicolor",
//     image: "/images/candies/rainbow.png",
//     type: "multicolor",
//   },
// ];

// export const createCandy = (row, col, avoidColors = [], forceType = null) => {
//   let availableCandies = forceType
//     ? CANDIES.filter((candy) => candy.type === forceType)
//     : CANDIES.filter(
//         (candy) => !avoidColors.includes(candy.color) && !candy.type
//       );
//   if (availableCandies.length === 0)
//     availableCandies = CANDIES.filter((candy) => !candy.type);
//   const candy =
//     availableCandies[Math.floor(Math.random() * availableCandies.length)];
//   return {
//     id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//     row,
//     col,
//     ...candy,
//     type: forceType || candy.type,
//   };
// };

// export const initializeGrid = (gridSize) => {
//   const newGrid = [];
//   for (let row = 0; row < gridSize; row++) {
//     const newRow = [];
//     for (let col = 0; col < gridSize; col++) {
//       let avoidColors = [];
//       if (
//         col >= 2 &&
//         newRow[col - 1] &&
//         newRow[col - 2] &&
//         newRow[col - 1].color === newRow[col - 2].color
//       ) {
//         avoidColors.push(newRow[col - 1].color);
//       }
//       if (
//         row >= 2 &&
//         newGrid[row - 1] &&
//         newGrid[row - 2] &&
//         newGrid[row - 1][col].color === newGrid[row - 2][col].color
//       ) {
//         avoidColors.push(newGrid[row - 1][col].color);
//       }
//       newRow.push(createCandy(row, col, avoidColors));
//     }
//     newGrid.push(newRow);
//   }
//   return newGrid;
// };

// export const initializeJellyGrid = (gridSize, jellyCount) => {
//   const jellyGrid = Array(gridSize)
//     .fill()
//     .map(() => Array(gridSize).fill(false));
//   let placedJellies = 0;
//   const positions = [];
//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       positions.push({ row, col });
//     }
//   }
//   // Shuffle positions
//   for (let i = positions.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [positions[i], positions[j]] = [positions[j], positions[i]];
//   }
//   // Place jellies
//   for (let i = 0; i < Math.min(jellyCount, gridSize * gridSize); i++) {
//     const { row, col } = positions[i];
//     jellyGrid[row][col] = true;
//     placedJellies++;
//   }
//   return jellyGrid;
// };

// export const findMatches = (currentGrid, gridSize) => {
//   const matches = new Set();
//   let specialCandyPosition = null;

//   // Horizontal matches
//   for (let row = 0; row < gridSize; row++) {
//     let count = 1;
//     let startCol = 0;
//     let currentColor = currentGrid[row][0].color;
//     for (let col = 1; col <= gridSize; col++) {
//       if (
//         col < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 5 && !specialCandyPosition) {
//           console.log(
//             `Five-candy horizontal match at row ${row}, creating multicolor candy`
//           );
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           specialCandyPosition = {
//             row,
//             col: startCol + Math.floor(count / 2),
//             type: "multicolor",
//           };
//         } else if (count >= 4 && !specialCandyPosition) {
//           console.log(
//             `Four-candy horizontal match at row ${row}, creating striped-horizontal candy`
//           );
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           specialCandyPosition = {
//             row,
//             col: startCol + Math.floor(count / 2),
//             type: "striped-horizontal",
//           };
//         } else if (count >= 3) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//         }
//         if (col < gridSize) {
//           count = 1;
//           startCol = col;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   // Vertical matches
//   for (let col = 0; col < gridSize; col++) {
//     let count = 1;
//     let startRow = 0;
//     let currentColor = currentGrid[0][col].color;
//     for (let row = 1; row <= gridSize; row++) {
//       if (
//         row < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 5 && !specialCandyPosition) {
//           console.log(
//             `Five-candy vertical match at col ${col}, creating multicolor candy`
//           );
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           specialCandyPosition = {
//             row: startRow + Math.floor(count / 2),
//             col,
//             type: "multicolor",
//           };
//         } else if (count >= 4 && !specialCandyPosition) {
//           console.log(
//             `Four-candy vertical match at col ${col}, creating striped-vertical candy`
//           );
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           specialCandyPosition = {
//             row: startRow + Math.floor(count / 2),
//             col,
//             type: "striped-vertical",
//           };
//         } else if (count >= 3) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//         }
//         if (row < gridSize) {
//           count = 1;
//           startRow = row;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   return { matches, specialCandyPosition };
// };

// export const processMatches = async (
//   currentGrid,
//   gridSize,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null
// ) => {
//   const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);

//   if (matches.size === 0 && !lastSwap) {
//     return { newGrid: currentGrid, matchCount: 0 };
//   }

//   let explosionMatches = new Set();
//   if (lastSwap) {
//     const { candy1, candy2 } = lastSwap;
//     let targetColor = null;
//     if (candy1.type === "multicolor") {
//       targetColor = candy2.color;
//       explosionMatches.add(`${candy1.row}-${candy1.col}`);
//     } else if (candy2.type === "multicolor") {
//       targetColor = candy1.color;
//       explosionMatches.add(`${candy2.row}-${candy2.col}`);
//     } else if (
//       candy1.type === "striped-horizontal" ||
//       candy1.type === "striped-vertical"
//     ) {
//       for (let col = 0; col < gridSize; col++) {
//         explosionMatches.add(`${candy1.row}-${col}`);
//       }
//     } else if (
//       candy2.type === "striped-horizontal" ||
//       candy2.type === "striped-vertical"
//     ) {
//       for (let col = 0; col < gridSize; col++) {
//         explosionMatches.add(`${candy2.row}-${col}`);
//       }
//     }

//     if (targetColor && targetColor !== "multicolor") {
//       for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//           if (currentGrid[row][col].color === targetColor) {
//             explosionMatches.add(`${row}-${col}`);
//           }
//         }
//       }
//     }
//   }

//   const allMatches = new Set([...matches, ...explosionMatches]);
//   let newJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;

//   if (jellyGrid && setRemainingJellies) {
//     allMatches.forEach((match) => {
//       const [row, col] = match.split("-").map(Number);
//       if (newJellyGrid[row][col]) {
//         console.log(`Removing jelly at ${row}, ${col}`);
//         newJellyGrid[row][col] = false;
//       }
//     });
//     setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//   }

//   setMatchedCandies(allMatches);
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const newGrid = currentGrid.map((row) => [...row]);
//   if (specialCandyPosition) {
//     const { row, col, type } = specialCandyPosition;
//     newGrid[row][col] = createCandy(
//       row,
//       col,
//       [],
//       type === "multicolor" ? "multicolor" : type
//     );
//   }

//   for (let col = 0; col < gridSize; col++) {
//     const column = [];
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const key = `${row}-${col}`;
//       if (
//         !allMatches.has(key) ||
//         (specialCandyPosition &&
//           row === specialCandyPosition.row &&
//           col === specialCandyPosition.col)
//       ) {
//         column.push(newGrid[row][col]);
//       }
//     }
//     for (let row = gridSize - 1; row >= 0; row--) {
//       if (column.length > 0) {
//         const candy = column.shift();
//         newGrid[row][col] = { ...candy, row, col };
//       } else {
//         newGrid[row][col] = createCandy(row, col);
//       }
//     }
//   }

//   setMatchedCandies(new Set());
//   return { newGrid, matchCount: allMatches.size, newJellyGrid };
// };

// export const processCascadingMatches = async (
//   initialGrid,
//   gridSize,
//   setGrid,
//   setScore,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null
// ) => {
//   let currentGrid = initialGrid;
//   let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
//   let totalMatches = 0;
//   let combo = 1;

//   while (true) {
//     const { newGrid, matchCount, newJellyGrid } = await processMatches(
//       currentGrid,
//       gridSize,
//       setMatchedCandies,
//       lastSwap,
//       currentJellyGrid,
//       setRemainingJellies
//     );

//     if (matchCount === 0) break;
//     totalMatches += matchCount;
//     currentGrid = newGrid;
//     currentJellyGrid = newJellyGrid || currentJellyGrid;
//     setGrid(currentGrid);
//     setScore((prev) => prev + matchCount * 10 * combo);
//     combo++;
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     lastSwap = null;
//   }

//   return {
//     finalGrid: currentGrid,
//     totalMatches,
//     finalJellyGrid: currentJellyGrid,
//   };
// };

// export const areAdjacent = (candy1, candy2) => {
//   if (!candy1 || !candy2) return false;
//   const rowDiff = Math.abs(candy1.row - candy2.row);
//   const colDiff = Math.abs(candy1.col - candy2.col);
//   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
// };

// export const swapCandies = (grid, candy1, candy2) => {
//   const newGrid = grid.map((row) => [...row]);
//   const temp = { ...newGrid[candy1.row][candy1.col] };
//   newGrid[candy1.row][candy1.col] = {
//     ...newGrid[candy2.row][candy2.col],
//     row: candy1.row,
//     col: candy1.col,
//   };
//   newGrid[candy2.row][candy2.col] = {
//     ...temp,
//     row: candy2.row,
//     col: candy2.col,
//   };
//   return newGrid;
// };

// const CANDIES = [
//   { color: "red", image: "/images/candies/red-candy.png" },
//   { color: "blue", image: "/images/candies/blue-candy.png" },
//   { color: "green", image: "/images/candies/green-candy.png" },
//   { color: "yellow", image: "/images/candies/yellow-candy.png" },
//   { color: "purple", image: "/images/candies/purple-candy.png" },
//   {
//     color: "multicolor",
//     image: "/images/candies/rainbow.png",
//     type: "multicolor",
//   },
// ];

// // Helper function to play sound effects
// const playSound = (soundFile) => {
//   const audio = new Audio(soundFile);
//   audio.play().catch((error) => console.error("Error playing sound:", error));
// };

// export const createCandy = (row, col, avoidColors = [], forceType = null) => {
//   let availableCandies = forceType
//     ? CANDIES.filter((candy) => candy.type === forceType)
//     : CANDIES.filter(
//         (candy) => !avoidColors.includes(candy.color) && !candy.type
//       );
//   if (availableCandies.length === 0)
//     availableCandies = CANDIES.filter((candy) => !candy.type);
//   const candy =
//     availableCandies[Math.floor(Math.random() * availableCandies.length)];
//   return {
//     id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//     row,
//     col,
//     ...candy,
//     type: forceType || candy.type,
//   };
// };

// export const initializeGrid = (gridSize) => {
//   const newGrid = [];
//   for (let row = 0; row < gridSize; row++) {
//     const newRow = [];
//     for (let col = 0; col < gridSize; col++) {
//       let avoidColors = [];
//       if (
//         col >= 2 &&
//         newRow[col - 1] &&
//         newRow[col - 2] &&
//         newRow[col - 1].color === newRow[col - 2].color
//       ) {
//         avoidColors.push(newRow[col - 1].color);
//       }
//       if (
//         row >= 2 &&
//         newGrid[row - 1] &&
//         newGrid[row - 2] &&
//         newGrid[row - 1][col].color === newGrid[row - 2][col].color
//       ) {
//         avoidColors.push(newGrid[row - 1][col].color);
//       }
//       newRow.push(createCandy(row, col, avoidColors));
//     }
//     newGrid.push(newRow);
//   }
//   return newGrid;
// };

// export const initializeJellyGrid = (gridSize, jellyCount) => {
//   const jellyGrid = Array(gridSize)
//     .fill()
//     .map(() => Array(gridSize).fill(false));
//   let placedJellies = 0;
//   const positions = [];
//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       positions.push({ row, col });
//     }
//   }
//   // Shuffle positions
//   for (let i = positions.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [positions[i], positions[j]] = [positions[j], positions[i]];
//   }
//   // Place jellies
//   for (let i = 0; i < Math.min(jellyCount, gridSize * gridSize); i++) {
//     const { row, col } = positions[i];
//     jellyGrid[row][col] = true;
//     placedJellies++;
//   }
//   return jellyGrid;
// };

// export const findMatches = (currentGrid, gridSize) => {
//   const matches = new Set();
//   let specialCandyPosition = null;

//   // Horizontal matches
//   for (let row = 0; row < gridSize; row++) {
//     let count = 1;
//     let startCol = 0;
//     let currentColor = currentGrid[row][0].color;
//     for (let col = 1; col <= gridSize; col++) {
//       if (
//         col < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 4 && !specialCandyPosition) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           specialCandyPosition = {
//             row,
//             col: startCol + Math.floor(count / 2),
//             type: "striped-horizontal",
//           };
//         } else if (count >= 3) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           if (count >= 4 && !specialCandyPosition) {
//             specialCandyPosition = {
//               row,
//               col: startCol + Math.floor(count / 2),
//               type: "striped-horizontal",
//             };
//           }
//         }
//         if (col < gridSize) {
//           count = 1;
//           startCol = col;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   // Vertical matches
//   for (let col = 0; col < gridSize; col++) {
//     let count = 1;
//     let startRow = 0;
//     let currentColor = currentGrid[0][col].color;
//     for (let row = 1; row <= gridSize; row++) {
//       if (
//         row < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         !currentGrid[row][col].type
//       ) {
//         count++;
//       } else {
//         if (count >= 4 && !specialCandyPosition) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           specialCandyPosition = {
//             row: startRow + Math.floor(count / 2),
//             col,
//             type: "striped-vertical",
//           };
//         } else if (count >= 3) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           if (count >= 4 && !specialCandyPosition) {
//             specialCandyPosition = {
//               row: startRow + Math.floor(count / 2),
//               col,
//               type: "striped-vertical",
//             };
//           }
//         }
//         if (row < gridSize) {
//           count = 1;
//           startRow = row;
//           currentColor = currentGrid[row][col].color;
//         }
//       }
//     }
//   }

//   return { matches, specialCandyPosition };
// };

// export const processMatches = async (
//   currentGrid,
//   gridSize,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null
// ) => {
//   const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);

//   if (matches.size === 0 && !lastSwap) {
//     return { newGrid: currentGrid, matchCount: 0 };
//   }

//   let explosionMatches = new Set();

//   if (lastSwap) {
//     const { candy1, candy2 } = lastSwap;
//     let targetColor = null;
//     if (candy1.type === "multicolor") {
//       targetColor = candy2.color;
//       explosionMatches.add(`${candy1.row}-${candy1.col}`);
//       playSound("/sounds/rainbow-explosion.mp3"); // Play rainbow explosion sound
//     } else if (candy2.type === "multicolor") {
//       targetColor = candy1.color;
//       explosionMatches.add(`${candy2.row}-${candy2.col}`);
//       playSound("/sounds/rainbow-explosion.mp3"); // Play rainbow explosion sound
//     } else if (
//       candy1.type === "striped-horizontal" ||
//       candy1.type === "striped-vertical"
//     ) {
//       for (let col = 0; col < gridSize; col++) {
//         explosionMatches.add(`${candy1.row}-${col}`);
//       }
//     } else if (
//       candy2.type === "striped-horizontal" ||
//       candy2.type === "striped-vertical"
//     ) {
//       for (let col = 0; col < gridSize; col++) {
//         explosionMatches.add(`${candy2.row}-${col}`);
//       }
//     }

//     if (targetColor && targetColor !== "multicolor") {
//       for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//           if (currentGrid[row][col].color === targetColor) {
//             explosionMatches.add(`${row}-${col}`);
//           }
//         }
//       }
//     }
//   }

//   const allMatches = new Set([...matches, ...explosionMatches]);

//   // Play sound effects for regular matches
//   if (matches.size > 0) {
//     if (matches.size >= 4) {
//       playSound("/sounds/match-4.mp3"); // Sound for four-candy match
//     } else if (matches.size >= 3) {
//       playSound("/sounds/match-3.mp3"); // Sound for three-candy match
//     }
//   }

//   let newJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
//   if (jellyGrid && setRemainingJellies) {
//     allMatches.forEach((match) => {
//       const [row, col] = match.split("-").map(Number);
//       if (newJellyGrid[row][col]) {
//         newJellyGrid[row][col] = false;
//       }
//     });
//     setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//   }

//   setMatchedCandies(allMatches);
//   await new Promise((resolve) => setTimeout(resolve, 300));
//   const newGrid = currentGrid.map((row) => [...row]);

//   if (specialCandyPosition) {
//     const { row, col, type } = specialCandyPosition;
//     newGrid[row][col] = createCandy(
//       row,
//       col,
//       [],
//       type === "multicolor" ? "multicolor" : type
//     );
//   }

//   for (let col = 0; col < gridSize; col++) {
//     const column = [];
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const key = `${row}-${col}`;
//       if (
//         !allMatches.has(key) ||
//         (specialCandyPosition &&
//           row === specialCandyPosition.row &&
//           col === specialCandyPosition.col)
//       ) {
//         column.push(newGrid[row][col]);
//       }
//     }
//     for (let row = gridSize - 1; row >= 0; row--) {
//       if (column.length > 0) {
//         const candy = column.shift();
//         newGrid[row][col] = { ...candy, row, col };
//       } else {
//         newGrid[row][col] = createCandy(row, col);
//       }
//     }
//   }

//   setMatchedCandies(new Set());
//   return { newGrid, matchCount: allMatches.size, newJellyGrid };
// };

// export const processCascadingMatches = async (
//   initialGrid,
//   gridSize,
//   setGrid,
//   setScore,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null
// ) => {
//   let currentGrid = initialGrid;
//   let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
//   let totalMatches = 0;
//   let combo = 1;

//   while (true) {
//     const { newGrid, matchCount, newJellyGrid } = await processMatches(
//       currentGrid,
//       gridSize,
//       setMatchedCandies,
//       lastSwap,
//       currentJellyGrid,
//       setRemainingJellies
//     );
//     if (matchCount === 0) break;
//     totalMatches += matchCount;
//     currentGrid = newGrid;
//     currentJellyGrid = newJellyGrid || currentJellyGrid;
//     setGrid(currentGrid);
//     setScore((prev) => prev + matchCount * 10 * combo);
//     combo++;
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     lastSwap = null;
//   }

//   return {
//     finalGrid: currentGrid,
//     totalMatches,
//     finalJellyGrid: currentJellyGrid,
//   };
// };

// export const areAdjacent = (candy1, candy2) => {
//   if (!candy1 || !candy2) return false;
//   const rowDiff = Math.abs(candy1.row - candy2.row);
//   const colDiff = Math.abs(candy1.col - candy2.col);
//   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
// };

// export const swapCandies = (grid, candy1, candy2) => {
//   const newGrid = grid.map((row) => [...row]);
//   const temp = { ...newGrid[candy1.row][candy1.col] };
//   newGrid[candy1.row][candy1.col] = {
//     ...newGrid[candy2.row][candy2.col],
//     row: candy1.row,
//     col: candy1.col,
//   };
//   newGrid[candy2.row][candy2.col] = {
//     ...temp,
//     row: candy2.row,
//     col: candy2.col,
//   };
//   return newGrid;
// };

// const CANDIES = [
//   { color: "red", image: "/images/candies/red-candy.png" },
//   { color: "blue", image: "/images/candies/blue-candy.png" },
//   { color: "green", image: "/images/candies/green-candy.png" },
//   { color: "yellow", image: "/images/candies/yellow-candy.png" },
//   { color: "purple", image: "/images/candies/purple-candy.png" },
//   {
//     color: "multicolor",
//     image: "/images/candies/rainbow.png",
//     type: "multicolor",
//   },
// ];

// const playSound = (soundFile) => {
//   const audio = new Audio(soundFile);
//   audio.play().catch((error) => console.error("Error playing sound:", error));
// };

// export const createCandy = (row, col, avoidColors = [], forceType = null) => {
//   let availableCandies = forceType
//     ? CANDIES.filter((candy) => candy.type === forceType)
//     : CANDIES.filter(
//         (candy) => !avoidColors.includes(candy.color) && !candy.type
//       );

//   if (availableCandies.length === 0)
//     availableCandies = CANDIES.filter((candy) => !candy.type);

//   const candy =
//     availableCandies[Math.floor(Math.random() * availableCandies.length)];

//   return {
//     id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//     row,
//     col,
//     ...candy,
//     type: forceType || candy.type,
//   };
// };

// export const initializeGrid = (gridSize) => {
//   const newGrid = [];
//   for (let row = 0; row < gridSize; row++) {
//     const newRow = [];
//     for (let col = 0; col < gridSize; col++) {
//       let avoidColors = [];

//       if (
//         col >= 2 &&
//         newRow[col - 1] &&
//         newRow[col - 2] &&
//         newRow[col - 1].color === newRow[col - 2].color
//       ) {
//         avoidColors.push(newRow[col - 1].color);
//       }

//       if (
//         row >= 2 &&
//         newGrid[row - 1] &&
//         newGrid[row - 2] &&
//         newGrid[row - 1][col].color === newGrid[row - 2][col].color
//       ) {
//         avoidColors.push(newGrid[row - 1][col].color);
//       }

//       newRow.push(createCandy(row, col, avoidColors));
//     }
//     newGrid.push(newRow);
//   }

//   return newGrid;
// };

// export const initializeJellyGrid = (gridSize, jellyCount) => {
//   const jellyGrid = Array(gridSize)
//     .fill()
//     .map(() => Array(gridSize).fill(false));

//   let placedJellies = 0;
//   const positions = [];
//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       positions.push({ row, col });
//     }
//   }

//   for (let i = positions.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [positions[i], positions[j]] = [positions[j], positions[i]];
//   }

//   for (let i = 0; i < Math.min(jellyCount, gridSize * gridSize); i++) {
//     const { row, col } = positions[i];
//     jellyGrid[row][col] = true;
//     placedJellies++;
//   }

//   return jellyGrid;
// };

// export const findMatches = (currentGrid, gridSize) => {
//   const matches = new Set();
//   let specialCandyPosition = null;

//   // Horizontal matches
//   for (let row = 0; row < gridSize; row++) {
//     let count = 1;
//     let startCol = 0;
//     let currentColor = currentGrid[row][0].color;
//     let isRegularMatch = !currentGrid[row][0].type;

//     for (let col = 1; col <= gridSize; col++) {
//       if (
//         col < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         currentGrid[row][col].color !== "multicolor"
//       ) {
//         count++;
//         if (currentGrid[row][col].type) {
//           isRegularMatch = false;
//         }
//       } else {
//         if (count >= 3) {
//           for (let i = startCol; i < startCol + count; i++) {
//             matches.add(`${row}-${i}`);
//           }
//           if (isRegularMatch && !specialCandyPosition) {
//             if (count >= 5) {
//               specialCandyPosition = {
//                 row,
//                 col: startCol + Math.floor(count / 2),
//                 type: "multicolor",
//               };
//             } else if (count >= 4) {
//               specialCandyPosition = {
//                 row,
//                 col: startCol + Math.floor(count / 2),
//                 type: "multicolor",
//               };
//             }
//           }
//         }
//         if (col < gridSize) {
//           count = 1;
//           startCol = col;
//           currentColor = currentGrid[row][col].color;
//           isRegularMatch = !currentGrid[row][col].type;
//         }
//       }
//     }
//   }

//   // Vertical matches
//   for (let col = 0; col < gridSize; col++) {
//     let count = 1;
//     let startRow = 0;
//     let currentColor = currentGrid[0][col].color;
//     let isRegularMatch = !currentGrid[0][col].type;

//     for (let row = 1; row <= gridSize; row++) {
//       if (
//         row < gridSize &&
//         currentGrid[row][col].color === currentColor &&
//         currentGrid[row][col].color !== "multicolor"
//       ) {
//         count++;
//         if (currentGrid[row][col].type) {
//           isRegularMatch = false;
//         }
//       } else {
//         if (count >= 3) {
//           for (let i = startRow; i < startRow + count; i++) {
//             matches.add(`${i}-${col}`);
//           }
//           if (isRegularMatch && !specialCandyPosition) {
//             if (count >= 5) {
//               specialCandyPosition = {
//                 row: startRow + Math.floor(count / 2),
//                 col,
//                 type: "multicolor",
//               };
//             } else if (count >= 4) {
//               specialCandyPosition = {
//                 row: startRow + Math.floor(count / 2),
//                 col,
//                 type: "multicolor",
//               };
//             }
//           }
//         }
//         if (row < gridSize) {
//           count = 1;
//           startRow = row;
//           currentColor = currentGrid[row][col].color;
//           isRegularMatch = !currentGrid[row][col].type;
//         }
//       }
//     }
//   }

//   return { matches, specialCandyPosition };
// };

// export const checkPossibleMoves = (grid, gridSize) => {
//   // Check all possible swaps (horizontal and vertical)
//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       // Check right swap
//       if (col < gridSize - 1) {
//         const tempGrid = swapCandies(grid, grid[row][col], grid[row][col + 1]);
//         const { matches } = findMatches(tempGrid, gridSize);
//         if (matches.size > 0) {
//           return true; // Valid move found
//         }
//       }
//       // Check down swap
//       if (row < gridSize - 1) {
//         const tempGrid = swapCandies(grid, grid[row][col], grid[row + 1][col]);
//         const { matches } = findMatches(tempGrid, gridSize);
//         if (matches.size > 0) {
//           return true; // Valid move found
//         }
//       }
//     }
//   }
//   return false; // No valid moves found
// };

// export const reshuffleGrid = (gridSize, jellyGrid = null) => {
//   let newGrid = initializeGrid(gridSize);
//   // Preserve jelly positions if jellyGrid exists
//   if (jellyGrid) {
//     return { newGrid, jellyGrid };
//   }
//   return { newGrid };
// };

// export const processMatches = async (
//   currentGrid,
//   gridSize,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null,
//   setScore = null
// ) => {
//   const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);

//   if (matches.size === 0 && !lastSwap) {
//     return { newGrid: currentGrid, matchCount: 0 };
//   }

//   let explosionMatches = new Set();

//   if (lastSwap) {
//     const { candy1, candy2 } = lastSwap;
//     let targetColor = null;

//     if (candy1.type === "multicolor") {
//       targetColor = candy2.color;
//       explosionMatches.add(`${candy1.row}-${candy1.col}`);
//       playSound("/sounds/rainbow-explosion.mp3");
//     } else if (candy2.type === "multicolor") {
//       targetColor = candy1.color;
//       explosionMatches.add(`${candy2.row}-${candy2.col}`);
//       playSound("/sounds/rainbow-explosion.mp3");
//     } else if (
//       candy1.type === "striped-horizontal" ||
//       candy1.type === "striped-vertical"
//     ) {
//       if (candy1.type === "striped-horizontal") {
//         for (let col = 0; col < gridSize; col++) {
//           explosionMatches.add(`${candy1.row}-${col}`);
//         }
//       } else {
//         for (let row = 0; row < gridSize; row++) {
//           explosionMatches.add(`${row}-${candy1.col}`);
//         }
//       }
//     } else if (
//       candy2.type === "striped-horizontal" ||
//       candy2.type === "striped-vertical"
//     ) {
//       if (candy2.type === "striped-horizontal") {
//         for (let col = 0; col < gridSize; col++) {
//           explosionMatches.add(`${candy2.row}-${col}`);
//         }
//       } else {
//         for (let row = 0; row < gridSize; row++) {
//           explosionMatches.add(`${row}-${candy2.col}`);
//         }
//       }
//     }

//     if (targetColor && targetColor !== "multicolor") {
//       for (let row = 0; row < gridSize; row++) {
//         for (let col = 0; col < gridSize; col++) {
//           if (currentGrid[row][col].color === targetColor) {
//             explosionMatches.add(`${row}-${col}`);
//           }
//         }
//       }
//     }
//   }

//   const allMatches = new Set([...matches, ...explosionMatches]);

//   if (matches.size > 0) {
//     if (matches.size >= 4) {
//       playSound("/sounds/match-4.mp3");
//     } else if (matches.size >= 3) {
//       playSound("/sounds/match-3.mp3");
//     }
//   }

//   let newJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;

//   if (jellyGrid && setRemainingJellies && setScore) {
//     let clearedJellies = 0;
//     allMatches.forEach((match) => {
//       const [row, col] = match.split("-").map(Number);
//       if (newJellyGrid[row][col]) {
//         newJellyGrid[row][col] = false;
//         clearedJellies++;
//       }
//     });
//     setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
//     setScore((prev) => prev + clearedJellies * 50); // Bonus for clearing jellies
//   }

//   setMatchedCandies(allMatches);

//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const newGrid = currentGrid.map((row) => [...row]);

//   if (specialCandyPosition) {
//     const { row, col, type } = specialCandyPosition;
//     if (type === "multicolor") {
//       newGrid[row][col] = {
//         id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//         row,
//         col,
//         color: "multicolor",
//         image: "/images/candies/rainbow.png",
//         type: "multicolor",
//       };
//     } else {
//       newGrid[row][col] = createCandy(row, col, [], type);
//     }
//   }

//   for (let col = 0; col < gridSize; col++) {
//     const column = [];
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const key = `${row}-${col}`;
//       if (
//         !allMatches.has(key) ||
//         (specialCandyPosition &&
//           row === specialCandyPosition.row &&
//           col === specialCandyPosition.col)
//       ) {
//         column.push(newGrid[row][col]);
//       }
//     }

//     for (let row = gridSize - 1; row >= 0; row--) {
//       if (column.length > 0) {
//         const candy = column.shift();
//         newGrid[row][col] = { ...candy, row, col };
//       } else {
//         newGrid[row][col] = createCandy(row, col);
//       }
//     }
//   }

//   setMatchedCandies(new Set());

//   return { newGrid, matchCount: allMatches.size, newJellyGrid };
// };

// export const processCascadingMatches = async (
//   initialGrid,
//   gridSize,
//   setGrid,
//   setScore,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null,
//   setJellyGrid = null
// ) => {
//   let currentGrid = initialGrid;
//   let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
//   let totalMatches = 0;
//   let combo = 1;

//   while (true) {
//     const { newGrid, matchCount, newJellyGrid } = await processMatches(
//       currentGrid,
//       gridSize,
//       setMatchedCandies,
//       lastSwap,
//       currentJellyGrid,
//       setRemainingJellies,
//       setScore
//     );

//     if (matchCount === 0) {
//       if (!checkPossibleMoves(currentGrid, gridSize)) {
//         console.log("No possible moves, reshuffling grid...");
//         const { newGrid: reshuffledGrid, jellyGrid: reshuffledJellyGrid } =
//           reshuffleGrid(gridSize, currentJellyGrid);
//         currentGrid = reshuffledGrid;
//         currentJellyGrid = reshuffledJellyGrid || currentJellyGrid;
//         setGrid(currentGrid);
//         if (currentJellyGrid) {
//           setJellyGrid(currentJellyGrid);
//         }
//         playSound("/sounds/reshuffle.mp3"); // Optional sound effect
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         continue;
//       }
//       break;
//     }

//     totalMatches += matchCount;
//     currentGrid = newGrid;
//     currentJellyGrid = newJellyGrid || currentJellyGrid;
//     setGrid(currentGrid);
//     setScore((prev) => prev + matchCount * 10 * combo);
//     combo++;
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     lastSwap = null;
//   }

//   return {
//     finalGrid: currentGrid,
//     totalMatches,
//     finalJellyGrid: currentJellyGrid,
//   };
// };

// export const areAdjacent = (candy1, candy2) => {
//   if (!candy1 || !candy2) return false;

//   const rowDiff = Math.abs(candy1.row - candy2.row);
//   const colDiff = Math.abs(candy1.col - candy2.col);

//   return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
// };

// export const swapCandies = (grid, candy1, candy2) => {
//   const newGrid = grid.map((row) => [...row]);

//   const temp = { ...newGrid[candy1.row][candy1.col] };
//   newGrid[candy1.row][candy1.col] = {
//     ...newGrid[candy2.row][candy2.col],
//     row: candy1.row,
//     col: candy1.col,
//   };
//   newGrid[candy2.row][candy2.col] = {
//     ...temp,
//     row: candy2.row,
//     col: candy2.col,
//   };

//   return newGrid;
// };

const CANDIES = [
  { color: "red", image: "/images/candies/red-candy.png" },
  { color: "blue", image: "/images/candies/blue-candy.png" },
  { color: "green", image: "/images/candies/green-candy.png" },
  { color: "yellow", image: "/images/candies/yellow-candy.png" },
  { color: "purple", image: "/images/candies/purple-candy.png" },
  {
    color: "multicolor",
    image: "/images/candies/rainbow.png",
    type: "multicolor",
  },
];

const playSound = (soundFile) => {
  const audio = new Audio(soundFile);
  audio.play().catch((error) => console.error("Error playing sound:", error));
};

export const createCandy = (row, col, avoidColors = [], forceType = null) => {
  let availableCandies = forceType
    ? CANDIES.filter((candy) => candy.type === forceType)
    : CANDIES.filter(
        (candy) => !avoidColors.includes(candy.color) && !candy.type
      );
  if (availableCandies.length === 0)
    availableCandies = CANDIES.filter((candy) => !candy.type);
  const candy =
    availableCandies[Math.floor(Math.random() * availableCandies.length)];
  return {
    id: `${row}-${col}-${Date.now()}-${Math.random()}`,
    row,
    col,
    ...candy,
    type: forceType || candy.type,
  };
};

export const initializeGrid = (gridSize) => {
  const newGrid = [];
  for (let row = 0; row < gridSize; row++) {
    const newRow = [];
    for (let col = 0; col < gridSize; col++) {
      let avoidColors = [];
      if (
        col >= 2 &&
        newRow[col - 1] &&
        newRow[col - 2] &&
        newRow[col - 1].color === newRow[col - 2].color
      ) {
        avoidColors.push(newRow[col - 1].color);
      }
      if (
        row >= 2 &&
        newGrid[row - 1] &&
        newGrid[row - 2] &&
        newGrid[row - 1][col].color === newGrid[row - 2][col].color
      ) {
        avoidColors.push(newGrid[row - 1][col].color);
      }
      newRow.push(createCandy(row, col, avoidColors));
    }
    newGrid.push(newRow);
  }
  return newGrid;
};

export const initializeJellyGrid = (gridSize, jellyCount) => {
  const jellyGrid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(false));
  let placedJellies = 0;
  const positions = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      positions.push({ row, col });
    }
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  for (let i = 0; i < Math.min(jellyCount, gridSize * gridSize); i++) {
    const { row, col } = positions[i];
    jellyGrid[row][col] = true;
    placedJellies++;
  }
  return jellyGrid;
};

export const initializeShellGrid = (gridSize, levelId) => {
  const shellGrid = Array(gridSize)
    .fill()
    .map(() => Array(gridSize).fill(null));
  // Apply shells to bottom row (row index = gridSize - 1) for levels 5 and above
  if (levelId >= 5) {
    for (let col = 0; col < gridSize; col++) {
      shellGrid[gridSize - 1][col] = { hits: 2 }; // Shells require 2 hits
    }
  }
  return shellGrid;
};

export const findMatches = (currentGrid, gridSize) => {
  const matches = new Set();
  let specialCandyPosition = null;

  // Horizontal matches
  for (let row = 0; row < gridSize; row++) {
    let count = 1;
    let startCol = 0;
    let currentColor = currentGrid[row][0].color;
    let isRegularMatch = !currentGrid[row][0].type;
    for (let col = 1; col <= gridSize; col++) {
      if (
        col < gridSize &&
        currentGrid[row][col].color === currentColor &&
        currentGrid[row][col].color !== "multicolor"
      ) {
        count++;
        if (currentGrid[row][col].type) {
          isRegularMatch = false;
        }
      } else {
        if (count >= 3) {
          for (let i = startCol; i < startCol + count; i++) {
            matches.add(`${row}-${i}`);
          }
          if (isRegularMatch && !specialCandyPosition) {
            if (count >= 5) {
              specialCandyPosition = {
                row,
                col: startCol + Math.floor(count / 2),
                type: "multicolor",
              };
            } else if (count >= 4) {
              specialCandyPosition = {
                row,
                col: startCol + Math.floor(count / 2),
                type: "multicolor",
              };
            }
          }
        }
        if (col < gridSize) {
          count = 1;
          startCol = col;
          currentColor = currentGrid[row][col].color;
          isRegularMatch = !currentGrid[row][col].type;
        }
      }
    }
  }

  // Vertical matches
  for (let col = 0; col < gridSize; col++) {
    let count = 1;
    let startRow = 0;
    let currentColor = currentGrid[0][col].color;
    let isRegularMatch = !currentGrid[0][col].type;
    for (let row = 1; row <= gridSize; row++) {
      if (
        row < gridSize &&
        currentGrid[row][col].color === currentColor &&
        currentGrid[row][col].color !== "multicolor"
      ) {
        count++;
        if (currentGrid[row][col].type) {
          isRegularMatch = false;
        }
      } else {
        if (count >= 3) {
          for (let i = startRow; i < startRow + count; i++) {
            matches.add(`${i}-${col}`);
          }
          if (isRegularMatch && !specialCandyPosition) {
            if (count >= 5) {
              specialCandyPosition = {
                row: startRow + Math.floor(count / 2),
                col,
                type: "multicolor",
              };
            } else if (count >= 4) {
              specialCandyPosition = {
                row: startRow + Math.floor(count / 2),
                col,
                type: "multicolor",
              };
            }
          }
        }
        if (row < gridSize) {
          count = 1;
          startRow = row;
          currentColor = currentGrid[row][col].color;
          isRegularMatch = !currentGrid[row][col].type;
        }
      }
    }
  }

  return { matches, specialCandyPosition };
};

export const checkPossibleMoves = (grid, gridSize, shellGrid) => {
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Skip if candy is under an unbroken shell
      if (shellGrid[row][col] && shellGrid[row][col].hits > 0) continue;

      // Check right swap
      if (
        col < gridSize - 1 &&
        (!shellGrid[row][col + 1] || shellGrid[row][col + 1].hits === 0)
      ) {
        const tempGrid = swapCandies(grid, grid[row][col], grid[row][col + 1]);
        const { matches } = findMatches(tempGrid, gridSize);
        if (matches.size > 0) {
          return true;
        }
      }
      // Check down swap
      if (
        row < gridSize - 1 &&
        (!shellGrid[row + 1][col] || shellGrid[row + 1][col].hits === 0)
      ) {
        const tempGrid = swapCandies(grid, grid[row][col], grid[row + 1][col]);
        const { matches } = findMatches(tempGrid, gridSize);
        if (matches.size > 0) {
          return true;
        }
      }
    }
  }
  return false;
};

export const reshuffleGrid = (gridSize, jellyGrid = null, shellGrid = null) => {
  let newGrid = initializeGrid(gridSize);
  // Preserve jelly and shell positions
  return { newGrid, jellyGrid, shellGrid };
};

export const processMatches = async (
  currentGrid,
  gridSize,
  setMatchedCandies,
  lastSwap = null,
  jellyGrid = null,
  setRemainingJellies = null,
  setScore = null,
  shellGrid = null,
  setShellGrid = null
) => {
  const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);
  if (matches.size === 0 && !lastSwap) {
    return {
      newGrid: currentGrid,
      matchCount: 0,
      newJellyGrid: jellyGrid,
      newShellGrid: shellGrid,
    };
  }

  let explosionMatches = new Set();
  if (lastSwap) {
    const { candy1, candy2 } = lastSwap;
    let targetColor = null;
    if (candy1.type === "multicolor") {
      targetColor = candy2.color;
      explosionMatches.add(`${candy1.row}-${candy1.col}`);
      playSound("/sounds/rainbow-explosion.mp3");
    } else if (candy2.type === "multicolor") {
      targetColor = candy1.color;
      explosionMatches.add(`${candy2.row}-${candy2.col}`);
      playSound("/sounds/rainbow-explosion.mp3");
    } else if (
      candy1.type === "striped-horizontal" ||
      candy1.type === "striped-vertical"
    ) {
      if (candy1.type === "striped-horizontal") {
        for (let col = 0; col < gridSize; col++) {
          explosionMatches.add(`${candy1.row}-${col}`);
        }
      } else {
        for (let row = 0; row < gridSize; row++) {
          explosionMatches.add(`${row}-${candy1.col}`);
        }
      }
    } else if (
      candy2.type === "striped-horizontal" ||
      candy2.type === "striped-vertical"
    ) {
      if (candy2.type === "striped-horizontal") {
        for (let col = 0; col < gridSize; col++) {
          explosionMatches.add(`${candy2.row}-${col}`);
        }
      } else {
        for (let row = 0; row < gridSize; row++) {
          explosionMatches.add(`${row}-${candy2.col}`);
        }
      }
    }
    if (targetColor && targetColor !== "multicolor") {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (currentGrid[row][col].color === targetColor) {
            explosionMatches.add(`${row}-${col}`);
          }
        }
      }
    }
  }

  const allMatches = new Set([...matches, ...explosionMatches]);

  // Process shells: reduce hits for adjacent cells
  let newShellGrid = shellGrid ? shellGrid.map((row) => [...row]) : null;
  if (shellGrid) {
    const adjacentPositions = new Set();
    allMatches.forEach((match) => {
      const [row, col] = match.split("-").map(Number);
      // Check adjacent cells (up, down, left, right)
      [
        [row - 1, col],
        [row + 1, col],
        [row, col - 1],
        [row, col + 1],
      ].forEach(([r, c]) => {
        if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
          adjacentPositions.add(`${r}-${c}`);
        }
      });
    });
    adjacentPositions.forEach((pos) => {
      const [row, col] = pos.split("-").map(Number);
      if (newShellGrid[row][col] && newShellGrid[row][col].hits > 0) {
        newShellGrid[row][col].hits -= 1;
        if (newShellGrid[row][col].hits === 0) {
          newShellGrid[row][col] = null;
          playSound("/sounds/shell-break.mp3");
        } else {
          playSound("/sounds/shell-hit.mp3");
        }
      }
    });
    setShellGrid?.(newShellGrid);
  }

  let newJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
  if (jellyGrid && setRemainingJellies && setScore) {
    let clearedJellies = 0;
    allMatches.forEach((match) => {
      const [row, col] = match.split("-").map(Number);
      if (newJellyGrid[row][col]) {
        newJellyGrid[row][col] = false;
        clearedJellies++;
      }
    });
    setRemainingJellies(newJellyGrid.flat().filter(Boolean).length);
    setScore((prev) => prev + clearedJellies * 50);
  }

  if (allMatches.size > 0) {
    if (allMatches.size >= 4) {
      playSound("/sounds/match-4.mp3");
    } else if (allMatches.size >= 3) {
      playSound("/sounds/match-3.mp3");
    }
  }

  setMatchedCandies(allMatches);
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newGrid = currentGrid.map((row) => [...row]);
  if (specialCandyPosition) {
    const { row, col, type } = specialCandyPosition;
    if (type === "multicolor") {
      newGrid[row][col] = {
        id: `${row}-${col}-${Date.now()}-${Math.random()}`,
        row,
        col,
        color: "multicolor",
        image: "/images/candies/rainbow.png",
        type: "multicolor",
      };
    } else {
      newGrid[row][col] = createCandy(row, col, [], type);
    }
  }

  for (let col = 0; col < gridSize; col++) {
    const column = [];
    for (let row = gridSize - 1; row >= 0; row--) {
      const key = `${row}-${col}`;
      if (
        (!allMatches.has(key) ||
          (specialCandyPosition &&
            row === specialCandyPosition.row &&
            col === specialCandyPosition.col)) &&
        (!newShellGrid ||
          !newShellGrid[row][col] ||
          newShellGrid[row][col].hits === 0)
      ) {
        column.push(newGrid[row][col]);
      }
    }
    for (let row = gridSize - 1; row >= 0; row--) {
      if (column.length > 0) {
        const candy = column.shift();
        newGrid[row][col] = { ...candy, row, col };
      } else {
        newGrid[row][col] = createCandy(row, col);
      }
    }
  }

  setMatchedCandies(new Set());
  return { newGrid, matchCount: allMatches.size, newJellyGrid, newShellGrid };
};

export const processCascadingMatches = async (
  initialGrid,
  gridSize,
  setGrid,
  setScore,
  setMatchedCandies,
  lastSwap = null,
  jellyGrid = null,
  setRemainingJellies = null,
  setJellyGrid = null,
  shellGrid = null,
  setShellGrid = null
) => {
  let currentGrid = initialGrid;
  let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
  let currentShellGrid = shellGrid ? shellGrid.map((row) => [...row]) : null;
  let totalMatches = 0;
  let combo = 1;

  while (true) {
    const { newGrid, matchCount, newJellyGrid, newShellGrid } =
      await processMatches(
        currentGrid,
        gridSize,
        setMatchedCandies,
        lastSwap,
        currentJellyGrid,
        setRemainingJellies,
        setScore,
        currentShellGrid,
        setShellGrid
      );

    if (matchCount === 0) {
      if (!checkPossibleMoves(currentGrid, gridSize, currentShellGrid)) {
        console.log("No possible moves, reshuffling grid...");
        const {
          newGrid: reshuffledGrid,
          jellyGrid: reshuffledJellyGrid,
          shellGrid: reshuffledShellGrid,
        } = reshuffleGrid(gridSize, currentJellyGrid, currentShellGrid);
        currentGrid = reshuffledGrid;
        currentJellyGrid = reshuffledJellyGrid || currentJellyGrid;
        currentShellGrid = reshuffledShellGrid || currentShellGrid;
        setGrid(currentGrid);
        if (currentJellyGrid) {
          setJellyGrid(currentJellyGrid);
        }
        if (currentShellGrid) {
          setShellGrid(currentShellGrid);
        }
        playSound("/sounds/reshuffle.mp3");
        await new Promise((resolve) => setTimeout(resolve, 500));
        continue;
      }
      break;
    }

    totalMatches += matchCount;
    currentGrid = newGrid;
    currentJellyGrid = newJellyGrid || currentJellyGrid;
    currentShellGrid = newShellGrid || currentShellGrid;
    setGrid(currentGrid);
    setScore((prev) => prev + matchCount * 10 * combo);
    combo++;
    await new Promise((resolve) => setTimeout(resolve, 500));
    lastSwap = null;
  }

  return {
    finalGrid: currentGrid,
    totalMatches,
    finalJellyGrid: currentJellyGrid,
    finalShellGrid: currentShellGrid,
  };
};

export const areAdjacent = (candy1, candy2) => {
  if (!candy1 || !candy2) return false;
  const rowDiff = Math.abs(candy1.row - candy2.row);
  const colDiff = Math.abs(candy1.col - candy2.col);
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const swapCandies = (grid, candy1, candy2) => {
  const newGrid = grid.map((row) => [...row]);
  const temp = { ...newGrid[candy1.row][candy1.col] };
  newGrid[candy1.row][candy1.col] = {
    ...newGrid[candy2.row][candy2.col],
    row: candy1.row,
    col: candy1.col,
  };
  newGrid[candy2.row][candy2.col] = {
    ...temp,
    row: candy2.row,
    col: candy2.col,
  };
  return newGrid;
};
