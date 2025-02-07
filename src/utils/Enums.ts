/**
 * Enum for Verisoul Environment.
 */
export enum VerisoulEnvironment {
  dev = 'dev',
  production = 'production',
  sandbox = 'sandbox',
  staging = 'staging',
}

/**
 * Enum for motion actions.
 * These actions are used to handle gesture events in a pan responder.
 */
export enum MotionAction {
  /**
   * Represents the start of a gesture. The motion contains the initial starting location.
   * This is the point where the gesture is granted, and initial coordinates are captured.
   */
  ACTION_DOWN = 0,

  /**
   * Represents the end of a gesture. The motion contains the final release location
   * and any intermediate points since the last down or move event.
   * This is the point where the gesture is released.
   */
  ACTION_UP = 1,

  /**
   * Represents a change during a gesture (between ACTION_DOWN and ACTION_UP).
   * The motion contains the most recent point and any intermediate points
   * since the last down or move event. This is the point where the gesture is moving.
   */
  ACTION_MOVE = 2,
}
