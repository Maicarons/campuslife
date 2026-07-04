import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'en-US',
  title: 'CampusLife',
  description: 'CampusLife — All-in-one Campus Life Workstation',

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        nav: [
          { text: '指南', link: '/zh/guide/introduction' },
          { text: '功能模块', link: '/zh/modules/academics' },
          { text: 'API 参考', link: '/zh/api/' },
          { text: '部署', link: '/zh/deploy/' },
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              items: [
                { text: '项目介绍', link: '/zh/guide/introduction' },
                { text: '快速开始', link: '/zh/guide/getting-started' },
                { text: '系统架构', link: '/zh/guide/architecture' },
                { text: '组织架构', link: '/zh/guide/organization' },
              ],
            },
          ],
          '/zh/modules/': [
            {
              text: '功能模块',
              items: [
                { text: '📚 学业管理', link: '/zh/modules/academics' },
                { text: '🍽️ 校园生活', link: '/zh/modules/campus' },
                { text: '💰 财务管理', link: '/zh/modules/finance' },
                { text: '🤝 社交通讯', link: '/zh/modules/social' },
                { text: '🏃 健康管理', link: '/zh/modules/health' },
                { text: '🤖 AI 中枢', link: '/zh/modules/ai' },
              ],
            },
          ],
          '/zh/api/': [
            {
              text: 'API 参考',
              items: [
                { text: '概览', link: '/zh/api/' },
                { text: '认证 (Auth)', link: '/zh/api/auth' },
                { text: '组织架构 (Org)', link: '/zh/api/org' },
                { text: '学业管理', link: '/zh/api/academics' },
                { text: '校园生活', link: '/zh/api/campus' },
                { text: '财务管理', link: '/zh/api/finance' },
                { text: 'AI 服务', link: '/zh/api/ai' },
                { text: '管理后台', link: '/zh/api/admin' },
              ],
            },
          ],
          '/zh/deploy/': [
            {
              text: '部署',
              items: [{ text: 'Docker 部署', link: '/zh/deploy/' }],
            },
          ],
        },
        outline: {
          level: [2, 3],
          label: '页面导航',
        },
        docFooter: {
          prev: '上一篇',
          next: '下一篇',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        search: {
          provider: 'local',
          options: {
            translations: {
              button: { buttonText: '搜索文档', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换' },
              },
            },
          },
        },
      },
    },
  },

  themeConfig: {
    logo: '/hero.png',
    siteTitle: 'CampusLife Docs',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'Modules', link: '/modules/academics' },
      { text: 'API', link: '/api/' },
      { text: 'Deploy', link: '/deploy/' },
      { text: 'GitHub', link: 'https://github.com/campuslife/campuslife' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Architecture', link: '/guide/architecture' },
            { text: 'Organization', link: '/guide/organization' },
          ],
        },
      ],
      '/modules/': [
        {
          text: 'Modules',
          items: [
            { text: '📚 Academics', link: '/modules/academics' },
            { text: '🍽️ Campus Life', link: '/modules/campus' },
            { text: '💰 Finance', link: '/modules/finance' },
            { text: '🤝 Social', link: '/modules/social' },
            { text: '🏃 Health', link: '/modules/health' },
            { text: '🤖 AI Hub', link: '/modules/ai' },
          ],
        },
      ],
      '/api/': [
        {
          text: 'API Reference',
          items: [
            { text: 'Overview', link: '/api/' },
            { text: 'Auth', link: '/api/auth' },
            { text: 'Organization', link: '/api/org' },
            { text: 'Academics', link: '/api/academics' },
            { text: 'Campus', link: '/api/campus' },
            { text: 'Finance', link: '/api/finance' },
            { text: 'AI', link: '/api/ai' },
            { text: 'Admin', link: '/api/admin' },
          ],
        },
      ],
      '/deploy/': [
        {
          text: 'Deployment',
          items: [{ text: 'Docker', link: '/deploy/' }],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/campuslife/campuslife' },
    ],

    footer: {
      message: 'CampusLife — All-in-one Campus Life Workstation',
      copyright: '© 2025 CampusLife Team',
    },

    search: {
      provider: 'local',
    },

    outline: {
      level: [2, 3],
      label: 'On this page',
    },

    docFooter: {
      prev: 'Previous',
      next: 'Next',
    },

    lastUpdated: {
      text: 'Last updated',
    },

    returnToTopLabel: 'Back to top',
    sidebarMenuLabel: 'Menu',
    darkModeSwitchLabel: 'Appearance',
  },
})
