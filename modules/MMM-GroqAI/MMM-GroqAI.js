/*
 * MMM-GroqAI
 * MagicMirror² module for Groq AI (Llama models)
 * Free, fast AI assistant with voice input support
 */

Module.register("MMM-GroqAI", {
    defaults: {
        apiKey: "",
        model: "llama-3.3-70b-versatile",
        systemPrompt: "You are a helpful assistant on a smart mirror. Keep responses concise (2-3 sentences max). Be friendly and helpful.",
        maxTokens: 150,
        showInput: true,
        showHistory: true,
        historyCount: 3,
        voiceInput: true,
        voiceLang: "bn-BD",  // Bengali
        placeholder: "জিজ্ঞাসা করুন...",
        activationKey: "Enter",
        updateInterval: 0,  // 0 = manual only
    },

    conversationHistory: [],
    isListening: false,
    recognition: null,

    getStyles: function() {
        return ["MMM-GroqAI.css", "font-awesome.css"];
    },

    getScripts: function() {
        return [];
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            bn: "translations/bn.json"
        };
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.currentResponse = "";
        this.isLoading = false;
        this.userInput = "";

        // Initialize speech recognition if enabled
        if (this.config.voiceInput) {
            this.initSpeechRecognition();
        }
    },

    initSpeechRecognition: function() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = this.config.voiceLang;

            this.recognition.onresult = (event) => {
                let transcript = "";
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                this.userInput = transcript;
                this.updateDom(300);

                if (event.results[event.results.length - 1].isFinal) {
                    this.sendQuery(transcript);
                }
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateDom(300);
            };

            this.recognition.onerror = (event) => {
                Log.error("[MMM-GroqAI] Speech recognition error:", event.error);
                this.isListening = false;

                // Show user-friendly error
                if (event.error === "network") {
                    this.currentResponse = '<span class="error">ভয়েস কাজ করছে না। ইন্টারনেট বা HTTPS প্রয়োজন।</span>';
                } else if (event.error === "not-allowed") {
                    this.currentResponse = '<span class="error">মাইক্রোফোন অনুমতি দিন।</span>';
                } else if (event.error === "no-speech") {
                    // No speech detected, not really an error
                }
                this.updateDom(300);
            };

            Log.info("[MMM-GroqAI] Speech recognition initialized");
        } else {
            Log.warn("[MMM-GroqAI] Speech recognition not supported");
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "groq-ai-wrapper";

        // Header with mic button
        const header = document.createElement("div");
        header.className = "groq-header";

        if (this.config.voiceInput && this.recognition) {
            const micButton = document.createElement("button");
            micButton.className = "mic-button" + (this.isListening ? " listening" : "");
            micButton.innerHTML = '<i class="fas fa-microphone"></i>';
            micButton.onclick = () => this.toggleListening();
            header.appendChild(micButton);
        }

        // Input field
        if (this.config.showInput) {
            const inputContainer = document.createElement("div");
            inputContainer.className = "input-container";

            const input = document.createElement("input");
            input.type = "text";
            input.className = "groq-input";
            input.placeholder = this.config.placeholder;
            input.value = this.userInput;
            input.id = "groq-input-field";

            input.onkeydown = (e) => {
                if (e.key === this.config.activationKey && input.value.trim()) {
                    this.sendQuery(input.value.trim());
                    input.value = "";
                }
            };

            input.oninput = (e) => {
                this.userInput = e.target.value;
            };

            inputContainer.appendChild(input);

            const sendBtn = document.createElement("button");
            sendBtn.className = "send-button";
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
            sendBtn.onclick = () => {
                const inputField = document.getElementById("groq-input-field");
                if (inputField && inputField.value.trim()) {
                    this.sendQuery(inputField.value.trim());
                    inputField.value = "";
                }
            };
            inputContainer.appendChild(sendBtn);

            header.appendChild(inputContainer);
        }

        wrapper.appendChild(header);

        // Loading indicator
        if (this.isLoading) {
            const loading = document.createElement("div");
            loading.className = "groq-loading";
            loading.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + this.translate("THINKING");
            wrapper.appendChild(loading);
        }

        // Current response
        if (this.currentResponse && !this.isLoading) {
            const responseDiv = document.createElement("div");
            responseDiv.className = "groq-response";
            responseDiv.innerHTML = this.currentResponse;
            wrapper.appendChild(responseDiv);
        }

        // Conversation history
        if (this.config.showHistory && this.conversationHistory.length > 0) {
            const historyDiv = document.createElement("div");
            historyDiv.className = "groq-history";

            const recentHistory = this.conversationHistory.slice(-this.config.historyCount * 2);

            for (let i = 0; i < recentHistory.length; i += 2) {
                if (recentHistory[i] && recentHistory[i + 1]) {
                    const item = document.createElement("div");
                    item.className = "history-item";

                    const question = document.createElement("div");
                    question.className = "history-question";
                    question.innerHTML = '<i class="fas fa-user"></i> ' + recentHistory[i].content;
                    item.appendChild(question);

                    const answer = document.createElement("div");
                    answer.className = "history-answer";
                    answer.innerHTML = '<i class="fas fa-robot"></i> ' + recentHistory[i + 1].content;
                    item.appendChild(answer);

                    historyDiv.appendChild(item);
                }
            }
            wrapper.appendChild(historyDiv);
        }

        return wrapper;
    },

    toggleListening: function() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        } else {
            this.userInput = "";
            this.recognition.start();
            this.isListening = true;
        }
        this.updateDom(300);
    },

    sendQuery: function(query) {
        if (!query || this.isLoading) return;

        this.isLoading = true;
        this.userInput = "";
        this.updateDom(300);

        this.sendSocketNotification("GROQ_QUERY", {
            query: query,
            apiKey: this.config.apiKey,
            model: this.config.model,
            systemPrompt: this.config.systemPrompt,
            maxTokens: this.config.maxTokens,
            history: this.conversationHistory.slice(-6)  // Last 3 exchanges
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GROQ_RESPONSE") {
            this.isLoading = false;
            this.currentResponse = payload.response;

            // Add to history
            this.conversationHistory.push(
                { role: "user", content: payload.query },
                { role: "assistant", content: payload.response }
            );

            // Keep history limited
            if (this.conversationHistory.length > 20) {
                this.conversationHistory = this.conversationHistory.slice(-20);
            }

            this.updateDom(300);
        } else if (notification === "GROQ_ERROR") {
            this.isLoading = false;
            this.currentResponse = '<span class="error">' + this.translate("ERROR") + ': ' + payload.error + '</span>';
            this.updateDom(300);
        }
    },

    // Convert to Bengali numerals
    toBengaliNumerals: function(str) {
        const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return str.toString().replace(/[0-9]/g, function(digit) {
            return bengaliNumerals[parseInt(digit)];
        });
    }
});
