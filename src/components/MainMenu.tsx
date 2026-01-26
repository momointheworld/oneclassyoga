'use client';

import { useState, useTransition } from 'react';
import { useRouter, usePathname, useParams } from 'next/navigation'; // Standard Next.js hooks
import { useTranslations } from 'next-intl';
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
  const params = useParams();
  const locale = params.locale as string; // 'en' or 'zh'

  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [progress, setProgress] = useState(0);

  // 1. Helper to get the path without the locale prefix
  // Example: '/en/programs' -> '/programs'
  const getRelativePath = (path: string) => {
    if (!path) return '';
    const segments = path.split('/');
    // If the first segment is the current locale, remove it
    if (segments[1] === locale) {
      return '/' + segments.slice(2).join('/');
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

  // 2. Updated isActiveLink logic using the stripped path
  const isActiveLink = (href: string) => {
    if (href === '/') return relativePathname === '/';
    return relativePathname === href || relativePathname.startsWith(href);
  };

  const handleNavigate = (href: string) => {
    // Ensure we keep the locale prefix when navigating manually
    const localizedHref = `/${locale}${href === '/' ? '' : href}`;
    startTransition(() => {
      router.push(localizedHref);
    });
  };

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
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={`/${locale}${href === '/' ? '' : href}`}
              onClick={(e) => {
                if (isActiveLink(href)) return;
                e.preventDefault();
                handleNavigate(href);
              }}
              className={clsx(
                'text-md font-medium transition-all duration-200 relative py-2 px-1',
                isActiveLink(href)
                  ? 'text-emerald-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-emerald-600'
                  : 'text-gray-500 hover:text-emerald-500',
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile menu remains similarly updated with handleNavigate */}
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

      {progress > 0 && (
        <div
          className="h-1 bg-emerald-500 absolute top-full left-0 transition-all duration-100 ease-out z-50"
          style={{ width: `${progress}%` }}
        />
      )}
    </div>
  );
}
