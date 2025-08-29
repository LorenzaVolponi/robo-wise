"""Telemetry setup for server components."""

from __future__ import annotations

import os

import sentry_sdk
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.celery import CeleryInstrumentor
from opentelemetry.instrumentation.psycopg2 import Psycopg2Instrumentor
from opentelemetry.instrumentation.requests import RequestsInstrumentor
from opentelemetry.sdk.resources import Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from sentry_sdk.integrations.opentelemetry import SentrySpanProcessor


def init_telemetry() -> None:
    """Initialize Sentry and OpenTelemetry instrumentation."""

    sentry_sdk.init(
        dsn=os.environ.get("SENTRY_DSN"),
        traces_sample_rate=1.0,
    )

    resource = Resource.create({"service.name": os.environ.get("SERVICE_NAME", "robo-wise")})
    provider = TracerProvider(resource=resource)
    trace.set_tracer_provider(provider)

    provider.add_span_processor(SentrySpanProcessor())

    otlp_endpoint = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT")
    if otlp_endpoint:
        otlp_exporter = OTLPSpanExporter(endpoint=otlp_endpoint)
        provider.add_span_processor(BatchSpanProcessor(otlp_exporter))

    RequestsInstrumentor().instrument()
    Psycopg2Instrumentor().instrument()
    CeleryInstrumentor().instrument()


__all__ = ["init_telemetry"]

