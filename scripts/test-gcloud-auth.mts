import { GoogleAuth } from 'google-auth-library';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGoogleAuth() {
    try {
        console.log('Starting auth test...');

        // Get credentials from environment variable
        const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
        if (!credentialsJson) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set');
        }

        // Decode and parse credentials
        const credentials = JSON.parse(Buffer.from(credentialsJson, 'base64').toString());

        console.log('Credentials parsed successfully');
        console.log('Project ID:', credentials.project_id);
        console.log('Client Email:', credentials.client_email);

        const auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/cloud-platform']
        });

        console.log('Auth client created');

        // Test getting the client
        const client = await auth.getClient();
        console.log('Got client');

        // Test getting an access token
        const token = await client.getAccessToken();
        console.log('Got access token:', token.token ? 'Yes' : 'No');

        // Test making a simple API call
        const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const LOCATION = 'us-east5';

        const testUrl = `https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/anthropic/models`;

        const response = await fetch(testUrl, {
            headers: {
                'Authorization': `Bearer ${token.token}`,
            },
        });

        console.log('API Response Status:', response.status);
        const responseText = await response.text();
        console.log('API Response:', responseText);

    } catch (error) {
        console.error('Auth Test Error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
    }
}

// Run the test
testGoogleAuth(); 