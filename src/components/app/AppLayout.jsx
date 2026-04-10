import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Sidebar from './Sidebar';
import Header from './Header';
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await base44.auth.me();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isAdmin = user?.roles?.includes("ADMIN");

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        <div className="hidden lg:block w-64 bg-black border-r border-white/10">
          <div className="p-6 border-b border-white/10">
            <Skeleton className="h-8 w-32 rounded-xl bg-zinc-900" />
          </div>

          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-12 w-full rounded-2xl bg-zinc-900"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-screen">
          <div className="h-20 bg-black border-b border-white/10 px-6 flex items-center justify-end">
            <Skeleton className="h-10 w-40 rounded-2xl bg-zinc-900" />
          </div>

          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <Skeleton className="h-10 w-72 rounded-2xl bg-zinc-900" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-40 rounded-3xl bg-zinc-900"
                />
              ))}
            </div>

            <Skeleton className="h-80 w-full rounded-3xl bg-zinc-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar user={user} isAdmin={isAdmin} />

      <div className="flex-1 flex flex-col min-h-screen bg-black">
        <Header user={user} isAdmin={isAdmin} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-black">
          {React.cloneElement(children, { user, isAdmin })}
        </main>
      </div>
    </div>
  );
}