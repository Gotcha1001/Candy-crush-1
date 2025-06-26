"use client";

import React from "react";
import { levels } from "../../data/levels";
import GameComponent from "../../components/GameComponent";
import { useParams, useRouter } from "next/navigation";

const LevelPage = () => {
    const { level } = useParams();
    const router = useRouter();
    const levelId = parseInt(level, 10);

    if (isNaN(levelId) || levelId < 1 || levelId > levels.length) {
        console.error("Invalid level ID:", level);
        router.push("/"); // Redirect to home if level is invalid
        return <div>Level not found</div>;
    }

    const levelConfig = levels.find((l) => l.id === levelId);
    if (!levelConfig) {
        console.error("Level config not found for ID:", levelId);
        router.push("/");
        return <div>Level not found</div>;
    }

    return <GameComponent levelConfig={levelConfig} />;
};

export default LevelPage;