// Simple test to check if our calculations are working
const fs = require('fs');
const path = require('path');

// Test the skill stats calculation
async function testSkillStats() {
  console.log('🧪 Testing Skill Stats Calculation...\n');

  try {
    // Read the data files
    const categoryRoadmapPath = path.join(process.cwd(), 'data', 'categorywiseroadmap.json');
    const completedRoadmapPath = path.join(process.cwd(), 'data', 'completedroadmapdata.json');
    const preassessmentsPath = path.join(process.cwd(), 'data', 'edquest.edquest.preassesments.json');
    const userPath = path.join(process.cwd(), 'data', 'user.json');

    const categoryRoadmapData = JSON.parse(fs.readFileSync(categoryRoadmapPath, 'utf-8'));
    const completedRoadmapData = JSON.parse(fs.readFileSync(completedRoadmapPath, 'utf-8'));
    const preassessmentsData = JSON.parse(fs.readFileSync(preassessmentsPath, 'utf-8'));
    const userData = JSON.parse(fs.readFileSync(userPath, 'utf-8'));

    console.log('✅ All data files loaded successfully');

    // Calculate skill score
    const totalRoadmaps = categoryRoadmapData.reduce((sum, category) => sum + category.total_roadmaps, 0);
    const userCompletedData = completedRoadmapData[0] || {};
    const completedRoadmaps = Object.keys(userCompletedData)
      .filter(key => key !== '_id')
      .reduce((sum, key) => sum + (userCompletedData[key] || 0), 0);

    const skillScore = totalRoadmaps > 0 ? Math.round((completedRoadmaps / totalRoadmaps) * 100) : 0;

    // Calculate personality score
    const userPreassessments = preassessmentsData.find((p) => p.user_uid === userData.user_uid) || preassessmentsData[0];
    const personalityCategoryScores = userPreassessments?.personality_category_scores || {};
    const personalityCategories = Object.values(personalityCategoryScores);
    const personaScore = personalityCategories.length > 0
      ? Math.round(personalityCategories.reduce((sum, score) => sum + score, 0) / personalityCategories.length)
      : 0;

    const overallScore = Math.round((skillScore * 0.7) + (personaScore * 0.3));

    console.log('\n📊 CALCULATION RESULTS:');
    console.log(`Total roadmaps: ${totalRoadmaps}`);
    console.log(`Completed roadmaps: ${completedRoadmaps}`);
    console.log(`Skill score: ${skillScore}%`);
    console.log(`Persona score: ${personaScore}%`);
    console.log(`Overall score: ${overallScore}%`);

    console.log('\n📋 DETAILED BREAKDOWN:');
    categoryRoadmapData.forEach(category => {
      const completed = userCompletedData[category.category] || 0;
      const percentage = category.total_roadmaps > 0 ? Math.round((completed / category.total_roadmaps) * 100) : 0;
      console.log(`${category.category}: ${completed}/${category.total_roadmaps} (${percentage}%)`);
    });

    console.log('\n🎯 PERSONALITY SCORES:');
    Object.entries(personalityCategoryScores).forEach(([category, score]) => {
      console.log(`${category}: ${score}`);
    });

    return {
      skillScore,
      personaScore,
      overallScore,
      totalRoadmaps,
      completedRoadmaps
    };

  } catch (error) {
    console.error('❌ Error during calculation:', error.message);
    return null;
  }
}

// Run the test
testSkillStats().then(result => {
  if (result) {
    console.log('\n✅ Test completed successfully!');
    console.log('Expected SkillPassport values:', {
      overall: result.overallScore,
      skillScore: result.skillScore,
      personaScore: result.personaScore
    });
  } else {
    console.log('\n❌ Test failed!');
  }
}).catch(console.error);
