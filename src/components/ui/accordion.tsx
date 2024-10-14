import * as React from "react"

interface AccordionProps {
  children: React.ReactNode
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="accordion">{children}</div>
}

interface AccordionItemProps {
  children: React.ReactNode
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ children }) => {
  return <div className="accordion-item">{children}</div>
}

interface AccordionTriggerProps {
  children: React.ReactNode
  onClick?: () => void
}

export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ children, onClick }) => {
  return (
    <button className="accordion-trigger" onClick={onClick}>
      {children}
    </button>
  )
}

interface AccordionContentProps {
  children: React.ReactNode
}

export const AccordionContent: React.FC<AccordionContentProps> = ({ children }) => {
  return <div className="accordion-content">{children}</div>
}

