"use client"
// pages/game/[level].jsx
import React from "react";

import { levels } from "../../data/levels";
import GameComponent from "../../components/GameComponent";
import { useParams, useRouter } from "next/navigation";

const LevelPage = () => {
    const { level } = useParams(); // Get level ID from URL params
    const levelId = parseInt(level, 10);
    const levelConfig = levels.find((l) => l.id === levelId);

    if (!levelConfig) {
        return <div>Level not found</div>;
    }

    return <GameComponent levelConfig={levelConfig} />;
};

export default LevelPage;