import { app } from './app.js';
import { config, getMaskedSecret } from './config/env.js';

const server = app.listen(config.port, () => {
  console.log('\n======================================================');
  console.log('⚽ PitchMaster 11 - Backend Service Running');
  console.log('======================================================');
  console.log(`📡 Server Address: http://localhost:${config.port}`);
  console.log(`🌍 Environment:    ${config.nodeEnv}`);
  console.log(`🔒 Secret Key:     ${getMaskedSecret(config.apiSecretKey)} (Protected)`);
  console.log(`📂 Data Storage:   ${config.dataDir}`);
  console.log('------------------------------------------------------');
  console.log('Available Endpoints:');
  console.log(`  • GET   http://localhost:${config.port}/api/health`);
  console.log(`  • GET   http://localhost:${config.port}/api/pitches`);
  console.log(`  • GET   http://localhost:${config.port}/api/time-slots`);
  console.log(`  • GET   http://localhost:${config.port}/api/bookings`);
  console.log(`  • POST  http://localhost:${config.port}/api/bookings`);
  console.log(`  • PATCH http://localhost:${config.port}/api/bookings/:id/status`);
  console.log(`  • POST  http://localhost:${config.port}/api/ai/chat`);
  console.log('======================================================\n');
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal, shutting down gracefully...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nReceived SIGINT signal (Ctrl+C), shutting down...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});

