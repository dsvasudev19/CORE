"use client";
import React from "react";
import { Spotlight } from "./ui/spotlight";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { Button } from "./ui/moving-border";
import { BackgroundBeams } from "./ui/background-beams";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <div className="h-screen w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />
            <div className="p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
                <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-slate-300">
                            Next-Gen Enterprise Platform
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                        Transform Your <br /> Business Operations
                    </h1>

                    <TextGenerateEffect
                        words="Streamline HR, project management, and team collaboration with our all-in-one enterprise solution. Built for modern teams who demand excellence."
                        className="mt-4 text-center max-w-3xl"
                    />

                    <div className="flex flex-col md:flex-row gap-4 mt-10">
                        <Button
                            borderRadius="1.75rem"
                            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 px-8 py-4"
                        >
                            <span className="flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Button>

                        <button className="px-8 py-4 rounded-full bg-transparent border border-slate-700 text-white hover:bg-slate-800 transition-all duration-300">
                            Watch Demo
                        </button>
                    </div>

                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                                10K+
                            </div>
                            <div className="text-sm text-slate-400 mt-2">Active Users</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                                99.9%
                            </div>
                            <div className="text-sm text-slate-400 mt-2">Uptime</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                                500+
                            </div>
                            <div className="text-sm text-slate-400 mt-2">Companies</div>
                        </div>
                        <div>
                            <div className="text-3xl md:text-4xl font-bold text-white">
                                24/7
                            </div>
                            <div className="text-sm text-slate-400 mt-2">Support</div>
                        </div>
                    </div>
                </div>
            </div>
            <BackgroundBeams />
        </div>
    );
}
