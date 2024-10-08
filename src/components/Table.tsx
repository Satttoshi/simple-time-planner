import PlusIcon from '@/assets/plus-circle.svg';
import colors from 'tailwindcss/colors';
import { Fragment } from 'react';
import { PersonData, Status } from '@/types';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'init':
      return 'bg-accent';
    case 'notReady':
      return 'bg-red-600';
    case 'ready':
      return 'bg-green-600';
    case 'uncertain':
      return 'bg-yellow-500';
    default:
      return '';
  }
}

const baseCellStyle = 'border rounded-md grid place-items-center h-20';

type TableProps = {
  day: string;
  onInsertRow: (
    persons: PersonData[],
    timeArray: string[],
    isAbove: boolean,
    day: string,
  ) => void;
  onTimeSlotClick: (
    persons: PersonData[],
    personIndex: number,
    timeSlotIndex: number,
    day: string,
  ) => void;
  persons: PersonData[];
  selectedDayDate: string;
};

export default function Table({
  day,
  onInsertRow,
  onTimeSlotClick,
  persons,
  selectedDayDate,
}: TableProps) {
  if (!persons[0].timeSlot) return; // should never happen, for TS only

  const timeArray = persons[0].timeSlot.map((time) => time.time);

  return (
    <>
      <section className="p-3 flex flex-col pb-[84px]">
        {/* Row 1 - Header with Person Names */}
        <div className="mb-1 grid grid-cols-6 gap-1">
          <button
            onClick={() =>
              onInsertRow(persons, timeArray, true, selectedDayDate)
            }
            className={`${baseCellStyle}`}
          >
            <PlusIcon
              width={28}
              height={28}
              style={{ fill: colors.white, outline: 'none' }}
            />
          </button>
          {persons.map((person, i) => (
            <div key={i + '-name'} className={`${baseCellStyle}`}>
              {person.name}
            </div>
          ))}
        </div>

        {/* Row 2...n Time Slots */}
        <div
          className={`grid h-[calc(100vh-246px)] w-[calc(100%+7px)] grid-cols-6 grid-rows-${timeArray.length} gap-1 auto-rows-max justify-start content-star overflow-y-scroll scrollbar-custom`}
        >
          {timeArray.map((time, i) => (
            <Fragment key={i + '-fragment'}>
              <div className={`${baseCellStyle}`}>{time}</div>
              {persons.map((person, j) => (
                <div
                  onClick={() => onTimeSlotClick(persons, j, i, day)}
                  key={j + '-timeslot-' + i}
                  className={`${baseCellStyle} ${getStatusColor(person.timeSlot?.[i].status ?? 'init')} border-background`}
                ></div>
              ))}
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
}
