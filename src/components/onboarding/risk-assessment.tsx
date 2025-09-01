import { useState } from "react";
import { useRiskAssessmentSession } from "@/hooks/use-risk-assessment-session";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Target, Clock, TrendingUp } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: Array<{
    value: string;
    label: string;
    score: number;
  }>;
}

const questions: Question[] = [
  {
    id: "investment_goal",
    question: "Qual é o seu principal objetivo de investimento?",
    options: [
      { value: "preservation", label: "Preservar capital", score: 1 },
      { value: "moderate_growth", label: "Crescimento moderado", score: 2 },
      { value: "aggressive_growth", label: "Crescimento agressivo", score: 3 }
    ]
  },
  {
    id: "time_horizon",
    question: "Qual é o seu horizonte de investimento?",
    options: [
      { value: "short", label: "Menos de 2 anos", score: 1 },
      { value: "medium", label: "2 a 5 anos", score: 2 },
      { value: "long", label: "Mais de 5 anos", score: 3 }
    ]
  },
  {
    id: "risk_tolerance",
    question: "Como você reagiria a uma queda de 20% em seus investimentos?",
    options: [
      { value: "sell_all", label: "Venderia tudo imediatamente", score: 1 },
      { value: "hold", label: "Manteria a posição", score: 2 },
      { value: "buy_more", label: "Compraria mais", score: 3 }
    ]
  },
  {
    id: "experience",
    question: "Qual é a sua experiência com investimentos?",
    options: [
      { value: "beginner", label: "Iniciante", score: 1 },
      { value: "intermediate", label: "Intermediário", score: 2 },
      { value: "experienced", label: "Experiente", score: 3 }
    ]
  }
];

interface RiskAssessmentProps {
  onComplete: (profile: 'conservative' | 'moderate' | 'aggressive') => void;
}

export function RiskAssessment({ onComplete }: RiskAssessmentProps) {
  const {
    currentQuestion,
    answers,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    resetSession,
    completeSession,
  } = useRiskAssessmentSession(questions.length);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswerChange = (value: string) => {
    answerQuestion(questions[currentQuestion].id, value);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    } else {
      calculateRiskProfile();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      previousQuestion();
    }
  };

  const calculateRiskProfile = () => {
    const totalScore = questions.reduce((sum, question) => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      return sum + (option?.score || 0);
    }, 0);

    let profile: 'conservative' | 'moderate' | 'aggressive';
    if (totalScore <= 6) {
      profile = 'conservative';
    } else if (totalScore <= 9) {
      profile = 'moderate';
    } else {
      profile = 'aggressive';
    }

    setIsComplete(true);
    toast({
      title: "Perfil calculado!",
      description: "Analisando suas respostas e definindo sua carteira ideal...",
    });
    setTimeout(() => {
      onComplete(profile);
      completeSession();
    }, 1500);
  };

  const currentAnswer = answers[questions[currentQuestion].id];
  const canProceed = !!currentAnswer;

  const getIcon = (questionId: string) => {
    switch (questionId) {
      case 'investment_goal': return <Target className="w-5 h-5" />;
      case 'time_horizon': return <Clock className="w-5 h-5" />;
      case 'risk_tolerance': return <TrendingUp className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  if (isComplete) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md text-center bg-gradient-card border-primary/20 shadow-glow">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Perfil Calculado!</h3>
            <p className="text-muted-foreground">
              Analisando suas respostas e definindo sua carteira ideal...
            </p>
            <div className="mt-4">
              <Progress value={100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2" role="status" aria-live="polite">
          <span className="text-sm font-medium">
            Pergunta {currentQuestion + 1} de {questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% completo
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="bg-gradient-card border-primary/10 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              {getIcon(questions[currentQuestion].id)}
            </div>
            <div>
              <CardTitle className="text-xl">
                {questions[currentQuestion].question}
              </CardTitle>
              <CardDescription>
                Selecione a opção que melhor descreve sua situação
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <RadioGroup
            value={currentAnswer}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {questions[currentQuestion].options.map((option) => (
              <div
                key={option.value}
                className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-smooth cursor-pointer"
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label
                  htmlFor={option.value}
                  className="flex-1 cursor-pointer font-medium"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            {currentQuestion === questions.length - 1 ? 'Finalizar' : 'Próxima'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}