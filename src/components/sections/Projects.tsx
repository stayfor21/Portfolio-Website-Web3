"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowUpRight, Code2, Layers, Lock } from "lucide-react";

const PROJECTS = [
  {
    title: "Billions Reputation",
    desc: "On-chain reputation system for Billions Network analyzing NFT ecosystem ownership.",
    stack: ["JavaScript", "React", "Web3.js"],
    link: "https://billions-reputation.netlify.app/",
    featured: true,
    locked: false,
  },
  {
    title: "Coming Soon",
    desc: "",
    stack: [],
    link: "#",
    featured: false,
    locked: true,
  },
  {
    title: "Coming Soon",
    desc: "",
    stack: [],
    link: "#",
    featured: false,
    locked: true,
  },
];

const BillionsLogo = () => (
  <div
    className="w-6 h-6 bg-primary"
    style={{
      maskImage: "url('/billions.png')",
      WebkitMaskImage: "url('/billions.png')",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

const ProjectCard = ({ project }: { project: typeof PROJECTS[0] }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const updateIsDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px) and (hover: hover)").matches);
    };
    updateIsDesktop();
    window.addEventListener("resize", updateIsDesktop);
    return () => window.removeEventListener("resize", updateIsDesktop);
  }, []);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (project.locked) {
    return (
      <motion.div 
        whileHover={isDesktop ? { scale: 1.02 } : undefined}
        className="relative p-8 rounded-2xl border border-white/5 bg-white/5 h-full flex flex-col justify-center items-center text-center overflow-hidden group"
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="relative z-10 flex flex-col items-center gap-4 opacity-50 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-4 rounded-full bg-white/5 border border-white/10">
            <Lock className="w-8 h-8 text-white-dim" />
          </div>
          <span className="text-xl font-bold text-white-dim tracking-widest">SOON</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.a
      ref={ref}
      href={project.link}
      whileHover={isDesktop ? { scale: 1.02 } : undefined}
      target={project.link.startsWith("http") ? "_blank" : undefined}
      rel={project.link.startsWith("http") ? "noopener noreferrer" : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative p-8 rounded-2xl border transition-colors duration-500 group interactive h-full flex flex-col justify-between ${
        project.featured 
          ? "bg-gradient-to-br from-white/10 to-white/5 border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]" 
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div style={{ transform: "translateZ(30px)" }}>
        <div className="flex justify-between items-start mb-6">
          <div className="p-2 bg-white/10 rounded-lg">
            {project.title === "Billions Reputation" ? (
              <BillionsLogo />
            ) : project.featured ? (
              <Layers className="w-6 h-6 text-primary" />
            ) : (
              <Code2 className="w-6 h-6 text-white-dim" />
            )}
          </div>
          <ArrowUpRight className="w-5 h-5 text-white-dim group-hover:text-primary transition-colors" />
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-white-dim mb-6 text-sm leading-relaxed">
          {project.desc}
        </p>
      </div>

      <div style={{ transform: "translateZ(20px)" }} className="flex flex-wrap gap-2 mt-auto">
        {project.stack.map((tech) => (
          <span key={tech} className="text-xs font-mono px-2 py-1 rounded bg-black/30 text-primary/80 border border-primary/10">
            {tech}
          </span>
        ))}
      </div>
    </motion.a>
  );
};

export default function Projects() {
  return (
    <section id="projects" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-lg font-mono text-primary mb-12 tracking-widest uppercase"
        >
          03. Selected Works
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          style={{ perspective: "1000px" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="h-full"
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}