import { Global, Module } from '@nestjs/common';

import { ConfigService } from './config/config.service';
import { DocusignService } from './config/docusign.service';

@Global()
@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(`config/${process.env.NODE_ENV}.env`),
        },
        DocusignService
    ],
    exports: [ConfigService, DocusignService],
})
export class SharedModule {}
