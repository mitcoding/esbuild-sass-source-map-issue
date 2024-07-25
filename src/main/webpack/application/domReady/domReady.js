const domReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded",  callback);
  } 
  else {
    callback();
  }
};

export default domReady;