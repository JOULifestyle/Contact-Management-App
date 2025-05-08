const fs = require('fs');
const path = require('path');

const connectAPIUI = () => {
    const frontendPath = path.join(__dirname, '../frontend');
    const scriptPath = path.join(frontendPath, 'script.js');

    const scriptContent = fs.readFileSync(scriptPath, 'utf-8');
    const updatedScriptContent = scriptContent.replace(
        /fetch\('\/api\/contacts'/g,
        `fetch('http://localhost:3000/api/contacts'`
    );

    fs.writeFileSync(scriptPath, updatedScriptContent);

    console.log('API and UI connected successfully');
};

module.exports = connectAPIUI;