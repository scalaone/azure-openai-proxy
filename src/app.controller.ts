import { Controller, Get, Post, Req, Res, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { AxiosHeaders } from 'axios';
import { AppService } from './app.service';

const DEFAULT_API_VERSION = '2023-03-15-preview';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('models')
  getModels() {
    return this.appService.getModels();
  }
}

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly appService: AppService) {}

  @Get()
  getVersion(): string {
    return this.appService.getVersion();
  }

  @Post('completions')
  async postCompletions(@Req() request: Request, @Res() response: Response) {
    const auth = request.headers['authorization'];
    const apiKey = auth.replace('Bearer ', '');
    const [resourceId, deploymentId, azureApiKey, apiVersion] = apiKey.split(':');
    this.logger.debug(
      `resourceId: ${resourceId}, deploymentId: ${deploymentId}, azureApiKey: ${azureApiKey}, apiVersion: ${apiVersion}`,
    );

    const endpoint = `https://${resourceId}.openai.azure.com`;
    const stream = request.body['stream'];
    const openaiResponse = await this.appService.getCompletions(
      endpoint,
      deploymentId,
      azureApiKey,
      request.body,
      stream,
      apiVersion || DEFAULT_API_VERSION,
    );

    // Set response headers
    if (openaiResponse.headers instanceof Array) {
      for (const [key, value] of openaiResponse.headers as AxiosHeaders) {
        response.header[key] = value;
      }
    }

    if (openaiResponse.status < 200 || openaiResponse.status >= 300) {
      this.logger.error(
        `The OpenAI has returned an error with status code ${openaiResponse.status} and message ${openaiResponse.statusText}`,
      );
    }

    response.status(openaiResponse.status);

    if (stream) {
      const streamData = openaiResponse.data;
      streamData.on('data', (data) => {
        // Checks for the specific newline character returned by Azure OpenAI and
        // replaces it with the expected newline character used by OpenAI
        const decodedData = data.toString('utf8');
        if (decodedData.includes('data: [DONE]')) {
          response.write(`${decodedData}\n`);
        } else {
          response.write(data);
        }
      });
      streamData.on('end', () => {
        response.end();
      });
    } else {
      response.send(openaiResponse.data);
    }
  }
}
