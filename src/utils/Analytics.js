import ReactGA4 from 'react-ga4';

export const initGA = () => {
  ReactGA4.initialize("G-RTEXGYY27G");
}

export const logPageView = () => {
  ReactGA4.set({ page: window.location.pathname + window.location.search });
}

export const logEvent = (category = '', action = '') => {
  if (category && action) {
    ReactGA4.event({
      category,
      action
    });
  }
}
