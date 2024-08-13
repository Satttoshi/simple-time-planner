'use client';

import { useStore } from '@/hooks/useStore';
import { Fragment } from 'react';
import { Status } from '@/types';

const baseCellStyle = 'border rounded-md grid place-items-center';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'notReady':
      return 'bg-red-600'; // Tailwind class for red color
    case 'ready':
      return 'bg-green-600'; // Tailwind class for green color
    case 'uncertain':
      return 'bg-yellow-500'; // Tailwind class for yellow color
    default:
      return ''; // Return an empty string or handle the default case
  }
}

export default function Table() {
  const persons = useStore((state) => state.persons);

  console.log(persons);

  return (
    <div>
      <TableHead />
      <div
        className="bg-indigo-950 p-2"
        style={{ width: '100vw', height: '70vh' }}
      >
        <section className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
          {/* Row 1 */}
          <div className={`${baseCellStyle}`}></div>
          <div className={`${baseCellStyle}`}>18:00</div>
          <div className={`${baseCellStyle}`}>19:00</div>
          <div className={`${baseCellStyle}`}>20:00</div>
          <div className={`${baseCellStyle}`}>21:00</div>
          <div className={`${baseCellStyle}`}>22:00</div>

          {persons.map((person, i) => {
            return (
              <Fragment key={i}>
                <div className={`${baseCellStyle}`}>{person.name}</div>
                {person.timeSlot.map((timeSlot, j) => {
                  return (
                    <div
                      key={j}
                      className={`${baseCellStyle} ${getStatusColor(timeSlot.status)}`}
                    ></div>
                  );
                })}
              </Fragment>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function TableHead() {
  return (
    <div className="flex-col justify-center items-center">
      <h1 className="text-2xl text-center">August 2024 KW 55</h1>
      <h2 className="text-center">Montag 18</h2>
    </div>
  );
}
