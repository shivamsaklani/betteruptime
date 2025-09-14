export type websiteType ={ url :string, id:string};
export type MessageType = {
  id: string,
  message: {
    url: string,
    id: string
  }
}
export type ResponseType = {
  name: string,
  messages: MessageType[]
}