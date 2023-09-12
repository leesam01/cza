window.slate = window.slate || {};
window.theme = window.theme || {};

/*================ Slate ================*/
/**
 * A11y Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help make your theme more accessible
 * to users with visual impairments.
 *
 *
 * @namespace a11y
 */

slate.a11y = {

  /**
   * For use when focus shifts to a container rather than a link
   * eg for In-page links, after scroll, focus shifts to content area so that
   * next `tab` is where user expects if focusing a link, just $link.focus();
   *
   * @param {JQuery} $element - The element to be acted upon
   */
  pageLinkFocus: function($element) {
    var focusClass = 'js-focus-hidden';

    $element.first()
      .attr('tabIndex', '-1')
      .focus()
      .addClass(focusClass)
      .one('blur', callback);

    function callback() {
      $element.first()
        .removeClass(focusClass)
        .removeAttr('tabindex');
    }
  },

  /**
   * If there's a hash in the url, focus the appropriate element
   */
  focusHash: function() {
    var hash = window.location.hash;

    // is there a hash in the url? is it an element on the page?
    if (hash && document.getElementById(hash.slice(1))) {
      this.pageLinkFocus($(hash));
    }
  },

  /**
   * When an in-page (url w/hash) link is clicked, focus the appropriate element
   */
  bindInPageLinks: function() {
    $('a[href*=#]').on('click', function(evt) {
      this.pageLinkFocus($(evt.currentTarget.hash));
    }.bind(this));
  },

  /**
   * Traps the focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {jQuery} options.$elementToFocus - Element to be focused when focus leaves container
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  trapFocus: function(options) {
    var eventName = options.eventNamespace
      ? 'focusin.' + options.eventNamespace
      : 'focusin';

    if (!options.$elementToFocus) {
      options.$elementToFocus = options.$container;
    }

    options.$container.attr('tabindex', '-1');
    options.$elementToFocus.focus();

    $(document).on(eventName, function(evt) {
      if (options.$container[0] !== evt.target && !options.$container.has(evt.target).length) {
        options.$container.focus();
      }
    });
  },

  /**
   * Removes the trap of focus in a particular container
   *
   * @param {object} options - Options to be used
   * @param {jQuery} options.$container - Container to trap focus within
   * @param {string} options.namespace - Namespace used for new focus event handler
   */
  removeTrapFocus: function(options) {
    var eventName = options.namespace
      ? 'focusin.' + options.namespace
      : 'focusin';

    if (options.$container && options.$container.length) {
      options.$container.removeAttr('tabindex');
    }

    $(document).off(eventName);
  }
};

/**
 * Cart Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Cart template.
 *
 * @namespace cart
 */

slate.cart = {
  
  /**
   * Browser cookies are required to use the cart. This function checks if
   * cookies are enabled in the browser.
   */
  cookiesEnabled: function() {
    var cookieEnabled = navigator.cookieEnabled;

    if (!cookieEnabled){
      document.cookie = 'testcookie';
      cookieEnabled = (document.cookie.indexOf('testcookie') !== -1);
    }
    return cookieEnabled;
  }
};

/**
 * Utility helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions for dealing with arrays and objects
 *
 * @namespace utils
 */

slate.utils = {

  /**
   * Return an object from an array of objects that matches the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  findInstance: function(array, key, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i][key] === value) {
        return array[i];
      }
    }
  },

  /**
   * Remove an object from an array of objects by matching the provided key and value
   *
   * @param {array} array - Array of objects
   * @param {string} key - Key to match the value against
   * @param {string} value - Value to get match of
   */
  removeInstance: function(array, key, value) {
    var i = array.length;
    while(i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        break;
      }
    }

    return array;
  },

  /**
   * _.compact from lodash
   * Remove empty/false items from array
   * Source: https://github.com/lodash/lodash/blob/master/compact.js
   *
   * @param {array} array
   */
  compact: function(array) {
    var index = -1;
    var length = array == null ? 0 : array.length;
    var resIndex = 0;
    var result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  },

  /**
   * _.defaultTo from lodash
   * Checks `value` to determine whether a default value should be returned in
   * its place. The `defaultValue` is returned if `value` is `NaN`, `null`,
   * or `undefined`.
   * Source: https://github.com/lodash/lodash/blob/master/defaultTo.js
   *
   * @param {*} value - Value to check
   * @param {*} defaultValue - Default value
   * @returns {*} - Returns the resolved value
   */
  defaultTo: function(value, defaultValue) {
    return (value == null || value !== value) ? defaultValue : value
  }
};

