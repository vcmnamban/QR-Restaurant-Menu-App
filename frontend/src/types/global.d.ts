declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

declare module 'react-hot-toast' {
  export const toast: any;
}

declare module 'lucide-react' {
  export const ArrowLeft: any;
  export const Tag: any;
  export const Utensils: any;
  export const BarChart3: any;
  export const Settings: any;
  export const Eye: any;
}
