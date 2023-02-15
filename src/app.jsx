import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import Loading from '@/components/Loading';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import { setLocale, getLocale } from 'umi';
import { getCurrentUser } from './services/UserService/customers';
import { getUserInfo, setUserInfo, getAppToken, removeAppToken } from './utils/utils';
import { remove } from 'lodash';
import { message } from 'antd';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

import { MessengerChat } from 'react-messenger-chat-plugin';

export const initialStateConfig = {
  loading: false,
};

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const token = getAppToken();
      if (token) {
        // const msg = await getCurrentUser();
        // Không có api get current user nên set cứng, thêm các field cần thiết sau
        const msg = { role: { name: 'admin test' } };
        setUserInfo(msg);
        access = msg.role.name;
        if (msg) {
          return msg;
        }
      }
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  };

  const currentUser = await fetchUserInfo();

  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings,
  };
}

export const layout = ({ initialState, setInitialState }) => {
  // Mac dinh phai set ngon ngu trong app vi config bi loi
  setLocale('vi-VN');

  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;

      if (initialState?.currentUser && location.pathname == loginPath) {
        history.push('/dashboard');
      }

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        message.error('Chưa đăng nhập. Vui lòng đăng nhập để tiếp tục');
        history.push(loginPath);
      }
    },

    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          <div style={{ visibility: 'hidden' }}>
            {!props.location?.pathname?.includes('/login') && (
              <SettingDrawer
                // tiếng việt
                locale={{
                  'vi-VN': {
                    'app.setting.pagestyle': 'Cài đặt kiểu tổng thể',
                    'app.setting.pagestyle.dark': 'phong cách menu tối',
                    'app.setting.pagestyle.light': 'Phong cách menu tươi sáng',
                    'app.setting.content-width': 'Độ rộng nội dung',
                    'app.setting.content-width.fixed': 'Cố định',
                    'app.setting.content-width.fluid': 'Lỏng lẻo',
                    'app.setting.themecolor': 'Cài đặt màu chủ đề',
                    'app.setting.themecolor.dust': 'Màu bụi',
                    'app.setting.themecolor.volcano': 'Màu núi lửa',
                    'app.setting.themecolor.sunset': 'Màu hoàng hôn',
                    'app.setting.themecolor.cyan': 'Màu lam',
                    'app.setting.themecolor.green': 'Màu xanh lá cây',
                    'app.setting.themecolor.daybreak': 'Màu bình minh (mặc định)',
                    'app.setting.themecolor.geekblue': 'Màu xanh da trời',
                    'app.setting.themecolor.purple': 'Màu tím',
                    'app.setting.navigationmode': 'Chế độ điều hướng',
                    'app.setting.sidemenu': 'Bố cục menu bên trái',
                    'app.setting.topmenu': 'Bố cục menu trên cùng',
                    'app.setting.fixedheader': 'Đầu trang cố định',
                    'app.setting.fixedsidebar': 'Thanh bên cố định',
                    'app.setting.fixedsidebar.hint': 'Chỉ có bố cục menu bên trái mới có hiệu lực',
                    'app.setting.hideheader': 'Ẩn đầu trang khi cuộn',
                    'app.setting.hideheader.hint': 'Chỉ có khi đầu trang cố định mới có hiệu lực',
                    'app.setting.othersettings': 'Cài đặt khác',
                    'app.setting.weakmode': 'Chế độ yếu',
                    'app.setting.copy': 'Sao chép cấu hình',
                    'app.setting.copyinfo':
                      'Sao chép thành công，vui lòng thay thế src/defaultSettings.js',
                    'app.setting.production.hint':
                      'Cài đặt trang này chỉ có hiệu lực trong môi trường phát triển',
                  },
                }}
                onClear
                disableUrlParams
                enableDarkTheme
                settings={initialState?.settings}
                onSettingChange={(settings) => {
                  setInitialState((preInitialState) => ({ ...preInitialState, settings }));
                }}
              />
            )}
          </div>
        </>
      );
    },
    ...initialState?.settings,
  };
};
