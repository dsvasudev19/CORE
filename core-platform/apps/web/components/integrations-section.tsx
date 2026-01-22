"use client";
import React from "react";
import { motion } from "framer-motion";

const integrations = [
  { name: "Slack", logo: "https://cdn.simpleicons.org/slack/white" },
  { name: "Google Workspace", logo: "https://cdn.simpleicons.org/google/white" },
  { name: "Microsoft Teams", logo: "https://cdn.simpleicons.org/microsoftteams/white" },
  { name: "Jira", logo: "https://cdn.simpleicons.org/jira/white" },
  { name: "GitHub", logo: "https://cdn.simpleicons.org/github/white" },
  { name: "Zoom", logo: "https://cdn.simpleicons.org/zoom/white" },
  { name: "Salesforce", logo: "https://cdn.simpleicons.org/salesforce/white" },
  { name: "Dropbox", logo: "https://cdn.simpleicons.org/dropbox/white" },
  { name: "Trello", logo: "https://cdn.simpleicons.org/trello/white" },
  { name: "Asana", logo: "https://cdn.simpleicons.org/asana/white" },
  { name: "Notion", logo: "https://cdn.simpleicons.org/notion/white" },
  { name: "Figma", logo: "https://cdn.simpleicons.org/figma/white" },
];

export function IntegrationsSection() {
  return (
    <div className="w-full bg-black py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Integrates with Your Favorite Tools
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Seamlessly connect with the tools you already use. Over 100+
            integrations available.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="group"
            >
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-3 h-32 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <img
                  src={integration.logo}
                  alt={integration.name}
                  className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                />
                <span className="text-slate-400 text-sm group-hover:text-white transition-colors">
                  {integration.name}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button className="px-8 py-4 rounded-full bg-slate-900 border border-slate-700 text-white hover:bg-slate-800 transition-all duration-300 hover:border-purple-500">
            View All Integrations →
          </button>
        </div>
      </div>
    </div>
  );
}
