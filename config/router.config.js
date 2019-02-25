export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
      { component: '404' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [

      { path: '/', redirect: '/member/list' },

      {
        name: '会员管理',
        icon: 'team',
        path: '/member',
        routes: [
          { path: '/member', redirect: '/member/list' },
          {
            name: '会员查询',
            path: 'list',
            component: './MemberManage/MemberList',
          },
          {
            name: '会员详情',
            path: 'detail/:id',
            hideInMenu: true,
            component: './MemberManage/MemberDetail',
          },
        ]
      },

      {
        name: '内容管理',
        icon: 'project',
        path: '/content',
        routes: [
          { path: '/content', redirect: '/content/category' },
          {
            name: '分类管理',
            path: 'category',
            component: './ContentManage/Category',
          },
          {
            name: '文章管理',
            path: 'article',
            component: './ContentManage/ArticleList',
          },
          {
            name: '动态管理',
            path: 'dynamic',
            component: './ContentManage/Dynamic',
          },
          {
            name: '数据源管理',
            path: 'source',
            component: './ContentManage/Source',
          },
        ]
      },

      {
        name: '商品管理',
        icon: 'shop',
        path: '/goods',
        routes: [
          { path: '/goods', redirect: '/goods/list' },
          {
            name: '商品列表',
            path: 'list',
            component: './GoodsManage/GoodsList',
          },
          {
            name: '商品分类',
            path: 'category',
            component: './GoodsManage/GoodsCategory',
          },
        ]
      },

      {
        name: '管理员管理',
        icon: 'user',
        path: '/users',
        routes: [
          { path: '/users', redirect: '/users/list' },
          {
            name: '管理员列表',
            path: 'list',
            component: './UserManage/UserList',
          },
          {
            name: '角色列表',
            path: 'role',
            component: './UserManage/RoleList',
          },
        ]
      },

      // forms
      {
        path: '/form',
        icon: 'form',
        name: '表单',
        routes: [
          {
            path: '/form/basic-form',
            name: '基础表单',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: '分步表单',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: '基本信息',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: '对话框',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: '结果',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: '高级表单',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },


      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
