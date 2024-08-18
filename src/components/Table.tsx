'use client';

import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/hooks/useStore';
import { Fragment, useState } from 'react';
import { Status, TimeSlot } from '@/types';
import PlusIcon from '@/assets/plus-circle.svg';
import colors from 'tailwindcss/colors';
import TableHead from '@/components/TableHead';
import TableActions from '@/components/TableActions';

const baseCellStyle = 'border rounded-md grid place-items-center';

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

export default function Table() {
  const { toast } = useToast();

  const [hasChanges, setHasChanges] = useState(false);

  const persons = useStore((state) => state.persons);
  const setPerson = useStore((state) => state.setPerson);
  const setPersons = useStore((state) => state.setPersons);
  const loadPersons = useStore((state) => state.loadPersons);

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
    setHasChanges(true);
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

    setHasChanges(true);
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
    setHasChanges(true);
    setPersons(newPersons);
  }

  function handleUpdateDB() {
    setHasChanges(false);
    loadPersons();
    toast({
      title: 'Update Successful',
      description: 'Smu die Kuh',
      duration: 3000,
    });
  }

  return (
    <div>
      <TableHead />
      <div
        className="bg-background p-2"
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
                  className={`${baseCellStyle} ${getStatusColor(person.timeSlot[i].status)} border-background`}
                ></div>
              ))}
            </Fragment>
          ))}
        </section>
      </div>
      <TableActions
        onUpdateDB={handleUpdateDB}
        onResetTimeslots={handleResetTimeslots}
        hasChanges={hasChanges}
      />
    </div>
  );
}
