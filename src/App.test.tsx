import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App routing", () => {
  beforeEach(() => localStorage.clear());
  const renderRoute = (path: string) => {
    window.history.pushState({}, "Test page", path);
    render(<App />);
  };

  it("renders the documentation page", async () => {
    renderRoute("/docs");
    expect(
      await screen.findByRole("heading", { level: 1, name: /Documentação/i })
    ).toBeInTheDocument();
  });

  it("renders the compare page", async () => {
    renderRoute("/compare");
    expect(
      await screen.findByRole("heading", {
        level: 1,
        name: /Comparação de Estratégias/i,
      })
    ).toBeInTheDocument();
  });

  it("renders the risk page", async () => {
    renderRoute("/risk");
    expect(
      await screen.findByRole("heading", { name: /Controles de Risco/i })
    ).toBeInTheDocument();
  });

  it("renders a 404 for unknown routes", async () => {
    renderRoute("/unknown");
    expect(
      await screen.findByText(/Page not found/i)
    ).toBeInTheDocument();
  });

  it("starts onboarding when clicking the questionnaire button", async () => {
    renderRoute("/");
    await screen.findByRole("button", { name: /Iniciar Questionário/i });
    fireEvent.click(screen.getByRole("button", { name: /Iniciar Questionário/i }));
    expect(
      await screen.findByRole("heading", {
        name: /Análise de Perfil de Investidor/i,
      })
    ).toBeInTheDocument();
  });
});

