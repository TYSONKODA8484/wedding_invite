interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function ProcessStep({ number, title, description, icon }: ProcessStepProps) {
  return (
    <div className="relative flex flex-col items-center text-center" data-testid={`step-${number}`}>
      <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-6 relative z-10">
        <div className="text-primary">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-playfair font-bold text-lg shadow-lg">
          {number}
        </div>
      </div>
      <h3 className="font-playfair text-xl lg:text-2xl font-bold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm lg:text-base max-w-xs">
        {description}
      </p>
    </div>
  );
}
