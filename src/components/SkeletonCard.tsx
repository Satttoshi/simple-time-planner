import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonCard() {
  return (
    <div className="grid place-items-center pt-10">
      <div className="flex flex-col space-y-3">
        <h1 className="text-accent text-2xl">loading ...</h1>
        <div className="space-y-2 flex flex-col justify-center items-center">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-[70px]" />
          <Skeleton className="h-4 w-[70px]" />
        </div>
      </div>
    </div>
  );
}
