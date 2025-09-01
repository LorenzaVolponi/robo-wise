import { StrategyComparison } from "@/components/comparison/strategy-comparison";
import { Navigation } from "@/components/ui/navigation";
import { useNavigate } from "react-router-dom";

const Compare = () => {
  const navigate = useNavigate();

  const handleStepChange = (step: number) => {
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
