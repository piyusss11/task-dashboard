"use client"
import { useAppSelector } from "@/store/hooks"
import LoginForm from "@/components/login-form"
import KanbanBoard from "@/components/kanban-board"

function AppContent() {
  const { user, loading } = useAppSelector((state) => state.auth)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return <KanbanBoard />
}

export default function Home() {
  return <AppContent />
}
