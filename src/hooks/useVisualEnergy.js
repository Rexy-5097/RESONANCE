import { useState, useEffect, useRef } from 'react';

/**
 * useVisualEnergy Hook
 * 
 * Implements privacy-first crowd kinetic energy estimation.
 * Uses pixel difference method (optical flow approximation).
 * 
 * - Captures video frame-by-frame.
 * - Compares luminance difference between current and previous frame.
 * - Calculates "Energy" based on percentage of changing pixels.
 * 
 * PRIVACY: Frames are processed in memory and immediately discarded.
 * No specific details (faces, identities) are stored or analyzed.
 */
const useVisualEnergy = () => {
    const [stats, setStats] = useState({
        kineticEnergy: 0,
        isCameraActive: false
    });

    const videoRef = useRef(document.createElement('video'));
    const canvasRef = useRef(document.createElement('canvas'));
    const prevFrameRef = useRef(null);
    const rafIdRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 320 }, // Low res sufficient for motion
                        height: { ideal: 240 },
                        frameRate: { ideal: 15 } // Lower framerate reduces CPU load
                    }
                });

                streamRef.current = stream;
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                // Set canvas size once video metadata loads
                videoRef.current.onloadedmetadata = () => {
                    canvasRef.current.width = 160; // Downsample for processing speed
                    canvasRef.current.height = 120;
                    processFrame();
                };

                setStats(prev => ({ ...prev, isCameraActive: true }));

            } catch (err) {
                console.warn("Camera Access Failed:", err);
                setStats(prev => ({ ...prev, isCameraActive: false }));
            }
        };

        const processFrame = () => {
            if (!videoRef.current || !canvasRef.current) return;

            const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;

            // Draw current video frame to canvas
            ctx.drawImage(videoRef.current, 0, 0, width, height);

            // Get pixel data
            const frame = ctx.getImageData(0, 0, width, height);
            const data = frame.data;
            const length = data.length;

            let movementScore = 0;
            let significantPixels = 0;

            if (prevFrameRef.current) {
                const prevData = prevFrameRef.current.data;
                const threshold = 30; // Sensitivity threshold for pixel change

                // Loop through pixels (RGBA - step by 4)
                for (let i = 0; i < length; i += 4) {
                    // Convert to approximate luminance for comparison: 0.299R + 0.587G + 0.114B
                    // Or just Compare Green channel (heuristic, simpler/faster) or average.
                    // Let's use average for simple diff.
                    const brightness1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
                    const brightness2 = (prevData[i] + prevData[i + 1] + prevData[i + 2]) / 3;

                    const diff = Math.abs(brightness1 - brightness2);

                    if (diff > threshold) {
                        significantPixels++;
                    }
                }

                // Normalize movement score
                // Max theoretical score: all pixels changed.
                // Realistic max for "high energy" is maybe 20-30% of pixels changing fast.
                const totalPixels = width * height;
                const changeRatio = significantPixels / totalPixels;

                // Map 0 - 0.3 change ratio to 0-100 score
                movementScore = Math.min(100, (changeRatio / 0.3) * 100);
            }

            // Update refs
            prevFrameRef.current = frame;

            // Smoothing/Low-pass filter for display stability
            setStats(prev => ({
                ...prev,
                kineticEnergy: prev.kineticEnergy * 0.8 + movementScore * 0.2
            }));

            rafIdRef.current = requestAnimationFrame(processFrame);
        };

        initCamera();

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return stats;
};

export default useVisualEnergy;
