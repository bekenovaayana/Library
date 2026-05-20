"use client";

import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface BookCoverProps {
  title: string;
  coverUrl?: string | null;
  className?: string;
  sizes?: string;
}

export function BookCover({ title, coverUrl, className, sizes = "200px" }: BookCoverProps) {
  if (coverUrl) {
    return (
      <div className={cn("relative aspect-[2/3] overflow-hidden rounded-md bg-muted", className)}>
        <Image
          src={coverUrl}
          alt={`Cover of ${title}`}
          fill
          className="object-cover"
          sizes={sizes}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-[2/3] items-center justify-center rounded-md bg-muted text-muted-foreground",
        className,
      )}
    >
      <BookOpen className="h-10 w-10 opacity-50" aria-hidden />
    </div>
  );
}
