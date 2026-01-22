"use client";
import React from "react";
import { Button } from "./ui/moving-border";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <div className="w-full bg-black py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Ready to Transform Your Business?
                    </h2>
                    <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
                        Join thousands of companies already using Core Platform to streamline
                        their operations and boost productivity.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Button
                            borderRadius="1.75rem"
                            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 px-8 py-4"
                        >
                            <span className="flex items-center gap-2">
                                Start Free Trial
                                <ArrowRight className="w-4 h-4" />
                            </span>
                        </Button>

                        <button className="px-8 py-4 rounded-full bg-transparent border border-slate-700 text-white hover:bg-slate-800 transition-all duration-300">
                            Schedule a Demo
                        </button>
                    </div>

                    <p className="text-slate-500 text-sm mt-6">
                        No credit card required • 14-day free trial • Cancel anytime
                    </p>
                </div>
            </div>
        </div>
    );
}
