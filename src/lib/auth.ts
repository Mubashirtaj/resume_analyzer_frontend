import { getCookie } from "cookies-next";

export function isLoggedIn() {
  return !!getCookie("atk");
}
