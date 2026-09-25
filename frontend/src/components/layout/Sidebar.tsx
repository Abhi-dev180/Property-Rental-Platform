

// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import { useState, type ReactNode } from "react";
// // import { Loader2, LogOut } from "lucide-react";
// // import { Logo } from "@/components/ui/Logo";

// // type NavItem = {
// //   label: string;
// //   href: string;
// //   icon: ReactNode;
// //   soon?: boolean;
// // };



// // const ICONS = {
// //   overview: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
// //       <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
// //       <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
// //       <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
// //     </svg>
// //   ),
// //   properties: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <path
// //         d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9"
// //         stroke="currentColor"
// //         strokeWidth="1.6"
// //         strokeLinecap="round"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   ),
// //   applications: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <path
// //         d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z"
// //         stroke="currentColor"
// //         strokeWidth="1.6"
// //         strokeLinejoin="round"
// //       />
// //       <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
// //     </svg>
// //   ),
// //   payments: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
// //       <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
// //     </svg>
// //   ),
// //   maintenance: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <path
// //         d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.6 2.6-2-2 2.6-2.6z"
// //         stroke="currentColor"
// //         strokeWidth="1.6"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   ),
// //   messages: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <path
// //         d="M4 5.5h16a1 1 0 011 1V16a1 1 0 01-1 1H9l-4.5 3.5V17H4a1 1 0 01-1-1V6.5a1 1 0 011-1z"
// //         stroke="currentColor"
// //         strokeWidth="1.6"
// //         strokeLinejoin="round"
// //       />
// //     </svg>
// //   ),
// //   profile: (
// //     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //       <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
// //       <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
// //     </svg>
// //   ),
// //   leases: (
// //   <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //     <rect x="4" y="3.5" width="16" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
// //     <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
// //   </svg>
// // ),
// // };

// // function navForRole(role: string): NavItem[] {
// //   const isLandlord = role === "LANDLORD";
// //   return [
// //     { label: "Overview", href: "/dashboard", icon: ICONS.overview },
// //     isLandlord
// //       ? { label: "Properties", href: "/dashboard/properties", icon: ICONS.properties }
// //       : { label: "Browse listings", href: "/properties", icon: ICONS.properties },
// //     isLandlord
// //       ? { label: "Applications", href: "/landlord/applications", icon: ICONS.applications }
// //       : { label: "My Applications", href: "/applications", icon: ICONS.applications },
// //     { label: "Payments", href: "/dashboard/payments", icon: ICONS.payments },
// //     { label: "Maintenance", href: "/dashboard/maintenance", icon: ICONS.maintenance },
// //     { label: "Messages", href: "/dashboard/messages", icon: ICONS.messages },
// //     { label: "Profile", href: "/dashboard/profile", icon: ICONS.profile },
// //         isLandlord
// //       ? { label: "Leases", href: "/landlord/leases", icon: ICONS.leases }
// //       : { label: "My Leases", href: "/leases", icon: ICONS.leases },
// //   ];
// // }

// // export function Sidebar({ role, onLogout }: { role: string; onLogout: () => void }) {
// //   const pathname = usePathname();
// //   const items = navForRole(role);
// //   const [confirmOpen, setConfirmOpen] = useState(false);
// //   const [loggingOut, setLoggingOut] = useState(false);

// //   async function handleConfirm() {
// //     setLoggingOut(true);
// //     try {
// //       await onLogout();
// //     } finally {
// //       setLoggingOut(false);
// //       setConfirmOpen(false);
// //     }
// //   }

// //   return (
// //     <>
// //       <aside className="sticky top-0 hidden h-screen w-[220px] shrink-0 flex-col border-r border-ink/8 bg-white lg:flex">
// //         {/* Logo — pinned at top */}
// //         <div className="shrink-0 border-b border-ink/8 px-5 py-5">
// //           <Logo href="/dashboard" />
// //         </div>

