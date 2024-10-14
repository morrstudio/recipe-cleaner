export const Button = jest.fn(({ children, ...props }) => <button {...props}>{children}</button>);
export const Input = jest.fn(props => <input {...props} />);
export const Card = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
export const CardContent = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
export const Accordion = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
export const AccordionContent = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
export const AccordionItem = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
export const AccordionTrigger = jest.fn(({ children, ...props }) => <div {...props}>{children}</div>);
// Add any other UI components you're using