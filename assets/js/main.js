/**
 * Team Blog - 主逻辑模块
 * 通用功能和交互
 */

(function () {
    'use strict';

    // 应用主对象
    const App = {
        /**
         * 初始化应用
         */
        init() {
            this.initNavigation();
            this.initScrollEffects();
            this.initSearch();
            this.initLazyLoad();
            this.bindGlobalEvents();
            this.hidePageLoader();
        },

        /**
         * 隐藏页面加载器
         */
        hidePageLoader() {
            const loader = document.querySelector('.page-loader');
            if (loader) {
                window.addEventListener('load', () => {
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 400);
                });

                // 如果页面已加载
                if (document.readyState === 'complete') {
                    setTimeout(() => {
                        loader.classList.add('hidden');
                    }, 400);
                }
            }
        },

        /**
         * 初始化导航
         */
        initNavigation() {
            // 高亮当前页面导航
            const currentPath = window.location.pathname;
            const currentPage = currentPath.split('/').pop() || 'index.html';

            document.querySelectorAll('.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.includes(currentPage)) {
                    link.classList.add('active');
                }
            });

            // 移动端菜单
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            const mobileNav = document.querySelector('.mobile-nav');

            if (mobileMenuBtn && mobileNav) {
                mobileMenuBtn.addEventListener('click', () => {
                    mobileNav.classList.toggle('active');
                    mobileMenuBtn.classList.toggle('active');
                });

                // 点击外部关闭
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.mobile-nav') &&
                        !e.target.closest('.mobile-menu-btn')) {
                        mobileNav.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                    }
                });
            }

            // 头部滚动效果
            const header = document.querySelector('.header');
            if (header) {
                let lastScroll = 0;

                window.addEventListener('scroll', () => {
                    const currentScroll = window.pageYOffset;

                    // 添加阴影
                    if (currentScroll > 10) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }

                    // 隐藏/显示头部
                    if (currentScroll > lastScroll && currentScroll > 100) {
                        header.classList.add('hidden');
                    } else {
                        header.classList.remove('hidden');
                    }

                    lastScroll = currentScroll;
                });
            }
        },

        /**
         * 初始化滚动效果
         */
        initScrollEffects() {
            // 滚动显示动画
            const revealElements = document.querySelectorAll('.reveal-on-scroll');

            const revealOnScroll = () => {
                revealElements.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    const windowHeight = window.innerHeight;

                    if (rect.top < windowHeight * 0.88) {
                        el.classList.add('revealed');
                    }
                });
            };

            // 初始检查
            revealOnScroll();

            // 滚动时检查
            window.addEventListener('scroll', revealOnScroll, { passive: true });
        },

        /**
         * 初始化搜索
         */
        initSearch() {
            const searchToggle = document.querySelector('.search-toggle');
            const searchOverlay = document.querySelector('.search-overlay');
            const searchInput = document.querySelector('.search-input');
            const searchResults = document.querySelector('.search-results');

            if (!searchToggle || !searchOverlay) return;

            let searchTimeout = null;

            // 打开搜索
            searchToggle.addEventListener('click', () => {
                searchOverlay.classList.add('active');
                if (searchInput) {
                    setTimeout(() => searchInput.focus(), 100);
                }
            });

            // 关闭搜索
            searchOverlay.addEventListener('click', (e) => {
                if (e.target === searchOverlay || e.target.closest('.search-close')) {
                    searchOverlay.classList.remove('active');
                    if (searchInput) searchInput.value = '';
                    if (searchResults) searchResults.innerHTML = '';
                }
            });

            // ESC 关闭
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
                    searchOverlay.classList.remove('active');
                }
            });

            // 搜索输入
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const keyword = e.target.value.trim();

                    clearTimeout(searchTimeout);

                    if (keyword.length < 2) {
                        if (searchResults) searchResults.innerHTML = '';
                        return;
                    }

                    searchTimeout = setTimeout(() => {
                        this.performSearch(keyword);
                    }, 300);
                });
            }
        },

        /**
         * 执行搜索
         * @param {string} keyword - 搜索关键词
         * 
         * 后端接口: GET /api/posts?search=keyword
         */
        async performSearch(keyword) {
            const searchResults = document.querySelector('.search-results');
            if (!searchResults) return;

            searchResults.innerHTML = `
                <div class="search-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>搜索中...</p>
                </div>
            `;

            try {
                const response = await API.searchPosts(keyword, { per_page: 5 });

                if (response.success && response.data.data.length > 0) {
                    const posts = response.data.data;
                    let html = '<div class="search-results-list">';

                    posts.forEach(post => {
                        html += `
                            <a href="./article.html?id=${post.id}" class="search-result-item">
                                <div class="search-result-title">${post.title}</div>
                                <div class="search-result-excerpt">${post.excerpt}</div>
                            </a>
                        `;
                    });

                    html += '</div>';
                    html += `
                        <div class="search-results-more">
                            <a href="./blog.html?search=${encodeURIComponent(keyword)}">
                                查看全部结果
                            </a>
                        </div>
                    `;

                    searchResults.innerHTML = html;
                } else {
                    searchResults.innerHTML = `
                        <div class="search-empty">未找到相关文章</div>
                    `;
                }
            } catch (error) {
                searchResults.innerHTML = `
                    <div class="search-error">搜索失败，请重试</div>
                `;
            }
        },

        /**
         * 初始化懒加载
         */
        initLazyLoad() {
            const lazyImages = document.querySelectorAll('img[data-src]');

            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                lazyImages.forEach(img => imageObserver.observe(img));
            } else {
                // 回退方案
                lazyImages.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        },

        /**
         * 绑定全局事件
         */
        bindGlobalEvents() {
            // 平滑滚动到锚点
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                });
            });

            // 返回顶部按钮
            const backToTop = document.querySelector('.back-to-top');
            if (backToTop) {
                window.addEventListener('scroll', () => {
                    if (window.pageYOffset > 300) {
                        backToTop.classList.add('visible');
                    } else {
                        backToTop.classList.remove('visible');
                    }
                }, { passive: true });

                backToTop.addEventListener('click', () => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        },

        /**
         * 显示 Toast 通知
         * @param {string} type - 类型 (success/error/warning/info)
         * @param {string} message - 消息内容
         */
        showToast(type, message) {
            let container = document.querySelector('.toast-container');

            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }

            const icons = {
                success: 'check-circle',
                error: 'times-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };

            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.innerHTML = `
                <div class="toast-icon">
                    <i class="fas fa-${icons[type]}"></i>
                </div>
                <div class="toast-content">
                    <div class="toast-message">${message}</div>
                </div>
                <button class="toast-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

            container.appendChild(toast);

            // 自动关闭
            const timeout = setTimeout(() => {
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            }, 4000);

            // 点击关闭
            toast.querySelector('.toast-close').addEventListener('click', () => {
                clearTimeout(timeout);
                toast.classList.add('hiding');
                setTimeout(() => toast.remove(), 300);
            });
        },

        /**
         * 格式化日期
         * @param {string} dateString - 日期字符串
         * @returns {string}
         */
        formatDate(dateString) {
            const date = new Date(dateString);
            const now = new Date();
            const diff = now - date;

            if (diff < 60000) return '刚刚';
            if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
            if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
            if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        },

        /**
         * 截断文本
         * @param {string} text - 原文本
         * @param {number} length - 最大长度
         * @returns {string}
         */
        truncate(text, length = 100) {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        }
    };

    // 暴露到全局
    window.App = App;

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

})();
