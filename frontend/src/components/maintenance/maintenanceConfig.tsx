import { Droplet, Zap, Thermometer, Refrigerator, Building2, Bug, HelpCircle, LucideIcon } from "lucide-react";
import { MaintenanceCategory, MaintenancePriority, MaintenanceStatus } from "@/lib/api";

export const CATEGORY_CONFIG: Record<MaintenanceCategory, { label: string; icon: LucideIcon; color: string; bg: string }> = {
  PLUMBING:      { label: "Plumbing",      icon: Droplet,      color: "#2455eb", bg: "#eaf0ff" },
  ELECTRICAL:    { label: "Electrical",    icon: Zap,          color: "#c9972b", bg: "#faf3e3" },
  HVAC:          { label: "HVAC",          icon: Thermometer,  color: "#0ea5a5", bg: "#e6fbfb" },
  APPLIANCE:     { label: "Appliance",     icon: Refrigerator, color: "#7c3aed", bg: "#f2ebfe" },
  STRUCTURAL:    { label: "Structural",    icon: Building2,    color: "#0b1220", bg: "#eef0f4" },
  PEST_CONTROL:  { label: "Pest Control",  icon: Bug,          color: "#16a34a", bg: "#eafbef" },
  OTHER:         { label: "Other",         icon: HelpCircle,   color: "#64748b", bg: "#f1f5f9" },
};

export const PRIORITY_CONFIG: Record<MaintenancePriority, { label: string; color: string; bg: string; pulse?: boolean }> = {
  LOW:      { label: "Low",      color: "#64748b", bg: "#f1f5f9" },
  MEDIUM:   { label: "Medium",   color: "#c9972b", bg: "#faf3e3" },
  HIGH:     { label: "High",     color: "#ea580c", bg: "#fef1e8" },
  EMERGENCY:{ label: "Emergency",color: "#dc2626", bg: "#fdeaea", pulse: true },
};

export const STATUS_CONFIG: Record<MaintenanceStatus, { label: string; color: string; bg: string }> = {
  SUBMITTED:    { label: "Submitted",    color: "#64748b", bg: "#f1f5f9" },
  ACKNOWLEDGED: { label: "Acknowledged", color: "#2455eb", bg: "#eaf0ff" },
  IN_PROGRESS:  { label: "In Progress",  color: "#c9972b", bg: "#faf3e3" },
  COMPLETED:    { label: "Completed",    color: "#16a34a", bg: "#eafbef" },
  CANCELLED:    { label: "Cancelled",    color: "#94a3b8", bg: "#f8fafc" },
};

export const STATUS_ORDER: MaintenanceStatus[] = ["SUBMITTED", "ACKNOWLEDGED", "IN_PROGRESS", "COMPLETED"];