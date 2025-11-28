"use client";

import { useEffect } from "react";
import { trackVisit } from "@/lib/analytics";

export function AnalyticsTracker() {
    useEffect(() => {
        trackVisit();
    }, []);

    return null;
}
