import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Paperclip, Send, ArrowLeft } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useClient } from '@/contexts/ClientContext'
import { Conversation } from '@/lib/mock-data'

export default function Comunicacao() {
  const { currentClient } = useClient()
  const conversations = currentClient?.conversations || []
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    setSelectedConversation(conversations[0] || null)
  }, [currentClient, conversations])

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv)
  }

  const ChatView = () => {
    if (!selectedConversation) return null
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center gap-4 border-b p-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={selectedConversation.contactAvatar} />
            <AvatarFallback>
              {selectedConversation.contactName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{selectedConversation.contactName}</h2>
        </header>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === currentClient?.profile.name
                    ? 'justify-end'
                    : 'justify-start',
                )}
              >
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl p-3',
                    msg.sender === currentClient?.profile.name
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted rounded-bl-none',
                  )}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <footer className="border-t p-4">
          <div className="relative">
            <Input placeholder="Digite sua mensagem..." className="pr-24" />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  const ConversationList = () => (
    <div className="flex flex-col h-full">
      <header className="border-b p-4">
        <h2 className="font-semibold">Conversas</h2>
      </header>
      <ScrollArea>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => handleSelectConversation(conv)}
            className={cn(
              'flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50',
              selectedConversation?.id === conv.id && 'bg-muted',
            )}
          >
            <Avatar>
              <AvatarImage src={conv.contactAvatar} />
              <AvatarFallback>{conv.contactName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 truncate">
              <p className="font-semibold">{conv.contactName}</p>
              <p className="text-sm text-muted-foreground truncate">
                {conv.lastMessage}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {conv.timestamp}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {isMobile ? (
        selectedConversation ? (
          <ChatView />
        ) : (
          <ConversationList />
        )
      ) : (
        <>
          <div className="border-r">
            <ConversationList />
          </div>
          <div>
            {selectedConversation ? (
              <ChatView />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione uma conversa
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
