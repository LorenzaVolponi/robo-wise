import { StrategyComparison } from "@/components/comparison/strategy-comparison";
import { Navigation } from "@/components/ui/navigation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOnboardingSession } from "@/hooks/use-onboarding-session";

const Compare = () => {
  const navigate = useNavigate();
  const { setCurrentStep } = useOnboardingSession();

  useEffect(() => {
    setCurrentStep(4);
  }, [setCurrentStep]);

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    if (step === 5) {
      navigate("/risk");
    } else if (step < 4) {
      navigate("/");
    }
  };

  return (
    <>
      <Navigation currentStep={4} onStepChange={handleStepChange} />
      <StrategyComparison />
    </>
  );
};

export default Compare;
