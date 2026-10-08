import { NestFactory } from '@nestjs/core';
import { AppModule, configureApp } from './app';
export async function createApp() {
  const app = await NestFactory.create(AppModule, { logger: false });
  configureApp(app);
  await app.init();
  return app;
}
