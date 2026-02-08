export function formatDateForApi(date: Date | null): string | undefined {
  if (!date) return undefined;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function parseDateFromApi(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  return new Date(dateStr);
}

export function getDefaultStartDate(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function getDefaultEndDate(): Date {
  const today = new Date();
  today.setHours(23, 59, 0, 0);
  return today;
}