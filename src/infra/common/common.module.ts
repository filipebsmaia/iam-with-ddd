import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ApplicationModule } from './application/application.module';
import { MessagingModule } from './messaging.module';
import { EventsModule } from './events.module';

@Module({
  imports: [DatabaseModule, ApplicationModule, MessagingModule, EventsModule],
  controllers: [],
  providers: [],
})
export class CommonModule {}
