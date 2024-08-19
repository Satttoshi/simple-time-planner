'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/hooks/useStore';
import { useState } from 'react';
import { Status, TimeSlot } from '@/types';
import TableHead from '@/components/TableHead';
import Footer from '@/components/Footer';
import Table from '@/components/Table';

export default function AppContent() {
  const { toast } = useToast();

  const [hasChanges, setHasChanges] = useState(false);

  const persons = useStore((state) => state.persons);
  const setPerson = useStore((state) => state.setPerson);
  const setPersons = useStore((state) => state.setPersons);
  const loadPersons = useStore((state) => state.loadPersons);

  const weeks = useStore((state) => state.weeks);

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
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        style={{ width: '100%', height: '100%' }}
      >
        {weeks.map((week) =>
          week.days.map((day) => (
            <SwiperSlide key={day.date + '_table'}>
              <TableHead day={day.date} />
              <Table
                timeArray={timeArray}
                persons={persons}
                onInsertRow={handleInsertRow}
                onTimeSlotClick={handleTimeSlotClick}
              />
            </SwiperSlide>
          )),
        )}
      </Swiper>
      <Footer
        onUpdateDB={handleUpdateDB}
        onResetTimeslots={handleResetTimeslots}
        hasChanges={hasChanges}
      />
    </>
  );
}
