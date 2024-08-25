'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useToast } from '@/components/ui/use-toast';
import { useStore } from '@/hooks/useStore';
import { useRef, useState } from 'react';
import TableHead from '@/components/TableHead';
import Footer from '@/components/Footer';
import Table from '@/components/Table';
import { PersonData, Status, TimeSlot } from '@/types';
import type { Swiper as SwiperType } from 'swiper/types';
import {
  findDayDateByIndex,
  findDayIndexByDate,
  getTodayIsoDate,
} from '@/lib/utils';

export default function AppContent() {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  // Reference for Swiper instance
  const swiperRef = useRef<SwiperType | null>(null);

  const updateWeeksInDB = useStore((state) => state.updateWeeksInDB);
  const weeks = useStore((state) => state.weeks);
  const setPersonsInDay = useStore((state) => state.setPersonsInDay);
  const getDayFromWeeks = useStore((state) => state.getDayFromWeeks);
  const selectedDayDate = useStore((state) => state.selectedDayDate);
  const setSelectedDayDate = useStore((state) => state.setSelectedDayDate);

  const initialSwiperIndex = findDayIndexByDate(weeks, getTodayIsoDate());

  function handleTimeSlotClick(
    persons: PersonData[],
    personIndex: number,
    timeSlotIndex: number,
    day: string,
  ) {
    const newPersons = [...persons];

    if (!newPersons[personIndex].timeSlot) return; // should never happen, for TS only

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

    setPersonsInDay(newPersons, day);
  }

  function handleInsertRow(
    persons: PersonData[],
    timeArray: string[],
    isAbove: boolean,
    day: string,
  ) {
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
        person.timeSlot?.unshift({ time: newTime, status: 'init' });
      });
    } else {
      newPersons.forEach((person) => {
        person.timeSlot?.push({ time: newTime, status: 'init' });
      });
    }

    setHasChanges(true);
    setPersonsInDay(newPersons, day);
  }

  function handleResetTimeslots(day: string) {
    console.log('Resetting timeslots for day:', day);
    const selectedDay = getDayFromWeeks(day);
    if (!selectedDay) {
      console.error('Day not found');
      return;
    }
    const persons = selectedDay.persons;
    const newPersons = [...persons];
    newPersons.forEach((person) => {
      person.timeSlot = person.timeSlot?.map((timeSlot: TimeSlot) => ({
        ...timeSlot,
        status: 'init',
      }));
      delete person.timeSlot;
      person.timeSlot = [
        { time: '19:00', status: 'init' },
        { time: '20:00', status: 'init' },
        { time: '21:00', status: 'init' },
        { time: '22:00', status: 'init' },
        { time: '23:00', status: 'init' },
      ];
    });
    setHasChanges(true);
    setPersonsInDay(newPersons, day);
  }

  function handleUpdateDB() {
    setHasChanges(false);
    updateWeeksInDB();
    toast({
      title: 'Update Successful',
      description: 'Smu die Kuh',
      duration: 3000,
    });
  }

  function handleSlideChange(swiper: SwiperType) {
    setSelectedDayDate(findDayDateByIndex(weeks, swiper.activeIndex));
  }

  function handleOnPrevClick() {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  }

  function handleOnNextClick() {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  }

  return (
    <>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={0}
        slidesPerView={1}
        style={{ width: '100%', height: '100%' }}
        onSlideChange={handleSlideChange}
        onAfterInit={(swiper: SwiperType) => swiper.slideTo(initialSwiperIndex)}
      >
        {weeks.map((week) =>
          week.days.map((day) => (
            <SwiperSlide key={day.date + '_table'}>
              <TableHead
                onPrevClick={handleOnPrevClick}
                onNextClick={handleOnNextClick}
                day={day.date}
              />
              <Table
                day={day.date}
                persons={day.persons}
                onInsertRow={handleInsertRow}
                onTimeSlotClick={handleTimeSlotClick}
                selectedDayDate={selectedDayDate}
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
