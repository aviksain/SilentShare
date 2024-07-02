"use client";

import Link from "next/link";
import { Vortex } from "@/components/ui/vortex";

export default function Home() {
  return (
    <>
      <div className="w-full mx-auto rounded-md  h-screen overflow-hidden">
        <Vortex
          backgroundColor="black"
          rangeY={800}
          particleCount={500}
          baseHue={120}
          className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
        >
          <h2 className="text-white text-2xl md:text-6xl font-bold text-center">
            Dive into the World of Anonymous Share.
          </h2>
          <p className="text-white text-sm md:text-2xl max-w-2xl mt-6 text-center">
            Silent Share - Where your identity remains a secret.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <Link href={"/signin"}>
              <button className="relative inline-flex h-12 overflow-hidden  p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-xl">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center  bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Sign In
                </span>
              </button>
            </Link>
            <Link href={"/signup"} className="px-4 py-2  text-white ">
              Sign Up
            </Link>
          </div>
        </Vortex>
      </div>
    </>
  );
}
