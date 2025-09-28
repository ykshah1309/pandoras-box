'use client'

import React from 'react'
import { DashboardProvider } from './components/DashboardContext'
import { GoddessThemeProvider } from './components/GoddessThemeContext'
import Sidebar from './components/Sidebar'
import ChatWindow from './components/ChatWindow'

export default function DashboardPage() {
  return (
    <GoddessThemeProvider>
      <DashboardProvider>
        <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col">
            <ChatWindow />
          </main>
        </div>
      </DashboardProvider>
    </GoddessThemeProvider>
  )
}