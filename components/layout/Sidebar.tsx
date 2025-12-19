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
      name: 'Overview',
      href: '/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Mining',
      href: '/mining-dashboard',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      ),
    },
    {
      name: 'Infrastructure',
      href: '/infrastructure',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'Monitoring',
      href: '/monitoring',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 z-50 shadow-sm ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-center px-4 border-b border-slate-100 transition-all duration-300 ${
        isCollapsed ? 'h-16' : 'h-24'
      }`}>
        {!isCollapsed && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-36 h-10">
              <Image
                src="/hearst-full.png"
                alt="Hearst Qatar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-slate-400 font-medium text-[10px] tracking-[0.3em] mt-1">QATAR</span>
          </div>
        )}
        {isCollapsed && (
          <div className="relative w-8 h-8">
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
        className={`absolute -right-3 w-6 h-6 bg-white hover:bg-emerald-500 rounded-full flex items-center justify-center transition-colors border border-slate-200 shadow-sm z-50 group ${
          isCollapsed ? 'top-20' : 'top-28'
        }`}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-slate-400 group-hover:text-white transition-all ${isCollapsed ? 'rotate-180' : ''}`}
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu Items */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive(item.href)
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <span className={isActive(item.href) ? 'text-emerald-600' : ''}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm">
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100">
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-600 text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
