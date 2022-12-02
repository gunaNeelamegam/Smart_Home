import { useEffect } from 'react';
import AppStack from './Navigation/AppStack';
import { requestPermission } from "./utils/permission"
import PillSync from './utils/PillSync';




export default function App() {





  useEffect(() => {

    requestPermission()

    

     return ()=>{
      PillSync.removeListener();
     }
  }, [])

  return (
    <AppStack />

  );
}


