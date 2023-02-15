import component from './vi-VN/component';
import globalHeader from './vi-VN/globalHeader';
import menu from './vi-VN/menu';
import pages from './vi-VN/pages';
import pwa from './vi-VN/pwa';
import settingDrawer from './vi-VN/settingDrawer';
import settings from './vi-VN/settings';
export default {
  'navBar.lang': 'Ngôn ngữ',
  'layout.user.link.help': 'Trợ giúp',
  'layout.user.link.privacy': 'Riêng tư',
  'layout.user.link.terms': 'Điều khoản',
  'app.copyright.produced': 'Produced by PSYC TEAM',
  'app.preview.down.block': 'Tải về toàn bộ code của trang này',
  'app.welcome.link.fetch-blocks': 'Tải về toàn bộ code của trang này',
  'app.welcome.link.block-list': 'Tải về toàn bộ code của trang này',

  tableForm: {
    search: 'Tìm kiếm',
    reset: 'Đặt lại',
    submit: 'Gửi đi',
    collapsed: 'Mở rộng',
    expand: 'Thu gọn',
    inputPlaceholder: 'Nhập từ khóa',
    selectPlaceholder: 'Hãy chọn một tùy chọn',
  },
  Modal: {
    okText: 'Đồng ý',
    cancelText: 'Hủy bỏ',
    justOkText: 'Đồng ý',
  },
  ...globalHeader,
  ...menu,
  settingDrawer: {
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
    'app.setting.copyinfo': 'Sao chép thành công，vui lòng thay thế src/defaultSettings.js',
    'app.setting.production.hint': 'Cài đặt trang này chỉ có hiệu lực trong môi trường phát triển',
  },
  ...settings,
  ...pwa,
  ...component,
  ...pages,
};
