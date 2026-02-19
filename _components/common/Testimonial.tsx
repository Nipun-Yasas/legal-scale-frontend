"use client";

import React, { useState } from "react";
import { TestimonialCard } from "../landing/TestimonialCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

export function Testimonial() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="pb-8 pt-8 sm:pt-12 md:pt-12 lg:pt-20 px-4 sm:px-6 md:px-12 lg:px-12 w-full max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-400 mb-6">
            What our users say
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-0 max-w-lg">
            Hear from legal officers and managers who have transformed their
            operations with LegalScale.
          </p>
        </div>

        <div className="flex flex-col items-center lg:items-start">
          <TestimonialCard
            key={currentIndex}
            {...testimonials[currentIndex]}
            onComplete={handleNext}
            duration={30}
          />

          <div className="flex gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full hover:bg-backgroundSecondary transition-colors"
              aria-label="Previous testimonial"
            >
              <ArrowLeft className="w-5 h-5 text-textPrimary" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full hover:bg-backgroundSecondary transition-colors"
              aria-label="Next testimonial"
            >
              <ArrowRight className="w-5 h-5 text-textPrimary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const testimonials = [
  {
    name: "Amara Perera",
    role: "Senior Legal Officer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    testimonial:
      "LegalScale transformed how we handle cases. The structured workflows and real-time tracking have cut our case resolution time significantly. Everything is in one place.",
  },
  {
    name: "Rohan Silva",
    role: "Agreement Manager",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    testimonial:
      "Managing agreement approvals used to be a bottleneck. With LegalScale, the review and digital signing workflows are seamless and the audit trail gives us full confidence.",
  },
  {
    name: "Dilini Fernando",
    role: "Head of Compliance",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
    testimonial:
      "The role-based access and secure document storage give our team the confidence that sensitive legal information is always protected. Highly recommend LegalScale.",
  },
];
