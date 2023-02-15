/**
 * @see https://umijs.org/vi-VN/plugins/plugin-access
 * */
export default function access(initialState) {
  const { currentUser } = initialState || {};
  return {
    canAdmin: currentUser && currentUser.role.name === 'admin',
  };
}
