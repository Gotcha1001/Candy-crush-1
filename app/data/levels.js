// data/levels.js
export const levels = [
  {
    id: 1,
    gridSize: 8,
    moves: 25,
    goal: { type: "score", target: 1000 },
  },
  {
    id: 2,
    gridSize: 8,
    moves: 20,
    goal: { type: "score", target: 1500 },
  },
  {
    id: 3,
    gridSize: 8,
    moves: 30,
    goal: { type: "jelly", count: 15 },
  },
  // Example new level (Level 4)
  {
    id: 4,
    gridSize: 10, // Larger grid
    moves: 35,
    goal: { type: "jelly", count: 25 }, // Harder challenge with more jellies
  },
  // Add more levels here as needed
];
