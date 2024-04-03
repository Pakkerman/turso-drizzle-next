"use client";

import { SelectUser } from "@/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
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
        <DeleteUsers />
      </QueryClientProvider>
    </main>
  );
}

function UserList() {
  const [animateParent] = useAutoAnimate();
  const { isPending, error, data } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetch("/api/user").then((res) => res.json()),
  });

  if (isPending) return <h1>Loading users...</h1>;
  if (error) return <pre>{JSON.stringify(error, null, 4)}</pre>;

  return (
    <>
      <h1>List of users:</h1>
      <ul
        ref={animateParent}
        className="h-44 flex flex-col-reverse overflow-scroll"
      >
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
  const queryUtil = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = Object.fromEntries(
        new FormData(event.target as HTMLFormElement),
      );

      return fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: async (response) => {
      queryUtil.invalidateQueries({ queryKey: ["userData"] });

      setPre(JSON.stringify(await response.json(), null, 4));
    },
  });

  return (
    <>
      <form onSubmit={mutate} className="flex flex-col gap-2">
        <input
          type="text"
          name="name"
          placeholder="name"
          defaultValue={`user-${(Math.random() * 1000).toFixed(0)}`}
          className="rounded-md p-2 text-gray-800"
        />
        <input
          type="text"
          name="email"
          placeholder="email"
          defaultValue={`${(Math.random() * 1000).toFixed(0)}@pemil.com`}
          className="rounded-md p-2 text-gray-800"
        />
        <button
          className="border-[1px] hover:border-gray-500 border-white rounded-xl p-2 disabled:border-red-500"
          type="submit"
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create a User"}
        </button>
      </form>
      <pre className="text-xs">log: {pre}</pre>
    </>
  );
}

function DeleteUsers() {
  const util = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => {
      return fetch("/api/user", { method: "DELETE" });
    },
    onSuccess: () => {
      util.invalidateQueries({ queryKey: ["userData"] });
    },
  });

  return (
    <button
      className="border-[1px] hover:border-gray-500 border-white rounded-xl p-2 disabled:border-red-500"
      onClick={() => mutate()}
      // disabled={isPending}
    >
      {false ? "Deleting..." : "delete all"}
    </button>
  );
}
