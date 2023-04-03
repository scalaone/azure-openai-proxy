import { Controller, Get, Header, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('models')
  models() {
    return this.appService.getModels();
  }
}

@Controller('chat')
export class ChatController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('completions')
  async completions(@Req() request: Request, @Res() res: Response) {
    const auth = request.headers['authorization'];
    const apiKey = auth.replace('Bearer ', '');
    const [resource_id, deployment_id, azureApiKey] = apiKey.split(':');
    const endpoint = `https://${resource_id}.openai.azure.com`;
    const response = await this.appService
      .getCompletions(endpoint, deployment_id, azureApiKey, request.body);
    const stream = response.data;
    res.header('Content-Type', stream.headers['content-type']);
    res.header('Transfer-Encoding', stream.headers['transfer-encoding']);
    res.statusCode = stream.statusCode;
    stream.on('data', data => {
      // console.log('date : ', new Date().toISOString());
      // console.log('data : ', data.toString());
      res.write(data);
    });
    stream.on('end', () => {
      res.end();
    });
  }
}
