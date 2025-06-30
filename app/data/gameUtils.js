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

// export const initializeGrid = (gridSize, levelId) => {
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
//   return { grid: newGrid, levelId };
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

// export const initializeShellGrid = (gridSize, levelId) => {
//   const shellGrid = Array(gridSize)
//     .fill()
//     .map(() => Array(gridSize).fill(null));
//   if (levelId >= 5) {
//     for (let col = 0; col < gridSize; col++) {
//       shellGrid[gridSize - 1][col] = { hits: 2 };
//     }
//   }
//   return shellGrid;
// };

// export const findMatches = (currentGrid, gridSize) => {
//   const matches = new Set();
//   let specialCandyPosition = null;
//   // Horizontal matches
//   for (let row = 0; row < gridSize; row++) {
//     let count = 1;
//     let startCol = 0;
//     let currentColor = currentGrid[row]?.[0]?.color;
//     let isRegularMatch = currentGrid[row]?.[0] && !currentGrid[row][0].type;
//     if (!currentColor) {
//       console.log(`Skipping row ${row} due to undefined candy at (row,0)`);
//       continue;
//     }
//     for (let col = 1; col <= gridSize; col++) {
//       if (
//         col < gridSize &&
//         currentGrid[row]?.[col]?.color === currentColor &&
//         currentGrid[row][col]?.color !== "multicolor"
//       ) {
//         count++;
//         if (currentGrid[row][col]?.type) {
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
//           currentColor = currentGrid[row]?.[col]?.color;
//           isRegularMatch =
//             currentGrid[row]?.[col] && !currentGrid[row][col].type;
//           if (!currentColor) {
//             console.log(
//               `Skipping column ${col} in row ${row} due to undefined candy`
//             );
//           }
//         }
//       }
//     }
//   }
//   // Vertical matches
//   for (let col = 0; col < gridSize; col++) {
//     let count = 1;
//     let startRow = 0;
//     let currentColor = currentGrid[0]?.[col]?.color;
//     let isRegularMatch = currentGrid[0]?.[col] && !currentGrid[0][col].type;
//     if (!currentColor) {
//       console.log(`Skipping column ${col} due to undefined candy at (0,col)`);
//       continue;
//     }
//     for (let row = 1; row <= gridSize; row++) {
//       if (
//         row < gridSize &&
//         currentGrid[row]?.[col]?.color === currentColor &&
//         currentGrid[row][col]?.color !== "multicolor"
//       ) {
//         count++;
//         if (currentGrid[row][col]?.type) {
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
//           currentColor = currentGrid[row]?.[col]?.color;
//           isRegularMatch =
//             currentGrid[row]?.[col] && !currentGrid[row][col].type;
//           if (!currentColor) {
//             console.log(
//               `Skipping row ${row} in column ${col} due to undefined candy`
//             );
//           }
//         }
//       }
//     }
//   }
//   console.log(
//     `findMatches: matches=[${Array.from(matches).join(
//       ", "
//     )}], specialCandyPosition=${JSON.stringify(specialCandyPosition)}`
//   );
//   return { matches, specialCandyPosition };
// };

// export const checkPossibleMoves = (grid, gridSize, shellGrid) => {
//   const safeShellGrid =
//     shellGrid ||
//     Array(gridSize)
//       .fill()
//       .map(() => Array(gridSize).fill(null));
//   for (let row = 0; row < gridSize; row++) {
//     for (let col = 0; col < gridSize; col++) {
//       if (safeShellGrid[row][col] && safeShellGrid[row][col].hits > 0) continue;
//       // Horizontal swap
//       if (
//         col < gridSize - 1 &&
//         (!safeShellGrid[row][col + 1] || safeShellGrid[row][col + 1].hits === 0)
//       ) {
//         const tempGrid = swapCandies(grid, grid[row][col], grid[row][col + 1]);
//         const { matches } = findMatches(tempGrid, gridSize);
//         if (matches.size > 0) {
//           console.log(
//             `Possible move found: swap (${row},${col}) with (${row},${col + 1})`
//           );
//           return true;
//         }
//       }
//       // Vertical swap
//       if (
//         row < gridSize - 1 &&
//         (!safeShellGrid[row + 1][col] || safeShellGrid[row + 1][col].hits === 0)
//       ) {
//         const tempGrid = swapCandies(grid, grid[row][col], grid[row + 1][col]);
//         const { matches } = findMatches(tempGrid, gridSize);
//         if (matches.size > 0) {
//           console.log(
//             `Possible move found: swap (${row},${col}) with (${row + 1},${col})`
//           );
//           return true;
//         }
//       }
//     }
//   }
//   console.log("No possible moves found");
//   return false;
// };

// export const reshuffleGrid = (
//   gridSize,
//   jellyGrid = null,
//   shellGrid = null,
//   levelId
// ) => {
//   let newGrid = initializeGrid(gridSize, levelId);
//   return { newGrid: newGrid.grid, jellyGrid, shellGrid };
// };

