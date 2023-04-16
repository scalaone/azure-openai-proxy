import { HttpService } from '@nestjs/axios';
import { Header, Injectable, Logger } from '@nestjs/common';
import { models } from './models';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly httpService: HttpService) {}

  @Header('Content-Type', 'application/json')
  getModels() {
    return models;
  }

  getVersion(): string {
    return 'Hello World! 2.0';
  }

  async getCompletions(
    endpoint: string,
    mapping: string,
    azureApiKey: string,
    body: any,
    stream: boolean,
    apiVersion: string,
  ) {
    const deployment_id = this.getDeploymentId(mapping, body['model']);
    this.logger.debug(`deployment_id: ${deployment_id}`);
    const url = `${endpoint}/openai/deployments/${deployment_id}/chat/completions?api-version=${apiVersion}`;
    const headers = {
      'api-key': azureApiKey,
      'Content-Type': 'application/json',
    };
    const config = { headers: headers };
    if (stream) {
      config['responseType'] = 'stream';
    }
    const ret = this.httpService.post(url, body, config);
    try {
      return await firstValueFrom(ret);
    } catch (e) {
      return e.response;
    }
  }
  private getDeploymentId(mapping: string, model: string): string {
    this.logger.debug(`mapping: ${mapping}, model: ${model}`);
    if (mapping.includes(',')) {
      let defaultDeploymentId = '';
      const modelMapping = mapping.split(',').reduce((acc: Record<string, string>, pair: string) => {
        const [key, value] = pair.split('|');
        if (defaultDeploymentId === '') defaultDeploymentId = value;
        acc[key] = value;
        return acc;
      }, {});
      if (!model) {
        return defaultDeploymentId;
      }
      const deploymentId = modelMapping[model];
      return deploymentId || defaultDeploymentId;
    } else {
      return mapping;
    }
  }
}
