import {
    NativeModules,
    NativeEventEmitter,
    PermissionsAndroid,
    Platform,
} from "react-native";
import BleManager from "react-native-ble-manager";
import { SET_TIMESTAMP } from "../actions/action.types";

const PILL_SERVICE_UUID = "e470a468-5d83-47bd-9ec5-f56487ee6446";
const READ_CHAR_UUID = "e4701401-5d83-47bd-9ec5-f56487ee6446";
const REMOVE_CHAR_UUID = "e4701402-5d83-47bd-9ec5-f56487ee6446";
const RESET_CHAR_UUID = "e4701403-5d83-47bd-9ec5-f56487ee6446";
const VERSION_CHAR_UUID = "e4701404-5d83-47bd-9ec5-f56487ee6446";
const ADVERTISEMENT_UUID = "a468";

const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const PillSync = new (class {
    constructor() {
        console.log("Pill class instantiated");
        this._initialized = false;
        this._connected = false;
        this._isConnecting = false;
        this._registeredDevices = [];
        this._discoverCallbacks = [null, null];
        this.peripheral = null
        this.peripheralId = false;
        this._subscriptions = [
            BleManagerEmitter.addListener(
                "BleManagerStopScan",
                this._hdlStopScan.bind(this)
            ),
            BleManagerEmitter.addListener(
                "BleManagerDiscoverPeripheral",
                this._hdlDiscover.bind(this)
            ),
            BleManagerEmitter.addListener(
                "BleManagerConnectPeripheral",
                this._hdlConnect.bind(this)
            ),
            BleManagerEmitter.addListener(
                "BleManagerDisconnectPeripheral",
                this._hdlDisconnect.bind(this)
            ),
        ];
    }


    //enable the BlueTooth Service inthe mobile phone
    enableBleService = async () => {

        try {
            await BleManager.enableBluetooth();
        } catch (err) {
            console.log("User refuses to enable bluetooth:", err);
        }

    }

    //initizied here

    async init() {
        if (Platform.OS === "android") {
            this.enableBleService()
        }

        try {
            await BleManager.start({ showAlert: false });
        } catch (err) {
            console.log("Unable to initialize bluetooth:", err);
        }

        this._initialized = true;
    }

    async reset() {
        this.peripheralId = false;
        if (!this._initialized) return;

        if (this._connected) {
            console.log("RESETTING ")
            let connectedList;
            try {
                connectedList = await BleManager.getConnectedPeripherals([]);
            } catch (err) {
                console.log("Getting connected peripherals failed:", err);
            }
            for (let peripheral of connectedList) {
                try {
                    await BleManager.disconnect(peripheral.id);
                } catch (err) {
                    console.log("Error Disconnecting peripheral", peripheral.id, err);
                }
            }
        }
        this._discoverCallbacks = [null, null];
    }


    _hdlStopScan() {
        console.log("Scan stoped");
    }

    _hdlDisconnect(id) {
        this.peripheralId = false;
        this._connected = false;
        console.log(id, "disconnected");
    }


    _hdlDiscover(peripheral) {
        this.peripheral = peripheral
        const [registeredCallback, unregisteredCallback] = this._discoverCallbacks;
        // resetTime in ms
        let dev = {
            name: peripheral.name,
            id: peripheral.id,
            rssi: peripheral.rssi,
            resetTimeout: 15000,
        };

        let found = this._registeredDevices.find((elem) => elem == peripheral.id);
        let serviceData =
            peripheral?.advertising?.serviceData?.[ADVERTISEMENT_UUID]?.["bytes"];
        let pairing_mode = serviceData?.[2];

        if (found === undefined && unregisteredCallback) {
            unregisteredCallback(dev, pairing_mode);
        } else if (found && registeredCallback && !this.peripheralId) {
            this.peripheralId = dev.id;
            dev.count = this._byteArrayToBigInt(
                this.readAdvertisementData(serviceData)
            );
            if (dev.count) {
                this.dev = dev;
                registeredCallback(dev);
            } else registeredCallback(dev, true);
        } else if (found && registeredCallback) {
            registeredCallback(dev, true);
        }
    }

    readAdvertisementData(serviceData) {
        if (serviceData) {
            console.log("ADVER = ", serviceData)
            return serviceData.slice(0, 2);
        } else {
            return 0;
        }
    }

    _hdlConnect(args) {
        this._isConnecting = false;
        this._connected = true;
        console.log("Connected to peripheral:", args);
    }

    async getNearbyDevices(
        registeredDevices = [],
        registeredCallback = null,
        unregisteredCallback = null
    ) {
        if (!this._initialized) return;

        this._registeredDevices = registeredDevices;
        this._discoverCallbacks = [registeredCallback, unregisteredCallback];

        try {
            // await BleManager.scan(null, null, false);
            await BleManager.scan([PILL_SERVICE_UUID], 0, false);
        } catch (err) {
            console.log("Scanning failed:", err);
        }
    }

    async _connectAndRetrieve(id) {
        try {
            await BleManager.createBond(id);
        } catch (err) {
            console.log("Create Bond with", id, "failed:", err);
            return false;
        }

        try {
            await BleManager.connect(id);
        } catch (err) {
            console.log("Connect to", id, "failed:", err);
            return false;
        }

        try {
            await BleManager.retrieveServices(id, [PILL_SERVICE_UUID]);
        } catch (err) {
            console.log("Retrieving services failed:", err);
            return false;
        }
        return true;
    }

    async _disconnectDev(id) {
        try {
            await BleManager.disconnect(id);
        } catch (err) {
            console.log("Disconnecting", id, "failed:", err);
        }
    }

    async readPillData(id, store, updateStatus) {
        if (!this._initialized) return;

        if (!this._isConnecting) {
            this._isConnecting = true;
        } else {
            console.log("connection in progress...........");
        }

        try {
            let success = await this._connectAndRetrieve(id);
            if (!success) return;
        } catch (err) {
            return;
        }

        try {
            await this._readTimestamps(id, store, updateStatus);
        } catch (err) {
            console.log("Error getting timestamps:", err);
        }

        await this._disconnectDev(id);
    }

    async _readTimestamps(id, store, updateStatus) {
        let dataBytes;
        while (true) {
            try {
                dataBytes = await BleManager.read(
                    id,
                    PILL_SERVICE_UUID,
                    READ_CHAR_UUID
                );
            } catch (err) {
                console.log("Reading pill failed:", err);
                break;
            }

            timestamp = await this._byteArrayToBigInt(dataBytes.slice(0, 8));
            if (timestamp && this.dev.count) {
                this.dev.count -= 1;
                updateStatus(this.dev);
                store(timestamp);
            } else break;

            try {
                await BleManager.write(id, PILL_SERVICE_UUID, REMOVE_CHAR_UUID, [1]);
            } catch (err) {
                console.log("Writing remove data to pill", id, "failed:", err);
                break;
            }
        }
    }

    _byteArrayToBigInt(arr) {
        if (!arr.length) return;
        let hexStr = arr.reduce((accumulator, current) => {
            let currHexStr = current.toString(16);
            if (current < 16) currHexStr = `0${currHexStr}`;
            return `${accumulator}${currHexStr}`;
        }, "0x");

        return Number(BigInt(hexStr));
    }

    _getCurrentTime() {
        let data = [];
        let epoch = Math.round(new Date().getTime() / 1000);
        for (let i = 7; i >= 0; --i) {
            let val = (epoch / 2 ** (i * 8)) & 0xff;
            data.push(val);
        }
        return data;
    }

    async resetDeviceTime(id) {
        try {
            let success = await this._connectAndRetrieve(id);
            if (!success) return false;
        } catch (err) {
            console.log("Error resetting time");
            return false;
        }

        let tdata = this._getCurrentTime();
        let reset = 0;

        try {
            await BleManager.write(id, PILL_SERVICE_UUID, RESET_CHAR_UUID, [
                reset,
                ...tdata,
            ]);
        } catch (error) {
            console.log(error);
            console.log("Error resetting device time");
            return false;
        }

        await this._disconnectDev(id);
        return true;
    }

    async readData(id, dispatch) {
        let dataBytes;
        while (true) {
            try {
                dataBytes = await BleManager.read(
                    id,
                    PILL_SERVICE_UUID,
                    READ_CHAR_UUID
                );
            } catch (err) {
                console.log("Reading pill failed:", err);
                break;
            }

            let timestamp = this._byteArrayToBigInt(dataBytes.slice(0, 8));
            if (timestamp) {
                dispatch(
                    {
                        type: SET_TIMESTAMP,
                        payload: timestamp
                    }
                )
                console.log(timestamp)
            } else break;
            try {
                await BleManager.write(id, PILL_SERVICE_UUID, REMOVE_CHAR_UUID, [1]);
            } catch (err) {
                console.log("Writing remove data to pill", id, "failed:", err);
                break;
            }
        }
    }

})();



export default PillSync;
