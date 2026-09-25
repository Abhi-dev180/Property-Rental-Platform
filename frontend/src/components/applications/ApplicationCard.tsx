"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { ApplicationWithProperty } from "@/lib/api";
import { StatusBadge } from "@/components/ui/StatusBadge";

function firstImage(images: unknown): string | null {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") {
    return images[0];
  }
  return null;
}

export function ApplicationCard({
  application,
  hrefPrefix = "/applications",
  showApplicant = false,
}: {
  application: ApplicationWithProperty;
  hrefPrefix?: string;
  showApplicant?: boolean;
}) {
  const img = firstImage(application.properties?.images);

  return (
    <Link
      href={`${hrefPrefix}/${application.id}`}
      className="group flex gap-4 rounded-[10px] border border-slate-200 bg-white p-3 transition hover:border-[#2455eb]/50 hover:shadow-md"
    >
      <div className="h-24 w-32 shrink-0 overflow-hidden rounded-[6px] bg-slate-100">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate font-medium text-[#0b1220] group-hover:text-[#2455eb]">
              {application.properties?.title ?? "Property"}
            </h3>
            <StatusBadge status={application.status} />
          </div>
          {application.properties?.city && (
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5" />
              {application.properties.city}
            </p>
          )}
          {showApplicant && application.users && (
            <p className="mt-1 text-sm text-slate-600">
              {application.users.full_name ?? application.users.email}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>Move-in: {new Date(application.desired_move_in_date).toLocaleDateString()}</span>
          <span>·</span>
          <span>{application.lease_duration_months} mo lease</span>
          <span>·</span>
          <span>Applied {new Date(application.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
}