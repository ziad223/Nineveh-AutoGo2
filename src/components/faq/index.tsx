'use client';

import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface FaqItem {
  question: string;
  answer: string;
  sort_order?: number;
}

interface FaqProps {
  faq_items: FaqItem[];
}

const Faq: React.FC<FaqProps> = ({ faq_items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faq_items || faq_items.length === 0) {
    return (
      <section className="bg-[#f9f9f9] py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm">لا توجد أسئلة شائعة حالياً.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#f9f9f9] py-16">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">الأسئلة الشائعة</h2>
          <p className="text-gray-600 text-xs md:text-sm mt-2 max-w-md mx-auto">
            تعرف على إجابات أكثر الأسئلة شيوعًا حول خدماتنا — لتكون تجربتك أسهل وأوضح.
          </p>
        </div>

        <div className="space-y-4 text-right">
          {faq_items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-all"
            >
              <button
                className="w-full flex justify-between items-center p-4 text-[#121212] font-semibold md:text-sm text-xs focus:outline-none"
                onClick={() => toggle(index)}
              >
                {item.question}
                {openIndex === index ? (
                  <FiChevronUp className="text-[#121212] text-lg" />
                ) : (
                  <FiChevronDown className="text-[#121212] text-lg" />
                )}
              </button>
              <div
                className={`transition-all duration-300 ${
                  openIndex === index ? "max-h-40 p-4 pt-0" : "max-h-0 p-0"
                } overflow-hidden text-gray-600 md:text-sm text-xs leading-relaxed`}
              >
                {item.answer.replace(/<\/?p>/g, '')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
