[Link to test tase](https://ts-trainee-js-fullstack.s3.us-east-1.amazonaws.com/ts-trainee-fullstack-prescreen-task-description-v2.html)

Task: Implement a Power Station Class
The goal of this task is to create a class, PowerStation, that simulates an uninterruptible power
supply. This power station manages the battery charge and discharge, power input and output limits, and displays
status updates. It can also function as a power throughput, allowing simultaneous charging of its own battery and
powering of connected devices from the external source. You'll implement the class following the specified
interface, ensuring it meets the functionality and handles various edge cases.
Overview
The PowerStation class should manage the following:

    Battery capacity and percentage
    Power input and output management
    Connection and disconnection of output devices
    Calculation of discharge/charge times based on power consumption
    Real-time status updates

How to submit your solution
Please submit your solution in a .txt text file. Name the file using the following format: your_name.txt.

For example, if your name is John Doe, the file name should be: john_doe.txt
Please copy this code and implement your solution:
class PowerStation {
constructor(batteryCapacity, maximumInput, maximumOutput) {
// Implement constructor
}

updateInput(voltage, current) {
// Implement this and other methods and getters
}

connectOutput(outputId) {

}

updateOutput(outputId, voltage, current) {

}

disconnectOutput(outputId) {

}

updateBatteryLevel(capacityLeft) {

}

get batteryPercentage() {

}

get totalOutputPower() {

}

get timeRemaining() {

}

get status() {

}
}

You don't need to export the class from the file. Keep the class name, method names, argument order, and
constructor interface unchanged. The tests will evaluate your implementation by simulating various usage scenarios.
Only use built-in JavaScript methods; any code relying on third-party libraries will fail the tests. Below is a
detailed description of the required implementation.
Interface and Method Details
Below are the specifications for each required method and getter. Unless specified otherwise, assume all input
values are valid so the negative or non-numeric values will not be tested.
Constructor
constructor(batteryCapacity, maximumInput, maximumOutput) // e.g., new PowerStation(2000, 500, 800)

Parameters:

    batteryCapacity (number): Maximum battery capacity in watt-hours (Wh), e.g., 2000
    maximumInput (number): Maximum allowable input power in watts (W), e.g, 500
    maximumOutput (number): Maximum allowable output power in watts (W), e.g, 800

Battery should be at its full capacity (charged to 100%) at the initial state.

Power station input
Each power station may need to be charged from an external source, such as the grid or solar panels. This method
updates the device's input state. See how to calculate power based on this data here.
updateInput(voltage, current) // e.g., updateInput(220, 2)

Parameters:

    voltage (number): Voltage of the input source in volts.
    current (number): Current of the input source in amps.

Connecting devices
Devices like mobile phones and household appliances can be connected to the Power Station outputs. This method is
called when a new device is being connected. See how to calculate power based on this data here.
connectOutput(outputId) // e.g., connectOutput("usb_1")

Parameters:
outputId (string): Unique identifier for the output to which the devices are being connected.
You may need to track which devices are connected to manage output power accurately.
Assume that outputId is always unique, and the same output will not be connected multiple times. You
don't have to worry about the number of connected devices.

Updating consumption
Connected devices consume varying amounts of power during operation; for instance, a washing machine consumes more
energy when heating water.
updateOutput(outputId, voltage, current) // e.g., updateOutput("usb_1", 5, 1.2)

Parameters:
outputId (string): Identifier for the output device.
voltage (number): The voltage of the output device is in volts.
current (number): Current of the output device in amps.

This method updates the singular output's power consumption. See how to calculate power based on this data here.
Assume that outputId is always valid and connected.

Disconnecting devices
disconnectOutput(outputId) // e.g., disconnectOutput("usb_1")

Parameters:

    outputId (string): Identifier for the output device being disconnected.

This method disconnects an output device from the power station. Ensure that any power calculations reflect the
device's disconnection.

Updating battery capacity
updateBatteryLevel(capacityLeft) // e.g., updateBatteryLevel(875)

The device battery can be charged or discharged. You don't need to calculate its current capacity manually; this
method will trigger automatically and handle that.
Parameters:
capacityLeft (number): The remaining capacity in watt-hours (Wh).
This should directly impact the battery percentage and status.

Display the current battery level
get batteryPercentage() // Number (e.g., 99.9)

Returns the current battery level as a percentage of battery capacity, rounded to 1 decimal place.
Example
For a Power Station with a battery capacity of 500 Wh, at the capacity level of 376 Wh, it
should return 75.2

Display total output power
get totalOutputPower() // Number (e.g., 250)

Returns the sum of all output powers in watts, rounded to the nearest integer. If no devices are using power, this
should return 0. Should return number.

Display the time remaining until full charge
or full discharge
get timeRemaining() // String (e.g., "01:30")

Returns the estimated time remaining either until the battery is fully charged or fully discharged in HH:MM format,
depending on the current battery state:

    If the battery is charging, it returns the time until the battery is fully charged, rounded up to the nearest
      minute.
    If the battery is discharging, it returns the time until the battery is fully discharged, rounded up to the
      nearest minute.
    If no output is active, return "99:59" to indicate a very long discharge time.

The returned value is based on the relationship between battery capacity and power consumption/charging rate. See
time calculation for more details.
Hint: The totalOutputPower returns a rounded number, suitable for display purposes. However, the
actual consumption may not be an integer number, which can impact the calculation of the remaining time.

Display Power Station status
get status() // String (e.g., "charging")

Returns the current status of the power station.
Required values:

      "charging": When input power is active and enough to charge the battery.


      "discharging": When the output power is active and a battery is used.


      "idle": No input or output power goes through the battery. (When the input power equals
        the output power).


      "overload": When either input or output power exceeds the limits (takes priority over
        all other statuses).

Useful formulas
These formulas should cover most of the requirements for this task without needing deep electronics knowledge.
Power Calculation (Watts, W)
Power (in watts) is calculated using voltage (V) and current (A):

$$
Power (W)=Voltage (V) × Current (A)
$$

Example:
If a phone charger uses 5 volts and 2 amps, its power is $5(V)×2(A) = 10(W)$
Time Calculation (Time, hours)
Time (in hours) is calculated using energy capacity (Wh) and power (W)

$$
Time (Hours)=\frac{Capacity(Wh)}{Power(W)}
$$

Example:
If you connect a device that consumes 100 W to a 200 Wh battery, the charge will last for $\frac{200(Wh)}{100(W)}=2(Hours)$

Usage example
A brief example of how the class might be instantiated and used:
const station = new PowerStation(500, 200, 150);
station.connectOutput("lamp_1");
station.updateOutput("lamp_1", 12, 5); // Updates power consumption for the lamp
station.updateBatteryLevel(496); // Updates battery capacity
console.log(station.batteryPercentage); // Displays current battery level 99.2
console.log(station.timeRemaining); // Displays the remaining time 08:16

Good luck with implementing your PowerStation class! Consider all edge cases and ensure your methods work together
to maintain an accurate state at all times.
A few additional hints

    You can define more methods in the class to assist you in checking different states or doing formatting in the
      required methods.
    Remember that the power station can charge and deliver energy simultaneously.
