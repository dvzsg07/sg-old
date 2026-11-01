
const { Client, GatewayIntentBits } = require('discord.js');

class BotManager {
    constructor() {
        this.client = new Client({
            intents: [GatewayIntentBits.Guilds]
        });

        this.connectedClients = new Map();
        this.kickedUsers = new Set();
    }

    init() {
        if (!process.env.DISCORD_TOKEN) {
            console.error('[BOT] DISCORD_TOKEN não configurado.');
            return;
        }

        this.client.once('ready', () => {
            console.log(`[BOT] Discord conectado: ${this.client.user.tag}`);
        });

        this.client.login(process.env.DISCORD_TOKEN)
            .catch(error => {
                console.error('[BOT] Erro ao conectar:', error.message);
            });
    }

    registerClient(clientId, clientInfo = {}) {
        if (!clientId) return false;

        this.connectedClients.set(String(clientId), {
            ...clientInfo,
            connectedAt: Date.now()
        });

        return true;
    }

    unregisterClient(clientId) {
        if (!clientId) return false;

        return this.connectedClients.delete(String(clientId));
    }

    getConnectedClients() {
        return Array.from(this.connectedClients.entries()).map(
            ([clientId, info]) => ({
                clientId,
                ...info
            })
        );
    }

    isKicked(userId) {
        if (!userId) return false;
        return this.kickedUsers.has(String(userId));
    }

    kickUser(userId) {
        if (!userId) return false;

        this.kickedUsers.add(String(userId));
        return true;
    }

    unkickUser(userId) {
        if (!userId) return false;

        return this.kickedUsers.delete(String(userId));
    }
}

module.exports = new BotManager();
