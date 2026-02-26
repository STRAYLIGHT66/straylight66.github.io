/**
 * Team Blog - 文章详情页逻辑
 * 
 * 后端接口预留:
 * GET /api/posts/:id - 获取单篇文章
 * GET /api/posts?per_page=5 - 获取相关文章
 */

(function () {
    'use strict';

    let currentArticle = null;
    let isLiked = false;
    let isBookmarked = false;

    /**
     * 初始化文章详情页
     */
    async function init() {
        // 获取文章ID
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id');

        if (!articleId) {
            window.location.href = './blog.html';
            return;
        }

        // 加载文章
        await loadArticle(articleId);

        // 加载热门文章
        loadPopularPosts();

        // 绑定操作按钮
        bindActionButtons();
    }

    /**
     * 加载文章
     * @param {string} id - 文章ID
     * 
     * 后端接口调用:
     * fetch(`/api/posts/${id}`)
     *   .then(res => res.json())
     *   .then(data => renderArticle(data));
     */
    async function loadArticle(id) {
        try {
            const response = await API.getPost(parseInt(id));

            if (response.success && response.data) {
                currentArticle = response.data;
                renderArticle(currentArticle);
                generateTOC();
            } else {
                showError('文章不存在');
            }
        } catch (error) {
            console.error('加载文章失败:', error);
            showError('加载失败，请刷新重试');
        }
    }

    /**
     * 渲染文章
     */
    function renderArticle(article) {
        // 设置页面标题
        document.title = `${article.title} - Team Blog`;

        // 头部背景
        const headerImage = document.getElementById('header-image');
        if (headerImage) {
            headerImage.src = article.cover;
            headerImage.alt = article.title;
        }

        // 分类
        const articleCategory = document.getElementById('article-category');
        if (articleCategory) {
            articleCategory.textContent = article.category.name;
        }

        // 标题
        const articleTitle = document.getElementById('article-title');
        if (articleTitle) {
            articleTitle.textContent = article.title;
        }

        // 元信息
        const articleMeta = document.getElementById('article-meta');
        if (articleMeta) {
            articleMeta.innerHTML = `
                <div class="meta-author">
                    <img src="${article.author.avatar}" alt="${article.author.name}">
                    <span>${article.author.name}</span>
                </div>
                <div class="meta-divider"></div>
                <div class="meta-date">
                    <i class="far fa-calendar"></i>
                    ${App.formatDate(article.created_at)}
                </div>
                <div class="meta-divider"></div>
                <div class="meta-views">
                    <i class="far fa-eye"></i>
                    ${article.views} 阅读
                </div>
            `;
        }

        // 内容
        const articleContent = document.getElementById('article-content');
        if (articleContent) {
            articleContent.innerHTML = article.content;
        }

        // 标签
        const articleTags = document.getElementById('article-tags');
        if (articleTags) {
            articleTags.innerHTML = article.tags.map(tag =>
                `<span class="tag">${tag}</span>`
            ).join('');
        }

        // 点赞数
        const likeCount = document.getElementById('like-count');
        if (likeCount) {
            likeCount.textContent = article.likes;
        }

        // 作者卡片
        const authorCard = document.getElementById('author-card');
        if (authorCard) {
            authorCard.innerHTML = `
                <div class="author-avatar-large">
                    <img src="${article.author.avatar}" alt="${article.author.name}">
                </div>
                <div class="author-info">
                    <h4 class="author-name">${article.author.name}</h4>
                    <p class="author-bio">文章作者</p>
                </div>
            `;
        }

        // 重新初始化滚动显示
        App.initScrollEffects();
    }

    /**
     * 生成文章目录
     */
    function generateTOC() {
        const content = document.getElementById('article-content');
        const toc = document.getElementById('article-toc');

        if (!content || !toc) return;

        const headings = content.querySelectorAll('h2, h3');

        if (headings.length === 0) {
            const tocWidget = document.querySelector('.toc-widget');
            if (tocWidget) tocWidget.style.display = 'none';
            return;
        }

        let tocHtml = '<ul>';

        headings.forEach((heading, index) => {
            const level = heading.tagName.toLowerCase();
            const text = heading.textContent;
            const id = `heading-${index}`;

            heading.id = id;

            tocHtml += `
                <li class="toc-${level}">
                    <a href="#${id}" data-target="${id}">${text}</a>
                </li>
            `;
        });

        tocHtml += '</ul>';
        toc.innerHTML = tocHtml;

        // 目录点击平滑滚动
        toc.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById(link.dataset.target);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // 滚动高亮目录
        window.addEventListener('scroll', () => {
            const scrollPos = window.pageYOffset + 120;

            headings.forEach(heading => {
                const offsetTop = heading.offsetTop;

                if (scrollPos >= offsetTop) {
                    toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                    const activeLink = toc.querySelector(`a[data-target="${heading.id}"]`);
                    if (activeLink) activeLink.classList.add('active');
                }
            });
        }, { passive: true });
    }

    /**
     * 加载热门文章
     * 
     * 后端接口调用:
     * fetch('/api/posts?per_page=5')
     *   .then(res => res.json())
     *   .then(data => renderPopularPosts(data));
     */
    async function loadPopularPosts() {
        try {
            const response = await API.getPosts({ per_page: 5 });

            if (response.success) {
                const posts = response.data.data;
                const container = document.getElementById('popular-posts');
                if (!container) return;

                container.innerHTML = posts.map((post, index) => `
                    <li>
                        <a href="./article.html?id=${post.id}">
                            <span class="popular-rank">${index + 1}</span>
                            <span class="popular-title">${post.title}</span>
                        </a>
                    </li>
                `).join('');
            }
        } catch (error) {
            console.error('加载热门文章失败:', error);
        }
    }

    /**
     * 绑定操作按钮
     */
    function bindActionButtons() {
        // 点赞
        const likeBtn = document.getElementById('like-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', () => {
                isLiked = !isLiked;
                const icon = likeBtn.querySelector('i');
                const count = document.getElementById('like-count');
                let likes = parseInt(count.textContent);

                if (isLiked) {
                    likeBtn.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    count.textContent = likes + 1;
                } else {
                    likeBtn.classList.remove('active');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    count.textContent = likes - 1;
                }
            });
        }

        // 分享
        const shareBtn = document.getElementById('share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: currentArticle?.title,
                        text: currentArticle?.excerpt,
                        url: window.location.href
                    });
                } else {
                    navigator.clipboard.writeText(window.location.href);
                    App.showToast('success', '链接已复制到剪贴板');
                }
            });
        }

        // 收藏
        const bookmarkBtn = document.getElementById('bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', () => {
                isBookmarked = !isBookmarked;
                const icon = bookmarkBtn.querySelector('i');

                if (isBookmarked) {
                    bookmarkBtn.classList.add('active');
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    App.showToast('success', '已收藏');
                } else {
                    bookmarkBtn.classList.remove('active');
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    App.showToast('info', '已取消收藏');
                }
            });
        }
    }

    /**
     * 显示错误信息
     */
    function showError(message) {
        const content = document.getElementById('article-content');
        if (content) {
            content.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>${message}</p>
                    <a href="./blog.html" class="btn btn-primary">返回博客列表</a>
                </div>
            `;
        }
    }

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
