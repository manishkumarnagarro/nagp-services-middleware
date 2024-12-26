import { NestFactory } from '@nestjs/core';
import { AccountsModule } from './accounts.module';
import { AppConfigService } from '@app/common';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AccountsModule);
  const configService = app.get(AppConfigService);

  app.enableCors({
    origin: configService.getOrThrow('ACCOUNTS_CORS').split(','),
    credentials: true,
  });
  // Set up a gRPC microservice
  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      package: configService.getOrThrow('ACCOUNTS_GRPC_PACKAGE'),
      url: `0.0.0.0:${configService.getOrThrow('GRPC_PORT')}`,
      protoPath: join(__dirname, 'accounts.proto'),
    },
  });
  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 4000);
}
bootstrap();
