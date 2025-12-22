import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useVisualEnergy Hook
 * 
 * Implements privacy-first crowd kinetic energy estimation.
 * Uses pixel difference method (optical flow approximation).
 * 
 * - Captures video frame-by-frame.
 * - Compares luminance difference between current and previous frame.
 * - Calculates "Energy" based on percentage of changing pixels.
 * - Provides on-demand snapshot capability for cloud context.
 * 
 * PRIVACY: Frames are processed in memory and immediately discarded.
 * No specific details (faces, identities) are stored or analyzed.
 */
const useVisualEnergy = () => {
    // State
    const [kineticEnergy, setKineticEnergy] = useState(0);
    const [isCameraActive, setIsCameraActive] = useState(false);

    // Refs for Media Interaction
    const videoRef = useRef(null);
    const canvasRef = useRef(null); // Processing canvas (small)
    const snapshotCanvasRef = useRef(null); // Snapshot canvas (higher res)

    // Logic Refs
    const prevFrameRef = useRef(null);
    const animationRef = useRef(null);
    const streamRef = useRef(null);

    // 1. Setup Stream
    const setupStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 }, // Higher res for good snapshots, downsampled for processing
                    height: { ideal: 480 },
                    frameRate: { ideal: 15 } // 15fps is enough for motion
                }
            });

            streamRef.current = stream;

            // Initialize Hidden Video Element
            if (!videoRef.current) {
                videoRef.current = document.createElement('video');
                videoRef.current.muted = true;
                videoRef.current.playsInline = true;
            }
            videoRef.current.srcObject = stream;

            await videoRef.current.play();

            // Initialize Canvases
            if (!canvasRef.current) {
                canvasRef.current = document.createElement('canvas'); // Small for processing
            }
            if (!snapshotCanvasRef.current) {
                snapshotCanvasRef.current = document.createElement('canvas'); // Full size for snapshot
            }

            // Wait for metadata
            videoRef.current.onloadedmetadata = () => {
                // Processing Canvas (160x120 for speed)
                canvasRef.current.width = 160;
                canvasRef.current.height = 120;

                // Snapshot Canvas (640x480 for clarity)
                snapshotCanvasRef.current.width = 640;
                snapshotCanvasRef.current.height = 480;

                setIsCameraActive(true);
                processFrame();
            };

        } catch (err) {
            console.warn("Camera Access Failed:", err);
            setIsCameraActive(false);
        }
    };

    // 2. Cleanup Stream
    const stopStream = () => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.pause();
        }

        prevFrameRef.current = null;
        setIsCameraActive(false);
        setKineticEnergy(0);
    };

    // 3. Frame Processing Loop (The "Motion Detector")
    const processFrame = () => {
        if (!videoRef.current || !canvasRef.current || !streamRef.current) return;

        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Draw small frame for processing
        ctx.drawImage(videoRef.current, 0, 0, width, height);

        // Get Pixels
        const frame = ctx.getImageData(0, 0, width, height);
        const data = frame.data;

        let movementScore = 0;
        let significantPixels = 0;

        // Compare with previous frame
        if (prevFrameRef.current) {
            const prevData = prevFrameRef.current.data;
            const threshold = 30; // Luminance diff threshold

            // Loop step 4 (RGBA)
            for (let i = 0; i < data.length; i += 4) {
                // Simple avg luminance
                const lum1 = (data[i] + data[i + 1] + data[i + 2]) / 3;
                const lum2 = (prevData[i] + prevData[i + 1] + prevData[i + 2]) / 3;

                if (Math.abs(lum1 - lum2) > threshold) {
                    significantPixels++;
                }
            }

            // Normalize: 30% pixel change = 100% Energy
            const ratio = significantPixels / (width * height);
            movementScore = Math.min(100, (ratio / 0.3) * 100);
        }

        prevFrameRef.current = frame;
        setKineticEnergy(prev => prev * 0.8 + movementScore * 0.2); // Smooth output

        animationRef.current = requestAnimationFrame(processFrame);
    };

    // 4. Snapshot Capability (The "Azure Uplink")
    const takeSnapshot = useCallback(() => {
        if (!videoRef.current || !snapshotCanvasRef.current || !isCameraActive) return null;

        const ctx = snapshotCanvasRef.current.getContext('2d');
        // Draw full res frame
        ctx.drawImage(videoRef.current, 0, 0, snapshotCanvasRef.current.width, snapshotCanvasRef.current.height);

        // Return Base64 JPEG (Quality 0.6)
        return snapshotCanvasRef.current.toDataURL('image/jpeg', 0.6);
    }, [isCameraActive]);

    // Lifecycle
    useEffect(() => {
        setupStream();
        return () => stopStream();
    }, []);

    return { kineticEnergy, isCameraActive, takeSnapshot };
};

export default useVisualEnergy;
