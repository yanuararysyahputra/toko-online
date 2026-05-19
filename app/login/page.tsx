"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

export default function LoginPage() {

  const router = useRouter();

  const [password, setPassword] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const res = await fetch(
      "/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          password,
        }),
      }
    );

    const data =
      await res.json();

    if (!res.ok) {
      toast.error(
        data.error
      );
      return;
    }

    toast.success(
      "Login berhasil"
    );

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center p-5">

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl border border-blue-100"
      >

        <h1 className="text-3xl font-bold text-center text-black">
          Login Admin
        </h1>

        <p className="text-zinc-500 text-center mt-2 mb-6">
          Masuk ke dashboard admin
        </p>

        <input
          type="password"
          placeholder="Password admin"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="w-full border border-blue-100 rounded-2xl px-4 py-3 outline-none focus:border-[#007ACC]"
        />

        <button
          className="w-full mt-4 bg-[#007ACC] hover:bg-[#0062A3] transition text-white py-3 rounded-2xl font-semibold"
        >
          Login
        </button>
      </form>
    </div>
  );
}