export default function divideArray<T>(arr: T[], size: number) {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

// cara pakai: const slideNews = divideArray(news, 4) akan membagi news 4 news tiap bagian.
// Misal contoh di atas news terdapat 12 element maka :
// slideNews = [
//   [news1, news2, ..., news4],
//   [news5, ..., news8],
//   [news9, ..., news12],
// ]
