import { HttpService } from '@nestjs/axios';
import { Header, Injectable } from '@nestjs/common';
import { models } from './models';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  @Header('Content-Type', 'application/json')
  getModels() {
    return models;
  }

  getHello(): string {
    return 'Hello World! 1.4';
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
    const config = { headers: headers };
    if (body['stream']) {
      config['responseType'] = 'stream';
    }
    return await axios.post(url, body, config);
  }
}
