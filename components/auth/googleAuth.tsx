import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { supabase } from '@/services/clients/supabase';

export default function () {
  GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '518168536052-ucsrbm31om1n6380043jk9m0a808b2av.apps.googleusercontent.com',
    offlineAccess: true,
    //forceCodeForRefreshToken: true,
    // accountName: '',
    iosClientId: '518168536052-p0cm7jblij9hpkaq2lqqbaoi4hlamrrk.apps.googleusercontent.com',
    // googleServicePlistPath: '',
    // openIdRealm: '',
    // profileImageSize: 120,
  });

  return (
    <GoogleSigninButton
      size={GoogleSigninButton.Size.Wide}
      color={GoogleSigninButton.Color.Dark}
      onPress={async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          console.log(JSON.stringify(userInfo, null, 2));
          if (userInfo.idToken) {
            const { data, error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: userInfo.idToken,
            });
            console.log(error, data);
          } else {
            throw new Error('no Id token present!');
          }
        } catch (error: any) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
            console.log('User cancelled the login flow');
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g signin) is in progress already
            console.log('Operation (e.g signin) is in progress already');
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
            console.log('Play services not available or outdated');
          } else {
            // Something else happened
            console.log('Something else happened');
          }
        }
      }}
    />
  );
}
