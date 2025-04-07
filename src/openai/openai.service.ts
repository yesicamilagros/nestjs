import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { BadRequestException,Controller ,Get,Req,Post,HttpCode, Body, BadGatewayException,Logger,} from '@nestjs/common';

@Injectable()
export class OpenaiService {
    private readonly OpenAI =new OpenAI({
        apiKey:process.env.OPENAI_API_KEY,


    });
    private readonly logger =new Logger(OpenaiService.name)

    async generateAIresponse(userInput :string){
       try{
          const response  =await this.OpenAI.chat.completions.create({
                  messages :[{role:'user',content:userInput}],
                model : process.env.MODEL_OPENAI ||  'gpt-4o',
                 
          }); 

          return response.choices[0].message.content;
       } catch(error){
          this.logger.error('error generado AI Response',error)
           return 'lo siento  no puedo definir tu solicitud,por el momento' ;
       }

    }

}
