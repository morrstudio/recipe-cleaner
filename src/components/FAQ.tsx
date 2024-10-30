import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
  return (
    <section>
      <h2 className="text-2xl font-semibold text-[#1A2530] mb-6 text-center">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible>
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}