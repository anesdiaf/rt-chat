"use client";

import { FormEvent, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import { db } from "@/db/migrate";
import { messagesTable, messageType } from "@/db/schema";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { asc, desc } from "drizzle-orm";

export default function ChatContainer() {
  const [messages, setMessages] = useState<messageType[]>([]);
  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");

  const getMessages = async () => {
    const messagesQuery: messageType[] = await db.select().from(messagesTable).orderBy(desc(messagesTable.createdAt));
    setMessages(messagesQuery);
  };

  useEffect(() => {
    getMessages();

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: "eu",
    });
    const channel = pusher.subscribe("rt-chat");

    channel.bind("message", async () => {
      console.log("Event has been triggered in client ");

      getMessages();
    });

    if(messages.length !== 0){
      
      //const {id} = messages[messages.length - 1];
      //const topPos = document.getElementById(id.toString())?.offsetTop;
      const container = document.getElementById('messages-container')
      console.log(container)
      container!.scrollTop = container!.scrollHeight;


    }

    if (localStorage.getItem("u-name")) {
      setName(localStorage.getItem("u-name")!);
    }

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const triggerEvent = async () => {
    fetch("/api/pusher", {
      method: "POST",
    }).catch((err) => console.log("error: ", err));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (name == "") {
      toast("Set name to send a message");
    }

    const formdata = new FormData();

    formdata.append("name", name);
    formdata.append("message", message);

    await db
      .insert(messagesTable)
      .values({
        name: name as string,
        message: message as string,
      })
      .then(() => {
        toast("Message sent.");
        triggerEvent();
        setMessage("");
      })
      .catch((err) => {
        console.log(err);
        toast(err.message);
      });
  };

  return (
    <div className="flex flex-col h-full w-full justify-between gap-3">
      <ul id="messages-container" className="flex-grow h-full w-full border rounded-md p-3 flex flex-col gap-2 overflow-y-auto">
        {messages.map((msg) => {
          return (
            <li
              id={msg.id.toString()}
              className={cn(
                msg.name !== name ? "bg-blue-200 " : "bg-blue-50",
                "h-auto rounded-md p-3 w-full flex flex-col gap-2"
              )}
              key={msg.id}
            >
              <div className="flex gap-3 items-center">
                <p>{msg.name == name ? "You" : msg.name}</p>
                <div className="bg-blue-400 rounded-full w-1 h-1"></div>
                <p className="text-accent-foreground">
                  {formatDistanceToNow(msg.createdAt!)} ago
                </p>
              </div>
              {msg.message}
            </li>
          );
        })}
      </ul>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="border-t h-fit flex flex-col gap-3 p-3"
      >
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              localStorage.setItem("u-name", e.target.value);
            }}
            type="text"
            name="name"
            id="name"
          />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            name="message"
            id="message"
          />
        </div>

        <Button className="self-end">Send</Button>
      </form>
    </div>
  );
}
