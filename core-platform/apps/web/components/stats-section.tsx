"use client";
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Globe, Zap } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "50K+",
    label: "Active Users",
    description: "Teams using Core Platform daily",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    value: "120+",
    label: "Countries",
    description: "Global presence across continents",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: TrendingUp,
    value: "99.9%",
    label: "Uptime",
    description: "Reliable service you can count on",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    value: "2M+",
    label: "Tasks Completed",
    description: "Projects delivered successfully",
    gradient: "from-orange-500 to-red-500",
  },
];

export function StatsSection() {
  return (
    <div className="w-full bg-black py-20 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Join thousands of companies that have transformed their operations
            with Core Platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 group-hover:shadow-2xl">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>

                <div className="text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>

                <div className="text-xl font-semibold text-slate-300 mb-2">
                  {stat.label}
                </div>

                <div className="text-sm text-slate-500">
                  {stat.description}
                </div>

                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-items-center opacity-50">
          <div className="text-slate-600 text-2xl font-bold">Company A</div>
          <div className="text-slate-600 text-2xl font-bold">Company B</div>
          <div className="text-slate-600 text-2xl font-bold">Company C</div>
          <div className="text-slate-600 text-2xl font-bold">Company D</div>
          <div className="text-slate-600 text-2xl font-bold">Company E</div>
        </div>
      </div>
    </div>
  );
}
