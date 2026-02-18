const DOTS = "dots";

export function getPagination(currPage: number, totPage: number) {
  const pg: (number | typeof DOTS)[] = [];

  for (let i = 1; i <= totPage; i++) {
    if (
      i === 1 || // jika page adalah page 1
      i === totPage || // jika page adalah page terakhir
      (i >= currPage - 1 && i <= currPage + 1) // jika page adalah page sebelum dan sesudah curr page
    ) {
      pg.push(i); // tampilkan dalam angka
    } else {
      const last = pg[pg.length - 1]; // cek elemen terakhir apakah sudah dot
      if (last !== DOTS) {
        // jika belum
        pg.push(DOTS); // tambahkan dot
      }
    }
  }
  return pg;
}
