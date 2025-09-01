import { RiskManagement } from "@/components/risk/risk-management";
import { Navigation } from "@/components/ui/navigation";

const Risk = () => {
  return (
    <>
      <Navigation currentStep={5} onStepChange={() => {}} />
      <RiskManagement />
    </>
  );
};

export default Risk;
