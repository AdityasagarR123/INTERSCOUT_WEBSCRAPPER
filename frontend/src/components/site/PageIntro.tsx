import type { ReactNode } from "react";
import { motion } from "motion/react";

export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  accent?: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[1500px] px-5 pt-28 pb-12 md:px-8 md:pt-36">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="label-eyebrow text-muted-foreground"
      >
        {eyebrow}
      </motion.p>

      <div className="mt-6 grid gap-10 md:grid-cols-12">
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl md:col-span-7"
        >
          {title} {accent ? <span className="serif-accent">{accent}</span> : null}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="md:col-span-5 md:pt-2"
        >
          <p className="text-muted-foreground max-w-md text-sm leading-relaxed">{description}</p>
          {aside ? <div className="mt-6">{aside}</div> : null}
        </motion.div>
      </div>
    </section>
  );
}
