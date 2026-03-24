import { apiClient } from '@/core/api/axios'

export interface ChatMessageResponse {
  sessionId: string;
  reply: string;
  userMessageId: string;
  modelMessageId: string;
}

export async function sendChatMessage(sessionId: string, content: string, imageUri?: string): Promise<ChatMessageResponse> {
  const formData = new FormData()
  formData.append('content', content || '')
  
  if (imageUri) {
    const filename = imageUri.split('/').pop() || 'image.jpg'
    const match = /\.(\w+)$/.exec(filename)
    const type = match ? `image/${match[1]}` : 'image/jpeg'
    
    // @ts-ignore
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type
    } as any)
  }

  const response = await apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
    timeout: 60000,
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  })
  
  const data = response.data as any;
  if (data && data.data && data.data.reply) {
    return data.data;
  }
  return data as unknown as ChatMessageResponse;
}
