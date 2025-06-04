import { onMounted } from 'vue';
import { logLoadTime } from './logMetrics';

/**
 * Track component load duration in development mode.
 *
 * @param name - Identifier for logging.
 */
export function useLoadTimeLogger(name: string) {
  const start = performance.now();
  onMounted(() => {
    logLoadTime(name, start);
  });
}
