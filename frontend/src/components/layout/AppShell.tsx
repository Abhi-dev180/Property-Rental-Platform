// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import type { ReactNode } from "react";
// import { Sidebar } from "./Sidebar";
// import { Logo } from "@/components/ui/Logo";

// interface AppShellUser {
//   full_name: string;
//   role: string;
//   profile_image_url: string | null;
// }

// export function AppShell({
//   user,
//   onLogout,
//   eyebrow,
//   title,
//   children,
// }: {
//   user: AppShellUser;
//   onLogout: () => void;
//   eyebrow?: string;
//   title?: string;
//   children: ReactNode;
// }) {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const initials = user.full_name
//     .split(" ")
//     .map((p) => p[0])
//     .filter(Boolean)
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <div className="min-h-screen bg-canvas">
//       <div className="mx-auto flex min-h-screen max-w-[1400px]">
//         <Sidebar role={user.role} onLogout={onLogout} />

//         {/* Mobile drawer */}
//         {mobileOpen && (
//           <div className="fixed inset-0 z-40 lg:hidden">
//             <button
//               aria-label="Close menu"
//               className="absolute inset-0 bg-ink/40"
//               onClick={() => setMobileOpen(false)}
//             />
//             <div className="absolute inset-y-0 left-0 w-[260px] bg-white shadow-2xl">
//               <Sidebar role={user.role} onLogout={onLogout} />
//             </div>
//           </div>
//         )}

//         <div className="flex min-w-0 flex-1 flex-col">
//           {/* Topbar */}
//           <header className="sticky top-0 z-30 border-b border-ink/8 bg-white/90 backdrop-blur">
//             <div className="flex items-center gap-4 px-4 py-3.5 sm:px-6">
//               <button
//                 className="rounded-[6px] p-1.5 text-ink lg:hidden"
//                 onClick={() => setMobileOpen(true)}
//                 aria-label="Open menu"
//               >
//                 <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
//                   <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
//                 </svg>
//               </button>
//               <div className="lg:hidden">
//                 <Logo href="/dashboard" size="sm" />
//               </div>

//               {(eyebrow || title) && (
//                 <div className="hidden min-w-0 lg:block">
//                   {eyebrow && <p className="text-xs font-medium text-gold">{eyebrow}</p>}
//                   {title && <p className="truncate text-[15px] font-semibold text-ink">{title}</p>}
//                 </div>
//               )}

//               <div className="ml-auto flex items-center gap-3">
//                 <Link
//                   href="/dashboard/profile"
//                   className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-ink/5"
//                 >
//                   {user.profile_image_url ? (
//                     // eslint-disable-next-line @next/next/no-img-element
//                     <img
//                       src={user.profile_image_url}
//                       alt={`${user.full_name}'s profile photo`}
//                       className="h-8 w-8 rounded-full object-cover ring-1 ring-ink/10"
//                     />
//                   ) : (
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
//                       {initials}
//                     </span>
//                   )}
//                   <span className="hidden text-sm font-medium text-ink sm:block">
//                     {user.full_name.split(" ")[0]}
//                   </span>
//                 </Link>
//               </div>
//             </div>
//           </header>

//           <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { Logo } from "@/components/ui/Logo";

interface AppShellUser {
  full_name: string;
  role: string;
  profile_image_url: string | null;
}

export function AppShell({
  user,
  onLogout,
  eyebrow,
  title,
  children,
}: {
  user: AppShellUser;
  onLogout: () => void;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = user.full_name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-[1400px]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 border-r border-ink/8 lg:block">
          <Sidebar role={user.role} onLogout={onLogout} />
        </aside>

        {/* Mobile drawer -- always mounted, slides in/out via transform so it animates */}
        <div
          className={`fixed inset-0 z-40 lg:hidden ${mobileOpen ? "pointer-events-auto" : "pointer-events-none"}`}
          aria-hidden={!mobileOpen}
        >
          <button
            aria-label="Close menu"
            className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
              mobileOpen ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setMobileOpen(false)}
            tabIndex={mobileOpen ? 0 : -1}
          />
          <div
            className={`absolute inset-y-0 left-0 w-[270px] max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar
              role={user.role}
              onLogout={onLogout}
              onClose={() => setMobileOpen(false)}
              onNavigate={() => setMobileOpen(false)}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-ink/8 bg-white/90 backdrop-blur">
            <div className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-6">
              <button
                className="rounded-[6px] p-1.5 text-ink lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="lg:hidden">
                <Logo href="/dashboard" size="sm" />
              </div>

              {(eyebrow || title) && (
                <div className="hidden min-w-0 lg:block">
                  {eyebrow && <p className="text-xs font-medium text-gold">{eyebrow}</p>}
                  {title && <p className="truncate text-[15px] font-semibold text-ink">{title}</p>}
                </div>
              )}

              <div className="ml-auto flex items-center gap-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-ink/5"
                >
                  {user.profile_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.profile_image_url}
                      alt={`${user.full_name}'s profile photo`}
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-ink/10"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                      {initials}
                    </span>
                  )}
                  <span className="hidden text-sm font-medium text-ink sm:block">
                    {user.full_name.split(" ")[0]}
                  </span>
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 sm:py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}