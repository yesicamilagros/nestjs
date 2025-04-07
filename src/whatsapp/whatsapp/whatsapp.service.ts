import { Injectable } from '@nestjs/common';
import { catchError,lastValueFrom, map } from 'rxjs';
import {HttpService} from '@nestjs/axios';
import { BadRequestException,Controller ,Get,Req,Post,HttpCode, Body, BadGatewayException,Logger,} from '@nestjs/common';
import { Request, response } from 'express';
import * as process from 'node:process';
import {OpenaiService} from 'src/openai/openai.service';

@Injectable()
export class WhatsappService {
       constructor(private readonly openaiService: OpenaiService){}


       private readonly httpService =new HttpService();                                        //constructor(private httpService:HttpService){}
       private readonly logger =new Logger(WhatsappService.name);

    async sendWhatssappMessage(messageSender :string,userInput :string){
        const aiResponse =await this.openaiService.generateAIresponse(userInput);
        const url =  `https://graph.facebook.com/${process.env.WHATSAP_VERSION}/${process.env.phone_nu_id}/messages`;
        const config = {
                        
                        
                        headers: { 
                          'Content-Type': 'application/json', 
                          'Authorization': `Bearer ${process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN}`,
                        },
                       
                      };

         const data =JSON.stringify({
                                            
                         "messaging_product": "whatsapp",    
                        "recipient_type": "individual",
                        "to": messageSender,
                        "type": "text",
                        "text": {
                            "preview_url": false,
                            "body": aiResponse,
                        },
 


                    });

                
                    try{
                        const response = this.httpService.post(url,data,config).pipe( map((res  )=> {return res.data;}),).
                                                  pipe(
                                                    catchError( (error) =>{
                                                        this.logger.error(error);
                                                        throw new BadGatewayException( 'error posting a whatssapp cloud');
                                                    }),
                                                  );

                                                  const messageSendingStatus =await lastValueFrom(response);
                                                  this.logger.log('mesage send status',messageSendingStatus);

                    } catch(error){
                        this.logger.error(error);
                        return 'axle broken abbort mission'
                    }

    }
}
