import { getTodayIsoDate, shortenString } from '@/lib/utils';
import ChevronLeft from '@/assets/chevron-left.svg';
import ChevronRight from '@/assets/chevron-right.svg';
import colors from 'tailwindcss/colors';
import {
  DEFAULT_TITLE,
  InfoDialog,
  InfoDialogProps,
} from '@/components/InfoDialog';

type TableHeadProps = {
  // date in Iso format
  day: string;
  onPrevClick: () => void;
  onNextClick: () => void;
  onUpdate: () => void;
  isFirstDay?: boolean;
  isLastDay?: boolean;
} & InfoDialogProps;

function TableHead({
  day,
  onPrevClick,
  onNextClick,
  title,
  description,
  onUpdate,
  isFirstDay,
  isLastDay,
}: TableHeadProps) {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
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

  const isDefaultTitle = title === DEFAULT_TITLE || !title || title === dayName;

  const shortenedTitle = shortenString(title ?? '');

  return (
    <div
      className={`${isToday && 'bg-accent'} flex justify-between items-center px-4`}
    >
      <button
        onClick={onPrevClick}
        className="grid place-items-center w-14 h-14"
      >
        {!isFirstDay && (
          <ChevronLeft
            width={28}
            height={28}
            style={{ fill: colors.white, outline: 'none' }}
          />
        )}
      </button>
      <div className="relative flex items-center">
        <div className="flex flex-col justify-center items-center p-2">
          <h1 className="text-xl text-center truncate">
            {isDefaultTitle ? `${dayName}` : `${shortenedTitle}`}
          </h1>
          <h2 className="text-center">{`${isDefaultTitle ? '' : `${dayName.slice(0, 3)}`} ${dayNumber}. ${month} ${year}`}</h2>
        </div>
        <div className="absolute inset-0 flex justify-center items-center ml-[148px]">
          <InfoDialog
            title={title}
            description={description}
            day={day}
            dayName={dayName}
            onUpdate={onUpdate}
          />
        </div>
      </div>
      <button
        onClick={onNextClick}
        className="grid place-items-center w-14 h-14"
      >
        {!isLastDay && (
          <ChevronRight
            width={28}
            height={28}
            style={{ fill: colors.white, outline: 'none' }}
          />
        )}
      </button>
    </div>
  );
}

export default TableHead;