/**
 * Rich Text Editor
 * -----------------------------------------------------------------------------
 * Wrap videos in div to force responsive layout.
 *
 * @namespace rte
 */

slate.rte = {

  wrapTable: function() {
    $('.rte table').wrap('<div class="rte__table-wrapper"></div>');
  },

  iframeReset: function() {
    var $iframeVideo = $('.rte iframe[src*="youtube.com/embed"], .rte iframe[src*="player.vimeo"]');
    var $iframeReset = $iframeVideo.add('.rte iframe#admin_bar_iframe');

    $iframeVideo.each(function() {
      // Add wrapper to make video responsive
      $(this).wrap('<div class="rte__video-wrapper"></div>');
    });

    $iframeReset.each(function() {
      // Re-set the src attribute on each iframe after page load
      // for Chrome's "incorrect iFrame content on 'back'" bug.
      // https://code.google.com/p/chromium/issues/detail?id=395791
      // Need to specifically target video and admin bar
      this.src = this.src;
    });
  }
};

slate.Sections = function Sections() {
  this.constructors = {};
  this.instances = [];

  $(document)
    .on('shopify:section:load', this._onSectionLoad.bind(this))
    .on('shopify:section:unload', this._onSectionUnload.bind(this))
    .on('shopify:section:select', this._onSelect.bind(this))
    .on('shopify:section:deselect', this._onDeselect.bind(this))
    .on('shopify:section:reorder', this._onReorder.bind(this))
    .on('shopify:block:select', this._onBlockSelect.bind(this))
    .on('shopify:block:deselect', this._onBlockDeselect.bind(this));
};

slate.Sections.prototype = $.extend({}, slate.Sections.prototype, {
  _createInstance: function(container, constructor) {
    var $container = $(container);
    var id = $container.attr('data-section-id');
    var type = $container.attr('data-section-type');

    constructor = constructor || this.constructors[type];

    if (typeof constructor === 'undefined') {
      return;
    }

    var instance = $.extend(new constructor(container), {
      id: id,
      type: type,
      container: container
    });

    this.instances.push(instance);
  },

  _onSectionLoad: function(evt) {
    var container = $('[data-section-id]', evt.target)[0];
    if (container) {
      this._createInstance(container);
    }
  },

  _onSectionUnload: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (!instance) {
      return;
    }

    if (typeof instance.onUnload === 'function') {
      instance.onUnload(evt);
    }

    this.instances = slate.utils.removeInstance(this.instances, 'id', evt.detail.sectionId);
  },

  _onSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onSelect === 'function') {
      instance.onSelect(evt);
    }
  },

  _onDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onDeselect === 'function') {
      instance.onDeselect(evt);
    }
  },

  _onReorder: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onReorder === 'function') {
      instance.onReorder(evt);
    }
  },

  _onBlockSelect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockSelect === 'function') {
      instance.onBlockSelect(evt);
    }
  },

  _onBlockDeselect: function(evt) {
    var instance = slate.utils.findInstance(this.instances, 'id', evt.detail.sectionId);

    if (instance && typeof instance.onBlockDeselect === 'function') {
      instance.onBlockDeselect(evt);
    }
  },

  register: function(type, constructor) {
    this.constructors[type] = constructor;

    $('[data-section-type=' + type + ']').each(function(index, container) {
      this._createInstance(container, constructor);
    }.bind(this));
  }
});

/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */

slate.Currency = (function() {
  var moneyFormat = '${{amount}}';

  /**
   * Format money values based on your shop currency settings
   * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
   * or 3.00 dollars
   * @param  {String} format - shop money_format setting
   * @return {String} value - formatted value
   */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') {
      cents = cents.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || moneyFormat);

    function formatWithDelimiters(number, precision, thousands, decimal) {
      precision = slate.utils.defaultTo(precision, 2);
      thousands = slate.utils.defaultTo(thousands, ',');
      decimal = slate.utils.defaultTo(decimal, '.');

      if (isNaN(number) || number == null) {
        return 0;
      }

      number = (number / 100.0).toFixed(precision);

      var parts = number.split('.');
      var dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
      var centsAmount = parts[1] ? (decimal + parts[1]) : '';

      return dollarsAmount + centsAmount;
    }

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      case 'amount_no_decimals_with_space_separator':
        value = formatWithDelimiters(cents, 0, ' ');
        break;
    }

    return formatString.replace(placeholderRegex, value);
  }

  return {
    formatMoney: formatMoney
  };
})();

/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * A collection of functions that help with basic image operations.
 *
 */

