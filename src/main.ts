import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { configure as serverlessExpress } from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {
  const nestApp = await NestFactory.create(AppModule);
  nestApp.use(helmet());
  nestApp.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  await nestApp.init();
  const expressApp = nestApp.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = cachedServer ?? (await bootstrap());
  return cachedServer(event, context, callback);
};

export { handler };

/*
* import { NestFactory } from '@nestjs/core';
import Helmet from 'helmet';
import { AppModule } from './app.module';

import dotenv from 'dotenv';
import path from 'path';
const paths =path.resolve(__dirname, '../.env');
dotenv.config({ path: paths});

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(Helmet());
  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });

  await app.listen(port);
}

bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
*/
