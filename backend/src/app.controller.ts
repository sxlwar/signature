import { Body, Controller, Header, Post, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { SignResponse, SignRequest } from './shared/config/docusign.service';

class FileRequest {
  fileName: string;
}

@Controller('file')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @Header('Content-type', 'application/pdf')
  async getFile(@Body() req: FileRequest): Promise<string> {
    const buffer = await this.appService.getFile(req.fileName);

    return `data:application/pdf;base64,${Buffer.from(buffer).toString(
      'base64',
    )}`;
  }

  @Post('sign')
  sign(@Body() req: SignRequest): Promise<SignResponse> {
    return this.appService.sign(req);
  }

  @Get('signed')
  getSignedFile(): Promise<FormData> {
    return this.appService.getSignedFile();
  }
}
