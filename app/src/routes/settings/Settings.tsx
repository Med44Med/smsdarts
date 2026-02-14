import Profile from "./Profile";
import API from "./API";
import Webhook from "./Webhook";
import EmailNotifications from "./EmailNotifications";
import Delete from "./Delete";
import Phone from "./Phone";

const Settings = () => {
  
  return (
    <>
      <Profile />
      <API />
      <Phone />
      <Webhook />
      <EmailNotifications />
      <Delete />
    </>
  );
};

export default Settings;