slate.Image = (function() {

  /**
   * Preloads an image in memory and uses the browsers cache to store it until needed.
   *
   * @param {Array} images - A list of image urls
   * @param {String} size - A shopify image size attribute
   */

  function preload(images, size) {
    if (typeof images === 'string') {
      images = [images];
    }

    for (var i = 0; i < images.length; i++) {
      var image = images[i];
      this.loadImage(this.getSizedImageUrl(image, size));
    }
  }

  /**
   * Loads and caches an image in the browsers cache.
   * @param {string} path - An image url
   */
  function loadImage(path) {
    new Image().src = path;
  }

  /**
   * Find the Shopify image attribute size
   *
   * @param {string} src
   * @returns {null}
   */
  function imageSize(src) {
    var match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

    if (match) {
      return match[1];
    } else {
      return null;
    }
  }

  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */
  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + '_' + size + suffix);
    } else {
      return null;
    }
  }

  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
  }

  return {
    preload: preload,
    loadImage: loadImage,
    imageSize: imageSize,
    getSizedImageUrl: getSizedImageUrl,
    removeProtocol: removeProtocol
  };
})();

/**
 * Variant Selection scripts
 * ------------------------------------------------------------------------------
 *
 * Handles change events from the variant inputs in any `cart/add` forms that may
 * exist. Also updates the master select and triggers updates when the variants
 * price or image changes.
 *
 * @namespace variants
 */

slate.Variants = (function() {

  /**
   * Variant constructor
   *
   * @param {object} options - Settings from `product.js`
   */
  function Variants(options) {
    this.$container = options.$container;
    this.product = options.product;
    this.singleOptionSelector = options.singleOptionSelector;
    this.originalSelectorId = options.originalSelectorId;
    this.enableHistoryState = options.enableHistoryState;
    this.currentVariant = this._getVariantFromOptions();

    $(this.singleOptionSelector, this.$container).on('change', this._onSelectChange.bind(this));
  }

  Variants.prototype = $.extend({}, Variants.prototype, {

    /**
     * Get the currently selected options from add-to-cart form. Works with all
     * form input elements.
     *
     * @return {array} options - Values of currently selected variants
     */
    _getCurrentOptions: function() {
      var currentOptions = $.map($(this.singleOptionSelector, this.$container), function(element) {
        var $element = $(element);
        var type = $element.attr('type');
        var currentOption = {};

        if (type === 'radio' || type === 'checkbox') {
          if ($element[0].checked) {
            currentOption.value = $element.val();
            currentOption.index = $element.data('index');

            return currentOption;
          } else {
            return false;
          }
        } else {
          currentOption.value = $element.val();
          currentOption.index = $element.data('index');

          return currentOption;
        }
      });

      // remove any unchecked input values if using radio buttons or checkboxes
      currentOptions = slate.utils.compact(currentOptions);
      return currentOptions;
    },

    /**
     * Find variant based on selected values.
     *
     * @param  {array} selectedValues - Values of variant inputs
     * @return {object || undefined} found - Variant object from product.variants
     */
    _getVariantFromOptions: function() {
      var selectedValues = this._getCurrentOptions();
      var variants = this.product.variants;
      var found = false;

      variants.forEach(function(variant) {
        var satisfied = true;
        var options = variant.options;

        selectedValues.forEach(function(option) {
          if (satisfied) {
            satisfied = (option.value === variant[option.index]);
          }
        });

        if (satisfied) {
          found = variant;
        }
      });

      return found || null;
    },

    /**
     * Event handler for when a variant input changes.
     */
    _onSelectChange: function() {
      var variant = this._getVariantFromOptions();

      this.$container.trigger({
        type: 'variantChange',
        variant: variant
      });

      if (!variant) {
        return;
      }

      this._updateMasterSelect(variant);
      this._updateImages(variant);
      this._updatePrice(variant);
      this.currentVariant = variant;

      if (this.enableHistoryState) {
        this._updateHistoryState(variant);
      }
    },

    /**
     * Trigger event when variant image changes
     *
     * @param  {object} variant - Currently selected variant
     * @return {event}  variantImageChange
     */
    _updateImages: function(variant) {
      var variantImage = variant.featured_image || {};
      var currentVariantImage = this.currentVariant.featured_image || {};

      if (!variant.featured_image || variantImage.src === currentVariantImage.src) {
        return;
      }

      this.$container.trigger({
        type: 'variantImageChange',
        variant: variant
      });
    },

    /**
     * Trigger event when variant price changes.
     *
     * @param  {object} variant - Currently selected variant
     * @return {event} variantPriceChange
     */
    _updatePrice: function(variant) {
      if (variant.price === this.currentVariant.price && variant.compare_at_price === this.currentVariant.compare_at_price) {
        return;
      }

      this.$container.trigger({
        type: 'variantPriceChange',
        variant: variant
      });
    },

    /**
     * Update history state for product deeplinking
     *
     * @param  {variant} variant - Currently selected variant
     * @return {k}         [description]
     */
    _updateHistoryState: function(variant) {
      if (!history.replaceState || !variant) {
        return;
      }

      var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      window.history.replaceState({path: newurl}, '', newurl);
    },

    /**
     * Update hidden master select of variant change
     *
     * @param  {variant} variant - Currently selected variant
     */
    _updateMasterSelect: function(variant) {
      $(this.originalSelectorId, this.$container)[0].value = variant.id;
    }
  });

  return Variants;
})();


