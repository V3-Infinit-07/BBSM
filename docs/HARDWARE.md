## Hardware Architecture and Component List
-Processing and User Interface
## Central Microcontroller (U1):

-ESP32-S3 (Dual-core Xtensa LX7 at 240 MHz, with Wi-Fi and Bluetooth LE 5 connectivity, 4 MB Flash / 2 MB PSRAM).

-Display Screen (U2):

-0.96" OLED Display (SSD1306 controller) with a high-speed communication interface.

-Physical Controls (KEY1, KEY2):

-Tactile micro-switches for menu navigation and intercom Push-to-Talk (PTT) function.

## Biomedical and Environmental Sensor Subsystem
-Cardiovascular Impairments and Pressure (PTT)
-Optical PPG Sensor (U4 - MAX30102): Measures heart rate and oxygen saturation via reflection photoplethysmography.

-ECG Monitor (U5 - AD8232): Captures superficial cardiac electrical activity to correlate intervals with the PPG and continuously estimate blood pressure.

-Muscle Loss and Tone (sEMG)
-MyoWare Shield/Module (P1): Records neuromuscular activity and fatigue in the forearm.

## Bone Density and Body Composition
-Chip / Module AD5940: High-precision analog front-end analyzer for bioelectrical impedance and tissue spectroscopy. It estimates changes in bone mineral mass, intracellular water, and extracellular water by injecting alternating microcurrents through contact electrodes on the wrist.

## Vestibular System and Posture
-9-Axis IMU (U6 - ICM-20948): Accelerometer, gyroscope, and magnetometer to detect gait instability and post-reentry vertigo.

## Cosmic Radiation
-Geiger Counter Module (U7 - DFRobot SEN0463 / PIN Diode): Monitors the ionizing radiation dose rate in real time ().

## Digital Audio Subsystem (I2S)
-Microphone: INMP441 omnidirectional MEMS microphone module (MIC1) with a 24-bit digital I2S interface.

## Audio and Alert Output
-Class D Amplifier (U3 - MAX98357A) with integrated DAC.

-Miniature speaker / 1W (SPK1).

## Power and Actuators Subsystem
-Power Supply: 3.7V / 800 mAh rechargeable LiPo battery (U8).

-Charge Management: TP4056 module with USB-C port and over-discharge protection (U11).

-Haptic Feedback: Coin-type vibration motor (U10), controlled via an NPN 2N2222 transistor (Q1), base resistor (R1), and 1N4148 flyback protection diode (D1).

-Energy Optimization: P-channel MOSFETs (IRLML6402) for power gating high-consumption sensors during deep sleep states.
-Energy Optimization: P-channel MOSFETs (IRLML6402) for power gating high-consumption sensors during deep sleep states.
