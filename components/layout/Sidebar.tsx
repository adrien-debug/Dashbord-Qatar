import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter();

  const menuItems = [
    {
      name: 'Vue d\'ensemble',
      href: '/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Mining Dashboard',
      href: '/mining-dashboard',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      name: 'Infrastructure',
      href: '/infrastructure',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Project Monitoring',
      href: '/monitoring',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className={`flex items-start justify-center border-b border-slate-700 bg-slate-900/50 transition-all duration-300 ${
        isCollapsed ? 'h-16' : 'h-28'
      }`}>
        {!isCollapsed && (
          <div className="flex flex-col items-center w-full gap-0">
            <div className="relative w-96 h-36 -mt-4">
              <Image
                src="/hearst-full.png"
                alt="Hearst Qatar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white font-bold text-sm tracking-[0.4em] -mt-14">QATAR</span>
          </div>
        )}
        {isCollapsed && (
          <div className="relative w-10 h-10">
            <Image
              src="/hearst-icon.png"
              alt="H"
              fill
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`absolute -right-3 w-6 h-6 bg-slate-700 hover:bg-[#8AFD81] rounded-full flex items-center justify-center transition-all duration-300 border-2 border-slate-800 group z-50 ${
          isCollapsed ? 'top-20' : 'top-32'
        }`}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-slate-300 group-hover:text-slate-900 transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu Items */}
      <nav className="mt-8 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.href)
                    ? 'bg-[#8AFD81] text-slate-900'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <span className={isActive(item.href) ? 'text-slate-900' : 'text-slate-400 group-hover:text-white'}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="text-slate-400 text-xs mb-1">Facility Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}

