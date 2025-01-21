import { ReactInstance } from 'react';
import * as ReactDOM from 'react-dom';

export default function findHTMLElement(e: React.ReactInstance | null): HTMLElement | null {
  if (e && 'current' in e) {
    // Handle React ref objects (React.createRef or useRef)
    return e.current instanceof HTMLElement ? e.current : null;
  } else if (e instanceof HTMLElement) {
    // Handle direct HTMLElement instances
    return e;
  }

  return null;
}