# cache.py
import os
import json
import logging
from typing import Any, Dict, Optional, Union
import redis
from redis.exceptions import ConnectionError, TimeoutError, RedisError

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Redis configuration from environment variables
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", None)
REDIS_DECODE_RESPONSES = True
REDIS_MAX_CONNECTIONS = int(os.getenv("REDIS_MAX_CONNECTIONS", "10"))

# Cache TTL settings (in seconds)
DEFAULT_TTL = int(os.getenv("CACHE_DEFAULT_TTL", "3600"))  # 1 hour
PREDICTION_TTL = int(os.getenv("CACHE_PREDICTION_TTL", "1800"))  # 30 minutes
HEALTH_RECORD_TTL = int(os.getenv("CACHE_HEALTH_RECORD_TTL", "7200"))  # 2 hours

# Cache key prefixes
PREDICTION_PREFIX = "prediction"
HEALTH_RECORD_PREFIX = "health_record"
SESSION_PREFIX = "session"
PATIENT_PREFIX = "patient"

class CacheManager:
    def __init__(self):
        self.client = None
        self.connection_pool = None
        self.connect()
    
    def connect(self):
        """Establish connection to Redis"""
        try:
            # Create connection pool
            self.connection_pool = redis.ConnectionPool(
                host=REDIS_HOST,
                port=REDIS_PORT,
                db=REDIS_DB,
                password=REDIS_PASSWORD,
                decode_responses=REDIS_DECODE_RESPONSES,
                max_connections=REDIS_MAX_CONNECTIONS,
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            
            # Create Redis client
            self.client = redis.Redis(connection_pool=self.connection_pool)
            
            # Test connection
            self.client.ping()
            
            logger.info(f"Successfully connected to Redis: {REDIS_HOST}:{REDIS_PORT}")
            
        except Exception as e:
            logger.error(f"Failed to connect to Redis: {e}")
            self.client = None
            self.connection_pool = None
    
    def is_connected(self) -> bool:
        """Check if Redis connection is active"""
        try:
            if self.client is None:
                return False
            self.client.ping()
            return True
        except Exception:
            return False
    
    def close_connection(self):
        """Close Redis connection"""
        if self.connection_pool:
            self.connection_pool.disconnect()
            logger.info("Redis connection closed")

# Global cache manager instance
cache_manager = CacheManager()

def get_redis_client():
    """Get Redis client instance"""
    if not cache_manager.is_connected():
        cache_manager.connect()
    return cache_manager.client

# Redis client for backward compatibility
redis_client = cache_manager.client

def _serialize_value(value: Any) -> str:
    """Serialize value for Redis storage"""
    try:
        if isinstance(value, (dict, list)):
            return json.dumps(value, default=str)
        elif isinstance(value, (int, float, bool)):
            return json.dumps(value)
        else:
            return str(value)
    except Exception as e:
        logger.error(f"Failed to serialize value: {e}")
        return str(value)

def _deserialize_value(value: str) -> Any:
    """Deserialize value from Redis storage"""
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return value

def set_cache(key: str, value: Any, ttl: int = DEFAULT_TTL) -> bool:
    """Set a value in cache with TTL"""
    try:
        client = get_redis_client()
        if client is None:
            return False
        
        serialized_value = _serialize_value(value)
        result = client.setex(key, ttl, serialized_value)
        
        logger.debug(f"Cache set: {key} (TTL: {ttl}s)")
        return result
        
    except Exception as e:
        logger.error(f"Failed to set cache for key {key}: {e}")
        return False

def get_cache(key: str) -> Optional[Any]:
    """Get a value from cache"""
    try:
        client = get_redis_client()
        if client is None:
            return None
        
        value = client.get(key)
        if value is None:
            return None
        
        return _deserialize_value(value)
        
    except Exception as e:
        logger.error(f"Failed to get cache for key {key}: {e}")
        return None

def delete_cache(key: str) -> bool:
    """Delete a key from cache"""
    try:
        client = get_redis_client()
        if client is None:
            return False
        
        result = client.delete(key)
        logger.debug(f"Cache deleted: {key}")
        return bool(result)
        
    except Exception as e:
        logger.error(f"Failed to delete cache for key {key}: {e}")
        return False

def exists_in_cache(key: str) -> bool:
    """Check if key exists in cache"""
    try:
        client = get_redis_client()
        if client is None:
            return False
        
        return bool(client.exists(key))
        
    except Exception as e:
        logger.error(f"Failed to check cache existence for key {key}: {e}")
        return False

def get_cache_ttl(key: str) -> int:
    """Get TTL for a cache key"""
    try:
        client = get_redis_client()
        if client is None:
            return -1
        
        return client.ttl(key)
        
    except Exception as e:
        logger.error(f"Failed to get TTL for key {key}: {e}")
        return -1

# Specific cache functions for the healthcare app

def cache_prediction(cache_key: str, prediction_data: Dict[str, Any], ttl: int = PREDICTION_TTL) -> bool:
    """Cache a prediction result"""
    try:
        full_key = f"{PREDICTION_PREFIX}:{cache_key}"
        return set_cache(full_key, prediction_data, ttl)
    except Exception as e:
        logger.error(f"Failed to cache prediction: {e}")
        return False

def get_cached_prediction(cache_key: str) -> Optional[Dict[str, Any]]:
    """Retrieve a cached prediction"""
    try:
        full_key = f"{PREDICTION_PREFIX}:{cache_key}"
        return get_cache(full_key)
    except Exception as e:
        logger.error(f"Failed to get cached prediction: {e}")
        return None

def cache_health_record(patient_id: str, record_data: Dict[str, Any], ttl: int = HEALTH_RECORD_TTL) -> bool:
    """Cache a health record"""
    try:
        full_key = f"{HEALTH_RECORD_PREFIX}:{patient_id}"
        return set_cache(full_key, record_data, ttl)
    except Exception as e:
        logger.error(f"Failed to cache health record: {e}")
        return False

def get_cached_health_record(patient_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve a cached health record"""
    try:
        full_key = f"{HEALTH_RECORD_PREFIX}:{patient_id}"
        return get_cache(full_key)
    except Exception as e:
        logger.error(f"Failed to get cached health record: {e}")
        return None

def cache_patient_data(patient_id: str, patient_data: Dict[str, Any], ttl: int = DEFAULT_TTL) -> bool:
    """Cache patient data"""
    try:
        full_key = f"{PATIENT_PREFIX}:{patient_id}"
        return set_cache(full_key, patient_data, ttl)
    except Exception as e:
        logger.error(f"Failed to cache patient data: {e}")
        return False

def get_cached_patient_data(patient_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve cached patient data"""
    try:
        full_key = f"{PATIENT_PREFIX}:{patient_id}"
        return get_cache(full_key)
    except Exception as e:
        logger.error(f"Failed to get cached patient data: {e}")
        return None

def invalidate_patient_cache(patient_id: str) -> bool:
    """Invalidate all cache entries for a patient"""
    try:
        client = get_redis_client()
        if client is None:
            return False
        
        # Find all keys related to the patient
        patterns = [
            f"{PREDICTION_PREFIX}:*{patient_id}*",
            f"{HEALTH_RECORD_PREFIX}:{patient_id}",
            f"{PATIENT_PREFIX}:{patient_id}"
        ]
        
        deleted_count = 0
        for pattern in patterns:
            keys = client.keys(pattern)
            if keys:
                deleted_count += client.delete(*keys)
        
        logger.info(f"Invalidated {deleted_count} cache entries for patient {patient_id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to invalidate patient cache: {e}")
        return False

def get_cache_stats() -> Dict[str, Any]:
    """Get cache statistics"""
    try:
        client = get_redis_client()
        if client is None:
            return {"error": "Cache not connected", "connected": False}
        
        info = client.info()
        
        stats = {
            "connected": True,
            "redis_version": info.get("redis_version", "unknown"),
            "used_memory": info.get("used_memory_human", "unknown"),
            "connected_clients": info.get("connected_clients", 0),
            "total_commands_processed": info.get("total_commands_processed", 0),
            "keyspace_hits": info.get("keyspace_hits", 0),
            "keyspace_misses": info.get("keyspace_misses", 0),
            "keys_by_prefix": {}
        }
        
        # Count keys by prefix
        prefixes = [PREDICTION_PREFIX, HEALTH_RECORD_PREFIX, PATIENT_PREFIX, SESSION_PREFIX]
        for prefix in prefixes:
            pattern = f"{prefix}:*"
            keys = client.keys(pattern)
            stats["keys_by_prefix"][prefix] = len(keys)
        
        # Calculate hit ratio
        hits = stats["keyspace_hits"]
        misses = stats["keyspace_misses"]
        total = hits + misses
        stats["cache_hit_ratio"] = round(hits / total * 100, 2) if total > 0 else 0
        
        return stats
        
    except Exception as e:
        logger.error(f"Failed to get cache stats: {e}")
        return {"error": str(e), "connected": False}

def flush_cache(pattern: str = None) -> bool:
    """Flush cache entries, optionally by pattern"""
    try:
        client = get_redis_client()
        if client is None:
            return False
        
        if pattern:
            keys = client.keys(pattern)
            if keys:
                deleted = client.delete(*keys)
                logger.info(f"Flushed {deleted} cache entries matching pattern: {pattern}")
            return True
        else:
            client.flushdb()
            logger.info("Flushed entire cache database")
            return True
        
    except Exception as e:
        logger.error(f"Failed to flush cache: {e}")
        return False

# Health check function
def cache_health_check() -> bool:
    """Cache health check"""
    return cache_manager.is_connected()

# Cleanup function
def cleanup_cache():
    """Close cache connections"""
    cache_manager.close_connection()