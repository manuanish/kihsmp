import Image from "next/image";
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
      <p>{progressBar}</p>
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
  const [ip, setIp] = useState(null);

  useEffect(() => {
    // Fetch Status from /api/status
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setServerStatus(data.status);
        if (data.status === "online") {
          setOnline(true);
          setTimeout(async () => {
            await fetch("/api/ip").then((res) => res.json()).then((data) => {
              
                setIp(data.ip);
              
            });
            }, 4000);
        } else if (data.status === "starting") {
          setOnline(false);
          setStarting(true);
        } else if (data.status === "stopping") {
          setOnline(false);
          setStopping(true);
        } else if (data.status === "offline") {
          setOnline(false);
        }
      });
  }, []);

  const handleStartUp = () => {
    setStarting(true);
    fetch("/api/start");
    setTimeout(() => {
      fetch("/api/status")
        .then((res) => res.json())
        .then((data) => {
          setServerStatus(data.status);
          if (data.status === "online") {
            setOnline(true);
            setStarting(false);
              setTimeout(async () => {
              await fetch("/api/ip").then((res) => res.json()).then((data) => {
                
                  setIp(data.ip);
                
              });
              }, 4000);
          }
        });
    }, 23000);
  };

  const handleStop = () => {
    setStopping(true);
    fetch("/api/stop");
    setOnline(false);
    setTimeout(() => {
      setStopping(false);
      fetch("/api/status")
        .then((res) => res.json())
        .then((data) => {
          setServerStatus(data.status);
          setOnline(false);
          setStopping(false);
        });

    }, 7000);
  };

  return (
    <>
      <main
        className={`min-h-screen text-white bg-black bg-opacity-80 font-minecraft tracking-wide min-[1000px]:p-32 p-16`}
      >
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
          <span className="text-neutral-300 select-none">Mod Loader:</span>{" "}
          <span className="text-neutral-500">Forge 47.2.0</span> <br />
          <span className="text-neutral-300 select-none">Modpack:</span>{" "}
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
                  Fetching IP<AnimatedPeriods />
                </span>
              )
              
            ) : starting ? (
              <span className="w-full flex justify-start">
                <LoadingText totalSeconds={23} barLength={17} />
              </span>
            ) : stopping ? (
              <span className="w-full flex justify-start">
                <LoadingText totalSeconds={7} barLength={17} />
              </span>
            ) : (
              <span className="italic text-neutral-500 text-2xl">
                Server is not online<AnimatedPeriods />
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
      </main>
      <footer className="absolute bottom-0 left-0 right-0 text-center text-neutral-500 text-2xl">
      </footer>
    </>
  );
}
