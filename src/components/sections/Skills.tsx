"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Category = "Programming" | "Marketing" | "Web3";

const SKILLS: Record<Category, string[]> = {
  Programming: ["JavaScript", "React", "Python", "C++", "SQL", "TypeScript", "Next.js"],
  Marketing: ["Community Growth", "Content Strategy", "Web3 Education", "Brand Identity", "Analytics"],
  Web3: ["Ambassadorship", "Community Moderation", "DAO Governance", "Community Management", "Solidity", "Smart Contracts", "DeFi Protocols"],
};

export default function Skills() {
  const [activeTab, setActiveTab] = useState<Category>("Programming");

  return (
    <section id="skills" className="py-32 bg-surface/30 border-y border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg font-mono text-primary mb-12 tracking-widest uppercase"
        >
          02. Expertise
        </motion.h2>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
          }}
          className="flex flex-col md:flex-row gap-12"
        >
          {/* Tabs */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            }}
            className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 md:w-1/4 no-scrollbar"
          >
            {(Object.keys(SKILLS) as Category[]).map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className={cn(
                  "text-left px-4 py-3 rounded-lg transition-all duration-300 interactive whitespace-nowrap",
                  activeTab === category 
                    ? "bg-white/10 text-white border-l-2 border-primary" 
                    : "text-white-dim hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
            }}
            className="flex-1 min-h-[300px]"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {SKILLS[activeTab].map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl glass-panel hover:border-primary/30 hover:bg-white/10 transition-all duration-300 group interactive cursor-default"
                  >
                    <span className="text-white-dim group-hover:text-white font-mono text-sm">{skill}</span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}