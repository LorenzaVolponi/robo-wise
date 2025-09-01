import { StrategyComparison } from "@/components/comparison/strategy-comparison";
import { Navigation } from "@/components/ui/navigation";

const Compare = () => {
  return (
    <>
      <Navigation currentStep={4} onStepChange={() => {}} />
      <StrategyComparison />
    </>
  );
};

export default Compare;
