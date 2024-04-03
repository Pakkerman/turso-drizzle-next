"use client";

import { SelectUser } from "@/db/schema";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { useState } from "react";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <QueryClientProvider client={queryClient}>
        <h1 className="text-xl font-bold">Testing Drizzle with Turso</h1>
        <UserList />
        <CreateUser />
      </QueryClientProvider>
    </main>
  );
}

function UserList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  if (isPending) return <h1>Loading users...</h1>;
  if (error) return <pre>{JSON.stringify(error, null, 4)}</pre>;

  return (
    <>
      <h1>List of users:</h1>
      <ul className="h-44 overflow-scroll">
        {data &&
          data.map((item: SelectUser, idx: number) => (
            <li key={`user-${idx}`}>{`id: ${item.id}, name: ${item.name}`}</li>
          ))}
      </ul>
    </>
  );
}

function CreateUser() {
  const [pre, setPre] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const endpoint = "api/user";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(endpoint, options);
    const json = await response.json();
    setPre(JSON.stringify(json, null, 4));
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="name"
          className="rounded-md p-2 text-gray-800"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          className="rounded-md p-2 text-gray-800"
        />
        <button
          className="border-[1px] hover:border-gray-500 border-white rounded-xl p-2"
          type="submit"
        >
          Create a User
        </button>
      </form>
      <pre className="text-xs">log: {pre}</pre>
    </>
  );
}
