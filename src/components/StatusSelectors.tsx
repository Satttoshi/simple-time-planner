import { useState } from 'react';
import { Status } from '@/types';

type StatusSelectorsProps = {
  onStatusSelection?: (status: Status) => void;
};

const StatusSelectors = ({ onStatusSelection }: StatusSelectorsProps) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>('init');

  const handleStatusClick = (status: Status) => {
    // If clicking the already selected button, reset to 'init'
    const newStatus = status === selectedStatus ? 'init' : status;
    setSelectedStatus(newStatus);
    onStatusSelection?.(newStatus);
  };

  const getButtonStyles = (status: Status) => {
    const baseStyles =
      'flex-1 border rounded-md grid place-items-center h-12 transition-colors cursor-pointer';
    const selectedStyles =
      selectedStatus === status
        ? 'border-2 border-white ring-2 ring-white/20'
        : '';

    const styles = {
      ready: 'bg-green-600 hover:bg-green-700 text-white',
      notReady: 'bg-red-600 hover:bg-red-700 text-white',
      uncertain: 'bg-yellow-500 hover:bg-yellow-600 text-black',
      init: '', // included for type safety but not used in UI
    }[status];

    return `${baseStyles} ${styles} ${selectedStyles}`;
  };

  return (
    <div className="flex gap-8 max-w-[500px] w-full py-4 px-8">
      <button
        onClick={() => handleStatusClick('ready')}
        className={getButtonStyles('ready')}
      >
        Ready
      </button>
      <button
        onClick={() => handleStatusClick('notReady')}
        className={getButtonStyles('notReady')}
      >
        Not Ready
      </button>
      <button
        onClick={() => handleStatusClick('uncertain')}
        className={getButtonStyles('uncertain')}
      >
        Uncertain
      </button>
    </div>
  );
};

export default StatusSelectors;
