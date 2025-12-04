import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  console.log("Fetched ID:", id);

  return NextResponse.json({ id });
}
