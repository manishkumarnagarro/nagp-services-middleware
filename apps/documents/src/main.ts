import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';
import { AppConfigService } from '@app/common/config';

async function bootstrap() {
  const app = await NestFactory.create(DocumentsModule);
  const configService = app.get(AppConfigService);

  app.enableCors({
    origin: configService.getOrThrow('DOCUMENTS_CORS').split(','),
    credentials: true,
  });

  await app.listen(process.env.port ?? 5000);
}
bootstrap();
