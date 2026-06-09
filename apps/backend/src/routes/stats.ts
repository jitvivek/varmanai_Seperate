import { Router } from 'express';
import { clerkAuth, type AuthenticatedRequest } from '../middleware/clerkAuth.js';
import { PrismaClient } from '@prisma/client';

const router: Router = Router();
const prisma = new PrismaClient();

// Per-user stats for dashboard (admin/owner sees all their own data)
router.get('/v1/stats', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    // Get user's extension installs
    const installs = await prisma.extensionInstall.findMany({
      where: { userId },
      orderBy: { installedAt: 'desc' },
    });

    // Total scans for this user
    const totalScans = await prisma.scanLog.count({ where: { userId } });

    // Threats blocked (malicious verdicts)
    const threatsBlocked = await prisma.scanLog.count({
      where: { userId, verdict: 'malicious' },
    });

    // Scans today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const scansToday = await prisma.scanLog.count({
      where: { userId, createdAt: { gte: todayStart } },
    });

    // Scans by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentScans = await prisma.scanLog.findMany({
      where: { userId, createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, verdict: true, category: true, site: true },
      orderBy: { createdAt: 'desc' },
    });

    // Group by day
    const scansByDay: Record<string, { total: number; blocked: number }> = {};
    for (const scan of recentScans) {
      const day = scan.createdAt.toISOString().slice(0, 10);
      if (!scansByDay[day]) scansByDay[day] = { total: 0, blocked: 0 };
      scansByDay[day].total++;
      if (scan.verdict === 'malicious') scansByDay[day].blocked++;
    }

    // Top threat categories
    const categoryBreakdown: Record<string, number> = {};
    for (const scan of recentScans) {
      if (scan.verdict === 'malicious' && scan.category) {
        categoryBreakdown[scan.category] = (categoryBreakdown[scan.category] || 0) + 1;
      }
    }

    // Top sites scanned
    const siteBreakdown: Record<string, number> = {};
    for (const scan of recentScans) {
      if (scan.site) {
        siteBreakdown[scan.site] = (siteBreakdown[scan.site] || 0) + 1;
      }
    }

    res.json({
      overview: {
        totalScans,
        threatsBlocked,
        scansToday,
        extensionInstalls: installs.length,
      },
      installs: installs.map((i) => ({
        id: i.id,
        browser: i.browser,
        version: i.version,
        installedAt: i.installedAt,
        lastActiveAt: i.lastActiveAt,
      })),
      scansByDay,
      categoryBreakdown,
      siteBreakdown,
    });
  } catch (err) {
    next(err);
  }
});

// Admin endpoint: all users' stats (for admin dashboard)
router.get('/v1/stats/users', clerkAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.userId as string;

    // Check if requesting user is admin (has "team" plan or is owner)
    const requestingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!requestingUser || (requestingUser.plan !== 'team' && requestingUser.plan !== 'admin')) {
      // For non-admin, return only their own data
      const totalScans = await prisma.scanLog.count({ where: { userId } });
      const threatsBlocked = await prisma.scanLog.count({ where: { userId, verdict: 'malicious' } });
      const installs = await prisma.extensionInstall.findMany({ where: { userId } });

      res.json({
        users: [{
          userId,
          email: requestingUser?.email ?? '',
          plan: requestingUser?.plan ?? 'free',
          totalScans,
          threatsBlocked,
          extensionInstalls: installs.length,
          browsers: installs.map((i) => i.browser),
          lastActive: installs[0]?.lastActiveAt ?? null,
          joinedAt: requestingUser?.createdAt,
        }],
      });
      return;
    }

    // Admin: get all users with their stats
    const users = await prisma.user.findMany({
      include: {
        _count: { select: { scanLogs: true, extensionInstalls: true } },
        extensionInstalls: { select: { browser: true, lastActiveAt: true, installedAt: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const threatsBlocked = await prisma.scanLog.count({
          where: { userId: user.id, verdict: 'malicious' },
        });
        return {
          userId: user.id,
          email: user.email,
          plan: user.plan,
          totalScans: user._count.scanLogs,
          threatsBlocked,
          extensionInstalls: user._count.extensionInstalls,
          browsers: user.extensionInstalls.map((i) => i.browser),
          lastActive: user.extensionInstalls[0]?.lastActiveAt ?? null,
          joinedAt: user.createdAt,
        };
      })
    );

    res.json({ users: usersWithStats });
  } catch (err) {
    next(err);
  }
});

export default router;
