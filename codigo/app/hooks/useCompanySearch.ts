"use client";

import { useEffect, useState } from "react";
import { searchCompanies } from "@/lib/api";
import { CompanySearchResult } from "@/lib/types";

export function useCompanySearch(query: string) {
  const [results, setResults] = useState<CompanySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    searchCompanies(query.trim())
      .then((response) => setResults(response.data))
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Error desconocido")
      )
      .finally(() => setLoading(false));
  }, [query]);

  return { results, loading, error };
}
