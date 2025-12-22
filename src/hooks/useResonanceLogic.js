import { useState, useEffect, useRef, useCallback } from 'react';

// --- SYSTEM CONSTANTS ---
const WARN_THRESHOLD = 50;
const CRIT_THRESHOLD = 80;

// Persistence durations (ms) required to ENTER a state
const WARN_DURATION = 2000;
const CRIT_DURATION = 1000;

// Decay factor (how fast we return to stability).
// Higher = Slower decay. 0.95 is very gradual.
const DECAY_FACTOR = 0.95;

/**
 * useResonanceLogic Hook
 * 
 * The deterministic decision engine for Project RESONANCE.
 * - Fuses Audio + Visual signals.
 * - Applies Hysteresis to prevent state flickering.
 * - Manages System State (STABLE -> ELEVATED -> CRITICAL).
 * - Logs "PHASE_SHIFT" events.
 */
const useResonanceLogic = ({ audioLevel, kineticEnergy }) => {
    // 1. Internal State
    const [systemState, setSystemState] = useState('STABLE'); // STABLE | ELEVATED | CRITICAL
    const [alertLog, setAlertLog] = useState([]);

    // Internal counters for persistence (Refs to avoid re-renders)
    const sustainedWarnTimer = useRef(0);
    const sustainedCritTimer = useRef(0);
    const lastTick = useRef(Date.now());

    // Smoothed fusion score for decay logic
    const [fusionScore, setFusionScore] = useState(0);

    // 2. Logic Loop
    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const delta = now - lastTick.current;
            lastTick.current = now;

            // --- FUSION CALCULATION ---
            // Instantaneous raw score
            const rawScore = (audioLevel + kineticEnergy) / 2;

            // Apply Decay / Smoothing
            // If raw is higher, jump up instantly (react fast to threats).
            // If raw is lower, decay slowly (prevent flickering).
            setFusionScore(prev => {
                if (rawScore > prev) return rawScore;
                return prev * DECAY_FACTOR + rawScore * (1 - DECAY_FACTOR);
            });

            // Use the smoothed score for decision making
            // (We actually use the raw score for *entering* states to be responsive,
            //  but the smoothed score helps stabilization. Let's stick to raw for 
            //  threshold checks to match "Instant Threat" requirement, but use 
            //  timers for persistence).

            // Actually, best practice for this "Phase Shift" logic:
            // Check thresholds against raw input, but require duration.

            // --- CRITICAL LOGIC ---
            if (rawScore > CRIT_THRESHOLD) {
                sustainedCritTimer.current += delta;
            } else {
                sustainedCritTimer.current = 0;
            }

            // --- ELEVATED LOGIC ---
            if (rawScore > WARN_THRESHOLD) {
                sustainedWarnTimer.current += delta;
            } else {
                sustainedWarnTimer.current = 0;
            }

            // --- STATE TRANSITIONS ---
            setSystemState(prevState => {
                let newState = prevState;

                // CRITICAL PRIORITY
                if (sustainedCritTimer.current >= CRIT_DURATION) {
                    newState = 'CRITICAL';
                }
                // ELEVATED PRIORITY (if not critical)
                else if (sustainedWarnTimer.current >= WARN_DURATION && prevState !== 'CRITICAL') {
                    // Note: If we are CRITICAL, we stay CRITICAL until decay logic handling (below)
                    // But here we implement simple "Upgrade" logic.
                    newState = 'ELEVATED';
                }

                // DECAY / DOWNGRADE LOGIC
                // If we are currently CRITICAL, how do we drop?
                // Require raw score to be BELOW threshold for a while?
                // Or simply: if timers are 0, we drop.

                if (prevState === 'CRITICAL' && sustainedCritTimer.current === 0) {
                    // Drop to ELEVATED first if still warning
                    if (sustainedWarnTimer.current > 0) newState = 'ELEVATED';
                    else newState = 'STABLE';
                }

                if (prevState === 'ELEVATED' && sustainedWarnTimer.current === 0) {
                    newState = 'STABLE';
                }

                return newState;
            });
        };

        const interval = setInterval(tick, 100); // 10Hz Decision loop
        return () => clearInterval(interval);
    }, [audioLevel, kineticEnergy]);


    // 3. Event Logging (Side Effect of State Change)
    useEffect(() => {
        if (systemState === 'STABLE') return;

        const newLog = {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            type: 'PHASE_SHIFT',
            level: systemState, // ELEVATED or CRITICAL
            message: systemState === 'CRITICAL'
                ? 'CRITICAL SYNC: Sustained massive energy variance'
                : 'PHASE SHIFT: Correlated stress levels detected'
        };

        setAlertLog(prev => {
            // Prevent duplicate spam? The state change dependency handles most.
            // Check top log.
            if (prev.length > 0 && prev[prev.length - 1].level === systemState &&
                (Date.now() - prev[prev.length - 1].id < 2000)) {
                return prev;
            }

            const next = [...prev, newLog];
            if (next.length > 5) next.shift(); // Keep max 5
            return next;
        });

    }, [systemState]);

    // 4. External Log Injection (for Cloud service)
    const addExternalLog = useCallback((logEntry) => {
        setAlertLog(prev => {
            const next = [...prev, { ...logEntry, id: Date.now() }];
            if (next.length > 5) next.shift();
            return next;
        });
    }, []);

    return { systemState, fusionScore, alertLog, addExternalLog };
};

export default useResonanceLogic;
