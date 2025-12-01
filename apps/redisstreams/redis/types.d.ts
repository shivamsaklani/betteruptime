export type websiteType = { url: string, id: string };
export type MessageType = {
  id: string,
  message: {
    url: string,
    id: string
  }
}
export type ResponseType = {
  name: string,
  messages: MessageType[] // each message type 
}

export type Events = {
  occured: boolean, 
  Reason: string, 
  level: level, 
  websiteId: string, 
  isResolved: boolean
}

export enum level{
  low="low",
  mid = "mid",
  high = "high",
  threat = "threat"
}
