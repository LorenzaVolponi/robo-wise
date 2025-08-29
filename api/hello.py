"""Sample Vercel function with Sentry and OpenTelemetry."""

from __future__ import annotations

import os
from typing import Any, Dict

import requests
import sentry_sdk
from opentelemetry import trace

from telemetry import init_telemetry

init_telemetry()
tracer = trace.get_tracer(__name__)


def handler(request: Any) -> Dict[str, Any]:
    """Vercel handler including breadcrumbs and tracing."""

    sentry_sdk.add_breadcrumb(message="function invoked", category="vercel")
    with sentry_sdk.start_transaction(op="http.server", name="api.hello"):
        with tracer.start_as_current_span("fetch_supabase"):
            supabase_url = os.environ.get(
                "SUPABASE_URL", "https://example.supabase.co/rest/v1/"
            )
            requests.get(supabase_url, timeout=5)

    return {"statusCode": 200, "body": "ok"}


__all__ = ["handler"]

