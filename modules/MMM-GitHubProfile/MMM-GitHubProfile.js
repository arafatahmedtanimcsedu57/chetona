/*
 * MMM-GitHubProfile
 * Shows GitHub profile stats on MagicMirror
 */

Module.register("MMM-GitHubProfile", {
    defaults: {
        username: "",
        updateInterval: 10 * 60 * 1000,
        showAvatar: true,
        showStats: true,
        showBio: false,
        showCommits: true,
        maxCommits: 3
    },

    profile: null,
    commits: [],
    extraStats: null,

    getStyles: function() {
        return ["MMM-GitHubProfile.css", "font-awesome.css"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.getData();
        this.scheduleUpdate();
    },

    getData: function() {
        this.sendSocketNotification("GET_GITHUB_PROFILE", {
            username: this.config.username,
            maxCommits: this.config.maxCommits
        });
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getData();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GITHUB_PROFILE_DATA") {
            this.profile = payload;
            this.updateDom(300);
        } else if (notification === "GITHUB_COMMITS_DATA") {
            this.commits = payload;
            this.updateDom(300);
        } else if (notification === "GITHUB_STATS_DATA") {
            this.extraStats = payload;
            this.updateDom(300);
        } else if (notification === "GITHUB_PROFILE_ERROR") {
            Log.error("[MMM-GitHubProfile] Error:", payload);
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "github-profile-wrapper";

        if (!this.profile) {
            wrapper.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            return wrapper;
        }

        // Header: Avatar + Name (inline)
        const header = document.createElement("div");
        header.className = "github-header";

        const info = document.createElement("div");
        info.className = "github-info";

        const nameDiv = document.createElement("div");
        nameDiv.className = "github-name";
        nameDiv.innerHTML = this.profile.name || this.profile.login;
        info.appendChild(nameDiv);

        const usernameDiv = document.createElement("div");
        usernameDiv.className = "github-username";
        usernameDiv.innerHTML = `<i class="fab fa-github"></i>${this.profile.login}`;
        info.appendChild(usernameDiv);

        header.appendChild(info);

        if (this.config.showAvatar) {
            const avatarDiv = document.createElement("div");
            avatarDiv.className = "github-avatar";
            const avatar = document.createElement("img");
            avatar.src = this.profile.avatar_url;
            avatarDiv.appendChild(avatar);
            header.appendChild(avatarDiv);
        }

        wrapper.appendChild(header);

        // Stats Grid (2 rows in one grid)
        if (this.config.showStats) {
            const statsGrid = document.createElement("div");
            statsGrid.className = "github-stats-grid";

            const allStats = [
                { value: this.profile.public_repos, label: "Repos" },
                { value: this.profile.followers, label: "Followers" },
                { value: this.extraStats ? this.extraStats.totalStars : 0, label: "Stars" }
            ];

            allStats.forEach(stat => {
                const item = document.createElement("div");
                item.className = "github-stat-item";
                item.innerHTML = `
                    <div class="stat-value">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                `;
                statsGrid.appendChild(item);
            });

            wrapper.appendChild(statsGrid);
        }

        // Activity bar (streak + today)
        if (this.extraStats) {
            const activityDiv = document.createElement("div");
            activityDiv.className = "github-activity";

            activityDiv.innerHTML = `
                <div class="activity-item streak">
                    <i class="fas fa-fire"></i>
                    <span class="activity-value">${this.extraStats.streak}</span>
                    <span>day streak</span>
                </div>
                <div class="activity-item today">
                    <i class="fas fa-code"></i>
                    <span class="activity-value">${this.extraStats.todayCommits}</span>
                    <span>today</span>
                </div>
            `;

            wrapper.appendChild(activityDiv);
        }

        // Recent Commits
        if (this.config.showCommits && this.commits.length > 0) {
            const commitsDiv = document.createElement("div");
            commitsDiv.className = "github-commits";

            const commitsHeader = document.createElement("div");
            commitsHeader.className = "commits-header";
            commitsHeader.innerHTML = 'Recent Activity';
            commitsDiv.appendChild(commitsHeader);

            this.commits.slice(0, this.config.maxCommits).forEach(commit => {
                const commitItem = document.createElement("div");
                commitItem.className = "commit-item";

                const message = commit.message.length > 30
                    ? commit.message.substring(0, 30) + "..."
                    : commit.message;

                const timeAgo = this.getTimeAgo(new Date(commit.date));

                commitItem.innerHTML = `
                    <div class="commit-content">
                        <div class="commit-message">${message}</div>
                        <div class="commit-meta">
                            <span class="commit-repo">${commit.repo}</span>
                            <span class="commit-time">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="commit-dot"></div>
                `;
                commitsDiv.appendChild(commitItem);
            });

            wrapper.appendChild(commitsDiv);
        }

        return wrapper;
    },

    getTimeAgo: function(date) {
        const seconds = Math.floor((new Date() - date) / 1000);

        if (seconds < 60) return "now";
        if (seconds < 3600) return Math.floor(seconds / 60) + "m";
        if (seconds < 86400) return Math.floor(seconds / 3600) + "h";
        if (seconds < 604800) return Math.floor(seconds / 86400) + "d";
        return Math.floor(seconds / 604800) + "w";
    }
});
