import { GoogleAuth } from 'google-auth-library';

async function testGoogleAuth() {
    try {
        console.log('Starting auth test...');

        const auth = new GoogleAuth({
            credentials: {
                client_email: "aiwb1-851@eng-venture-439304-b2.iam.gserviceaccount.com",
                private_key: process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON!,
                project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
            },
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
        console.log('API Response:', await response.text());

    } catch (error) {
        console.error('Auth Test Error:', error);
    }
}

// Run the test
testGoogleAuth();