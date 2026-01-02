const NodeHelper = require("node_helper");
const https = require("https");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_GITHUB_PROFILE") {
            this.getGitHubProfile(payload.username);
            this.getGitHubCommits(payload.username, payload.maxCommits);
            this.getGitHubStats(payload.username);
        }
    },

    makeRequest: function(path, callback) {
        const options = {
            hostname: "api.github.com",
            path: path,
            method: "GET",
            headers: {
                "User-Agent": "MagicMirror-GitHubProfile",
                "Accept": "application/vnd.github.v3+json"
            }
        };

        const req = https.request(options, (res) => {
            let data = "";

            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const json = JSON.parse(data);
                    callback(null, json);
                } catch (error) {
                    callback(error, null);
                }
            });
        });

        req.on("error", (error) => {
            callback(error, null);
        });

        req.end();
    },

    getGitHubProfile: function(username) {
        const self = this;
        this.makeRequest(`/users/${username}`, (error, profile) => {
            if (error) {
                self.sendSocketNotification("GITHUB_PROFILE_ERROR", error.message);
            } else if (profile.message) {
                self.sendSocketNotification("GITHUB_PROFILE_ERROR", profile.message);
            } else {
                self.sendSocketNotification("GITHUB_PROFILE_DATA", profile);
            }
        });
    },

    getGitHubCommits: function(username, maxCommits) {
        const self = this;

        this.makeRequest(`/users/${username}/events/public?per_page=30`, (error, events) => {
            if (error || !Array.isArray(events)) {
                return;
            }

            const commits = [];

            events.forEach(event => {
                if (event.type === "PushEvent" && event.payload && event.payload.commits) {
                    event.payload.commits.forEach(commit => {
                        if (commits.length < maxCommits) {
                            commits.push({
                                message: commit.message.split("\n")[0],
                                repo: event.repo.name.split("/")[1],
                                date: event.created_at,
                                sha: commit.sha.substring(0, 7)
                            });
                        }
                    });
                }
            });

            self.sendSocketNotification("GITHUB_COMMITS_DATA", commits.slice(0, maxCommits));
        });
    },

    getGitHubStats: function(username) {
        const self = this;
        const stats = {
            totalStars: 0,
            totalForks: 0,
            languages: {},
            topLanguage: null,
            todayCommits: 0,
            streak: 0
        };

        // Get all repos to calculate stars, forks, languages
        this.makeRequest(`/users/${username}/repos?per_page=100&sort=updated`, (error, repos) => {
            if (error || !Array.isArray(repos)) {
                self.sendSocketNotification("GITHUB_STATS_DATA", stats);
                return;
            }

            repos.forEach(repo => {
                stats.totalStars += repo.stargazers_count || 0;
                stats.totalForks += repo.forks_count || 0;

                if (repo.language) {
                    stats.languages[repo.language] = (stats.languages[repo.language] || 0) + 1;
                }
            });

            // Find top language
            let maxCount = 0;
            for (const [lang, count] of Object.entries(stats.languages)) {
                if (count > maxCount) {
                    maxCount = count;
                    stats.topLanguage = lang;
                }
            }

            // Get today's commits from events
            self.makeRequest(`/users/${username}/events/public?per_page=100`, (error, events) => {
                if (!error && Array.isArray(events)) {
                    const today = new Date().toDateString();
                    const commitDates = new Set();

                    events.forEach(event => {
                        if (event.type === "PushEvent" && event.payload && event.payload.commits) {
                            const eventDate = new Date(event.created_at);
                            commitDates.add(eventDate.toDateString());

                            if (eventDate.toDateString() === today) {
                                stats.todayCommits += event.payload.commits.length;
                            }
                        }
                    });

                    // Calculate streak (consecutive days with commits)
                    const sortedDates = Array.from(commitDates)
                        .map(d => new Date(d))
                        .sort((a, b) => b - a);

                    if (sortedDates.length > 0) {
                        stats.streak = 1;
                        for (let i = 0; i < sortedDates.length - 1; i++) {
                            const diff = (sortedDates[i] - sortedDates[i + 1]) / (1000 * 60 * 60 * 24);
                            if (diff <= 1) {
                                stats.streak++;
                            } else {
                                break;
                            }
                        }
                    }
                }

                self.sendSocketNotification("GITHUB_STATS_DATA", stats);
            });
        });
    }
});
