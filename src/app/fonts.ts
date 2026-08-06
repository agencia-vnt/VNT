import localFont from "next/font/local";

export const hostGrotesk = localFont({
  src: [
    {
      path: "./fonts/HostGrotesk-VariableFont_wght.ttf",
      weight: "300 800",
      style: "normal",
    },
    {
      path: "./fonts/HostGrotesk-Italic-VariableFont_wght.ttf",
      weight: "300 800",
      style: "italic",
    },
  ],
  variable: "--font-host-grotesk",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});