// //         {/* Nav — scrolls independently if it overflows */}
// //         <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
// //           {items.map((item) => {
// //             const active = pathname === item.href;
// //             const linkClasses = `group flex items-center justify-between gap-2 rounded-[6px] px-3 py-2.5 text-sm transition-colors ${
// //               active
// //                 ? "bg-primary-soft text-primary font-medium"
// //                 : item.soon
// //                   ? "text-muted/60"
// //                   : "text-muted-2 hover:bg-ink/5 hover:text-ink"
// //             }`;

// //             if (item.soon) {
// //               return (
// //                 <div key={item.label} className={linkClasses} aria-disabled="true">
// //                   <span className="flex items-center gap-2.5">
// //                     {item.icon}
// //                     {item.label}
// //                   </span>
// //                   <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
// //                     Soon
// //                   </span>
// //                 </div>
// //               );
// //             }

// //             return (
// //               <Link key={item.label} href={item.href} className={linkClasses}>
// //                 <span className="flex items-center gap-2.5">
// //                   {item.icon}
// //                   {item.label}
// //                 </span>
// //               </Link>
// //             );
// //           })}
// //         </nav>

// //         {/* Logout — always pinned at bottom of viewport */}
// //         <div className="shrink-0 border-t border-ink/8 p-3">
// //           <button
// //             onClick={() => setConfirmOpen(true)}
// //             className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2.5 text-sm text-muted-2 transition-colors hover:bg-ink/5 hover:text-ink"
// //           >
// //             <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
// //               <path
// //                 d="M9 4H6a1 1 0 00-1 1v14a1 1 0 001 1h3M15 16l4-4-4-4M19 12H9"
// //                 stroke="currentColor"
// //                 strokeWidth="1.6"
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //               />
// //             </svg>
// //             Log out
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Logout confirmation modal */}
// //       {confirmOpen && (
// //         <LogoutModal
// //           busy={loggingOut}
// //           onCancel={() => setConfirmOpen(false)}
// //           onConfirm={handleConfirm}
// //         />
// //       )}
// //     </>
// //   );
// // }

// // function LogoutModal({
// //   busy,
// //   onCancel,
// //   onConfirm,
// // }: {
// //   busy: boolean;
// //   onCancel: () => void;
// //   onConfirm: () => void;
// // }) {
// //   return (
// //     <div
// //       role="dialog"
// //       aria-modal="true"
// //       aria-labelledby="logout-title"
// //       className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]/60 p-4 backdrop-blur-sm"
// //       onClick={busy ? undefined : onCancel}
// //     >
// //       <div
// //         className="w-full max-w-sm rounded-[10px] bg-white p-6 shadow-2xl"
// //         onClick={(e) => e.stopPropagation()}
// //       >
// //         <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-red-50 text-red-600">
// //           <LogOut className="h-5 w-5" />
// //         </div>

// //         <h2
// //           id="logout-title"
// //           className="mt-4 text-lg font-semibold tracking-tight text-[#0b1220]"
// //         >
// //           Log out of RentEase?
// //         </h2>
// //         <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
// //           You&apos;ll need to sign in again to access your dashboard, applications, and
// //           saved properties.
// //         </p>

// //         <div className="mt-6 flex justify-end gap-2">
// //           <button
// //             type="button"
// //             onClick={onCancel}
// //             disabled={busy}
// //             className="rounded-[8px] border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
// //           >
// //             Stay signed in
// //           </button>
// //           <button
// //             type="button"
// //             onClick={onConfirm}
// //             disabled={busy}
// //             autoFocus
// //             className="inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
// //           >

// //             {busy && <Loader2 className="h-4 w-4 animate-spin" />}
// //             {busy ? "Logging out…" : "Log out"}
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// //////
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, type ReactNode } from "react";
// import { Loader2, LogOut, X } from "lucide-react";
// import { Logo } from "@/components/ui/Logo";

// type NavItem = {
//   label: string;
//   href: string;
//   icon: ReactNode;
//   soon?: boolean;
// };

// type NavGroup = {
//   label: string;
//   items: NavItem[];
// };

