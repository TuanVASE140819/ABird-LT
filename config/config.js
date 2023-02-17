// https://umijs.org/config/
import { defineConfig } from 'umi';
import { LogoutOutlined } from '@ant-design/icons';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN

    default: 'vi-VN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/Loading',
  },
  define: {
    API_BATCH_URL: REACT_APP_ENV == 'dev' ? 'https://20.124.25.10' : 'https://20.124.25.10',
    API_URL: REACT_APP_ENV == 'dev' ? 'https://20.124.25.10' : 'https://stg-api.tranastro.com',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user',

          routes: [
            {
              name: 'login',
              path: '/user/login',
              component: './user/Login',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'Trang chủ',
      icon: 'dashboard',
      access: 'admin',
      component: './dashboard',
    },
    {
      path: '/notification',
      name: 'Thông Báo',
      icon: 'bell',
      access: 'admin',
      hideInMenu: true,
      component: './notipage',
    },
    // {
    //   path: '/survey',
    //   name: 'Loại khảo sát',
    //   icon: 'form',
    //   access: 'admin',
    //   routes: [
    //     {
    //       path: '/survey',
    //       name: 'Loại Khảo Sát',
    //       icon: 'form',
    //       access: 'admin',
    //       hideInMenu: true,
    //       component: './survey',
    //     },
    //     {
    //       path: '/survey/:zodiacId',
    //       name: 'Khảo sát',
    //       hideInMenu: true,
    //       access: 'admin',
    //       component: './survey/[zodiacId]',
    //     },
    //     {
    //       path: '/survey/:zodiacId/:surveyId',
    //       name: 'Câu hỏi',
    //       hideInMenu: true,
    //       access: 'admin',
    //       component: './survey/[surveyId]',
    //     },
    //   ],
    // },
    {
      path: '/revenue',
      name: 'Doanh thu',
      icon: 'dollar',
      component: './revenue',
    },
    {
      path: '/users',
      name: 'Đơn hàng',
      // icon đơn hàng
      icon: 'shopping-cart',
      access: 'admin',
      component: './users/customers',
    },
    {
      path: '/service',
      name: 'Dịch vụ',
      icon: 'snippets',
      access: 'admin',
      component: './service',
    },
    {
      path: '/astrology',
      name: 'Chiêm tinh học',
      icon: 'snippets',
      access: 'admin',
      routes: [
        {
          path: '/astrology',
          redirect: '/astrology/zodiac',
        },
        {
          path: '/astrology/zodiac',
          name: 'Cung hoàng đạo',
          access: 'admin',
          component: './astrology/zodiac',
        },
        {
          path: '/astrology/house',
          name: 'Nhà',
          access: 'admin',
          component: './astrology/house',
        },

        {
          path: '/astrology/planet',
          name: 'Hành tinh',
          access: 'admin',
          component: './astrology/planet',
        },
        {
          path: '/astrology/planet/:planetId',
          name: 'Chi tiết hành tinh',
          hideInMenu: true,
          access: 'admin',
          component: './astrology/planet/[planetId]',
        },
        {
          path: '/astrology/zodiac/:zodiacId',
          name: 'Detail Zodiac',
          hideInMenu: true,
          access: 'admin',
          component: './astrology/zodiac/[zodiacId]',
        },
        {
          component: './404',
        },
      ],
    },
    {
      path: '/transaction',
      name: 'Giao dịch',
      icon: 'dollar',
      access: 'admin',
      routes: [
        {
          path: '/transaction',
          redirect: '/transaction/deposits',
        },
        {
          path: '/transaction/deposits',
          name: 'Nạp tiền',
          access: 'admin',
          component: './transaction/deposits',
        },
        {
          path: '/transaction/withdraws',
          name: 'Rút tiền',
          access: 'admin',
          component: './transaction/withdraws',
        },
      ],
    },
    // {
    //   path: '/excel',
    //   name: 'Excel',
    //   icon: 'file-excel',
    //   access: 'admin',
    //   routes: [
    //     {
    //       path: '/excel',
    //       redirect: '/excel/dailyHoroscopes',
    //     },
    //     {
    //       path: '/excel/dailyHoroscopes',
    //       name: 'Tử vi hàng ngày',
    //       access: 'admin',
    //       component: './excel/dailyHoroscopes',
    //     },
    //   ],
    // },
    {
      path: '/system-handler',
      name: 'system-handler',
      icon: 'setting',
      access: 'admin',
      component: './system-handler',
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      component: './404',
    },
  ],
  theme: {
    'root-entry-name': 'variable',
  },
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  fastRefresh: {},
  nodeModulesTransform: {
    type: 'none',
  },
});
