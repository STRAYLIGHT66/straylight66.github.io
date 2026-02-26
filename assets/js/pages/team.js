/**
 * Team Blog - 团队页面逻辑
 * 
 * 后端接口预留:
 * GET /api/members - 获取团队成员列表
 */

(function () {
    'use strict';

    /**
     * 初始化团队页面
     */
    async function init() {
        await loadMembers();
    }

    /**
     * 加载团队成员
     * 
     * 后端接口调用:
     * fetch('/api/members')
     *   .then(res => res.json())
     *   .then(data => renderMembers(data));
     */
    async function loadMembers() {
        try {
            const response = await API.getMembers();

            if (response.success) {
                const members = response.data;
                const container = document.getElementById('members-grid');
                if (!container) return;

                container.innerHTML = members.map((member, index) => `
                    <div class="member-card reveal-on-scroll" 
                         style="animation-delay: ${index * 0.1}s">
                        <div class="member-avatar">
                            <img src="${member.avatar}" alt="${member.name}">
                        </div>
                        <div class="member-info">
                            <h3 class="member-name">${member.name}</h3>
                            <p class="member-role">${member.role}</p>
                            <p class="member-bio">${member.bio}</p>
                            <div class="member-social">
                                ${member.social.github ? `
                                    <a href="${member.social.github}" target="_blank" 
                                       class="social-link" title="GitHub">
                                        <i class="fab fa-github"></i>
                                    </a>
                                ` : ''}
                                ${member.social.twitter ? `
                                    <a href="${member.social.twitter}" target="_blank" 
                                       class="social-link" title="Twitter">
                                        <i class="fab fa-twitter"></i>
                                    </a>
                                ` : ''}
                                ${member.social.linkedin ? `
                                    <a href="${member.social.linkedin}" target="_blank" 
                                       class="social-link" title="LinkedIn">
                                        <i class="fab fa-linkedin"></i>
                                    </a>
                                ` : ''}
                                <a href="mailto:${member.email}" class="social-link" title="Email">
                                    <i class="fas fa-envelope"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `).join('');

                // 重新初始化滚动显示
                App.initScrollEffects();
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
