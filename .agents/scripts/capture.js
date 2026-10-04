const fs = require('fs');
const path = require('path');

let input = '';

process.stdin.on('data', chunk => {
    input += chunk;
});

process.stdin.on('end', () => {
    try {
        const payload = JSON.parse(input);

        const {
            transcriptPath,
            conversationId,
            modelName
        } = payload;

        if (!transcriptPath || !fs.existsSync(transcriptPath)) {
            console.log(JSON.stringify({}));
            return;
        }

        const lines = fs
            .readFileSync(transcriptPath, 'utf8')
            .split('\n')
            .filter(Boolean);

        let latestPrompt = '';
        let latestResponse = '';

        for (const line of lines) {
            try {
                const step = JSON.parse(line);

                if (step.type === 'USER_INPUT' && step.content) {
                    const requestMatch = step.content.match(
                        /<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/
                    );

                    const content = requestMatch
                        ? requestMatch[1].trim()
                        : step.content.trim();

                    if (content) {
                        latestPrompt = content;
                    }
                }

                if (step.type === 'PLANNER_RESPONSE' && step.content) {
                    const content = step.content.trim();

                    if (content) {
                        latestResponse = content;
                    }
                }
            } catch {
                // Ignore malformed transcript lines.
            }
        }

        const now = new Date();

        const timestamp =
            `${now.getUTCFullYear()}-` +
            `${String(now.getUTCMonth() + 1).padStart(2, '0')}-` +
            `${String(now.getUTCDate()).padStart(2, '0')}_` +
            `${String(now.getUTCHours()).padStart(2, '0')}-` +
            `${String(now.getUTCMinutes()).padStart(2, '0')}-` +
            `${String(now.getUTCSeconds()).padStart(2, '0')}`;

        const fileName =
            `${timestamp}_${conversationId}.md`;

        const workspacePath =
            payload.workspacePaths?.[0]
                ? path.resolve(payload.workspacePaths[0])
                : path.resolve(process.cwd(), '..');

        const logsDir =
            path.join(workspacePath, '.agent-logs');

        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        const actualModel =
            modelName && modelName !== 'auto'
                ? modelName
                : 'unknown';

        const logContent = [
            'prompt:',
            latestPrompt,
            '',
            'response:',
            latestResponse,
            '',
            `timestamp: ${now.toISOString()}`,
            `model: ${actualModel}`
        ].join('\n');

        fs.writeFileSync(
            path.join(logsDir, fileName),
            logContent,
            'utf8'
        );

        console.log(JSON.stringify({}));
    } catch (err) {
        console.error(err.stack || String(err));
        console.log(JSON.stringify({}));
    }
});