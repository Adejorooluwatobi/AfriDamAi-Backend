"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("../../infrastructure/persistence/prisma/prisma.module");
const chat_service_1 = require("../../domain/services/chat.service");
const chat_controller_1 = require("../controllers/chat.controller");
const prisma_chat_repository_1 = require("../../infrastructure/persistence/prisma/prisma-chat.repository");
const shared_module_1 = require("../../shared/shared.module");
const notification_module_1 = require("./notification.module");
const chat_gateway_1 = require("../../shared/websockets/chat.gateway");
const appointment_module_1 = require("./appointment.module");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, shared_module_1.SharedModule, notification_module_1.NotificationModule, appointment_module_1.AppointmentModule],
        controllers: [chat_controller_1.ChatController],
        providers: [
            chat_service_1.ChatService,
            chat_gateway_1.ChatGateway,
            {
                provide: 'IChatRepository',
                useClass: prisma_chat_repository_1.ChatRepository,
            },
        ],
        exports: [chat_service_1.ChatService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map