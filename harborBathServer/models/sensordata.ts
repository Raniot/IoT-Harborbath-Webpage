
class Sensordata {
    public _sensorType: string;
    public _messurementUnit: string;
    public _messurement: string;

    /**
     * SensorData
     */
    public SensorData(data) {
        this._sensorType = data.sensorType;
        this._messurementUnit = data.messurementUnit;
        this._messurement = data.messurement;
    }
}