/*================ Theme Globals ================*/
/*
    Global functions var site-wide functionality
*/
Shopify.queryParams = {};
if (location.search.length) {
for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
  aKeyValue = aCouples[i].split('=');
  if (aKeyValue.length > 1) {
    Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
  }
}
}

$(document).ready(function () {
  window.setTimeout(function() {$("input[data-autofocus]").focus();},500);
  
  //Quick view expand Read More script
  $("body").on("click", "#read-more-qv", function(event) {
    event.preventDefault();
    $('#longContent').show();
    $('#shortContent').hide();
  });
});
/*
    Global functions var site-wide add to cart functionality
*/
function global_AddToCart(id, qty, props, callback)
{
    $.ajax({
      	type: "POST",
      	dataType: "json",
      	url: '/cart/add.js',
      	data:
      	{
            quantity: qty,
            id: id,
            properties: props
      	},
      	success: (typeof callback != "undefined") ? callback : global_ItemAddedToCart,
      	error: global_AddToCartError
    });
}

function global_AddToCartFromForm(form, callback)
{
    $.ajax({
      	type: "POST",
      	dataType: "json",
      	url: '/cart/add.js',
      	data: $(form).serialize(),
      	success: (typeof callback != "undefined") ? callback : global_ItemAddedToCart,
      	error: global_AddToCartError
    });
}

function global_ItemAddedToCart(item)
{
    $(".cart-added .added-variant-title").text(item.title);
    $(".cart-added").last().slideDown().delay(SHOP_SETTINGS.cart_ribbon_delay).slideUp();
    global_updateCart();
}

function global_AddToCartError(resp)
{
    swal("Sorry...", "We experienced an issue while adding this item to the cart. Please try again.", "error");
}

function global_AjaxError(resp)
{
    swal("Sorry...", "We experienced an issue while trying to complete that request. Please try again.", "error");
}

function global_updateCart()
{
    $.ajax({
      	type: "GET",
      	url: '/cart.js',
      	dataType: 'json',
      	success: function(cart) {
      	    $(".CartCount").text(cart.item_count);
      	}
    });
}
/*
    Global functions var site-wide product quick views
*/
$(document).ready(function () {
  
  $(document).on(
    'open.zf.reveal', '#product-quick-view[data-reveal]', function (event) {
      var sections = new slate.Sections();
      sections.register('product', theme.Product);
    }
  );
  
  $("body").on("click", ".product-quick-view", function(event) {
    event.preventDefault();
    var elem = $(this);
    
    var $qv = $('#product-quick-view');
    
    $(".qv-product","#product-quick-view").load('/products/' + $(elem).data('handle') + "?quickview=1&view=quick", function(resp) {
        $qv.foundation('open');
    });
    
    /*
    $.fancybox.open({
    	src  : '/products/' + $(elem).data('handle'),
    	type : 'ajax',
    	opts : {
    	  baseClass: "quick-view-modal",
    		afterLoad : function( instance, current ) {
    			var sections = new slate.Sections();
          sections.register('product', theme.Product);
    		},
    		ajax : {
          settings : {
            data : {
              quickview : true,
              view : "quick"
            }
          }
        }
    	}
    });*/
    
  });
  
});

/*================ Sections ================*/
/**
 * Collection Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Collection templates.
 *
   * @namespace collection
 */
 /* global $ */
 /* global theme */
 /* global slate */

