/**
 * Team Blog - 主题切换模块
 * 支持5种主题切换，右侧滑出菜单
 * 
 * 后端接口预留:
 * GET /api/settings/theme - 获取用户主题偏好
 * POST /api/settings/theme - 保存用户主题偏好
 */

(function () {
    'use strict';

    // 主题配置
    const themes = {
        dark: {
            name: '暗黑',
            description: '经典深色主题',
            previewClass: 'theme-preview-dark'
        },
        ocean: {
            name: '海洋',
            description: '深邃蓝色主题',
            previewClass: 'theme-preview-ocean'
        },
        light: {
            name: '明亮',
            description: '清新浅色主题',
            previewClass: 'theme-preview-light'
        },

        vibrant: {
            name: '活力',
            description: '热情橙色主题',
            previewClass: 'theme-preview-vibrant'
        },
        elegant: {
            name: '优雅',
            description: '高贵紫色主题',
            previewClass: 'theme-preview-elegant'
        }
    };

    // 主题管理器
    const ThemeManager = {
        currentTheme: 'dark',
        storageKey: 'team-blog-theme',
        isMenuOpen: false,

        /**
         * 初始化主题系统
         */
        init() {
            this.loadTheme();
            this.createThemeUI();
            this.bindEvents();
        },

        /**
         * 加载主题（从本地存储或系统偏好）
         * 
         * 后端接口调用示例:
         * fetch('/api/settings/theme')
         *   .then(res => res.json())
         *   .then(data => this.applyTheme(data.theme, false));
         */
        loadTheme() {
            const savedTheme = localStorage.getItem(this.storageKey);

            if (savedTheme && themes[savedTheme]) {
                this.currentTheme = savedTheme;
            } else {
                // 检测系统偏好
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                this.currentTheme = prefersDark ? 'dark' : 'light';
            }

            this.applyTheme(this.currentTheme, false);
        },

        /**
         * 应用主题
         * @param {string} themeName - 主题名称
         * @param {boolean} animate - 是否启用过渡动画
         * 
         * 后端接口调用示例:
         * fetch('/api/settings/theme', {
         *   method: 'POST',
         *   headers: { 'Content-Type': 'application/json' },
         *   body: JSON.stringify({ theme: themeName })
         * });
         */
        applyTheme(themeName, animate = true) {
            if (!themes[themeName]) return;

            const html = document.documentElement;

            if (animate) {
                document.body.style.opacity = '0.85';

                setTimeout(() => {
                    html.setAttribute('data-theme', themeName);
                    this.currentTheme = themeName;
                    document.body.style.opacity = '1';
                }, 100);
            } else {
                html.setAttribute('data-theme', themeName);
                this.currentTheme = themeName;
            }

            localStorage.setItem(this.storageKey, themeName);
            this.updateThemeUI();

            // 触发自定义事件
            document.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { theme: themeName }
            }));
        },

        /**
         * 获取当前主题
         * @returns {string}
         */
        getCurrentTheme() {
            return this.currentTheme;
        },

        /**
         * 创建主题切换UI
         */
        createThemeUI() {
            if (document.querySelector('.theme-menu')) return;

            // 创建设置按钮（齿轮）- 修复：使用独立容器避免tooltip跟随旋转
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'settings-btn';
            settingsBtn.setAttribute('data-tooltip', '主题设置');
            settingsBtn.setAttribute('aria-label', '打开主题设置');
            settingsBtn.innerHTML = '<i class="fas fa-cog gear-icon"></i>';

            // 创建菜单遮罩
            const menuOverlay = document.createElement('div');
            menuOverlay.className = 'theme-menu-overlay';

            // 创建主题菜单
            const themeMenu = document.createElement('div');
            themeMenu.className = 'theme-menu';
            themeMenu.setAttribute('role', 'dialog');
            themeMenu.setAttribute('aria-labelledby', 'theme-menu-title');

            // 菜单头部
            const menuHeader = document.createElement('div');
            menuHeader.className = 'theme-menu-header';
            menuHeader.innerHTML = `
                <h2 class="theme-menu-title" id="theme-menu-title">主题设置</h2>
                <button class="theme-menu-close" aria-label="关闭菜单">
                    <i class="fas fa-times"></i>
                </button>
            `;

            // 菜单内容
            const menuContent = document.createElement('div');
            menuContent.className = 'theme-menu-content';

            // 主题选择区域
            const themeSection = document.createElement('div');
            themeSection.className = 'theme-section';
            themeSection.innerHTML = '<h3 class="theme-section-title">双击选择主题</h3>';

            const themeOptions = document.createElement('div');
            themeOptions.className = 'theme-options';

            Object.keys(themes).forEach(themeKey => {
                const theme = themes[themeKey];
                const option = document.createElement('div');
                option.className = `theme-option ${themeKey === this.currentTheme ? 'active' : ''}`;
                option.setAttribute('data-theme', themeKey);
                option.setAttribute('role', 'button');
                option.setAttribute('tabindex', '0');
                option.setAttribute('aria-pressed', themeKey === this.currentTheme);

                option.innerHTML = `
                    <div class="theme-preview ${theme.previewClass}"></div>
                    <div class="theme-info">
                        <div class="theme-name">${theme.name}</div>
                        <div class="theme-desc">${theme.description}</div>
                    </div>
                    <div class="theme-check">
                        <i class="fas fa-check"></i>
                    </div>
                `;

                themeOptions.appendChild(option);
            });

            themeSection.appendChild(themeOptions);
            menuContent.appendChild(themeSection);

            // 其他设置区域
            const otherSection = document.createElement('div');
            otherSection.className = 'theme-section';
            otherSection.innerHTML = '<h3 class="theme-section-title">其他设置</h3>';

            const resetBtn = document.createElement('button');
            resetBtn.className = 'reset-theme-btn';
            resetBtn.id = 'reset-theme';
            resetBtn.innerHTML = `
                <div class="icon">
                    <i class="fas fa-undo"></i>
                </div>
                <div class="theme-info">
                    <div class="theme-name">恢复默认</div>
                    <div class="theme-desc">重置为系统默认主题</div>
                </div>
            `;

            otherSection.appendChild(resetBtn);
            menuContent.appendChild(otherSection);

            // 组装菜单
            themeMenu.appendChild(menuHeader);
            themeMenu.appendChild(menuContent);

            // 添加到页面
            document.body.appendChild(settingsBtn);
            document.body.appendChild(menuOverlay);
            document.body.appendChild(themeMenu);
        },

        /**
         * 更新主题UI状态
         */
        updateThemeUI() {
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('active');
                option.setAttribute('aria-pressed', 'false');
            });

            const activeOption = document.querySelector(`.theme-option[data-theme="${this.currentTheme}"]`);
            if (activeOption) {
                activeOption.classList.add('active');
                activeOption.setAttribute('aria-pressed', 'true');
            }
        },

        /**
         * 打开主题菜单
         */
        openMenu() {
            document.querySelector('.settings-btn').classList.add('active');
            document.querySelector('.theme-menu-overlay').classList.add('active');
            document.querySelector('.theme-menu').classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isMenuOpen = true;

            setTimeout(() => {
                document.querySelector('.theme-menu-close').focus();
            }, 100);
        },

        /**
         * 关闭主题菜单
         */
        closeMenu() {
            document.querySelector('.settings-btn').classList.remove('active');
            document.querySelector('.theme-menu-overlay').classList.remove('active');
            document.querySelector('.theme-menu').classList.remove('active');
            document.body.style.overflow = '';
            this.isMenuOpen = false;

            document.querySelector('.settings-btn').focus();
        },

        /**
         * 切换菜单状态
         */
        toggleMenu() {
            if (this.isMenuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        },

        /**
         * 绑定事件
         */
        bindEvents() {
            const self = this;

            // 设置按钮点击
            document.addEventListener('click', function (e) {
                if (e.target.closest('.settings-btn')) {
                    e.stopPropagation();
                    self.toggleMenu();
                }
            });

            // 关闭按钮点击
            document.addEventListener('click', function (e) {
                if (e.target.closest('.theme-menu-close')) {
                    self.closeMenu();
                }
            });

            // 遮罩点击
            document.addEventListener('click', function (e) {
                if (e.target.classList.contains('theme-menu-overlay')) {
                    self.closeMenu();
                }
            });

            // 主题选项点击
            document.addEventListener('click', function (e) {
                const option = e.target.closest('.theme-option[data-theme]');
                if (option) {
                    const theme = option.getAttribute('data-theme');
                    self.applyTheme(theme);
                }
            });

            // 主题选项键盘事件
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    const option = e.target.closest('.theme-option[data-theme]');
                    if (option) {
                        e.preventDefault();
                        const theme = option.getAttribute('data-theme');
                        self.applyTheme(theme);
                    }
                }
            });

            // 恢复默认
            document.addEventListener('click', function (e) {
                if (e.target.closest('#reset-theme')) {
                    localStorage.removeItem(self.storageKey);
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    self.applyTheme(prefersDark ? 'dark' : 'light');
                }
            });

            // ESC键关闭菜单
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && self.isMenuOpen) {
                    self.closeMenu();
                }
            });

            // 防止菜单内部点击关闭
            document.addEventListener('click', function (e) {
                if (e.target.closest('.theme-menu')) {
                    e.stopPropagation();
                }
            });

            // 监听系统主题变化
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!localStorage.getItem(self.storageKey)) {
                    self.applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    };

    // 暴露到全局
    window.ThemeManager = ThemeManager;

    // 初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            ThemeManager.init();
        });
    } else {
        ThemeManager.init();
    }

})();
