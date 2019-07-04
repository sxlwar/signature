
export interface SignResponse {
  status: number;
  description: string;
}

export interface SignRequest {
  title: string;
  email: string;
  subject: string;
  message: string;
  fileName: string;
}
