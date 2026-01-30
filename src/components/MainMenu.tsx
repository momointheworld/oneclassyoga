'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
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
import Image from 'next/image';

export default function MainMenu() {
  const t = useTranslations('Home.Nav');
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [progress, setProgress] = useState(0);

  // Helper to get the path without the locale prefix
  const getRelativePath = (path: string) => {
    if (!path) return '';
    const segments = path.split('/');
    // If the first segment is the current locale, remove it
    if (segments[1] === locale) {
      const relative = '/' + segments.slice(2).join('/');
      return relative === '//' ? '/' : relative; // Fix for home page
    }
    return path;
  };

  const relativePathname = getRelativePath(pathname);

  const links = [
    { label: t('home'), href: '/' },
    { label: t('programs'), href: '/programs' },
    { label: t('teachers'), href: '/teachers' },
    { label: t('about'), href: '/about' },
    { label: t('contact'), href: '/contact' },
    { label: t('community'), href: '/community' },
  ];

  const isActiveLink = (href: string) => {
    if (href === '/') return relativePathname === '/';
    return relativePathname === href || relativePathname.startsWith(href);
  };

  const handleNavigate = (href: string) => {
    const localizedHref = `/${locale}${href === '/' ? '' : href}`;
    startTransition(() => {
      router.push(localizedHref);
    });
  };

  // --- REMOVED THE NAKED LINKS.MAP FROM HERE ---

  return (
    <div className="w-full shadow-sm bg-white z-50 relative">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-lg font-semibold">
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <Image
              src="/images/oneclass-logo.svg"
              alt="Logo"
              width={50}
              height={50}
            />
            <span className="inline text-lg font-semibold">OneClass Yoga</span>
          </Link>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-6">
          {links.map(({ label, href }) => {
            const finalHref = `/${locale}${href === '/' ? '' : href}`;
            const active = isActiveLink(href);

            return (
              <Link
                key={href}
                href={finalHref}
                onClick={(e) => {
                  if (active) return;
                  e.preventDefault();
                  handleNavigate(href);
                }}
                className={clsx(
                  'text-md font-medium transition-all duration-200 relative py-2 px-1',
                  active
                    ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                    : 'text-gray-800 hover:text-emerald-500',
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Menubar className="border-none bg-transparent shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="p-2 cursor-pointer">
                <Menu className="w-6 h-6" />
              </MenubarTrigger>

              <MenubarContent className="bg-white w-screen left-0 mt-3 p-4 space-y-2 border-t border-gray-100">
                {links.map(({ label, href }) => (
                  <MenubarItem
                    key={href}
                    className="focus:outline-none focus:ring-0 p-0"
                  >
                    <button
                      onClick={() => handleNavigate(href)}
                      className={clsx(
                        'w-full px-6 py-4 text-left text-lg font-medium rounded-xl transition-colors',
                        isActiveLink(href)
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'hover:bg-gray-50 text-gray-700',
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

      {isPending && (
        <div className="h-0.5 bg-emerald-500 absolute top-full left-0 w-full animate-pulse z-50" />
      )}
    </div>
  );
}
