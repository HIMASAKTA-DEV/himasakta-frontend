import Skeleton from "@/components/Skeleton";

export default function () {
  return (
    <ul className="mt-2 space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <li key={i}>
          <Skeleton className="h-4 w-4/5" />
        </li>
      ))}
    </ul>
  );
}
