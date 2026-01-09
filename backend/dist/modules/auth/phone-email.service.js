"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhoneEmailService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let PhoneEmailService = class PhoneEmailService {
    async verifyPhoneToken(userJsonUrl) {
        try {
            const response = await axios_1.default.get(userJsonUrl);
            const jsonData = response.data;
            const user_country_code = jsonData.user_country_code;
            const user_phone_number = jsonData.user_phone_number;
            if (!user_phone_number) {
                throw new Error('Phone number missing in response');
            }
            return {
                valid: true,
                phone: `${user_country_code}${user_phone_number}`,
                countryCode: user_country_code,
                phoneNumber: user_phone_number
            };
        }
        catch (error) {
            console.error('Phone.Email Verification Error:', error.message);
            throw new common_1.UnauthorizedException('Invalid Phone Auth URL');
        }
    }
};
exports.PhoneEmailService = PhoneEmailService;
exports.PhoneEmailService = PhoneEmailService = __decorate([
    (0, common_1.Injectable)()
], PhoneEmailService);
//# sourceMappingURL=phone-email.service.js.map