/** Ask the browser to show a notification. Returns whether it was shown. */
export async function pingVacancy(title: string, body: string, url: string): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  let permission = Notification.permission;
  if (permission === "default") {
    permission = await Notification.requestPermission();
  }
  if (permission !== "granted") return false;
  const note = new Notification(title, { body, tag: url });
  note.onclick = () => {
    window.focus();
    window.open(url, "_blank", "noopener,noreferrer");
    note.close();
  };
  return true;
}