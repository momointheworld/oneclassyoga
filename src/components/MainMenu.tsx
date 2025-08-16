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
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { label: 'Home', href: '/' },
  { label: 'Teachers', href: '/teachers' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Community', href: '/community' },
];

export default function MainMenu() {
  const pathname = usePathname();

  return (
    <div className="w-full shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-semibold">
          One Class Yoga in Chiang Mai
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-6">
          {links.map(({ label, href }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'text-md font-medium hover:underline',
                  isActive && 'text-emerald-600'
                )}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu (dropdown) */}
        <div className="md:hidden">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="p-2">
                <Menu className="w-5 h-5" />
              </MenubarTrigger>

              <MenubarContent className="bg-white w-screen left-0">
                {links.map(({ label, href }) => {
                  const isActive =
                    href === '/' ? pathname === '/' : pathname.startsWith(href);

                  return (
                    <MenubarItem key={href} asChild>
                      <Link
                        href={href}
                        className={clsx(
                          'w-full px-4 py-2 text-left',
                          isActive && 'text-emerald-600 font-medium'
                        )}
                      >
                        {label}
                      </Link>
                    </MenubarItem>
                  );
                })}
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </div>
  );
}
