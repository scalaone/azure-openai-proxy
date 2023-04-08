import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AxiosHeaders } from 'axios';
import { Request, Response } from 'express';
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
    return this.appService.getVersion();
  }

  @Post('completions')
  async completions(@Req() request: Request, @Res() res: Response) {
    const auth = request.headers['authorization'];
    const apiKey = auth.replace('Bearer ', '');
    const [resource_id, deployment_id, azureApiKey] = apiKey.split(':');
    const endpoint = `https://${resource_id}.openai.azure.com`;
    const stream = request.body['stream'];
    const response = await this.appService.getCompletions(
      endpoint,
      deployment_id,
      azureApiKey,
      request.body,
      stream,
    );

    // set response headers
    for (const [key, value] of response.headers as AxiosHeaders) {
      res.header[key] = value;
    }
    res.status(response.status);
    if (stream) {
      const streamData = response.data;
      streamData.on('data', (data) => {
        res.write(data);
      });
      streamData.on('end', () => {
        res.end();
      });
    } else {
      res.send(response.data);
    }
  }
}
