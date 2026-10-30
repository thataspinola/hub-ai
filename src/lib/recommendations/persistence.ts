import type { RecommendationData } from './types'

export interface RecommendationRepository {
  load(): Promise<Partial<RecommendationData> | null>
  save(data: RecommendationData): Promise<void>
}

export interface RecommendationPreview {
  publish(data: RecommendationData): void
}

export interface RecommendationEffects {
  load: RecommendationRepository['load']
  publish: RecommendationPreview['publish']
  scheduleSave(
    data: RecommendationData,
    onStart: () => void,
    onComplete: () => void,
    onError: () => void,
  ): void
  dispose(): void
}

export function createRecommendationEffects(
  repository: RecommendationRepository,
  preview: RecommendationPreview,
  delay = 500,
): RecommendationEffects {
  let timer: ReturnType<typeof setTimeout> | null = null
  let revision = 0
  let writes = Promise.resolve()

  return {
    load: () => repository.load(),
    publish: (data) => preview.publish(data),
    scheduleSave(data, onStart, onComplete, onError) {
      const currentRevision = ++revision
      if (timer) clearTimeout(timer)
      onStart()
      timer = setTimeout(async () => {
        timer = null
        try {
          const write = writes.then(() => repository.save(data))
          writes = write.catch(() => undefined)
          await write
          if (currentRevision === revision) onComplete()
        } catch {
          if (currentRevision === revision) onError()
        }
      }, delay)
    },
    dispose() {
      revision++
      if (timer) clearTimeout(timer)
      timer = null
    },
  }
}
