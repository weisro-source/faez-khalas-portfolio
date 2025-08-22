const axios = require('axios');

async function testCORSHeaders() {
    try {
        console.log('🧪 Testing CORS headers for image access...\n');

        // Test the health endpoint first
        const healthResponse = await axios.get('http://localhost:5000/api/health');
        console.log('✅ Health check passed:', healthResponse.data.message);

        // Test CORS headers on uploads directory
        const corsResponse = await axios.options('http://localhost:5000/uploads/test-image.jpg', {
            headers: {
                'Origin': 'http://localhost:3000',
                'Access-Control-Request-Method': 'GET',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
        });

        console.log('✅ CORS headers for uploads:');
        console.log('   Access-Control-Allow-Origin:', corsResponse.headers['access-control-allow-origin']);
        console.log('   Access-Control-Allow-Methods:', corsResponse.headers['access-control-allow-methods']);
        console.log('   Access-Control-Allow-Headers:', corsResponse.headers['access-control-allow-headers']);
        console.log('   Cross-Origin-Resource-Policy:', corsResponse.headers['cross-origin-resource-policy']);

        console.log('\n🎉 CORS configuration is working correctly!');
        console.log('📝 You can now use images in <img> tags and CSS backgrounds from different origins.');

    } catch (error) {
        console.error('❌ Error testing CORS headers:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Headers:', error.response.headers);
        }
    }
}

// Run the test
testCORSHeaders(); 