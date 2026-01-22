"use client";
import React from "react";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import {
    Users,
    Calendar,
    MessageSquare,
    BarChart3,
    Clock,
    Shield,
} from "lucide-react";

const features = [
    {
        title: "Team Management",
        description:
            "Efficiently manage your team with advanced HR tools, attendance tracking, and performance analytics.",
        icon: Users,
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "Project Planning",
        description:
            "Plan, track, and deliver projects on time with Kanban boards, Gantt charts, and sprint planning.",
        icon: Calendar,
        gradient: "from-purple-500 to-pink-500",
    },
    {
        title: "Real-time Messaging",
        description:
            "Stay connected with your team through channels, direct messages, and video calls.",
        icon: MessageSquare,
        gradient: "from-green-500 to-emerald-500",
    },
    {
        title: "Analytics & Reports",
        description:
            "Make data-driven decisions with comprehensive analytics and customizable reports.",
        icon: BarChart3,
        gradient: "from-orange-500 to-red-500",
    },
    {
        title: "Time Tracking",
        description:
            "Track time spent on tasks and projects with automatic timers and manual entries.",
        icon: Clock,
        gradient: "from-indigo-500 to-purple-500",
    },
    {
        title: "Enterprise Security",
        description:
            "Bank-level security with role-based access control, encryption, and compliance.",
        icon: Shield,
        gradient: "from-pink-500 to-rose-500",
    },
];

export function FeaturesSection() {
    return (
        <div className="w-full bg-black py-20 relative">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Powerful features designed to streamline your workflow and boost
                        productivity
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <CardContainer key={index} className="inter-var">
                            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
                                <CardItem
                                    translateZ="50"
                                    className="text-xl font-bold text-neutral-600 dark:text-white"
                                >
                                    <div
                                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                                    >
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    {feature.title}
                                </CardItem>
                                <CardItem
                                    as="p"
                                    translateZ="60"
                                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                                >
                                    {feature.description}
                                </CardItem>
                                <CardItem translateZ="100" className="w-full mt-4">
                                    <div
                                        className={`h-1 w-full rounded-full bg-gradient-to-r ${feature.gradient} opacity-50`}
                                    />
                                </CardItem>
                            </CardBody>
                        </CardContainer>
                    ))}
                </div>
            </div>
        </div>
    );
}
