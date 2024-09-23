import React from 'react';

// Hangman component
type HangmanProps = {
    wrongCounter: number;
};

const Hangman: React.FC<HangmanProps> = ({ wrongCounter }) => {
    // Parts of the stick figure that get revealed as the game progresses
    // 6 colors from white to black
    const colors = [
        '#FFFFFF', // White
        '#D9D9D9', // Light Gray
        '#B3B3B3', // Gray
        '#7F7F7F', // Dark Gray
        '#4D4D4D', // Darker Gray
        '#000000', // Black
    ];

    const parts = [
        <circle key="head" cx="140" cy="60" r="20" stroke={colors[wrongCounter - 1]} strokeWidth="4" fill="none" />, // Head
        <line key="body" x1="140" y1="80" x2="140" y2="140" stroke={colors[wrongCounter - 1]} strokeWidth="4" />, // Body
        <line key="left-arm" x1="140" y1="100" x2="110" y2="120" stroke={colors[wrongCounter - 1]} strokeWidth="4" />, // Left Arm
        <line key="right-arm" x1="140" y1="100" x2="170" y2="120" stroke={colors[wrongCounter - 1]} strokeWidth="4" />, // Right Arm
        <line key="left-leg" x1="140" y1="140" x2="110" y2="170" stroke={colors[wrongCounter - 1]} strokeWidth="4" />, // Left Leg
        <line key="right-leg" x1="140" y1="140" x2="170" y2="170" stroke={colors[wrongCounter - 1]} strokeWidth="4" />, // Right Leg
    ];
    return (
        <svg height="250" width="200" style={{ transform: 'scaleX(-1)' }}>
            {/* Gallows */}
            <line x1="60" y1="20" x2="140" y2="20" stroke="white" strokeWidth="4" /> {/* Top beam */}
            <line x1="60" y1="20" x2="60" y2="230" stroke="white" strokeWidth="4" /> {/* Side post */}
            <line x1="20" y1="230" x2="100" y2="230" stroke="white" strokeWidth="4" /> {/* Base */}
            <line x1="140" y1="20" x2="140" y2="40" stroke="white" strokeWidth="4" /> {/* Rope */}
            {/* Stickman (revealed based on wrong guesses) */}
            {parts.slice(0, wrongCounter)}
        </svg>
    );
};

export default Hangman;
