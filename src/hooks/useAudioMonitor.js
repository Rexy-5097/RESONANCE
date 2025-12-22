import { useState, useEffect, useRef } from 'react';

/**
 * useAudioMonitor Hook
 * 
 * Implements real-time audio analysis for distress detection.
 * 
 * - RMS Volume Calculation: Normalizes standard microphone input to 0-100 range.
 * - Spectral Distress Detection: Monitors 2000Hz-4000Hz band for high energy spikes (screams).
 * 
 * PRIVACY: Processed in memory only. No recording or storage.
 */
const useAudioMonitor = () => {
    const [stats, setStats] = useState({
        audioLevel: 0,
        distressIndex: 0,
        isDistress: false
    });

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);
    const rafIdRef = useRef(null);

    useEffect(() => {
        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
                analyserRef.current = audioContextRef.current.createAnalyser();
                sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);

                // Configuration
                analyserRef.current.fftSize = 256; // Low latency, sufficient resolution
                analyserRef.current.smoothingTimeConstant = 0.8; // Smooth out jitter
                sourceRef.current.connect(analyserRef.current);

                analyzeSignal();
            } catch (err) {
                console.warn("Audio Context Init Failed:", err);
            }
        };

        const analyzeSignal = () => {
            if (!analyserRef.current) return;

            const bufferLength = analyserRef.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            // 1. Time Domain Data for Volume (RMS)
            analyserRef.current.getByteTimeDomainData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                const x = (dataArray[i] - 128) / 128.0; // Normalize -1 to 1
                sum += x * x;
            }
            const rms = Math.sqrt(sum / bufferLength);
            // Amplify low signals for visibility, cap at 100
            const audioLevel = Math.min(100, rms * 400);

            // 2. Frequency Data for Distress (Spectral Centroid / Band Power)
            analyserRef.current.getByteFrequencyData(dataArray);

            // Target: 2000Hz - 4000Hz (Typical scream/distress range)
            // Sample Rate usually 44100 or 48000. Nyquist ~22050Hz.
            // fftSize 256 -> 128 bins. Bin width ~172Hz (44100/256)
            // 2000Hz is approx bin 12, 4000Hz is approx bin 23.
            const sampleRate = audioContextRef.current.sampleRate;
            const binWidth = sampleRate / analyserRef.current.fftSize;

            const startBin = Math.floor(2000 / binWidth);
            const endBin = Math.floor(4000 / binWidth);

            let distressEnergy = 0;
            let totalEnergy = 0;

            for (let i = 0; i < bufferLength; i++) {
                totalEnergy += dataArray[i];
                if (i >= startBin && i <= endBin) {
                    distressEnergy += dataArray[i];
                }
            }

            // Ratio of distress band to total energy, normalized
            // If totalEnergy is low (silence), ratio might be noisy, so gate it.
            let distressIndex = 0;
            if (totalEnergy > 500) { // Noise floor gate
                distressIndex = (distressEnergy / (endBin - startBin)) / 255 * 100;
                // Amplify for detection sensitivity
                distressIndex = Math.min(100, distressIndex * 3);
            }

            setStats({
                audioLevel,
                distressIndex,
                isDistress: distressIndex > 60 // Threshold
            });

            rafIdRef.current = requestAnimationFrame(analyzeSignal);
        };

        initAudio();

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            if (audioContextRef.current) audioContextRef.current.close();
            if (sourceRef.current) sourceRef.current.disconnect();
        };
    }, []);

    return stats;
};

export default useAudioMonitor;
