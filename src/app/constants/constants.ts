// Create volatility based on symbol
export const volatility =
  {
    MLGO: 0.15, // High volatility (15%)
    MBOT: 0.08, // Medium-high volatility
    MCHP: 0.05, // Low volatility (stable large cap)
    "CY9D.FRK": 0.07, // European market
    MCHPP: 0.05, // Similar to MCHP
    "MBX.TRT": 0.1, // Canadian market
    MALG: 0.12, // Higher volatility
    MBXBF: 0.1, // Similar to MBX.TRT
    "0K19.LON": 0.05, // UK market (stable)
    VENAF: 0.2, // Warrants (very high volatility)
  }[symbol] || 0.1;
