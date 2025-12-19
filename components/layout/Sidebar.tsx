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
      className={`fixed left-0 top-0 h-screen bg-white/80 backdrop-blur-xl border-r border-[#d2d2d7]/50 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-center px-5 border-b border-[#d2d2d7]/50 transition-all duration-300 ${
        isCollapsed ? 'h-[72px]' : 'h-[100px]'
      }`}>
        {!isCollapsed && (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="relative w-32 h-9">
              <Image
                src="/hearst-full.png"
                alt="Hearst Qatar"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[#86868b] font-medium text-[10px] tracking-[0.25em] mt-1.5">QATAR</span>
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

      {/* Toggle */}
      <button
        onClick={onToggle}
        className={`absolute -right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-all border border-[#d2d2d7] shadow-sm hover:shadow-md z-50 group ${
          isCollapsed ? 'top-[84px]' : 'top-[112px]'
        }`}
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className={`text-[#86868b] group-hover:text-[#1d1d1f] transition-all ${isCollapsed ? 'rotate-180' : ''}`}
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Menu */}
      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive(item.href)
                    ? 'bg-[#10B981] text-white'
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <span className={isActive(item.href) ? 'text-white' : 'text-[#86868b]'}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="text-[14px] font-medium">
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#d2d2d7]/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#f5f5f7]">
            <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
            <div>
              <p className="text-[11px] text-[#86868b]">System Status</p>
              <p className="text-[13px] font-medium text-[#1d1d1f]">Operational</p>
            </div>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
          <div className="w-2.5 h-2.5 bg-[#10B981] rounded-full"></div>
        </div>
      )}
    </div>
  );
}
