import { useState } from 'react';

const FAQS = [
  { q: 'How long does delivery take?', a: 'Orders ship within 1–3 business days and typically arrive within 5–10 business days depending on your location.' },
  { q: 'Is payment secure?', a: 'Yes — checkout runs through Razorpay. We never see or store your card details.' },
  { q: "What if it doesn't work for my pet?", a: 'If the item arrives damaged, defective, or not as described, you can request a return within 7 days of delivery. See our Returns policy for details.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-section">
      <h2 className="section-heading">Common questions</h2>
      {FAQS.map((item, i) => (
        <div className="faq-item" key={item.q}>
          <button
            className="faq-question"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            {item.q}
            <span className="faq-toggle">{openIndex === i ? '−' : '+'}</span>
          </button>
          {openIndex === i && <p className="faq-answer">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
