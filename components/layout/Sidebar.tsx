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
      name: 'Projet Qatar',
      href: '/project',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
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
      name: '100MW Mining',
      href: '/100mw-mining',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          <circle cx="18" cy="5" r="3" strokeWidth={2} />
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
    {
      name: 'Analytics',
      href: '/analytics',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Analytics Pro',
      href: '/analytics-advanced',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
    },
    {
      name: 'Galerie 3D',
      href: '/gallery',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      name: 'Unreal Viewer',
      href: '/unreal-viewer',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700/50 transition-all duration-300 ease-out z-50 flex flex-col ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header - Logo avec hauteur fixe */}
      <Link
        href="/"
        className="h-20 flex items-center justify-center border-b border-slate-700/50 bg-slate-900/50 transition-all duration-300 ease-out cursor-pointer hover:bg-slate-800/30"
        aria-label="Retour au Dashboard"
      >
        <div className="relative flex items-center justify-center overflow-hidden">
          {/* Logo complet - visible quand ouvert */}
          <div 
            className={`flex flex-col items-center transition-all duration-300 ease-out ${
              isCollapsed 
                ? 'opacity-0 scale-75 absolute' 
                : 'opacity-100 scale-100'
            }`}
          >
            <div className="relative w-40 h-12">
              <Image
                src="/hearst-full.png"
                alt="Hearst Qatar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-white/80 font-semibold text-[10px] tracking-[0.3em] -mt-1">QATAR</span>
          </div>
          
          {/* Logo icône - visible quand collapsed */}
          <div 
            className={`relative transition-all duration-300 ease-out ${
              isCollapsed 
                ? 'opacity-100 scale-100 w-10 h-10' 
                : 'opacity-0 scale-75 absolute w-0 h-0'
            }`}
          >
            {isCollapsed && (
              <Image
                src="/hearst-icon.png"
                alt="H"
                fill
                className="object-contain"
                priority
              />
            )}
          </div>
        </div>
      </Link>

      {/* Toggle Button - Position fixe */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 transform -translate-y-1/2 mt-6 w-6 h-6 bg-slate-700 hover:bg-[#8AFD81] rounded-full flex items-center justify-center transition-all duration-300 ease-out border-2 border-slate-800 group z-50 hover:scale-110"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-expanded={!isCollapsed}
        aria-controls="sidebar-menu"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-slate-300 group-hover:text-slate-900 transition-transform duration-300 ease-out ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu Items - Centré verticalement */}
      <nav 
        id="sidebar-menu" 
        className="flex-1 flex flex-col justify-center px-3" 
        role="navigation" 
        aria-label="Menu principal"
      >
        <ul className="space-y-1" role="menubar">
          {menuItems.map((item, index) => (
            <li key={item.href} role="none">
              <Link
                href={item.href}
                role="menuitem"
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`flex items-center h-11 rounded-xl transition-all duration-200 ease-out group relative overflow-hidden ${
                  isCollapsed ? 'justify-center px-0' : 'px-3'
                } ${
                  isActive(item.href)
                    ? 'bg-[#8AFD81] text-slate-900 shadow-lg shadow-[#8AFD81]/20'
                    : 'text-slate-400 hover:bg-slate-700/40 hover:text-white'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
              >
                {/* Icône avec largeur fixe */}
                <span 
                  className={`w-6 h-6 flex-shrink-0 flex items-center justify-center transition-transform duration-200 ease-out group-hover:scale-110 ${
                    isActive(item.href) ? 'text-slate-900' : ''
                  }`} 
                  aria-hidden="true"
                >
                  {item.icon}
                </span>
                
                {/* Texte avec animation de fade */}
                <span 
                  className={`font-medium text-sm whitespace-nowrap transition-all duration-300 ease-out ${
                    isCollapsed 
                      ? 'w-0 opacity-0 ml-0' 
                      : 'w-auto opacity-100 ml-3'
                  }`}
                >
                  {item.name}
                </span>
                
                {/* Label accessible pour mode collapsed */}
                {isCollapsed && (
                  <span className="sr-only">{item.name}</span>
                )}

                {/* Indicateur actif subtle */}
                {isActive(item.href) && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-900/30 rounded-r-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Info */}
      <div className={`border-t border-slate-700/50 transition-all duration-300 ease-out ${
        isCollapsed ? 'p-3' : 'p-4'
      }`}>
        {!isCollapsed ? (
          <div className="bg-slate-800/50 rounded-xl p-3 backdrop-blur-sm">
            <div className="text-slate-500 text-xs mb-1.5 font-medium">Facility Status</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#8AFD81] rounded-full animate-pulse shadow-lg shadow-[#8AFD81]/50"></div>
              <span className="text-white text-sm font-medium">Operational</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 bg-[#8AFD81] rounded-full animate-pulse shadow-lg shadow-[#8AFD81]/50"></div>
          </div>
        )}
      </div>
    </div>
  );
}
