import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class ServiceHealthController {
  /**
   * Route to check the status of the micro service
   * @returns true when the service the up and running
   */
  @Get()
  health() {
    return true;
  }
}