theme.Collection = (function() {
  
  var selectors = {
    sortBy: '[data-sort-by]',
    sortByDefault: '[data-sort-by-default]'
  };

  /**
   * Collection section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Collection(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {};
    this.namespace = '.collection';
    this.init_sort_by();
    this.paging_lookahead_page = 1;
    this.paging_lookahead();
  }

  Collection.prototype = $.extend({}, Collection.prototype, {

    /**
     * Setup sort by select and the change callback
     */
    init_sort_by: function() {
      
      $(selectors.sortBy, this.$container)
       .val($(selectors.sortByDefault, this.$container).val())
       .bind('change', function() {
         Shopify.queryParams.sort_by = jQuery(this).val();
         location.search = jQuery.param(Shopify.queryParams);
       });
    },
    
    /* Function to inspect next page's content */
    paging_lookahead_chk: function() {
      
        var self = this;
        
        $.ajax({
        	type: "GET",
        	url: document.location.pathname,
        	data:
        	{
              page: ++this.paging_lookahead_page
        	},
        	success: function(resp)
        	{
        	  //endless loop prevention
        	  if(self.paging_lookahead_page == 50)
        	    return false;
        	  if(resp.indexOf("product-grid-item") >= 0)
        	    self.paging_lookahead();
        	  else
        	    self.paging_adjust(self.paging_lookahead_page-1);
        	}
      });
    },
    
    /* Function to click ahead to next page to see if products will be displayed */
    paging_lookahead: function() {
        this.paging_lookahead_chk();
    },
    
    /* Function to rewrite/show/hide paging based on lookaheads */
    paging_adjust: function(max_page)
    {
      if(max_page > 1 || (parseInt($("#paging-current").val()) > 1))
      {
        $(".paginate-control").removeClass('hide');
        
        //first handle "next"
        if(parseInt($("#paging-next").val()) > max_page)
          $(".pagination .next").addClass('hide');
        
        //now handle the individual pages
        $(".pagination .page a").each(function() {
          if(parseInt($(this).text()) > max_page)
            $(this).remove();
        });
      }
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
    
  });

  return Collection;
})();

/**
 * Product Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Product template.
 *
   * @namespace product
 */
 /* global $ */
 /* global theme */
 /* global slate */
 /* global global_ItemAddedToCart */
 /* global global_AddToCartError */

