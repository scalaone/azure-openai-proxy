import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getCompletions(
    endpoint: string,
    deployment_id: string,
    azureApiKey: string,
    body: any,
  ) {
    let url = `${endpoint}/openai/deployments/${deployment_id}/chat/completions?api-version=2023-03-15-preview`;
    let headers = {
      'api-key': azureApiKey,
      'Content-Type': 'application/json',
    };
    let ret = this.httpService.post(url, body, { headers: headers });
    return await firstValueFrom(ret);
  }
}
