"use client";

/* eslint-disable react-hooks/set-state-in-effect -- fetch hook: state updates happen inside async resolution */

import { useEffect, useState } from "react";
import { getCompanyDashboard } from "@/lib/api";
import { CompanyDashboard } from "@/lib/types";

export function useCompanyDashboard(ruc: string) {
  const [data, setData] = useState<CompanyDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ruc || ruc.length !== 11) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    getCompanyDashboard(ruc)
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error desconocido")
      )
      .finally(() => setLoading(false));
  }, [ruc]);

  return { data, loading, error };
}
