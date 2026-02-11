// Ini mah template c++ 🤣, gacor bang nih sawit buat lu

export default function sortByDate<T>(data: T[], dateKey: keyof T): T[] {
  return [...data].sort(
    (a, b) =>
      new Date(b[dateKey] as string).getTime() -
      new Date(a[dateKey] as string).getTime(),
  );
}

// cara pakai sortByDate(data, "date");
