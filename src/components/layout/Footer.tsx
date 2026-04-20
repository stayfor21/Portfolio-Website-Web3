"use client";
import { motion } from "framer-motion";
import { Github, Send } from "lucide-react";

const EthosIcon = () => (
  <div
    className="w-5 h-5 bg-current"
    style={{
      maskImage: "url('/ethos.svg')",
      WebkitMaskImage: "url('/ethos.png')",
      maskSize: "contain",
      WebkitMaskSize: "contain",
      maskRepeat: "no-repeat",
      WebkitMaskRepeat: "no-repeat",
      maskPosition: "center",
      WebkitMaskPosition: "center",
    }}
  />
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 1200 1227" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6904H316.343L603.315 514.975L650.783 582.869L1050.21 1150.31H877.879L569.165 687.854V687.828Z" fill="currentColor"/>
  </svg>
);

const socials = [
  { icon: Send, label: "Telegram", href: "https://t.me/stayfor2121" },
  { icon: XIcon, label: "X", href: "https://x.com/21stf21" },
  { icon: Github, label: "GitHub", href: "https://github.com/stayfor21" },
  { icon: EthosIcon, label: "Ethos", href: "https://app.ethos.network/profile/x/21stf21", highlight: true },
];

export default function Footer() {
  return (
    <footer id="contact" className="py-20 bg-black border-t border-white/10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.05),transparent_50%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to <strong className="text-white font-bold">build</strong> together? <span className="text-primary">Let’s get in touch!</span>
          </h2>
        </motion.div>

        <div className="flex justify-center gap-6 mb-12">
          {socials.map((social, i) => (
            <motion.a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 rounded-full glass-panel interactive group relative hover:border-primary/30"
            >
              <div className="social-icon">
                <social.icon />
              </div>
              {/* Tooltip */}
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {social.label}
              </span>
            </motion.a>
          ))}
        </div>

        <p className="text-white-dim/30 text-xs font-mono">
          © {new Date().getFullYear()} Web3 Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}