"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function FaqAccordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const id = useId();
  const reduced = useReducedMotion();

  return <div className="faq-accordion">
    {items.map((item, index) => {
      const expanded = open === index;
      const triggerId = `${id}-question-${index}`;
      const panelId = `${id}-answer-${index}`;
      return <article className="faq-accordion-item" data-open={expanded} key={item.question}>
        <h3>
          <button id={triggerId} type="button" aria-expanded={expanded} aria-controls={panelId}
            onClick={() => setOpen(expanded ? null : index)}>
            <span>{item.question}</span>
            <span className="faq-accordion-icon" aria-hidden="true"><Plus size={20} /></span>
          </button>
        </h3>
        <motion.div id={panelId} role="region" aria-labelledby={triggerId} aria-hidden={!expanded} inert={!expanded}
          initial={false} animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : .25 }} className="faq-accordion-panel">
          <p>{item.answer}</p>
        </motion.div>
      </article>;
    })}
  </div>;
}
