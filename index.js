import { registerRootComponent } from 'expo';
// import App from './App';
import 'react-native-gesture-handler';
import RootApp from "./RootApp"

//Shim is using for the Alternative for the BigInt library .if the BigInnt is not Present means at the Time only it will take Place



import "./shim"

registerRootComponent(RootApp);