theme.Product = (function() {

  var selectors = {
    addToCart: '[data-add-to-cart]',
    addToCartText: '[data-add-to-cart-text]',
    comparePrice: '[data-compare-price]',
    comparePriceText: '[data-compare-text]',
    originalSelectorId: '[data-product-select]',
    priceWrapper: '[data-price-wrapper]',
    productFeaturedImage: '[data-product-featured-image]',
    productImageZoom: '[data-product-image-zoom]',
    productForm: '[data-product-form]',
    productJson: '[data-product-json]',
    productPrice: '[data-product-price]',
    productThumbs: '[data-product-single-thumbnail]',
    singleOptionSelector: '[data-single-option-selector]',
    relatedProducts: '[data-related-products]',
    relatedProductsInternal: '.related-products',
    relatedProductsPick: '[data-rp-pick]',
    productGridItem: ".product-grid-item"
  };
  
  /**
   * Product section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Product(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {};
    this.namespace = '.product';

    // Stop parsing if we don't have the product json script tag when loading
    // section in the Theme Editor
    if (!$(selectors.productJson, this.$container).html()) {
      return;
    }

    this.productSingleObject = JSON.parse($(selectors.productJson, this.$container).html());
    this.settings.imageSize = slate.Image.imageSize($(selectors.productFeaturedImage, this.$container).attr('src'));

    slate.Image.preload(this.productSingleObject.images, this.settings.imageSize);

    this.initVariants();
    this.initImages();
    this.initAddToCart();
    this.initRelatedProducts();
    this.resetZoom();
  }

  Product.prototype = $.extend({}, Product.prototype, {
    
    /**
     * Handles the application of product image zoom if enabled
     */
    resetZoom: function() {
      
      if($(selectors.productImageZoom, this.$container).length > 0)
      {
        $(selectors.productImageZoom, this.$container).trigger('zoom.destroy');
        $(selectors.productImageZoom, this.$container).zoom();
      }
      
    },
    
    /**
     * Handles the removal of any pre-existing zooms
     */
    removeZoom: function() {
      
      if($(selectors.productImageZoom, this.$container).length > 0)
        $(selectors.productImageZoom, this.$container).trigger('zoom.destroy');
      
    },

    /**
     * Handles change events for product images
     */
    initImages: function() {
      this.$container.on('click', selectors.productThumbs, this.productImageThumbSelect.bind(this));
    },
    
    /**
     * Apply ajax cart adding methods if needed
     */
     initAddToCart: function() {
       if(typeof $(selectors.addToCart, this.$container).data('ajax') != "undefined")
        this.$container.on('click', selectors.addToCart, this.addToCart.bind(this));
     },
    
    /**
     * Handles change events from the variant inputs
     */
    initVariants: function() {
      var options = {
        $container: this.$container,
        enableHistoryState: this.$container.data('enable-history-state') || false,
        singleOptionSelector: selectors.singleOptionSelector,
        originalSelectorId: selectors.originalSelectorId,
        product: this.productSingleObject
      };
      
      this.variants = new slate.Variants(options);

      this.$container.on('variantChange' + this.namespace, this.updateAddToCartState.bind(this));
      this.$container.on('variantImageChange' + this.namespace, this.updateProductImage.bind(this));
      this.$container.on('variantPriceChange' + this.namespace, this.updateProductPrices.bind(this));
      
      //remove any options that are not even possible
      var self = this;
      $("#SingleOptionSelector-1 option", this.$container).each(function()
      {
        if(self.productSingleObject.available_variants_option2 && self.productSingleObject.available_variants_option2.indexOf($(this).val()) == -1)
          $(this).remove();
      });
      
      //uncomment next line if you want to hide selectors with only one option
      //if($("#SingleOptionSelector-1 option", this.$container).length == 1) $("#option-column-1", this.$container).hide();
      
      $("#SingleOptionSelector-2 option", this.$container).each(function()
      {
        if(self.productSingleObject.available_variants_option3 && self.productSingleObject.available_variants_option3.indexOf($(this).val()) == -1)
          $(this).remove();
      });
      
      //uncomment next line if you want to hide selectors with only one option
      //if($("#SingleOptionSelector-2 option", this.$container).length == 1) $("#option-column-2", this.$container).hide();
      
      //hide unavailable variants
      this.hideUnavilableVariants($("#SingleOptionSelector-1", this.$container).val(), $("#SingleOptionSelector-2", this.$container).val(), true);
    },
    
    /*
    Special function for Zentangle to hide option3 options that are not available
    */
    hideUnavilableVariants: function(option2_value, option3_value, variant_valid) {
      
      if($("#SingleOptionSelector-2", this.$container).length == 0) return false;
      
      //pull out current option2 value
      var
        option1_value = $(selectors.originalSelectorId + " option:selected", this.$container).data("option1"),
        eval_options_array = [],
        self = this;
        
      //move option3 options into temporary holding area
      if($("#SingleOptionSelector-2-hold option", this.$container).length == 0)
        $("#SingleOptionSelector-2", this.$container).children().appendTo("#SingleOptionSelector-2-hold", this.$container);
      
      //now for each holding option, move back into main selector if it is available
      $("#SingleOptionSelector-2", this.$container).empty();
      $("#SingleOptionSelector-2-hold option", this.$container).each(function()
      {
        eval_options_array = [];
        eval_options_array.push(option1_value);
        eval_options_array.push(option2_value);
        eval_options_array.push($(this).val());
        if(self.productSingleObject.available_variant_option_strings.indexOf(eval_options_array.join('~~')) >= 0)
          $(this).clone().appendTo($("#SingleOptionSelector-2"));
      });
      
      if(typeof variant_valid === "undefined" || variant_valid == null)
      {
        if(typeof variant_valid === "undefined") return false;
        $("#SingleOptionSelector-2", this.$container).val($("#SingleOptionSelector-2 option:first", this.$container).val());
        $("#SingleOptionSelector-2", this.$container).trigger("change");
      }
      else
        $("#SingleOptionSelector-2", this.$container).val(option3_value);
      
    },
    
    /**
     * Handles any script related method for a product's related products section
     */
    initRelatedProducts: function() {
      
      if($(selectors.relatedProducts, this.$container).length > 0 && $(selectors.productGridItem, selectors.relatedProducts).length > 0)
      {
        var rpData = $(selectors.relatedProducts, this.$container).data(),
        rpKeys = Object.keys(rpData),method = rpData[rpKeys[0]];
        
        //randomly pick some of them for display?
        if($(selectors.relatedProductsPick, selectors.relatedProducts).length > 0)
          $(selectors.relatedProductsInternal + " > " + selectors.productGridItem).pick($(selectors.relatedProductsInternal, selectors.relatedProducts).data("pick"));
        
        //done, now display it
        $(selectors.relatedProducts, this.$container).show();
      }
    },
    
    /**
     * Event callback to handle the adding an item to the cart via ajax
     */
    addToCart: function(evt) {
      evt.preventDefault();
      var $btn = $(evt.currentTarget);
      
      //disable button and set its loading text
      $btn.attr('disabled','disabled').addClass('cart-loading').prop('disabled',true).attr('data-ready-text', $btn.html());
      if($btn.attr('data-loading-text')) $btn.html($btn.attr('data-loading-text'));
      
      //submit form data to cart
      global_AddToCartFromForm($(selectors.productForm, this.$container), this.itemAddedToCart);
    },
    
    /**
     * Event callback after an item has been successfully added to the cart
     */
      itemAddedToCart: function(item) {
        
        $(selectors.addToCart, this.$container).removeAttr('disabled').prop('disabled',false).removeClass("cart-loading").html($(selectors.addToCart, this.$container).attr('data-ready-text'));
        global_ItemAddedToCart(item);
     },
    
    /**
     * Event callback for clicking on product thumbnails
     */
     productImageThumbSelect: function(evt) {
       evt.preventDefault();
       this.removeZoom();
       $(selectors.productFeaturedImage, this.$container).attr('src', $(evt.currentTarget).attr('href'));
       window.setTimeout(this.resetZoom,250);
     },

    /**
     * Updates the DOM state of the add to cart button
     *
     * @param {boolean} enabeled - Decides whether cart is enabled or disabled
     * @param {string} text - Updates the text notification content of the cart
     */
    updateAddToCartState: function(evt) {
      
      var variant = evt.variant;
      this.hideUnavilableVariants($("#SingleOptionSelector-1", this.$container).val(), $("#SingleOptionSelector-2", this.$container).val(), variant);

      if (variant) {
        $(selectors.priceWrapper, this.$container).removeClass('hide');
        this.variantData(variant);
        window.setTimeout(this.resetZoom,250);
      } else {
        return;
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.unavailable);
        $(selectors.priceWrapper, this.$container).addClass('hide');
        return;
      }

      if (variant.available) {
        $(selectors.addToCart, this.$container).prop('disabled', false);
        $(selectors.addToCartText, this.$container).html(theme.strings.addToCart);
      } else {
        $(selectors.addToCart, this.$container).prop('disabled', true);
        $(selectors.addToCartText, this.$container).html(theme.strings.soldOut);
      }
      
    },
    
    /**
     * Updates the DOM with variant data based on variant data selectors
     */
     variantData: function(variant) {
       for(var key in variant)
        $("[data-variant-" + key + "]").text(variant[key]);
     },

    /**
     * Updates the DOM with specified prices
     *
     * @param {string} productPrice - The current price of the product
     * @param {string} comparePrice - The original price of the product
     */
    updateProductPrices: function(evt) {
      var variant = evt.variant;
      var $comparePrice = $(selectors.comparePrice, this.$container);
      var $compareEls = $comparePrice.add(selectors.comparePriceText, this.$container);

      $(selectors.productPrice, this.$container)
        .html(slate.Currency.formatMoney(variant.price, theme.moneyFormat));

      if (variant.compare_at_price > variant.price) {
        $comparePrice.html(slate.Currency.formatMoney(variant.compare_at_price, theme.moneyFormat));
        $compareEls.removeClass('hide');
      } else {
        $comparePrice.html('');
        $compareEls.addClass('hide');
      }
    },

    /**
     * Updates the DOM with the specified image URL
     *
     * @param {string} src - Image src URL
     */
    updateProductImage: function(evt) {
      var variant = evt.variant;
      var sizedImgUrl = slate.Image.getSizedImageUrl(variant.featured_image.src, this.settings.imageSize);

      $(selectors.productFeaturedImage, this.$container).attr('src', sizedImgUrl);
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Product;
})();

