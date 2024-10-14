import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    question: "How does RecipeCleaner work?",
    answer: "RecipeCleaner uses AI to simplify and optimize recipes. Just paste a recipe URL, and our AI will clean it up, making it easier to read and follow."
  },
  {
    question: "Is RecipeCleaner free to use?",
    answer: "Yes, RecipeCleaner is free to use for basic features. We also offer premium features for subscribed users."
  },
  {
    question: "Can I save my cleaned recipes?",
    answer: "Yes, you can save cleaned recipes to your profile once you're logged in."
  },
  {
    question: "How accurate is the AI in modifying recipes?",
    answer: "Our AI is highly accurate, but we always recommend reviewing the cleaned recipe to ensure it meets your needs and preferences."
  }
]

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold text-[#1A2530] mb-6 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <button
              className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 focus:outline-none"
              onClick={() => toggleItem(index)}
            >
              {item.question}
              {openItem === index ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {openItem === index && (
              <p className="mt-2 text-gray-600">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}