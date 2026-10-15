const fs = require('fs');

function searchFile(filename, targets) {
  console.log(`=== Searching in ${filename} ===`);
  const lines = fs.readFileSync(filename, 'utf8').split('\n');
  targets.forEach(t => {
    lines.forEach((line, idx) => {
      if (line.includes(t)) {
        if (line.includes('function ') || line.includes('id=') || line.includes('window.' + t) || line.includes('const ' + t) || line.includes('let ' + t) || line.includes('var ' + t)) {
          console.log(`${t} at line ${idx + 1}: ${line.trim().slice(0, 100)}`);
        }
      }
    });
  });
}

searchFile('Index.html', [
  'downloadSampleTemplate',
  'handleImportFileUpload',
  'parseCvFromHtml',
  'confirmMergeImportData',
  'executeExportWord',
  'switchToAdminPortal',
  'renderAdminDashboard',
  'renderAdminCandidatesCards',
  'getCandidatePrefs',
  'importPreviewModal',
  'customSampleModal',
  'loadFullCvData',
  'appData'
]);

searchFile('Code.gs', [
  'getAdminDashboardData',
  'syncAllDataToSheets',
  'updateListSheet',
  'getMultipleFullCVData'
]);

