import ReactGA from "react-ga";

export const initGA = () => {           
    ReactGA.initialize('G-LR874JMH94'); 
 }

export const PageView = () => {  
    ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
}

/**
 * Event - Add custom tracking event.
 * @param {string} category 
 * @param {string} action 
 * @param {string} label 
 */
export const Event = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
  };

export const OutboundLink = (label, callback) => {
    ReactGA.outboundLink({
    label: label
    }, callback);
}

  