import React, {useRef} from 'react';
import {useStyles} from "@/styles/components/SpotlightCardStyles.tsx";
import {Box, type SpacingValue, type SystemProp} from "@mantine/core";

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
    p: SystemProp<SpacingValue> | undefined
}


const SpotlightCard: React.FC<SpotlightCardProps> = ({
                                                         children,
                                                         className = '',
                                                         spotlightColor = 'rgba(255, 255, 255, 0.25)',
                                                         p = undefined
                                                     }) => {
    const divRef = useRef<HTMLDivElement>(null);
    const {classes, cx} = useStyles();

    const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
        if (!divRef.current) return;

        const rect = divRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        divRef.current.style.setProperty('--mouse-x', `${x}px`);
        divRef.current.style.setProperty('--mouse-y', `${y}px`);
        divRef.current.style.setProperty('--spotlight-color', spotlightColor);
    };

    return (
        <Box
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={cx(classes.cardSpotlight, className)}
            p={p}
        >
            {children}
        </Box>
    );
};

export default SpotlightCard;
