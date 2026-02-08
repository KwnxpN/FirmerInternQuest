export function formatDateToDisplay(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString();
}

export function formatUserFullName(prefix: string, firstname: string, lastname: string): string {
  return `${prefix} ${firstname} ${lastname}`;
}
