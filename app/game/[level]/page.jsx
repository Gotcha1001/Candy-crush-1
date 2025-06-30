"use client";

import React, { useEffect } from "react";
import { levels } from "../../data/levels";
import GameComponent from "../../components/GameComponent";
import { useParams, useRouter } from "next/navigation";

const LevelPage = () => {
    const { level } = useParams();
    const router = useRouter();
    const levelId = parseInt(level, 10);

    useEffect(() => {
        console.log("LevelPage: Parsed level:", level, "levelId:", levelId, "Type:", typeof levelId, "Total levels:", levels.length);
        if (isNaN(levelId) || levelId < 1 || levelId > levels.length) {
            console.error("Invalid level ID:", level, "Parsed as:", levelId);
            router.push("/");
        }
    }, [level, levelId, router]);

    if (isNaN(levelId) || levelId < 1 || levelId > levels.length) {
        return null; // Avoid rendering during redirection
    }

    const levelConfig = levels.find((l) => l.id === levelId);
    if (!levelConfig) {
        console.error("Level config not found for ID:", levelId);
        router.push("/");
        return null;
    }

    console.log("LevelPage: Found levelConfig.id:", levelConfig.id, "Type:", typeof levelConfig.id);
    return <GameComponent levelConfig={levelConfig} />;
};

export default LevelPage;