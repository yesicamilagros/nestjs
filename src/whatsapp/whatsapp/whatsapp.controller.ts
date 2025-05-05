import { Body, Controller, Get, HttpCode, Post, Req ,Res} from '@nestjs/common';
import { Request, response } from 'express';
import {HttpService} from '@nestjs/axios';
import * as process from 'node:process';
import { catchError,lastValueFrom, map } from 'rxjs';
import { WhatsappService } from './whatsapp.service';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from 'src/openai/openai.service';


@Controller('whatsapp')
export class WhatsappController {

  
  constructor(
     private readonly whatsAppService : WhatsappService,
     private readonly openaiService: OpenaiService,

  ){}

    @Get('/webhook')
    whatsappVerificationChallenge(@Req() request:Request, @Res() response: any){
        /*const mode = request.query['hub.mode'];
        const challenge = request.query['hub.challenge'];
        const token = request.query['hub.verify_token'];
        const verificationToken = process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;
if(!mode || !token){

    return 'Error verifing Token ...';
}

if(mode === 'subscribe' && token === verificationToken){

    return challenge?.toString();
}

*/   const mode = request.query['hub.mode'];
  const challenge = request.query['hub.challenge'];
  const token = request.query['hub.verify_token'];
  const verificationToken = process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

  if (mode && token && mode === 'subscribe' && token === verificationToken) {
    return response.status(200).send(challenge);
  } else {
    return response.sendStatus(403); // O cualquier otro código
  }

    } 


        @Post('/webhook')
        @HttpCode(200)
        async handleIncomingWhatsappMessage(@Body() request:any){

            const {messages} =request?.entry?.[0]?.changes?.[0].value ?? {};
            if (!messages) return;

            const message = messages[0];
            const messageSender = message.from;
            const messageID = message.id;
          

            switch(message.type){
                  case 'text':
                    const text =message.text.body;
                    await this.whatsAppService.sendWhatssappMessage(messageSender,text,messageID);
                  
                    
                    break;

                  /*  const aiResponse = await this.openaiService.generateAIResponse(
                      messageSender,
                      transcribedSpeech.data,
                    );*/
            }

     return 'message procesado';
        }




}
