export interface ScoreSubmission {
  round_heat_id: number;
  run_num: number;
  personnel_id: number;
  score: number;
  athlete_id: number;
}

const QUEUE_KEY = "score-submission-queue";

function loadQueue(): ScoreSubmission[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? (JSON.parse(raw) as ScoreSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue: ScoreSubmission[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function enqueueScore(item: ScoreSubmission): void {
  const queue = loadQueue();
  queue.push(item);
  saveQueue(queue);
}

export async function flushQueue(
  submitFn: (item: ScoreSubmission) => Promise<void>
): Promise<void> {
  const queue = loadQueue();
  while (queue.length > 0) {
    const current = queue[0];
    try {
      await submitFn(current);
      queue.shift();
      saveQueue(queue);
    } catch {
      // Stop processing if submission fails; remaining items stay in queue
      break;
    }
  }
}
