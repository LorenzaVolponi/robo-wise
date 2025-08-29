"""Background worker task with telemetry."""

from __future__ import annotations

import os

import sentry_sdk
from celery import Celery
from opentelemetry import trace

from telemetry import init_telemetry

init_telemetry()
tracer = trace.get_tracer(__name__)

celery_app = Celery(
    __name__, broker=os.environ.get("REDIS_URL", "redis://localhost:6379/0")
)


@celery_app.task
def process_job(job_id: str) -> None:
    """Example background job with breadcrumbs and tracing."""

    sentry_sdk.add_breadcrumb(message=f"processing {job_id}", category="queue")
    with sentry_sdk.start_transaction(op="task", name="process_job"):
        with tracer.start_as_current_span("work"):
            # Simulated work here
            pass


__all__ = ["celery_app", "process_job"]

