import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp/whatsapp.controller';
import { WhatsappService } from './whatsapp/whatsapp.service';
import { OpenaiModule } from 'src/openai/openai.module';
import { OpenaiService } from 'src/openai/openai.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [OpenaiModule],
  controllers: [WhatsappController],
  providers: [WhatsappService,OpenaiService]
})
export class WhatsappModule {}
