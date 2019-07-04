export declare module Docusign {
    interface ApiClient {
      constructor()
    }

  interface createEnvelope {
    (
      accountId: string,
      options: { [key: string]: any },
      callback: (...arg: any[]) => any,
    );
  }

  interface CreateEnvelopeResponse {
    envelopeId: string;
    statusDateTime: string;
    status: string;
    uri: string;
  }
}
