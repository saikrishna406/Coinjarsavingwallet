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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let PaymentsService = class PaymentsService {
    constructor(configService) {
        this.configService = configService;
    }
    async verifyUpiId(vpa) {
        const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{3,}$/;
        if (!upiRegex.test(vpa)) {
            return { valid: false, verified: false, message: 'Invalid UPI ID format' };
        }
        const knownHandles = ["okicici", "okhdfc", "ybl", "paytm", "oksbi", "upi", "axl", "ibl", "paylm"];
        const handle = vpa.split("@")[1];
        const isKnownProvider = knownHandles.includes(handle.toLowerCase());
        if (!isKnownProvider) {
            console.warn(`Warning: Unknown UPI provider handle '@${handle}'`);
        }
        return {
            valid: true,
            verified: false,
            name: 'User (Unverified)',
            message: 'UPI ID saved (not bank-verified)'
        };
    }
    async initiateMockPayment(amount, upiId) {
        if (amount <= 0) {
            throw new common_1.BadRequestException('Amount must be greater than 0');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            success: true,
            message: 'Payment simulated successfully',
            transactionId: 'txn_mock_' + Date.now(),
            amount,
            upiId
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map