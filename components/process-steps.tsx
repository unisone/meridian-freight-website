"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { MessageSquare, Truck, Package, Globe } from "lucide-react";
import { DURATION, EASE } from "@/lib/motion";

const steps = [
  {
    number: 1,
    title: "Tell Us What You Need",
    description: "Send us the equipment details and destination. You get a detailed, itemized quote within 24 hours.",
    icon: MessageSquare,
  },
  {
    number: 2,
    title: "We Pick It Up",
    description: "Our team collects the equipment from anywhere in the USA or Canada and brings it to our facility.",
    icon: Truck,
  },
  {
    number: 3,
    title: "Dismantle, Pack & Load",
    description: "We take it apart, tag every component, pack it into the container, and prepare all export paperwork.",
    icon: Package,
  },
  {
    number: 4,
    title: "It Ships to Your Port",
    description: "We book your container on the next available vessel — you get real-time tracking, customs docs, and arrival confirmation.",
    icon: Globe,
  },
];

export function ProcessSteps() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Scroll-linked line progress (desktop only — line is hidden on mobile via CSS)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : undefined}
          transition={{ duration: DURATION.entrance, ease: EASE.decelerate }}
          className="mb-12 sm:mb-16"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">
            How It Works
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
            Four Steps. One Point of Contact.
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Most exports involve a trucker, a dismantler, a packer, a broker, and a shipping line.
            With us, you talk to one person from start to finish.
          </p>
        </motion.div>

        {/* Steps — horizontal on desktop, vertical on mobile */}
        <div ref={sectionRef} className="relative">
          {/* Desktop connecting line — scroll-linked */}
          <motion.div
            style={{ scaleX: lineScale, transformOrigin: "left" }}
            className="absolute left-0 right-0 top-16 hidden h-0.5 bg-primary/20 lg:block"
          />

          <div className="grid gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: DURATION.entrance,
                  delay: 0.2 + idx * 0.25,
                  ease: EASE.decelerate,
                }}
                className="relative flex lg:flex-col lg:items-center lg:text-center"
              >
                {/* Mobile: vertical line between steps */}
                {step.number < 4 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={isInView ? { scaleY: 1 } : undefined}
                    transition={{
                      duration: DURATION.slow,
                      delay: 0.4 + idx * 0.25,
                      ease: EASE.decelerate,
                    }}
                    style={{ transformOrigin: "top" }}
                    className="absolute left-6 top-16 h-full w-0.5 bg-primary/20 lg:hidden"
                  />
                )}

                {/* Number circle — scales in */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : undefined}
                  transition={{
                    duration: DURATION.normal,
                    delay: 0.15 + idx * 0.25,
                    ease: EASE.decelerate,
                  }}
                  className="relative z-10 mr-6 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-lg font-bold text-white shadow-lg lg:mr-0 lg:mb-6"
                >
                  {step.number}
                </motion.div>

                {/* Content */}
                <div className="pb-8 lg:pb-0">
                  <div className="mb-2 flex items-center gap-2 lg:justify-center">
                    <step.icon className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-bold text-foreground">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground lg:mx-auto lg:max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
