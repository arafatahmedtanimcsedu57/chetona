/*
 * MMM-GroqAI Node Helper
 * Handles Groq API calls from the backend
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("[MMM-GroqAI] Node helper started");
    },

    socketNotificationReceived: async function(notification, payload) {
        if (notification === "GROQ_QUERY") {
            await this.queryGroq(payload);
        }
    },

    queryGroq: async function(payload) {
        const { query, apiKey, model, systemPrompt, maxTokens, history } = payload;

        if (!apiKey) {
            this.sendSocketNotification("GROQ_ERROR", {
                error: "API key not configured"
            });
            return;
        }

        try {
            // Build messages array
            const messages = [
                { role: "system", content: systemPrompt }
            ];

            // Add conversation history
            if (history && history.length > 0) {
                messages.push(...history);
            }

            // Add current query
            messages.push({ role: "user", content: query });

            const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: model,
                    messages: messages,
                    max_tokens: maxTokens,
                    temperature: 0.7,
                    top_p: 1,
                    stream: false
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || `HTTP ${response.status}`);
            }

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                this.sendSocketNotification("GROQ_RESPONSE", {
                    query: query,
                    response: data.choices[0].message.content
                });
            } else {
                throw new Error("Invalid response format");
            }

        } catch (error) {
            console.error("[MMM-GroqAI] Error:", error.message);
            this.sendSocketNotification("GROQ_ERROR", {
                error: error.message
            });
        }
    }
});
