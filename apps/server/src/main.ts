import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const port = process.env.PORT || 3000;

    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
