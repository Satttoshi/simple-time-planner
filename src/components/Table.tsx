'use client';

import { useStore } from '@/hooks/useStore';
import { Fragment } from 'react';
import { Status, TimeSlot } from '@/types';
import PlusIcon from '@/assets/plus-circle.svg';
import colors from 'tailwindcss/colors';
import TableHead from '@/components/TableHead';
import { toast } from 'react-toastify';

const baseCellStyle = 'border rounded-md grid place-items-center';

export function getStatusColor(status: Status): string {
  switch (status) {
    case 'init':
      return 'bg-gray-600';
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

export default function Table() {
  const persons = useStore((state) => state.persons);
  const setPerson = useStore((state) => state.setPerson);
  const setPersons = useStore((state) => state.setPersons);
  const loadPersons = useStore((state) => state.loadPersons);

  console.log('Table mounted');

  const timeArray = persons[0].timeSlot.map((time) => time.time);

  function handleTimeSlotClick(personIndex: number, timeSlotIndex: number) {
    const newPersons = [...persons];
    const currentStatus =
      newPersons[personIndex].timeSlot[timeSlotIndex].status;

    let nextStatus: Status;
    switch (currentStatus) {
      case 'notReady':
        nextStatus = 'ready';
        break;
      case 'ready':
        nextStatus = 'uncertain';
        break;
      case 'uncertain':
        nextStatus = 'init';
        break;
      case 'init':
        nextStatus = 'notReady';
        break;
      default:
        nextStatus = 'notReady';
        break;
    }

    newPersons[personIndex].timeSlot[timeSlotIndex].status = nextStatus;
    setPerson(newPersons[personIndex]);
  }

  function handleInsertRow(isAbove: boolean) {
    const newPersons = [...persons];

    const currentTime = isAbove
      ? timeArray[0]
      : timeArray[timeArray.length - 1];
    const splitTime = currentTime.split(':');
    const newHour = isAbove
      ? parseInt(splitTime[0]) - 1
      : parseInt(splitTime[0]) + 1;
    const newTime = `${newHour}:00`;

    if (isAbove && newTime === '0:00') {
      return;
    }

    if (!isAbove && newTime === '24:00') {
      return;
    }

    if (isAbove) {
      newPersons.forEach((person) => {
        person.timeSlot.unshift({ time: newTime, status: 'init' });
      });
    } else {
      newPersons.forEach((person) => {
        person.timeSlot.push({ time: newTime, status: 'init' });
      });
    }

    setPersons(newPersons);
  }

  function handleResetTimeslots() {
    const newPersons = [...persons];
    newPersons.forEach((person) => {
      person.timeSlot = person.timeSlot.map((timeSlot: TimeSlot) => ({
        ...timeSlot,
        status: 'init',
      }));
      person.timeSlot = person.timeSlot.filter(
        (timeSlot) =>
          timeSlot.time === '19:00' ||
          timeSlot.time === '20:00' ||
          timeSlot.time === '21:00' ||
          timeSlot.time === '22:00' ||
          timeSlot.time === '23:00',
      );
    });
    setPersons(newPersons);
  }

  function handleUpdateDB() {
    loadPersons();
    toast('DB Updated');
  }

  console.log('remounted persons', persons);

  return (
    <div>
      <TableHead />
      <div
        className="bg-indigo-950 p-2"
        style={{ width: '100vw', height: '70vh' }}
      >
        <section
          className={`grid grid-cols-6 grid-rows-${timeArray.length + 1} gap-1 h-full`}
        >
          {/* Row 1 - Header with Person Names */}
          <button
            onClick={() => handleInsertRow(true)}
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

          {/* Row 2...n Time Slots */}
          {timeArray.map((time, i) => (
            <Fragment key={i + '-fragment'}>
              <div className={`${baseCellStyle}`}>{time}</div>
              {persons.map((person, j) => (
                <div
                  onClick={() => handleTimeSlotClick(j, i)}
                  key={j + '-timeslot-' + i}
                  className={`${baseCellStyle} ${getStatusColor(person.timeSlot[i].status)} border-indigo-950`}
                ></div>
              ))}
            </Fragment>
          ))}
        </section>
      </div>
      <button
        className="bg-blue-600 text-white p-2 rounded-md"
        onClick={handleUpdateDB}
      >
        UPDATE DB
      </button>
      <button
        className="bg-blue-600 text-white p-2 rounded-md"
        onClick={handleResetTimeslots}
      >
        RESET TIMESLOTS
      </button>
    </div>
  );
}
