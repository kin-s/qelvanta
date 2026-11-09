"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOnboardingData, updateOnboarding, resetOnboarding } from "@/modules/onboarding/store";
import { Progress } from "@/modules/onboarding/progress";
import { StepWelcome } from "@/modules/onboarding/step-welcome";
import { StepBusiness } from "@/modules/onboarding/step-business";
import { StepRegional } from "@/modules/onboarding/step-regional";
import { StepStructure } from "@/modules/onboarding/step-structure";
import { StepModules } from "@/modules/onboarding/step-modules";
import { StepTeam } from "@/modules/onboarding/step-team";
import { StepComplete } from "@/modules/onboarding/step-complete";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { stepMeta } from "@/config/onboarding";

const TOTAL_STEPS = stepMeta.length;

export default function OnboardingPage() {
  const data = useOnboardingData();
  const step = Math.min(Math.max(data.currentStep, 0), TOTAL_STEPS - 1);
  
  // Track direction for animations
  const [direction, setDirection] = useState(1);

  const goNext = () => {
    setDirection(1);
    updateOnboarding({ currentStep: Math.min(step + 1, TOTAL_STEPS - 1) });
  };
  
  const goBack = () => {
    setDirection(-1);
    updateOnboarding({ currentStep: Math.max(step - 1, 0) });
  };
  
  const skip = goNext;
  const finish = () => updateOnboarding({ completed: true });

  function startOver() {
    resetOnboarding();
    setDirection(1);
  }

  const showProgress = step > 0 && step < TOTAL_STEPS - 1;

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Logo size="sm" />
          <div className="flex items-center gap-3">
            {step > 0 && step < TOTAL_STEPS - 1 && (
              <span className="hidden text-xs text-muted sm:inline">
                {stepMeta[step].label}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={startOver}>
              Start over
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10 sm:py-16">
        {showProgress && (
          <div className="mb-10">
            <Progress current={step} total={TOTAL_STEPS - 1} />
          </div>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {step === 0 && <StepWelcome onNext={goNext} onBack={goBack} />}
            {step === 1 && <StepBusiness onNext={goNext} onBack={goBack} />}
            {step === 2 && <StepRegional onNext={goNext} onBack={goBack} />}
            {step === 3 && <StepStructure onNext={goNext} onBack={goBack} />}
            {step === 4 && <StepModules onNext={goNext} onBack={goBack} onSkip={skip} />}
            {step === 5 && <StepTeam onNext={goNext} onBack={goBack} onSkip={skip} />}
            {step === 6 && <StepComplete onFinish={finish} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}