'use client';

import { useTranslations } from 'next-intl';
import { Program, SyllabusItem } from '@/lib/packages';

interface ProgramListRowProps {
  program: Program;
  price: string;
  instructor: string;
  isOpen: boolean;
  onToggle: () => void;
  onBook: () => void;
}

export const ProgramListRow = ({
  program,
  price,
  instructor,
  isOpen,
  onToggle,
  onBook,
}: ProgramListRowProps) => {
  const t = useTranslations('Programs');
  const syllabus = t.raw(`list.${program.id}.syllabus`) as (
    | string
    | SyllabusItem
  )[];

  return (
    <div className="py-8 border-b border-gray-100 last:border-0">
      {/* Header Section */}
      <div
        className="flex justify-between items-start cursor-pointer group"
        onClick={onToggle}
      >
        <div className="space-y-1">
          <h2 className="text-xl text-gray-900">
            {t(`list.${program.id}.title`)}
          </h2>
          <p className="text-emerald-600 text-xs font-bold uppercase">
            {t(`list.${program.id}.suitableFor`)}
          </p>
          <p className="text-gray-400 text-sm">
            {t(`list.${program.id}.duration`)} — {t('UI.programsPage.ledBy')}{' '}
            <span className="font-semibold text-gray-600">{instructor}</span>
          </p>
        </div>
        <div className="text-gray-300 group-hover:text-emerald-500 transition-colors pt-2">
          {isOpen ? (
            <div className="w-6 h-0.5 bg-current rounded-full" /> // Minus sign
          ) : (
            <div className="text-2xl">+</div>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Quote Description */}
          <div className="relative pl-6 border-l-4 border-emerald-500">
            <p className="text-gray-600 italic text-lg leading-relaxed">
              &quot;{t(`list.${program.id}.description`)}&quot;
            </p>
          </div>

          {/* Curriculum Outline Card */}
          <div className="bg-gray-50/50 p-8 rounded-3xl space-y-6">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              {t('UI.programsPage.curriculumOutline')}
            </h4>
            <div className="space-y-3">
              {syllabus.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">{idx + 1}.</span>
                  <div className="">
                    <p className="text-gray-800 text-sm font-medium">
                      {typeof item === 'string' ? item : item.title}
                    </p>
                    {typeof item !== 'string' && item.poses && (
                      <p className="text-sm text-gray-500">{item.poses}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Investment & CTA */}
          <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                {t('UI.programsPage.investment')}
              </p>
              <p className="text-xl font-bold text-gray-900">
                {price}
                {t('UI.programsPage.priceSuffix')}
              </p>
            </div>
            <button
              onClick={onBook}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-emerald-100"
            >
              {t('UI.programsPage.bookWith', {
                name: instructor.split(' ')[0],
              })}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
