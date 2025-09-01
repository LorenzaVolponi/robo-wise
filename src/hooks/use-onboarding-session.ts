import { useEffect, useState } from "react";

export type RiskProfile = 'conservative' | 'moderate' | 'aggressive';

interface OnboardingState {
  currentStep: number;
  riskProfile: RiskProfile | null;
  hasCompletedOnboarding: boolean;
}

const STORAGE_KEY = "onboarding-state";

export function useOnboardingSession(initialStep = 0) {
  const [state, setState] = useState<OnboardingState>({
    currentStep: initialStep,
    riskProfile: null,
    hasCompletedOnboarding: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: OnboardingState = JSON.parse(stored);
        setState(parsed);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setCurrentStep = (step: number) =>
    setState((s) => ({ ...s, currentStep: step }));

  const setRiskProfile = (profile: RiskProfile | null) =>
    setState((s) => ({ ...s, riskProfile: profile }));

  const setHasCompletedOnboarding = (value: boolean) =>
    setState((s) => ({ ...s, hasCompletedOnboarding: value }));

  const resetOnboarding = () => {
    setState({ currentStep: initialStep, riskProfile: null, hasCompletedOnboarding: false });
    localStorage.removeItem(STORAGE_KEY);
    // Also clear any ongoing risk assessment session
    localStorage.removeItem("risk-assessment-state");
    localStorage.removeItem("risk-assessment-log");
  };

  return {
    ...state,
    setCurrentStep,
    setRiskProfile,
    setHasCompletedOnboarding,
    resetOnboarding,
  };
}
