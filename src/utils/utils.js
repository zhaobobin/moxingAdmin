import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

/**
 * 全局变量
 */
export const ENV = {

  apiName: '',                                      // 生产项目接口名称

  api: {
    dev: 'http://47.94.100.232',
    pro: 'http://39.106.123.241',
  },

  appname: '趣族',
  hometitle: '【去投网】P2P出借- 中国领先的互联网借贷P2P平台',
  keywords: '去投网，p2p网贷平台，出借服务平台,网上出借,p2p出借,普惠金融, 智慧金融,出借者平台,个人出借,互联网出借,出借,投资出借网,网络出借,企业贷款,足值抵押平台,p2p网贷平台,互联网金融,科技金融,放心出借,短期借款产品,互联网金融服务，云计算。',
  description: '去投网（www.qutouwang.com）- 中国领先互联网金融P2P借贷平台，通过云计算、监管系统、人工智能、大数据、安全系统等各种手段谋求风控安全最大化。为出借用户和借款用户提供公平、透明、安全、高效的网上出借、小额借款、短期借款、个人借款、无抵押借款等互联网金融服务。（1分钟快速注册，100元即可轻松加入去投网）。',
  shareDesc: '去投网为恒远鑫达集团旗下网络借贷信息中介平台，100元轻松出借。',
  author: '去投网(www.qutouwang.com)',
  verification: 'dXQb0UUYe3',

  company: '北京恒远鑫达投资管理有限公司',
  address: '北京市朝阳区亮马桥路甲40号1幢4层401内B02A室',
  youbian: '100125',
  hotline: '400-181-0588',
  email: 'qutouwang@chinacfsc.com',
  worktime: '09:00-17:30',

  oldUrl: 'https://hyxd.qutouwang.com/',
  siteUrl: 'https://www.qutouwang.com/',
  web: 'www.qutouwang.com',
  slogan: '恒远鑫达集团旗下网络借贷信息中介平台',   // 爱投，就去投
  weixin: '去投网（QTW-DYH）',
  icp: 'ICP经营许可证 京B2-20160180',
  beian: '京ICP备14014223号-2',
  copyright: '©2015-2018 去投网 All rights reserved',
  gongan: '京公网安备 11010502036682号',
  gonganUrl: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502036682',

  storageUserIp: 'mxw-userIp',
  storageAccessToken: 'mxw-access-token',
  storageRefreshToken: 'mxw-refresh-token',
  storageUserId: 'mxw-userid',
  storageCurrentUser: 'mxw-currentCurrentUser',
  storageLastTel: 'mxw-lastTel',
  storageRemenber: 'mxw-remenber',
  storageTheme: 'mxw-theme',
  storageCurrentMenu: 'mxw-currentMenu',
  storagePagesize: 'mxw-pagesize',
  storageHistory: 'mxw-history',                          // 路由历史
  storageSmscodeErrorNum: 'mxw-smscodeErrorNum',          // 验证码错误次数
};

/**
 * Storage 本地存储 检验过期
 * @type {{set: Storage.set, get: Storage.get, remove: Storage.remove}}
 * exp 过期时间的秒数 一天的秒数 60 * 60 * 24
 */
export const Storage = {

  // 保存
  set: function (key, value) {

    let curTime = new Date().getTime();
    return window.localStorage.setItem(
      key,
      window.JSON.stringify({ data: value, time: curTime })
    );

  },

  // 查询
  get: function (key, exp) {

    let obj = window.JSON.parse(window.localStorage.getItem(key));
    if (!obj || !obj.data) return false;                         // 无记录
    if (exp && new Date().getTime() - obj.time > exp * 1000) {    // 过期
      return false
    } else {
      return obj.data;
    }

  },

  // 删除
  remove: function (key) {

    return window.localStorage.removeItem(key);

  },

  // 判断浏览器是否支持 hasLocalSotrage
  hasLocalSotrage: function () {
    return window.localStorage
  },

  // 设置cookie
  setCookie: function (key, value, day) {
    let t = day || 30;
    let d = new Date();
    d.setTime(d.getTime() + (t * 24 * 60 * 60 * 1000));
    let expires ="expires="+ d.toUTCString();
    document.cookie = key + "=" + value + "; " + expires;
  },

  // 获取cookie
  getCookie: function (name) {
    let arr, reg = new RegExp("(^|)" + name + "=([^]*)(|$)");
    if (arr = document.cookie.match(reg)) {
      return arr[2];
    }
    else {
      return null;
    }
  },

};

export function readFile(file, cb) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    let image = e.target.result;
    console.log(image);
    return cb(image);
  };
}

export function base64to2(base64) {
  let len = base64.length * .75 // 转换为int8array所需长度
  base64 = base64.replace(/=*$/, '') // 去掉=号（占位的）

  const int8 = new Int8Array(len) //设置int8array视图
  let arr1, arr2, arr3, arr4, p = 0

  for (let i = 0; i < base64.length; i += 4) {
    arr1 = map[base64[i]] // 每次循环 都将base644个字节转换为3个int8array直接
    arr2 = map[base64[i + 1]]
    arr3 = map[base64[i + 2]]
    arr4 = map[base64[i + 3]]
    // 假设数据arr 数据 00101011 00101111 00110011 00110001
    int8[p++] = arr1 << 2 | arr2 >> 4
    // 上面的操作 arr1向左边移动2位 变为10101100
    // arr2 向右移动4位：00000010
    // | 为'与'操作: 10101110
    int8[p++] = arr2 << 4 | arr3 >> 2
    int8[p++] = arr3 << 6 | arr4

  }
  return int8
}

//文件转为base64
export function file2base64(file, cb) {

  let base64 = '', reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function (e) {

    base64 = e.target.result;

    let img = new Image();
    img.src = base64;
    img.onload = function () {
      let data = {
        base64: base64,
        width: this.width,
        height: this.height
      };
      return cb(data);
    };

  };
}

/**
 * Base64字符串转二进制
 * @param dataurl
 * @returns {Blob}
 */
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {
    type: mime
  });
}

/**
 * 将blod转为base64
 * @param blob
 * @param cb
 */
function blobToDataURL(blob, cb) {
  let a = new FileReader();
  a.onload = function (e) {
    cb(e.target.result);
  };
  a.readAsDataURL(blob);
}



//字段错误校验
export function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design';
}