// const shouldBreakShell = (
//   currentGrid,
//   shellRow,
//   shellCol,
//   matchedPositions,
//   gridSize,
//   shellsHitThisMatch = new Set()
// ) => {
//   const shellKey = `${shellRow}-${shellCol}`;
//   console.log(
//     `shouldBreakShell called for (${shellRow},${shellCol}), shellsHitThisMatch: [${Array.from(
//       shellsHitThisMatch
//     ).join(", ")}], matchedPositions: [${Array.from(matchedPositions).join(
//       ", "
//     )}]`
//   );
//   if (
//     shellsHitThisMatch.has(shellKey) ||
//     !currentGrid[shellRow] ||
//     !currentGrid[shellRow][shellCol] ||
//     !matchedPositions.has(shellKey)
//   ) {
//     console.log(
//       `shouldBreakShell (${shellRow},${shellCol}) early exit: already hit or invalid`
//     );
//     return { shouldBreak: false, matchType: null, matchedPositions: [] };
//   }
//   const shellCandyColor = currentGrid[shellRow][shellCol].color;
//   const matchedCoords = Array.from(matchedPositions)
//     .map((pos) => {
//       const [row, col] = pos.split("-").map(Number);
//       return { row, col };
//     })
//     .filter(
//       ({ row, col }) =>
//         row >= 0 &&
//         row < gridSize &&
//         col >= 0 &&
//         col < gridSize &&
//         currentGrid[row] &&
//         currentGrid[row][col] &&
//         currentGrid[row][col].color === shellCandyColor
//     );
//   const horizontalLines = {};
//   const verticalLines = {};
//   matchedCoords.forEach(({ row, col }) => {
//     if (!horizontalLines[row]) horizontalLines[row] = [];
//     horizontalLines[row].push(col);
//     if (!verticalLines[col]) verticalLines[col] = [];
//     verticalLines[col].push(row);
//   });
//   if (horizontalLines[shellRow]) {
//     const cols = horizontalLines[shellRow].sort((a, b) => a - b);
//     let i = 0;
//     while (i <= cols.length - 3) {
//       let consecutiveCount = 1;
//       let lineStart = cols[i];
//       let j = i + 1;
//       while (j < cols.length && cols[j] === cols[j - 1] + 1) {
//         consecutiveCount++;
//         j++;
//       }
//       if (
//         consecutiveCount >= 3 &&
//         shellCol >= lineStart &&
//         shellCol <= lineStart + consecutiveCount - 1
//       ) {
//         console.log(
//           `shouldBreakShell (${shellRow},${shellCol}) found horizontal match`
//         );
//         return {
//           shouldBreak: true,
//           matchType: "horizontal",
//           matchedPositions: cols
//             .slice(i, i + consecutiveCount)
//             .map((col) => `${shellRow}-${col}`),
//         };
//       }
//       i = j;
//     }
//   }
//   if (verticalLines[shellCol]) {
//     const rows = verticalLines[shellCol].sort((a, b) => a - b);
//     let i = 0;
//     while (i <= rows.length - 3) {
//       let consecutiveCount = 1;
//       let lineStart = rows[i];
//       let j = i + 1;
//       while (j < rows.length && rows[j] === rows[j - 1] + 1) {
//         consecutiveCount++;
//         j++;
//       }
//       if (
//         consecutiveCount >= 3 &&
//         shellRow >= lineStart &&
//         shellRow <= lineStart + consecutiveCount - 1
//       ) {
//         console.log(
//           `shouldBreakShell (${shellRow},${shellCol}) found vertical match`
//         );
//         return {
//           shouldBreak: true,
//           matchType: "vertical",
//           matchedPositions: rows
//             .slice(i, i + consecutiveCount)
//             .map((row) => `${row}-${shellCol}`),
//         };
//       }
//       i = j;
//     }
//   }
//   console.log(
//     `shouldBreakShell (${shellRow},${shellCol}) no valid match found`
//   );
//   return { shouldBreak: false, matchType: null, matchedPositions: [] };
// };

// export const processMatches = async (
//   currentGrid,
//   gridSize,
//   setMatchedCandies,
//   lastSwap = null,
//   jellyGrid = null,
//   setRemainingJellies = null,
//   setScore = null,
//   shellGrid = null,
//   setShellGrid = null
// ) => {
//   const callId = Math.random().toString(36).substring(2, 10);
//   console.log(
//     `processMatches called, callId: ${callId}, lastSwap: ${
//       lastSwap ? JSON.stringify(lastSwap) : "none"
//     }`
//   );

//   // Log grid state for debugging
//   console.log(`Grid state:`);
//   for (let row = 0; row < gridSize; row++) {
//     const rowColors = currentGrid[row]
//       ?.map((candy) => candy?.color || "null")
//       .join(", ");
//     console.log(`Row ${row}: [${rowColors}]`);
//   }

//   const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);
//   console.log(
//     `Matches found: [${Array.from(matches).join(
//       ", "
//     )}], specialCandyPosition=${JSON.stringify(specialCandyPosition)}`
//   );

//   if (matches.size === 0 && !lastSwap) {
//     console.log("No matches or special swap to process, exiting");
//     return {
//       newGrid: currentGrid,
//       matchCount: 0,
//       newJellyGrid: jellyGrid,
//       newShellGrid: shellGrid,
//     };
//   }

//   let explosionMatches = new Set();
//   const shellsHitThisMatch = new Set();

