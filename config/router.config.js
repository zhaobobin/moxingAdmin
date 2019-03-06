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
        path: 'member',
        key: 'member',
        routes: [
          { path: '/member', redirect: '/member/list' },
          {
            name: '会员列表',
            path: 'list',
            key: 'list',
            component: './MemberManage/MemberList',
          },
          {
            name: '会员详情',
            path: 'detail/:id',
            key: 'detail',
            hideInMenu: true,
            component: './MemberManage/MemberDetail',
          },
        ]
      },

      {
        name: '内容管理',
        icon: 'project',
        path: 'content',
        key: 'content',
        routes: [
          { path: '/content', redirect: '/content/category' },
          {
            name: '分类管理',
            path: 'category',
            key: 'category',
            component: './ContentManage/Category',
          },
          {
            name: '文章管理',
            path: 'article',
            key: 'article',
            component: './ContentManage/ArticleList',
          },
          {
            name: '动态管理',
            path: 'dynamic',
            key: 'dynamic',
            component: './ContentManage/Dynamic',
          },
          {
            name: '数据源管理',
            path: 'source',
            key: 'source',
            component: './ContentManage/Source',
          },
        ]
      },

      {
        name: '票务管理',
        icon: 'qrcode',
        path: 'ticket',
        key: 'ticket',
        routes: [
          { path: '/ticket', redirect: '/ticket/exhibition' },
          {
            name: '展会列表',
            path: 'exhibition',
            key: 'exhibition',
            component: './TicketManage/ExhibitionList',
          },
          {
            name: '创建展会',
            path: 'exhibition-add',
            key: 'exhibition-add',
            hideInMenu: true,
            component: './TicketManage/ExhibitionAdd',
          },
          {
            name: '编辑展会',
            path: 'exhibition-edit/:id',
            key: 'exhibition-edit',
            hideInMenu: true,
            component: './TicketManage/ExhibitionEdit',
          },


          {
            name: '展会票统计',
            path: 'list',
            key: 'ticket-list',
            component: './TicketManage/TicketList',
          },
          {
            name: '添加展会票',
            path: 'ticket-add',
            key: 'ticket-add',
            hideInMenu: true,
            component: './TicketManage/TicketAdd',
          },
          {
            name: '编辑展会票',
            path: 'ticket-edit/:id',
            key: 'ticket-edit',
            hideInMenu: true,
            component: './TicketManage/TicketEdit',
          },

        ]
      },

      {
        name: '商品管理',
        icon: 'shop',
        path: 'goods',
        key: 'goods',
        routes: [
          { path: '/goods', redirect: '/goods/list' },
          {
            name: '商品列表',
            path: 'list',
            key: 'list',
            component: './GoodsManage/GoodsList',
          },
          {
            name: '商品分类',
            path: 'category',
            key: 'category',
            component: './GoodsManage/GoodsCategory',
          },
        ]
      },

      {
        name: '管理员管理',
        icon: 'user',
        path: 'users',
        key: 'users',
        routes: [
          { path: '/users', redirect: '/users/list' },
          {
            name: '管理员列表',
            path: 'list',
            key: 'list',
            component: './UserManage/UserList',
          },
          {
            name: '角色列表',
            path: 'role',
            key: 'sole',
            component: './UserManage/RoleList',
          },
        ]
      },

      // forms
      {
        path: 'form',
        icon: 'form',
        name: '表单',
        key: 'form',
        routes: [
          {
            path: 'basic-form',
            name: '基础表单',
            key: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: 'step-form',
            name: '分步表单',
            key: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              { path: '/form/step-form', redirect: '/form/step-form/info' },
              {
                path: 'info',
                name: '基本信息',
                key: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: 'confirm',
                name: '对话框',
                key: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: 'result',
                name: '结果',
                key: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: 'advanced-form',
            name: '高级表单',
            key: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },


      {
        name: 'exception',
        icon: 'warning',
        path: 'exception',
        key: 'exception',
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
