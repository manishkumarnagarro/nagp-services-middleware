import { RabbitMQConfig, RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppConfigModule, AppConfigService } from '../config';

const getUri = (configService: AppConfigService) => {
  return configService
    .getOrThrow('RABBITMQ_URL')
    .replace('{host}', configService.getOrThrow('RABBITMQ_HOST'))
    .replace('{user}', configService.getOrThrow('RABBITMQ_USER'))
    .replace('{password}', configService.getOrThrow('RABBITMQ_PASSWORD'));
};

@Module({
  imports: [AppConfigModule, RabbitMQModule],
  exports: [ClientsModule],
})
export class RabbitMqModule {
  static withConfig(options?: Partial<RabbitMQConfig>): DynamicModule {
    return RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [AppConfigModule],
      useFactory: (configService: AppConfigService) => ({
        connectionInitOptions: {
          wait: false,
        },
        uri: getUri(configService),
        ...options,
      }),
      inject: [AppConfigService],
    });
  }
}
