/**
 * Team Blog - 博客列表页逻辑
 * 
 * 后端接口预留:
 * GET /api/posts?page=1&per_page=10&category=tech - 获取文章列表
 * GET /api/categories - 获取分类列表
 * GET /api/tags - 获取标签列表
 */

(function () {
    'use strict';

    // 页面状态
    let currentPage = 1;
    let currentCategory = '';
    let currentTag = '';
    let currentSearch = '';

    /**
     * 初始化博客页面
     */
    function init() {
        // 解析 URL 参数
        const urlParams = new URLSearchParams(window.location.search);
        currentCategory = urlParams.get('category') || '';
        currentTag = urlParams.get('tag') || '';
        currentSearch = urlParams.get('search') || '';

        // 加载数据
        loadPosts();
        loadSidebarCategories();
        loadSidebarTags();

        // 排序切换
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                currentPage = 1;
                loadPosts();
            });
        }
    }

    /**
     * 加载文章列表
     * 
     * 后端接口调用:
     * fetch('/api/posts?page=1&per_page=9&category=tech')
     *   .then(res => res.json())
     *   .then(data => renderPosts(data));
     */
    async function loadPosts() {
        const container = document.getElementById('posts-container');
        const pagination = document.getElementById('pagination');

        if (!container) return;

        // 显示骨架屏（非全屏加载）
        container.innerHTML = generateSkeletonHTML(6);

        try {
            const params = {
                page: currentPage,
                per_page: 9
            };

            if (currentCategory) params.category = currentCategory;
            if (currentTag) params.tag = currentTag;
            if (currentSearch) params.search = currentSearch;

            const response = await API.getPosts(params);

            if (response.success) {
                const { data: posts, pagination: pageInfo } = response.data;

                // 更新总数
                const totalPosts = document.getElementById('total-posts');
                if (totalPosts) totalPosts.textContent = pageInfo.total;

                if (posts.length === 0) {
                    container.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-inbox"></i>
                            <p>暂无文章</p>
                        </div>
                    `;
                    if (pagination) pagination.innerHTML = '';
                    return;
                }

                // 渲染文章
                container.innerHTML = posts.map((post, index) => `
                    <article class="post-card reveal-on-scroll" style="animation-delay: ${index * 0.05}s">
                        <div class="post-image img-hover-zoom">
                            <img src="${post.cover}" alt="${post.title}" loading="lazy">
                            <span class="post-category">${post.category.name}</span>
                        </div>
                        <div class="post-content">
                            <h2 class="post-title">
                                <a href="./article.html?id=${post.id}">${post.title}</a>
                            </h2>
                            <p class="post-excerpt">${post.excerpt}</p>
                            <div class="post-meta">
                                <div class="post-author">
                                    <img src="${post.author.avatar}" alt="${post.author.name}">
                                    <span>${post.author.name}</span>
                                </div>
                                <div class="post-stats">
                                    <span><i class="fas fa-eye"></i> ${post.views}</span>
                                    <span><i class="fas fa-heart"></i> ${post.likes}</span>
                                </div>
                            </div>
                            <div class="post-tags">
                                ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </article>
                `).join('');

                // 渲染分页
                renderPagination(pageInfo);

                // 重新初始化滚动显示
                App.initScrollEffects();
            }
        } catch (error) {
            console.error('加载文章失败:', error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>加载失败，请刷新重试</p>
                </div>
            `;
        }
    }

    /**
     * 生成分页HTML
     */
    function renderPagination(paginationInfo) {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const { page, total_pages } = paginationInfo;

        if (total_pages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let html = '';

        // 上一页
        html += `
            <button class="page-item ${page === 1 ? 'disabled' : ''}" data-page="${page - 1}">
                <i class="fas fa-chevron-left"></i>
            </button>
        `;

        // 页码
        for (let i = 1; i <= total_pages; i++) {
            if (i === 1 || i === total_pages || (i >= page - 1 && i <= page + 1)) {
                html += `
                    <button class="page-item ${i === page ? 'active' : ''}" data-page="${i}">
                        ${i}
                    </button>
                `;
            } else if (i === page - 2 || i === page + 2) {
                html += `<span class="page-item disabled">...</span>`;
            }
        }

        // 下一页
        html += `
            <button class="page-item ${page === total_pages ? 'disabled' : ''}" data-page="${page + 1}">
                <i class="fas fa-chevron-right"></i>
            </button>
        `;

        pagination.innerHTML = html;

        // 绑定分页点击
        pagination.querySelectorAll('.page-item:not(.disabled)').forEach(item => {
            item.addEventListener('click', () => {
                const page = parseInt(item.dataset.page);
                if (page && page !== currentPage) {
                    currentPage = page;
                    loadPosts();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    /**
     * 加载侧边栏分类
     * 
     * 后端接口调用:
     * fetch('/api/categories')
     *   .then(res => res.json())
     *   .then(data => renderCategories(data));
     */
    async function loadSidebarCategories() {
        try {
            const response = await API.getCategories();

            if (response.success) {
                const categories = response.data;
                const container = document.getElementById('sidebar-categories');
                if (!container) return;

                container.innerHTML = categories.map(category => {
                    const isActive = currentCategory === category.slug;
                    return `
                        <li>
                            <a href="./blog.html?category=${category.slug}" 
                               class="${isActive ? 'active' : ''}">
                                <span>${category.name}</span>
                                <span class="count">${category.count}</span>
                            </a>
                        </li>
                    `;
                }).join('');
            }
        } catch (error) {
            console.error('加载分类失败:', error);
        }
    }

    /**
     * 加载侧边栏标签
     * 
     * 后端接口调用:
     * fetch('/api/tags')
     *   .then(res => res.json())
     *   .then(data => renderTags(data));
     */
    async function loadSidebarTags() {
        try {
            const response = await API.getTags();

            if (response.success) {
                const tags = response.data;
                const container = document.getElementById('sidebar-tags');
                if (!container) return;

                container.innerHTML = tags.map(tag => `
                    <a href="./blog.html?tag=${tag.slug}" class="tag">${tag.name}</a>
                `).join('');
            }
        } catch (error) {
            console.error('加载标签失败:', error);
        }
    }

    /**
     * 生成骨架屏HTML
     */
    function generateSkeletonHTML(count) {
        return Array(count).fill(0).map(() => `
            <div class="post-card skeleton-card">
                <div class="skeleton" style="height: 180px;"></div>
                <div style="padding: 20px;">
                    <div class="skeleton skeleton-text" style="width: 80%;"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text" style="width: 60%;"></div>
                </div>
            </div>
        `).join('');
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
