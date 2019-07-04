import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

export interface EnvConfig {
    ACCESS_TOKEN: string;
    ACCOUNT_ID: number;
    [key: string]: string | number;
}

@Injectable()
export class ConfigService {
    /**
     * @description Environment variables must be stored in this filed;
     */
    private readonly envConfig: EnvConfig;

    constructor(filePath: string) {
        const config = dotenv.parse(fs.readFileSync(filePath));

        this.envConfig = this.validateInput(config);
    }

    /**
     * @description Validate env variables before app launch;
     */
    private validateInput(envConfig: EnvConfig): EnvConfig {
        const envVarsSchema: Joi.ObjectSchema = Joi.object({
            NODE_ENV: Joi.string()
                .valid(['dev', 'prod'])
                .default('dev'),
            IS_DEV: Joi.boolean().required(),
            ACCESS_TOKEN: Joi.string(),
            ACCOUNT_ID: Joi.number(),
        });
        const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema);

        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        return validatedEnvConfig;
    }

    get accountId (): number {
        return this.envConfig.ACCOUNT_ID;
    }

    get accessToken(): string {
        return this.envConfig.ACCESS_TOKEN;
    }
}
