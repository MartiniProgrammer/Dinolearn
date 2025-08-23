// src/app/dashboard/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
type Badge = {
  id: string;
  icon: string;
  title: string;
};

type UserBadge = {
  id: string;
  badge: Badge;
};

type UserWithProfile = {
  profile: {
    xp: number;
    level: number;
    streakCount: number;
    longestStreak: number;
    hearts: number;
  } | null;
  userBadges: UserBadge[];
};

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/sign-in");
  }
  const user: UserWithProfile | null = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      profile: true,
      userBadges: { include: { badge: true } },
    },
  });

  if (!user?.profile) return <div>Geen profiel</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-green-600">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">XP</div>
          <div className="text-2xl font-bold">{user.profile.xp}</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Level</div>
          <div className="text-2xl font-bold">{user.profile.level}</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Streak</div>
          <div className="text-2xl font-bold">
            {user.profile.streakCount} 🔥
          </div>
          <div className="text-sm">Langste: {user.profile.longestStreak}</div>
        </div>
        <div className="border rounded-2xl p-4">
          <div className="text-sm text-gray-500">Hearts</div>
          <div className="text-2xl font-bold">{user.profile.hearts} ❤️</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold">Badges</h2>
        <div className="flex gap-2 flex-wrap">
          {(user.userBadges ?? []).map((ub: UserBadge) => (
            <div
              key={ub.id}
              className="border rounded-2xl px-3 py-2"
            >
              {ub.badge.icon} {ub.badge.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
