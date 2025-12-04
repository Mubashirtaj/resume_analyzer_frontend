// app/resume/[id]/page.tsx

import Chatpage from "@/components/pages/chat";
import React from "react";

interface Props {
  params: { id: string };
}

const Page = async ({ params }: Props) => {
  const { id } = await params; 
  return (
    <div className="text-white">
      <Chatpage id={id} />
    </div>
  );
};

export default Page;
