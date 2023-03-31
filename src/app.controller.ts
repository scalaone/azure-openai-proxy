import { Controller, Get, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('completions')
  completions(@Req() request: Request, @Res() res: Response) {
    let auth = request.headers['authorization'];
    let apiKey = auth.replace('Bearer ', '');
    let [resource_id, deployment_id, azureApiKey] = apiKey.split(':');
    let endpoint = `https://${resource_id}.openai.azure.com`;
    res.header('Content-Type', 'text/event-stream');
    res.header('Transfer-Encoding', 'chunked');
    this.appService
      .getCompletions(endpoint, deployment_id, azureApiKey, request.body)
      .subscribe({
        next: (data) => {
          res.status(HttpStatus.OK).send(data.data);
        },
      });
  }
}
