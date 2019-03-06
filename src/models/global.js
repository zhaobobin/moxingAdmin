import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { notification } from 'antd';

import request from '@/utils/request';
import { queryNotices } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { ENV, Storage, getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';

export default {

  namespace: 'global',

  state: {

    loading: true,
    isAuth: false,
    status: undefined,
    type: '',
    currentUser: {},

    collapsed: false,
    notices: [],
    loadedAllNotices: false,

  },

  effects: {

    *register({ payload, callback }, { call, put }) {

      const res = yield call(
        (params) => request('/api/register', {method: 'POST', body: params}),
        payload
      );
      yield callback(res);
      if(res.code === '0'){
        Storage.set(ENV.storageAccessToken, res.data.access_token);               // 保存token
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: true,
            currentUser: res.data,
          }
        });
      }

      // yield put({ type: 'changeLoading', payload: false });
    },

    *login({ payload, callback }, { call, put }) {
      const res = yield call(
        (params) => request('/api/user/admin_login', {method: 'POST', body: params}),
        payload
      );
      yield callback(res);

      // Login successfully
      if (res.code === '0') {
        Storage.set(ENV.storageAccessToken, res.data.token);               //保存token
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'admin',
            loading: false,
            isAuth: true,
            currentUser: res.data,
          },
        });

        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }else{
        notification.error({
          message: '错误提示',
          description: res.msg,
        });
      }
    },

    *token({ payload }, { call, put }) {

      payload.accessToken = Storage.get(ENV.storageAccessToken) || null;

      const res = yield call(
        (params) => request('/api/user/get_user', {method: 'POST', body: params}),
        payload
      );

      if(res.code === '0'){
        Storage.set(ENV.storageAccessToken, res.data.token);               // 保存token
        yield put({
          type: 'changeLoginStatus',
          payload: {
            currentAuthority: 'admin',
            loading: false,
            isAuth: true,
            currentUser: res.data,
          }
        });
      }else{
        yield put({
          type: 'changeLoginStatus',
          payload: {
            loading: false,
            isAuth: false,
            currentUser: '',
          }
        });
      }

    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },

    // exp如果不为空：在查询时，先检查本地存储数据是否过期，再读取远程数据；并且在查询成功后，本地存储查询结果。
    *post({ url, payload, callback }, { call, put }) {

      payload.accessToken = Storage.get(ENV.storageAccessToken) || null;

      let res,
        exp = payload.exp, storage = Storage.get(url);

      if(exp && storage){
        res = storage;
      }else{
        res = yield call(
          (params) => request(url, {method: 'POST', body: params}),
          payload
        );
        if(res.code === '0' && exp) Storage.set(url, res);
      }

      // 登录过期等
      if(res.code === '0'){
        yield callback(res);
      }else{
        notification.error({
          message: '错误提示',
          description: res.msg,
        });
        setAuthority('guest');
        if(res.code === '9') yield put(routerRedux.push({ pathname: '/user/login' }));
      }

    },

    *get({ url, payload, callback }, { call, put }) {

      const res = yield call(
        (params) => request(url, {method: 'GET', body: params}),
        payload
      );

      yield callback(res);

    },

    /* --------------------- 分割线 --------------------- */

    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      const loadedAllNotices = data && data.length && data[data.length - 1] === null;
      yield put({
        type: 'setLoadedStatus',
        payload: loadedAllNotices,
      });
      yield put({
        type: 'saveNotices',
        payload: data.filter(item => item),
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *fetchMoreNotices({ payload }, { call, put, select }) {
      const data = yield call(queryNotices, payload);
      const loadedAllNotices = data && data.length && data[data.length - 1] === null;
      yield put({
        type: 'setLoadedStatus',
        payload: loadedAllNotices,
      });
      yield put({
        type: 'pushNotices',
        payload: data.filter(item => item),
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }){
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        loading: payload.loading,
        status: payload.status,
        type: payload.type,
        isAuth: payload.isAuth,
        currentUser: payload.currentUser,
      };
    },

    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    pushNotices(state, { payload }) {
      return {
        ...state,
        notices: [...state.notices, ...payload],
      };
    },
    setLoadedStatus(state, { payload }) {
      return {
        ...state,
        loadedAllNotices: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
