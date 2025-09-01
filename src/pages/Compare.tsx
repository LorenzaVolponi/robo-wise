import { useCallback, useEffect } from "react";
import { StrategyComparison } from "@/components/comparison/strategy-comparison";
import { Navigation } from "@/components/ui/navigation";
import { useNavigate } from "react-router-dom";
import { useOnboardingSession } from "@/hooks/use-onboarding-session";

const Compare = () => {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useOnboardingSession();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleStepChange = useCallback(
    (step: number) => {
      setCurrentStep(step);
      if (step === 5) {
        navigate("/risk");
      } else if (step < 4) {
        navigate("/");
      }
    },
    [navigate, setCurrentStep]
  );

  return (
    <>
      <Navigation currentStep={currentStep} onStepChange={handleStepChange} />
      <StrategyComparison />
    </>
  );
};

export default Compare;
