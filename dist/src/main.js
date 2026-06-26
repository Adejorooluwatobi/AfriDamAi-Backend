"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const logging_interceptor_1 = require("./shared/interceptors/logging.interceptor");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const helmet_1 = __importDefault(require("helmet"));
const compression = require('compression');
async function bootstrap() {
    const logger = new common_1.Logger('AfriDam_Bootstrap');
    logger.log('Starting application bootstrap...');
    let app;
    try {
        app = await core_1.NestFactory.create(app_module_1.AppModule);
        logger.log('Nest application instance created successfully.');
    }
    catch (error) {
        logger.error('Failed to create Nest application instance:', error);
        process.exit(1);
    }
    app.getHttpAdapter().getInstance().set('trust proxy', 1);
    app.use((0, helmet_1.default)({
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
        verify: (req, res, buf) => {
            if (req.url.includes('/webhooks')) {
                req.rawBody = buf.toString();
            }
        },
    }));
    app.use(require('express').urlencoded({ limit: '10mb', extended: true }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    app.useGlobalPipes(new common_1.ValidationPipe({
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
                'https://afridam-backend-prod-107032494605.us-central1.run.app',
            ];
            const isLocal = !origin || origin.startsWith('http://localhost') || origin.startsWith('http://172.');
            const isVercel = origin?.endsWith('.vercel.app');
            const isAfridam = origin?.endsWith('.afridamai.com');
            if (isLocal || isVercel || isAfridam || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                logger.warn(`CORS blocked for origin: ${origin}`);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    });
    app.setGlobalPrefix('api', { exclude: ['/'] });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AFRIDAM AI API')
        .setDescription('The Center of Truth: Clinical, Financial, and AI endpoints')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    app.useStaticAssets((0, path_1.join)(process.cwd(), 'uploads'), {
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
    }
    catch (err) {
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
//# sourceMappingURL=main.js.map