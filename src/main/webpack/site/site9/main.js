// Stylesheets
import "./main.scss";
import 'bootstrap';

import { bindSiteSectionDropdown } from '../../components/navigation/rootedsitesectionnavigation/js/rootedsitesectionnavigation';
import { initCarousels } from "../../components/layout/carousel/js/carousel";

import initNotificationBars from "../../components/structure/notificationbar/js/notificationbar"
import initPageHeader from '../../components/structure/pageheader/js/pageheader';
import initHeaderSearch from '../../components/navigation/headersearch/js/headersearch';
import initMegaMenuNav from '../../components/navigation/megamenu/js/megamenunavigation';
// import { initSpeedBumpLinks } from "../../components/structure/speedbump/js/speedbump";
import { initFormContainer } from '../../components/form/container/js/container';
import { validateFormText } from "../../components/form/text/js/text";
import '../../application/contentSearch/js/contentSearchBar';
import '../../application/contentSearch/js/contentSearchResults';
import { initializeActiveLink } from '../../components/content/link/js/link';
import domReady from "../../application/domReady/domReady";

// IE11 polyfill for Array.prototype.forEach
if ( window.NodeList && !NodeList.prototype.forEach ) {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

domReady(() => {
    initFormContainer();
    validateFormText();
    initPageHeader();
    bindSiteSectionDropdown();
    initNotificationBars();
    initHeaderSearch();
    // initSpeedBumpLinks();
    initializeActiveLink();
});