/**
 * Team Blog - API 模块
 * 前端与后端通信封装，当前使用模拟数据
 * 
 * 后端接口预留清单:
 * 
 * 文章相关:
 * GET    /api/posts              - 获取文章列表
 * GET    /api/posts/:id          - 获取单篇文章
 * POST   /api/posts              - 创建文章 (需认证)
 * PUT    /api/posts/:id          - 更新文章 (需认证)
 * DELETE /api/posts/:id          - 删除文章 (需认证)
 * 
 * 分类相关:
 * GET    /api/categories         - 获取分类列表
 * GET    /api/categories/:slug   - 获取分类详情
 * 
 * 标签相关:
 * GET    /api/tags               - 获取标签列表
 * 
 * 用户相关:
 * GET    /api/users              - 获取用户列表 (需认证)
 * GET    /api/users/:id          - 获取用户详情
 * POST   /api/auth/login         - 用户登录
 * POST   /api/auth/logout        - 用户登出
 * GET    /api/auth/me            - 获取当前用户信息 (需认证)
 * 
 * 设置相关:
 * GET    /api/settings           - 获取站点设置
 * PUT    /api/settings           - 更新站点设置 (需认证)
 * GET    /api/settings/theme     - 获取用户主题偏好
 * POST   /api/settings/theme     - 保存用户主题偏好
 */

