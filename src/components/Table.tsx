'use client';

import { useStore } from '@/hooks/useStore';
import { Fragment } from 'react';
import { Status } from '@/types';

const baseCellStyle = 'border rounded-md grid place-items-center';

export function getStatusColor(status: Status): string {
  switch (status) {
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

  console.log(persons);

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
        nextStatus = 'notReady';
        break;
      default:
        nextStatus = 'notReady';
        break;
    }

    newPersons[personIndex].timeSlot[timeSlotIndex].status = nextStatus;
    setPerson(newPersons[personIndex]);
  }

  const timeArray = persons[0].timeSlot.map((time) => time.time);

  return (
    <div>
      <TableHead />
      <div
        className="bg-indigo-950 p-2"
        style={{ width: '100vw', height: '70vh' }}
      >
        <section className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
          {/* Row 1 - Header with Person Names */}
          <div className={`${baseCellStyle}`}></div>
          {persons.map((person, i) => (
            <div key={i} className={`${baseCellStyle}`}>
              {person.name}
            </div>
          ))}

          {/* Row 2...n Time Slots */}
          {timeArray.map((time, i) => (
            <Fragment key={i}>
              <div className={`${baseCellStyle}`}>{time}</div>
              {persons.map((person, j) => (
                <div
                  onClick={() => handleTimeSlotClick(j, i)}
                  key={j}
                  className={`${baseCellStyle} ${getStatusColor(person.timeSlot[i].status)} border-indigo-950`}
                ></div>
              ))}
            </Fragment>
          ))}
        </section>
      </div>
      <button
        className="bg-blue-600 text-white p-2 rounded-md"
        onClick={() => useStore.getState().loadPersons()}
      >
        UPDATE DB
      </button>
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
