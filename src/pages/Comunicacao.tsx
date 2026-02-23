import { useState, useEffect, useRef, FormEvent, useMemo } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Paperclip, Send, ArrowLeft, Search, MessageSquare } from 'lucide-react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useClient } from '@/contexts/ClientContext'
import { Conversation, Message, Client, doctor } from '@/lib/mock-data'
import { useAuth } from '@/contexts/AuthContext'

const ChatView = ({
  selectedConv,
  isMobile,
  onBack,
  currentUserName,
  isStaff,
  selectedClientId,
  clients,
  onSendMessage,
  staffName,
}: any) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [newMessage, setNewMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      const { scrollHeight } = scrollAreaRef.current
      scrollAreaRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' })
    }
  }, [selectedConv?.messages])

  const handleSend = (e: FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    onSendMessage(newMessage)
    setNewMessage('')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fakeUrl = `https://img.usecurling.com/p/400/300?q=document&color=blue`
      onSendMessage('Arquivo anexado', fakeUrl)
    }
  }

  if (!selectedConv)
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p>Selecione uma conversa para começar.</p>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="flex items-center gap-4 border-b p-4 shadow-sm z-10 bg-card">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Avatar>
          <AvatarImage src={selectedConv.contactAvatar} />
          <AvatarFallback>{selectedConv.contactName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="font-semibold leading-none">
            {selectedConv.contactName}
          </h2>
          {isStaff && (
            <span className="text-xs text-muted-foreground mt-1">Paciente</span>
          )}
        </div>
      </header>
      <ScrollArea className="flex-1 p-4 bg-muted/10" ref={scrollAreaRef}>
        <div className="space-y-4 max-w-3xl mx-auto">
          {selectedConv.messages.map((msg: any) => {
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
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={selectedConv.contactAvatar} />
                    <AvatarFallback>
                      {selectedConv.contactName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 shadow-sm',
                    isUser
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-card border rounded-bl-none',
                  )}
                >
                  {msg.attachment && (
                    <img
                      src={msg.attachment}
                      alt="Anexo"
                      className="rounded-lg mb-2 max-w-full h-auto max-h-48 object-cover border"
                    />
                  )}
                  <p className="text-sm sm:text-base leading-relaxed">
                    {msg.text}
                  </p>
                  <p
                    className={cn(
                      'text-[10px] mt-1 text-right',
                      isUser
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground',
                    )}
                  >
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
      <footer className="border-t p-4 bg-card">
        <form
          onSubmit={handleSend}
          className="relative max-w-3xl mx-auto flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-full px-4"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 rounded-full h-10 w-10"
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4 ml-1" />
          </Button>
        </form>
      </footer>
    </div>
  )
}

const ConversationList = ({
  isStaff,
  filteredClients,
  currentClient,
  searchTerm,
  setSearchTerm,
  selectedClientId,
  selectedConv,
  handleSelect,
  staffName,
}: any) => {
  const listItems = isStaff
    ? filteredClients
    : currentClient?.conversations || []

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="border-b p-4 shadow-sm z-10">
        <h2 className="font-semibold text-lg mb-4">
          {isStaff ? 'Mensagens (Pacientes)' : 'Conversas'}
        </h2>
        {isStaff && (
          <div className="relative">
            <Input
              placeholder="Buscar paciente..."
              className="pl-9 bg-muted/50 border-transparent focus-visible:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </header>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {listItems.map((item: any) => {
            const isClient = 'profile' in item
            const id = isClient ? item.id : item.id
            const avatar = isClient
              ? item.profile.avatarUrl
              : item.contactAvatar
            const name = isClient ? item.profile.name : item.contactName
            const lastMessage = isClient
              ? item.conversations.find((c: any) => c.contactName === staffName)
                  ?.lastMessage || item.conversations[0]?.lastMessage
              : item.lastMessage
            const timestamp = isClient
              ? item.conversations.find((c: any) => c.contactName === staffName)
                  ?.timestamp || item.conversations[0]?.timestamp
              : item.timestamp
            const isSelected = isClient
              ? selectedClientId === id
              : selectedConv?.id === id

            return (
              <div
                key={id}
                onClick={() => handleSelect(item)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200',
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-muted text-foreground',
                )}
              >
                <Avatar
                  className={cn(
                    'border-2',
                    isSelected
                      ? 'border-primary-foreground/20'
                      : 'border-transparent',
                  )}
                >
                  <AvatarImage src={avatar} />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className="font-semibold truncate text-sm">{name}</p>
                    <span
                      className={cn(
                        'text-xs shrink-0 ml-2',
                        isSelected
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground',
                      )}
                    >
                      {timestamp}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-xs truncate',
                      isSelected
                        ? 'text-primary-foreground/90'
                        : 'text-muted-foreground',
                    )}
                  >
                    {lastMessage}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export default function Comunicacao() {
  const { role } = useAuth()
  const { clients, currentClient, addMessage } = useClient()
  const isStaff = role === 'doctor' || role === 'admin'
  const staffName = role === 'admin' ? 'Clínica' : doctor.name

  const [selectedClientId, setSelectedClientId] = useState<number | null>(
    isStaff ? clients[0]?.id || null : currentClient?.id || null,
  )
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const isMobile = useIsMobile()

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

    if (isStaff) {
      const conv = client.conversations.find((c) => c.contactName === staffName)
      setSelectedConv(conv || client.conversations[0] || null)
    } else {
      setSelectedConv(client.conversations[0] || null)
    }
  }, [selectedClientId, clients, isStaff, staffName])

  // Sync selected conversation when clients update
  useEffect(() => {
    if (selectedConv && selectedClientId) {
      const client = clients.find((c) => c.id === selectedClientId)
      const updatedConv = client?.conversations.find(
        (c) => c.id === selectedConv.id,
      )
      if (updatedConv) setSelectedConv(updatedConv)
    }
  }, [clients, selectedClientId])

  const handleSelect = (item: Client | Conversation) => {
    if ('profile' in item) {
      setSelectedClientId(item.id)
    } else {
      const client = clients.find((c) => c.id === selectedClientId)
      const conv = client?.conversations.find((c) => c.id === item.id)
      setSelectedConv(conv || null)
    }
  }

  const handleSendMessage = (text: string, attachment?: string) => {
    if (!selectedConv || !selectedClientId) return

    const senderName = isStaff
      ? staffName
      : clients.find((c) => c.id === selectedClientId)?.profile.name || ''

    const newMsg: Message = {
      id: Date.now(),
      sender: senderName,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      read: true,
      attachment,
    }

    addMessage(selectedClientId, selectedConv.id, newMsg)
  }

  const currentUserName = isStaff
    ? staffName
    : clients.find((c) => c.id === selectedClientId)?.profile.name

  return (
    <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-[calc(100vh-8rem)] border rounded-xl overflow-hidden shadow-sm bg-background">
      {isMobile ? (
        selectedConv ? (
          <ChatView
            selectedConv={selectedConv}
            isMobile={isMobile}
            onBack={() => setSelectedConv(null)}
            currentUserName={currentUserName}
            isStaff={isStaff}
            staffName={staffName}
            selectedClientId={selectedClientId}
            clients={clients}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <ConversationList
            isStaff={isStaff}
            filteredClients={filteredClients}
            currentClient={currentClient}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedClientId={selectedClientId}
            selectedConv={selectedConv}
            handleSelect={handleSelect}
            staffName={staffName}
          />
        )
      ) : (
        <>
          <div className="border-r bg-card">
            <ConversationList
              isStaff={isStaff}
              filteredClients={filteredClients}
              currentClient={currentClient}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedClientId={selectedClientId}
              selectedConv={selectedConv}
              handleSelect={handleSelect}
              staffName={staffName}
            />
          </div>
          <div className="bg-background">
            <ChatView
              selectedConv={selectedConv}
              isMobile={isMobile}
              currentUserName={currentUserName}
              isStaff={isStaff}
              staffName={staffName}
              selectedClientId={selectedClientId}
              clients={clients}
              onSendMessage={handleSendMessage}
            />
          </div>
        </>
      )}
    </div>
  )
}
