export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(grosze: number, currency: string = "PLN"): string {
  const amount = grosze / 100;
  if (currency === "PLN") {
    return `${amount.toFixed(0)} zł`;
  }
  return `${amount.toFixed(2)} ${currency}`;
}

export function formatTime(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(dateString: string, locale: "pl" | "en" = "pl"): string {
  const d = new Date(dateString);
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortDate(dateString: string, locale: "pl" | "en" = "pl"): string {
  const d = new Date(dateString);
  return d.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
}
