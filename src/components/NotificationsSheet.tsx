import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-react'
import { notifications } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export const NotificationsSheet = () => {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notificações</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 rounded-lg transition-colors hover:bg-muted/50"
            >
              <div
                className={cn(
                  'h-2 w-2 rounded-full mt-2',
                  !notification.read ? 'bg-primary' : 'bg-transparent',
                )}
              />
              <div>
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
