import React from "react";
import { motion } from "framer-motion";

// Helper function to save game state using File System Access API
const saveGameStateToFile = async (state) => {
    try {
        // Check if File System Access API is supported
        if (!window.showSaveFilePicker) {
            console.log("File System Access API not supported, falling back to Blob download");
            const serializedState = {
                ...state,
                matchedCandies: Array.from(state.matchedCandies),
            };
            const blob = new Blob([JSON.stringify(serializedState, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `candy_crush_level_${state.levelConfig.id}_save.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log("Game state saved via Blob for level:", state.levelConfig.id);
            alert("Game saved successfully (using fallback method)!");
            return true;
        }

        const serializedState = {
            ...state,
            matchedCandies: Array.from(state.matchedCandies), // Convert Set to Array
        };
        console.log("Saving game state for level:", serializedState.levelConfig.id);

        const handle = await window.showSaveFilePicker({
            suggestedName: `candy_crush_level_${serializedState.levelConfig.id}_save.json`,
            types: [
                {
                    description: "JSON Files",
                    accept: { "application/json": [".json"] },
                },
            ],
        });
        const writable = await handle.createWritable();
        await writable.write(JSON.stringify(serializedState, null, 2));
        await writable.close();
        console.log("Game state saved to file for level:", serializedState.levelConfig.id);
        alert("Game saved successfully!");
        return true;
    } catch (error) {
        console.error("Error saving game state to file:", error);
        alert("Failed to save game to file: " + (error.message || "Unknown error."));
        return false;
    }
};

const SaveGameComponent = ({ gameState }) => {
    const handleSaveGame = async () => {
        await saveGameStateToFile(gameState);
    };

    return (
        <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <button
                onClick={handleSaveGame}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors font-semibold mt-5"
            >
                Save Game to File
            </button>
        </motion.div>
    );
};

export default SaveGameComponent;