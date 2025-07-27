// components/BreadcrumbTrail.tsx
'use client';

import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbTrailProps = {
  items: Crumb[];
};

export function BreadcrumbTrail({ items }: BreadcrumbTrailProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className={undefined}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            <BreadcrumbItem className={undefined}>
              {item.href ? (
                <BreadcrumbLink asChild className={undefined}>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className={undefined}>
                  {item.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 && (
              <BreadcrumbSeparator className={'ml-2'}>
                {'>'}
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
