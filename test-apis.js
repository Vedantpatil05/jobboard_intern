#!/usr/bin/env node

// Test script to check API endpoints
const http = require('http');

const BACKEND_URL = 'http://localhost:5000';

async function testAPI() {
  console.log('🔍 Testing Backend APIs...\n');

  // Test 1: Skill Stats
  console.log('1. Testing /api/stats/skill-stats...');
  try {
    const skillStats = await makeRequest('/api/stats/skill-stats');
    console.log('✅ Skill Stats Response:');
    console.log(JSON.stringify(skillStats, null, 2));
    console.log('\n');
  } catch (error) {
    console.log('❌ Skill Stats Error:', error.message);
  }

  // Test 2: Match Data
  console.log('2. Testing /api/match/match...');
  try {
    const matchData = await makeRequest('/api/match/match');
    console.log('✅ Match Data Response:');
    console.log(`Found ${matchData.matches?.length || 0} jobs`);
    if (matchData.matches?.length > 0) {
      console.log('First job:', JSON.stringify(matchData.matches[0], null, 2));
    }
    console.log('\n');
  } catch (error) {
    console.log('❌ Match Data Error:', error.message);
  }

  // Test 3: Job Match (if we have job IDs)
  const matchResponse = await makeRequest('/api/match/match').catch(() => ({}));
  if (matchResponse.matches?.length > 0) {
    const firstJobId = matchResponse.matches[0].jobId;
    console.log(`3. Testing /api/stats/job-match/${firstJobId}...`);
    try {
      const jobMatch = await makeRequest(`/api/stats/job-match/${firstJobId}`);
      console.log('✅ Job Match Response:');
      console.log(JSON.stringify(jobMatch, null, 2));
      console.log('\n');
    } catch (error) {
      console.log('❌ Job Match Error:', error.message);
    }
  }

  console.log('🏁 API Testing Complete');
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = `${BACKEND_URL}${path}`;
    const req = http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run tests
testAPI().catch(console.error);
