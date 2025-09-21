"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const health_service_1 = require("./health.service");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async check() {
        return this.healthService.check();
    }
    async checkDatabase() {
        return this.healthService.checkDatabase();
    }
    async getInfo() {
        return this.healthService.getSystemInfo();
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '헬스체크',
        description: '애플리케이션의 상태를 확인합니다.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '애플리케이션 정상',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                uptime: { type: 'number', example: 12345 },
                version: { type: 'string', example: '2.0.0' },
                environment: { type: 'string', example: 'development' },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('database'),
    (0, swagger_1.ApiOperation)({
        summary: '데이터베이스 헬스체크',
        description: '데이터베이스 연결 상태를 확인합니다.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '데이터베이스 연결 정상',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'ok' },
                database: { type: 'string', example: 'connected' },
                timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: '데이터베이스 연결 실패',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkDatabase", null);
__decorate([
    (0, common_1.Get)('info'),
    (0, swagger_1.ApiOperation)({
        summary: '시스템 정보',
        description: '시스템 및 애플리케이션 정보를 조회합니다.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '시스템 정보 조회 성공',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getInfo", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map