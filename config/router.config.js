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
      // home
      { path: '/', redirect: '/home' },

      {
        name: '首页',
        icon: 'home',
        path: '/home',
        component: './Home/Home',
      },

      {
        name: '节点信息',
        icon: 'branches',
        path: '/node',
        component: './Node/NodeList',
      },

      {
        name: '用户列表',
        icon: 'user',
        path: '/users',
        component: './User/UserList',
      },

      {
        name: '角色列表',
        icon: 'solution',
        path: '/roles',
        component: './Role/RoleList',
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
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
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
