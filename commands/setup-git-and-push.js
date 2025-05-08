const { exec } = require('child_process');

const setupGitAndPush = () => {
    const gitCommands = [
        'git init',
        'git add .',
        'git commit -m "Initial commit"',
        'git branch -M main',
        'git remote add origin https://github.com/yourusername/your-repo.git',
        'git push -u origin main'
    ];

    const executeCommands = (commands, index = 0) => {
        if (index === commands.length) {
            console.log('Git setup and push completed successfully');
            return;
        }

        exec(commands[index], (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${commands[index]}`);
                console.error(error);
                return;
            }
            console.log(stdout);
            executeCommands(commands, index + 1);
        });
    };

    // Create .gitignore
    const gitignoreContent = `
node_modules
.env
`;
    fs.writeFileSync('.gitignore', gitignoreContent);

    executeCommands(gitCommands);
};

module.exports = setupGitAndPush;