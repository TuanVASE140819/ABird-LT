import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs, Button } from 'antd';
import React, { useState } from 'react';
import {
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
  LoginForm,
  Form,
  FormItem,
} from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import { ConfigProvider } from '@ant-design/pro-provider';
import styles from './index.less';
import token from '@/utils/token';
import { logInWithEmailAndPassword } from '@/utils/authFirebase';
import { login } from '@/services/UserService/customers';
import { setAppToken } from '@/utils/utils';
import { getCurrentUser } from '@/services/UserService/customers';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = () => {
  const [userLoginState, setUserLoginState] = useState({});
  const [errorLoginFirebase, setErrorLoginFirebase] = useState({});
  const [type, setType] = useState('account');
  const [buttonLoading, setButtonLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const intl = useIntl();

  const fetchUserInfo = async () => {
    // const userInfo = await initialState?.fetchUserInfo?.();

    // console.log('user info', userInfo);
    const userInfo = {
      role: {
        name: 'admin',
      },
    };

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    setButtonLoading(true);
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      });
      if (res) {
        if (res?.jwttoken) {
          const defaultLoginSuccessMessage = intl.formatMessage({
            id: 'pages.login.success',
            defaultMessage: 'Đăng nhập thành công!',
          });
          setAppToken(res.jwttoken);
          message.success(defaultLoginSuccessMessage);
          await fetchUserInfo();
          if (!history) return;
          const { query } = history.location;
          // lấy accountid từ localstorage
          const accountId = localStorage.getItem('accountId');

          const { redirect } = query;
          history.push(redirect || '/');
          return;
        } else {
          const defaultLoginFailureMessage = intl.formatMessage({
            id: 'pages.login.failure',
            defaultMessage: 'Tài khoản hoặc mật khẩu không chính xác!',
          });
          message.error(defaultLoginFailureMessage);
        }
        localStorage.setItem('accountId', res.accountId);
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        const errorLogin = {};
        errorLogin.status = 'wrongPassword';
        errorLogin.message = 'Wrong Password! Login Again!';
        setErrorLoginFirebase(errorLogin);
      }
      if (error.code === 'auth/invalid-email') {
        const errorLogin = {};
        errorLogin.status = 'invalidEmail';
        errorLogin.message = 'Invalid Email, please check again!';
        setErrorLoginFirebase(errorLogin);
      }
      if (error.code === 'auth/user-not-found') {
        const errorLogin = {};
        errorLogin.status = 'userNotFound';
        errorLogin.message = 'Email Not Found, please use another email!';
        setErrorLoginFirebase(errorLogin);
      }
    }

    setButtonLoading(false);
  };

  const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          title="Quản trị viên Psyc"
          style={{
            width: '100%',
          }}
          submitter={{
            render: (props, doms) => {
              return [
                <Button type="primary" block="true" htmlType="submit" loading={buttonLoading}>
                  Đăng nhập
                </Button>,
              ];
            },
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
              })}
            />
          </Tabs>

          {errorLoginFirebase.status === 'wrongPassword' && (
            <LoginMessage content={errorLoginFirebase.message} />
          )}
          {errorLoginFirebase.status === 'invalidEmail' && (
            <LoginMessage content={errorLoginFirebase.message} />
          )}
          {errorLoginFirebase.status === 'userNotFound' && (
            <LoginMessage content={errorLoginFirebase.message} />
          )}
          <>
            <ProFormText
              name="email"
              className={styles.form_field}
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder="Tài khoản"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="pages.login.username.required" />,
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              className={styles.form_field}
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={styles.prefixIcon} />,
              }}
              placeholder="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="pages.login.password.required" />,
                },
              ]}
            />
          </>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
