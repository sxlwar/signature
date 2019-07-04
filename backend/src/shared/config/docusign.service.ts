import { Injectable } from '@nestjs/common';

import * as docusign from 'docusign-esign';
import { readFileSync } from 'fs';

import { ConfigService } from './config.service';
import { Docusign } from 'typings/docusign';

export interface Sign {
  title: string;
  email: string;
  subject: string;
  message: string;
  fileName: string;
}

export interface SignInfo extends Sign {
  filePath: string;
}

export interface SignResponse {
  status: string;
  description: string;
  envelopeId?: string;
}

export interface SignRequest extends Sign {}

@Injectable()
export class DocusignService {
  private readonly apiClient = new docusign.ApiClient();
  private readonly basePath = 'https://demo.docusign.net/restapi';

  private response: Docusign.CreateEnvelopeResponse;

  constructor(private configService: ConfigService) {
    this.initClient();
  }

  initClient() {
    this.apiClient.setBasePath(this.basePath);
    this.apiClient.addDefaultHeader(
      'Authorization',
      'Bearer ' + this.configService.accessToken,
    );
    // Set the DocuSign SDK components to use the apiClient object
    docusign.Configuration.default.setDefaultApiClient(this.apiClient);
  }

  /**
   * Send specific pdf to file to the target email address;
   */
  async sendToSign(info: SignInfo): Promise<SignResponse> {
    const { email, subject, message, fileName, filePath, title } = info;
    const pdfBase64 = readFileSync(filePath).toString('base64');
    const envelope = new docusign.EnvelopeDefinition();
    const doc = docusign.Document.constructFromObject({
      documentBase64: pdfBase64,
      fileExtension: 'pdf',
      name: fileName,
      documentId: '1',
    });

    // Create a documents object array for the envelope definition and add the doc object
    envelope.documents = [doc];
    envelope.emailSubject = subject;
    envelope.emailBlurb = message;
    envelope.recipients = docusign.Recipients.constructFromObject({
      signers: [this.getSignerInfo(title, email)],
    });
    // Set the Envelope status. For drafts, use 'created' To send the envelope right away, use 'sent'
    envelope.status = 'sent';

    const envelopesApi = new docusign.EnvelopesApi();
    let result: Docusign.CreateEnvelopeResponse;

    try {
      result = await envelopesApi.createEnvelope(this.configService.accountId, {
        envelopeDefinition: envelope,
      });
    } catch (e) {
      const body = e.response && e.response.body;
      if (body) {
        console.error('Email send failed!');

        return {
          status: e.response.status,
          description: JSON.stringify(body, null, 4),
        };
      } else {
        throw e;
      }
    }

    if (result) {
      this.response = result;
      const { envelopeId, status } = result;
     
      console.log(`===============\n${JSON.stringify(this.response)}\n================`);
      return {
        status,
        envelopeId,
        description: `Email has been send to ${email}, please check to sign it.`,
      };
    }
  }

  /**
   * @param name signer's title
   * @param email signer's email
   * @description Create singer, set the location of the signature at the same time.
   */
  getSignerInfo(name: string, email: string): any {
    // Create the signer object with  provided name / email address
    const signer = docusign.Signer.constructFromObject({
      name, // Recipient's title
      routingOrder: '1',
      recipientId: '1',
      email,
    });

    // Create the signHere tab to be placed on the envelope
    const signHere = docusign.SignHere.constructFromObject({
      documentId: '1',
      pageNumber: '1',
      recipientId: '1',
      tabLabel: 'SignHereTab',
      xPosition: '195',
      yPosition: '147',
    });

    // Create the overall tabs object for the signer and add the signHere tabs array
    // Note that tabs are relative to receipients/signers.
    signer.tabs = docusign.Tabs.constructFromObject({
      signHereTabs: [signHere],
    });

    return signer;
  }

  async getSignedDocument(): Promise<FormData> {
    const { envelopeId } = this.response;
    const envelopesApi = new docusign.EnvelopesApi();

    return envelopesApi.getFormData(this.configService.accountId, envelopeId);
  }
}
