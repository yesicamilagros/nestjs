import { Injectable } from '@nestjs/common';

import { catchError,lastValueFrom, map } from 'rxjs';
import {HttpService} from '@nestjs/axios';
import { BadRequestException,Controller ,Get,Req,Post,HttpCode, Body, BadGatewayException,Logger,} from '@nestjs/common';
import { Request, response } from 'express';
import * as process from 'node:process';
import axios, { AxiosRequestConfig } from 'axios';
import {OpenaiService} from 'src/openai/openai.service';
import * as path from 'path';

@Injectable()
export class WhatsappService {
       constructor(private readonly openaiService: OpenaiService){}


       private readonly httpService =new HttpService();                                        //constructor(private httpService:HttpService){}
       private readonly logger =new Logger(WhatsappService.name);
       private readonly url = `https://graph.facebook.com/${process.env.WHATSAP_VERSION}/${process.env.phone_nu_id}/messages`;
  private readonly config = {
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN}`,
    },
  };

    async sendWhatssappMessage(messageSender :string
                                   ,userInput :string
                                   ,messageID : string,){


        const aiResponse =await this.openaiService.generateAIresponse(messageSender,userInput,);


        
        

         const data =JSON.stringify({
                                            
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: messageSender,
          context: {
            message_id: messageID,
          },
          type: 'text',
          text: {
            preview_url: false,
            body: aiResponse,
          },
 


                    });

                
                    try {
                      const response = this.httpService
                        .post(this.url, data, this.config)
                        .pipe(
                          map((res) => {
                            return res.data;
                          }),
                        )
                        .pipe(
                          catchError((error) => {
                            this.logger.error(error);
                            throw new BadRequestException(
                              'Error Posting To WhatsApp Cloud API',
                            );
                          }),
                        );
                
                      const messageSendingStatus = await lastValueFrom(response);
                      this.logger.log('Message Sent. Status:', messageSendingStatus);
                    } catch (error) {
                      this.logger.error(error);
                      return 'Axle broke!! Abort mission!!';
                    }

    }
}