//   // Process shells by iterating over matches
//   let newShellGrid = shellGrid ? shellGrid.map((row) => [...row]) : null;
//   if (shellGrid) {
//     console.log(
//       `Processing shells for matches: [${Array.from(matches).join(", ")}]`
//     );
//     for (const match of matches) {
//       const [row, col] = match.split("-").map(Number);
//       if (!newShellGrid[row][col] || newShellGrid[row][col].hits <= 0) {
//         continue;
//       }
//       const shellKey = `${row}-${col}`;
//       console.log(
//         `Checking shell at (${row},${col}), shellKey: ${shellKey}, hits: ${
//           newShellGrid[row][col].hits
//         }, alreadyHit: ${shellsHitThisMatch.has(shellKey)}`
//       );
//       if (shellsHitThisMatch.has(shellKey)) {
//         console.log(
//           `Skipping shell at (${row},${col}) - already hit this cycle`
//         );
//         continue;
//       }
//       const { shouldBreak, matchType, matchedPositions } = shouldBreakShell(
//         currentGrid,
//         row,
//         col,
//         matches,
//         gridSize,
//         shellsHitThisMatch
//       );
//       if (shouldBreak) {
//         console.log(
//           `Shell at (${row},${col}) hits reduced from ${
//             newShellGrid[row][col].hits
//           } to ${
//             newShellGrid[row][col].hits - 1
//           } due to ${matchType} match involving positions [${matchedPositions.join(
//             ", "
//           )}], shellsHitThisMatch before add: [${Array.from(
//             shellsHitThisMatch
//           ).join(", ")}]`
//         );
//         newShellGrid[row][col].hits -= 1;
//         shellsHitThisMatch.add(shellKey);
//         console.log(
//           `shellsHitThisMatch after add: [${Array.from(shellsHitThisMatch).join(
//             ", "
//           )}]`
//         );
//         if (newShellGrid[row][col].hits === 0) {
//           newShellGrid[row][col] = null;
//           playSound("/sounds/shell-break.mp3");
//         } else {
//           playSound("/sounds/shell-hit.mp3");
//         }
//       }
//     }
//     setShellGrid?.(newShellGrid);
//   }

//   // Process special candy effects
//   if (lastSwap) {
//     const { candy1, candy2 } = lastSwap;
//     console.log(
//       `Processing special swap: candy1=${JSON.stringify(
//         candy1
//       )}, candy2=${JSON.stringify(candy2)}`
//     );
//     if (candy1.type === "multicolor" && candy2.type === "multicolor") {
//       // Double multicolor: clear 3x3 area around both candies
//       const positions = [
//         { row: candy1.row, col: candy1.col },
//         { row: candy2.row, col: candy2.col },
//       ];
//       positions.forEach(({ row, col }) => {
//         for (
//           let r = Math.max(0, row - 1);
//           r <= Math.min(gridSize - 1, row + 1);
//           r++
//         ) {
//           for (
//             let c = Math.max(0, col - 1);
//             c <= Math.min(gridSize - 1, col + 1);
//             c++
//           ) {
//             explosionMatches.add(`${r}-${c}`);
//           }
//         }
//       });
//       console.log(
//         `Double multicolor swap at (${candy1.row},${candy1.col}) and (${
//           candy2.row
//         },${candy2.col}), clearing: [${Array.from(explosionMatches).join(
//           ", "
//         )}]`
//       );
//       playSound("/sounds/giant-explosion.mp3");
//     } else if (candy1.type === "multicolor" || candy2.type === "multicolor") {
//       // Single multicolor: clear all candies of the other candy's color
//       let multicolorCandy, regularCandy;
//       if (candy1.type === "multicolor") {
//         multicolorCandy = candy1;
//         regularCandy = candy2;
//       } else {
//         multicolorCandy = candy2;
//         regularCandy = candy1;
//       }
//       const targetColor = regularCandy.color;
//       explosionMatches.add(`${multicolorCandy.row}-${multicolorCandy.col}`);
//       if (targetColor !== "multicolor") {
//         for (let row = 0; row < gridSize; row++) {
//           for (let col = 0; col < gridSize; col++) {
//             if (
//               currentGrid[row][col]?.color === targetColor &&
//               (!newShellGrid || !newShellGrid[row][col]?.hits)
//             ) {
//               explosionMatches.add(`${row}-${col}`);
//             }
//           }
//         }
//       }
//       console.log(
//         `Multicolor swap at (${multicolorCandy.row},${
//           multicolorCandy.col
//         }) with ${targetColor} at (${regularCandy.row},${
//           regularCandy.col
//         }), clearing: [${Array.from(explosionMatches).join(", ")}]`
//       );
//       playSound("/sounds/rainbow-explosion.mp3");
//     } else if (
//       candy1.type === "striped-horizontal" ||
//       candy1.type === "striped-vertical"
//     ) {
//       if (candy1.type === "striped-horizontal") {
//         for (let col = 0; col < gridSize; col++) {
//           if (!newShellGrid || !newShellGrid[candy1.row][col]?.hits) {
//             explosionMatches.add(`${candy1.row}-${col}`);
//           }
//         }
//       } else {
//         for (let row = 0; row < gridSize; row++) {
//           if (!newShellGrid || !newShellGrid[row][candy1.col]?.hits) {
//             explosionMatches.add(`${row}-${candy1.col}`);
//           }
//         }
//       }
//       explosionMatches.add(`${candy1.row}-${candy1.col}`);
//       console.log(
//         `Striped candy swap at (${candy1.row},${candy1.col}), type: ${
//           candy1.type
//         }, clearing: [${Array.from(explosionMatches).join(", ")}]`
//       );
//       playSound("/sounds/striped-explosion.mp3");
//     } else if (
//       candy2.type === "striped-horizontal" ||
//       candy2.type === "striped-vertical"
//     ) {
//       if (candy2.type === "striped-horizontal") {
//         for (let col = 0; col < gridSize; col++) {
//           if (!newShellGrid || !newShellGrid[candy2.row][col]?.hits) {
//             explosionMatches.add(`${candy2.row}-${col}`);
//           }
//         }
//       } else {
//         for (let row = 0; row < gridSize; row++) {
//           if (!newShellGrid || !newShellGrid[row][candy2.col]?.hits) {
//             explosionMatches.add(`${row}-${candy2.col}`);
//           }
//         }
//       }
//       explosionMatches.add(`${candy2.row}-${candy2.col}`);
//       console.log(
//         `Striped candy swap at (${candy2.row},${candy2.col}), type: ${
//           candy2.type
//         }, clearing: [${Array.from(explosionMatches).join(", ")}]`
//       );
//       playSound("/sounds/striped-explosion.mp3");
//     }
//   }