// const ICONS = {
//   overview: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
//       <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
//       <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
//       <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
//     </svg>
//   ),
//   properties: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   ),
//   applications: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinejoin="round"
//       />
//       <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
//   leases: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <rect x="4" y="3.5" width="16" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
//   payments: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
//     </svg>
//   ),
//   maintenance: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.6 2.6-2-2 2.6-2.6z"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinejoin="round"
//       />
//     </svg>
//   ),
//   messages: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <path
//         d="M4 5.5h16a1 1 0 011 1V16a1 1 0 01-1 1H9l-4.5 3.5V17H4a1 1 0 01-1-1V6.5a1 1 0 011-1z"
//         stroke="currentColor"
//         strokeWidth="1.6"
//         strokeLinejoin="round"
//       />
//     </svg>
//   ),
//   profile: (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//       <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
//       <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
//     </svg>
//   ),
// };

// function navGroupsForRole(role: string): NavGroup[] {
//   const isLandlord = role === "LANDLORD";
//   return [
//     {
//       label: "Workspace",
//       items: [
//         { label: "Overview", href: "/dashboard", icon: ICONS.overview },
//         isLandlord
//           ? { label: "Properties", href: "/dashboard/properties", icon: ICONS.properties }
//           : { label: "Browse listings", href: "/properties", icon: ICONS.properties },
//         isLandlord
//           ? { label: "Applications", href: "/landlord/applications", icon: ICONS.applications }
//           : { label: "My Applications", href: "/applications", icon: ICONS.applications },
//         isLandlord
//           ? { label: "Leases", href: "/landlord/leases", icon: ICONS.leases }
//           : { label: "My Leases", href: "/leases", icon: ICONS.leases },
//       ],
//     },
//     {
//       label: "Account",
//       items: [
//         { label: "Payments", href: "/dashboard/payments", icon: ICONS.payments },
//         { label: "Maintenance", href: "/dashboard/maintenance", icon: ICONS.maintenance },
//         { label: "Messages", href: "/dashboard/messages", icon: ICONS.messages },
//         { label: "Profile", href: "/dashboard/profile", icon: ICONS.profile },
//       ],
//     },
//   ];
// }

// export function Sidebar({
//   role,
//   onLogout,
//   onNavigate,
//   onClose,
// }: {
//   role: string;
//   onLogout: () => void;
//   /** Called whenever a nav link is tapped -- used to close the mobile drawer. */
//   onNavigate?: () => void;
//   /** When provided, renders a close (X) button -- used for the mobile drawer variant. */
//   onClose?: () => void;
// }) {
//   const pathname = usePathname();
//   const groups = navGroupsForRole(role);
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);

//   async function handleConfirm() {
//     setLoggingOut(true);
//     try {
//       await onLogout();
//     } finally {
//       setLoggingOut(false);
//       setConfirmOpen(false);
//     }
//   }

//   return (
//     <>
//       <div className="flex h-full flex-col bg-white">
//         {/* Logo -- pinned at top */}
//         <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-5">
//           <Logo href="/dashboard" />
//           {onClose && (
//             <button
//               onClick={onClose}
//               aria-label="Close menu"
//               className="rounded-[6px] p-1.5 text-muted-2 transition-colors hover:bg-ink/5 hover:text-ink"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           )}
//         </div>

//         {/* Nav -- scrolls independently if it overflows */}
//         <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
//           {groups.map((group) => (
//             <div key={group.label}>
//               <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/70">
//                 {group.label}
//               </p>
//               <div className="mt-2 space-y-0.5">
//                 {group.items.map((item) => {
//                   const active = pathname === item.href;

//                   if (item.soon) {
//                     return (
//                       <div
//                         key={item.label}
//                         className="flex items-center justify-between gap-2 rounded-[8px] px-3 py-2.5 text-sm text-muted/60"
//                         aria-disabled="true"
//                       >
//                         <span className="flex items-center gap-2.5">
//                           <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-ink/5">
//                             {item.icon}
//                           </span>
//                           {item.label}
//                         </span>
//                         <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
//                           Soon
//                         </span>
//                       </div>
//                     );
//                   }

