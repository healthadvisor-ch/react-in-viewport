export type Config = {
  disconnectOnLeave?: boolean;
};

export type Props = {
  onEnterViewport?: () => void;
  onLeaveViewport?: () => void;
  [key: string]: any;
};

export type Options = IntersectionObserverInit &
{ root?: Document | Element | (() => Element) | null };
