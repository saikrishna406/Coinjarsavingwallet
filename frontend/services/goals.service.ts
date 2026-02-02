const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || (isProduction ? '/api' : 'http://localhost:3002/api');
const API_URL = `${BASE_URL}/goals`;

export const GoalsService = {
    getGoals: async (token: string) => {
        const res = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch goals');
        }

        return await res.json();
    },

    createGoal: async (token: string, goalData: any) => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(goalData)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to create goal');
        }

        return await res.json();
    },

    addSavings: async (token: string, goalId: string, amount: number) => {
        const res = await fetch(`${API_URL}/${goalId}/add-savings`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to add savings');
        }

        return await res.json();
    },

    withdrawFunds: async (token: string, goalId: string, amount: number) => {
        const res = await fetch(`${API_URL}/${goalId}/withdraw`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'Failed to withdraw funds');
        }

        return await res.json();
    }
};
