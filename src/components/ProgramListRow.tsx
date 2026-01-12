// components/ProgramListRow.tsx
'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface SyllabusItem {
  title: string;
  poses: string;
}

interface Program {
  id: string;
  title: string;
  suitableFor: string;
  description: string;
  syllabus: (string | SyllabusItem)[];
  duration: string;
}

interface ProgramListRowProps {
  program: Program;
  price: string | number;
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
  return (
    <div className="py-8">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-start text-left group"
      >
        <div className="pr-4">
          <h2 className="text-xl font-medium text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight">
            {program.title}
          </h2>
          <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mt-2">
            {program.suitableFor}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            {program.duration} — Led by{' '}
            <span className="text-gray-600 font-medium">{instructor}</span>
          </p>
        </div>
        <div className="flex-shrink-0 text-gray-300 group-hover:text-emerald-500 transition-colors mt-1">
          {isOpen ? (
            <Minus className="h-6 w-6" />
          ) : (
            <Plus className="h-6 w-6" />
          )}
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[800px] opacity-100 mt-6' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-6">
          <p className="text-gray-600 leading-relaxed italic border-l-2 border-emerald-500 pl-4">
            &quot;{program.description}&quot;
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
              Curriculum Outline
            </p>
            <ul className="space-y-4">
              {program.syllabus.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-gray-700"
                >
                  <span className="text-emerald-500 font-bold tabular-nums">
                    {i + 1}.
                  </span>
                  <div>
                    {typeof step === 'string' ? (
                      <p className="font-medium">{step}</p>
                    ) : (
                      <>
                        <p className="font-medium">{step.title}</p>
                        <p className="text-xs text-gray-400 italic mt-0.5 leading-relaxed">
                          Includes: {step.poses}
                        </p>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Price and Button Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
                Program Investment
              </p>
              <p className="text-2xl font-bold text-gray-900">{price}฿</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBook();
              }}
              className="inline-flex items-center justify-center bg-emerald-600 text-white px-10 py-4 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-md shadow-emerald-100"
            >
              {instructor.toLowerCase().includes('or')
                ? 'Choose Instructor'
                : `Book with ${instructor.split(' ')[0]}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
