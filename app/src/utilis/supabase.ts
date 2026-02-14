import { createClient } from "@supabase/supabase-js";

// function cookieStorage() {
//   return {
//     getItem: (key: string): string | null => {
//       const match = document.cookie.match(
//         new RegExp("(^| )" + key + "=([^;]+)")
//       );
//       return match ? decodeURIComponent(match[2]) : null;
//     },
//     setItem: (key: string, value: string): void => {
//       document.cookie = `${key}=${encodeURIComponent(
//         value
//       )}; Path=/; Domain=.modev.local; SameSite=Lax;`;
//     },
//     removeItem: (key: string): void => {
//       document.cookie = `${key}=; Path=/; Domain=.modev.local; Max-Age=0;`;
//     },
//   };
// }

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
//   {
//     auth: {
//       storage: cookieStorage(),
//       detectSessionInUrl: true,
//     },
//   }
);

export default supabase
