import Button from './Button';

type TableActionsProps = {
  onUpdateDB: () => void;
  onResetTimeslots: () => void;
};

export default function TableActions({
  onUpdateDB,
  onResetTimeslots,
}: TableActionsProps) {
  return (
    <div>
      <Button variant="text" onClick={onUpdateDB} text="UPDATE DB" />
      <Button variant="outlined" onClick={onUpdateDB} text="UPDATE DB" />
      <Button
        variant="contained"
        onClick={onResetTimeslots}
        text="RESET TIMESLOTS"
      />
    </div>
  );
}
