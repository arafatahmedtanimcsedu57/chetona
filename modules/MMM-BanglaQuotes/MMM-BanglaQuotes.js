/*
 * MMM-BanglaQuotes
 * Daily inspirational quotes in Bengali
 */

Module.register("MMM-BanglaQuotes", {
    defaults: {
        updateInterval: 30 * 60 * 1000,  // 30 minutes
        fadeSpeed: 2000,
        quotes: [
            // Rabindranath Tagore (রবীন্দ্রনাথ ঠাকুর)
            { text: "যদি তোর ডাক শুনে কেউ না আসে, তবে একলা চলো রে।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "তুমি যা তাই হও, প্রচণ্ড দীপ্তির মতো নিঃশব্দ।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "আমরা মুক্তি চাই, মুক্তি চাই মনের আগলে।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "প্রেম বলে যা পায় তাই যথেষ্ট, বিচার বলে তাহা ন্যায্য কি না।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "মনের মধ্যে যে গান আছে সেই গান গাইতে পারলেই জীবন সার্থক।", author: "রবীন্দ্রনাথ ঠাকুর" },
            { text: "সত্য যে কঠিন, কঠিনেরে ভালোবাসিলাম।", author: "রবীন্দ্রনাথ ঠাকুর" },

            // Kazi Nazrul Islam (কাজী নজরুল ইসলাম)
            { text: "বল বীর, বল উন্নত মম শির।", author: "কাজী নজরুল ইসলাম" },
            { text: "থাকব না কো বদ্ধ ঘরে, দেখব এবার জগৎটাকে।", author: "কাজী নজরুল ইসলাম" },
            { text: "মানুষের চেয়ে বড় কিছু নাই, নহে কিছু মহীয়ান।", author: "কাজী নজরুল ইসলাম" },
            { text: "গাহি সাম্যের গান, মানুষের চেয়ে বড় কিছু নাই।", author: "কাজী নজরুল ইসলাম" },

            // Humayun Ahmed (হুমায়ূন আহমেদ)
            { text: "মানুষ স্বপ্ন দেখে, স্বপ্ন ভাঙে, আবার স্বপ্ন দেখে।", author: "হুমায়ূন আহমেদ" },
            { text: "জীবন খুব ছোট, তাই ভালোবাসতে শেখো।", author: "হুমায়ূন আহমেদ" },
            { text: "যে মানুষ ভালোবাসতে জানে না, সে মানুষ কিছুই জানে না।", author: "হুমায়ূন আহমেদ" },

            // Sarat Chandra Chattopadhyay (শরৎচন্দ্র চট্টোপাধ্যায়)
            { text: "যে পথে চলি সেই পথই ঠিক, আর সব পথ ভুল।", author: "শরৎচন্দ্র চট্টোপাধ্যায়" },

            // Sukumar Ray (সুকুমার রায়)
            { text: "হাসতে হাসতে কাঁদতে শেখা, কাঁদতে কাঁদতে হাসতে শেখা।", author: "সুকুমার রায়" },

            // Jibananda Das (জীবনানন্দ দাশ)
            { text: "বাংলার মুখ আমি দেখিয়াছি, তাই আমি পৃথিবীর রূপ খুঁজিতে যাই না আর।", author: "জীবনানন্দ দাশ" },

            // Lalon Shah (লালন শাহ)
            { text: "মানুষ ভজলে সোনার মানুষ হবি।", author: "লালন শাহ" },
            { text: "জাত গেল জাত গেল বলে, একি আজব কারখানা।", author: "লালন শাহ" },

            // Islamic/Spiritual quotes
            { text: "ধৈর্য ধরো, সুন্দর দিন আসবেই।", author: "প্রবাদ" },
            { text: "চেষ্টা করলে সব সম্ভব।", author: "প্রবাদ" },
            { text: "সময় ও স্রোত কারো জন্য অপেক্ষা করে না।", author: "প্রবাদ" },
            { text: "যে গাছে ফল ধরে সে গাছেই ঢিল পড়ে।", author: "প্রবাদ" },
            { text: "অল্প বিদ্যা ভয়ংকরী।", author: "প্রবাদ" },
            { text: "পরিশ্রম সৌভাগ্যের প্রসূতি।", author: "প্রবাদ" },

            // Motivational
            { text: "আজকের কষ্ট আগামীকালের সাফল্য।", author: "অজানা" },
            { text: "স্বপ্ন দেখো এবং সেই স্বপ্ন পূরণে কাজ করো।", author: "অজানা" },
            { text: "ব্যর্থতা মানে থেমে যাওয়া নয়, নতুন করে শুরু করা।", author: "অজানা" },
            { text: "জীবনে বড় হতে হলে ছোট ছোট কাজে মনোযোগ দাও।", author: "অজানা" },
        ]
    },

    currentQuote: null,

    start: function() {
        Log.info("Starting module: " + this.name);
        this.currentQuote = this.getRandomQuote();
        this.scheduleUpdate();
    },

    getStyles: function() {
        return ["MMM-BanglaQuotes.css"];
    },

    getRandomQuote: function() {
        const quotes = this.config.quotes;
        return quotes[Math.floor(Math.random() * quotes.length)];
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.currentQuote = this.getRandomQuote();
            this.updateDom(this.config.fadeSpeed);
        }, this.config.updateInterval);
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "bangla-quote-wrapper";

        if (this.currentQuote) {
            const quoteText = document.createElement("div");
            quoteText.className = "bangla-quote-text";
            quoteText.innerHTML = `"${this.currentQuote.text}"`;
            wrapper.appendChild(quoteText);

            const quoteAuthor = document.createElement("div");
            quoteAuthor.className = "bangla-quote-author";
            quoteAuthor.innerHTML = `— ${this.currentQuote.author}`;
            wrapper.appendChild(quoteAuthor);
        }

        return wrapper;
    }
});
