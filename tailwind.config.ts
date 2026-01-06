import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SideBet Brand Colors
        "sb-orange": "#FF6B35",
        "sb-purple": "#7B2CBF",
        "sb-green": "#1BEC09",
        "sb-red": "#FF4444",
        
        // Background Colors
        "sb-black": "#000000",
        "sb-card": "#18181B",
        "sb-card-hover": "#27272A",
        "sb-border": "#27272A",
        "sb-muted": "#71717A",
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      fontSize: {
        "2xs": "10px",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(255, 107, 53, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(255, 107, 53, 0.6)",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
