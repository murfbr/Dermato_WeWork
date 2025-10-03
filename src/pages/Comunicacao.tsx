import { useState, useEffect, useRef, FormEvent, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Paperclip, Send, ArrowLeft, Search } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useClient } from '@/contexts/ClientContext'
import { Conversation, Message, Client, doctor } from '@/lib/mock-data'
import { useAuth } from '@/contexts/AuthContext'

export default function Comunicacao() {
  const { role } = useAuth()
  const { clients, currentClient } = useClient()
  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    role === 'doctor' ? clients[0]?.id || null : currentClient?.id || null,
  )
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const isMobile = useIsMobile()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const filteredClients = useMemo(
    () =>
      clients.filter((client) =>
        client.profile.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [clients, searchTerm],
  )

  useEffect(() => {
    const client = clients.find((c) => c.id === selectedClientId)
    if (!client) return

    if (role === 'doctor') {
      const conv = client.conversations.find(
        (c) => c.contactName === doctor.name,
      )
      setSelectedConv(conv || null)
    } else {
      setSelectedConv(client.conversations[0] || null)
    }
  }, [selectedClientId, clients, role])

  useEffect(() => {
    if (scrollAreaRef.current) {
      const { scrollHeight } = scrollAreaRef.current
      scrollAreaRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' })
    }
  }, [selectedConv?.messages])

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConv || !selectedClientId) return

    const senderName =
      role === 'doctor'
        ? doctor.name
        : clients.find((c) => c.id === selectedClientId)?.profile.name || ''

    const newMsg: Message = {
      id: Date.now(),
      sender: senderName,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: true,
    }

    const updatedConv = {
      ...selectedConv,
      messages: [...selectedConv.messages, newMsg],
      lastMessage: newMsg.text,
      timestamp: newMsg.timestamp,
    }
    setSelectedConv(updatedConv)
    setNewMessage('')
  }

  const ChatView = () => {
    if (!selectedConv)
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Selecione uma conversa para começar.
        </div>
      )

    const currentUserName =
      role === 'doctor'
        ? doctor.name
        : clients.find((c) => c.id === selectedClientId)?.profile.name
    return (
      <div className="flex flex-col h-full">
        <header className="flex items-center gap-4 border-b p-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedConv(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={selectedConv.contactAvatar} />
            <AvatarFallback>
              {selectedConv.contactName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{selectedConv.contactName}</h2>
        </header>
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {selectedConv.messages.map((msg) => {
              const isUser = msg.sender === currentUserName
              return (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-end gap-2',
                    isUser ? 'justify-end' : 'justify-start',
                  )}
                >
                  {!isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedConv.contactAvatar} />
                      <AvatarFallback>
                        {selectedConv.contactName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-2xl p-3',
                      isUser
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
              )
            })}
          </div>
        </ScrollArea>
        <footer className="border-t p-4">
          <form onSubmit={handleSendMessage} className="relative">
            <Input
              placeholder="Digite sua mensagem..."
              className="pr-24"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button type="button" variant="ghost" size="icon">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Button type="submit" variant="ghost" size="icon">
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </footer>
      </div>
    )
  }

  const ConversationList = () => {
    const listItems =
      role === 'doctor' ? filteredClients : currentClient?.conversations || []

    const handleSelect = (item: Client | Conversation) => {
      if ('profile' in item) {
        setSelectedClientId(item.id)
      } else {
        const client = clients.find((c) => c.id === selectedClientId)
        const conv = client?.conversations.find((c) => c.id === item.id)
        setSelectedConv(conv || null)
      }
    }

    return (
      <div className="flex flex-col h-full">
        <header className="border-b p-4">
          <h2 className="font-semibold text-lg mb-2">
            {role === 'doctor' ? 'Pacientes' : 'Conversas'}
          </h2>
          {role === 'doctor' && (
            <div className="relative">
              <Input
                placeholder="Buscar paciente..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </header>
        <ScrollArea>
          {listItems.map((item) => {
            const isClient = 'profile' in item
            const id = isClient ? item.id : item.id
            const avatar = isClient
              ? item.profile.avatarUrl
              : item.contactAvatar
            const name = isClient ? item.profile.name : item.contactName
            const lastMessage = isClient
              ? item.conversations.find((c) => c.contactName === doctor.name)
                  ?.lastMessage
              : item.lastMessage
            const timestamp = isClient
              ? item.conversations.find((c) => c.contactName === doctor.name)
                  ?.timestamp
              : item.timestamp
            const isSelected = isClient
              ? selectedClientId === id
              : selectedConv?.id === id

            return (
              <div
                key={id}
                onClick={() => handleSelect(item)}
                className={cn(
                  'flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50',
                  isSelected && 'bg-muted',
                )}
              >
                <Avatar>
                  <AvatarImage src={avatar} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 truncate">
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {lastMessage}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">{timestamp}</div>
              </div>
            )
          })}
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-[calc(100vh-8rem)] border rounded-lg overflow-hidden">
      {isMobile ? (
        selectedConv ? (
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
            <ChatView />
          </div>
        </>
      )}
    </div>
  )
}
