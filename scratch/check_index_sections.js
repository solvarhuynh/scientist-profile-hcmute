const fs = require('fs');
const content = fs.readFileSync('d:\\khanh\\Index.html', 'utf8');

console.log('Index.html length:', content.length);
console.log('Has updateWelcomeMessage:', content.includes('function updateWelcomeMessage('));
console.log('Has loadFromDatabase:', content.includes('function loadFromDatabase('));
console.log('Has populateBasicInfo:', content.includes('function populateBasicInfo('));
console.log('Has getTeacherHonorific:', content.includes('function getTeacherHonorific('));
console.log('Has toggleEditSave:', content.includes('function toggleEditSave('));

