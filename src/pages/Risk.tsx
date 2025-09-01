import { RiskManagement } from "@/components/risk/risk-management";
import { Navigation } from "@/components/ui/navigation";
import { useNavigate } from "react-router-dom";

const Risk = () => {
  const navigate = useNavigate();

  const handleStepChange = (step: number) => {
    if (step === 4) {
      navigate("/compare");
    } else if (step < 4) {
      navigate("/");
    }
  };

  return (
    <>
      <Navigation currentStep={5} onStepChange={handleStepChange} />
      <RiskManagement />
    </>
  );
};

export default Risk;
