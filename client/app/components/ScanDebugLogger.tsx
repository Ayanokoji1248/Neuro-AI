"use client";

import { useEffect } from "react";
import type { Scan } from "../interface";

export default function ScanDebugLogger({ scan }: { scan: Scan }) {
    useEffect(() => {
        console.log("=== SCAN DEBUG INFO ===");
        console.log("Full scan object:", scan);
        console.log("Image URLs:");
        console.log("  imageUrl:", scan.imageUrl);
        console.log("  overlayUrl:", scan.overlayUrl);
        console.log("  maskUrl:", scan.maskUrl);
        console.log("  coloredMaskUrl:", scan.coloredMaskUrl);
        console.log("  flairPreviewUrl:", scan.flairPreviewUrl);
        console.log("=== END DEBUG INFO ===");
    }, [scan]);

    return null;
}
