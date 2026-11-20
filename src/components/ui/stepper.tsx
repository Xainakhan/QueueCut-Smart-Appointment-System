type StepperProps = { steps: string[]; currentStep: number };

export function Stepper({ steps, currentStep }: StepperProps) {
  return <ol className="stepper" aria-label="Booking progress">
    {steps.map((step, index) => { const state = index === currentStep ? "current" : index < currentStep ? "complete" : "upcoming"; return <li className={`stepper__item ${state}`} key={step} aria-current={state === "current" ? "step" : undefined}>
      <span className="stepper__number">{state === "complete" ? "✓" : index + 1}</span><span>{step}</span>
    </li>; })}
  </ol>;
}
