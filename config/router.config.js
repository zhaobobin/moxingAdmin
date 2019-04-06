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
            name: '文章分类',
            path: 'category',
            key: 'category',
            component: './ContentManage/ArticleCategory',
          },
          {
            name: '文章管理',
            path: 'article',
            key: 'article',
            component: './ContentManage/ArticleList',
          },
          {
            name: '添加文章',
            path: 'article-add',
            key: 'article-add',
            hideInMenu: true,
            component: './ContentManage/ArticleAdd',
          },
          {
            name: '编辑文章',
            path: 'article-edit/:id',
            key: 'article-edit',
            hideInMenu: true,
            component: './ContentManage/ArticleEdit',
          },
          {
            name: '评论管理',
            path: 'article-comment/:id',
            key: 'article-comment',
            hideInMenu: true,
            component: './ContentManage/ArticleComment',
          },
          {
            name: '动态管理',
            path: 'dynamic',
            key: 'article-dynamic',
            component: './ContentManage/ArticleDynamic',
          },
          {
            name: '数据源管理',
            path: 'source',
            key: 'article-source',
            component: './ContentManage/ArticleSource',
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
            name: '展会票务统计',
            path: 'list/:id',
            key: 'ticket-list',
            hideInMenu: true,
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

          {
            name: '活动列表',
            path: 'activity',
            key: 'activity-list',
            component: './TicketManage/ActivityList',
          },
          {
            name: '创建活动',
            path: 'activity-add',
            key: 'activity-add',
            hideInMenu: true,
            component: './TicketManage/ActivityAdd',
          },
          {
            name: '编辑活动',
            path: 'activity-edit/:id',
            key: 'activity-edit',
            hideInMenu: true,
            component: './TicketManage/ActivityEdit',
          },

          {
            name: '抽奖活动',
            path: 'prize-activity',
            key: 'prize-activity-list',
            component: './TicketManage/PrizeActivityList',
          },
          {
            name: '创建抽奖活动',
            path: 'prize-activity-add',
            key: 'prize-activity-add',
            hideInMenu: true,
            component: './TicketManage/PrizeActivityAdd',
          },
          {
            name: '编辑抽奖活动',
            path: 'prize-activity-edit/:id',
            key: 'prize-activity-edit',
            hideInMenu: true,
            component: './TicketManage/PrizeActivityEdit',
          },

          {
            name: '奖项列表',
            path: 'prize-list/:id',
            key: 'prize-list',
            hideInMenu: true,
            component: './TicketManage/PrizeList',
          },
          {
            name: '添加奖项',
            path: 'prize-add',
            key: 'prize-add',
            hideInMenu: true,
            component: './TicketManage/PrizeAdd',
          },
          {
            name: '编辑奖项',
            path: 'prize-edit/:id',
            key: 'prize-edit',
            hideInMenu: true,
            component: './TicketManage/PrizeEdit',
          },

        ]
      },

      {
        name: '商品管理',
        icon: 'shop',
        path: 'goods',
        key: 'goods',
        routes: [
          { path: '/goods', redirect: '/goods/category' },
          {
            name: '商品分类',
            path: 'category',
            key: 'goods-category',
            component: './GoodsManage/GoodsCategory',
          },
          {
            name: '商品列表',
            path: 'list',
            key: 'goods-list',
            component: './GoodsManage/GoodsList',
          },
          {
            name: '添加商品',
            path: 'add',
            key: 'goods-add',
            hideInMenu: true,
            component: './GoodsManage/GoodsAdd',
          },
          {
            name: '编辑商品',
            path: 'edit/:id',
            key: 'goods-edit',
            hideInMenu: true,
            component: './GoodsManage/GoodsEdit',
          },
          {
            name: '订单列表',
            path: 'order-list',
            key: 'order-list',
            component: './GoodsManage/OrderList',
          },
          {
            name: '订单详情',
            path: 'order-detail/:id',
            key: 'order-detail',
            hideInMenu: true,
            component: './GoodsManage/OrderDetail',
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
      // {
      //   path: 'form',
      //   icon: 'form',
      //   name: '表单',
      //   key: 'form',
      //   routes: [
      //     {
      //       path: 'basic-form',
      //       name: '基础表单',
      //       key: 'basicform',
      //       component: './Forms/BasicForm',
      //     },
      //     {
      //       path: 'step-form',
      //       name: '分步表单',
      //       key: 'stepform',
      //       component: './Forms/StepForm',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         { path: '/form/step-form', redirect: '/form/step-form/info' },
      //         {
      //           path: 'info',
      //           name: '基本信息',
      //           key: 'info',
      //           component: './Forms/StepForm/Step1',
      //         },
      //         {
      //           path: 'confirm',
      //           name: '对话框',
      //           key: 'confirm',
      //           component: './Forms/StepForm/Step2',
      //         },
      //         {
      //           path: 'result',
      //           name: '结果',
      //           key: 'result',
      //           component: './Forms/StepForm/Step3',
      //         },
      //       ],
      //     },
      //     {
      //       path: 'advanced-form',
      //       name: '高级表单',
      //       key: 'advancedform',
      //       authority: ['admin'],
      //       component: './Forms/AdvancedForm',
      //     },
      //   ],
      // },


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
            key: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            key: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            key: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            key: 'trigger',
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
