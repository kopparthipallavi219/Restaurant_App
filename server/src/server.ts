import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { seedDatabase } from './seed/seeder';

const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const PORT = parseInt(env.PORT, 10) || 5000;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
  ════════════════════════════════════════════════════════════════
  👑 MEHFIL RESTAURANT - ENTERPRISE API SERVER
  ────────────────────────────────────────────────────────────────
  📡 Status:      Active & Ready
  🌐 Port:        http://localhost:${PORT}
  🏥 Healthcheck: http://localhost:${PORT}/api/health
  ⚙️ Environment: ${env.NODE_ENV}
  ════════════════════════════════════════════════════════════════
    `);
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n⚠️ ${signal} received. Initiating graceful shutdown...`);
    server.close(() => {
      console.log('🛑 Express server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
};

startServer();

export default app;
