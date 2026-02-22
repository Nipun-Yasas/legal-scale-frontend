"use client";

import React, { useEffect, useState } from "react";
import { Hourglass } from "ldrs/react";
import "ldrs/react/Hourglass.css";
import { useTheme } from "next-themes";

export const Loading = () => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Hourglass
                size="40"
                bgOpacity="0.1"
                speed="1.75"
                color="black"
            />
        );
    }

    return (
        <Hourglass
            size="40"
            bgOpacity="0.1"
            speed="1.75"
            color={resolvedTheme === "dark" ? "white" : "black"}
        />
    );
};
