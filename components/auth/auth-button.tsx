'use client'

import { signOut, useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import Link from 'next/link'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="h-8 w-8"></div>
  }

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          {session.user?.image && <AvatarImage src={session.user.image} alt={session.user.name ?? 'User avatar'} />}
          <AvatarFallback>{session.user?.name?.charAt(0)?.toUpperCase() || session.user?.email?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <span className="text-sm hidden md:inline">{session.user?.name || session.user?.email}</span>
        <Button variant="ghost" size="icon" onClick={() => signOut({ callbackUrl: '/login' })} title="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button asChild variant="outline">
      <Link href="/login">Login</Link>
    </Button>
  )
} 