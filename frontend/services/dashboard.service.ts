const isProduction = process.env.NODE_ENV === 'production';
const API_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');

export const DashboardService = {
    getSummary: async (token: string) => {
        const res = await fetch(`${API_URL}/dashboard/summary`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch dashboard summary');
        }

        return await res.json();
    }
};
