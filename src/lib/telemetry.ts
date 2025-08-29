import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ConsoleSpanExporter, SimpleSpanProcessor } from "@opentelemetry/sdk-trace-base";

/**
 * Initialize Sentry error tracking and basic OpenTelemetry tracing.
 * Uses environment variables for configuration so providers can be
 * switched without redeploying the application.
 */
export function initTelemetry() {
  if (import.meta.env.DEV) {
    return;
  }

  // Sentry configuration
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN || "",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });

  // OpenTelemetry configuration with console exporter for demo purposes
  const provider = new WebTracerProvider();
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.register();
}
