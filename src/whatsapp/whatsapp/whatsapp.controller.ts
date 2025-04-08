import { BadRequestException,Controller ,Get,Req,Post,HttpCode, Body, BadGatewayException,Logger,} from '@nestjs/common';
import { Request, response } from 'express';
import {HttpService} from '@nestjs/axios';
import * as process from 'node:process';
import { catchError,lastValueFrom, map } from 'rxjs';
import { WhatsappService } from './whatsapp.service';



@Controller('whatsapp')
export class WhatsappController {

   /*private readonly httpService =new HttpService();                                        //constructor(private httpService:HttpService){}
   private readonly logger =new Logger(WhatsappController.name);*/
  constructor(
     private readonly whatsAppService : WhatsappService

  ){}

    @Get('webhook')
    whatsappVerificationChallenge(@Req() request:Request){
        const mode = request.query['hub.mode'] as string;
    const challenge = request.query['hub.challenge'] as string;
    const token = request.query['hub.verify_token'] as string;
    const verificationToken = process.env.WHATSAPP_CLOUD_API_WEBHOOK_VERIFICATION_TOKEN;

   // this.logger.log(`Received: mode=${mode}, token=${token}, challenge=${challenge}`); // Agregamos log para depurar

    // Verificación básica de parámetros
    if (!mode || !token) {
      return 'Error verifying Token';
    }

    // Verificación del token
    if (mode === 'subscribe' && token === verificationToken) {
      return challenge ?? 'Error: No challenge provided'; // Retorna challenge o un mensaje si no está disponible
    }

    return 'Error verifying Token'; // Si no pasa la validación del token
  }

    } 


        @Post('webhook')
        @HttpCode(200)
        async handleIncomingWhatsappMessage( @Body() request:any){

            const {messages} =request?.entry?.[0]?.changes?.[0].value ?? {};
            if (!messages) return;

            const message =messages[0];
            const messageSender=message.from;

            const messageID=message.id;

            switch(message.type){
                  case 'text':
                    const text =message.text.body;
                    await this.whatsAppService.sendWhatssappMessage(messageSender,text);
                  /*  
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
                            "body": "Hola Somos la IA en que podemos ayudarte"
                        },
 


                    });


                    */

                /*    try{
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
  */
                    
                    break;
            }

     return 'message procesado';
        }




}
