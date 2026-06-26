"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TOKEN_EXPIRATION = exports.JWT_SECRET = void 0;
exports.JWT_SECRET = process.env.JWT_SECRET || 'fallback-development-secret-change-in-production';
exports.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '24h';
//# sourceMappingURL=constants.js.map