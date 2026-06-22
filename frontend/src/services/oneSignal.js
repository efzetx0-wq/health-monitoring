import OneSignal from "react-onesignal";

/**
 * Menginisialisasi OneSignal SDK dan menyambungkan ID pengguna
 * @param {string|number|null} userId - ID User dari database Laravel Auth
 */
export async function initOneSignal(userId = null) {
  try {
    
    await OneSignal.init({
      appId: "e9506fbc-546c-4507-8e4f-d8045929abfd",
      allowLocalhostAsSecureOrigin: true, 
    });

   
    await OneSignal.Notifications.requestPermission();

    
    if (userId) {
      await OneSignal.login(userId.toString());
      console.log("OneSignal terhubung dengan External ID:", userId);
    } else {
      console.log("OneSignal berjalan dalam mode Guest (Belum login).");
    }
  } catch (error) {
    console.error("Gagal memuat sistem OneSignal Frontend:", error);
  }
}