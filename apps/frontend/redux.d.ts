declare module "redux-persist/lib/storage" {
  import { Storage } from "redux-persist";
  const storage: Storage;
  export default storage;
}

declare module "redux-persist/lib/storage/session" {
  import { Storage } from "redux-persist";
  const storage: Storage;
  export default storage;
}

export interface notice {
  id: string;  
 mesg:string
 website:string,
 ack:boolean,
}

export interface recentIncidents{
  id:  string,
  websitename?:string,
  name:string,
  resolvedTime:string,
  timeAdded:string,
  level:string,
  resolved:boolean,
  websiteId:string,
}

export interface Website {
  id: string
  name: string
  url: string
  status: "up" | "down" | "degraded"
  responseTime: number
  lastChecked: string
  location :string ,
  uptime : number ,
  checkInterval :string
  recentIncidents: recentIncidents[]
}

export interface MonitoringState {
  websites: Website[]
  isLoading: boolean
  error: string | null
  selectedWebsite: Website | null
}


export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}


