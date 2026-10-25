#ifndef ENVIRONODE_TELEMETRY_PROTOCOL_H
#define ENVIRONODE_TELEMETRY_PROTOCOL_H

#include <stddef.h>
#include <stdint.h>

typedef struct {
  const char *sensor_id;
  int32_t value_milli;
} environode_reading_t;

int environode_telemetry_format(
  char *output,
  size_t capacity,
  const char *boot_id,
  uint32_t sequence,
  const char *sampled_at_iso8601,
  const environode_reading_t *readings,
  size_t reading_count
);

#endif
