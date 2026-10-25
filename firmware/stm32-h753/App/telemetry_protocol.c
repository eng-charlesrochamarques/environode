#include "telemetry_protocol.h"

#include <stdarg.h>
#include <stdio.h>

static int append(char *output, size_t capacity, size_t *used, const char *format, ...) {
  va_list args;
  va_start(args, format);
  int written = vsnprintf(output + *used, capacity - *used, format, args);
  va_end(args);
  if (written < 0 || (size_t)written >= capacity - *used) return -1;
  *used += (size_t)written;
  return 0;
}

int environode_telemetry_format(
  char *output, size_t capacity, const char *boot_id, uint32_t sequence,
  const char *sampled_at_iso8601, const environode_reading_t *readings,
  size_t reading_count
) {
  if (!output || !capacity || !readings || !reading_count || reading_count > 32) return -1;
  size_t used = 0;
  if (append(output, capacity, &used, "{")) return -1;
  if (boot_id && append(output, capacity, &used, "\"bootId\":\"%s\",\"sequence\":%lu,", boot_id, (unsigned long)sequence)) return -1;
  if (sampled_at_iso8601 && append(output, capacity, &used, "\"sampledAt\":\"%s\",", sampled_at_iso8601)) return -1;
  if (append(output, capacity, &used, "\"readings\":[")) return -1;
  for (size_t index = 0; index < reading_count; index++) {
    const int64_t signed_value = readings[index].value_milli;
    const uint64_t magnitude = (uint64_t)(signed_value < 0 ? -signed_value : signed_value);
    if (append(output, capacity, &used, "%s{\"sensorId\":\"%s\",\"value\":%s%lu.%03lu}", index ? "," : "", readings[index].sensor_id, signed_value < 0 ? "-" : "", (unsigned long)(magnitude / 1000), (unsigned long)(magnitude % 1000))) return -1;
  }
  if (append(output, capacity, &used, "]}\n")) return -1;
  return (int)used;
}
