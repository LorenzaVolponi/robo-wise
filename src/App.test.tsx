import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App routing", () => {
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

  it("renders a 404 for unknown routes", async () => {
    renderRoute("/unknown");
    expect(
      await screen.findByText(/Page not found/i)
    ).toBeInTheDocument();
  });
});

