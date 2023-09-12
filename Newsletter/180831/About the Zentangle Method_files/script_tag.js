
var _ua_bannerRunner = function(){
  function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
  }

  var _ua_bannerEligibleForDisplay = false;
  var _ua_bannerUnseen = !getCookie('sec-banner');
  var _ua_bannerDisplayUntilDismissed = 'until_dismissed' == 'until_dismissed';
  var _ua_bannerDisplayUntilAccepted = 'until_dismissed' == 'until_accepted';
  var _ua_bannerDismissed = getCookie('sec-banner-dismiss');
  var _ua_bannerAccepted = getCookie('sec-banner-allow-all-cookies');
  var _ua_bannerShouldDisplay = _ua_bannerEligibleForDisplay && (_ua_bannerUnseen || (_ua_bannerDisplayUntilDismissed && !_ua_bannerDismissed) || (_ua_bannerDisplayUntilAccepted && !_ua_bannerAccepted));
  var _ua_bannerPreviewMode = location.search.includes('show-banner');
  // Instagram override
  var _ua_bannerHideInInstagram = false;
  var _ua_isInstagram = window.navigator.userAgent.match(/instagram/i);
  if (_ua_isInstagram && _ua_bannerHideInInstagram) {
    _ua_bannerShouldDisplay = false;
  }

  window._ua_bannerRunNonessentialScript = function(){
    // New analytics support
    if (window.flushConsentGuard) {
      window.flushConsentGuard();
    }

    var forceGlobalEval = eval;
    var script = "";
    if (script) {
      forceGlobalEval(decodeURIComponent(atob(script)));
    }

    // Also inject Facebook Pixel and Google Analytics script

      var googleFragment = document.createRange().createContextualFragment(decodeURIComponent(atob("")));
      document.body.appendChild(googleFragment);
  }

  // The only case we need to be worried about is: banner is eligible for display,
  // but user has not consented. Otherwise run non-essential scripts.
  var _ua_skipScript = _ua_bannerEligibleForDisplay && !getCookie('sec-banner-allow-all-cookies');
  if (!_ua_skipScript) {
    _ua_bannerRunNonessentialScript();
  }


  if (_ua_bannerPreviewMode || _ua_bannerShouldDisplay) {
    const isMobile = window.navigator.userAgent.match(/mobi/i);
    const overrideDismissButton = false;
    document.cookie = "sec-banner=true;max-age=31536000;path=/;"; // Mark as displayed

    var banner = document.createElement('div');
    banner.id ="sec-banner-div";

    const columnLayout = isMobile && overrideDismissButton;
    var bannerStyle = "box-sizing: border-box; z-index: 2147483647; position: fixed; visibility: visible; border: 0px; font-size: 0.9em; width: 100%; min-height: 30px; padding: 12px 20px; display: flex; flex-direction: " + (columnLayout ? "column" : "row") + "; flex-wrap: nowrap; align-items: center; -ms-flex-align: center; -ms-grid-row-align: center;";

    const fontStyle = document.createElement("link");
    fontStyle.type = "text/css";
    fontStyle.rel = "stylesheet";
    switch("open_sans") {
        case 'kalam':
            fontStyle.href='https://fonts.googleapis.com/css?family=Kalam'
            bannerStyle += "font-family: 'Kalam', cursive;"
            break;
        case 'sanchez':
            fontStyle.href='https://fonts.googleapis.com/css?family=Sanchez'
            bannerStyle += "font-family: 'Sanchez', serif;"
            break;
        case 'quicksand':
            fontStyle.href='https://fonts.googleapis.com/css?family=Quicksand'
            bannerStyle += "font-family: 'Quicksand', sans-serif;"
            break;
        default:
            fontStyle.href='https://fonts.googleapis.com/css?family=Open+Sans'
            bannerStyle += "font-family: 'Open Sans', sans-serif;"
    }

    document.head.appendChild(fontStyle);

    // banner position
    bannerStyle += "bottom:0;";

    // banner bg & text color
    bannerStyle += "background-color:#4baaa7;";
    bannerStyle += "color:#000000;";

    window.ua_dismissWithFullConsent = function(el){
      var containerElement = document.getElementsByClassName('upsell-gdpr-banner-container')[0];
      containerElement.style.display = "none";

      document.cookie = "sec-banner-allow-all-cookies=true;path=/;max-age=31536000";
      document.cookie = "sec-banner-dismiss=true;path=/;max-age=31536000";
      document.body.parentElement.style.cssText += "padding-bottom:0px";

      var consentRequest = new XMLHttpRequest();
      consentRequest.open("POST", "https://smarteucookiebanner.upsell-apps.com/consents?shop=zentangle01.myshopify.com");
      consentRequest.send();

      _ua_bannerRunNonessentialScript();
    };

    window.ua_dismissWithPartialConsent = function(el){
      var containerElement = document.getElementsByClassName('upsell-gdpr-banner-container')[0];
      containerElement.style.display = "none";

      document.cookie = "sec-banner-dismiss=true;path=/;max-age=31536000";
      document.body.parentElement.style.cssText += "padding-bottom:0px";
    };

    var bannerHTML = '<span style="flex: 1; -ms-flex: 1;" class="upsell-gdpr-banner-message">' +
          decodeURIComponent(atob("QnklMjB1c2luZyUyMHRoaXMlMjBzaXRlJTIweW91JTIwYWdyZWUlMjB0byUyMHRoZSUyMHVzZSUyMG9mJTIwY29va2llcy4="));

        bannerHTML += '&nbsp;&nbsp;&nbsp;' +
          '<a href="https://zentangle.com/tools/privacy" style="width:15px; height: 15px;">' +
            '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 26 26" version="1.1" style="width: 15px; height: 15px;">' +
              '<g id="surface1">' +
                '<path fill="#000000" style=" " d="M 13 1.1875 C 6.476563 1.1875 1.1875 6.476563 1.1875 13 C 1.1875 19.523438 6.476563 24.8125 13 24.8125 C 19.523438 24.8125 24.8125 19.523438 24.8125 13 C 24.8125 6.476563 19.523438 1.1875 13 1.1875 Z M 15.460938 19.496094 C 14.851563 19.734375 14.367188 19.917969 14.003906 20.042969 C 13.640625 20.167969 13.222656 20.230469 12.742188 20.230469 C 12.007813 20.230469 11.433594 20.050781 11.023438 19.691406 C 10.617188 19.335938 10.414063 18.878906 10.414063 18.324219 C 10.414063 18.109375 10.429688 17.890625 10.460938 17.667969 C 10.488281 17.441406 10.539063 17.191406 10.605469 16.90625 L 11.367188 14.21875 C 11.433594 13.960938 11.492188 13.71875 11.539063 13.488281 C 11.585938 13.257813 11.605469 13.046875 11.605469 12.855469 C 11.605469 12.515625 11.535156 12.273438 11.394531 12.140625 C 11.25 12.003906 10.980469 11.9375 10.582031 11.9375 C 10.386719 11.9375 10.183594 11.96875 9.976563 12.027344 C 9.769531 12.089844 9.59375 12.148438 9.445313 12.203125 L 9.648438 11.375 C 10.144531 11.171875 10.621094 11 11.078125 10.855469 C 11.53125 10.710938 11.964844 10.636719 12.367188 10.636719 C 13.097656 10.636719 13.664063 10.816406 14.058594 11.167969 C 14.453125 11.519531 14.652344 11.980469 14.652344 12.542969 C 14.652344 12.660156 14.640625 12.867188 14.613281 13.160156 C 14.585938 13.453125 14.535156 13.722656 14.460938 13.972656 L 13.703125 16.652344 C 13.640625 16.867188 13.585938 17.113281 13.535156 17.386719 C 13.488281 17.660156 13.464844 17.871094 13.464844 18.011719 C 13.464844 18.367188 13.542969 18.613281 13.703125 18.742188 C 13.859375 18.871094 14.136719 18.933594 14.53125 18.933594 C 14.714844 18.933594 14.921875 18.902344 15.15625 18.839844 C 15.386719 18.773438 15.554688 18.71875 15.660156 18.667969 Z M 15.324219 8.617188 C 14.972656 8.945313 14.546875 9.109375 14.050781 9.109375 C 13.554688 9.109375 13.125 8.945313 12.769531 8.617188 C 12.414063 8.289063 12.238281 7.890625 12.238281 7.425781 C 12.238281 6.960938 12.417969 6.558594 12.769531 6.226563 C 13.125 5.894531 13.554688 5.730469 14.050781 5.730469 C 14.546875 5.730469 14.972656 5.894531 15.324219 6.226563 C 15.679688 6.558594 15.855469 6.960938 15.855469 7.425781 C 15.855469 7.890625 15.679688 8.289063 15.324219 8.617188 Z "/>' +
              '</g>' +
            '</svg>' +
          '</a>';

        bannerHTML += '' +
        '</span>' +
      '<div style="display: flex; -ms-flex-align: center; align-items: center; -ms-flex-line-pack: justify; align-content: space-between;' + (columnLayout ? " margin-top: 0.75em; margin-bottom: 0.5em;" : "") + '">'
      ;


          bannerHTML += '' +
            '<div id="_ua_bannerAcceptButton" onClick="ua_dismissWithFullConsent(this);" style="padding: 3px 20px; cursor:pointer;float:right; border: 1px solid #000000; border-radius: 5px; margin-left: 15px;">' +
              "Ok" +
            '</div>';

        bannerHTML += '' +
        '<svg onClick="ua_dismissWithPartialConsent(this);" style="width:18px;height: 18px;cursor:pointer;float:right; margin-left: 20px;" height="512px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
          '<path fill="#000000" d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"/>' +
        '</svg>';

        bannerHTML += '' +
      '</div>';
    banner.style.cssText = bannerStyle;
    banner.innerHTML = bannerHTML;
    banner.className = "upsell-gdpr-banner-container";
    document.body.appendChild(banner);
    const bannerHeight = document.getElementById('sec-banner-div').offsetHeight;

    const globalStyles = document.createElement('style');
    globalStyles.innerHTML = '' +
    '.upsell-gdpr-banner-message a {' +
      'color: #000000;' +
      'text-decoration: underline;' +
    '}' +
    /* Override for https://www.greenpebble.co.uk/?show-banner=true */
    '.sweettooth-launcher-container {' +
      'z-index: 2147483646 !important;' +
    '}';
    document.head.appendChild(globalStyles);

    // Apply to html, instead of body, to work correctly with Shopify's admin bar.
    document.body.parentElement.style.cssText += 'padding-bottom:'+bannerHeight+'px';
  }
} // End _ua_bannerRunner()


if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function(){
    _ua_bannerRunner.apply(window);
  });
} else {
  _ua_bannerRunner.apply(window);
}

