"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

type Currency = "USD" | "ARS";

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  blueRate: number | null;
  loading: boolean;
  formatPrice: (usdPrice: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  toggleCurrency: () => {},
  blueRate: null,
  loading: true,
  formatPrice: () => "",
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export default function CurrencyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currency, setCurrency] = useState<Currency>("USD");
  const [blueRate, setBlueRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dolar")
      .then((res) => res.json())
      .then((data) => {
        if (data.ok && data.rate) {
          setBlueRate(data.rate);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency((c) => (c === "USD" ? "ARS" : "USD"));
  }, []);

  const formatPrice = useCallback(
    (usdPrice: number): string => {
      if (currency === "USD") {
        return "US$" + new Intl.NumberFormat("en-US").format(usdPrice);
      }
      if (blueRate) {
        const arsPrice = Math.round(usdPrice * blueRate);
        return "$" + new Intl.NumberFormat("de-DE").format(arsPrice);
      }
      return "US$" + new Intl.NumberFormat("en-US").format(usdPrice);
    },
    [currency, blueRate]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, toggleCurrency, blueRate, loading, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}
