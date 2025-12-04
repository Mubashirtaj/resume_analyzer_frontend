"use client"
import React, { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

const Page = () => {
  const [accessToken, setAccessToken] = useState("");


  const handleRefresh = async () => {
    const res = await axios.post("http://192.168.100.12:4000/auth/refresh_token");
    console.log(res.data);
    
    setAccessToken(res.data.accessToken);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Access Token: {accessToken || "Not logged in"}</h2>
      <button onClick={handleRefresh}>Refresh Token</button>
    </div>
  );
};

export default Page;
