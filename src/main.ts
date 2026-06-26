import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

const compression = require('compression');

async function bootstrap() {
  const logger = new Logger('AfriDam_Bootstrap');
  logger.log('Starting application bootstrap...');
  
  let app: NestExpressApplication;
  try {
    app = await NestFactory.create<NestExpressApplication>(AppModule);
    logger.log('Nest application instance created successfully.');
  } catch (error) {
    logger.error('Failed to create Nest application instance:', error);
    process.exit(1);
  }
  
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // ... (rest of the configuration remains the same)
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", "data:", "https:", "http:", "http://172.20.10.6:*"], 
      },
    },
  }));
  
  app.use(compression());
  
  app.use(require('express').json({
    limit: '10mb',
    verify: (req: any, res: any, buf: Buffer) => {
      if (req.url.includes('/webhooks')) {
        req.rawBody = buf.toString();
      }
    },
  }));
  app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true,
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    skipMissingProperties: false,
  }));

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'https://specialist.afridamai.com', 
        'https://app.afridamai.com', 
        'https://admin.afridamai.com',
        'https://afridamai.com',
        'https://vendor.afridamai.com',
        'https://afridam-backend-prod-107032494605.us-central1.run.app', // Added production URL
      ];
      
      // Allow localhost and local network IPs for development
      const isLocal = !origin || origin.startsWith('http://localhost') || origin.startsWith('http://172.');
      const isVercel = origin?.endsWith('.vercel.app');
      const isAfridam = origin?.endsWith('.afridamai.com');

      if (isLocal || isVercel || isAfridam || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`CORS blocked for origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  });
  
  app.setGlobalPrefix('api', { exclude: ['/'] });

  const config = new DocumentBuilder()
    .setTitle('AFRIDAM AI API')
    .setDescription('The Center of Truth: Clinical, Financial, and AI endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
    maxAge: '1d',
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 8080;
  
  try {
    logger.log(`🚀 Application ready. Attempting to bind on port: ${port}`);
    const server = await app.listen(port, '0.0.0.0');
    server.setTimeout(0); 
    server.keepAliveTimeout = 65000;
    
    logger.log(`
🚀 AFRIDAM AI LIVE
🏠 Local: http://localhost:${port}/api
📱 Network: http://172.20.10.6:${port}/api
📄 Docs: http://172.20.10.6:${port}/api/docs
    `);
  } catch (err) {
    logger.error(`❌ TCP BIND FAILURE on port ${port}:`, err);
    if (err.code === 'EADDRINUSE') {
      logger.error(`Port ${port} is already in use.`);
    }
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ UNCAUGHT STARTUP ERROR:', error);
  process.exit(1);
});
