import { getTodayIsoDate } from '@/lib/utils';
import ChevronLeft from '@/assets/chevron-left.svg';
import ChevronRight from '@/assets/chevron-right.svg';
import colors from 'tailwindcss/colors';

type TableHeadProps = {
  // date in Iso format
  day: string;
  onPrevClick: () => void;
  onNextClick: () => void;
};

function TableHead({ day, onPrevClick, onNextClick }: TableHeadProps) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const date = new Date(day);

  if (isNaN(date.getTime())) {
    console.error('Invalid date format provided:', day);
    return (
      <div className="flex-col justify-center items-center p-2">
        <h1 className="text-2xl text-center">Invalid Date</h1>
      </div>
    );
  }

  const month = monthNames[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const dayName = dayNames[date.getUTCDay()];
  const dayNumber = date.getUTCDate();

  const isToday = day === getTodayIsoDate();

  return (
    <div
      className={`${isToday && 'bg-accent'} flex justify-between items-center px-4`}
    >
      <button
        onClick={onPrevClick}
        className="grid place-items-center w-14 h-14"
      >
        <ChevronLeft
          width={28}
          height={28}
          style={{ fill: colors.white, outline: 'none' }}
        />
      </button>
      <div className="flex-col justify-center items-center p-2">
        <h1 className="text-xl text-center">{`${dayName}`}</h1>
        <h2 className="text-center">{`${dayNumber}. ${month} ${year}`}</h2>
      </div>
      <button
        onClick={onNextClick}
        className="grid place-items-center w-14 h-14"
      >
        <ChevronRight
          width={28}
          height={28}
          style={{ fill: colors.white, outline: 'none' }}
        />
      </button>
    </div>
  );
}

export default TableHead;
