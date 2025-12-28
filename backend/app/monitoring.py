from prometheus_client import Counter, Histogram, Gauge
from prometheus_fastapi_instrumentator import Instrumentator
import psutil

# Request counters
REQUESTS_TOTAL = Counter(
    "http_requests_total",
    "Total number of HTTP requests",
    ["method", "endpoint", "status_code"]
)

# Latency histogram
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency in seconds",
    ["method", "endpoint"]
)

# Resource utilization gauges
CPU_USAGE = Gauge("cpu_usage_percent", "Current CPU usage percentage")
MEMORY_USAGE = Gauge("memory_usage_percent", "Current memory usage percentage")
NETWORK_IO = Gauge("network_io_bytes", "Network I/O in bytes", ["direction"])
DISK_IO = Gauge("disk_io_bytes", "Disk I/O in bytes", ["operation"])

def init_metrics(app):
    # Initialize Prometheus metrics instrumentation
    Instrumentator().instrument(app).expose(app)

    # Resource utilization metrics collection
    @app.on_event("startup")
    async def startup_event():
        # CPU and Memory monitoring
        def collect_resource_metrics():
            CPU_USAGE.set(psutil.cpu_percent())
            MEMORY_USAGE.set(psutil.virtual_memory().percent)
            
            # Network I/O
            net_io = psutil.net_io_counters()
            NETWORK_IO.labels(direction="sent").set(net_io.bytes_sent)
            NETWORK_IO.labels(direction="received").set(net_io.bytes_recv)
            
            # Disk I/O
            disk_io = psutil.disk_io_counters()
            DISK_IO.labels(operation="read").set(disk_io.read_bytes)
            DISK_IO.labels(operation="write").set(disk_io.write_bytes)

        # Start background metrics collection
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        scheduler = AsyncIOScheduler()
        scheduler.add_job(collect_resource_metrics, 'interval', seconds=15)
        scheduler.start()