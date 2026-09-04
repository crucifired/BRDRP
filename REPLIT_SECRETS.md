Replit secrets and run instructions

You must NOT put real tokens in the repository. Add these values in Replit → Secrets (Environment variables):

- DISCORD_TOKEN  — your bot token (string)
- CLIENT_ID      — application client id (string)
- GUILD_ID       — your test guild/server id (string) — optional but recommended for quick command registration

How to add in Replit UI:
1. Open your Repl. Click the lock icon (Secrets) on the left sidebar. 
2. Add the name on the left (e.g. DISCORD_TOKEN) and the secret value on the right. Press Add secret.

How to check and restart (Shell):
1) Check that secrets exist (no token is printed):
   node -e "console.log('DISCORD_TOKEN:' + (process.env.DISCORD_TOKEN ? '✅' : '❌')); console.log('GUILD_ID:' + (process.env.GUILD_ID ? '✅' : '❌'));"

2) Pull the branch with the config/example if needed:
   git fetch origin
   git checkout improve/replit-setup
   git pull origin improve/replit-setup

3) Register slash commands (recommended if you changed commands):
   npm run deploy-commands

4) Restart the bot (UI: Stop → Run or via Shell):
   pkill -f index.js || pkill -f node || true
   npm start

If after restart DISCORD_TOKEN or GUILD_ID is still ❌, re-open Secrets and re-add them, then restart again.

If you want, I can directly create/update config.json with the example values (but I will NOT add tokens into repo). Reply "create config.json" and I will commit it to the same branch.