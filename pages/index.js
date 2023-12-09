import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import Link from "next/link";

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
  const [mapIp, setMapIp] = useState(null);
  const normalStartTime = 30;
  const normalStopTime = 10;
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

  const handleMap = async () => {
    // Fetch the map url from the api
    const response = await fetch("/api/map");
    const data = await response.json();
    setMapIp(data.map);
    window.open(data.map, "_blank");
  };

  return (
    <>
      <Head>
        <title>kih smp</title>
        <meta name="description" content="season 2 server panel" />
        <meta name="theme-color" content="#000000" />

        <meta property="og:type" content="website" />
        <meta property="og:image" content="/display.gif" />
        <meta property="og:image:width" content="1400" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content="https://kih.vercel.app/" />
        <meta property="og:site_name" content="kih smp" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="kih smp" />
        <meta property="og:description" content="season 2 server panel" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@not_manu" />
        <meta name="twitter:creator" content="@not_manu" />
        <meta name="twitter:title" content="kih smp" />
        <meta name="twitter:description" content="season 2 server panel" />
        <meta name="twitter:image" content="/display.gif" />
        <meta name="twitter:image:alt" content="kih smp" />
        <meta name="twitter:domain" content="https://kih.vercel.app/" />
        <meta name="twitter:url" content="https://kih.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex bg-black bg-opacity-80 min-[1200px]:p-32 p-16 min-h-screen">
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
            <div className="mt-12 text-3xl whitespace-nowrap">
              <span className="select-none">Status:</span>{" "}
              {online ? (
                <span className="text-green-500 font-bold">ONLINE</span>
              ) : starting ? (
                <span className="text-neutral-500 font-bold">
                  STARTING
                  <AnimatedPeriods />
                </span>
              ) : stopping ? (
                <span className="text-neutral-500 font-bold">
                  STOPPING
                  <AnimatedPeriods />
                </span>
              ) : (
                <span className="text-red-500 font-bold">OFFLINE</span>
              )}
              <br />
              <br />
              <span className="text-neutral-300 select-none">
                Minecraft Version:
              </span>{" "}
              <span className="text-neutral-500">Java 1.20.1</span> <br />
              <span className="text-neutral-300 select-none">
                Mod Loader:
              </span>{" "}
              <span className="text-neutral-500">Forge 47.2.0</span> <br />
              <span className="text-neutral-300 select-none">
                Modpack:
              </span>{" "}
              <a
                className="text-blue-500 underline decoration-[2.5px]"
                href="https://www.curseforge.com/minecraft/modpacks/create-perfect-world"
                target="_blank"
                rel="noopener noreferrer"
              >
                create-perfect-world
              </a>{" "}
              <br />
            </div>
            <div className="flex gap-5 w-fit mt-12">
              <div className="border-4 bg-black border-neutral-500 p-4 w-[384px] h-[72px]">
                {online ? (
                  ip ? (
                    <span className="text-2xl">{ip.replace("tcp://", "")}</span>
                  ) : (
                    <span className="text-2xl italic text-neutral-500">
                      Fetching IP
                      <AnimatedPeriods />
                    </span>
                  )
                ) : starting ? (
                  <span className="w-full flex justify-start">
                    <LoadingText
                      totalSeconds={normalStartTime}
                      barLength={17}
                    />
                  </span>
                ) : stopping ? (
                  <span className="w-full flex justify-start">
                    <LoadingText totalSeconds={normalStopTime} barLength={17} />
                  </span>
                ) : (
                  <span className="italic text-neutral-500 text-2xl">
                    Server is not online
                    <AnimatedPeriods />
                  </span>
                )}
              </div>
            </div>
            <div className="mt-12 flex gap-5 flex-wrap">
              {online ? (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button className="bg-green-600 w-[171px] px-12 py-4 text-3xl border-green-800 border-b-[8px] pt-[20px] hover:cursor-not-allowed opacity-30 select-none">
                    Start
                  </button>
                </div>
              ) : starting ? (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button className="bg-green-600 w-[171px] px-12 py-4 text-3xl border-green-800 border-b-[8px] pt-[20px] hover:cursor-not-allowed opacity-30 select-none">
                    Start
                  </button>
                </div>
              ) : stopping ? (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button className="bg-green-600 w-[171px] px-12 py-4 text-3xl border-green-800 border-b-[8px] pt-[20px] hover:cursor-not-allowed opacity-30 select-none">
                    Start
                  </button>
                </div>
              ) : serverStatus ? (
                <div className="border-[6px] border-black active:border-white">
                  <button
                    className="bg-green-600 w-[171px] px-12 py-4 text-3xl border-b-[12px] border-green-800 hover:border-b-[8px] hover:pt-[20px] active:bg-green-500 duration-[0.05s] select-none"
                    onClick={handleStartUp}
                  >
                    Start
                  </button>
                </div>
              ) : (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button className="bg-green-600 w-[171px] px-12 py-4 text-3xl border-green-800 border-b-[8px] pt-[20px] hover:cursor-not-allowed opacity-30 select-none">
                    Start
                  </button>
                </div>
              )}

              {online ? (
                <div className="border-[6px] border-black active:border-white">
                  <button
                    className="bg-red-600 w-[171px] px-12 py-4 text-3xl border-b-[12px] border-red-800 hover:border-b-[8px] hover:pt-[20px] active:bg-red-500 duration-[0.05s] select-none"
                    onClick={handleStop}
                  >
                    Stop
                  </button>
                </div>
              ) : stopping ? (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button
                    disabled
                    className="bg-red-600 w-[171px] px-12 py-4 text-3xl border-b-[8px] pt-[20px] border-red-800 hover:cursor-not-allowed opacity-30 select-none"
                  >
                    Stop
                  </button>
                </div>
              ) : starting ? (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button
                    disabled
                    className="bg-red-600 w-[171px] px-12 py-4 text-3xl border-b-[8px] pt-[20px] border-red-800 hover:cursor-not-allowed opacity-30 select-none"
                  >
                    Stop
                  </button>
                </div>
              ) : (
                <div className="border-[6px] border-black hover:cursor-not-allowed">
                  <button
                    disabled
                    className="bg-red-600 w-[171px] px-12 py-4 text-3xl border-b-[8px] pt-[20px] border-red-800 hover:cursor-not-allowed opacity-30 select-none"
                  >
                    Stop
                  </button>
                </div>
              )}
            </div>
            <div className="bg-black"></div>
            <div>
              <div className="mt-12 text-2xl">
                <span className="text-neutral-500">
                  <span className="text-neutral-400">&#60;/&#62;</span> with{" "}
                  <span className="text-neutral-400">&#60;3</span> by{" "}
                  <span className="text-neutral-400">@not.manu.</span>
                </span>
              </div>
            </div>
          </div>
        </main>
        <div className="grow w-full min-w-[32px]"></div>
        <div className="flex flex-col w-full min-w-[500px]">
          {online ? (
            mapIp ? (
              <a
                className="flex font-minecraft text-white text-2xl gap-8"
                href={mapIp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image src="/Map.png" alt="Map" width={150} height={150} />
                <div className="flex flex-col text-left">
                  <div className="font-bold text-2xl">
                    Dynamic Map - <span className="text-green-500">Online</span>
                  </div>
                  <div className="text-neutral-500 text-2xl mt-1 max-w-[400px]">
                    Updates in realtime. View player locations and builds.
                    (Click the Map)
                  </div>
                </div>
              </a>
            ) : (
              <button
                className="flex font-minecraft text-white text-2xl gap-8"
                onClick={handleMap}
              >
                <Image src="/Map.png" alt="Map" width={150} height={150} />
                <div className="flex flex-col text-left">
                  <div className="font-bold text-2xl">
                    Dynamic Map - <span className="text-green-500">Online</span>
                  </div>
                  <div className="text-neutral-500 text-2xl mt-1 max-w-[400px]">
                    Updates in realtime. View player locations and builds.
                    (Click the Map)
                  </div>
                </div>
              </button>
            )
          ) : (
            <button
              className="flex font-minecraft text-white text-2xl gap-8 grayscale brightness-60 hover:cursor-not-allowed"
              disabled
            >
              <Image src="/Map.png" alt="Map" width={150} height={150} />
              <div className="flex flex-col text-left">
                <div className="font-bold text-2xl">Dynamic Map - Offline</div>
                <div className="text-neutral-500 text-2xl mt-1 max-w-[400px]">
                  Updates in realtime. View player locations and builds. Server
                  must be online!
                </div>
              </div>
            </button>
          )}
          <Link
            className="flex font-minecraft text-white text-2xl gap-8 mt-10"
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src="/mc-book.webp" alt="book" width={150} height={150} />
            <div className="flex flex-col text-left">
              <div className="font-bold text-2xl">Guide</div>
              <div className="text-neutral-500 text-2xl mt-1 max-w-[400px]">
                About the server & a quick guide to install modpacks. (Click the
                Book)
              </div>
            </div>
          </Link>
          {players.length > 0 ? (
            <div className="text-white text-2xl flex flex-wrap w-full font-minecraft border-opacity-20 overflow-scroll pt-12 mt-6 border-t-4 border-white">
              <div className="flex flex-wrap gap-5">
                {players.map((player, index) => (
                  <div className="text-2xl w-fit flex flex-col items-center shadow-xl hover:bg-black bg-black bg-opacity-30 hover:bg-opacity-50" key={index}>
                    <div>
                      <Image
                        src={"https://mineskin.eu/helm/" + player + "/100.png"}
                        alt="Player"
                        width={50}
                        height={50}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute bottom-0 right-0">
                <Image src="/load.gif" alt="Loading" width={150} height={150} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
