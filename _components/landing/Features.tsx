import { cn } from "@/lib/utils";
import {
  Scale,
  FileText,
  BarChart2,
  ShieldCheck,
  Gavel,
  ClipboardList,
  Clock,
  UserCog,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Smart Legal Case Handling",
      description:
        "Manage legal cases from initiation to closure with structured workflows and full visibility.",
      icon: <Scale />,
    },
    {
      title: "Agreement Approval",
      description:
        "Streamline agreement drafting, review, and approval within one secure system.",
      icon: <FileText />,
    },
    {
      title: "Real-Time Dashboards",
      description:
        "Gain instant visibility into legal operations with active case status and workload tracking.",
      icon: <BarChart2 />,
    },
    {
      title: "Secure Role-Based Access",
      description:
        "User & role management with controlled access to cases and complete audit history.",
      icon: <ShieldCheck />,
    },
    {
      title: "Court Date Scheduling",
      description:
        "Schedule court dates and hearings with automated reminders and calendar integration.",
      icon: <Gavel />,
    },
    {
      title: "Document Management",
      description:
        "Upload, organise, and retrieve case documents securely with version control.",
      icon: <ClipboardList />,
    },
    {
      title: "Expiry & Renewal Alerts",
      description:
        "Receive timely notifications for agreement expirations and scheduled renewals.",
      icon: <Clock />,
    },
    {
      title: "Legal Officer Assignment",
      description:
        "Assign and manage legal officers per case with workload tracking and accountability.",
      icon: <UserCog />,
    },
  ];

  return (
    <div className="pt-4 px-4 sm:px-6 md:px-12 lg:px-12 w-full max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-textPrimary dark:text-white mb-4">
          Why Choose LegalScale?
        </h2>
        <p className="text-xl text-textSecondary max-w-2xl mx-auto">
          Everything you need to manage legal cases and agreements in one
          unified platform
        </p>
      </div>

      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 relative z-10">
        {features.map((feature, index) => (
          <Feature key={feature.title} {...feature} index={index} />
        ))}
      </div>
    </div>
  );
};

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature border-borderPrimary",
        (index === 0 || index === 4) && "lg:border-l border-borderPrimary",
        index < 4 && "lg:border-b border-borderPrimary"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-hoverPrimary pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-hoverPrimary pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-textPrimary">{icon}</div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-slate-300 dark:bg-slate-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-textPrimary">
          {title}
        </span>
      </div>
      <p className="text-sm text-textSecondary max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
