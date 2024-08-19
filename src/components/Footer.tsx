import { Button } from '@/components/ui/button';

type TableActionsProps = {
  hasChanges: boolean;
  onUpdateDB?: () => void;
  onResetTimeslots: (day: string) => void;
};

export default function Footer({
  hasChanges,
  onUpdateDB,
  onResetTimeslots,
}: TableActionsProps) {
  return (
    <div className="w-full bg-accent fixed bottom-0 left-0 right-0 grid place-items-center">
      <div className="max-w-[500px] w-full pb-4 pt-4 px-8 flex items-center justify-between">
        <Button
          className="w-24"
          variant="destructive"
          onClick={() => onResetTimeslots('2024-08-26T00:00:00Z')}
        >
          Reset day
        </Button>
        {hasChanges && (
          <span className="text-xs text-ring">Changes detected!</span>
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
