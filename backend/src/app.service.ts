import { Injectable } from '@nestjs/common';
import { readFile } from 'fs';
import { resolve } from 'path';
import {
  DocusignService,
  SignResponse,
  SignInfo,
  SignRequest,
} from './shared/config/docusign.service';

@Injectable()
export class AppService {
  constructor(private docusignService: DocusignService) {}

  async getFile(fileName: string): Promise<Buffer> {
    return new Promise((resolve, _) => {
      const path = this.getPath(fileName);

      readFile(path, (err: NodeJS.ErrnoException, data: Buffer) => {
        if (err) {
          console.error('File not found!');
          resolve(Buffer.from(''));
        }
        resolve(data);
      });
    });
  }

  sign(data: SignRequest): Promise<SignResponse> {
    const { fileName } = data;
    const filePath = this.getPath(fileName);
    
    return this.docusignService.sendToSign({ ...data, filePath });
  }

  getSignedFile(): Promise<FormData> {
      return this.docusignService.getSignedDocument();
  }

  private getPath(fileName: string): string {
    return resolve(__dirname, `static/${fileName}.pdf`);
  }
}
