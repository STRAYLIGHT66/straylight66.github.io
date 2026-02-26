/**
 * Team Blog - 首页逻辑
 * 
 * 后端接口预留:
 * GET /api/posts?per_page=3 - 获取最新文章
 * GET /api/categories - 获取分类列表
 * GET /api/members - 获取团队成员列表
 */

(function () {
    'use strict';

    /**
     * 初始化首页
     */
    function init() {
        loadLatestPosts();
        loadCategories();
        loadTeamMembers();
    }

    /**
     * 加载最新文章
     * 
     * 后端接口调用:
     * fetch('/api/posts?per_page=3')
     *   .then(res => res.json())
     *   .then(data => renderPosts(data));
     */
    async function loadLatestPosts() {
        try {
            const response = await API.getPosts({ per_page: 3 });

            if (response.success) {
                const posts = response.data.data;
                const container = document.getElementById('latest-posts');
                if (!container) return;

                container.innerHTML = posts.map((post, index) => `
                    <article class="card card-hover reveal-on-scroll" 
                             style="animation-delay: ${index * 0.1}s">
                        <div class="card-image img-hover-zoom">
                            <img src="${post.cover}" alt="${post.title}" loading="lazy">
                            <div class="card-category">${post.category.name}</div>
                        </div>
                        <div class="card-body">
                            <h3 class="card-title">
                                <a href="./article.html?id=${post.id}">${post.title}</a>
                            </h3>
                            <p class="card-excerpt">${post.excerpt}</p>
                            <div class="card-meta">
                                <div class="card-author">
                                    <img src="${post.author.avatar}" 
                                         alt="${post.author.name}" 
                                         class="author-avatar">
                                    <span class="author-name">${post.author.name}</span>
                                </div>
                                <div class="card-stats">
                                    <span><i class="fas fa-eye"></i> ${post.views}</span>
                                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                                </div>
                            </div>
                        </div>
                    </article>
                `).join('');

                // 重新初始化滚动显示
                App.initScrollEffects();
            }
        } catch (error) {
            console.error('加载文章失败:', error);
        }
    }

    /**
     * 加载分类
     * 
     * 后端接口调用:
     * fetch('/api/categories')
     *   .then(res => res.json())
     *   .then(data => renderCategories(data));
     */
    async function loadCategories() {
        try {
            const response = await API.getCategories();

            if (response.success) {
                const categories = response.data;
                const container = document.getElementById('categories');
                if (!container) return;

                const icons = ['fa-paint-brush', 'fa-code', 'fa-users', 'fa-coffee', 'fa-pen'];

                container.innerHTML = categories.map((category, index) => {
                    const icon = icons[index % icons.length];
                    return `
                        <a href="./blog.html?category=${category.slug}" 
                           class="category-card reveal-on-scroll" 
                           style="animation-delay: ${index * 0.1}s">
                            <div class="category-icon">
                                <i class="fas ${icon}"></i>
                            </div>
                            <h3 class="category-name">${category.name}</h3>
                            <p class="category-count">${category.count} 篇文章</p>
                        </a>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    }

    /**
     * 加载团队成员
     * 
     * 后端接口调用:
     * fetch('/api/members')
     *   .then(res => res.json())
     *   .then(data => renderMembers(data));
     */
    async function loadTeamMembers() {
        try {
            const response = await API.getMembers();

            if (response.success) {
                const members = response.data.slice(0, 4);
                const container = document.getElementById('team-members');
                if (!container) return;

                container.innerHTML = members.map((member, index) => `
                    <div class="team-card reveal-on-scroll" 
                         style="animation-delay: ${index * 0.1}s">
                        <div class="team-avatar">
                            <img src="${member.avatar}" alt="${member.name}">
                        </div>
                        <h3 class="team-name">${member.name}</h3>
                        <p class="team-role">${member.role}</p>
                        <p class="team-bio">${member.bio}</p>
                        <div class="team-social">
                            ${member.social.github ? `
                                <a href="${member.social.github}" target="_blank">
                                    <i class="fab fa-github"></i>
                                </a>
                            ` : ''}
                            ${member.social.twitter ? `
                                <a href="${member.social.twitter}" target="_blank">
                                    <i class="fab fa-twitter"></i>
                                </a>
                            ` : ''}
                            ${member.social.linkedin ? `
                                <a href="${member.social.linkedin}" target="_blank">
                                    <i class="fab fa-linkedin"></i>
                                </a>
                            ` : ''}
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('加载成员失败:', error);
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
