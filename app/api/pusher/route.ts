import Pusher from "pusher";
import { NextResponse } from "next/server";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "eu",
  useTLS: true,
});

export async function POST() {
  await pusher.trigger("rt-chat", "message", { success: true });
  
  return NextResponse.json({ success: true });
}