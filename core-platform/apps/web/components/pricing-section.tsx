"use client";
import React from "react";
import { Check } from "lucide-react";
import { Button } from "./ui/moving-border";

const plans = [
    {
        name: "Starter",
        price: "$29",
        description: "Perfect for small teams getting started",
        features: [
            "Up to 10 team members",
            "Basic project management",
            "5GB storage",
            "Email support",
            "Mobile apps",
        ],
        popular: false,
    },
    {
        name: "Professional",
        price: "$79",
        description: "For growing teams that need more power",
        features: [
            "Up to 50 team members",
            "Advanced project management",
            "100GB storage",
            "Priority support",
            "Custom integrations",
            "Advanced analytics",
            "API access",
        ],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with custom needs",
        features: [
            "Unlimited team members",
            "Enterprise features",
            "Unlimited storage",
            "24/7 dedicated support",
            "Custom development",
            "SLA guarantee",
            "On-premise deployment",
            "Advanced security",
        ],
        popular: false,
    },
];

export function PricingSection() {
    return (
        <div className="w-full bg-black py-20 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Choose the perfect plan for your team. All plans include a 14-day
                        free trial.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-2xl p-8 ${plan.popular
                                    ? "bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-purple-500"
                                    : "bg-slate-900 border border-slate-800"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">
                                    {plan.name}
                                </h3>
                                <p className="text-slate-400 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <span className="text-5xl font-bold text-white">
                                    {plan.price}
                                </span>
                                {plan.price !== "Custom" && (
                                    <span className="text-slate-400 ml-2">/month</span>
                                )}
                            </div>

                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-start gap-3">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {plan.popular ? (
                                <Button
                                    borderRadius="1rem"
                                    className="w-full bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                                >
                                    Get Started
                                </Button>
                            ) : (
                                <button className="w-full px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-all duration-300">
                                    Get Started
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
