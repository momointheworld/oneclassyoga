'use client';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Teachers', href: '/teachers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Community', href: '/community' },
];

export default function MainMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNavigate = (href: string) => {
    setIsNavigating(true);
    setProgress(10);
    router.push(href);
  };

  // Animate progress while navigating
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isNavigating && progress < 90) {
      timer = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 10, 90));
      }, 200);
    }
    return () => clearInterval(timer);
  }, [isNavigating, progress]);

  // Finish navigation
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timeout = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isNavigating, pathname]);

  // Check if link or its subpaths are active
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="w-full shadow-sm bg-white z-50 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">OneClass Yoga in Chiang Mai</div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(href);
              }}
              className={clsx(
                'text-md font-medium hover:underline transition-colors duration-150',
                isActiveLink(href) && 'text-emerald-600'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="p-2">
                <Menu className="w-5 h-5" />
              </MenubarTrigger>

              <MenubarContent className="bg-white w-screen left-0">
                {links.map(({ label, href }) => (
                  <MenubarItem
                    key={href}
                    className="focus:outline-none focus:ring-0"
                  >
                    <button
                      onClick={() => handleNavigate(href)}
                      className={clsx(
                        'w-full px-4 py-2 text-left text-md font-medium hover:bg-gray-100 transition-colors',
                        isActiveLink(href) && 'text-emerald-600'
                      )}
                    >
                      {label}
                    </button>
                  </MenubarItem>
                ))}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>

      {/* Smooth progress bar */}
      {isNavigating && (
        <div
          className="h-1 bg-emerald-500 absolute top-full left-0 transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}
