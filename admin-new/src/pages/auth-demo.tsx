"use client";

import React from "react";
import Head from "next/head";
import { Login, Register, AuthProvider } from "@ecommerce/shared";

export default function AdminAuthDemo() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-start justify-center p-8">
        <Head>
          <title>Admin Auth Demo</title>
        </Head>
        <div className="max-w-3xl w-full grid md:grid-cols-2 gap-8">
          <section className="p-6 bg-card border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Login (shared)</h2>
            <Login onSuccess={() => alert('Admin login success (shared)')} />
          </section>

          <section className="p-6 bg-card border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Register (shared)</h2>
            <Register onSuccess={() => alert('Admin register success (shared)')} />
          </section>
        </div>
      </div>
    </AuthProvider>
  );
}
