export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text?: string
  image?: string
  suggestions?: string[]
}
