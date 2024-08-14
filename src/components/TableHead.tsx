import { useEffect, useState } from 'react';

function TableHead() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekNumber, setWeekNumber] = useState(0);

  useEffect(() => {
    // Set the current date
    setCurrentDate(new Date());

    // Calculate the week number
    const getWeekNumber = (date: Date) => {
      const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
      const pastDaysOfYear =
        (date.getTime() - firstDayOfYear.getTime()) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    };

    setWeekNumber(getWeekNumber(currentDate));
  }, []);

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

  const month = monthNames[currentDate.getMonth()];
  const dayName = dayNames[currentDate.getDay()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  return (
    <div className="flex-col justify-center items-center">
      <h1 className="text-2xl text-center">{`${month} ${year} W-${weekNumber}`}</h1>
      <h2 className="text-center">{`${dayName} ${day}`}</h2>
    </div>
  );
}

export default TableHead;
