"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X as XIcon } from "lucide-react";

const navItems = ["About", "Skills", "Projects", "Contact"];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  // Игнорируем ошибку расширения MetaMask, которая возникает при разработке
  useEffect(() => {
    const handleGlobalError = (event: any) => {
      // Получаем сообщение об ошибке из разных источников (error, reason или message)
      const error = event.error || event.reason;
      const message = typeof error === 'string' ? error : (error?.message || event.message || "");
      
      // Проверяем, связана ли ошибка с MetaMask (по тексту или ID расширения)
      if (typeof message === "string" && (
        message.includes("Failed to connect to MetaMask") || 
        message.includes("nkbihfbeogaeaoehlefnkodbefgpgknn") ||
        message.includes("Could not establish connection. Receiving end does not exist")
      )) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    // Используем capture: true, чтобы перехватить событие ДО того, как это сделает Next.js
    window.addEventListener("error", handleGlobalError, true);
    window.addEventListener("unhandledrejection", handleGlobalError, true);

    return () => {
      window.removeEventListener("error", handleGlobalError, true);
      window.removeEventListener("unhandledrejection", handleGlobalError, true);
    };
  }, []);

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);

    // Небольшая задержка, чтобы меню успело закрыться и разблокировать скролл
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80; // Высота хедера
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-background/60"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo Placeholder */}
        <div className="font-mono text-xl font-bold tracking-tighter text-white interactive cursor-pointer">
          <span className="text-primary">0x</span>STAYFOR
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative text-sm font-medium text-white-dim hover:text-white transition-colors group interactive"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white p-2 interactive"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <XIcon /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-b border-white/10 overflow-hidden absolute top-20 left-0 w-full shadow-2xl"
          >
            <nav className="flex flex-col p-8 gap-8 items-center justify-start">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-2xl font-medium text-white-dim hover:text-white transition-colors interactive p-4"
                  onClick={(e) => handleMobileNavClick(e, item.toLowerCase())}
                >
                  {item}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}