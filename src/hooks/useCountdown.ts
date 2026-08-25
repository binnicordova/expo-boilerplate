import {useEffect, useRef, useState} from "react";

const TICK_MS = 250;

export const useCountdown = (
    deadline: number | null,
    onExpire?: () => void
) => {
    const [remainingMs, setRemainingMs] = useState(() =>
        deadline ? Math.max(0, deadline - Date.now()) : 0
    );

    const expireRef = useRef(onExpire);
    expireRef.current = onExpire;

    useEffect(() => {
        if (!deadline) {
            setRemainingMs(0);
            return;
        }

        let expired = false;

        const tick = () => {
            const next = Math.max(0, deadline - Date.now());
            setRemainingMs(next);

            if (next === 0 && !expired) {
                expired = true;
                expireRef.current?.();
            }
        };

        tick();
        const interval = setInterval(tick, TICK_MS);

        return () => clearInterval(interval);
    }, [deadline]);

    return {
        remainingMs,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        isExpired: Boolean(deadline) && remainingMs === 0,
    };
};