/**
 * Dyno Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Dyno templates.
 *
   * @namespace dyno
 */
 /* global $ */
 /* global theme */
 /* global slate */

theme.Dyno = (function() {

  /**
   * Dyno section constructor. Runs on page load as well as Theme Editor
   * `section:load` events.
   * @param {string} container - selector for the section container DOM element
   */
  function Dyno(container) {
    this.$container = $(container);
    var sectionId = this.$container.attr('data-section-id');

    this.settings = {};
    this.namespace = '.dyno';
    this.init_sliders();
  }

  Dyno.prototype = $.extend({}, Dyno.prototype, {

    /**
     * Run through section and initialize any sliders with properties based on data attributes
     */
    init_sliders: function() {
      this.$container.find(".dyno-slider").each(function() {
        $(this).slick({
          arrows: $(this).data("sliderArrows"),
          dots: $(this).data("sliderDots"),
          infinite: $(this).data("sliderInfinite"),
          slidesToShow: $(this).data("sliderSlidesToShow"),
          slidesToScroll: $(this).data("sliderSlidesToScroll")
        });
        
      });
    },

    /**
     * Event callback for Theme Editor `section:unload` event
     */
    onUnload: function() {
      this.$container.off(this.namespace);
    }
  });

  return Dyno;
})();


/*================ Templates ================*/
/**
 * Customer Addresses Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Customer Addresses
 * template.
 *
 * @namespace customerAddresses
 */

