'use client';

import * as React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, getDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { addDays, startOfDay } from 'date-fns';
import { availableDaysOptions } from '@/lib/constants';

// --- IMPORT LOCALE DATA ---
import { useLocale, useTranslations } from 'next-intl';
import { zhCN, enUS } from 'date-fns/locale';

interface DatePickerProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  className?: string;
  availableDays?: string[];
}

export function DatePicker({
  selected,
  onSelect,
  className = '',
  availableDays,
}: DatePickerProps) {
  const t = useTranslations('Teachers.TeacherProfile.calendar');
  const locale = useLocale();

  // Map next-intl locale string to date-fns locale object
  const dateLocale = locale === 'zh' ? zhCN : enUS;

  const [open, setOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    selected,
  );

  const today = startOfDay(new Date());
  const from = addDays(today, 7);
  const to = addDays(from, 60);

  return (
    <div className={cn('flex flex-col gap-2 w-full max-w-sm', className)}>
      <Label htmlFor="date-picker" className="text-sm text-gray-500">
        {t('label')}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker"
            className={cn(
              'w-full justify-between text-left font-normal border border-gray-300 rounded-xl px-4 py-2 shadow-sm transition-all',
              !internalDate && 'text-muted-foreground',
            )}
          >
            {/* Localized Date String */}
            {internalDate
              ? format(internalDate, 'PPP', { locale: dateLocale })
              : t('placeholder')}
            <ChevronDownIcon className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto p-2 rounded-xl shadow-lg border border-gray-300 bg-white dark:bg-zinc-900"
        >
          <Calendar
            mode="single"
            // --- PASS LOCALE TO CALENDAR ---
            locale={dateLocale}
            selected={internalDate}
            onSelect={(date) => {
              setInternalDate(date);
              onSelect?.(date);
              setOpen(false);
            }}
            disabled={(date) => {
              const isOutsideRange = date < from || date > to;
              const dayShort = availableDaysOptions[getDay(date)];
              const isUnavailable = !availableDays?.includes(dayShort);
              return isOutsideRange || isUnavailable;
            }}
            weekStartsOn={0}
            defaultMonth={from}
            captionLayout="dropdown"
            numberOfMonths={1}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