//   const allMatches = new Set([...matches, ...explosionMatches]);
//   console.log(`allMatches: [${Array.from(allMatches).join(", ")}]`);

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
//     setScore((prev) => prev + clearedJellies * 50);
//   }

//   if (allMatches.size > 0) {
//     if (allMatches.size >= 4) {
//       playSound("/sounds/match-4.mp3");
//     } else if (allMatches.size >= 3) {
//       playSound("/sounds/match-3.mp3");
//     }
//   }

//   setMatchedCandies(allMatches);
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   const newGrid = currentGrid.map((row) => [...row]);
//   if (specialCandyPosition) {
//     const { row, col, type } = specialCandyPosition;
//     if (!allMatches.has(`${row}-${col}`)) {
//       if (type === "multicolor") {
//         newGrid[row][col] = {
//           id: `${row}-${col}-${Date.now()}-${Math.random()}`,
//           row,
//           col,
//           color: "multicolor",
//           image: "/images/candies/rainbow.png",
//           type: "multicolor",
//         };
//       } else {
//         newGrid[row][col] = createCandy(row, col, [], type);
//       }
//     }
//   }

//   for (let col = 0; col < gridSize; col++) {
//     const column = [];
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const key = `${row}-${col}`;
//       const isMatched = allMatches.has(key);
//       const hasUnbrokenShell =
//         newShellGrid &&
//         newShellGrid[row][col] &&
//         newShellGrid[row][col].hits > 0;
//       if (
//         (!isMatched ||
//           (specialCandyPosition &&
//             row === specialCandyPosition.row &&
//             col === specialCandyPosition.col &&
//             !allMatches.has(key))) &&
//         !hasUnbrokenShell
//       ) {
//         column.push(newGrid[row][col]);
//       }
//     }
//     let columnIndex = 0;
//     for (let row = gridSize - 1; row >= 0; row--) {
//       const hasUnbrokenShell =
//         newShellGrid &&
//         newShellGrid[row][col] &&
//         newShellGrid[row][col].hits > 0;
//       if (!hasUnbrokenShell) {
//         if (columnIndex < column.length) {
//           const candy = column[columnIndex];
//           newGrid[row][col] = { ...candy, row, col };
//           columnIndex++;
//         } else {
//           newGrid[row][col] = createCandy(row, col);
//         }
//       }
//     }
//   }

//   // Log new grid state to verify matches are cleared
//   console.log(`New grid state after clearing matches:`);
//   for (let row = 0; row < gridSize; row++) {
//     const rowColors = newGrid[row]
//       ?.map((candy) => candy?.color || "null")
//       .join(", ");
//     console.log(`Row ${row}: [${rowColors}]`);
//   }

//   setMatchedCandies(new Set());
//   shellsHitThisMatch.clear();
//   console.log(`processMatches exiting, callId: ${callId}`);
//   return { newGrid, matchCount: allMatches.size, newJellyGrid, newShellGrid };
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
//   setJellyGrid = null,
//   shellGrid = null,
//   setShellGrid = null,
//   levelId
// ) => {
//   const callId = Math.random().toString(36).substring(2, 10);
//   console.log(
//     `processCascadingMatches called, callId: ${callId}, levelId: ${levelId}`
//   );

//   let currentGrid = initialGrid;
//   let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
//   let currentShellGrid = shellGrid
//     ? shellGrid.map((row) => [...row])
//     : initializeShellGrid(gridSize, levelId);
//   let totalMatches = 0;
//   let combo = 1;

//   while (true) {
//     console.log(
//       `Cascade loop, combo: ${combo}, shellGrid at (8,4): ${
//         currentShellGrid[8]?.[4]?.hits || "none"
//       }`
//     );

//     const { newGrid, matchCount, newJellyGrid, newShellGrid } =
//       await processMatches(
//         currentGrid,
//         gridSize,
//         setMatchedCandies,
//         lastSwap,
//         currentJellyGrid,
//         setRemainingJellies,
//         setScore,
//         currentShellGrid,
//         setShellGrid
//       );

//     // Compute grid state hash after processing matches
//     const gridHash = JSON.stringify(
//       newGrid.map((row) =>
//         row.map((candy) => `${candy.color}-${candy.type || ""}`)
//       )
//     );
//     console.log(`New grid hash: ${gridHash}`);

