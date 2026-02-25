/** Pre-check / system check type definitions for proctored assessments. */

export type CheckResult = 'pass' | 'warning' | 'fail';

export type CheckType =
  | 'browser'
  | 'internet'
  | 'camera'
  | 'microphone'
  | 'screen';

export interface SystemChecks {
  browser?: CheckResult;
  internet?: CheckResult;
  camera?: CheckResult;
  microphone?: CheckResult;
  screen?: CheckResult;
}

export interface CheckTarget {
  id: string;
  name: string;
  type: 'assessment' | 'center';
}
