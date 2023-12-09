import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ["latin"] });

const LoadingText = ({ totalSeconds, barLength }) => {
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState(totalSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress < 100 ? prevProgress + 100 / totalSeconds : prevProgress,
      );
    }, 1000);

    // Update the ETA every second
    const etaInterval = setInterval(() => {
      setEta((prevEta) => (prevEta > 0 ? prevEta - 1 : 0));
    }, 1000);

    // Clear intervals after totalSeconds
    setTimeout(() => {
      clearInterval(interval);
      clearInterval(etaInterval);
    }, totalSeconds * 1000);

    return () => {
      clearInterval(interval);
      clearInterval(etaInterval);
    };
  }, [totalSeconds]);

  const calculateShade = () => {
    const percentage = Math.floor(progress);
    if (percentage < 25) return "░"; // Light Shade
    if (percentage < 50) return "▒"; // Medium Shade
    if (percentage < 75) return "▓"; // Dark Shade
    return "█"; // Full Shade
  };

  const progressBar = Array.from({ length: barLength }, (_, index) => {
    const filled = index * (100 / barLength) < progress;
    return filled ? calculateShade() : " ";
  }).join("");

  return (
    <span className="text-2xl flex">
      {progress < 100 ? (
        <>
          <span className="mr-2">{progressBar}</span>
        </>
      ) : (
        <span className="mr-2 italic text-neutral-500">
          Taking longer than usual
          <AnimatedPeriods />
        </span>
      )}
    </span>
  );
};

const AnimatedPeriods = () => {
  const [periods, setPeriods] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setPeriods((prevPeriods) => {
        if (prevPeriods === "") return ".";
        if (prevPeriods === ".") return "..";
        if (prevPeriods === "..") return "...";
        if (prevPeriods === "...") return "";
        return "...";
      });
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{periods}</>;
};

export default function Home() {
  const [online, setOnline] = useState(false);
  const [starting, setStarting] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState(null);
  const [ip, setIp] = useState(null);
  const normalStartTime = 30;
  const normalStopTime = 7;
  const normalFetchIpTime = 2;

  const fetchServerStatus = async () => {
    try {
      const response = await fetch("/api/status");
      const data = await response.json();

      setServerStatus(data.status);

      if (data.status === "online") {
        setOnline(true);
        setStarting(false);
        setStopping(false);
        setTimeout(async () => {
          const ipResponse = await fetch("/api/ip");
          const ipData = await ipResponse.json();
          setIp(ipData.ip);
        }, normalFetchIpTime * 1000);
      } else if (data.status === "starting") {
        setOnline(false);
        setStarting(true);
        setStopping(false);
        setError(false);
      } else if (data.status === "stopping") {
        setOnline(false);
        setStopping(true);
        setStarting(false);
        setError(false);
      } else if (data.status === "offline") {
        setOnline(false);
        setStarting(false);
        setStopping(false);
        setError(false);
      } else if (data.status === "crashed") {
        setOnline(false);
        setStarting(false);
        setStopping(false);
        setError(true);
      }
    } catch (error) {
      console.error("Error fetching server status:", error);
      setError(true);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayers(data.players);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  useEffect(() => {
    fetchServerStatus();
    fetchPlayers();
  }, []);

  const handleStartUp = async () => {
    setStarting(true);
    await fetch("/api/start");
    setTimeout(() => {
      fetchServerStatus();
      fetchPlayers();
    }, normalStartTime * 1000);
  };

  const handleStop = async () => {
    setStopping(true);
    setOnline(false);
    fetch("/api/stop");
    setTimeout(() => {
      fetchServerStatus();
    }, normalStopTime * 1000);
  };

  return (
    <>
      <Head>
        <title>kih smp</title>
        <meta name="description" content="season 2 server panel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex bg-black bg-opacity-80 min-[1200px]:p-32 p-16 min-h-screen items-center justify-center">
        <main className={`text-white font-minecraft tracking-wide `}>
          <div>
            <div className="flex items-center gap-5 relative w-fit">
              <div className="text-5xl font-bold relative">
                <span className="z-20 relative select-none">kih gamers</span>
                <div className="text-5xl font-bold absolute z-10 top-2 text-neutral-700 whitespace-nowrap select-none">
                  kih gamers
                </div>
              </div>
              <Image
                src="/sparkles.gif"
                alt="Sparkles"
                width={50}
                height={50}
                className="absolute right-[-32px] top-[-16px] select-none z-[30]"
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
