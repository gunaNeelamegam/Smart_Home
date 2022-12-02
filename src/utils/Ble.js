// import and setup react-native ble-manager
import { NativeModules } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { NativeEventEmitter } from 'react-native-web';
const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);


//createing the emitter using the React native emiiter for using the Native emitter to Embbed the BleNative Emiter

//INJECTING THE EMITTER 




class PillApp {


    constructor() {

        this.connected = false,
            this.connecting = false,
            this.periperal = null,
            this.isScanning = false,
            this.connectedDevice = null,
            this.scannedDevices = new Map(),
            this.list = [],
            this._subscriptions = [
                BleManagerEmitter.addListener(
                    "BleManagerStopScan",
                    this.handleStopScan.bind(this)
                ),
                BleManagerEmitter.addListener(
                    "BleManagerDiscoverPeripheral",
                    this.handleDiscoverPeripheral.bind(this)
                ),
                BleManagerEmitter.addListener(
                    "BleManagerConnectPeripheral",
                    this.handleConnect.bind(this)
                ),
                BleManagerEmitter.addListener(
                    "BleManagerDisconnectPeripheral",
                    this.handleDisconnectedPeripheral.bind(this)
                ),
            ];
    }


 handleConnect=async()=>{
    try {
        this.connected=true,
        this.isScanning 
    } catch (error) {
        
    }
 }


    init = async () => {

        BleManager.start({
            showAlert: true
        })

    }



    startScan = async () => {
        BleManager.scan([], 0, true)
            .then(() => {
                console.log('Scanning...');
            })
            .catch((err) => {
                console.error(err);
            }
            )
    }




    // handle discovered peripheral
    handleDiscoverPeripheral = (peripheral) => {
        console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            peripheral.name = 'NO NAME';
        }
        this.scannedDevices.set(peripheral.id, peripheral);
        this.periperal.push(Array.from(this.scannedDevices.values()));
    };

    // handle stop scan event
    handleStopScan = () => {
        console.log('Scan is stopped');
        this.isScanning = false
    };
    // handle disconnected peripheral
    handleDisconnectedPeripheral = (data) => {
        console.log('Disconnected from ' + data.peripheral);
        let peripheral = this.scannedDevices.get(data.peripheral);
        if (peripheral) {
            peripheral.connected = false;
            this.scannedDevices.set(peripheral.id, peripheral);
            this.list.push(Array.from(this.scannedDevices.values()))

        }
    };


    handleUpdateValueForCharacteristic = (data) => {
        console.log(
            'Received data from: ' + data.peripheral,
            'Characteristic: ' + data.characteristic,
            'Data:' + data.value,
        );
    };





    // addListener = async () => {

    //     // add ble listeners on mount
    //     BleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral.bind(this));
    //     BleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
    //     BleManagerEmitter.addListener('BleManagerDisconnect Peripheral', this.handleDisconnectedPeripheral);
    //     BleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', this.handleUpdateValueForCharacteristic);
    // }


    // remove ble listeners on unmount
    removeListener = async () => {
        console.log('Unmount');
        BleManagerEmitter.removeListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
        BleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
        BleManagerEmitter.removeListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
        BleManagerEmitter.removeListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);
    }


    updatePeripheral = (peripheral, callback) => {
        let p = this.scannedDevices.get(peripheral.id);
        if (!p) {
            return;
        }
        p = callback(p);
        this.scannedDevices.set(peripheral.id, p); setList(Array.from(this.scannedDevices.values()));
    };
    // connect to peripheral then test the communication  
    connectAndTestPeripheral = (peripheral) => {
        if (!peripheral)
            return;
        if (peripheral.connected) {
            BleManager.disconnect(peripheral.id);
            return;
        }



        BleManager.connect(peripheral.id)
            .then(() => {
                console.log('Connected to + peripheral.id, peripheral');
                //update connected attribute 
                updatePeripheral(peripheral, (p) => {
                    p.connected = true; return p;
                });
                // retrieve peripheral services info BleManager.retrieveServices (peripheral.id).then((peripheral Info)
                console.log('Retrieved peripheral services', peripheralInfo);
                // test read current peripheral RSSI value BleManager.readRSSI (peripheral.id).then((rssi) => {
                console.log('Retrieved actual RSSI value', rssi);
                // update rssi value
                updatePeripheral(peripheral, (p) => {
                    p.rssi = rssi;
                    return p;
                });
            })
            .catch((error) => {
            });
        console.log('Connection error', error);
    };




    writeData = async () => {


        const payload = ""


        const payloadBytes = stringToBytes(payload);
        console.log('payload:', payload);
        BleManager.write(peripheral.id, serviceUUID, charasteristicUUID, payloadBytes)
            .then((res) => {
                console.log('write response', res);
                alert(`"your "${payload}" . `);
            })
            .catch((error) => {
                console.log('write err', error);
            });

    }




    readData = async () => {

        BleManager.read(peripheral.id, serviceUUID, charasteristicUUID)
            .then((res) => {
                console.log('read response', res);
                if (res) {
                    const buffer = Buffer.from(res);
                    const data = buffer.toString();
                    console.log('data', data);
                    alert(`you have stored food "${data}"`);
                }
            })
            .catch((error) => {
                console.log('read err', error); alert(error);
            });

    }







}


const Pill = new PillApp()




export default Pill