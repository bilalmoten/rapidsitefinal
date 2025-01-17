// utils/vercel.ts
export class VercelDomainAPI {
    private token: string;
    private projectId: string;
    private baseUrl = 'https://api.vercel.com/v9';

    constructor() {
        this.token = process.env.VERCEL_API_TOKEN!;
        this.projectId = process.env.VERCEL_PROJECT_ID!;
    }

    private async fetch(endpoint: string, options?: RequestInit) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
        return response.json();
    }

    async addDomain(domain: string) {
        return this.fetch(`/projects/${this.projectId}/domains`, {
            method: 'POST',
            body: JSON.stringify({ name: domain }),
        });
    }

    // async verifyDomain(domain: string) {
    //     return this.fetch(`/projects/${this.projectId}/domains/${domain}/config`, {
    //         method: 'GET',
    //         // headers: {
    //         //     Authorization: `Bearer ${this.token}`,
    //         // },
    //     });
    // }

    async verifyDomain(domain: string) {
        return this.fetch(`domains/${domain}/config`, {
            method: 'GET',
        });
    }


    async getDomainConfig(domain: string) {
        return this.fetch(`/projects/${this.projectId}/domains/${domain}/config`);
    }

    async removeDomain(domain: string) {
        return this.fetch(`/projects/${this.projectId}/domains/${domain}`, {
            method: 'DELETE',
        });
    }
}