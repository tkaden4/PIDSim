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

export interface TimeStep {
  (error: number, delta: number): number;
}

export function pidStep(pid: PID): TimeStep {
  let integral = 0;
  let previousError = 0;
  return (error, delta) => {
    previousError = error;
    const proportion = pid.proportion.proportionality * error + pid.proportion.bias;
    const derivative = pid.derivative.coefficient * ((error - previousError) / delta);
    integral += pid.integral.coefficient * error * delta;
    return proportion + integral + derivative;
  };
}

// A process is an interaction between the manipulatable variable,
// over a period of time, producing a present value
export interface Process {
  (m: number, delta: number): number;
}

export function cruiseControl(speed: number): Process {
  return (pedal: number, delta: number) => {
    return 0;
  };
}
