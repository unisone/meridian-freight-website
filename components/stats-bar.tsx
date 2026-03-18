"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, ThumbsUp, Users } from "lucide-react";
import { STATS } from "@/lib/constants";

const stats = [
  { value: STATS.projectsCompleted, suffix: "+", label: "Projects Completed", icon: Briefcase },
  { value: STATS.yearsExperience, suffix: "+", label: "Years Experience", icon: Calendar },
  { value: STATS.clientSatisfaction, suffix: "%", label: "Client Satisfaction", icon: ThumbsUp },
  { value: STATS.staffMembers, suffix: "+", label: "Staff Members", icon: Users },
];

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, ref };
}

export function StatsBar() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-600 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Briefcase;
}) {
  const { count, ref } = useCountUp(value);

  return (
    <div ref={ref} className="text-center text-white">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
        <Icon className="h-6 w-6" />
      </div>
      <div className="font-mono text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {count}
        {suffix}
      </div>
      <div className="mt-2 text-sm font-medium text-blue-100 sm:text-base">
        {label}
      </div>
    </div>
  );
}
