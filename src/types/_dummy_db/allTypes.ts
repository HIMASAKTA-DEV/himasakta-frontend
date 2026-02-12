// WARNING: Erorr "... has type 'any' ..." mungkin muncul karena import json langsung. Solusi: lakukan casting ke type ini saat data fetching!
/**
 * Misal:
 *
 * const rawNewsData = fetch(".../api/all-news") atau dari dummyBeritaDataAll.json
 * const allNewsData: rawNewsData as newsType[]
 */
// Kalo gw boleh jujur, gw gak tahu bedanya type sama interface

export interface newsType {
  // Changed to interface + named export
  id: string;
  title: string;
  tagline: string;
  date: string;
  image: string;
  hashtags?: string[];
  content: string;
}

// TODO: Add other type
