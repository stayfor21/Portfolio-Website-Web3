"use client";
import { motion } from "framer-motion";

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <span
    className="cursor-default interactive transition-colors duration-300 text-white font-medium hover:text-primary"
  >
    {children}
  </span>
);

const content = [
  { text: "I’m a ", type: "text" as const },
  { text: "Computer Engineering", type: "highlight", color: "primary" },
  { text: " graduate who builds thriving ", type: "text" as const },
  { text: "Web3 communities", type: "highlight", color: "primary" },
  { text: " and crafts ", type: "text" as const },
  { text: "impactful content", type: "highlight", color: "primary" },
  { text: ". With experience in web design, article writing, and moderation ", type: "text" as const },
  { text: "for major blockchain projects", type: "highlight", color: "primary" },
  { text: ", I design programs that empower users, strengthen communities, ", type: "text" as const },
  { text: "and boost project growth", type: "highlight", color: "primary" },
  { text: ".", type: "text" as const },
] as const;

export default function About() {
  // Предварительный расчет индексов для сквозной анимации
  let charIndexCounter = 0;
  const enrichedContent = content.map((segment) => {
    const startIndex = charIndexCounter;
    charIndexCounter += segment.text.length;
    return { ...segment, startIndex };
  });

  return (
    <section id="about" className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-lg font-mono text-primary mb-8 tracking-widest uppercase">01. About Me</h2>
          <div className="text-2xl md:text-3xl leading-relaxed text-white-dim font-light">
            <motion.p
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline"
            >
              {enrichedContent.map((segment, i) => {
                const letters = segment.text.split("");
                
                // Выбираем обертку: либо Highlight, либо фрагмент
                const SegmentWrapper = segment.type === "highlight" ? Highlight : ({ children }: { children: React.ReactNode }) => <>{children}</>;

                return (
                  <SegmentWrapper key={i}>
                    {letters.map((char, charIndex) => (
                      <motion.span
                        key={charIndex}
                        custom={segment.startIndex + charIndex}
                        variants={{
                          hidden: { opacity: 0 },
                          visible: (i: number) => ({
                            opacity: 1,
                            transition: {
                              delay: i * 0.02 + 0.2, // Задержка для каждой буквы + начальная пауза
                              duration: 0, // Мгновенное появление (эффект печати)
                            },
                          }),
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </SegmentWrapper>
                );
              })}
              {/* Мигающий курсор */}
              <motion.span
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: [0, 1, 1, 0],
                    transition: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                      times: [0, 0.1, 0.5, 0.6],
                      delay: charIndexCounter * 0.02 + 0.2,
                    },
                  },
                }}
                className="inline-block w-2.5 h-6 bg-primary ml-1 align-middle"
              />
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}