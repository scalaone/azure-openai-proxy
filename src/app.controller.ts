import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { CompletionsResp } from './app.model';

@Controller('chat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('completions')
  async completions(@Req() request: Request) {
    let auth = request.headers['authorization'];
    let apiKey = auth.replace('Bearer ', '');
    let [resource_id, deployment_id, azureApiKey] = apiKey.split(':');
    let endpoint = `https://${resource_id}.openai.azure.com`;
    let resp = await this.appService.getCompletions(endpoint, deployment_id, azureApiKey, request.body);
    return resp.data;
  }
}
