import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const HelpPage = () => {
  return (
    <>
      <Head>
        <title>kih smp - guide</title>
        <meta
          name="description"
          content="about the server & quick guide to install the modpack"
        />
        <meta name="theme-color" content="#000000" />

        <meta property="og:type" content="website" />
        <meta property="og:image" content="/display.gif" />
        <meta property="og:image:width" content="1400" />
        <meta property="og:image:height" content="900" />
        <meta property="og:url" content="https://kih.vercel.app/" />
        <meta property="og:site_name" content="kih smp" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="kih smp" />
        <meta
          property="og:description"
          content="about the server & quick guide to install the modpack"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@not_manu" />
        <meta name="twitter:creator" content="@not_manu" />
        <meta name="twitter:title" content="kih smp" />
        <meta
          name="twitter:description"
          content="about the server & quick guide to install the modpack"
        />
        <meta name="twitter:image" content="/display.gif" />
        <meta name="twitter:image:alt" content="kih smp" />
        <meta name="twitter:domain" content="https://kih.vercel.app/" />
        <meta name="twitter:url" content="https://kih.vercel.app/" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-black bg-opacity-80 min-[1200px]:py-32 py-16 min-h-screen flex flex-col w-full justify-center items-center">
        <article class="prose prose-invert font-minecraft w-full prose-2xl prose-neutral">
          <h3>Guide & Tutorial</h3>
          <span className="italic text-neutral-500">Updated 9/12/23</span>
          <ul className="list-square">
            <li>
              <a href="#about" className="text-blue-500">
                About The Server
              </a>
            </li>
            <li>
              <a href="#install" className="text-blue-500">
                Installing The Modpack
              </a>
            </li>
            <li>
              <a href="#join" className="text-blue-500">
                Joining The Server
              </a>
            </li>
            <li>
              <a href="#issues" className="text-blue-500">
                Having Issues?
              </a>
            </li>
          </ul>
          <Image
            src="/main.png"
            width={1400}
            height={300}
            alt="kih smp"
            className="object-cover"
          />
          <h4 id="about">About The Server</h4>
          <p>
            This is Season 2. We are playing on the latest version of Minecraft, <b>1.20.1</b>. 
            The client is modded with <b>Forge 47.2.0</b>. The modpack is called &quot;Create Perfect World&quot; which you can download {" "}
            <a 
              href="https://www.curseforge.com/minecraft/modpacks/create-perfect-world" className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>.
          </p>
          <h4 id="install">Installing The Modpack</h4>
          <p>
            <b className="text-red-500">1.</b> If you don&apos;t have it already, install <b>Minecraft Java Edition</b> from{" "}
            <a
              href="https://www.minecraft.net/en-us/store/minecraft-java-edition"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              minecraft.net
            </a> and login with your account. Play <b>Java 1.20.1</b> at least once.
            <br/>
            <br/>
            <b className="text-red-500">2.</b> Install the CurseForge app from{" "}
            <a
              href="https://curseforge.overwolf.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              curseforge.overwolf.com
            </a>
            <br/>
            <br/>
            <b className="text-red-500">3.</b> Search for &quot;Create Perfect World&quot; in CurseForge and install it.
            <br/>
            <br/>
            <b className="text-red-500">4.</b> Once you have the modpack installed, click on the &quot;Play&quot; button. It will open Minecraft Launcher with the modpack.
            <br/>
            <br/>
            <b className="text-red-500">5.</b> Click Play again and wait for the game to load. It might take a while the first time.
            <br/>
            <br/>
            <b className="text-red-500">6.</b> Once you are in the Minecraft main menu, click on &quot;Multiplayer&quot; and then &quot;Direct Connect&quot;.
          </p>
          <h4 id="join">Joining The Server</h4>
          <p>Finally, go back to the <Link href="/" className="text-blue-500">home page</Link> of this website click on the green <span className="text-green-500">Start</span> button. It usually takes ~60 seconds to start the server. 
          Once it is ready, copy the IP address (usually something like this: <span className="text-neutral-500">0.tcp.in.ngrok.io:69420</span>) and paste it in the &quot;Server Address&quot; field in Minecraft. Click &quot;Join Server&quot; and you are in!</p>
          <h4 id="issues">Having Issues?</h4>
          <p>
            Reach out to @not.manu. on Discord.
          </p>
          <br/>
          <br/>
          <span className="text-neutral-500">Thank you!</span>
        </article>
        <div className="w-full h-[300px] flex flex-col justify-center items-center font-minecraft">
          <div className="grow"></div>
          <div className="mt-12 text-2xl">
            <span className="text-neutral-500">
              <span className="text-neutral-400">&#60;/&#62;</span> with{" "}
              <span className="text-neutral-400">&#60;3</span> by{" "}
              <span className="text-neutral-400">@not.manu.</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;
