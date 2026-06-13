"use client";

import { useEffect, useState, useCallback } from "react";
import { cn, formatPrice, formatDate, formatTime } from "@/lib/utils";

type Theme = "light" | "dark";
type Tab = "bookings" | "services" | "specialists";

interface BookingRow {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  patientEmail: string;
  patientPhone: string;
  mode: string;
  status: string;
  totalGrosze: number;
  currency: string;
  createdAt: string;
  notes: string | null;
  bookingFor: string;
  payerFirstName: string | null;
  payerLastName: string | null;
}

interface ServiceRow {
  id: string;
  name: string;
  nameEn: string | null;
  durationMinutes: number;
  priceGrosze: number;
  currency: string;
  onlineAvailable: boolean;
  inOfficeAvailable: boolean;
  active: boolean;
}

interface SpecialistRow {
  id: string;
  firstName: string;
  lastName: string;
  title: string | null;
  specialty: string | null;
  active: boolean;
}

const statusColors: Record<string, { light: string; dark: string; dot: string }> = {
  confirmed: { light: "bg-green-50 text-green-700 border-green-200", dark: "bg-green-900/30 text-green-300 border-green-800", dot: "bg-green-500" },
  pending: { light: "bg-amber-50 text-amber-700 border-amber-200", dark: "bg-amber-900/30 text-amber-300 border-amber-800", dot: "bg-amber-500" },
  cancelled: { light: "bg-slate-50 text-slate-500 border-slate-200", dark: "bg-slate-800/30 text-slate-400 border-slate-700", dot: "bg-slate-400" },
  completed: { light: "bg-blue-50 text-blue-700 border-blue-200", dark: "bg-blue-900/30 text-blue-300 border-blue-800", dot: "bg-blue-500" },
  payment_failed: { light: "bg-red-50 text-red-700 border-red-200", dark: "bg-red-900/30 text-red-300 border-red-800", dot: "bg-red-500" },
  slot_taken: { light: "bg-orange-50 text-orange-700 border-orange-200", dark: "bg-orange-900/30 text-orange-300 border-orange-800", dot: "bg-orange-500" },
};

const statusLabels: Record<string, { pl: string; en: string }> = {
  confirmed: { pl: "Potwierdzona", en: "Confirmed" },
  pending: { pl: "Oczekująca", en: "Pending" },
  cancelled: { pl: "Anulowana", en: "Cancelled" },
  completed: { pl: "Zakończona", en: "Completed" },
  payment_failed: { pl: "Płatność nieudana", en: "Payment failed" },
  slot_taken: { pl: "Termin zajęty", en: "Slot taken" },
};

