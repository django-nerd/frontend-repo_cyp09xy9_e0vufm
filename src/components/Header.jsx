import { useState } from 'react'

export default function Header({ onNavigate, current }) {
  const tabs = [
    { key: 'personas', label: 'Personas' },
    { key: 'accounts', label: 'Accounts & Contacts' },
    { key: 'templates', label: 'Templates & Sequences' },
    { key: 'console', label: 'Personalize & Simulate' },
    { key: 'audit', label: 'Audit' },
  ]

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-slate-900/60 border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <div>
            <h1 className="text-white font-semibold leading-tight">AI Outreach Engine</h1>
            <p className="text-xs text-slate-300/70">Multi-channel, compliance-first, AI-personalized</p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => onNavigate(t.key)}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${current===t.key? 'bg-blue-600 text-white':'text-slate-200 hover:bg-slate-700/60'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
