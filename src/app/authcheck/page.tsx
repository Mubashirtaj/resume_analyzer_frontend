import MyClientComponent from "@/components/pages/authcheck";
import  { Suspense } from "react";

export default function AuthCheckPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyClientComponent />
    </Suspense>
  );
}
