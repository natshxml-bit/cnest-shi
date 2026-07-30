"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    app.enableCors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : true,
        methods: 'GET,HEAD,OPTIONS',
    });
    await app.listen(process.env.PORT ?? 3000);
    console.log(`cnest jalan di http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap();
//# sourceMappingURL=main.js.map