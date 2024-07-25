import { initSpeedBumpLink } from '../../../structure/speedbump/js/speedbump'

function toggleClosedClass(el, className) {
  el.classList.toggle(`${className}--closed`);
}

function bindLoginLinkBtn({loginLinkBtn, loginLink}) {
  const 
    LOGIN_CONTENT_CLASS = 'cmp-loginlink__content',
    loginLinkContent = loginLink.querySelector(`.${LOGIN_CONTENT_CLASS}`),
    handleLoginLinkBtn = (event) => {
      toggleClosedClass(loginLinkContent, LOGIN_CONTENT_CLASS);
      event.stopPropagation();
    },
    stopPropagation = (event) => {
      event.stopPropagation();
    },
    toggleLoginLinkContentClass = () => {
      loginLinkContent.classList.add(`${LOGIN_CONTENT_CLASS}--closed`);
    }
  ;
  
  loginLinkBtn.addEventListener("click", handleLoginLinkBtn);
  loginLinkBtn.addEventListener("tap", handleLoginLinkBtn);

  loginLinkContent.addEventListener("click", stopPropagation);
  loginLinkContent.addEventListener("tap", stopPropagation);

  document.addEventListener("click", toggleLoginLinkContentClass);
  document.addEventListener("tap", toggleLoginLinkContentClass);
}

function setCloseSection({section, CLASS_NAME, open}) {
  if (open) {
    section.classList.remove(`${CLASS_NAME}--closed`)
    return;
  }

  section.classList.add(`${CLASS_NAME}--closed`)
}

function setSpeedBump({showSpeedBump, submitAction}){
  const 
    handleSubmitAction = () =>  {
      window.open(submitAction.dataset.href, '_target');
    }
  ;

  if (showSpeedBump) {
    initSpeedBumpLink(submitAction);
    return;
  }

  submitAction.addEventListener("click", handleSubmitAction);
  submitAction.addEventListener("touchstart", handleSubmitAction);
  submitAction.addEventListener('touchend', e => e.preventDefault() );
}

function setDataHref({ submitAction, url, mobileUrl }) { 
  const IS_MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const DEFAULT_URL = '/';
  if(IS_MOBILE_REGEX.test(navigator.userAgent)){
    submitAction.setAttribute('data-href', mobileUrl || DEFAULT_URL )
    return;
  }
  submitAction.setAttribute('data-href', url || DEFAULT_URL );
}

function handleSelectedOption({ selectLogin, submitAction, enrollLinks, ENROLL_LINKS_CLASS, event}) {
  if (event) {
    event.stopPropagation();
  }
  
  const 
    { url, mobileUrl, action, requiresSpeedbump, showsEnrollLinks } = selectLogin.querySelector(":selected").dataset,
    showEnrollSection = showsEnrollLinks === '',
    showSpeedBump = requiresSpeedbump === ''
  ;

  setCloseSection({ section: enrollLinks, CLASS_NAME: ENROLL_LINKS_CLASS, open: showEnrollSection });
  submitAction.innerHTML = action;
  setDataHref({submitAction, url, mobileUrl});
  setSpeedBump({showSpeedBump, submitAction});
}

function bindSelectLink(PARAMS) {
  PARAMS.selectLogin.addEventListener('change', (event) => handleSelectedOption({...PARAMS, event}) );
  handleSelectedOption({...PARAMS});
}

function initLoginLink(loginLink) {
  const 
    LOGIN_LINK_CLASS = "js-loginlink-btn",
    SELECT_LOGIN_LINK_CLASS = "js-login-link-select",
    SELECT_SUBMIT_ACTION = "js-form-submit-action",
    ENROLL_LINKS_CLASS = "js-enroll-links",
    loginLinkBtn = loginLink.querySelector(`.${LOGIN_LINK_CLASS}`),
    selectLogin = loginLink.querySelector(`.${SELECT_LOGIN_LINK_CLASS}`),
    submitAction = loginLink.querySelector(`.${SELECT_SUBMIT_ACTION}`),
    enrollLinks = loginLink.querySelectorAll(`.${ENROLL_LINKS_CLASS}`),
    PARAMS = {
      loginLink,
      loginLinkBtn, 
      selectLogin, 
      submitAction, 
      enrollLinks, 
      ENROLL_LINKS_CLASS 
    }
  ;

  bindLoginLinkBtn(PARAMS);
  bindSelectLink(PARAMS);
}

function initializeLoginLink() {
  document.querySelectorAll( '[data-cmp-is="loginlink"]' )
          .forEach(initLoginLink);
}

export default initializeLoginLink;