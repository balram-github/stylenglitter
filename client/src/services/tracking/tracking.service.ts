import mixpanel, { Dict } from "mixpanel-browser";

export const enableTracking = !!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const initialiseTracking = () => {
  if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    console.warn("Mixpanel token is not set");
    return;
  }

  console.info("Initialising mixpanel");

  mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
    persistence: "localStorage",
  });
};

export const trackEvent = (eventName: string, payload: Dict | undefined) => {
  try {
    if (!enableTracking) {
      return false;
    }

    mixpanel.track(eventName, payload, { send_immediately: true });
  } catch (error) {
    console.error(error);
  }
};
