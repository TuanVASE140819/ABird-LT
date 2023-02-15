import { Button } from 'antd';
import Iframe from 'react-iframe';

export default function index() {
  return (
    <>
      <Iframe
        // https://psycteamv2.azurewebsites.net/dashboard/adminpsyc2611
        url="https://psycteamv2.azurewebsites.net/dashboard/adminpsyc2611"
        width="100%"
        height="100%"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        allowFullScreen
      />
    </>
  );
}
