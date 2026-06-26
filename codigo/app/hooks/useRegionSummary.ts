"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch hook: state updates happen inside async resolution */

import { useEffect, useState } from "react";
import { getRegionSummary } from "@/lib/api";
import { RegionSummary } from "@/lib/types";

export function useRegionSummary(region: string) {
  const [data, setData] = useState<RegionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!region) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getRegionSummary(region)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error desconocido")
      )
      .finally(() => setLoading(false));
  }, [region]);

  return { data, loading, error };
}
