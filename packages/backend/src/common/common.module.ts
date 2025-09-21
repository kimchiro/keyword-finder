import { Global, Module } from '@nestjs/common';
import { BrowserPoolService } from './services/browser-pool.service';

@Global()
@Module({
  providers: [BrowserPoolService],
  exports: [BrowserPoolService],
})
export class CommonModule {}