export function AdminPanel() {
  const [theme, setTheme] = useState<Theme>("light");
  const [tab, setTab] = useState<Tab>("bookings");
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [specialists, setSpecialists] = useState<SpecialistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);

  const isDark = theme === "dark";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, sRes, spRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/services"),
        fetch("/api/specialists"),
      ]);
      setBookings(await bRes.json());
      setServices(await sRes.json());
      setSpecialists(await spRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const handleCancelBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchData();
  };

  const handleDeleteService = async (id: string) => {
    await fetch(`/api/services/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleToggleServiceActive = async (id: string, active: boolean) => {
    await fetch(`/api/services/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchData();
  };

  const handleDeleteSpecialist = async (id: string) => {
    await fetch(`/api/specialists/${id}`, { method: "DELETE" });
    fetchData();
  };

  const handleToggleSpecialistActive = async (id: string, active: boolean) => {
    await fetch(`/api/specialists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchData();
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    {
      key: "bookings",
      label: "Bookings",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      count: bookings.length,
    },
    {
      key: "services",
      label: "Services",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
      count: services.length,
    },
    {
      key: "specialists",
      label: "Specialists",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      count: specialists.length,
    },
  ];

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-500",
      isDark ? "bg-brand-950" : "bg-slate-50"
    )}>
      {/* Header */}
      <header className={cn(
        "border-b",
        isDark
          ? "border-brand-800 bg-brand-900/80 backdrop-blur-sm"
          : "border-slate-200 bg-white/80 backdrop-blur-sm"
      )}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                isDark ? "bg-brand-800 text-brand-300 hover:bg-brand-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
              )}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </a>
            <div>
              <h1 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-800")}>
                Admin Panel
              </h1>
              <p className={cn("text-xs", isDark ? "text-brand-400" : "text-slate-500")}>
                Manage bookings, services & specialists
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={cn(
              "rounded-lg p-2 transition-colors",
              isDark ? "bg-brand-800 text-yellow-300 hover:bg-brand-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Tabs */}
        <div className={cn(
          "mb-6 flex gap-1 rounded-xl p-1",
          isDark ? "bg-brand-900/60" : "bg-slate-100"
        )}>
          {tabs.map((tb) => (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                "flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                tab === tb.key
                  ? isDark
                    ? "bg-brand-700 text-white shadow-lg"
                    : "bg-white text-brand-700 shadow-md"
                  : isDark
                    ? "text-brand-400 hover:text-white"
                    : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tb.icon}
              <span className="hidden sm:inline">{tb.label}</span>
              <span className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                tab === tb.key
                  ? isDark ? "bg-brand-500/30 text-brand-200" : "bg-brand-100 text-brand-600"
                  : isDark ? "bg-brand-800/50 text-brand-500" : "bg-slate-200 text-slate-500"
              )}>
                {tb.count}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("skeleton h-16 rounded-xl", isDark && "dark")} />
            ))}
          </div>
        ) : (
          <>
            {/* Bookings Tab */}
            {tab === "bookings" && (
              <div className="space-y-3 stagger-children">
                {bookings.length === 0 ? (
                  <EmptyState isDark={isDark} message="No bookings yet" />
                ) : (
                  bookings.map((booking) => {
                    const isExpanded = expandedBooking === booking.id;
                    const sc = statusColors[booking.status] || statusColors.pending;

                    return (
                      <div
                        key={booking.id}
                        className={cn(
                          "rounded-xl border-2 overflow-hidden transition-all duration-300",
                          isDark ? "border-brand-800/50 bg-brand-900/40" : "border-slate-200 bg-white",
                          isExpanded && (isDark ? "border-brand-600/50" : "border-brand-300")
                        )}
                      >
                        {/* Main row */}
                        <button
                          onClick={() => setExpandedBooking(isExpanded ? null : booking.id)}
                          className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-black/5"
                        >
                          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg text-lg font-bold", isDark ? "bg-brand-800" : "bg-brand-50")}>
                            {booking.patientFirstName[0]}{booking.patientLastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-slate-800")}>
                              {booking.patientFirstName} {booking.patientLastName}
                            </p>
                            <p className={cn("text-xs truncate", isDark ? "text-brand-400" : "text-slate-500")}>
                              {booking.patientEmail} · {formatPrice(booking.totalGrosze, booking.currency)}
                            </p>
                          </div>
                          <span className={cn(
                            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
                            isDark ? sc.dark : sc.light
                          )}>
                            <span className={cn("h-1.5 w-1.5 rounded-full", sc.dot)} />
                            {statusLabels[booking.status]?.en || booking.status}
                          </span>
                          <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={cn(
                              "transition-transform",
                              isDark ? "text-brand-500" : "text-slate-400",
                              isExpanded && "rotate-180"
                            )}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>

                        {/* Expanded details */}
                        {isExpanded && (
                          <div className={cn(
                            "border-t px-4 py-4 animate-slide-down space-y-3",
                            isDark ? "border-brand-800 bg-brand-950/30" : "border-slate-100 bg-slate-50"
                          )}>
                            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                              <DetailItem label="Phone" value={booking.patientPhone} isDark={isDark} />
                              <DetailItem label="Mode" value={booking.mode === "online" ? "Online" : "In office"} isDark={isDark} />
                              <DetailItem label="Booking for" value={booking.bookingFor === "myself" ? "Self" : "Someone else"} isDark={isDark} />
                              {booking.payerFirstName && (
                                <DetailItem label="Payer" value={`${booking.payerFirstName} ${booking.payerLastName}`} isDark={isDark} />
                              )}
                              <DetailItem label="Created" value={new Date(booking.createdAt).toLocaleDateString()} isDark={isDark} />
                              <DetailItem label="Ref" value={booking.id.slice(0, 8).toUpperCase()} isDark={isDark} />
                            </div>
                            {booking.notes && (
                              <p className={cn("text-xs italic", isDark ? "text-brand-400" : "text-slate-500")}>
                                &quot;{booking.notes}&quot;
                              </p>
                            )}
                            <div className="flex gap-2 pt-2">
                              {booking.status === "pending" && (
                                <ActionButton
                                  label="Confirm"
                                  color="green"
                                  isDark={isDark}
                                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                />
                              )}
                              {booking.status === "confirmed" && (
                                <ActionButton
                                  label="Complete"
                                  color="blue"
                                  isDark={isDark}
                                  onClick={() => handleUpdateStatus(booking.id, "completed")}
                                />
                              )}
                              {(booking.status === "pending" || booking.status === "confirmed") && (
                                <ActionButton
                                  label="Cancel"
                                  color="red"
                                  isDark={isDark}
                                  onClick={() => handleCancelBooking(booking.id)}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Services Tab */}
            {tab === "services" && (
              <div className="space-y-3 stagger-children">
                {services.length === 0 ? (
                  <EmptyState isDark={isDark} message="No services" />
                ) : (
                  services.map((svc) => (
                    <div
                      key={svc.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                        isDark ? "border-brand-800/50 bg-brand-900/40" : "border-slate-200 bg-white",
                        !svc.active && "opacity-50"
                      )}
                    >
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg",
                        isDark ? "bg-brand-800" : "bg-brand-50"
                      )}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-brand-400" : "text-brand-500")}>
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-slate-800")}>
                          {svc.name}
                        </p>
                        <p className={cn("text-xs", isDark ? "text-brand-400" : "text-slate-500")}>
                          {svc.durationMinutes} min · {formatPrice(svc.priceGrosze, svc.currency)}
                          {svc.onlineAvailable && " · 💻"}
                          {svc.inOfficeAvailable && " · 🏥"}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleServiceActive(svc.id, svc.active)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                            svc.active
                              ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-700"
                              : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {svc.active ? "Active" : "Inactive"}
                        </button>
                        <button
                          onClick={() => handleDeleteService(svc.id)}
                          className={cn(
                            "rounded-lg p-1.5 transition-colors",
                            isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"
                          )}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Specialists Tab */}
            {tab === "specialists" && (
              <div className="space-y-3 stagger-children">
                {specialists.length === 0 ? (
                  <EmptyState isDark={isDark} message="No specialists" />
                ) : (
                  specialists.map((spec, idx) => {
                    const colors = ["from-brand-400 to-brand-600", "from-teal-400 to-teal-600", "from-purple-400 to-purple-600", "from-pink-400 to-pink-600"];
                    return (
                      <div
                        key={spec.id}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border-2 p-4 transition-all",
                          isDark ? "border-brand-800/50 bg-brand-900/40" : "border-slate-200 bg-white",
                          !spec.active && "opacity-50"
                        )}
                      >
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", colors[idx % colors.length])}>
                          {spec.firstName[0]}{spec.lastName[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-sm font-semibold truncate", isDark ? "text-white" : "text-slate-800")}>
                            {spec.title ? `${spec.title} ` : ""}{spec.firstName} {spec.lastName}
                          </p>
                          {spec.specialty && (
                            <p className={cn("text-xs truncate", isDark ? "text-brand-400" : "text-slate-500")}>
                              {spec.specialty}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleSpecialistActive(spec.id, spec.active)}
                            className={cn(
                              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                              spec.active
                                ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-50 text-green-700"
                                : isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"
                            )}
                          >
                            {spec.active ? "Active" : "Inactive"}
                          </button>
                          <button
                            onClick={() => handleDeleteSpecialist(spec.id)}
                            className={cn(
                              "rounded-lg p-1.5 transition-colors",
                              isDark ? "text-red-400 hover:bg-red-900/30" : "text-red-400 hover:bg-red-50"
                            )}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DetailItem({ label, value, isDark }: { label: string; value: string; isDark: boolean }) {
  return (
    <div>
      <p className={cn("text-[10px] font-medium uppercase tracking-wide", isDark ? "text-brand-500" : "text-slate-400")}>
        {label}
      </p>
      <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-700")}>{value}</p>
    </div>
  );
}

function ActionButton({ label, color, isDark, onClick }: { label: string; color: string; isDark: boolean; onClick: () => void }) {
  const colorMap: Record<string, string> = {
    green: isDark ? "bg-green-900/40 text-green-300 hover:bg-green-800/60" : "bg-green-50 text-green-700 hover:bg-green-100",
    blue: isDark ? "bg-blue-900/40 text-blue-300 hover:bg-blue-800/60" : "bg-blue-50 text-blue-700 hover:bg-blue-100",
    red: isDark ? "bg-red-900/40 text-red-300 hover:bg-red-800/60" : "bg-red-50 text-red-700 hover:bg-red-100",
  };
  return (
    <button onClick={onClick} className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", colorMap[color])}>
      {label}
    </button>
  );
}

function EmptyState({ isDark, message }: { isDark: boolean; message: string }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12",
      isDark ? "border-brand-800 bg-brand-950/30" : "border-slate-200 bg-white"
    )}>
      <div className={cn(
        "mb-3 flex h-12 w-12 items-center justify-center rounded-full",
        isDark ? "bg-brand-800" : "bg-slate-100"
      )}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={cn(isDark ? "text-brand-500" : "text-slate-400")}>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </div>
      <p className={cn("text-sm font-medium", isDark ? "text-brand-400" : "text-slate-500")}>{message}</p>
    </div>
  );
}
