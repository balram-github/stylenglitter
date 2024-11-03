import { cookies } from "next/headers";

export function getServerSideToken() {
  const cookieStore = cookies();
  return cookieStore.get("accessToken")?.value;
}
