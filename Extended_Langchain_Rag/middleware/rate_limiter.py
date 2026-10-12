"""
Rate limiting middleware for FastAPI application
"""
import time
from collections import defaultdict
from typing import Callable
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response
import logging

logger = logging.getLogger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Rate limiting middleware to prevent API abuse.
    Uses a simple in-memory token bucket algorithm.
    """
    
    def __init__(self, app, requests_per_minute: int = 60, requests_per_hour: int = 1000):
        """
        Initialize rate limiter
        
        Args:
            app: FastAPI application instance
            requests_per_minute: Maximum requests per minute per IP (default: 60)
            requests_per_hour: Maximum requests per hour per IP (default: 1000)
        """
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.requests_per_hour = requests_per_hour
        
        # Store request timestamps per IP address
        # Structure: {ip: [list of timestamps]}
        self.request_history: dict[str, list[float]] = defaultdict(list)
        
        # Cleanup old entries periodically (every 5 minutes)
        self.last_cleanup = time.time()
        self.cleanup_interval = 300  # 5 minutes
    
    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address from request"""
        # Check for forwarded IP (when behind proxy/load balancer)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP in the chain
            return forwarded_for.split(",")[0].strip()
        
        # Check for real IP header
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        
        # Fallback to direct client IP
        if request.client:
            return request.client.host
        
        return "unknown"
    
    def _cleanup_old_entries(self):
        """Remove old request timestamps to prevent memory leaks"""
        current_time = time.time()
        
        # Only cleanup if enough time has passed
        if current_time - self.last_cleanup < self.cleanup_interval:
            return
        
        self.last_cleanup = current_time
        cutoff_time = current_time - 3600  # Keep only last hour of data
        
        # Remove old timestamps and empty entries
        ips_to_remove = []
        for ip, timestamps in self.request_history.items():
            # Filter out timestamps older than 1 hour
            self.request_history[ip] = [
                ts for ts in timestamps if ts > cutoff_time
            ]
            
            # Mark empty entries for removal
            if not self.request_history[ip]:
                ips_to_remove.append(ip)
        
        # Remove empty entries
        for ip in ips_to_remove:
            del self.request_history[ip]
        
        logger.debug(f"Cleaned up rate limit history. Active IPs: {len(self.request_history)}")
    
    def _check_rate_limit(self, ip: str) -> tuple[bool, str]:
        """
        Check if IP has exceeded rate limits
        
        Returns:
            tuple: (is_allowed, error_message)
        """
        current_time = time.time()
        
        # Get request history for this IP
        timestamps = self.request_history[ip]
        
        # Filter timestamps within the last minute and hour
        one_minute_ago = current_time - 60
        one_hour_ago = current_time - 3600
        
        recent_minute = [ts for ts in timestamps if ts > one_minute_ago]
        recent_hour = [ts for ts in timestamps if ts > one_hour_ago]
        
        # Check per-minute limit
        if len(recent_minute) >= self.requests_per_minute:
            return False, f"Rate limit exceeded: {self.requests_per_minute} requests per minute"
        
        # Check per-hour limit
        if len(recent_hour) >= self.requests_per_hour:
            return False, f"Rate limit exceeded: {self.requests_per_hour} requests per hour"
        
        # Add current request timestamp
        timestamps.append(current_time)
        
        # Update the history (keep only last hour)
        self.request_history[ip] = [ts for ts in timestamps if ts > one_hour_ago]
        
        return True, ""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and apply rate limiting
        """
        # Skip rate limiting for health check endpoints
        if request.url.path in ["/", "/health", "/docs", "/openapi.json", "/redoc"]:
            return await call_next(request)
        
        # Get client IP
        client_ip = self._get_client_ip(request)
        
        # Periodic cleanup
        self._cleanup_old_entries()
        
        # Check rate limit
        is_allowed, error_message = self._check_rate_limit(client_ip)
        
        if not is_allowed:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}, Path: {request.url.path}")
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=error_message,
                headers={"Retry-After": "60"}  # Suggest retry after 60 seconds
            )
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        response.headers["X-RateLimit-Limit-Minute"] = str(self.requests_per_minute)
        response.headers["X-RateLimit-Limit-Hour"] = str(self.requests_per_hour)
        
        return response


