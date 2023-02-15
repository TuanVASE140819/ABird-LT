import { useIntl } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

const Footer = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '蚂蚁集团体验技术部出品',
  });
  const currentYear = new Date().getFullYear();
  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'Facebook',
          icon: <GithubOutlined />,
          title: 'Facebook',
          href: 'https://www.facebook.com/',
          blankTarget: true,
        },
        {
          key: 'Twitter',
          title: 'Twitter',
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
        {
          key: 'Instagram',
          title: 'Instagram',
          href: 'https:// ant.design',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
