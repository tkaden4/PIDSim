export interface Proportion {
  proportionality: number;
  bias: number;
}

export interface Integral {
  coefficient: number;
}

export interface Derivative {
  coefficient: number;
}

export interface PID {
  proportion: Proportion;
  integral: Integral;
  derivative: Derivative;
}

export interface Controller {
  (error: number, delta: number): number;
}

export function pidController(pid: PID): Controller {
  let integral = 0;
  let previousError: number | undefined = undefined;
  return (error, delta) => {
    previousError = previousError ?? error;
    integral += pid.integral.coefficient * error * delta;
    const proportion = pid.proportion.proportionality * error + pid.proportion.bias;
    const derivative = pid.derivative.coefficient * ((error - previousError) / delta);
    return proportion + integral + derivative;
  };
}

// A process is an interaction between the manipulated variable,
// over a period of time, producing a present value
export interface Process {
  (m: number, delta: number): number;
}

export function cruiseControl(startingSpeed: number, jerk: number): Process {
  let currentSpeed = startingSpeed;
  return (pedal: number, delta: number) => {
    const acceleration = pedal * jerk;
    const speedGain = acceleration * delta;
    currentSpeed += speedGain;
    return currentSpeed;
  };
}

export function runProcessWithPIDControl(
  process: Process,
  pid: Controller,
  initialOutput: number,
  setPoint: number,
  steps: number,
  delta: number,
  onStep: (pv: number) => void
) {
  let pv = process(initialOutput, 0);
  let output = initialOutput;
  for (let i = 0; i < steps; ++i) {
    output = pid(setPoint - pv, delta);
    pv = process(output, delta);
    onStep(pv);
  }
}
