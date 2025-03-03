class PowerStation {
  static #STATUS = {
    CHARGING: 'charging',
    DISCHARGING: 'discharging',
    IDLE: 'idle',
    OVERLOAD: 'overload',
  };

  constructor(batteryCapacity, maximumInput, maximumOutput) {
    this.batteryCapacity = batteryCapacity;
    this.maximumInput = maximumInput;
    this.maximumOutput = maximumOutput;

    this.currentCapacity = this.batteryCapacity;
    this.currentInput = 0;
    this.connectedDevices = [];
    this.currentOutput = 0;
  }

  updateInput(voltage, current) {
    this.currentInput = voltage * current;
  }

  connectOutput(outputId) {
    this.connectedDevices.push({ deviceId: outputId, output: 0 });
  }

  updateOutput(outputId, voltage, current) {
    const device = this.connectedDevices.find((d) => d.deviceId === outputId);

    if (device) {
      this.currentOutput -= device.output;
      device.output = voltage * current;
      this.currentOutput += device.output;
    }
  }

  disconnectOutput(outputId) {
    const deviceIndex = this.connectedDevices.findIndex(d => d.deviceId === outputId);

    if (deviceIndex !== -1) {
      this.currentOutput -= this.connectedDevices[deviceIndex].output;
      this.connectedDevices.splice(deviceIndex, 1);
    }
  }

  updateBatteryLevel(capacityLeft) {
    this.currentCapacity = capacityLeft;
  }

  get batteryPercentage() {
    return Math.round((this.currentCapacity / this.batteryCapacity * 100) * 10) / 10 ;
  }

  get totalOutputPower() {
    return Math.round(this.connectedDevices.reduce((sum, d) => d.output + sum, 0));
  }

  get timeRemaining() {
    const netPower = Math.abs(this.currentOutput - this.currentInput);

    if (netPower === 0) return "99:59";

    if (this.status === PowerStation.#STATUS.DISCHARGING) {
      const timeInHours = this.currentCapacity / netPower;

      return this.#formatChargeTime(timeInHours);
    }
    if (this.status === PowerStation.#STATUS.CHARGING) {
      const timeInHours = (this.batteryCapacity - this.currentCapacity) / netPower;

      return this.#formatChargeTime(timeInHours);
    }
    if (this.currentOutput === 0) {
      return this.#formatChargeTime(Number.MAX_SAFE_INTEGER);
    }
  }

  get status() {
    return this.#calculateStatus();
  }

  #calculateStatus() {
    if (this.currentInput > this.maximumInput
      || this.currentOutput > this.maximumOutput
    ) {
      return PowerStation.#STATUS.OVERLOAD;
    }
    if (this.currentInput > this.currentOutput) {
      return PowerStation.#STATUS.CHARGING;
    }
    if (this.currentInput < this.currentOutput) {
      return PowerStation.#STATUS.DISCHARGING;
    }
    
    return PowerStation.#STATUS.IDLE;
  }

  #formatChargeTime(hours) {
    if (!isFinite(hours) || hours > 99.983) return "99:59";

    const totalMinutes = Math.round(hours * 60);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
    const mm = String(totalMinutes % 60).padStart(2, '0');

    return `${hh}:${mm}`;
  }
}

const station = new PowerStation(500, 200, 150);
station.connectOutput("lamp_1");
station.updateOutput("lamp_1", 12, 5); // Updates power consumption for the lamp
station.updateBatteryLevel(496); // Updates battery capacity
console.log(station.batteryPercentage); // Displays current battery level 99.2
console.log(station.timeRemaining); // Displays the remaining time 08:16


module.exports = PowerStation;''