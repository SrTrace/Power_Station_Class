const PowerStation = require("./station");

describe('Power Station', () => {
  let instance;

  beforeEach(() => {
    instance = new PowerStation(2000, 500, 800);
  });

  it('should be charged to 100% at initial state', () => {
    expect(instance.batteryPercentage).toBe(100);
  });

  it('should be charged from external source', () => {
    instance.updateInput(220, 2);

    expect(instance.currentInput).toBe(220 * 2);
  });

  it('should be able to connecting devices', () => {
    instance.connectOutput("usb_1");

    expect(instance.connectedDevices).toBeInstanceOf(Array);
    expect(instance.connectedDevices).toEqual([{ deviceId: "usb_1", output: 0 }]);
  });

  it('should be updating consumptions', () => {
    instance.connectOutput("usb_1");
    instance.updateOutput("usb_1", 5, 1.2);

    const device = instance.connectedDevices.find((d) => d.deviceId === "usb_1");
    
    expect(device).toEqual({
      deviceId: "usb_1",
      output: 5 * 1.2,
    });
  });

  it('should disconnect device', () => {
    instance.connectOutput("usb_1");
    instance.connectOutput("usb_2");
    instance.disconnectOutput("usb_1");

    expect(instance.connectedDevices).toEqual([{
      deviceId: "usb_2",
      output: 0,
    }]);
  });

  it('should update battery level', () => {
    instance.updateBatteryLevel(875);

    expect(instance.batteryPercentage).toBe(43.8);
  });

  it('should round battery percentage correctly, ounded to 1 decimal place', () => {
    // Edge case: Round to 1 decimal for a value with more than 1 decimal
    instance.updateBatteryLevel(333); // capacityLeft = 333 (integer)
    // (333 / 2000) * 100 = 16.65, rounded to 16.7
    expect(instance.batteryPercentage).toBe(16.7);

    // Edge case: Exact integer value, no rounding needed
    instance.updateBatteryLevel(1000); // (1000 / 2000) * 100 = 50
    expect(instance.batteryPercentage).toBe(50);

    // If small value close to 0, rounding to 0
    instance.updateBatteryLevel(1); // (1 / 2000) * 100 = 0.05, rounded to 0.0
    expect(instance.batteryPercentage).toBe(0.1);

    // If intermediate value, should round to nearest decimal
    instance.updateBatteryLevel(45); // (45 / 2000) * 100 = 2.25, rounded to 2.3
    expect(instance.batteryPercentage).toBe(2.3);

    // If large value near full capacity
    instance.updateBatteryLevel(1999); // (1999 / 2000) * 100 = 99.95, rounded to 100
    expect(instance.batteryPercentage).toBe(100);

    // If exact full capacity, should return 100%
    instance.updateBatteryLevel(2000); // (2000 / 2000) * 100 = 100
    expect(instance.batteryPercentage).toBe(100);

    // If slightly less than full, rounds correctly
    instance.updateBatteryLevel(1999); // (1999 / 2000) * 100 = 99.95, rounded to 100
    expect(instance.batteryPercentage).toBe(100);

    // If negative capacity, should be treated as 0%
    // instance.updateBatteryLevel(-1); // Invalid value, should set to 0
    // expect(instance.batteryPercentage).toBe(0);

    // If overflow (capacity exceeds max), should cap at 100%
    // instance.updateBatteryLevel(2500); // Exceeds max, should be capped at 100
    // expect(instance.batteryPercentage).toBe(100);
  });

  it('should return the sum of all output powers in watts, rounded to the nearest integer.', () => {
    instance.connectedDevices = [
      { deviceId: 'device1', output: 50.5 },
      { deviceId: 'device2', output: 25.3 },
      { deviceId: 'device3', output: 100.2 },
      { deviceId: 'device4', output: 75.8 },
      { deviceId: 'device5', output: 0 }
    ];
  
    // Sum = 50.5 + 25.3 + 100.2 + 75.8 + 0 = 251.8
    const result = instance.totalOutputPower;

    expect(typeof result).toBe('number');

    // Rounded to nearest integer = 252
    expect(instance.totalOutputPower).toBe(252);
  });

  it('should return a current status of station', () => {
    // "charging": When input power is active and enough to charge the battery.
    instance.connectOutput("device1");
    instance.updateOutput("device1", 75, 2);
    instance.connectOutput("device2");
    instance.updateOutput("device2", 150, 2);
    instance.updateInput(250, 2);

    expect(instance.status).toBe('charging');

    // "discharging": When the output power is active and a battery is used.
    instance.updateInput(1, 1);
    instance.connectOutput("device3");
    instance.updateOutput("device3", 150, 2);

    expect(instance.status).toBe('discharging');

    // "idle": No input or output power goes through the battery. (When the input power equals the output power).
    instance.updateInput(225, 2);
    instance.disconnectOutput("device2");
    expect(instance.status).toBe('idle');
    
    instance.disconnectOutput("device1");
    instance.disconnectOutput("device3");
    instance.updateInput(0, 0);
    expect(instance.totalOutputPower).toBe(0);
    expect(instance.status).toBe('idle');

    // "overload": When either input or output power exceeds the limits (takes priority over all other statuses).
    instance.updateInput(instance.maximumInput + 1, 1);
    expect(instance.status).toBe('overload');

    instance.updateInput(100, 2);
    instance.connectOutput("device4");
    instance.updateOutput("device4", 250, 4);
    expect(instance.status).toBe('overload');
  });

  it('should display the time remaining until full charge or full discharge', () => {
    // If the battery is charging, it returns the time until the battery is fully charged, rounded up to the nearest minute
    instance.updateInput(150, 2);
    instance.updateBatteryLevel(1850);
    
    expect(typeof instance.timeRemaining).toBe('string');
    expect(instance.timeRemaining).toBe("00:30");
    
    instance.connectOutput("device1");
    instance.updateOutput("device1", 50, 2);

    expect(instance.timeRemaining).toBe("00:45");

    // If the battery is discharging, it returns the time until the battery is fully discharged, rounded up to the nearest minute.
    instance.updateInput(0, 0);

    expect(instance.timeRemaining).toBe("18:30");

    instance.updateInput(25, 2);

    expect(instance.timeRemaining).toBe("37:00");

    // If no output is active, return "99:59" to indicate a very long discharge time.
    instance.disconnectOutput("device1");
    instance.updateInput(0, 0);
    
    expect(instance.timeRemaining).toBe("99:59");
  });
});