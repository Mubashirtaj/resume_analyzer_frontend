import axios from "axios";

// Function for deleting frontend cookies (non-httpOnly cookies)
export const deleteFrontendCookies = () => {
  const cookies = document.cookie.split(";");

  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();

    // Remove frontend cookies
    document.cookie = `${name}=; Max-Age=0; path=/;`;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    // Backend logout (httpOnly cookies clear honge)
    await axios.post(
      "http://localhost:4000/logout",
      {},
      { withCredentials: true } // VERY IMPORTANT
    );

    // Remove frontend cookies (non-httpOnly)
    deleteFrontendCookies();

    // Clear other storage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect user
    window.location.href = "/signin";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
