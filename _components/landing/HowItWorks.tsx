export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "Initiate Case or Agreement",
      description:
        "Create a new legal case or agreement draft, upload relevant documents, and assign a responsible legal officer.",
    },
    {
      number: "2",
      title: "Review & Approve",
      description:
        "Route the case or agreement through the structured approval workflow, collect reviewer comments, and obtain digital signatures.",
    },
    {
      number: "3",
      title: "Track & Close",
      description:
        "Monitor real-time status, schedule court dates, receive expiry alerts, and close out with a complete audit trail.",
    },
  ];

  return (
    <div className="pt-4 lg:pt-12 px-4 sm:px-6 md:px-12 lg:px-12 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-textPrimary mb-4">
          How It Works
        </h2>
        <p className="text-xl text-textSecondary">
          Managing legal cases and agreements is just three simple steps away
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="relative"
            style={{ zIndex: steps.length - idx }}
          >
            <div className="bg-backgroundSecondary p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-borderPrimary">
              <div className="w-16 h-16 bg-hoverPrimary rounded-full flex items-center justify-center text-textPrimary text-2xl font-bold mb-6 ">
                {step.number}
              </div>
              <h3 className="text-2xl font-bold text-textPrimary mb-3">
                {step.title}
              </h3>
              <p className="text-textSecondary">{step.description}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute top-[62px] left-24 -right-8 h-1 bg-primary" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