//                   return (
//                     <Link
//                       key={item.label}
//                       href={item.href}
//                       onClick={onNavigate}
//                       className={`group relative flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm transition-colors ${
//                         active
//                           ? "bg-primary-soft font-medium text-primary"
//                           : "text-muted-2 hover:bg-ink/5 hover:text-ink"
//                       }`}
//                     >
//                       {active && (
//                         <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
//                       )}
//                       <span
//                         className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] transition-colors ${
//                           active
//                             ? "bg-primary/15 text-primary"
//                             : "bg-ink/5 text-muted-2 group-hover:text-ink"
//                         }`}
//                       >
//                         {item.icon}
//                       </span>
//                       {item.label}
//                     </Link>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </nav>

//         {/* Logout -- always pinned at bottom */}
//         <div className="shrink-0 border-t border-ink/8 p-3">
//           <button
//             onClick={() => setConfirmOpen(true)}
//             className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm text-muted-2 transition-colors hover:bg-red-50 hover:text-red-700"
//           >
//             <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-ink/5">
//               <LogOut className="h-4 w-4" />
//             </span>
//             Log out
//           </button>
//         </div>
//       </div>

//       {confirmOpen && (
//         <LogoutModal
//           busy={loggingOut}
//           onCancel={() => setConfirmOpen(false)}
//           onConfirm={handleConfirm}
//         />
//       )}
//     </>
//   );
// }

// function LogoutModal({
//   busy,
//   onCancel,
//   onConfirm,
// }: {
//   busy: boolean;
//   onCancel: () => void;
//   onConfirm: () => void;
// }) {
//   return (
//     <div
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="logout-title"
//       className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]/60 p-4 backdrop-blur-sm"
//       onClick={busy ? undefined : onCancel}
//     >
//       <div
//         className="w-full max-w-sm rounded-[10px] bg-white p-6 shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-red-50 text-red-600">
//           <LogOut className="h-5 w-5" />
//         </div>

//         <h2 id="logout-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
//           Log out of RentEase?
//         </h2>
//         <p className="mt-1.5 text-sm leading-relaxed text-muted">
//           You&apos;ll need to sign in again to access your dashboard, applications, and
//           saved properties.
//         </p>

//         <div className="mt-6 flex justify-end gap-2">
//           <button
//             type="button"
//             onClick={onCancel}
//             disabled={busy}
//             className="rounded-[8px] border border-ink/15 px-4 py-2 text-sm font-medium text-muted-2 transition hover:bg-ink/5 disabled:opacity-50"
//           >
//             Stay signed in
//           </button>
//           <button
//             type="button"
//             onClick={onConfirm}
//             disabled={busy}
//             autoFocus
//             className="inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
//           >
//             {busy && <Loader2 className="h-4 w-4 animate-spin" />}
//             {busy ? "Logging out..." : "Log out"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Loader2, LogOut, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  soon?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const ICONS = {
  overview: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  properties: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 11L12 4l8 7M6 10v9a1 1 0 001 1h4v-6h2v6h4a1 1 0 001-1v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  applications: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 3.5h7l4 4V20a1 1 0 01-1 1H7a1 1 0 01-1-1V4.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12h6M9 15.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  leases: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3.5" width="16" height="17" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 8h8M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  payments: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ),
  maintenance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.6 2.6-2-2 2.6-2.6z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  messages: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 5.5h16a1 1 0 011 1V16a1 1 0 01-1 1H9l-4.5 3.5V17H4a1 1 0 01-1-1V6.5a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  ),
  profile: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

