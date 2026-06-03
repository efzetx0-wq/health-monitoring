import OneSignal from "react-onesignal";

export async function initOneSignal() {

  await OneSignal.init({
    appId: "e9506fbc-546c-4507-8e4f-d8045929abfd"
  });

  await OneSignal.Notifications.requestPermission();
}