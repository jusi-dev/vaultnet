"use client"

import Image from "next/image";
import { BackgroundDrop } from "./background";

export default function Home() {
  return (
    <main className="container mx-auto m-0 p-0 h-screen w-screen">
      <div className="flex items-center justify-center h-full w-full absolute z-20">
        <div className="mx-20 flex flex-col justify-center items-center gap-y-10">
          <div className="bg-white rounded-full p-4 drop-shadow-xl">
            <Image src="/logo-faultnet.png" width={250} height={170} alt="VaultNet" />
          </div>
          <div className="flex flex-col gap-y-6">
            <h1 className="text-7xl text-gray-800 font-extrabold text-center">Swiss Precision for Your Data: <br /> <span className="text-5xl">Secure, Private, and as Solid as the Alps.</span></h1>
            <p className="text-gray-500 text-center text-2xl">Start saving your files securely in Switzerland, within a minute.</p>
          </div>
        </div>
      </div>

      <BackgroundDrop />
    </main>
  );
}
