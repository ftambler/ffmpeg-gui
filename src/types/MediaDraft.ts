export type MediaDraft = {
  id: string
  file: File
  startTime: number
  endTime: number
  timelineStartTime: number
}

export type MediaPayload = {
  inputFile: string
  startTime: number
  endTime: number
  timelineStartTime: number
}