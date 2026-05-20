import { PageSkeleton } from "@/shared/ux/skeleton";

export default function MainLoading() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <PageSkeleton />
    </div>
  );
}
