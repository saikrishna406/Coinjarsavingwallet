import { Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PhoneEmailService {

    /**
   * Verifies the User JSON URL from Phone.Email widget
   * The frontend sends the "user_json_url" it received.
   */
    async verifyPhoneToken(userJsonUrl: string) {
        try {
            // Basic security check: Ensure the URL belongs to phone.email
            // (Adjust domain if they use a different CDN, but this is a safe default)
            // if (!userJsonUrl.includes('phone.email')) {
            //   throw new UnauthorizedException('Invalid JSON URL domain');
            // }

            // Fetch the JSON file
            const response = await axios.get(userJsonUrl);
            const jsonData = response.data;

            // Access fields as per user snippet
            const user_country_code = jsonData.user_country_code;
            const user_phone_number = jsonData.user_phone_number;
            // const user_first_name = jsonData.user_first_name;
            // const user_last_name = jsonData.user_last_name;

            if (!user_phone_number) {
                throw new Error('Phone number missing in response');
            }

            return {
                valid: true,
                phone: `${user_country_code}${user_phone_number}`,
                countryCode: user_country_code,
                phoneNumber: user_phone_number
            };

        } catch (error) {
            console.error('Phone.Email Verification Error:', error.message);
            throw new UnauthorizedException('Invalid Phone Auth URL');
        }
    }
}
