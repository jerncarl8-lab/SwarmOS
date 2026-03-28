export const Memory = {
  events: [] as any[]
};

export function logEvent(e: any) {
  Memory.events.push({ ...e, ts: Date.now() });
}