theme.customerAddresses = (function() {
  var $newAddressForm = $('#AddressNewForm');

  if (!$newAddressForm.length) {
    return;
  }

  // Initialize observers on address selectors, defined in shopify_common.js
  if (Shopify) {
    new Shopify.CountryProvinceSelector('AddressCountryNew', 'AddressProvinceNew', {
      hideElement: 'AddressProvinceContainerNew'
    });
  }

  // Initialize each edit form's country/province selector
  $('.address-country-option').each(function() {
    var formId = $(this).data('form-id');
    var countrySelector = 'AddressCountry_' + formId;
    var provinceSelector = 'AddressProvince_' + formId;
    var containerSelector = 'AddressProvinceContainer_' + formId;

    new Shopify.CountryProvinceSelector(countrySelector, provinceSelector, {
      hideElement: containerSelector
    });
  });

  // Toggle new/edit address forms
  $('.address-new-toggle').on('click', function() {
    $newAddressForm.toggleClass('hide');
  });

  $('.address-edit-toggle').on('click', function() {
    var formId = $(this).data('form-id');
    $('#EditAddress_' + formId).toggleClass('hide');
  });

  $('.address-delete').on('click', function() {
    var $el = $(this);
    var formId = $el.data('form-id');
    var confirmMessage = $el.data('confirm-message');
    if (confirm(confirmMessage || 'Are you sure you wish to delete this address?')) {
      Shopify.postLink('/account/addresses/' + formId, {parameters: {_method: 'delete'}});
    }
  });
})();

/**
 * Password Template Script
 * ------------------------------------------------------------------------------
 * A file that contains scripts highly couple code to the Password template.
 *
 * @namespace password
 */

theme.customerLogin = (function() {
  var config = {
    recoverPasswordForm: '#RecoverPassword',
    hideRecoverPasswordLink: '#HideRecoverPasswordLink'
  };

  if (!$(config.recoverPasswordForm).length) {
    return;
  }

  checkUrlHash();
  resetPasswordSuccess();

  $(config.recoverPasswordForm).on('click', onShowHidePasswordForm);
  $(config.hideRecoverPasswordLink).on('click', onShowHidePasswordForm);

  function onShowHidePasswordForm(evt) {
    evt.preventDefault();
    toggleRecoverPasswordForm();
  }

  function checkUrlHash() {
    var hash = window.location.hash;

    // Allow deep linking to recover password form
    if (hash === '#recover') {
      toggleRecoverPasswordForm();
    }
  }

  /**
   *  Show/Hide recover password form
   */
  function toggleRecoverPasswordForm() {
    $('#RecoverPasswordForm').toggleClass('hide');
    $('#CustomerLoginForm').toggleClass('hide');
  }

  /**
   *  Show reset password success message
   */
  function resetPasswordSuccess() {
    var $formState = $('.reset-password-success');

    // check if reset password form was successfully submited.
    if (!$formState.length) {
      return;
    }

    // show success message
    $('#ResetSuccess').removeClass('hide');
  }
})();


$(document).ready(function() {
  var sections = new slate.Sections();
  sections.register('collection', theme.Collection);
  sections.register('product', theme.Product);
  sections.register('dyno', theme.Dyno);

  // Common a11y fixes
  slate.a11y.pageLinkFocus($(window.location.hash));

  $('.in-page-link').on('click', function(evt) {
    slate.a11y.pageLinkFocus($(evt.currentTarget.hash));
  });

  // Wrap videos in div to force responsive layout.
  slate.rte.wrapTable();
  slate.rte.iframeReset();

  // Apply a specific class to the html element for browser support of cookies.
  if (slate.cart.cookiesEnabled()) {
    document.documentElement.className = document.documentElement.className.replace('supports-no-cookies', 'supports-cookies');
  }
  
  // Initializing Foundation 
  $(document).foundation();


// Search Bar
//GSMOD
$(function() {
  $('.search')
    .bind('click', function(event) {
      $(".search-field").toggleClass("expand-search");
      $(".search-field").focus();
    })
});



});