(function () {
    'use strict';

    // API 配置
    const API_CONFIG = {
        // 后端 API 基础地址（部署时修改此处）
        baseURL: '/api',

        // 当前使用模拟数据
        useMock: true,

        // 请求超时时间（毫秒）
        timeout: 10000,

        // 重试次数
        retryCount: 3
    };

    // 模拟数据
    const mockData = {
        // 文章列表
        posts: [
            {
                id: 1,
                title: '文章 1',
                excerpt: '文章简介 | 文章简介 | 文章简介 | 文章简介',
                content: '<p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p><h2>文章内容</h2><p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p>',
                author: {
                    id: 1,
                    name: '张三',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=114514'
                },
                category: {
                    id: 1,
                    name: ['角标1', '角标2'],
                },
                tags: ['tag1', 'tag2', 'tag3'],
                cover: 'https://picsum.photos/800/400?random=78',
                views: 1234,
                likes: 56,
                comments: 78,
                created_at: '2026-91-78T10:30:00Z',
                updated_at: '2026-91-78T10:30:00Z'
            },
            {
                id: 2,
                title: '文章 2',
                excerpt: '文章简介 | 文章简介 | 文章简介 | 文章简介',
                content: '<p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p><h2>文章内容</h2><p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p>',
                author: {
                    id: 1,
                    name: '张三',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1919'
                },
                category: {
                    id: 1,
                    name: '角标1',
                },
                tags: ['tag1', 'tag2', 'tag3'],
                cover: 'https://picsum.photos/800/400?random=96',
                views: 1234,
                likes: 56,
                comments: 78,
                created_at: '2026-91-78T10:30:00Z',
                updated_at: '2026-91-78T10:30:00Z'
            },
            {
                id: 3,
                title: '文章 3',
                excerpt: '文章简介 | 文章简介 | 文章简介 | 文章简介',
                content: '<p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p><h2>文章内容</h2><p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p>',
                author: {
                    id: 1,
                    name: '张三',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=810'
                },
                category: {
                    id: 1,
                    name: '角标1',
                },
                tags: ['tag1', 'tag2', 'tag3'],
                cover: 'https://picsum.photos/800/400?random=999',
                views: 1234,
                likes: 56,
                comments: 78,
                created_at: '2026-91-78T10:30:00Z',
                updated_at: '2026-91-78T10:30:00Z'
            },
            {
                id: 4,
                title: '文章 4',
                excerpt: '文章简介 | 文章简介 | 文章简介 | 文章简介',
                content: '<p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p><h2>文章内容</h2><p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p>',
                author: {
                    id: 1,
                    name: '张三',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1145'
                },
                category: {
                    id: 1,
                    name: '角标1',
                },
                tags: ['tag1', 'tag2', 'tag3'],
                cover: 'https://picsum.photos/800/400?random=114',
                views: 1234,
                likes: 56,
                comments: 78,
                created_at: '2026-91-78T10:30:00Z',
                updated_at: '2026-91-78T10:30:00Z'
            },
            {
                id: 5,
                title: '文章 5',
                excerpt: '文章简介 | 文章简介 | 文章简介 | 文章简介',
                content: '<p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p><h2>文章内容</h2><p>文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容 | 文章内容</p>',
                author: {
                    id: 1,
                    name: '张三',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=541'
                },
                category: {
                    id: 1,
                    name: '角标1',
                },
                tags: ['tag1', 'tag2', 'tag3'],
                cover: 'https://picsum.photos/800/400?random=9',
                views: 1234,
                likes: 56,
                comments: 78,
                created_at: '2026-91-78T10:30:00Z',
                updated_at: '2026-91-78T10:30:00Z'
            },
        ],

        // 分类列表
        categories: [
            { id: 1, name: '分类1', slug: 'design', count: 99 },
            { id: 2, name: '分类2', slug: 'tech', count: 78 },
            { id: 3, name: '分类3', slug: 'management', count: 19 },
            { id: 4, name: '分类4', slug: 'life', count: 99 },
            { id: 5, name: '分类5', slug: 'essay', count: 114514 }
        ],

        // 标签列表
        tags: [
            { id: 1, name: '标签1', slug: 'tag1' },
            { id: 2, name: '标签2', slug: 'tag2' },
            { id: 3, name: '标签3', slug: 'tag3' },
            { id: 4, name: '标签4', slug: 'tag4' },
            { id: 5, name: '标签5', slug: 'tag5' },
            { id: 6, name: '标签6', slug: 'tag6' },
            { id: 7, name: '标签7', slug: 'tag7' },
            { id: 8, name: '标签8', slug: 'tag8' }
        ],

        // 团队成员
        members: [
            {
                id: 1,
                name: '张三',
                role: '创始人 / 设计师',
                bio: '热爱设计，专注于用户体验和界面设计。',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
                email: 'zhangsan@example.com',
                social: {
                    github: 'https://github.com',
                    twitter: 'https://twitter.com',
                    linkedin: 'https://linkedin.com'
                }
            },
            {
                id: 1,
                name: '张三',
                role: '创始人 / 设计师',
                bio: '热爱设计，专注于用户体验和界面设计。',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
                email: 'zhangsan@example.com',
                social: {
                    github: 'https://github.com',
                    twitter: 'https://twitter.com',
                    linkedin: 'https://linkedin.com'
                }
            }
        ],

        // 站点信息
        site: {
            name: 'Team Blog',
            description: '介绍介绍介绍',
            logo: './assets/images/favicon.svg',
            favicon: './assets/images/favicon.svg',
            social: {
                github: 'https://github.com',
                twitter: 'https://twitter.com',
                weibo: 'https://weibo.com'
            }
        }
    };

    // API 对象
    const API = {
        /**
         * 发送请求（预留后端接口）
         * @param {string} endpoint - 接口地址
         * @param {object} options - 请求选项
         * @returns {Promise}
         * 
         * 使用示例:
         * API.request('/posts', { method: 'GET', data: { page: 1 } })
         *   .then(response => console.log(response));
         */
        async request(endpoint, options = {}) {
            if (API_CONFIG.useMock) {
                return this.mockRequest(endpoint, options);
            }

            const url = API_CONFIG.baseURL + endpoint;
            const config = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                ...options
            };

            try {
                const response = await fetch(url, config);
                const data = await response.json();
                return {
                    success: response.ok,
                    data: data,
                    message: data.message || ''
                };
            } catch (error) {
                console.error('API Error:', error);
                return {
                    success: false,
                    data: null,
                    message: error.message || '请求失败'
                };
            }
        },

        /**
         * 模拟请求（用于前端独立运行）
         */
        async mockRequest(endpoint, options = {}) {
            // 模拟网络延迟
            await new Promise(resolve => setTimeout(resolve, 20));

            const method = options.method || 'GET';
            const data = options.data || {};
            const parts = endpoint.split('/').filter(p => p);
            const resource = parts[0];
            const id = parts[1] && !isNaN(parts[1]) ? parseInt(parts[1]) : null;

            let result = null;

            switch (resource) {
                case 'posts':
                    result = this.mockPosts(id, data);
                    break;
                case 'categories':
                    result = mockData.categories;
                    break;
                case 'tags':
                    result = mockData.tags;
                    break;
                case 'members':
                    result = mockData.members;
                    break;
                case 'site':
                    result = mockData.site;
                    break;
                default:
                    return {
                        success: false,
                        data: null,
                        message: '接口不存在'
                    };
            }

            return {
                success: true,
                data: result,
                message: ''
            };
        },

        /**
         * 模拟文章接口
         */
        mockPosts(id, params) {
            let posts = [...mockData.posts];

            // 搜索
            if (params.search) {
                const keyword = params.search.toLowerCase();
                posts = posts.filter(p =>
                    p.title.toLowerCase().includes(keyword) ||
                    p.excerpt.toLowerCase().includes(keyword)
                );
            }

            // 分类筛选
            if (params.category) {
                posts = posts.filter(p => p.category.slug === params.category);
            }

            // 标签筛选
            if (params.tag) {
                posts = posts.filter(p => p.tags.includes(params.tag));
            }

            // 获取单篇文章
            if (id) {
                return posts.find(p => p.id === id) || null;
            }

            // 分页
            const page = parseInt(params.page) || 1;
            const perPage = parseInt(params.per_page) || 10;
            const total = posts.length;
            const totalPages = Math.ceil(total / perPage);
            const start = (page - 1) * perPage;
            const end = start + perPage;
            posts = posts.slice(start, end);

            return {
                data: posts,
                pagination: {
                    page: page,
                    per_page: perPage,
                    total: total,
                    total_pages: totalPages
                }
            };
        },

        // ========== 文章相关接口 ==========

        /**
         * 获取文章列表
         * @param {object} params - 查询参数 { page, per_page, category, tag, search }
         * @returns {Promise}
         * 
         * 后端接口: GET /api/posts?page=1&per_page=10&category=tech
         */
        async getPosts(params = {}) {
            return this.request('posts', { data: params });
        },

        /**
         * 获取单篇文章
         * @param {number} id - 文章ID
         * @returns {Promise}
         * 
         * 后端接口: GET /api/posts/:id
         */
        async getPost(id) {
            return this.request(`posts/${id}`);
        },

        /**
         * 搜索文章
         * @param {string} keyword - 关键词
         * @param {object} params - 其他参数
         * @returns {Promise}
         * 
         * 后端接口: GET /api/posts?search=keyword
         */
        async searchPosts(keyword, params = {}) {
            return this.request('posts', {
                data: { ...params, search: keyword }
            });
        },

        // ========== 分类相关接口 ==========

        /**
         * 获取分类列表
         * @returns {Promise}
         * 
         * 后端接口: GET /api/categories
         */
        async getCategories() {
            return this.request('categories');
        },

        // ========== 标签相关接口 ==========

        /**
         * 获取标签列表
         * @returns {Promise}
         * 
         * 后端接口: GET /api/tags
         */
        async getTags() {
            return this.request('tags');
        },

        // ========== 成员相关接口 ==========

        /**
         * 获取团队成员列表
         * @returns {Promise}
         * 
         * 后端接口: GET /api/members
         */
        async getMembers() {
            return this.request('members');
        },

        // ========== 站点相关接口 ==========

        /**
         * 获取站点信息
         * @returns {Promise}
         * 
         * 后端接口: GET /api/site
         */
        async getSiteInfo() {
            return this.request('site');
        }
    };

    // 暴露到全局
    window.API = API;
    window.API_CONFIG = API_CONFIG;

})();