function navGroupsForRole(role: string): NavGroup[] {
  const isLandlord = role === "LANDLORD";
  return [
    {
      label: "Workspace",
      items: [
        { label: "Overview", href: "/dashboard", icon: ICONS.overview },
        isLandlord
          ? { label: "Properties", href: "/dashboard/properties", icon: ICONS.properties }
          : { label: "Browse listings", href: "/properties", icon: ICONS.properties },
        isLandlord
          ? { label: "Applications", href: "/landlord/applications", icon: ICONS.applications }
          : { label: "My Applications", href: "/applications", icon: ICONS.applications },
        isLandlord
          ? { label: "Leases", href: "/landlord/leases", icon: ICONS.leases }
          : { label: "My Leases", href: "/leases", icon: ICONS.leases },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Payments", href: "/dashboard/payments", icon: ICONS.payments },
           isLandlord
      ? { label: "Maintenance", href: "/landlord/maintenance", icon: ICONS.maintenance }
      : { label: "Maintenance", href: "/maintenance", icon: ICONS.maintenance },
        { label: "Messages", href: "/dashboard/messages", icon: ICONS.messages },
        { label: "Profile", href: "/dashboard/profile", icon: ICONS.profile },
      ],
    },
  ];
}

export function Sidebar({
  role,
  onLogout,
  onNavigate,
  onClose,
}: {
  role: string;
  onLogout: () => void;
  /** Called whenever a nav link is tapped -- used to close the mobile drawer. */
  onNavigate?: () => void;
  /** When provided, renders a close (X) button -- used for the mobile drawer variant. */
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const groups = navGroupsForRole(role);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleConfirm() {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
      setConfirmOpen(false);
    }
  }

  return (
    <>
      <div className="flex h-full flex-col bg-white">
        {/* Logo -- pinned at top */}
        <div className="flex shrink-0 items-center justify-between border-b border-ink/8 px-5 py-5">
          <Logo href="/dashboard" />
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-[6px] p-1.5 text-muted-2 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Nav -- scrolls independently if it overflows */}
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted/70">
                {group.label}
              </p>
              <div className="mt-2 space-y-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href;

                  if (item.soon) {
                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-2 rounded-[8px] px-3 py-2.5 text-sm text-muted/60"
                        aria-disabled="true"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-[6px] bg-ink/5">
                            {item.icon}
                          </span>
                          {item.label}
                        </span>
                        <span className="rounded-full bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted">
                          Soon
                        </span>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onNavigate}
                      className={`group relative flex items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm transition-colors ${
                        active
                          ? "bg-primary-soft font-medium text-primary"
                          : "text-muted-2 hover:bg-ink/5 hover:text-ink"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-primary" />
                      )}
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] transition-colors ${
                          active
                            ? "bg-primary/15 text-primary"
                            : "bg-ink/5 text-muted-2 group-hover:text-ink"
                        }`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout -- always pinned at bottom */}
        <div className="shrink-0 border-t border-ink/8 p-3">
          <button
            onClick={() => setConfirmOpen(true)}
            className="flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2.5 text-sm text-muted-2 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] bg-ink/5">
              <LogOut className="h-4 w-4" />
            </span>
            Log out
          </button>
        </div>
      </div>

      {confirmOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <LogoutModal
            busy={loggingOut}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={handleConfirm}
          />,
          document.body
        )}
    </>
  );
}

function LogoutModal({
  busy,
  onCancel,
  onConfirm,
}: {
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0b1220]/60 p-4 backdrop-blur-sm"
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm rounded-[10px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-red-50 text-red-600">
          <LogOut className="h-5 w-5" />
        </div>

        <h2 id="logout-title" className="mt-4 text-lg font-semibold tracking-tight text-ink">
          Log out of RentEase?
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          You&apos;ll need to sign in again to access your dashboard, applications, and
          saved properties.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-[8px] border border-ink/15 px-4 py-2 text-sm font-medium text-muted-2 transition hover:bg-ink/5 disabled:opacity-50"
          >
            Stay signed in
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            autoFocus
            className="inline-flex items-center gap-2 rounded-[8px] bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {busy ? "Logging out..." : "Log out"}
          </button>
        </div>
      </div>
    </div>
  );
}