export enum ChatRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system'
}

export interface ChatMessage {
  content: string
  role: ChatRole
}
