'use client';
import { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from '@/components/ui/menubar';
import { Menu } from 'lucide-react';

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
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);

  const handleNavigate = (href: string) => {
    startTransition(() => {
      router.push(href);
    });
  };

  // Smooth "NProgress-style" animation
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const step = () => {
      setProgress((prev) => {
        if (!isPending) return prev; // stop if not pending
        // Move faster at start, slower near 90%
        const diff = 90 - prev;
        const increment = Math.max(0.5, diff * 0.1);
        return Math.min(prev + increment, 90);
      });
      timer = setTimeout(step, 100);
    };

    if (isPending) step();
    else if (progress > 0) {
      setProgress(100);
      const finishTimeout = setTimeout(() => setProgress(0), 300);
      return () => clearTimeout(finishTimeout);
    }

    return () => clearTimeout(timer);
  }, [isPending, progress]);

  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="w-full shadow-sm bg-white z-50 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">OneClass Yoga in Chiang Mai</div>

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

      {progress > 0 && (
        <div
          className="h-1 bg-emerald-500 absolute top-full left-0 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}
