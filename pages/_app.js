import "@/styles/globals.css";
import localFont from "next/font/local";

const minecraft = localFont({
  src: [
    {
      path: "../public/fonts/MinecraftRegular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MinecraftBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/MinecraftItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/MinecraftBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-minecraft",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${minecraft.variable} font-sans`}>
      <Component {...pageProps} />
    </div>
  );
}
