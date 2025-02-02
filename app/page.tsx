//import ChatContainer from "@/components/app/chat-container";
import ChatContainer from "@/components/app/chat-container";

export default function Home() {
  return (
    <div className=" items-center justify-items-center h-screen min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col h-full min-h-screen w-full max-h-screen max-w-screen-xl">
        <ChatContainer />
      </main>
    </div>
  );
}