//     if (matchCount === 0) {
//       console.log(
//         `No matches found, checking possible moves with shellGrid: ${!!currentShellGrid}`
//       );
//       if (!checkPossibleMoves(currentGrid, gridSize, currentShellGrid)) {
//         console.log("No possible moves, reshuffling grid...");
//         const {
//           newGrid: reshuffledGrid,
//           jellyGrid: reshuffledJellyGrid,
//           shellGrid: reshuffledShellGrid,
//         } = reshuffleGrid(
//           gridSize,
//           currentJellyGrid,
//           currentShellGrid,
//           levelId
//         );
//         currentGrid = reshuffledGrid;
//         currentJellyGrid = reshuffledJellyGrid || currentJellyGrid;
//         currentShellGrid = reshuffledShellGrid || currentShellGrid;
//         setGrid(currentGrid);
//         if (currentJellyGrid) {
//           setJellyGrid(currentJellyGrid);
//         }
//         if (currentShellGrid) {
//           setShellGrid(currentShellGrid);
//         }
//         playSound("/sounds/reshuffle.mp3");
//         await new Promise((resolve) => setTimeout(resolve, 500));
//         continue;
//       }
//       break;
//     }

//     totalMatches += matchCount;
//     currentGrid = newGrid;
//     currentJellyGrid = newJellyGrid || currentJellyGrid;
//     currentShellGrid = newShellGrid || currentShellGrid;
//     setGrid(currentGrid);
//     setScore((prev) => prev + matchCount * 10 * combo);
//     combo++;
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     lastSwap = null;
//   }

//   console.log(
//     `processCascadingMatches exiting, callId: ${callId}, totalMatches: ${totalMatches}`
//   );
//   return {
//     finalGrid: currentGrid,
//     totalMatches,
//     finalJellyGrid: currentJellyGrid,
//     finalShellGrid: currentShellGrid,
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

