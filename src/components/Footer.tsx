import { Button } from '@/components/ui/button';
import { useStore } from '@/hooks/useStore';

type TableActionsProps = {
  hasChanges: boolean;
  onUpdateDB?: () => void;
  onResetTimeslots?: (day: string) => void;
};

export default function Footer({
  hasChanges,
  onUpdateDB,
  onResetTimeslots,
}: TableActionsProps) {
  const selectedDayDate = useStore((state) => state.selectedDayDate);

  return (
    <div className="z-50 w-full bg-accent fixed bottom-0 left-0 right-0 grid place-items-center">
      <div className="max-w-[500px] w-full pb-4 pt-4 px-8 flex items-center justify-between">
        <Button
          className="w-24"
          variant="destructive"
          onClick={() =>
            onResetTimeslots
              ? onResetTimeslots(selectedDayDate)
              : console.log('No reset function provided!')
          }
        >
          Reset day
        </Button>
        {hasChanges && (
          <span className="text-xs text-ring">changes detected!</span>
        )}
        <Button
          className="w-24 font-bold"
          variant="default"
          onClick={onUpdateDB}
          disabled={!hasChanges}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