export const initializeGrid = (gridSize, levelId) => {
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
  return { grid: newGrid, levelId };
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
  if (levelId >= 5) {
    for (let col = 0; col < gridSize; col++) {
      shellGrid[gridSize - 1][col] = { hits: 2 };
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
    let currentColor = currentGrid[row]?.[0]?.color;
    let isRegularMatch = currentGrid[row]?.[0] && !currentGrid[row][0].type;
    if (!currentColor) {
      console.log(`Skipping row ${row} due to undefined candy at (row,0)`);
      continue;
    }
    for (let col = 1; col <= gridSize; col++) {
      if (
        col < gridSize &&
        currentGrid[row]?.[col]?.color === currentColor &&
        currentGrid[row][col]?.color !== "multicolor"
      ) {
        count++;
        if (currentGrid[row][col]?.type) {
          isRegularMatch = false;
        }
      } else {
        if (count >= 3) {
          for (let i = startCol; i < startCol + count; i++) {
            matches.add(`${row}-${i}`);
          }
          if (isRegularMatch && !specialCandyPosition) {
            if (count >= 4) {
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
          currentColor = currentGrid[row]?.[col]?.color;
          isRegularMatch =
            currentGrid[row]?.[col] && !currentGrid[row][col].type;
          if (!currentColor) {
            console.log(
              `Skipping column ${col} in row ${row} due to undefined candy`
            );
          }
        }
      }
    }
  }
  // Vertical matches
  for (let col = 0; col < gridSize; col++) {
    let count = 1;
    let startRow = 0;
    let currentColor = currentGrid[0]?.[col]?.color;
    let isRegularMatch = currentGrid[0]?.[col] && !currentGrid[0][col].type;
    if (!currentColor) {
      console.log(`Skipping column ${col} due to undefined candy at (0,col)`);
      continue;
    }
    for (let row = 1; row <= gridSize; row++) {
      if (
        row < gridSize &&
        currentGrid[row]?.[col]?.color === currentColor &&
        currentGrid[row][col]?.color !== "multicolor"
      ) {
        count++;
        if (currentGrid[row][col]?.type) {
          isRegularMatch = false;
        }
      } else {
        if (count >= 3) {
          for (let i = startRow; i < startRow + count; i++) {
            matches.add(`${i}-${col}`);
          }
          if (isRegularMatch && !specialCandyPosition) {
            if (count >= 4) {
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
          currentColor = currentGrid[row]?.[col]?.color;
          isRegularMatch =
            currentGrid[row]?.[col] && !currentGrid[row][col].type;
          if (!currentColor) {
            console.log(
              `Skipping row ${row} in column ${col} due to undefined candy`
            );
          }
        }
      }
    }
  }
  console.log(
    `findMatches: matches=[${Array.from(matches).join(
      ", "
    )}], specialCandyPosition=${JSON.stringify(specialCandyPosition)}`
  );
  return { matches, specialCandyPosition };
};

export const checkPossibleMoves = (grid, gridSize, shellGrid) => {
  const safeShellGrid =
    shellGrid ||
    Array(gridSize)
      .fill()
      .map(() => Array(gridSize).fill(null));
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      if (safeShellGrid[row][col] && safeShellGrid[row][col].hits > 0) continue;
      // Horizontal swap
      if (
        col < gridSize - 1 &&
        (!safeShellGrid[row][col + 1] || safeShellGrid[row][col + 1].hits === 0)
      ) {
        const tempGrid = swapCandies(grid, grid[row][col], grid[row][col + 1]);
        const { matches } = findMatches(tempGrid, gridSize);
        if (matches.size > 0) {
          console.log(
            `Possible move found: swap (${row},${col}) with (${row},${col + 1})`
          );
          return true;
        }
      }
      // Vertical swap
      if (
        row < gridSize - 1 &&
        (!safeShellGrid[row + 1][col] || safeShellGrid[row + 1][col].hits === 0)
      ) {
        const tempGrid = swapCandies(grid, grid[row][col], grid[row + 1][col]);
        const { matches } = findMatches(tempGrid, gridSize);
        if (matches.size > 0) {
          console.log(
            `Possible move found: swap (${row},${col}) with (${row + 1},${col})`
          );
          return true;
        }
      }
    }
  }
  console.log("No possible moves found");
  return false;
};

export const reshuffleGrid = (
  gridSize,
  jellyGrid = null,
  shellGrid = null,
  levelId
) => {
  let newGrid = initializeGrid(gridSize, levelId);
  return { newGrid: newGrid.grid, jellyGrid, shellGrid };
};

const shouldBreakShell = (
  currentGrid,
  shellRow,
  shellCol,
  matchedPositions,
  gridSize,
  shellsHitThisMatch = new Set()
) => {
  const shellKey = `${shellRow}-${shellCol}`;
  console.log(
    `shouldBreakShell called for (${shellRow},${shellCol}), shellsHitThisMatch: [${Array.from(
      shellsHitThisMatch
    ).join(", ")}], matchedPositions: [${Array.from(matchedPositions).join(
      ", "
    )}]`
  );
  if (
    shellsHitThisMatch.has(shellKey) ||
    !currentGrid[shellRow] ||
    !currentGrid[shellRow][shellCol] ||
    !matchedPositions.has(shellKey)
  ) {
    console.log(
      `shouldBreakShell (${shellRow},${shellCol}) early exit: already hit or invalid`
    );
    return { shouldBreak: false, matchType: null, matchedPositions: [] };
  }
  const shellCandyColor = currentGrid[shellRow][shellCol].color;
  const matchedCoords = Array.from(matchedPositions)
    .map((pos) => {
      const [row, col] = pos.split("-").map(Number);
      return { row, col };
    })
    .filter(
      ({ row, col }) =>
        row >= 0 &&
        row < gridSize &&
        col >= 0 &&
        col < gridSize &&
        currentGrid[row] &&
        currentGrid[row][col] &&
        currentGrid[row][col].color === shellCandyColor
    );
  const horizontalLines = {};
  const verticalLines = {};
  matchedCoords.forEach(({ row, col }) => {
    if (!horizontalLines[row]) horizontalLines[row] = [];
    horizontalLines[row].push(col);
    if (!verticalLines[col]) verticalLines[col] = [];
    verticalLines[col].push(row);
  });
  if (horizontalLines[shellRow]) {
    const cols = horizontalLines[shellRow].sort((a, b) => a - b);
    let i = 0;
    while (i <= cols.length - 3) {
      let consecutiveCount = 1;
      let lineStart = cols[i];
      let j = i + 1;
      while (j < cols.length && cols[j] === cols[j - 1] + 1) {
        consecutiveCount++;
        j++;
      }
      if (
        consecutiveCount >= 3 &&
        shellCol >= lineStart &&
        shellCol <= lineStart + consecutiveCount - 1
      ) {
        console.log(
          `shouldBreakShell (${shellRow},${shellCol}) found horizontal match`
        );
        return {
          shouldBreak: true,
          matchType: "horizontal",
          matchedPositions: cols
            .slice(i, i + consecutiveCount)
            .map((col) => `${shellRow}-${col}`),
        };
      }
      i = j;
    }
  }
  if (verticalLines[shellCol]) {
    const rows = verticalLines[shellCol].sort((a, b) => a - b);
    let i = 0;
    while (i <= rows.length - 3) {
      let consecutiveCount = 1;
      let lineStart = rows[i];
      let j = i + 1;
      while (j < rows.length && rows[j] === rows[j - 1] + 1) {
        consecutiveCount++;
        j++;
      }
      if (
        consecutiveCount >= 3 &&
        shellRow >= lineStart &&
        shellRow <= lineStart + consecutiveCount - 1
      ) {
        console.log(
          `shouldBreakShell (${shellRow},${shellCol}) found vertical match`
        );
        return {
          shouldBreak: true,
          matchType: "vertical",
          matchedPositions: rows
            .slice(i, i + consecutiveCount)
            .map((row) => `${row}-${shellCol}`),
        };
      }
      i = j;
    }
  }
  console.log(
    `shouldBreakShell (${shellRow},${shellCol}) no valid match found`
  );
  return { shouldBreak: false, matchType: null, matchedPositions: [] };
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
  const callId = Math.random().toString(36).substring(2, 10);
  console.log(
    `processMatches called, callId: ${callId}, lastSwap: ${
      lastSwap ? JSON.stringify(lastSwap) : "none"
    }`
  );

  // Log grid state for debugging
  console.log(`Grid state:`);
  for (let row = 0; row < gridSize; row++) {
    const rowColors = currentGrid[row]
      ?.map((candy) => candy?.color || "null")
      .join(", ");
    console.log(`Row ${row}: [${rowColors}]`);
  }

  const { matches, specialCandyPosition } = findMatches(currentGrid, gridSize);
  console.log(
    `Matches found: [${Array.from(matches).join(
      ", "
    )}], specialCandyPosition=${JSON.stringify(specialCandyPosition)}`
  );

  if (matches.size === 0 && !lastSwap) {
    console.log("No matches or special swap to process, exiting");
    return {
      newGrid: currentGrid,
      matchCount: 0,
      newJellyGrid: jellyGrid,
      newShellGrid: shellGrid,
    };
  }

  let explosionMatches = new Set();
  const shellsHitThisMatch = new Set();

  // Process shells by iterating over matches
  let newShellGrid = shellGrid ? shellGrid.map((row) => [...row]) : null;
  if (shellGrid) {
    console.log(
      `Processing shells for matches: [${Array.from(matches).join(", ")}]`
    );
    for (const match of matches) {
      const [row, col] = match.split("-").map(Number);
      if (!newShellGrid[row][col] || newShellGrid[row][col].hits <= 0) {
        continue;
      }
      const shellKey = `${row}-${col}`;
      console.log(
        `Checking shell at (${row},${col}), shellKey: ${shellKey}, hits: ${
          newShellGrid[row][col].hits
        }, alreadyHit: ${shellsHitThisMatch.has(shellKey)}`
      );
      if (shellsHitThisMatch.has(shellKey)) {
        console.log(
          `Skipping shell at (${row},${col}) - already hit this cycle`
        );
        continue;
      }
      const { shouldBreak, matchType, matchedPositions } = shouldBreakShell(
        currentGrid,
        row,
        col,
        matches,
        gridSize,
        shellsHitThisMatch
      );
      if (shouldBreak) {
        console.log(
          `Shell at (${row},${col}) hits reduced from ${
            newShellGrid[row][col].hits
          } to ${
            newShellGrid[row][col].hits - 1
          } due to ${matchType} match involving positions [${matchedPositions.join(
            ", "
          )}], shellsHitThisMatch before add: [${Array.from(
            shellsHitThisMatch
          ).join(", ")}]`
        );
        newShellGrid[row][col].hits -= 1;
        shellsHitThisMatch.add(shellKey);
        console.log(
          `shellsHitThisMatch after add: [${Array.from(shellsHitThisMatch).join(
            ", "
          )}]`
        );
        if (newShellGrid[row][col].hits === 0) {
          newShellGrid[row][col] = null;
          playSound("/sounds/shell-break.mp3");
        } else {
          playSound("/sounds/shell-hit.mp3");
        }
      }
    }
    setShellGrid?.(newShellGrid);
  }

  // Process special candy effects
  if (lastSwap) {
    const { candy1, candy2 } = lastSwap;
    console.log(
      `Processing special swap: candy1=${JSON.stringify(
        candy1
      )}, candy2=${JSON.stringify(candy2)}`
    );
    if (candy1.type === "multicolor" && candy2.type === "multicolor") {
      // Double multicolor: clear 3x3 area around both candies
      const positions = [
        { row: candy1.row, col: candy1.col },
        { row: candy2.row, col: candy2.col },
      ];
      positions.forEach(({ row, col }) => {
        for (
          let r = Math.max(0, row - 1);
          r <= Math.min(gridSize - 1, row + 1);
          r++
        ) {
          for (
            let c = Math.max(0, col - 1);
            c <= Math.min(gridSize - 1, col + 1);
            c++
          ) {
            explosionMatches.add(`${r}-${c}`);
          }
        }
      });
      console.log(
        `Double multicolor swap at (${candy1.row},${candy1.col}) and (${
          candy2.row
        },${candy2.col}), clearing: [${Array.from(explosionMatches).join(
          ", "
        )}]`
      );
      playSound("/sounds/giant-explosion.mp3");
    } else if (candy1.type === "multicolor" || candy2.type === "multicolor") {
      // Single multicolor: clear all candies of the other candy's color
      let multicolorCandy, regularCandy;
      if (candy1.type === "multicolor") {
        multicolorCandy = candy1;
        regularCandy = candy2;
      } else {
        multicolorCandy = candy2;
        regularCandy = candy1;
      }
      const targetColor = regularCandy.color;
      explosionMatches.add(`${multicolorCandy.row}-${multicolorCandy.col}`);
      if (targetColor !== "multicolor") {
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            if (
              currentGrid[row][col]?.color === targetColor &&
              (!newShellGrid || !newShellGrid[row][col]?.hits)
            ) {
              explosionMatches.add(`${row}-${col}`);
            }
          }
        }
      }
      console.log(
        `Multicolor swap at (${multicolorCandy.row},${
          multicolorCandy.col
        }) with ${targetColor} at (${regularCandy.row},${
          regularCandy.col
        }), clearing: [${Array.from(explosionMatches).join(", ")}]`
      );
      playSound("/sounds/rainbow-explosion.mp3");
    } else if (
      candy1.type === "striped-horizontal" ||
      candy1.type === "striped-vertical"
    ) {
      if (candy1.type === "striped-horizontal") {
        for (let col = 0; col < gridSize; col++) {
          if (!newShellGrid || !newShellGrid[candy1.row][col]?.hits) {
            explosionMatches.add(`${candy1.row}-${col}`);
          }
        }
      } else {
        for (let row = 0; row < gridSize; row++) {
          if (!newShellGrid || !newShellGrid[row][candy1.col]?.hits) {
            explosionMatches.add(`${row}-${candy1.col}`);
          }
        }
      }
      explosionMatches.add(`${candy1.row}-${candy1.col}`);
      console.log(
        `Striped candy swap at (${candy1.row},${candy1.col}), type: ${
          candy1.type
        }, clearing: [${Array.from(explosionMatches).join(", ")}]`
      );
      playSound("/sounds/striped-explosion.mp3");
    } else if (
      candy2.type === "striped-horizontal" ||
      candy2.type === "striped-vertical"
    ) {
      if (candy2.type === "striped-horizontal") {
        for (let col = 0; col < gridSize; col++) {
          if (!newShellGrid || !newShellGrid[candy2.row][col]?.hits) {
            explosionMatches.add(`${candy2.row}-${col}`);
          }
        }
      } else {
        for (let row = 0; row < gridSize; row++) {
          if (!newShellGrid || !newShellGrid[row][candy2.col]?.hits) {
            explosionMatches.add(`${row}-${candy2.col}`);
          }
        }
      }
      explosionMatches.add(`${candy2.row}-${candy2.col}`);
      console.log(
        `Striped candy swap at (${candy2.row},${candy2.col}), type: ${
          candy2.type
        }, clearing: [${Array.from(explosionMatches).join(", ")}]`
      );
      playSound("/sounds/striped-explosion.mp3");
    }
  }

  const allMatches = new Set([...matches, ...explosionMatches]);
  console.log(`allMatches: [${Array.from(allMatches).join(", ")}]`);

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
  for (let col = 0; col < gridSize; col++) {
    const column = [];
    for (let row = gridSize - 1; row >= 0; row--) {
      const key = `${row}-${col}`;
      const isMatched = allMatches.has(key);
      const hasUnbrokenShell =
        newShellGrid &&
        newShellGrid[row][col] &&
        newShellGrid[row][col].hits > 0;
      if (!isMatched && !hasUnbrokenShell) {
        column.push(newGrid[row][col]);
      }
    }
    let columnIndex = 0;
    for (let row = gridSize - 1; row >= 0; row--) {
      const hasUnbrokenShell =
        newShellGrid &&
        newShellGrid[row][col] &&
        newShellGrid[row][col].hits > 0;
      if (!hasUnbrokenShell) {
        if (columnIndex < column.length) {
          const candy = column[columnIndex];
          newGrid[row][col] = { ...candy, row, col };
          columnIndex++;
        } else {
          newGrid[row][col] = createCandy(row, col);
        }
      }
    }
  }

  // Place special candy after filling the grid to ensure it persists
  if (specialCandyPosition) {
    const { row, col, type } = specialCandyPosition;
    const hasUnbrokenShell =
      newShellGrid && newShellGrid[row][col] && newShellGrid[row][col].hits > 0;
    if (!hasUnbrokenShell) {
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
      console.log(
        `Placed special candy at (${row},${col}), type: ${type}, candy: ${JSON.stringify(
          newGrid[row][col]
        )}`
      );
    } else {
      console.log(
        `Skipped placing special candy at (${row},${col}) due to unbroken shell`
      );
    }
  }

  // Log new grid state to verify matches are cleared
  console.log(`New grid state after clearing matches:`);
  for (let row = 0; row < gridSize; row++) {
    const rowColors = newGrid[row]
      ?.map((candy) => candy?.color || "null")
      .join(", ");
    console.log(`Row ${row}: [${rowColors}]`);
  }

  setMatchedCandies(new Set());
  shellsHitThisMatch.clear();
  console.log(`processMatches exiting, callId: ${callId}`);
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
  setShellGrid = null,
  levelId
) => {
  const callId = Math.random().toString(36).substring(2, 10);
  console.log(
    `processCascadingMatches called, callId: ${callId}, levelId: ${levelId}`
  );

  let currentGrid = initialGrid;
  let currentJellyGrid = jellyGrid ? jellyGrid.map((row) => [...row]) : null;
  let currentShellGrid = shellGrid
    ? shellGrid.map((row) => [...row])
    : initializeShellGrid(gridSize, levelId);
  let totalMatches = 0;
  let combo = 1;

  while (true) {
    console.log(
      `Cascade loop, combo: ${combo}, shellGrid at (8,4): ${
        currentShellGrid[8]?.[4]?.hits || "none"
      }`
    );

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

    // Compute grid state hash after processing matches
    const gridHash = JSON.stringify(
      newGrid.map((row) =>
        row.map((candy) => `${candy.color}-${candy.type || ""}`)
      )
    );
    console.log(`New grid hash: ${gridHash}`);

    if (matchCount === 0) {
      console.log(
        `No matches found, checking possible moves with shellGrid: ${!!currentShellGrid}`
      );
      if (!checkPossibleMoves(currentGrid, gridSize, currentShellGrid)) {
        console.log("No possible moves, reshuffling grid...");
        const {
          newGrid: reshuffledGrid,
          jellyGrid: reshuffledJellyGrid,
          shellGrid: reshuffledShellGrid,
        } = reshuffleGrid(
          gridSize,
          currentJellyGrid,
          currentShellGrid,
          levelId
        );
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

  console.log(
    `processCascadingMatches exiting, callId: ${callId}, totalMatches: ${totalMatches}`
  );
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
