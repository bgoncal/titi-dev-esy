/*jslint nomen:false, debug:true, evil:true, vars:false, browser:true, forin:true, undef:false, white:false */
/**
 * JotForm Form object
 */

/* eslint-disable */
var JotForm = {
    /**
     * JotForm domain
     * @var String
     */
    url: "//www.jotform.com/", // Will get the correct URL from this.getServerURL() method
    /**
     * JotForm request server location
     * @var String
     */
    server: "//www.jotform.com/server.php", // Will get the correct URL from this.getServerURL() method
    /**
     * All conditions defined on the form
     * @var Object
     */
    conditions: {},
    /**
     * All calculations defined on the form
     * @var Object
     */
    calculations: {},
    /**
     * Condition Values
     * @var Object
     */
    condValues: {},
    /**
     * Progress bar object above form
     * @var Object
     */
    progressBar: false,
    /**
     * All JotForm forms on the page
     * @var Array
     */
    forms: [],
    /**
     * Will this form be saved on page changes
     * @var Boolean
     */
    saveForm: false,
    /**
     * Array of extensions
     * @var Array
     */
    imageFiles: ["png", "jpg", "jpeg", "ico", "tiff", "bmp", "gif", "apng", "jp2", "jfif"],
    /**
     * array of autocomplete elements
     * @var Object
     */
    autoCompletes: {},
    /**
     * Array of default values associated with element IDs
     * @var Object
     */
    defaultValues: {},
    /**
     * Debug mode
     * @var Boolean
     */
    debug: false,
    /**
     * Check if the focused inputs must be highligted or not
     * @var Boolean
     */
    highlightInputs: true,
    /**
     * it will disable the automatic jump to top on form collapse
     * @var Boolean
     */
    noJump: false,
    /**
     * Indicates that form is still under initialization
     * @var Boolean
     */
    initializing: true,
    /**
     * Keeps the last focused input
     * @var Boolean
     */
    lastFocus: false,
    /**
     * Form's payment type, if any
     * @var String
     */
    payment: false,
    /**
     * Fields to preserve (or duplicate) prior to encryption
     * @var Array
     */
    fieldsToPreserve: [],
    /**
     * Status of multipage save
     * @var Boolean
     */
    saving: false,
    /**
     * Texts used in the form
     * @var Object
     */
    texts: {
        confirmEmail: 'E-mail does not match',
        pleaseWait: 'Please wait...',
        confirmClearForm: 'Are you sure you want to clear the form',
        lessThan: 'Your score should be less than or equal to',
        incompleteFields: 'There are incomplete required fields. Please complete them.',
        required: 'This field is required.',
        requireOne: 'At least one field required.',
        requireEveryRow: 'Every row is required.',
        requireEveryCell: 'Every cell is required.',
        email: 'Enter a valid e-mail address',
        alphabetic: 'This field can only contain letters',
        numeric: 'This field can only contain numeric values',
        alphanumeric: 'This field can only contain letters and numbers.',
        cyrillic: 'This field can only contain cyrillic characters',
        url: 'This field can only contain a valid URL',
        currency: 'This field can only contain currency values.',
        fillMask: 'Field value must fill mask.',
        uploadExtensions: 'You can only upload following files:',
        noUploadExtensions: 'File has no extension file type (e.g. .txt, .png, .jpeg)',
        uploadFilesize: 'File size cannot be bigger than:',
        uploadFilesizemin: 'File size cannot be smaller than:',
        gradingScoreError: 'Score total should only be less than or equal to',
        inputCarretErrorA: 'Input should not be less than the minimum value:',
        inputCarretErrorB: 'Input should not be greater than the maximum value:',
        maxDigitsError: 'The maximum digits allowed is',
        freeEmailError: 'Free email accounts are not allowed',
        minSelectionsError: 'The minimum required number of selections is ',
        maxSelectionsError: 'The maximum number of selections allowed is ',
        pastDatesDisallowed: 'Date must not be in the past.',
        dateLimited: 'This date is unavailable.',
        dateInvalid: 'This date is not valid. The date format is {format}',
        multipleFileUploads_typeError: '{file} has invalid extension. Only {extensions} are allowed.',
        multipleFileUploads_sizeError: '{file} is too large, maximum file size is {sizeLimit}.',
        multipleFileUploads_minSizeError: '{file} is too small, minimum file size is {minSizeLimit}.',
        multipleFileUploads_emptyError: '{file} is empty, please select files again without it.',
        multipleFileUploads_onLeave: 'The files are being uploaded, if you leave now the upload will be cancelled.',
        multipleFileUploads_fileLimitError: 'Only {fileLimit} file uploads allowed.',
        generalError: 'There are errors on the form. Please fix them before continuing.',
        generalPageError: 'There are errors on this page. Please fix them before continuing.',
        wordLimitError: 'Too many words. The limit is',
        wordMinLimitError: 'Too few words.  The minimum is',
        characterLimitError: 'Too many Characters.  The limit is',
        characterMinLimitError: 'Too few characters. The minimum is',
        ccInvalidNumber: 'Credit Card Number is invalid.',
        ccInvalidCVC: 'CVC number is invalid.',
        ccInvalidExpireDate: 'Expire date is invalid.',
        ccMissingDetails: 'Please fill up the credit card details.',
        ccMissingProduct: 'Please select at least one product.',
        ccMissingDonation: 'Please enter numeric values for donation amount.',
        disallowDecimals: 'Please enter a whole number.'
    },
    paymentTexts: {
        couponApply: 'Apply',
        couponChange: 'Change',
        couponEnter: 'Enter Coupon',
        couponExpired: 'Coupon is expired. Please try another one.',
        couponInvalid: 'Coupon is invalid. Please try another one.',
        couponValid: 'Coupon is valid.',
        couponBlank: 'Please enter a coupon.',
        shippingShipping: 'Shipping',
        totalTotal: 'Total',
        totalSubtotal: 'Subtotal',
        taxTax: 'Tax'
    },
    isEncrypted : false,

    encryptAll  : function(e, callback) {
        e.stop();

        var ignoredFields = [
            'control_captcha',
            'control_paypal',
            'control_stripe',
            'control_paypalexpress',
            'control_authnet',
            'control_paypalpro',
            'control_paymill',
            'control_braintree',
            'control_dwolla',
            'control_payment',
        ];

        var sendAsHiddenField = [
            "control_number",
            "control_spinner",
            "control_email",
            "control_dropdown",
            "control_datetime",
            "control_matrix",
            "control_birthdate",
            "control_time",
            "control_scale",
        ];

        // payment fields that will submit the form on their own
        var selfSubmitFields = [
            "control_stripe",
            "control_braintree",
        ];
        var submitFormAfterEncrypt = true;

        var alreadyEncrypted = [];

        var fieldsToPreserve = JotForm.fieldsToPreserve;

        $$('.form-textbox, .form-textarea, .form-radio, .form-checkbox, .form-dropdown, .form-number-input').each(function(field){

            // Really? Why? Are they assumed empty? - Alp
            //if(JotForm.isVisible(field)) {

                var fieldType = field.up('li').readAttribute('data-type');

                if (selfSubmitFields.indexOf(fieldType) > -1) {
                    submitFormAfterEncrypt = false;
                }

                if (ignoredFields.indexOf(fieldType) !== -1) {
                    return;
                }

                // no need to encrypt these
                if (fieldType == 'control_matrix' && ['checkbox', 'radio'].include(field.type)) {
                    return;
                }

                //prevent double encryption (especially of textareas)
                if (alreadyEncrypted.indexOf(field.name) !== -1 && !field.up().hasClassName('form-matrix-values')) {
                    return;
                }

                if (JotForm.paymentTotal > 0) {
                    fieldId = field.id.replace(/\w+_(\d+)(.+)?/, '$1');
                    if (fieldsToPreserve.indexOf(fieldId) > -1) {
                        // duplicate this field, its value is needed in original unencrypted format
                        var form = $$('.jotform-form')[0];
                        var name = field.name.replace(/(\w+)(\[\w+\])?/, "$1_unencrypted$2");
                        form.insert(new Element('input', {type: 'hidden', name: name }).putValue(field.value));
                    }
                }

                var encryptedAnswer = JotEncrypted.encrypt(field.value);
                //add to encrypted list
                alreadyEncrypted.push(field.name);

                //handle duplication of textareas, by forcefully encrypting the hidden previous sibling
                if (fieldType == "control_textarea") {
                    var allFields = $$('[name="'+field.name+'"]');
                    for (x=0; x < allFields.length ; x++) {
                        allFields[x].value = encryptedAnswer;
                    }
                    return;
                }

                // Send these fields in a hidden field
                if(sendAsHiddenField.indexOf(fieldType) !== -1){
                    var form = $$('.jotform-form')[0];
                    form.insert(new Element('input', {type: 'hidden', name: field.name}).putValue(encryptedAnswer));
                    if (fieldType == 'control_matrix') {
                        // remove name to avoid duplication
                        field.name = "";
                    }
                    return;
                }
                // unmask
                if (field.getAttribute('masked')) {
                    var maskValue = field.getAttribute('maskvalue');
                    JotForm.setQuestionMasking(field, '', maskValue, true);
                }
            
                field.value = encryptedAnswer;
            //}
        });

        callback(submitFormAfterEncrypt);
    },
    /**
     * Find the correct server url from forms action url, if there is no form use the defaults
     */
    getServerURL: function () {
        var form = $$('.jotform-form')[0];
        var action;

        if (form) {
            if ((action = form.readAttribute('action'))) {
                if (action.include('submit.php') || action.include('server.php')) {
                    var n = !action.include('server.php') ? "submit" : "server";
                    this.server = action.replace(n + '.php', 'server.php');
                    this.url = action.replace(n + '.php', '');
                } else {
                    var d = action.replace(/\/submit\/.*?$/, '/');
                    this.server = d + 'server.php';
                    this.url = d;
                }

            }
        }
    },
    /**
     * Changes only the given texsts
     * @param {Object} newTexts
     */
    alterTexts: function (newTexts, payment) {
        if (payment) {
            Object.extend(this.paymentTexts, newTexts || {});
            this.changePaymentStrings(newTexts);
        } else {
            Object.extend(this.texts, newTexts || {});
        }
    },
    /**
     * A short snippet for detecting versions of IE in JavaScript
     * without resorting to user-agent sniffing
     */
    ie: function () {
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');

        while (
            div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
                all[0]
            );

        return v > 4 ? v : undef;
    },
    /**
     * Creates the console arguments
     */
    createConsole: function () {
        var consoleFunc = ['log', 'info', 'warn', 'error'];
        $A(consoleFunc).each(function (c) {
            this[c] = function () {
                if (JotForm.debug) {
                    if ('console' in window) {
                        try {
                            console[c].apply(this, arguments);
                        } catch (e) {
                            if (typeof arguments[0] == "string") {
                                console.log(c.toUpperCase() + ": " + $A(arguments).join(', '));
                            } else {
                                if (Prototype.Browser.IE) {
                                    alert(c + ": " + arguments[0]);
                                } else {
                                    console[c](arguments[0]);
                                }
                            }
                        }
                    }
                }
            };
        }.bind(this));

        if (JotForm.debug) {
            JotForm.debugOptions = document.readJsonCookie('debug_options');
        }
    },
    /**
     * Initiates the form and all actions
     */
    init: function (callback) {
        var ready = function () {
            try {
                this.populateGet();

                if (document.get.debug == "1") {
                    this.debug = true;
                }
                this.createConsole();

                this.getServerURL();

                this.checkJSON();

                if (callback) {
                    callback();
                }

                if (window.location.href.indexOf("/edit/") !== -1) {
                   document.get.sid = window.location.href.split("/").last();
                   this.editMode();
               }

                //will load editMode script dynamically
                if ((document.get.mode == "edit" || document.get.mode == "inlineEdit" || document.get.mode == 'submissionToPDF') && document.get.sid) {
                    this.editMode();
                }

                this.noJump = ("nojump" in document.get);
                this.uniqueID = this.uniqid();
                this.handleSavedForm();
                this.setTitle();
                this.setHTMLClass();
                this.getDefaults();

                if(this.noJump) {
                    window.parent.postMessage("removeIframeOnloadAttr", '*');
                }

                if ($$('input[name="simple_fpc"]').length > 0) {
                    this.payment = $$('input[name="simple_fpc"]')[0].getAttribute('data-payment_type');
                }

                if (!!$$('.form-product-custom_price').length) {
                    this.handleSubscriptionPrice();
                }

                if (this.payment === "paypalpro") {
                    this.handlePaypalPro();
                    this.isFormEmbedded();
                }

                if (this.payment === "braintree") {
                    this.handleBraintree();
                }

                if (this.payment === "square") {
                    this.handleSquare();
                }

                if (this.payment === "authnet") {
                    this.handleAuthNet();
                }

                if (this.payment === "paypalexpress") {
                    this.handlePaypalExpress();
                    this.isFormEmbedded();
                }

                // If coupon button exists, load checkCoupon
                if ($('coupon-button')) {
                    this.handleCoupon();
                }

                if ($$('.paypal-button').length > 0 && $('use_paypal_button')) {
                    this.handlePaypalButtons();
                }

                this.handleFormCollapse();
                this.handlePages();

                if ($$('.form-product-has-subproducts').length > 0) {
                    this.handlePaymentSubProducts();
                }

                // If form is hosted in an iframe, calculate the iframe height
                if (window.parent && window.parent != window) {
                    this.handleIFrameHeight();
                    // this.removeCover();

                    // if there is a recaptcha
                    if (!!$$('li[data-type="control_captcha"]').length) {
                        // resize iframe upon loading of image
                        var captchaInterval = setInterval(function () {
                            if ($('recaptcha_challenge_image')) {
                                clearInterval(captchaInterval);
                                JotForm.handleIFrameHeight();
                            }
                        }, 500);
                    }
                }

                this.jumpToPage();

                this.highLightLines();
                this.setButtonActions();
                this.initGradingInputs();
                this.initSpinnerInputs();
                this.initNumberInputs();
                this.setConditionEvents();
                this.setCalculationEvents();
                this.runAllCalculations();
                this.setCalculationResultReadOnly();
                this.prePopulations();
                this.handleAutoCompletes();
                this.handleTextareaLimits();
                this.handleDateTimeChecks();
                this.handleOtherOptions(); // renamed from handleRadioButtons
                this.setFocusEvents();
                this.disableAcceptonChrome();
                this.handleScreenshot();
                // this.handleChinaCensorship();

                $A(document.forms).each(function (form) {
                    if (form.name == "form_" + form.id || form.name == "q_form_" + form.id) {
                        this.forms.push(form);
                    }
                }.bind(this));

                var hasCaptcha = $$('div[id^=recaptcha_input]').length;

                if (!hasCaptcha || $$('*[class*="validate"]').length > hasCaptcha) {
                    this.validator();
                }

                this.fixIESubmitURL();
                this.disableHTML5FormValidation();

                if ($('progressBar')) {
                    this.setupProgressBar();
                }

                // if there is a donation field
                if ($$('input[id*="_donation"]').length > 0) {
                    this.handleDonationAmount();
                }
                //disable submit if nosubmit=true on request parameters
                if (getQuerystring('nosubmit')) {
                    $$('.form-submit-button').each(function (b) {
                        b.disable();
                    });
                }
                //display all sections
                //used for pdf generation
                if (getQuerystring('displayAllSections')) {
                    var sections = $$('.form-section');
                    // First hide all the pages
                    sections.each(function (section) {
                        section.setStyle({display: 'block'});
                    });
                }

                // re-enable submit buttons upon browser back button on iOS devices
                // #725072

                if (!!navigator.userAgent.match(/iPhone|iPad/g)) {
                    window.onpageshow = function (e) {
                        if (e.persisted) {
                            JotForm.enableButtons();
                        }
                    }
                }

                var isPreview = getQuerystring('preview');
                isPreview = isPreview ? isPreview === 'true' : false;
                if (isPreview) {
                    this.handlePreview(getQuerystring('filled') === 'true');
                } else if(this.initializing) {
                    this.track();
                }

                // when a form is embedded via a 3rd party app
                this.additionalActionsFormEmbedded();

                // render JotForm ad
                if(JotForm.showJotFormLogo) {
                    var formAll = $$('.form-all')[0];
                    if(formAll) {
                        var _formID = $$('input[name="formID"]')[0].value;
                        var colorScheme = 'orange';
                        var primaryTextColor = '#f38632';
                        var secondaryTextColor = '#aaa';
                        var primaryImgSrc = '//cdn.jotfor.ms/img/jot-logo-orange.png?v3';
                        var primaryBgColor = '#fff';

                        if(colorScheme === 'white') {
                          primaryTextColor = '#fff';
                          secondaryTextColor = '#fff';
                          primaryImgSrc = '//cdn.jotfor.ms/img/jot-logo-white.png?v2';
                          primaryBgColor = '#f38632';
                        }

                        var bannerWrapper = document.createElement('div');
                        bannerWrapper.className = 'jotform-ad'
                        bannerWrapper.style.overflow = 'hidden';
                        bannerWrapper.style.borderTop = '1px solid #eee';
                        bannerWrapper.style.padding = '0 18px';
                        bannerWrapper.style.textDecoration = 'none';
                        bannerWrapper.style.fontFamily = '"Lucida Grande", "Lucida Sans", "Lucida Sans Unicode", sans-serif';
                        bannerWrapper.style.fontSize = '12px';
                        bannerWrapper.style.color = secondaryTextColor
                        bannerWrapper.style.background = primaryBgColor;

                        var bannerImgLink = document.createElement('a');
                        bannerImgLink.href = 'https://www.jotform.com/signup?utm_source=formfooter&utm_medium=banner&utm_term=' + _formID + '&utm_content=form_footer_banner&utm_campaign=form_footer_signup';
                        bannerImgLink.target = '_blank';
                        bannerImgLink.setText('Powered by');
                        bannerImgLink.style.lineHeight = '48px';
                        bannerImgLink.style.float = 'left';
                        bannerImgLink.style.textDecoration = 'none';

                        var bannerImg = document.createElement('img');
                        bannerImg.src = primaryImgSrc;
                        bannerImg.alt = 'JotForm';
                        bannerImg.style.height = '23px';
                        bannerImg.style.width = '100px';
                        bannerImg.style.marginLeft = '3px';
                        bannerImg.style.marginTop = '-1px';
                        bannerImg.style.display = 'inline-block';
                        bannerImg.style.verticalAlign = 'middle';
                        bannerImg.style.border = 'none';
                        bannerImgLink.appendChild(bannerImg);

                        bannerTextLink = document.createElement('a');
                        bannerTextLink.target = '_blank';
                        bannerTextLink.href = 'https://www.jotform.com/signup?utm_source=formfooter&utm_medium=banner&utm_term=' + _formID + '&utm_content=form_footer_text&utm_campaign=form_footer_signup';
                        bannerTextLink.style.float = 'right';
                        bannerTextLink.style.color = primaryTextColor;
                        bannerTextLink.style.lineHeight = '48px';
                        bannerTextLink.setText('Create your own form today!');

                        bannerWrapper.appendChild(bannerImgLink);
                        bannerWrapper.appendChild(bannerTextLink);
                        formAll.appendChild(bannerWrapper);
                    }
                }

                if(JotForm.showJotFormPowered) {
                    var button = document.querySelector('.form-submit-button');
                    if(button !== null) {
                        var _form = $$('.jotform-form')[0];
                        var _formID = _form.getAttribute('id');
                        var buttonWrapper = button.parentNode;
                        var banner = document.createElement('a');
                        banner.target = '_blank';
                        banner.href = 'https://www.jotform.com/signup?utm_source=powered_by_jotform&utm_medium=banner&utm_term=' + _formID + '&utm_content=powered_by_jotform_text&utm_campaign=powered_by_jotform_signup';
                        banner.setText('Powered by JotForm');
                        banner.style.display = 'inline-block';
                        banner.style.textDecoration = 'none';
                        var fontColor = '#000000';
                        var fontFamily = '';
                        var sampleLabel = document.querySelector('.form-label');
                        if(sampleLabel !== null) {
                            fontColor = getComputedStyle(document.querySelector('.form-label')).color;
                            fontFamily = getComputedStyle(document.querySelector('.form-label')).fontFamily;
                        }
                        banner.style.opacity = 0.8;
                        // banner.style.textShadow = '0 0 1px rgba(0,0,0,0.3)';
                        banner.style.webkitFontSmoothing = 'antialiased';
                        banner.style.color = fontColor;
                        banner.style.fontFamily  = fontFamily;
                        banner.style.fontSize = '11px';
                        banner.className = 'jf-branding';

                        var brEl = document.createElement('br');
                        buttonWrapper.appendChild(brEl);
                        buttonWrapper.appendChild(banner);

                        if(getComputedStyle(buttonWrapper).textAlign !== 'center') {
                          var linkDimensions = banner.getBoundingClientRect();
                          var buttonDimensions = button.getBoundingClientRect();
                          var mr = Math.abs((linkDimensions.width - buttonDimensions.width) / 2);
                          if(linkDimensions.width > buttonDimensions.width) {
                            banner.style.marginLeft = '-' + mr + 'px';
                          } else {
                            banner.style.marginLeft = mr + 'px';
                          }
                        }
                    }
                }
            } catch (err) {
                JotForm.error(err);
            }

            this.initializing = false; // Initialization is over
        }.bind(this);

        if (document.readyState == 'complete' || (this.jsForm && (document.readyState === undefined || document.readyState === 'interactive'))) {
            ready();
        } else {
            document.ready(ready);
        }
    },


    iframeRezizeTimeout: null,
    /**
    ** Call handleIFrameHeight only periodically so millions of messages are not sent when user has lots of conditions
    */
    iframeHeightCaller: function() {
        if (window.parent && window.parent != window) {
            clearTimeout(this.iframeRezizeTimeout);
            this.iframeRezizeTimeout = setTimeout((function() {
                this.handleIFrameHeight();
            }).bind(this), 50);
        }
    },


    handleIFrameHeight: function () {

        var form = $$('.jotform-form').length > 0 ? $$('.jotform-form')[0] : $$('body')[0];
        var height = Math.max(form.getHeight(), form.scrollHeight, form.offsetHeight);

        // if this is a captcha verification page, set height to 300
        height = ( document.title === 'Please Complete' ) ? 300 : height;

        if ("console" in window) {
            if ("log" in console) {
                console.log('Debug : setting height to ', height, ' from iframe');
            }
        }

        window.parent.postMessage('setHeight:' + height, '*');
    },
    removeCover: function () {
        $$('.form-cover-wrapper').each(function (el) {
            el.remove();
        });
        $$('.form-all').each(function (el) {
            el.removeClassName('top-cover').removeClassName('left-cover').removeClassName('right-cover');
        });
    },
    fixIESubmitURL: function () {
        try {
            // IE on XP does not support TLS SSL
            // http://en.wikipedia.org/wiki/Server_Name_Indication#Support
            if (this.ie() <= 8 && navigator.appVersion.indexOf('NT 5.')) {
                $A(this.forms).each(function (form) {
                    if (form.action.include("s://submit.")) {
                        form.action = form.action.replace(/\/\/submit\..*?\//, "//secure.jotform.com/");
                    }
                });
            }
        } catch (e) {
        }
    },
    screenshot: false, // Cached version of screenshot
    passive: false, // States if wishbox iis getting screenshot passively
    onprogress: false, // Are we currently processing a screenshot?
    compact: false, // Use the compact mode of the editor
    imageSaved: false, // Check if the image saved by screenshot editor
    /**
     * Find screenshot buttons and set events
     * HIDE or SHOW according to the environment
     */
    handleScreenshot: function () {
        var $this = this;
        setTimeout(function () {
            $$('.form-screen-button').each(function (button) {
                //$this.getContainer(button).hide();
                // If window parent has feedback then show screenshot
                if (window.parent && window.parent.JotformFeedbackManager) {
                    $this.getContainer(button).show();
                    button.observe('click', function () {
                        $this.passive = false;
                        try {
                            $this.takeScreenShot(button.id.replace('button_', ''));
                        } catch (e) {
                            console.error(e);
                        }
                    });
                    setTimeout(function () {
                        $this.passive = !window.parent.wishboxInstantLoad;
                        $this.takeScreenShot(button.id.replace('button_', ''));
                    }, 0);
                }
            });
        }, 300);
    },
    getCharset: function (doc) {
        if (!doc) {
            doc = document;
        }

        return doc.characterSet || doc.defaultCharset || doc.charset || 'UTF-8';
    },
    /**
     * Convert number of bytes into human readable format
     *
     * @param integer bytes     Number of bytes to convert
     * @param integer precision Number of digits after the decimal separator
     * @return string
     */
    bytesToSize: function (bytes, precision) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        var posttxt = 0;
        if (bytes == 0) return 'n/a';
        if (bytes < 1024) {
            return Number(bytes) + " " + sizes[posttxt];
        }
        while (bytes >= 1024) {
            posttxt++;
            bytes = bytes / 1024;
        }
        return bytes.toFixed(precision || 2) + " " + sizes[posttxt];
    },
    /*
     * Disables HTML5 validation for stopping browsers to stop submission process
     * (fixes bug of pending submissions when jotform validator accepts email field
     * and browsers' own validator doesn't )
     */
    disableHTML5FormValidation: function () {
        $$("form").each(function (f) {
            f.setAttribute("novalidate", true);
        });
    },
    /**
     * When button clicked take the screenshot and display it in the editor
     */
    takeScreenShot: function (id) {
        var p = window.parent;          // parent window
        var pleaseWait = '<div id="js_loading" ' +
            'style="position:fixed; z-index:10000000; text-align:center; ' +
            'background:#333; border-radius:5px; top: 20px; right: 20px; ' +
            'padding:10px; box-shadow:0 0 5 rgba(0,0,0,0.5);">' +
            '<img src="' + this.url + 'images/loader-black.gif" />' +
            '<div style="font-family:verdana; font-size:12px;color:#fff;">' +
            'Please Wait' +
            '</div></div>';

        if (this.onprogress) {
            p.$jot(pleaseWait).appendTo('body');
            return;
        }

        if (p.wishboxCompactLoad) {
            this.compact = true;
        }

        if (this.screenshot) {
            if (this.compact) {
                p.$jot('.jt-dimmer').hide();
            } else {
                p.$jot('.jt-dimmer, .jotform-feedback-link, .jt-feedback').hide();
            }

            p.jotformScreenshotURL = this.screenshot.data;
            this.injectEditor(this.screenshot.data, this.screenshot.shotURL);
            return;
        }

        this.scuniq = JotForm.uniqid(); // Unique ID to be used in the screenshot
        this.scID = id;               // Field if which we will place the screen shot in
        var f = JotForm.getForm($('button_' + this.scID));
        this.sformID = f.formID.value;
        this.onprogress = true;
        var $this = this;             // Cache the scope
        //this.wishboxServer = '//ec2-107-22-70-25.compute-1.amazonaws.com/wishbox-bot.php';
        this.wishboxServer = 'http://screenshots.jotform.com/wishbox-server.php'; //kemal: made this http since https not working anyway
        //this.wishboxServer = "//beta23.jotform.com/server.php";//JotForm.server;
        // Create a form element to make a hidden post. We need this to overcome xDomain Ajax restrictions
        var form = new Element('form', {
            action: this.wishboxServer,
            target: 'screen_frame',
            id: 'screen_form',
            method: 'post',
            "accept-charset": 'utf-8'
        }).hide();
        // Create a syntethic doctype for page source. This is the most common doctype so I choose this
        var doc = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" >';
        // Hide Jotform specific page element on the parent, so they do not appear on screenshot

        /*if(this.compact){
         p.$jot('.jt-dimmer').hide();
         }else{*/
        p.$jot('.jt-dimmer, .jotform-feedback-link, .jt-feedback').hide();
        //}

        p.$jot('.hide-on-screenshot, .hide-on-screenshot *').css({'visibility': 'hidden'});
        // Read the source of parent window
        var parentSource = p.document.getElementsByTagName('html')[0].innerHTML;
        parentSource = parentSource.replace(/(<noscript\b[^>]*>.*?<\/noscript>)+/gim, '');         // remove single line tags
        parentSource = parentSource.replace(/(<noscript\b[^>]*>(\s+.*\s+)+)+<\/noscript>/gim, ''); // remove multi line tags
        p.$jot('.hide-on-screenshot, .hide-on-screenshot *').css({'visibility': 'visible'});
        parentSource = parentSource.replace(/(\<\/head\>)/gim, "<style>body,html{ min-height: 800px; }</style>$1");
        var ie = $this.ie();
        // When it's the broken IE use a totally different aproach but IE9 works correctly so skip it
        if (ie !== undefined && ie < 9) {
            parentSource = parentSource.replace(/(\<\/head\>)/gim, "<style>*{ border-radius:0 !important; text-shadow:none !important; box-shadow:none !important; }</style>$1");
        }

        if (this.passive) {
            p.$jot('.jt-dimmer, .jotform-feedback-link, .jt-feedback').show();
        } else {
            p.$jot('.jotform-feedback-link').show();
            p.$jot(pleaseWait).appendTo('body');
        }

        // create form elements and place the values respectively
        var html = new Element('textarea', {name: 'html'});

        var nozip = this.getCharset(p.document).toLowerCase() !== 'utf-8';

        if (nozip) {
            html.value = encodeURIComponent(doc + parentSource + "</html>");
            form.insert(new Element('input', {type: 'hidden', name: 'nozip'}).putValue("1"));
        } else {
            form.insert(new Element('input', {type: 'hidden', name: 'nozip'}).putValue("0"));
            html.value = encodeURIComponent(p.$jot.jSEND((doc + parentSource + "</html>")));
        }
        var charset = new Element('input', {type: 'hidden', name: 'charset'}).putValue(this.getCharset(p.document));
        var height = new Element('input', {type: 'hidden', name: 'height'}).putValue(parseFloat(p.$jot(p).height()));
        var scrollTop = new Element('input', {type: 'hidden', name: 'scrollTop'}).putValue(p.$jot(p).scrollTop());
        var url = new Element('input', {type: 'hidden', name: 'url'}).putValue(p.location.href);
        var uid = new Element('input', {type: 'hidden', name: 'uniqID'}).putValue(this.scuniq);
        var fid = new Element('input', {type: 'hidden', name: 'formID'}).putValue(this.sformID);
        var action = new Element('input', {type: 'hidden', name: 'action'}).putValue("getScreenshot");
        // This is the iframe that we will submit the form into
        var iframe = new Element('iframe', {name: 'screen_frame', id: 'screen_frame_id'}).hide();
        // When iframe is loaded it usually means screenshot is completed but we still need to make sure.
        iframe.observe('load', function () {
            // Let's check server if screenshot correctly created there
            $this.checkScreenShot();
        });

        if (p.wishboxInstantLoad && (ie === undefined || ie > 8)) {
            this.injectEditor(false, false);
        }

        // Insert all created elements on the page and directly submit the form
        form.insert(html).insert(height).insert(scrollTop).insert(action).insert(uid).insert(url).insert(fid).insert(charset);
        $(document.body).insert(form).insert(iframe);
        form.submit();
    },
    /**
     * Checks if JSON is available and loads it if not
     */
    checkJSON: function () {
        if (typeof JSON !== 'object') {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = "/js/vendor/json2.js";
            $(document.body).appendChild(script);
        }
    },
    /**
     * Send a request to server and asks if given screenshot is created
     */
    checkScreenShot: function () {
        var $this = this;
        var p = window.parent;
        var count = 10; // will try 10 times after that it will fail

        p.$jot.getJSON('http://screenshots.jotform.com/queue/' + this.scuniq + '?callback=?',
            function (data) {
                if (data.success === true) {
                    p.$jot.getJSON(data.dataURL + '?callback=?', function (res) {
                        if ($this.passive === false) {
                            p.jotformScreenshotURL = res.data;
                            $this.injectEditor(res.data, res.shotURL); // If screenshot is created inject the editor on the page
                        }
                        $this.screenshot = res;
                        $this.onprogress = false;
                        // Remove the form and iframe since we don't need them anymore
                        $('screen_form') && $('screen_form').remove();
                        $('screen_frame_id') && $('screen_frame_id').remove();
                    });
                } else {
                    if ((data.status == 'waiting' || data.status == 'working') && --count) {
                        setTimeout(function () {
                            $this.checkScreenShot(); // If not try again. {TODO: We need to limit this check}
                        }, 1000);
                    } else {
                        alert('We are under heavy load right now. Please try again later.');
                        p.$jot('.jt-dimmer, .jotform-feedback-link').show();
                        p.$jot('.jt-feedback').show('slow');
                    }
                }
            }
        );
    },
    /**
     * Injects the screenshot editor on the page and sets necessery functions for editor to use
     */
    injectEditor: function (data, url) {

        if (this.injected) {
            return;
        }

        this.injected = true;
        var $this = this;
        var p = window.parent;
        p.$jot('#js_loading').remove();

        // Ask for editor template code
        p.$jot.getJSON(this.server + '?callback=?', {
                action: 'getScreenEditorTemplate',
                compact: this.compact
            },
            function (res) {
                var iff = '<iframe allowtransparency="true" id="wishbox-frame" src="" ' +
                    'frameborder="0" style="display:none;border:none; ';
                if (!$this.compact) {
                    iff += 'position:fixed;top:0;width:100%;height:100%;left:0;z-index:100000000;';
                } else {
                    iff += ('position:absolute;left:0;top:10px;height:' + (p.$jot(p).height() - 120) + 'px;width:' + ((p.$jot(p).width() - 100) - p.$jot('#js-form-content').width()) + 'px;');
                }
                iff += '" scrolling="no"></iframe>';
                var editorFrame;

                p.iframeWidth = ((p.$jot(p).width() - 100) - p.$jot('#js-form-content').width());
                p.iframeHeight = (p.$jot(p).height() - 120);

                // create an empty iframe on the page, we will then write the contents of this iframe manually
                if ($this.compact) {
                    editorFrame = p.$jot(iff).insertBefore('#js-form-content');
                } else {
                    editorFrame = p.$jot(iff).appendTo('body');
                }

                if ($this.compact) {
                    p.$jot('#js-form-content').css({  // when compact
                        'float': 'right'
                    });
                }
                var ie = $this.ie();

                // When it's the broken IE use a totally different aproach but IE9 works correctly so skip it
                if (ie !== undefined && ie < 9) {
                    // Set src for iframe inseat of writing the editor template in it.
                    editorFrame.attr('src', 'http://screenshots.jotform.com/opt/templates/screen_editor.html?shot=' + url + '&uniq=' + $this.scuniq);
                    // Put a close button outside of the iframe
                    var b = p.$jot('<button style="color:#fff;font-size:14px;background:#F59202;border:1px solid #Fa98a2;font-weight:bold;position:fixed;top:5px;right:40px;width:100px;z-index:100000001;">Close Editor</button>').appendTo('body');
                    // When close button clicked go fetch the saved image, if image is not saved then ask user are they sure?
                    b.click(function () {

                        p.$jot.getJSON('http://screenshots.jotform.com/wishbox-server.php?callback=?', {
                            action: 'getImage',
                            uniqID: $this.scuniq
                        }, function (res) {
                            if (!res.success) {
                                if (confirm('You haven\'t save your edits. Are you sure you want to close the editor?')) {
                                    closeFrame();
                                    b.remove();
                                }
                            } else {
                                closeFrame();
                                b.remove();

                                putImageOnForm(res.data, res.shotURL);
                            }
                        });
                    });
                } else {
                    // Write retrieved editor template into newly created iframe
                    var e = editorFrame[0];
                    var frameDocument = (e.contentWindow) ? e.contentWindow : (e.contentDocument.document) ? e.contentDocument.document : e.contentDocument;
                    frameDocument.document.open();
                    frameDocument.document.write(res.template);
                    setTimeout(function () {
                        frameDocument.document.close();
                    }, 200);

                    // Cache the screenshot URL on parent window so editor can find it
                    p.jotformScreenshotURL = data;
                }

                // Closes the frame and removes all trace behind it
                var closeFrame = function () {
                    if ($this.compact) {
                        editorFrame.remove();
                        p.$jot('#js-form-content').css('width', '100%');
//                        p.$jot('.jt-content, .jt-title').css('width', 'auto');
                    } else {
                        editorFrame.hide('slow', function () {
                            editorFrame.remove();
                        });
                    }
                    $this.injected = false;
                    p.$jot('.jt-dimmer, .jotform-feedback-link').show();
                    p.$jot('.jt-feedback').show('slow');
                };

                // When image saved. Places it on the form
                var putImageOnForm = function (image, url) {
                    // if(!$this.compact){
                    $('screen_' + $this.scID).update('<img width="100%" align="center" src="' + (url ? url : image) + '" />');
                    $('data_' + $this.scID).value = image;
                    $('screen_' + $this.scID).up().show();
                    // }
                };

                // Cancel  and close the editor
                p.JotformCancelEditor = function () {
                    closeFrame();
                };

                // When editing completed retrive the edited screenshot code and place it on the form
                p.JotformFinishEditing = function (image) {
                    closeFrame();
                    putImageOnForm(image);
                    $this.imageSaved = true;
                    if ($this.compact) {
                        setTimeout(function () {
                            $(document).fire('image:loaded');
                        }, 100);
                    }
                };
            }
        );
    },

    /**
     * Will get additional URL queries from SCRIPT embed or feedback widget
     */
    populateGet: function () {
        try {
            if ('FrameBuilder' in window.parent && "get" in window.parent.FrameBuilder && window.parent.FrameBuilder.get != []) {

                var outVals = {};
                var getVals = window.parent.FrameBuilder.get;
                $H(getVals).each(function (pair) {
                    if (typeof pair[1] === 'object') {
                        for (prop in pair[1]) {
                            outVals[pair[0] + "[" + prop + "]"] = pair[1][prop];
                        }
                    } else {
                        outVals[pair[0]] = pair[1];
                    }


                });
                document.get = Object.extend(document.get, outVals);
            }
        } catch (e) {
        }
    },
    /**
     * Php.js uniqueID generator
     * @param {Object} prefix
     * @param {Object} more_entropy
     */
    uniqid: function (prefix, more_entropy) {
        if (typeof prefix == 'undefined') {
            prefix = "";
        }
        var retId;
        var formatSeed = function (seed, reqWidth) {
            seed = parseInt(seed, 10).toString(16); // to hex str
            if (reqWidth < seed.length) {
                return seed.slice(seed.length - reqWidth);
            }
            if (reqWidth > seed.length) {
                return Array(1 + (reqWidth - seed.length)).join('0') + seed;
            }
            return seed;
        };
        if (!this.php_js) {
            this.php_js = {};
        }
        if (!this.php_js.uniqidSeed) {
            this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
        }
        this.php_js.uniqidSeed++;
        retId = prefix;
        retId += formatSeed(parseInt(new Date().getTime() / 1000, 10), 8);
        retId += formatSeed(this.php_js.uniqidSeed, 5);
        if (more_entropy) {
            retId += (Math.random() * 10).toFixed(8).toString();
        }
        return retId;
    },

    /**
     * Initiates multiple upload scripts
     */
    initMultipleUploads: function () {
        var self = this;

        $$('.form-upload-multiple').each(function (file) {
            var parent = file.up('div');
            var f = JotForm.getForm(file);
            var formID = f.formID.value;
            var uniq = formID + "_" + JotForm.uniqueID;

            // Handle default validations. reuired field
            var className = file.className;
            if (className.include("validate[required]")) {
                if (parent.className.indexOf("validate[required]") === -1) {
                    parent.addClassName("validate[required]");
                }
                parent.validateInput = function () {
                    // Don't fire validations for hidden elements
                    if (!JotForm.isVisible(parent)) {
                        JotForm.corrected(parent);
                        return true;
                    }
                    if (parent.select('.qq-upload-list li').length < 1) {
                        JotForm.errored(parent, JotForm.texts.required);
                        return false;
                    } else {
                        JotForm.corrected(parent);
                        return true;
                    }
                };
            }

            // Create temp upload folder key
            var hidden = new Element('input', {type: 'hidden', name: 'temp_upload_folder'}).setValue(uniq);
            f.insert({top: hidden});

            // Handle limited extensions
            var exts = (file.readAttribute('file-accept') || "").strip();
            exts = (exts !== '*') ? exts.split(', ') : [];

            // Handle sublabels
            var n, subLabel = "";
            if ((n = file.next()) && n.hasClassName('form-sub-label')) {
                subLabel = n.innerHTML;
            }

            //Emre: to make editing "text of multifile upload button" possible (33318)
            var m, buttonText;
            if (m = file.previous('.qq-uploader-buttonText-value')) {
                buttonText = m.innerHTML;
            }
            if (!buttonText) {
                buttonText = "Upload a File";
            }
            ;

            // Hasan
            // Get button style class
            var classNames = file.className.split(' '),
                buttonStyle = '';
            $A(classNames).each(function (className) {
                if (className.indexOf('form-submit-button-') === 0) {
                    buttonStyle = className;
                }
            });

            // Initiate ajax uploader
            var uploader = new qq.FileUploader({
                debug: JotForm.debug,
                element: parent,
                action: JotForm.server,
                subLabel: subLabel,
                buttonText: buttonText,
                buttonStyle: buttonStyle,
                fileLimit: file.readAttribute('file-limit'),
                sizeLimit: parseInt(file.readAttribute('file-maxsize'), 10) * 1024, // Set file size limit
                minSizeLimit: parseInt(file.readAttribute('file-minsize'), 10) * 1024,
                allowedExtensions: exts,
                messages: {
                    typeError: self.texts.multipleFileUploads_typeError,
                    sizeError: self.texts.multipleFileUploads_sizeError,
                    minSizeError: self.texts.multipleFileUploads_minSizeError,
                    emptyError: self.texts.multipleFileUploads_emptyError,
                    onLeave: self.texts.multipleFileUploads_onLeave,
                    fileLimitError: self.texts.multipleFileUploads_fileLimitError
                },
                onComplete: function (id, aa, result) {
                    if (result.success) {
                        // This is needed for validations.
                        // removes reuired message
                        parent.value = "uploaded";
                        JotForm.corrected(parent);
                    }
                },
                showMessage: function (message) {
                    // Display errors in JotForm's way
                    JotForm.errored(parent, message);
                    setTimeout(function () {
                        // JotForm.corrected(parent);
                    }, 3000);
                },
                params: {
                    action: 'multipleUpload',
                    field: file.name.replace('[]', ''),
                    origin: window.location.origin,
                    folder: uniq
                }
            });
        });
    },

    /**
     * Hiddenly submits the form on backend
     */
    hiddenSubmit: function (frm) {
        if (JotForm.currentSection) {
            JotForm.currentSection.select('.form-pagebreak')[0].insert(
                new Element('div', {className: 'form-saving-indicator'})
                    .setStyle('float:right;padding:21px 12px 10px')
                    .update('<img src="' + JotForm.url + 'images/ajax-loader.gif" align="absmiddle" /> Saving...')
            );
        }

        /**
         * Wait just a little to set saving status.
         * We need this because of the back button hack for last page.
         * Last page back button has two click events they both should work
         * but saving status prevents second one to be working
         */
        setTimeout(function () {
            JotForm.saving = true;
        }, 10);

        if (!$('hidden_submit_form')) {
            var iframe = new Element('iframe', {name: 'hidden_submit', id: 'hidden_submit_form'}).hide();
            iframe.observe('load', function () {
                JotForm.makeUploadChecks();
                $$('.form-saving-indicator').invoke('remove');
                JotForm.saving = false;
            });
            $(document.body).insert(iframe);
        }

        $$('.form-radio-other,.form-checkbox-other').each(function (el) { //disable other textbox if not "other" option selected
            if (!el.checked && el.next()) {
                el.next().disable();
            }
        });
        $$('.custom-hint-group').each(function (elem) { //remove textarea hints
            elem.hideCustomPlaceHolder();
        });
        $('current_page').value = JotForm.currentSection.pagesIndex;
        frm.writeAttribute('target', 'hidden_submit');
        frm.insert({
            top: new Element('input', {
                type: 'hidden',
                name: 'hidden_submission',
                id: 'hidden_submission'
            }).putValue("1")
        });

        frm.submit();
        frm.writeAttribute('target', '');
        $('hidden_submission').remove();

        $$('.custom-hint-group').each(function (elem) { //reapply textarea hints
            elem.showCustomPlaceHolder();
        });

        $$('.form-radio-other,.form-checkbox-other').each(function (el) { //reenable other textbox if not "other" option selected
            if (!el.checked && el.next()) {
                el.next().enable();
            }
        });
    },
    /**
     * Checks the upload fields after hidden submission
     * If they are completed, then makes them empty to prevent
     * Multiple upload of the same file
     */
    makeUploadChecks: function () {
        var formIDField = $$('input[name="formID"]')[0];
        var a = new Ajax.Jsonp(JotForm.url + 'server.php', {
            parameters: {
                action: 'getSavedUploadResults',
                formID: formIDField.value,
                sessionID: document.get.session
            },
            evalJSON: 'force',
            onComplete: function (t) {
                var res = t.responseJSON;
                if (res.success) {
                    if (res.submissionID && !$('submission_id')) {
                        formIDField.insert({
                            after: new Element('input', {
                                type: 'hidden',
                                name: 'submission_id',
                                id: 'submission_id'
                            }).putValue(res.submissionID)
                        });
                    }
                    JotForm.editMode(res, true); // Don't reset fields
                }
            }
        });
    },
    /**
     * Handles the form being saved stuation
     */
    handleSavedForm: function () {

        if (!('session' in document.get) || !(document.get.session.length > 0)) {
            return;
        }
        JotForm.saveForm = true;

        var formIDField = $$('input[name="formID"]')[0];

        formIDField.insert({
            after: new Element('input', {
                type: 'hidden',
                name: 'session_id',
                id: "session"
            }).putValue(document.get.session)
        });

        formIDField.insert({
            after: new Element('input', {
                type: 'hidden',
                id: 'current_page',
                name: 'current_page'
            }).putValue(0)
        });

        var a = new Ajax.Jsonp(JotForm.url + 'server.php', {
            parameters: {
                action: 'getSavedSubmissionResults',
                formID: formIDField.value,
                sessionID: document.get.session,
                URLparams: window.location.href
            },
            evalJSON: 'force',
            onComplete: function (t) {
                var res = t.responseJSON;
                if (res.success) {
                    if (res.submissionID) {
                        formIDField.insert({
                            after: new Element('input', {
                                type: 'hidden',
                                name: 'submission_id',
                                id: 'submission_id'
                            }).putValue(res.submissionID)
                        });

                        try {
                            JotForm.editMode(res);
                        } catch (e) {
                            console.error(e);
                        }
                        JotForm.openInitially = res.currentPage - 1;
                    }

                }
            }
        });
    },
    /**
     * Place the form title on pages title to remove the Form text on there
     */
    setTitle: function () {
        // Do this only when page title is form. otherwise it can overwrite the users own title
        if (document.title == "Form") {
            var head;
            if ((head = $$('.form-header')[0])) {
                try {
                    document.title = head.innerHTML.stripTags().strip();
                    document.title = document.title.unescapeHTML();
                } catch (e) {
                    document.title = head.innerHTML;
                }
            }
        }
    },
    /*
     * Add browser class to html element.
     */
    setHTMLClass: function () {
        // only ie for now
        var ie = this.ie();
        if (ie) {
            $$('html')[0].addClassName('ie-' + ie);
        }
    },
    /**
     * Sets the last focus event to keep latest focused element
     */
    setFocusEvents: function () {
        $$('.form-radio, .form-checkbox').each(function (input) { //Neil: use mousedown event for radio & checkbox (Webkit bug:181934)
            input.observe('mousedown', function () {
                JotForm.lastFocus = input;
            })
        });
        $$('.form-textbox, .form-password, .form-textarea, .form-upload, .form-dropdown').each(function (input) {
            input.observe('focus', function () {
                JotForm.lastFocus = input;
            });
        });
    },
    /**
     * Disables Accept for Google Chrome browsers
     */
    disableAcceptonChrome: function () {
        if (!Prototype.Browser.WebKit) {
            return;
        }
        $$('.form-upload').each(function (input) {
            if (input.hasAttribute('accept')) {
                var r = input.readAttribute('accept');
                input.writeAttribute('accept', '');
                input.writeAttribute('file-accept', r);
            }
        });
    },

    /**
     * Populate hidden field with user's browser info
     */
    populateBrowserInfo: function (id) {
        var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';
        var vendor = 'navigator' in window && 'vendor' in navigator && navigator.vendor.toLowerCase() || '';
        var appVersion = 'navigator' in window && 'appVersion' in navigator && navigator.appVersion.toLowerCase() || '';
        var is = {
            chrome: function(){return /chrome|chromium/i.test(userAgent) && /google inc/.test(vendor)},
            firefox: function(){return /firefox/i.test(userAgent)},
            ie: function(){return /msie/i.test(userAgent) || "ActiveXObject" in window || /edge\//i.test(userAgent)},
            safari: function(){return /safari/i.test(userAgent) && /apple computer/i.test(vendor)},
            operabrowser: function(){return userAgent.indexOf("Opera") > -1},
            iphone: function(){return /iphone/i.test(userAgent) || /iphone/i.test(appVersion)},
            ipad: function(){return /ipad/i.test(userAgent) || /ipad/i.test(appVersion)},
            ios: function(){return is.iphone() || is.ipad()},
            android: function(){return /android/i.test(userAgent)},
            androidPhone: function(){return is.android() && /mobile/i.test(userAgent)},
            androidTablet: function(){return is.android() && !is.androidPhone()},
            blackberry: function(){return /blackberry/i.test(userAgent) || /BB10/i.test(userAgent)},
            linux: function(){return /linux/i.test(appVersion)},
            mac: function(){return /mac/i.test(appVersion)},
            windows: function(){return /win/i.test(appVersion)},
            windowsPhone: function(){return is.windows() && /phone/i.test(userAgent)},
            windowsTablet: function(){return is.windows() && !is.windowsPhone() && /touch/i.test(userAgent)},
            mobile: function(){return is.iphone() || is.androidPhone() || is.blackberry() || is.windowsPhone();},
            tablet: function(){return is.ipad() || is.androidTablet() || is.windowsTablet()},
            desktop: function(){return !is.mobile() && !is.tablet()}
        };

        function OS() {
            if (is.android()) return "Android";
            else if (is.windows()) return "Windows";
            else if (is.blackberry()) return "Blackberry";
            else if (is.linux()) return "Linux";
            else if (is.ios()) return "iOS";
            else if (is.mac() && !is.ios()) return "MacOS";
            return "Unknown OS";
        }

        function device() {
            if (is.mobile()) {
                // separate ios detection because the new windows phone user agent now includes ios
                // http://www.neowin.net/news/ie11-fakes-user-agent-to-fool-gmail-in-windows-phone-81-gdr1-update
                if (is.windowsPhone() || is.androidPhone() || is.blackberry()) return "Mobile";
                else if (is.ios()) return "iPhone";
            }
            else if (is.tablet()) {
                // same above
                if (is.windowsTablet() || is.androidTablet()) return "Tablet";
                else if (is.ios()) return "iPad";
            }
            else if (is.desktop()) return "Desktop";
            return "Unknown Device";
        }

        function browser() {
            if (is.ie()) return "Internet Explorer";
            else if (is.firefox()) return "Firefox";
            else if (is.chrome()) return "Chrome";
            else if (is.safari()) return "Safari";
            else if (is.operabrowser()) return "Opera";
            return "Unknown Browser";
        }

        var offset = new Date().getTimezoneOffset();
        var sign = (offset < 0) ? "+" : "";
        var timeZone = 'GMT ' + sign + -(offset / 60);
        var lang = navigator.language || navigator.browserLanguage || navigator.userLanguage;
        var val = [
            'BROWSER: ' + browser(),
            'OS: ' + OS(),
            'DEVICE: ' + device(),
            'LANGUAGE: ' + lang,
            'RESOLUTION: ' + screen.width + "*" + screen.height,
            'TIMEZONE: ' + timeZone,
            'USER AGENT: ' + navigator.userAgent
        ].join('\n');

        setTimeout(function(){
            if ($(id).getValue().length > 0) {
                val = [$(id).getValue(), val].join('\n');
            }
            $(id).setValue(val);
        }, 20);
    },

    /**
     * Show Difference Between time ranges
     */
    displayTimeRangeDuration: function (id) {
        var displayDuration = function () {
            if ($('input_' + id + '_hourSelectRange')) {
                var sHour = $('input_' + id + '_hourSelect').value;
                var sMin = $('input_' + id + '_minuteSelect').value;
                var sAMPM = $('input_' + id + '_ampm') ? $('input_' + id + '_ampm').value : 'no';
                var eHour = $('input_' + id + '_hourSelectRange').value;
                var eMin = $('input_' + id + '_minuteSelectRange').value;
                var eAMPM = $('input_' + id + '_ampmRange') ? $('input_' + id + '_ampmRange').value : 'no';
                var lab = $('input_' + id + '_ampmRange') ? '_ampmRange' : '_dummy';
                if (sHour.length > 0 && sMin.length > 0 && eHour.length > 0 && eMin.length > 0) {
                    if (sAMPM == 'PM' && sHour != 12) sHour = parseInt(sHour) + 12;
                    if (sAMPM == 'AM' && sHour == 12) sHour = 0;
                    if (eAMPM == 'PM' && eHour != 12) eHour = parseInt(eHour) + 12;
                    if (eAMPM == 'AM' && eHour == 12) eHour = 0;

                    var start = new Date(0, 0, 0, sHour, sMin, 0);
                    var end = new Date(0, 0, 0, eHour, eMin, 0);
                    var diff = end.getTime() - start.getTime();
                    if (diff < 0) { //end time is next day
                        end = new Date(0, 0, 1, eHour, eMin, 0);
                        diff = end.getTime() - start.getTime();
                    }
                    var hours = Math.floor(diff / 1000 / 60 / 60);
                    diff -= hours * 1000 * 60 * 60;
                    var min = Math.floor(diff / 1000 / 60);
                    if (min < 10) min = '0' + min;
                    $$('label[for=input_' + id + lab + ']').first().update('<b>Total ' + hours + ':' + min + '</b>');
                    $$('label[for=input_' + id + lab + ']').first().setStyle({'color': 'black'});
                    $$('input[id=duration_' + id + '_ampmRange][type="hidden"]').first().setValue(hours + ':' + min);
                } else {
                    $$('label[for=input_' + id + lab + ']').first().update('&nbsp');
                }
            }
        };
        $('input_' + id + '_hourSelect').observe('change', displayDuration);
        $('input_' + id + '_minuteSelect').observe('change', displayDuration);
        $('input_' + id + '_hourSelectRange').observe('change', displayDuration);
        $('input_' + id + '_minuteSelectRange').observe('change', displayDuration);
        if ($('input_' + id + '_ampm') && $('input_' + id + '_ampmRange')) {
            $('input_' + id + '_ampm').observe('change', displayDuration);
            $('input_' + id + '_ampmRange').observe('change', displayDuration);
        }
        displayDuration();
    },


    /**
     * Set current local time if nodefault not set
     */
    displayLocalTime: function (hh, ii, ampm) {
        if ($(hh) && !$(hh).hasClassName('noDefault')) {
            var date = new Date();
            var hour = date.getHours();

            var currentAmpm = "";
            var twentyFour = true;
            if ($(ampm)) {
                twentyFour = false;
                currentAmpm = (hour > 11) ? 'PM' : 'AM';
                hour = (hour > 12) ? hour - 12 : hour;
                hour = (hour == 0) ? 12 : hour;
            }

            var min = date.getMinutes();
            var step = Number($(ii).options[2].value) - Number($(ii).options[1].value);
            min = Math.round(min / step) * step;
            min = this.addZeros(min, 2);
            if (min >= 60) { //ntw roll over to next hour/day
                min = "00";
                hour++;
                if (twentyFour) {
                    if (hour == 24) hour = 0;
                } else {
                    if (currentAmpm == 'AM' && hour == 12) currentAmpm = 'PM';
                    else if (currentAmpm == 'PM' && hour == 12) currentAmpm = 'AM';
                    else if (hour == 13) hour = 1;
                }
            }

            $(hh).value = hour;
            $(ii).value = min;

            if ($(hh + 'Range')) {
                $(hh + 'Range').value = hour;
                $(ii + 'Range').value = min;
            }
            if ($(ampm)) {
                if (currentAmpm == 'PM') {
                    if ($(ampm).select('option[value="PM"]').length > 0) $(ampm).value = 'PM';
                    if ($(ampm + 'Range') && $(ampm + 'Range').select('option[value="PM"]').length > 0) $(ampm + 'Range').value = 'PM';
                } else {
                    if ($(ampm).select('option[value="AM"]').length > 0) $(ampm).value = 'AM';
                    if ($(ampm + 'Range') && $(ampm + 'Range').select('option[value="AM"]').length > 0) $(ampm + 'Range').value = 'AM';
                }
            }
        }
    },

    displayDynamicDate: function (id, dynamic) {
        var offset = parseInt(dynamic.split('today')[1]) || 0;
        var dynamicDate = new Date();
        dynamicDate.setDate(dynamicDate.getDate() + offset);
        JotForm.formatDate({date: dynamicDate, dateField: $("id_" + id)});
    },

    dateLimits: {},

    /**
     * Sets calendar to field
     * @param {Object} id
     */
    setCalendar: function (id, startOnMonday, limits) {
        try {

            JotForm.dateLimits[id] = limits;
            var field = $('id_' + id);
            var calendar = Calendar.setup({
                triggerElement: "input_" + id + "_pick",
                dateField: "year_" + id,
                closeHandler: function () {
                    JotForm.calendarClose.apply(this, arguments);
                },
                selectHandler: function () {
                    JotForm.formatDate.apply(this, arguments);
                },
                startOnMonday: startOnMonday,
                limits: limits
            });
            field.observe('keyup', function () {
                field.fire('date:changed');
            });
            var clearDate = function() {
                $("month_"+id).value = $("day_"+id).value = $("year_"+id).value = "";
            }
            var invalidDate = function(invalidDate, calendar) {
                invalidDate.addClassName("invalidDate");
                clearDate();
            }
            if ($('lite_mode_' + id)) {

                $('lite_mode_' + id).dateChanged = function (e, calendar) {
                    var lite_mode = e.currentTarget;
                    var seperator = lite_mode.readAttribute('seperator');
                    var format = lite_mode.readAttribute('format').toLowerCase();

                    lite_mode.removeClassName("invalidDate");
                    if(lite_mode.value === "") {
                        return clearDate();
                    }
                    if(lite_mode.value.length == ((seperator.length*2) + format.length)){
                        var _yIn = format.indexOf("yy");
                        var _mIn = format.indexOf("mm");
                        var _dIn = format.indexOf("dd");
                        var _sorter = new Array(_yIn, _mIn, _dIn);
                        _sorter = _sorter.sort();
                        var _sortIndex = {
                            year: _sorter.indexOf(_yIn),
                            month: _sorter.indexOf(_mIn),
                            day: _sorter.indexOf(_dIn)
                        }

                        var year = parseInt(lite_mode.value.split(seperator)[_sortIndex.year]);
                        var month = parseInt(lite_mode.value.split(seperator)[_sortIndex.month])-1;
                        var day = parseInt(lite_mode.value.split(seperator)[_sortIndex.day]);
                        var _tempDate = new Date(year, month, day);

                        if (!_tempDate || !_tempDate.getDate()) {
                            invalidDate(lite_mode, calendar);
                        } else {
                            calendar.date = _tempDate;
                            calendar.selectHandler(calendar);
                        }
                    } else {
                        invalidDate(lite_mode, calendar);
                    }

                    if(lite_mode.hasClassName("invalidDate")) {
                        JotForm.errored(lite_mode, 'Enter a valid date');
                        field.addClassName('form-line-error');
                        field.addClassName('form-datetime-validation-error');
                    }
                }

                $('lite_mode_' + id).observe('keyup', function (e) {
                    e.stopPropagation();
                    e.currentTarget.dateChanged(e, calendar);
                    return false;
                });

                $('lite_mode_' + id).observe('blur', function (e) {
                    e.stopPropagation();
                    /*Dogus: set new date value and run handler*/
                    e.currentTarget.dateChanged(e, calendar);
                    e.currentTarget.setAttribute("date-val", calendar.date.getTime());
                    return false;
                });
            }

            var openCalendar = function () {
                var ele = this;
                setTimeout(function () {
                    calendar.showAtElement(ele);
                }, 50);

            };
            if ($('input_' + id + '_pick').hasClassName('showAutoCalendar')) {
                var _selectors = [('#day_' + id), ('#month_' + id), ('#year_' + id), ('#lite_mode_' + id)];
                $$(_selectors.join(',')).each(function (elem) {
                    elem.observe('focus', openCalendar);
                    elem.observe('click', openCalendar);
                });
            }
            $("year_"+id).observe("blur", function() {
                calendar.hide();
            });

        } catch (e) {
            JotForm.error(e);
        }
    },

    currentDateReadonly: function () {},

    calendarClose: function (calendar) {
        var calendarFields = $$('input[id*="' + calendar.dateField.id.match(/[0-9]+/)[0] + '"]');
        var validations = calendar.dateField.className.replace(/.*validate\[(.*)\].*/, '$1').split(/\s*,\s*/);
        var incomplete = calendarFields.any(function (c) {
            return c.value.empty()
        });
        if ((validations.include("required") || validations.include("disallowPast"))
            && incomplete) {
            calendar.dateField.validateInput();
        }
        calendar.hide();
    },

    /**
     * Collects all inital values of the fields and saves them as default values
     * to be restored later
     */
    getDefaults: function () {
        $$('.form-textbox, .form-dropdown, .form-textarea').each(function (input) {
            if (input.hinted || input.value === "") {
                return;
                /* continue; */
            }

            JotForm.defaultValues[input.id] = input.value;
        });

        $$('.form-radio, .form-checkbox').each(function (input) {
            if (!input.checked) {
                return;
                /* continue; */
            }
            JotForm.defaultValues[input.id] = input.value;
        });
    },
    /**
     * Enables or disables the Other option on radiobuttons/checkboxes
     */
    handleOtherOptions: function () {

        $$('.form-radio-other-input, .form-checkbox-other-input').each(function (inp) {
            inp.hint(inp.getAttribute('data-otherHint') || 'Other');
        });

        $$('.form-radio, .form-checkbox').each(function (input) {

            var id = input.id.replace(/input_(\d+)_\d+/gim, '$1');

            if (id.match('other_')) {
                id = input.id.replace(/other_(\d+)/, '$1');
            }

            if ($('other_' + id)) {
                var other = $('other_' + id);
                var other_input = $('input_' + id);
                var otherOption = input.type === 'radio' ? input : other;
                other_input.observe('keyup', function () {
                    other.value = other_input.value;
                });
                other_input.observe('click', function () {
                    $('other_' + id).checked = true;
                    other_input.value = other_input.value === other_input.getAttribute('data-otherHint') ? '' : other_input.value;
                });
                // perform only on the "Other" option if input is check box
                otherOption.observe('click', function () {

                    if (other.checked) {
                        other_input.select();
                    } else {
                        if (other_input.hintClear) {
                            other_input.hintClear();
                        }
                    }
                });
            }
        });
    },

    shuffleOptions: function (id) {
        var type = JotForm.calculationType(id);
        if (type === "radio" || type === "checkbox") {
            try {
                var options = $("id_" + id).select('.form-' + type + '-item');
                var length = $("id_" + id).down('.form-' + type + '-other-input') ? options.length - 1 : options.length; //don't shuffle "other"

                for (var i = 0; i < length - 1; i++) {
                    var toSwap = $("id_" + id).select('.form-' + type + '-item')[i];
                    var randy = Math.floor(Math.random() * length);
                    var swappedOut = options[randy].replace(toSwap);
                    var insertAfter = $("id_" + id).select('.form-' + type + '-item')[i].next() ? $("id_" + id).select('.form-' + type + '-item')[i].next() : $("id_" + id).select('.form-' + type + '-item')[i];
                    insertAfter.insert({after: swappedOut});
                }

                //deal with columns
                if ($("id_" + id).down('.form-multiple-column')) {
                    var columnCount = $("id_" + id).down('.form-multiple-column').readAttribute("data-columncount");
                    $("id_" + id).select('.form-' + type + '-item').each(function (item, i) {
                        item.setStyle({'clear': (i % columnCount == 0) ? 'left' : 'none'});
                    });
                }
            } catch (e) {
                console.log(e);
            }

        } else if (type === "select") {
            try {
                var clone = $('input_' + id).clone(true);
                $('input_' + id).update("");
                var length = clone.length;
                $('input_' + id).insert(clone[0].clone(true));
                for (var i = 1; i < length; i++) {
                    var randy = Math.floor(Math.random() * (clone.length - 1)) + 1;
                    $('input_' + id).insert(clone[randy].clone(true));
                    clone[randy].remove();
                }
            } catch (e) {
                console.log(e);
            }
        } else if (type === "matrix") {
            try {
                var rows = $("id_" + id).select('tr');
                var len = rows.length
                for(var i=1; i<len; i++) {
                    var randy = Math.floor(Math.random() * (len-1)) + 1;
                    var swappedOut = rows[randy].replace(rows[i]);
                    var insertAfter = rows[i].next() ? rows[i].next() : rows[i];
                    insertAfter.insert({after: swappedOut});
                }
            } catch(e) {
                console.log(e);
            }
        }
    },

    handleDateTimeChecks: function () {
        try {
        $$('[name$=\[month\]]').each(function (monthElement) {
            var isBirthdate = monthElement.type !== "tel" && monthElement.type !== "text";
            var questionId = isBirthdate ? monthElement.id.replace(new RegExp('.*?([0-9]+).*', 'gim'), '$1') :  monthElement.id.split('month_').last() ;
            var dateElement = $('id_' + questionId);
            if (!dateElement)
                return;

            var dayElement = dateElement.down('[id*=day]');
            var yearElement = dateElement.down('[id*=year]');

            var hourElement = dateElement.select('#hour_' + questionId).first();
            var minElement = dateElement.select('#min_' + questionId).first();
            var ampmElement = dateElement.select('#ampm_' + questionId).first();

            var dateTimeCheck = function (e) {
                var erroredElement = null;
                var ignoreBirthdate = isBirthdate && (monthElement.value === "" || dayElement.value === "" || yearElement.value === "");
                if (!ignoreBirthdate && (monthElement.value != "" || dayElement.value != "" || yearElement.value != "")) {
                    var month = isBirthdate ? monthElement.selectedIndex :  monthElement.value;
                    month = parseInt(month, 10);
                    var day = +dayElement.value;
                    var year = +yearElement.value;

                    if (isNaN(year) || year < 0) {
                        erroredElement = yearElement;
                    } else if ((isNaN(month) || month < 1 || month > 12) && (document.activeElement != monthElement && document.activeElement != dayElement)) {
                        erroredElement = monthElement;
                    } else if ((isNaN(day) || day < 1)) {
                        // timeout to get correct active element
                        setTimeout(function () {
                            if ((document.activeElement != monthElement && document.activeElement != dayElement)) {
                                erroredElement = dayElement;
                            }
                        }, 50)
                    } else {
                        switch (month) {
                            case 2:
                                if ((year % 4 == 0) ? day > 29 : day > 28) {
                                    erroredElement = dayElement;
                                }
                                break;
                            case 4:
                            case 6:
                            case 9:
                            case 11:
                                if (day > 30) {
                                    erroredElement = dayElement;
                                }
                                break;
                            default:
                                if (day > 31) {
                                    erroredElement = dayElement;
                                }
                                break;
                        }
                    }
                }

                if (!erroredElement && hourElement && minElement && (hourElement.value != "" || minElement.value != "")
                    && !(e.target && e.target === document.activeElement)) // do not produce an error yet if target is currently active
                {
                    var hour = (hourElement.value.strip() == '') ? -1 : +hourElement.value;
                    var min = (minElement.value.strip() == '') ? -1 : +minElement.value;
                    if (isNaN(hour) || (ampmElement ? (hour < 0 || hour > 12) : (hour < 0 || hour > 23))) {
                        erroredElement = hourElement;
                    } else if (isNaN(min) || min < 0 || min > 59) {
                        erroredElement = minElement;
                    }
                }

                if (erroredElement) {
                    if (erroredElement === hourElement || erroredElement === minElement) {
                        erroredElement.errored = false;
                        JotForm.errored(erroredElement, 'Enter a valid time');
                    } else {
                        erroredElement.errored = false;
                        JotForm.errored(erroredElement, 'Enter a valid date');
                    }
                    dateElement.addClassName('form-line-error');
                    dateElement.addClassName('form-datetime-validation-error');
                } else {
                    JotForm.corrected(monthElement);
                    JotForm.corrected(dayElement);
                    JotForm.corrected(yearElement);
                    if (hourElement && minElement) {
                        JotForm.corrected(hourElement);
                        JotForm.corrected(minElement);
                    }
                    dateElement.removeClassName('form-line-error');
                    dateElement.removeClassName('form-datetime-validation-error');
                }
            };

            //fired when date is changed by calendar
            dateElement.observe('date:changed', dateTimeCheck);

            monthElement.observe('change', dateTimeCheck);
            dayElement.observe('change', dateTimeCheck);
            yearElement.observe('change', dateTimeCheck);
            if (hourElement && minElement) {
                hourElement.observe('change', dateTimeCheck);
                minElement.observe('change', dateTimeCheck);
            }
        });
        } catch(e) {
            console.error(e);
        }
    },

    handleTextareaLimits: function () {
        $$('.form-textarea-limit-indicator span').each(function (el) {
            var inpID = el.id.split('-')[0];
            if (!$(inpID)) {
                return;
            } // cannot find the main element

            var minimum = el.readAttribute('minimum');
            var limit = el.readAttribute('limit');
            var input = $(inpID);
            var count;

            var countText = function (firstRun) {
                if (input.hasClassName('form-custom-hint')) {
                    el.update("0/" + (minimum > -1 ? minimum : limit));
                    return;
                }

                var contents;
                if (input.hasClassName("form-textarea") && input.up('div').down('.nicEdit-main')) { //rich text
                    contents = input.value.stripTags().replace(/&nbsp;/g, ' ');
                } else {
                    contents = input.value;
                }

                // remove html tags and space chars, to prevent wrong counts on text copied from MS WORD
                var cleaned_contents = contents.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ');

                $(el.parentNode).removeClassName('form-textarea-limit-indicator-error');
                JotForm.corrected(el.up('.form-line').down('textarea'));

                var limitByType = function (type) {
                    var limitType = type == "min" ? el.readAttribute('typeMinimum') : el.readAttribute('type');
                    if (limitType == 'Words') {
                        count = $A(cleaned_contents.split(/\s+/)).without("").length;
                    } else if (limitType == 'Letters') {
                        count = cleaned_contents.length;
                    }
                    var limiting = false;
                    if (((type == "min" && count < minimum) || (type == "max" && count > limit)) && !(firstRun === true)) {
                        $(el.parentNode).addClassName('form-textarea-limit-indicator-error');
                        var minMax = type == "min" ? "Min" : "";
                        var lim = type == "min" ? minimum : limit;
                        var lettersWords = limitType === "Words" ? "word" : "character";
                        var msg = JotForm.texts[lettersWords + minMax + "LimitError"] + " " + lim;
                        JotForm.errored(el.up('.form-line').down('textarea'), msg + '.');
                        limiting = true;
                    }
                    el.update(count + "/" + ((minimum && count < minimum && type == "min") || limit == -1 ? minimum : limit));
                    return limiting;
                }
                var runMax = true;
                if (minimum && minimum > 0) {
                    runMax = !limitByType("min")
                }
                if (limit && limit > 0 && runMax) {
                    limitByType("max");
                }
            };
            countText(true);
            input.observe('change', countText);
            input.observe('focus', countText);
            input.observe('keyup', countText);

            //check whether rich text
            if (input.hasClassName("form-textarea") && input.up('div').down('.nicEdit-main')) {
                var cEditable = input.up('div').down('.nicEdit-main');
                cEditable.observe('keyup', function () {
                    input.value = cEditable.innerHTML;
                    countText();
                });
            }
        });
    },

    /**
     * Activates all autocomplete fields
     */
    handleAutoCompletes: function () {
        // Get all autocomplete fields
        $H(JotForm.autoCompletes).each(function (pair) {
            var el = $(pair.key); // Field itself

            el.writeAttribute('autocomplete', 'off');

            var parent = $(el.parentNode); // Parent of the field for list to be inserted
            var values = $A(pair.value.split('|')); // Values for auto complete

            var lastValue; // Last entered value
            var selectCount = 0; // Index of the currently selected element
            //parent.setStyle('position:relative;z-index:1000;'); // Set parent position to relative for inserting absolute positioned list
            var liHeight = 0; // Height of the list element

            // Create List element with must have styles initially
            var list = new Element('div', {
                className: 'form-autocomplete-list'
            }).setStyle({
                    listStyle: 'none',
                    listStylePosition: 'outside',
                    position: 'absolute',
                    zIndex: '10000'
                }).hide();

            var render = function () {

                var dims = el.getDimensions(); // Dimensions of the input box
                var offs = el.cumulativeOffset();

                list.setStyle({
                    top: ((dims.height + offs[1])) + 'px',
                    left: offs[0] + 'px',
                    width: ((dims.width < 1 ? 100 : dims.width) - 2) + 'px'
                });
                list.show();
            };

            // Insert list onto page
            // parent.insert(list);
            $(document.body).insert(list);

            list.close = function () {
                list.update();
                list.hide();
                selectCount = 0;
            };

            // Hide list when field get blurred
            el.observe('blur', function () {
                list.close();
            });

            // Search entry in values when user presses a key
            el.observe('keyup', function (e) {
                var word = el.value;
                // If entered value is the same as the old one do nothing
                if (lastValue == word) {
                    return;
                }
                lastValue = word; // Set last entered word
                list.update(); // Clean up the list first
                if (!word) {
                    list.close();
                    return;
                } // If input is empty then close the list and do nothing
                // Get matches

                var fuzzy = el.readAttribute('data-fuzzySearch') == 'Yes';
                var matches;

                if (fuzzy) {
                    matches = values.collect(function (v) {
                        if (v.toLowerCase().include(word.toLowerCase())) {
                            return v;
                        }
                    }).compact();
                } else {
                    matches = values.collect(function (v) {
                        if (v.toLowerCase().indexOf(word.toLowerCase()) == 0) {
                            return v;
                        }
                    }).compact();
                }
                // If matches found
                var maxMatches = el.readAttribute('data-maxMatches');
                if (maxMatches > 0) matches = matches.slice(0, maxMatches);
                if (matches.length > 0) {
                    matches.each(function (match) {
                        var li = new Element('li', {
                            className: 'form-autocomplete-list-item'
                        });
                        var val = match;
                        li.val = val;
                        try {
                            val = match.replace(new RegExp('(' + word + ')', 'gim'), '<b>$1</b>');
                        }
                        catch (e) {
                            JotForm.error(e);
                        }
                        li.insert(val);
                        li.onmousedown = function () {
                            el.value = match;
                            list.close();
                        };
                        list.insert(li);
                    });

                    render();

                    // Get li height by adding margins and paddings for calculating 10 item long list height
                    liHeight = liHeight || $(list.firstChild).getHeight() + (parseInt($(list.firstChild).getStyle('padding'), 10) || 0) + (parseInt($(list.firstChild).getStyle('margin'), 10) || 0);
                    // limit list to show only 10 item at once
                    list.setStyle({
                        height: (liHeight * ((matches.length > 9) ? 10 : matches.length) + 4) + 'px',
                        overflow: 'auto'
                    });
                } else {
                    list.close(); // If no match found clean the list and close
                }
            });

            // handle navigation through the list
            el.observe('keydown', function (e) {

                //e = document.getEvent(e);
                var selected; // Currently selected item
                // If the list is not visible or list empty then don't run any key actions
                if (!list.visible() || !list.firstChild) {
                    return;
                }

                // Get the selected item
                selected = list.select('.form-autocomplete-list-item-selected')[0];
                if (selected) {
                    selected.removeClassName('form-autocomplete-list-item-selected');
                }

                switch (e.keyCode) {
                    case Event.KEY_UP: // UP
                        if (selected && selected.previousSibling) {
                            $(selected.previousSibling).addClassName('form-autocomplete-list-item-selected');
                        } else {
                            $(list.lastChild).addClassName('form-autocomplete-list-item-selected');
                        }

                        if (selectCount <= 1) { // selected element is at the top of the list
                            if (selected && selected.previousSibling) {
                                $(selected.previousSibling).scrollIntoView(true);
                                selectCount = 0; // scroll element into view then reset the number
                            } else {
                                $(list.lastChild).scrollIntoView(false);
                                selectCount = 10; // reverse the list
                            }
                        } else {
                            selectCount--;
                        }

                        break;
                    case Event.KEY_DOWN: // Down
                        if (selected && selected.nextSibling) {
                            $(selected.nextSibling).addClassName('form-autocomplete-list-item-selected');
                        } else {
                            $(list.firstChild).addClassName('form-autocomplete-list-item-selected');
                        }

                        if (selectCount >= 9) { // if selected element is at the bottom of the list
                            if (selected && selected.nextSibling) {
                                $(selected.nextSibling).scrollIntoView(false);
                                selectCount = 10; // scroll element into view then reset the number
                            } else {
                                $(list.firstChild).scrollIntoView(true);
                                selectCount = 0; // reverse the list
                            }
                        } else {
                            selectCount++;
                        }
                        break;
                    case Event.KEY_ESC:
                        list.close(); // Close list when pressed esc
                        break;
                    case Event.KEY_TAB:
                    case Event.KEY_RETURN:
                        if (selected) { // put selected field into the input bıx
                            el.value = selected.val;
                            lastValue = el.value;
                        }
                        list.close();
                        if (e.keyCode == Event.KEY_RETURN) {
                            e.stop();
                        } // Prevent return key to submit the form
                        break;
                    default:
                        return;
                }
            });
        });

    },

    /**
     * Returns the extension of a file
     * @param {Object} filename
     */
    getFileExtension: function (filename) {
        return (/[.]/.exec(filename)) ? (/[^.]+$/.exec(filename))[0] : undefined;
    },

    /**
     * Fill fields from the get values prepopulate
     */
    prePopulations: function () {
        {       // Event simulator
            Element.prototype.triggerEvent = function (eventName) {
                var disabled = this.hasClassName('form-dropdown') && this.disabled ? !!(this.enable()) : false;

                if (document.createEvent) {
                    var evt = document.createEvent('HTMLEvents');
                    evt.initEvent(eventName, true, true);
                    this.dispatchEvent(evt);
                } else if (this.fireEvent) {
                    this.fireEvent('on' + eventName);
                }

                if(disabled) {
                    this.disable();
                }
            }
        }
        $H(document.get).each(function (pair) {
            var stricterMatch = pair.key.length < 3 ? true : false; //this will prevent "a=fill" matching any name that starts with an a

            var n = stricterMatch ? '[name$="_' + pair.key + '"]' : '[name*="_' + pair.key + '"]';
            var strict = '[name$="_' + pair.key + '"]';
            var input;

            input = $$('.form-star-rating' + n)[0];
            if (input) {
                input.setRating(parseInt(pair.value));
                return;
            }

            input = $$('.form-slider' + n)[0]; //Add classname in builder?
            if (input) {
                input.setSliderValue(parseInt(pair.value));
                return;
            }

            if (pair.key == "coupon-input" && $('coupon-input')) {
                $('coupon-input').setValue(pair.value);
                $('coupon-button').triggerEvent('click');
                return;
            }


            input = $$('.form-textbox%s, .form-dropdown%s, .form-textarea%s, .form-hidden%s'.replace(/\%s/gim, strict))[0];
            if (!input) {
                input = $$('.form-textbox%s, .form-dropdown%s, .form-textarea%s, .form-hidden%s'.replace(/\%s/gim, n))[0];
            }

            if (!input && pair.key.indexOf("[") > 0) {
                var name = pair.key.substr(0, pair.key.lastIndexOf('['));
                if (name.length > 0 && $$("select[name*=" + name + "], input[name*=" + name + "]").length > 0) {
                    var index = pair.key.substr(pair.key.lastIndexOf('[') + 1).replace("]", "");
                    if ($$("select[name*=" + name + "], input[name*=" + name + "]").length > index) {
                        var type = $$("select[name*=" + name + "]").length > 0 ? "select" : $$("input[name*=" + name + "]")[index].type;

                        switch (type) {
                            case "select":
                                $$("select[name*=" + name + "]")[index].value = pair.value.replace(/\+/g, ' ');
                                break;
                            case "text":
                            case "tel":
                            case "number":
                                $$("input[name*=" + name + "]")[index].value = pair.value.replace(/\+/g, ' ');
                                break;
                            case "radio":
                            case "checkbox":
                                if ((pair.value == "true" || pair.value == 1) && $$("input[name*=" + name + "]")[index]) {
                                    $$("input[name*=" + name + "]")[index].click();
                                }
                                break;
                        }
                    }
                }
            }

            if (input && input.readAttribute('data-type') == 'input-grading') {
                var grades = pair.value.split(',');
                var stub = input.id.substr(0, input.id.lastIndexOf('_') + 1);
                for (var i = 0; i < grades.length; i++) {
                    if ($(stub + i)) $(stub + i).value = grades[i];
                }
            } else if (input && (input.hasClassName('form-checkbox-other-input') || input.hasClassName('form-radio-other-input'))) {
                if (n.indexOf('[other]') > -1) {
                    input.value = pair.value.replace(/\+/g, ' ');
                    JotForm.defaultValues[input.id] = input.value;
                } else {
                    try {
                        var valuesArray = input.up('.form-line').readAttribute('data-type') === "control_checkbox" ? pair.value.split(',') : [pair.value];
                        for(var i=0; i<valuesArray.length; i++){
                            var normalInputWithValue = input.up('.form-input').select('input[type="radio"], input[type="checkbox"]').any(function (inp) {
                                return valuesArray[i] ===  inp.value;
                            });
                            if(!normalInputWithValue) {
                                input.value = valuesArray[i];
                                valuesArray[i] = "other";
                            }
                        }
                        pair.value = valuesArray.join(",");
                    } catch(e) {
                        console.error(e);
                    }
                }
            } else if (input && input.hasClassName("form-textarea") && input.up('div').down('.nicEdit-main')) {
                input.up('div').down('.nicEdit-main').update(pair.value.replace(/\+/g, ' '));
            } else if (input && input.hasClassName("form-dropdown")) {
                var val = pair.value.replace(/\+/g, ' ');
                var arr = input.readAttribute("multiple") ? val.split(",") : [val];
                var options = input.select('option');
                
                input.value = arr;
                $A(options).each(function(option) {
                    option.writeAttribute("selected", arr.include(option.value) ? "selected" : false);
                });
            } else if (input) {
                input.value = pair.value.replace(/\{\+\}/g,'{plusSign}').replace(/\+/g, ' ').replace(/\{plusSign\}/g,'+');
                JotForm.defaultValues[input.id] = input.value;
            }

            try {
                var formLine = input ? input.up('.form-line') : false;
                if (formLine && formLine.readAttribute('data-type') == "control_datetime" && formLine.down('input[id*="lite_mode_"]')) {
                    if (formLine.down('input[id*="year_"]').value != "" && formLine.down('input[id*="month_"]').value != "" && formLine.down('input[id*="day_"]').value != "") {
                        JotForm.formatDate({
                            date: new Date(formLine.down('input[id*="year_"]').value, formLine.down('input[id*="month_"]').value - 1, formLine.down('input[id*="day_"]').value),
                            dateField: formLine
                        });
                    }
                }
            } catch (e) {
                console.log(e);
            }

            $$('.form-textbox%s, .form-textarea%s, .form-hidden%s'.replace(/\%s/gim, n)).each(function (input) {
                //simulate 'keyup' event to execute conditions upon prepopulation
                input.triggerEvent('keyup');
            });
            $$('.form-dropdown%s'.replace(/\%s/gim, n)).each(function (input) {
                //simulate 'change' event to execute conditions upon prepopulation
                input.triggerEvent('change');
            });
            $$('.form-checkbox%s, .form-radio%s'.replace(/\%s/gim, n)).each(function (input) {
                //input.checked = $A(pair.value.split(',')).include(input.value);
                //Emre: when checkboxed is checked, total count does not increase on payment forms  (79814)

                var disabled = input.disabled ? !!(input.enable()) : false;

                if ($A(pair.value.split(',')).include(input.value)) {
                    if(!input.checked) {
                        if(disabled) {
                            setTimeout(function() { input.click()});
                        } else {
                            input.click();
                        }
                    }
                } else if ($A(pair.value.split(',')).include('other')) {
                    if ((input.name.indexOf('[other]') > -1) || (input.id && input.id.indexOf('other_') > -1)) {
                        input.click(); //select other option
                    }
                }

                if(disabled) setTimeout(function() { input.disable(); });
            });

            //if textarea is hinted and has content remove the hint class
            if (input && input.hasClassName('form-textarea') && input.hasClassName('form-custom-hint') && input.hasContent) {
                input.removeClassName('form-custom-hint');
            }
        });
    },
    /**
     * Reset form while keeping the values of hidden fields
     * @param {Object} frm
     */
    resetForm: function (frm) {
        var hiddens = $(frm).select('input[type="hidden"]');
        hiddens.each(function (h) {
            h.__defaultValue = h.value;
        });
        $(frm).reset();
        hiddens.each(function (h) {
            h.value = h.__defaultValue;
        });
        return frm;
    },
    /**
     * Bring the form data for edit mode
     *
     * dynamically load editMode function from form.edit.mode.js
     * it will add a function named editModeFunction to global scope
     */
    editMode: function (data, noreset, skipField) {
        var preLink = "";
        if (!JotForm.debug) {
            if (this.url.search("https") == -1) {
                preLink = "http://cdn.jotfor.ms/";
            } else {
                preLink = "https://cdn.jotfor.ms/";
            }
        }

        if (!window.editModeFunction) {
            var self = this;
            this.loadScript('/js/form.edit.mode.js?v_' + (new Date()).getTime(), function () {
                //editModeFunction is function name defined in form.edit.mode.js
                self.editMode = editModeFunction;
                self.editMode(data, noreset, skipField);
            });
        } else {
            self.editMode(data, noreset, skipField);
        }
    },
    /**
     * Helper function that will tell if form is in edit mode
     */
    isEditMode: function () {
        return (typeof window.editModeFunction !== 'undefined');
    },
    /**
     * add the given condition to conditions array to be used in the form
     * @param {Object} qid id of the field
     * @param {Object} condition condition array
     */
    setConditions: function (conditions) {

        conditions.reverse();

        JotForm.conditions = conditions;
        // Ozan, IMPORTANT NOTE: To enable chainig multiple field/email actions to a single/multiple conditions,
        // any "condition.action" is expected to be an array, regardless of "condition.type". Since old conditions
        // are stored in the database with a single action, "condition.action" is converted to an array, concatting
        // the only action which condition has.
        conditions.each(function (condition) {
            condition.action = [].concat(condition.action);
        });
    },

    setCalculations: function (calculations) {
        JotForm.calculations = calculations;
    },

    runConditionForId: function (id) {
        $H(JotForm.fieldConditions).each(function (pair) {
            var conds = pair.value.conditions;
            $A(conds).each(function (cond) {
                $A(cond.terms).each(function (term) {
                    if (term.field === id) {
                        JotForm.checkCondition(cond);
                    }
                });
            });
        });
    },

    otherConditionTrue: function (field, visibility) {
        visibility = visibility.replace(/multiple/, "");
        var otherConditionTrue = false;
        $H(JotForm.fieldConditions).each(function (pair) {
            var conds = pair.value.conditions;
            $A(conds).each(function (cond) {
                $A(cond.action).each(function (action) {
                    if (action.fields) {
                        action.fields.each(function (multiField) {
                            if (multiField === field && action.visibility && action.visibility.toLowerCase().replace(/multiple/, "") === visibility && action.hasOwnProperty('currentlyTrue') && action.currentlyTrue) {
                                otherConditionTrue = true;
                                return;
                            }
                        });
                    }
                    if (action.field === field && action.visibility && action.visibility.toLowerCase() === visibility && action.hasOwnProperty('currentlyTrue') && action.currentlyTrue) {
                        otherConditionTrue = true;
                    }
                });
            });
        });

        return otherConditionTrue;
    },

    /**
     * Shows a field
     * @param {Object} field
     */
    showField: function (field, multiple) {
        if (JotForm.otherConditionTrue(field, 'hide')) return;

        var element = null;
        var idField = $('id_' + field);
        var cidField = $('cid_' + field);
        var sectionField = $('section_' + field);

        if (sectionField && cidField) { // Form collapse
            element = sectionField;
        } else if (cidField && !idField) { // Heading
            element = cidField;
        } else { // Regular field
            element = idField;
        }

        //If no form element is found check for hidden single product field
        if (!element) {
            var productField = $$('input[name*="q' + field + '"][type="hidden"]');

            if (productField.length > 0) {
                productField[0].setAttribute('selected', true);
            }

            return element;
        }

        element.removeClassName('form-field-hidden');
        element.removeClassName('always-hidden');
        if(!element.hasClassName("form-section") && element.down(".always-hidden")) {
            element.down(".always-hidden").removeClassName('always-hidden');
        }

        // kemal:bug::#145986 Form collapse bug
        if (sectionField) {
            if (element.hasClassName('form-section-closed')) { //if a closed form-section
                //check for .form-collapse-table has class form-collapse-hidden
                if (element.select('.form-collapse-table')[0].hasClassName('form-collapse-hidden')) {
                    //element is hidden remove class add class
                    element.removeClassName('form-section-closed');
                    element.addClassName('form-section');
                    element.setStyle({
                        height: "auto",
                        overflow: "hidden"
                    });
                } else {
                    //element is visible do not add auto height
                    element.setStyle({
                        overflow: "hidden"
                    });
                }
            } else {
                //case for status = closed
                element.setStyle({
                    height: "auto",
                    overflow: "hidden"
                });
            }
        }

        if (JotForm.getInputType(field) === 'html' && $('text_' + field).innerHTML.match(/google.*maps/gi)) { //google maps hack to get the iframe to redisplay in the right place
            $('text_' + field).innerHTML = $('text_' + field).innerHTML;
        }

        var elemShown = element.show();

        if (JotForm.getInputType(field) === 'widget') {
            JotForm.showWidget(field);
        }

        // kenneth: form callapse + condition + widgets bug when collapse opened by default
        if (JotForm.getInputType(field) === 'collapse') {
            // do something under collapse bar if shown opened by default
            if (sectionField && !element.hasClassName('form-section-closed')) {
                element.select('li.form-line').each(function (node, i) {
                    var id = node.id.split('_')[1];

                    // show widget fields
                    if (JotForm.getInputType(id) === 'widget') {
                        JotForm.showWidget(id);
                    }
                });
            }
        }

        return elemShown;
    },


    showWidget: function (id) {
        var referrer = document.getElementById("customFieldFrame_" + id) ? document.getElementById("customFieldFrame_" + id).src : false;
        if (referrer) {
            var frame = (navigator.userAgent.indexOf("Firefox") != -1) ? getIframeWindow(window.frames["customFieldFrame_" + id]) : window.frames["customFieldFrame_" + id];
            if (frame) {
                XD.postMessage(JSON.stringify({type: "show", qid: id}), referrer, frame);

                // send ready message event at the same time for widgets
                // that doesn't work with show
                if (typeof window.JCFServerCommon !== 'undefined') {
                    // only send ready if the section of the frame is current visible
                    if (JotForm.isVisible(JotForm.getSection($("id_" + id))) && JotForm.isVisible($("id_" + id))) {
                        // verify existence of widget frame
                        if (window.JCFServerCommon.frames.hasOwnProperty(id)) {
                            window.JCFServerCommon.frames[id].sendReadyMessage(id);
                        }
                    }
                }
            }
        }
    },

    /**
     * Hides a field
     * @param {Object} field
     */
    hideField: function (field, multiple, dontClear) {
        if (JotForm.otherConditionTrue(field, 'show')) return;

        var idPrefix = 'id_';

        // For headings
        if ($('cid_' + field) && !$('id_' + field)) {
            idPrefix = 'cid_';
        }

        // For form collapses
        if ($('cid_' + field) && $('section_' + field)) {
            idPrefix = 'section_';
        }
        var element = $(idPrefix + field);

        if (element) {
            element.addClassName('form-field-hidden');

            if (JotForm.clearFieldOnHide == "enable" && !dontClear) {
                try {
                    JotForm.clearField(field);
                } catch (e) {
                    console.log(e);
                }
            }
            return element.hide();
        }

        //If no form element is found check for hidden single product field
        var productField = $$('input[name*="q' + field + '"][type="hidden"]');

        if (productField.length > 0) {
            productField[0].setAttribute('selected', false);
        }
    },

    clearField: function (field, subfield, dontTrigger) {

        var type = JotForm.calculationType(field);

        if (!type) return;

        var defaultValue = "input_"+field in JotForm.defaultValues ? JotForm.defaultValues["input_"+field] : "";

        if (type == "collapse") {
            $("section_" + field).select(".form-line").each(function (el) {
                var id = el.id.replace("id_", "");
                JotForm.clearField(id);
            });
            return;
        }

        if(type === "matrix" && subfield && $(subfield)) {
            $(subfield).value = "";
            if(!dontTrigger && $(subfield).triggerEvent) {
                $(subfield).triggerEvent('keyup');
            }

        } else if(type === "matrix") {

            $('id_' + field).select('input[type="text"], input[type="tel"]').each(function (el) {
                el.value = (el.id in JotForm.defaultValues) ? JotForm.defaultValues[el.id] : "";
            });

            $("id_" + field).select('input[type="radio"], input[type="checkbox"]').each(function (input) {
                if(input.id in JotForm.defaultValues) {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });

            $('id_' + field).select('select').each(function (el) {
                if(el.id in JotForm.defaultValues) {
                    el.value = JotForm.defaultValues[el.id];
                } else {
                    el.selectedIndex = 0;
                }
            });


            if($('id_' + field).select('input, select').length === 0) return;

            var firstField = $('id_' + field).select('input, select').first();
            if(firstField && firstField.triggerEvent) {
                var eventType;
                if(firstField.nodeName.toLowerCase() === 'input') {
                    if(firstField.type === "checkbox" || firstField.type === "radio") {
                        firstField.up().triggerEvent('click');
                    } else {
                        firstField.triggerEvent('keyup');
                    }
                } else {
                    firstField.triggerEvent('change');
                }
            }

        } else if (["address", "combined", "datetime", "time"].include(type)) {


            $('id_' + field).select('input').each(function (el) {
                el.value = (el.id in JotForm.defaultValues) ? JotForm.defaultValues[el.id] : "";
            });

            $('id_' + field).select('select').each(function (el) {
                if(el.id in JotForm.defaultValues) {
                    el.value = JotForm.defaultValues[el.id];
                } else {
                    el.selectedIndex = 0;
                }
            });

            var triggerMe = $('input_' + field) ? $('input_' + field) : $('id_' + field).select('input').first();
            if (triggerMe && triggerMe.triggerEvent) {
                triggerMe.triggerEvent('keyup');
            }

            if ($('input_' + field + '_full') && $('input_' + field + '_full').readAttribute("masked") == "true") {
                JotForm.setQuestionMasking("#input_" + field + "_full", "textMasking", $('input_' + field + '_full').readAttribute("maskValue"));
            }

        } else if (["braintree", "stripe", "paypalpro", "authnet"].include(type)) {
            $('id_' + field).select('input[type="text"], .form-address-country').each(function (el) {
                el.value = (el.id in JotForm.defaultValues) ? JotForm.defaultValues[el.id] : "";
            });
        } else if (type === "html") {
            try {
                $('id_' + field).select(".replaceTag").each(function(span) {
                    var def = span.readAttribute("default");
                    span.update(def);
                });
            } catch (e) {
                console.log(e);
            }
        } else if (type == "textarea") {
            $('input_' + field).value = defaultValue;
            if($('input_' + field).triggerEvent && !dontTrigger) $('input_' + field).triggerEvent("keyup");
            if ($('input_' + field).showCustomPlaceHolder) {
                $('input_' + field).showCustomPlaceHolder();
            }
            var richArea = $("id_" + field).down('.nicEdit-main');
            if (richArea) {
                richArea.innerHTML = defaultValue;
                if ($('input_' + field).hasClassName('custom-hint-group') && !$('input_' + field).hasContent) {
                    richArea.setStyle({'color': '#babbc0'});
                }
            }
        } else {
            if (type == "checkbox" || type == "radio") {
                $("id_" + field).select('input[type="radio"], input[type="checkbox"]').each(function (input) {
                    if(input.id in JotForm.defaultValues) {
                        input.checked = true;
                    } else {
                        input.checked = false;
                    }
                });
                if ($('id_' + field).triggerEvent && !dontTrigger) $('id_' + field).triggerEvent('click');
            } else if (type == "select") {
                if ($('input_' + field)) {
                    $('input_' + field).value = defaultValue;
                    if ($('input_' + field).triggerEvent && !dontTrigger) $('input_' + field).triggerEvent('change');
                } else { //select matrices
                    $("id_" + field).select('select').each(function (element) {
                        element.value = '';
                        if (element.triggerEvent && !dontTrigger) element.triggerEvent('change');
                    });
                }
            } else if ($('input_' + field)) {
                $('input_' + field).value = defaultValue;
                if ($('input_' + field).triggerEvent && !dontTrigger) {
                    if (type == "widget") {
                        var widgetEl = $('input_' + field);
                        widgetEl.fire('widget:clear', {qid: parseInt(widgetEl.id.split('_')[1])});
                        widgetEl.triggerEvent('change');
                    } else {
                        $('input_' + field).triggerEvent('keyup');
                    }
                }
                if(defaultValue === "" && $('input_' + field).hintClear) {
                    $('input_' + field).hintClear(); //ie8&9
                }
                if ($('input_' + field).readAttribute("masked") == "true") {
                    JotForm.setQuestionMasking("#input_" + field, "textMasking", $('input_' + field).readAttribute("maskValue"));
                }
                if ($('input_' + field).hasClassName("form-star-rating") && $('input_' + field).setRating) {
                    $('input_' + field).setRating(0);
                }
            }
        }
    },

    /**
     * Checks the fieldValue by given operator string
     * @param {Object} operator
     * @param {Object} condValue
     * @param {Object} fieldValue
     */
    checkValueByOperator: function (operator, condValueOrg, fieldValueOrg) {

        try {
            if (typeof condValueOrg == "string" && condValueOrg.indexOf("{") > -1 && condValueOrg.indexOf("}") > -1) { //contains other field reference
                condValueOrg = condValueOrg.replace(/\{.*?\}/gi, function (match, contents, offset, s) {
                    var stripped = match.replace(/[\{\}]/g, "");
                    var elements = $$('input[name$="_' + stripped + '"]');
                    if (elements.length > 0) {
                        var element = elements.first();
                        if (element && element.value) {
                            return element.value;
                        }
                    }
                    return match;
                });
            }
        } catch (e) {
            console.log(e);

        }

        var fieldValue = Object.isBoolean(fieldValueOrg) ? fieldValueOrg : fieldValueOrg.toString().strip().toLowerCase();
        var condValue = Object.isBoolean(condValueOrg) ? condValueOrg : condValueOrg.toString().strip().toLowerCase();

        switch (operator) {
            case "equals":
            case "quantityEquals":
            case "equalDate":
                return fieldValue == condValue;
            case "equalDay":
                return JotForm.getDayOfWeek(fieldValue) == condValue;
            case "notEquals":
            case "notEqualDate":
            case "quantityNotEquals":
                return fieldValue != condValue;
            case "notEqualDay":
                return JotForm.getDayOfWeek(fieldValue) != condValue;
            case "endsWith":
                return fieldValue.endsWith(condValue);
            case "notEndsWith":
                return !fieldValue.endsWith(condValue);
            case "startsWith":
                return fieldValue.startsWith(condValue);
            case "notStartsWith":
                return !fieldValue.startsWith(condValue);
            case "contains":
                condValues = condValue.split(",");
                return $A(condValues).any(function (cv) {
                    return fieldValue.include(cv.trim());
                });
            case "notContains":
                condValues = condValue.split(",");
                return !$A(condValues).any(function (cv) {
                    return fieldValue.include(cv.trim());
                });
            case "greaterThan":
            case "quantityGreater":
                return (parseFloat(fieldValue, 10) || 0) > (parseFloat(condValue, 10) || 0);
            case "lessThan":
            case "quantityLess":
                //Emre: if Scale Rating doesn't have value it returns "true" so we need to check wheater its length is greater than 0 (52809)
                //fieldValue is string, not number
                if (fieldValue.length) {
                    return (parseFloat(fieldValue, 10) || 0) < (parseFloat(condValue, 10) || 0);
                } else {
                    return false;
                }
            case "isEmpty":
                if (Object.isBoolean(fieldValue)) {
                    return !fieldValue;
                }
                return fieldValue.empty();
            case "isFilled":
                if (Object.isBoolean(fieldValue)) {
                    return fieldValue;
                }
                return !fieldValue.empty();
            case "before":
                return fieldValueOrg < condValueOrg;
            case "after":
                return fieldValueOrg > condValueOrg;
            default:
                JotForm.error("Could not find this operator", operator);
        }
        return false;
    },

    getDayOfWeek: function (date) {
        date = new Date(date);
        var days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        return days[date.getDay()];
    },

    typeCache: {},   // Cahcke the check type results for performance
    /**
     *
     * @param {Object} id
     */
    getInputType: function (id) {
        if (JotForm.typeCache[id]) {
            return JotForm.typeCache[id];
        }
        var type = false;
        if ($('id_' + id) && $('id_' + id).readAttribute('data-type') == "control_text") {
            type = 'html';
        } else if ($('input_' + id)) {
            type = $('input_' + id).nodeName.toLowerCase() == 'input' ? $('input_' + id).readAttribute('type').toLowerCase() : $('input_' + id).nodeName.toLowerCase();
            if ($('input_' + id).hasClassName("form-radio-other-input")) {
                type = "radio";
            }
            if ($('input_' + id).hasClassName("form-checkbox-other-input")) {
                type = "checkbox";
            }
            // Neil: set type for autocomplete fields
            if ($('input_' + id).hasClassName('form-autocomplete')) {
                type = "autocomplete";
            }

            if ($('input_' + id).hasClassName('form-slider')) {
                type = 'slider';
            }

            if ($('input_' + id).hasClassName('form-widget')) {
                type = 'widget';
            }

            if ($('input_' + id).hasClassName('form-star-rating')) {
                type = "rating";
            }

        } else if ($('input_' + id + '_pick') || ($('id_' + id) && $('id_' + id).readAttribute('data-type') == "control_datetime")) {
            type = 'datetime';
        } else if ($('input_' + id + '_month')) {
            type = 'birthdate';
        } else if ($('input_' + id + '_hourSelect')) {
            type = 'time';
        } else if ($("cid_" + id) && $("cid_" + id).getAttribute("data-type") == "control_collapse") {
            return 'collapse';
        } else if ($$('#id_' + id + ' .form-product-item').length > 0) {
            type = $$('#id_' + id + ' .form-product-item')[0].select('input')[0].readAttribute('type').toLowerCase();
        } else if ($$('#id_' + id + ' .form-address-table').length > 0) {
            type = 'address';
        } else if ($$('input[id^=input_' + id + '_]')[0] && $$('input[id^=input_' + id + '_]')[0].hasClassName('form-grading-input')) {
            type = 'grading';
        } else if ($$('#id_' + id + ' .pad').length > 0) {
            type = 'signature';
        } else {
            if ($$('#id_' + id + ' input')[0]) {
                type = $$('#id_' + id + ' input')[0].readAttribute('type').toLowerCase();
                if (type == "text" || type == 'tel' || type === 'number') {
                    type = "combined";
                }
            } else if ($$('#id_' + id + ' select')[0]) {
                type = "select"; //select matrices
            }
        }
        JotForm.typeCache[id] = type;
        return type;
    },
    /**
     * Parses ISO Date string to a real date
     * @param {Object} str
     */
    strToDate: function (str) {
        // When cannot parse return an invalid date
        var invalid = new Date(undefined);
        var match = /(\d{4})\-(\d{2})-(\d{2})T?(\d{2})?\:?(\d{2})?/gim;

        if (str.empty()) {
            return invalid;
        }

        // if(!str.include("T")){ str += "T00:00"; }

        if (!match.test(str)) {
            return invalid;
        }

        var d = new Date();
        str.replace(match, function (all, year, month, day, hour, minutes) {
            if (hour) {
                d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minutes, 10));
            } else {
                d = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
            }
            return all;
        });

        return d;
    },

    getBirthDate: function (id) {
        var day = $('input_' + id + '_day').getValue() || "%empty%";
        var month = $('input_' + id + '_month').selectedIndex || "%empty%";
        month = String(month);
        var year = $('input_' + id + '_year').getValue() || "%empty%";
        var date = year + "-" + (month.length == 1 ? '0' + month : month) + "-" + (day.length == 1 ? '0' + day : day);
        if (date.include("%empty%")) return "";
        return date;
    },

    get24HourTime: function (id) {
        var hour = $('input_' + id + '_hourSelect').getValue();
        if (hour == "") return "";
        var minute = $('input_' + id + '_minuteSelect').getValue();
        if (minute.length == 0) minute = "00";
        var ampm = ($('input_' + id + '_ampm')) ? $('input_' + id + '_ampm').getValue() : '';
        hour = Number(hour);
        if (ampm == 'PM' && hour != 12) {
            hour += 12;
        } else if (ampm == 'AM' && hour == 12) {
            hour = 0;
        }
        hour = (hour < 10) ? "0" + hour : String(hour);
        return hour + minute;
    },

    getDateValue: function (id) {
        var date = "";
        if ($('year_' + id)) {
            date += ($('year_' + id).value || "%empty%");
        }
        if ($('month_' + id)) {
            var mm = $('month_' + id).value ? ($('month_' + id).value.length > 1 ? $('month_' + id).value : "0" + $('month_' + id).value) : "%empty%";
            date += "-" + mm;
        }
        if ($('day_' + id)) {
            var dd = $('day_' + id).value ? ($('day_' + id).value.length > 1 ? $('day_' + id).value : "0" + $('day_' + id).value) : "%empty%";
            date += "-" + dd;
        }

        if (date.include("%empty%")) {
            JotForm.info("Wrong date: " + date);
            return "";
        }
        var h = "";
        if ($('ampm_' + id)) {
            if ($('hour_' + id)) {
                h = $('hour_' + id).value;
                if ($('ampm_' + id).value == 'pm') {
                    h = parseInt(h, 10) + 12;
                }
                if (h == "24") {
                    h = 0;
                }
                date += "T" + ((h.length == 1 ? "0" + h : h) || "00");
            }
        } else {
            if ($('hour_' + id)) {
                h = $('hour_' + id).value;
                date += "T" + ((h.length == 1 ? "0" + h : h) || "00");
            }
        }

        if ($('min_' + id)) {
            date += ":" + ($('min_' + id).value || "00");
        }
        if (h === "") {
            date += "T00:00";
        }
        return date;
    },
    /**
     *
     * @param {Object} condition
     */
    checkCondition: function (condition) {
        var any = false, all = true;
        var filled;
        $A(condition.terms).each(function (term) {
            var value;
            try {
                var fieldType = JotForm.getInputType(term.field);
                switch (fieldType) {
                    case "combined":
                        if (['isEmpty', 'isFilled'].include(term.operator)) {
                            filled = $$('#id_' + term.field + ' input').collect(function (e) {
                                return e.value;
                            }).any();

                            if (JotForm.checkValueByOperator(term.operator, term.value, filled)) {
                                any = true;
                            } else {
                                all = false;
                            }

                            return;
                            /* continue; */
                        } else {
                            //for matrices
                            value = $$('#id_' + term.field + ' input').collect(function (e) {
                                return e.value;
                            });
                            if (JotForm.checkValueByOperator(term.operator, term.value, value)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        }
                        break;
                    case "address":
                        if (['isEmpty', 'isFilled'].include(term.operator)) {
                            filled = $$('#id_' + term.field + ' input').collect(function (e) {
                                return e.value;
                            }).any();
                            if (JotForm.checkValueByOperator(term.operator, term.value, filled)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        } else {
                            var option;
                            $('input_' + term.field + '_country').select("option").each(function(opt) {
                                if(term.value === opt.value) {
                                    option = opt;
                                    throw $break;
                                }
                            });

                            if (term.operator == 'equalCountry') {
                                if (option.selected) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            } else if (term.operator == 'notEqualCountry') {
                                if (!option.selected) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            }
                        }
                        break;
                    case "birthdate":
                    case "datetime":
                        value = (fieldType == "datetime") ? JotForm.getDateValue(term.field) : JotForm.getBirthDate(term.field);
                        if (value === undefined) {
                            return;
                            /* continue; */
                        }

                        if (['isEmpty', 'isFilled'].include(term.operator)) {
                            if (JotForm.checkValueByOperator(term.operator, term.value, value)) {
                                any = true;
                            } else {
                                all = false;
                            }

                        } else {
                            var termValue = term.value;
                            termValue = term.value.toLowerCase().replace(/\s/g,"");
                            if (termValue.indexOf('today') > -1) {
                                var offset = parseInt(termValue.split('today')[1]) || 0;
                                var comparativeDate = new Date();
                                comparativeDate.setDate(comparativeDate.getDate() + offset);
                                var year = comparativeDate.getFullYear();
                                var month = comparativeDate.getMonth() + 1;
                                month = (month < 10) ? '0' + month : month;
                                var day = comparativeDate.getDate();
                                day = (day < 10) ? '0' + day : day;
                                termValue = year + "-" + month + "-" + day;
                            }

                            if (['equalDate', 'notEqualDate', 'after'].include(term.operator)) {
                                if (JotForm.checkValueByOperator(term.operator, JotForm.strToDate(termValue), JotForm.strToDate(value.split('T')[0]))) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            } else if (['equalDay', 'notEqualDay'].include(term.operator)) {
                                if (JotForm.checkValueByOperator(term.operator, termValue, JotForm.strToDate(value))) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            } else {
                                if (JotForm.checkValueByOperator(term.operator, JotForm.strToDate(termValue), JotForm.strToDate(value))) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            }
                        }
                        break;
                    case "time":
                        value = JotForm.get24HourTime(term.field);
                        var termValue = (!term.value) ? "" : term.value.replace(/:/, "");
                        if (termValue.length == 3) termValue = "0" + termValue;
                        if (term.operator == 'before' && value.empty()) {
                            all = false;
                        } else {
                            if (JotForm.checkValueByOperator(term.operator, termValue, value))
                                any = true;
                            else
                                all = false;
                        }
                        break;
                    case "checkbox":
                    case "radio":
                        if (['isEmpty', 'isFilled'].include(term.operator)) {
                            filled = $$('#id_' + term.field + ' input').collect(function (e) {
                                return e.checked;
                            }).any();

                            if (JotForm.checkValueByOperator(term.operator, term.value, filled)) {
                                any = true;
                            } else {
                                all = false;
                            }

                            return;
                            /* continue; */
                        }
                        if (term.value) term.value = term.value.replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<');

                        if (['lessThan', 'greaterThan'].include(term.operator)) {
                            var localResult = false;
                            $$('#id_' + term.field + ' input').each(function (input) {
                                value = input.checked ? input.value : '';
                                if (JotForm.checkValueByOperator(term.operator, term.value, value)) {
                                    any = true;
                                    localResult = true;
                                }
                            });
                            if (!localResult) all = false;
                            return;
                        }

                        var otherValue = $('id_' + term.field).down(".form-"+fieldType+"-other-input") ? $('id_' + term.field).down(".form-"+fieldType+"-other-input").getAttribute('data-otherHint') : "";
                        $$('#id_' + term.field + ' input').each(function (input) {
                            if (input.hasClassName('form-' + fieldType + '-other') && input.checked) {
                                value = '-- '+otherValue+' --';
                            } else {
                                value = input.checked ? input.value : '';
                                value = value.replace(/_expanded/, '');
                            }
                            var termValue = term.value.strip();
                            if (JotForm.checkValueByOperator(term.operator, termValue, value)) {
                                any = true;
                            } else {
                                // If not equals item is found condition should fail
                                if (term.operator == 'notEquals' && termValue == value) {
                                    any = false;
                                    all = false;
                                    throw $break;
                                }

                                if (input.value == termValue || (input.hasClassName('form-' + fieldType + '-other') && termValue == '-- '+otherValue+' --')) {
                                    all = false;
                                }
                            }
                        });
                        break;
                    case "select":

                        if (term.value) term.value = term.value.replace(/&amp;/g, '&');

                        if ($('input_' + term.field) && $('input_' + term.field).multiple) {
                            if (term.operator == 'equals') {
                                var option = $('input_' + term.field).select('option[value=' + term.value + ']');
                                if (option.length > 0 && option[0].selected) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            } else if (term.operator == 'notEquals') {
                                var option = $('input_' + term.field).select('option[value=' + term.value + ']');
                                if (option.length > 0 && !option[0].selected) {
                                    any = true;
                                } else {
                                    all = false;
                                }
                            } else if (['isEmpty', 'isFilled'].include(term.operator)) {
                                var selected = false;
                                var arr = $('input_' + term.field).options;
                                for (var i = 0; i < arr.length; i++) {
                                    if (!arr[i].value.empty() && arr[i].selected == true) {
                                        selected = true;
                                    }
                                }
                                if (term.operator == 'isEmpty') {
                                    if (!selected) any = true;
                                    else all = false;
                                }
                                if (term.operator == 'isFilled') {
                                    if (selected) any = true;
                                    else all = false;
                                }
                            }
                        } else if ($('input_' + term.field)) {
                            value = $('input_' + term.field).value;
                            if (value === undefined) {
                                return;
                                /* continue; */
                            }
                            if (JotForm.checkValueByOperator(term.operator, term.value, value)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        } else {
                            filled = $$('#id_' + term.field + ' select').collect(function (e) {
                                return e.value;
                            }).any();
                            if (JotForm.checkValueByOperator(term.operator, term.value, filled)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        }
                        break;
                    case "grading":
                        if (['isEmpty', 'isFilled'].include(term.operator)) {
                            filled = $$('input[id^=input_' + term.field + '_]').collect(function (e) {
                                return e.value;
                            }).any();
                            if (JotForm.checkValueByOperator(term.operator, term.value, filled)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        } else {
                            value = $('grade_point_' + term.field).innerHTML.stripTags();
                            if (JotForm.checkValueByOperator(term.operator, term.value, value)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        }
                        break;
                    case "file":
                        if ($('id_' + term.field).select('.qq-uploader').length > 0) {
                            value = $('id_' + term.field).select('.qq-upload-file').length > 0;
                        } else {
                            if ($('input_' + term.field).uploadMarked) {
                                value = $('input_' + term.field).uploadMarked;
                            } else {
                                value = $('input_' + term.field).value;
                            }
                        }

                        if (value === undefined) {
                            return;
                            /* continue; */
                        }
                        if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                            any = true;
                        } else {
                            all = false;
                        }
                        break;

                    case "textarea":
                        value = $('input_' + term.field).value;
                        if ($('input_' + term.field).hinted || $('input_' + term.field).hasClassName('form-custom-hint')) {
                            value = "";
                        }
                        if (value === undefined) {
                            return;
                            /* continue; */
                        }
                        var rich = $('id_' + term.field).down('.nicEdit-main');
                        if (rich) {
                            value = value.stripTags().replace(/\s/g, ' ').replace(/&nbsp;/g, ' ');
                        }

                        if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                            any = true;
                        } else {
                            all = false;
                        }
                        break;

                    case "widget":
                        value = $('input_' + term.field).value;
                        if (value === undefined) {
                            return;
                        }
                        if (value.indexOf("widget_metadata") > -1) { //object not simple
                            try {
                                value = JSON.parse(value).widget_metadata.value;
                                var matchingItem = false;
                                for (var i = 0; i < value.length; i++) {
                                    var obj = value[i];
                                    for (var item in obj) {
                                        if (JotForm.checkValueByOperator(term.operator, term.value, obj[item], term.field)) {
                                            any = true;
                                            matchingItem = true;
                                        }
                                    }
                                }
                                if (!matchingItem) all = false;
                            } catch (e) {
                                console.log(e);
                            }

                        } else {
                            if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                                any = true;
                            } else {
                                all = false;
                            }
                        }

                        break;

                    case "hidden":
                        if($('input_' + term.field + "_donation")) {
                            value = $('input_' + term.field + "_donation").value;
                        } else {
                            value = $('input_' + term.field).value;
                        }
                        if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                            any = true;
                        } else {
                            all = false;
                        }
                        break;

                    case "rating":
                        value = $('input_' + term.field).value || '';
                        if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                            any = true;
                        } else {
                            all = false;
                        }
                        break;

                    default:
                        if(!$('input_' + term.field)) {
                            return;
                        }

                        value = $('input_' + term.field).value;
                        if ($('input_' + term.field).hinted) {
                            value = "";
                        }
                        if (value === undefined) {
                            return;
                            /* continue; */
                        }
                        if (JotForm.checkValueByOperator(term.operator, term.value, value, term.field)) {
                            any = true;
                        } else {
                            all = false;
                        }
                }

            } catch (e) {
                JotForm.error(e);
            }
        });


        if (condition.type == 'field') { // Field Condition
            // JotForm.log("any: %s, all: %s, link: %s", any, all, condition.link.toLowerCase());
            var isConditionValid = (condition.link.toLowerCase() == 'any' && any) || (condition.link.toLowerCase() == 'all' && all);

            condition.action.each(function (action) {
                var matchingTermAction = condition.terms.any(function (term) {return term.field == action.field; });

                if (isConditionValid) {
                    action.currentlyTrue = true;
                    if (action.visibility.toLowerCase() == 'show') {
                        JotForm.showField(action.field);
                    } else if (action.visibility.toLowerCase() == 'hide') {
                        JotForm.hideField(action.field, false, matchingTermAction);
                    } else if (action.visibility.toLowerCase() == 'showmultiple' && action.fields) {
                        action.fields.each(function (field) {
                            JotForm.showField(field, true);
                        });
                    } else if (action.visibility.toLowerCase() == 'hidemultiple' && action.fields) {
                        action.fields.each(function (field) {
                            JotForm.hideField(field, true, matchingTermAction);
                        });
                    }
                } else {
                    action.currentlyTrue = false;
                    if (action.visibility.toLowerCase() == 'show') {
                        JotForm.hideField(action.field, false, matchingTermAction);
                    } else if (action.visibility.toLowerCase() == 'hide') {
                        JotForm.showField(action.field);
                    } else if (action.visibility.toLowerCase() == 'showmultiple' && action.fields) {
                        action.fields.each(function (field) {
                            JotForm.hideField(field, true, matchingTermAction);
                        });
                    } else if (action.visibility.toLowerCase() == 'hidemultiple' && action.fields) {
                        action.fields.each(function (field) {
                            JotForm.showField(field, true);
                        });
                    }
                }

                JotForm.iframeHeightCaller();

                if ($('section_' + action.field)) {
                    JotForm.runAllCalculations(true);
                }
                if ($('input_' + action.field) && $('input_' + action.field).triggerEvent) {
                    if (!matchingTermAction) {  //rule matches action so don't rerun to avoid infinite loop
                        $('input_' + action.field).triggerEvent('keyup'); //trigger calculations when hiding/showing
                    }
                }

            });
        } else if (condition.type == 'require') {
            var isConditionValid = (condition.link.toLowerCase() == 'any' && any) || (condition.link.toLowerCase() == 'all' && all);
            condition.action.each(function (action) {
                action.currentlyTrue = isConditionValid;

                if (action.visibility.toLowerCase() == 'require') {
                    JotForm.requireField(action.field, isConditionValid);
                } else if (action.visibility.toLowerCase() == 'unrequire') {
                    JotForm.requireField(action.field, !isConditionValid);
                } else if (action.visibility.toLowerCase() == 'requiremultiple' && action.fields) {
                    action.fields.each(function (field) {
                        JotForm.requireField(field, isConditionValid);
                    });
                } else if (action.visibility.toLowerCase() == 'unrequiremultiple' && action.fields) {
                    action.fields.each(function (field) {
                        JotForm.requireField(field, !isConditionValid);
                    });
                } else if(action.visibility.toLowerCase() == 'enable') {
                    JotForm.enableDisableField(action.field, isConditionValid);
                } else if(action.visibility.toLowerCase() == 'disable') {
                    JotForm.enableDisableField(action.field, !isConditionValid);
                 }
            });
        } else if (condition.type == 'mask') {
            condition.action.each(function (action) {
                if ((condition.link.toLowerCase() == 'any' && any) || (condition.link.toLowerCase() == 'all' && all)) {
                    condition.conditionTrue = true;
                    JotForm.setQuestionMasking("#input_" + action.field, "textMasking", action.mask);
                    $("input_" + action.field).writeAttribute('masked', "true");
                } else {
                    condition.conditionTrue = false;
                    //if no other mask conditions for this field are true remove the mask
                    var removeMask = true;
                    $A(JotForm.conditions).each(function (cond) {
                        if (cond.disabled == true) return; //go to next condition
                        if (cond.type !== 'mask') return;
                        if (!cond.conditionTrue) return;
                        $A(cond.action).each(function (act) {
                            if (act.field == action.field) {
                                removeMask = false; //there is a different true mask cond on this field so do not remove mask
                            }
                        });
                    });

                    if (removeMask) {
                        JotForm.setQuestionMasking("#input_" + action.field, "", "", true);
                        $("input_" + action.field).writeAttribute('masked', "false");
                    }
                }
            });

        } else if (condition.type == 'calculation') {
            if (!$("id_" + condition.action[0].resultField)) {
                return;
            }

            var calcs = JotForm.calculations;
            var cond = null;
            for (var i = 0; i < calcs.length; i++) {
                if (calcs[i].conditionId === condition.id) {
                    calc = calcs[i];
                }
            }
            if ((condition.link.toLowerCase() == 'any' && any) || (condition.link.toLowerCase() == 'all' && all)) {
                calc.conditionTrue = true;
                if(JotForm.ignoreInsertionCondition) return;
                JotForm.checkCalculation(calc);
            } else {
                calc.conditionTrue = false;
                if(JotForm.ignoreInsertionCondition) return;

                //check if any other conditions are true for this result field
                setTimeout(function (calc) {
                    var matchForThisResult = {};
                    var subfield;
                    for (var i = 0; i < calcs.length; i++) {
                        if ((condition.action[0].resultField == calcs[i].resultField && calcs[i].hasOwnProperty('conditionTrue') && calcs[i].conditionTrue)
                            && !(JotForm.getInputType(condition.action[0].resultField) === "html" && condition.action[0].replaceText !== calcs[i].replaceText)) {
                            subfield = calcs[i].resultSubField || "";
                            matchForThisResult[calcs[i].resultField+subfield] = true;
                        }
                    }

                    subfield = "resultSubField" in condition.action[0] ? condition.action[0].resultSubField : "";
                    if (!matchForThisResult[condition.action[0].resultField+subfield]) {
                        try {
                            var dontTrigger = condition.terms.map(function (term) {
                                return term.field === condition.action[0].resultField;
                            }).any();
                            if(!dontTrigger) {
                                dontTrigger = condition.action[0].operands && condition.action[0].operands.split(',').include(condition.action[0].resultField);
                            }
                            JotForm.clearField(condition.action[0].resultField, subfield, dontTrigger);
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }, 50, calc);
            }
        } else { // Page condition

            JotForm.log("any: %s, all: %s, link: %s", any, all, condition.link.toLowerCase());
            if (JotForm.nextPage) {
                return;
            }
            if ((condition.link.toLowerCase() == 'any' && any) || (condition.link.toLowerCase() == 'all' && all)) {
                var action = condition.action[0];
                JotForm.info('Correct: Skip To: ' + action.skipTo);
                var sections = $$('.page-section');
                if (action.skipTo == 'end') {
                    JotForm.nextPage = sections[sections.length - 1];
                } else {
                    JotForm.nextPage = sections[parseInt(action.skipTo.replace('page-', ''), 10) - 1];
                }

            } else {

                JotForm.info('Fail: Skip To: page-' + JotForm.currentPage + 1);

                JotForm.nextPage = false;
            }
        }
        JotForm.enableDisableButtonsInMultiForms();
    },
    currentPage: false,
    nextPage: false,
    previousPage: false,
    fieldConditions: {},

    setFieldConditions: function (field, event, condition) {
        if (!JotForm.fieldConditions[field]) {
            JotForm.fieldConditions[field] = {
                event: event,
                conditions: []
            };
        }
        JotForm.fieldConditions[field].conditions.push(condition);
    },

    widgetsAsCalculationOperands: [],

    /*
     * Require or Unrequire a field
     */
    requireField: function (qid, req) {

        if (!$('id_' + qid)) return;
        if (JotForm.otherConditionTrue(qid, req ? 'unrequire' : 'require')) return;

        $$('#id_' + qid + ' input, #id_' + qid + ' textarea, #id_' + qid + ' select').each(function (el) {

            //do not required non-necessary parts of combined field
            if (el.id === 'coupon-input'
                || (el.type === 'hidden' && !el.up('.form-star-rating') && !el.hasClassName('form-widget'))
                || el.hasClassName('form-checkbox-other-input') || el.hasClassName('form-radio-other-input')
                || $A(['prefix', 'middle', 'suffix', 'addr_line2', 'state']).any(function (name) {
                    return el.name.indexOf("[" + name + "]") > -1;
                })) {
                return;
            }

            //get all validations
            var validations = [];
            if (el.className.indexOf('validate[') > -1) {
                validations = el.className.substr(el.className.indexOf('validate[') + 9);
                validations = validations.substr(0, validations.indexOf(']')).split(/\s*,\s*/);
            } else {
                validations = [];
            }

            if (JotForm.getInputType(qid) == "file" && el.getAttribute("multiple") == "multiple" && el.up('.jf-required')) {
                el.up('.jf-required').className = el.up('.jf-required').className.replace(/validate\[required\]/gi, '');
                if (req) {
                    el.up('.jf-required').addClassName("validate[required]");
                } else {
                    el.up('.jf-required').removeClassName("form-validation-error");
                }
            }

            //remove all validation from class
            el.className = el.className.replace(/validate\[.*\]/, '');

            //remove required from validations array
            for (var i = validations.length - 1; i >= 0; i--) {
                if (validations[i] === 'required') {
                    validations.splice(i, 1);
                }
            }

            if (req) {
                validations.push('required'); //add required to validations
                if (el.hasClassName('form-widget')) {
                    el.addClassName('widget-required');
                }
            } else {
                el.removeClassName('form-validation-error');
                el.removeClassName('widget-required');
            }

            //add validations back to class
            if (validations.length > 0) {
                el.addClassName('validate[' + validations.join(',') + ']');
            }

            JotForm.setFieldValidation(el);
        });
        if (req) {
            if ($('label_' + qid) && !$('label_' + qid).down('.form-required')) {
                $('label_' + qid).insert('<span class="form-required">*</span>');
            }
        } else {
            if ($('label_' + qid) && $('label_' + qid).down('.form-required')) {
                $('label_' + qid).down('.form-required').remove();
            }

            //remove any existing errors
            if ($("id_" + qid).down('.form-error-message')) {
                $("id_" + qid).down('.form-error-message').remove();
            }
            $("id_" + qid).removeClassName('form-line-error');

            if ($$('.form-line-error').length == 0) {
                JotForm.hideButtonMessage();
            }
        }
    },

    enableDisableField: function(qid, enable) {
        if (!$('id_' + qid)) return;

        try {
            $('id_' + qid).select("input, textarea, select, button").each(function(input) {
                if(enable) {
                    input.removeClassName("conditionallyDisabled");
                    input.enable();
                } else {
                    input.addClassName("conditionallyDisabled");
                    input.disable();
                }
            });
        } catch(e) {console.log(e);}
    },

    /**
     * When widget value is updated check whether to trigger calculation
     */
    triggerWidgetCalculation: function (id) {
        if (JotForm.widgetsAsCalculationOperands.include(id)) {
            if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', true, true);
                $('input_' + id).dispatchEvent(evt);
            } else if ($('input_' + id).fireEvent) {
                return $('input_' + id).fireEvent('onchange');
            }
        }
    },


    setCalculationResultReadOnly: function () {
        $A(JotForm.calculations).each(function (calc, index) {
            if (calc.readOnly && $('input_' + calc.resultField) != null) {
                $('input_' + calc.resultField).setAttribute('readOnly', 'true');
            }
        });
    },

    setCalculationEvents: function () {
        var setCalculationListener = function (el, ev, calc) {
            $(el).observe(ev, function () {
                if (ev === "paste") { //same action as other events but wait for the text to be pasted
                    setTimeout(function () {
                        el.addClassName('calculatedOperand');
                        JotForm.checkCalculation(calc);
                    }, 10);
                } else {
                    el.addClassName('calculatedOperand');
                    JotForm.checkCalculation(calc);
                }
            });
        };

        $A(JotForm.calculations).each(function (calc, index) {
            if (!calc.operands) return;
            var ops = calc.operands.split(',');
            for (var i = 0; i < ops.length; i++) {

                var opField = ops[i];
                if (!opField || opField.empty() || !$('id_' + opField)) continue;

                var type = JotForm.calculationType(opField),
                    ev;

                switch (type) {
                    case "widget":
                        setCalculationListener($('id_' + opField), 'change', calc);
                        JotForm.widgetsAsCalculationOperands.push(opField);
                        break;

                    case 'radio':
                    case 'checkbox':
                        setCalculationListener($('id_' + opField), 'click', calc);
                        if ($('input_' + opField)) {
                            setCalculationListener($('id_' + opField), 'keyup', calc);
                        }
                        break;

                    case 'select':
                    case 'file':
                        if (Protoplus && Protoplus.getIEVersion && Protoplus.getIEVersion() == 8) {
                            setCalculationListener($('id_' + opField), 'click', calc);
                        } else {
                            setCalculationListener($('id_' + opField), 'change', calc);
                        }
                        break;

                    case 'datetime':
                        setCalculationListener($('id_' + opField), 'date:changed', calc);
                        $$("#id_" + opField + ' select').each(function (el) {
                            setCalculationListener($(el), 'change', calc);
                        });
                        break;

                    case 'time':
                    case 'birthdate':
                        $$("#id_" + opField + ' select').each(function (el) {
                            setCalculationListener($(el), 'change', calc, index);
                        });
                        break;

                    case 'address':
                        setCalculationListener($('id_' + opField), 'change', calc, index);
                        setCalculationListener($('id_' + opField), 'blur', calc, index);
                        setCalculationListener($('id_' + opField), 'keyup', calc, index);
                        $$("#id_" + opField + ' select').each(function (el) {
                            setCalculationListener($(el), 'change', calc, index);
                        });
                        break;

                    case 'number':
                        setCalculationListener($('id_' + opField), 'keyup', calc, index);
                        setCalculationListener($('id_' + opField), 'paste', calc, index);
                        setCalculationListener($('id_' + opField), 'click', calc, index);
                        break;

                    default:
                        setCalculationListener($('id_' + opField), 'change', calc, index);
                        setCalculationListener($('id_' + opField), 'blur', calc, index);
                        setCalculationListener($('id_' + opField), 'keyup', calc, index);
                        setCalculationListener($('id_' + opField), 'paste', calc, index);
                        break;
                }
            }
        });
    },

    runAllCalculations: function (ignoreEditable, htmlOnly) {
        $A(JotForm.calculations).each(function (calc, index) {
            if(htmlOnly && JotForm.getInputType(calc.resultField) !== "html") return;
            if (!(ignoreEditable && !calc.readOnly) && !!calc.equation) {
                JotForm.checkCalculation(calc);
            }
        });
    },

    calculationType: function (id) {
        var paymentTypes = ['control_stripe', 'control_paymill', 'control_payment', 'control_paypal', 'control_paypalexpress', 'control_paypalpro', 'control_clickbank', 'control_2co', 'control_googleco', 'control_worldpay', 'control_onebip', 'control_authnet', 'control_dwolla', 'control_braintree'];
        if ($('id_' + id) && $('id_' + id).readAttribute('data-type') && paymentTypes.include($('id_' + id).readAttribute('data-type'))) {
            return $('id_' + id).readAttribute('data-type').replace("control_", "");
        } else if ($('id_' + id) && $('id_' + id).readAttribute('data-type') == 'control_matrix') {
            return 'matrix';
        } else {
            return JotForm.getInputType(id);
        }
    },

    checkCalculation: function (calc) {

        if (calc.hasOwnProperty('conditionTrue') && !calc.conditionTrue) {
            return '';
        }

        var result = calc.resultField;
        var showBeforeInput = calc.showBeforeInput;
        var ignoreHidden = calc.ignoreHiddenFields;
        var useCommasForDecimals = calc.useCommasForDecimals;

        if (!$('id_' + result)) return;
        try {
            if (!['text', 'email', 'textarea', 'calculation', 'combined', 'address', 'datetime', 'time', 'html', 'authnet', 'paypalpro', 'number', 'radio', 'checkbox', 'select', 'matrix', 'braintree', 'stripe'].include(JotForm.calculationType(result))) return;
        } catch (e) {
            console.log(e);
        }

        var combinedObject = {};

        var getValue = function (data, numeric) {

            var subField = "";
            if (data.indexOf("_") > -1) { //matrix sub field
                subField = data.substring(data.indexOf("_"));
                data = data.substring(0, data.indexOf("_"));
            }

            if (!$('id_' + data)) return '';

            if (!$('id_' + data).hasClassName('calculatedOperand') && showBeforeInput) return ''; //no input yet so ignore field
            if (ignoreHidden && ($('id_' + data).hasClassName("form-field-hidden") || ($('id_' + data).up(".form-section") && $('id_' + data).up(".form-section").hasClassName("form-field-hidden")))) {
                return numeric ? 0 : '';
            }

            var type = JotForm.calculationType(data);
            var val = '';

            switch (type) {
                case 'matrix':
                    if ($("id_" + data).down('.form-radio')) {
                        var rowNum = parseInt(subField.replace("_", "")) + 2;
                        var row = $("id_" + data).down("tr:nth-child(" + rowNum + ")");
                        row.select(".form-radio").each(function (radio) {
                            if (radio.checked) {
                                val = radio.readAttribute('calcValue') ? radio.readAttribute('calcValue') : radio.value;
                            }
                        });
                    } else {
                        if ($("input_" + data + subField)) {
                            if ($("input_" + data + subField).type == "checkbox") {
                                if ($("input_" + data + subField).checked) {
                                    var chk = $("input_" + data + subField);
                                    if (chk.readAttribute('calcValue')) {
                                        val = chk.readAttribute('calcValue');
                                    } else {
                                        val = chk.value;
                                    }
                                }
                            } else {
                                val = $("input_" + data + subField).value;
                            }
                        }
                    }
                    break;
                case 'stripe':
                case 'paymill':
                case 'payment':
                case 'paypal':
                case 'paypalexpress':
                case 'paypalpro':
                case 'clickbank':
                case '2co':
                case 'googleco':
                case 'worldpay':
                case 'onebip':
                case 'authnet':
                case 'dwolla':
                case 'braintree':
                    if ($("id_" + data).down('#payment_total')) {
                        val = $("id_" + data).down('#payment_total').innerHTML;
                    } else if ($('input_' + data + '_donation')) {
                        val = $('input_' + data + '_donation').value;
                    }
                    if(JotForm.currencyFormat && JotForm.currencyFormat.dSeparator === ",") {
                        val = val.replace(/\./g, "").replace(/\,/g, ".");
                    }

                    break;
                case 'radio':
                    $$("#id_" + data + ' input[type="radio"]').each(function (rad, i) {
                        if (rad.checked) {
                            if (rad.readAttribute('calcValue')) {
                                val = rad.readAttribute('calcValue');
                            } else {
                                if(typeof FormTranslation !== 'undefined' && rad.next()) {
                                    val = rad.next().innerHTML;
                                } else {
                                    val = rad.value;
                                }
                            }
                        }
                    });
                    break;

                case 'checkbox':

                    var valArr = [];
                    $$("#id_" + data + ' input[type="checkbox"]').each(function (chk, i) {
                        if (chk.checked) {
                            if (chk.readAttribute('calcValue')) {
                                valArr.push(chk.readAttribute('calcValue'));
                            } else {
                                if(typeof FormTranslation !== 'undefined' && chk.next()) {
                                    valArr.push(chk.next().innerHTML);
                                } else {
                                    valArr.push(chk.value);
                                }
                            }
                        }
                    });

                    if (numeric) {
                        val = valArr.inject(0, function (accum, thisVal) {
                            return accum + (parseFloat(thisVal.replace(/-?([^0-9])/g, "$1").replace(/[^0-9\.-]/g, "")) || 0);
                        });
                    } else {
                        val = valArr.join();
                    }
                    break;

                case 'select':

                    if ($('input_' + data).readAttribute('multiple') === 'multiple') {
                        if (numeric) val = 0;

                        $('input_' + data).select('option').each(function (option, ind) {
                            var option = $('input_' + data).options[ind];
                            if (option && option.selected) {
                                var current = option.readAttribute('calcValue') ? option.readAttribute('calcValue') : option.innerHTML;
                                if(numeric) {
                                    val += (current === "") ? 0 : parseFloat(current.replace(/[^0-9.]/g, ""));
                                } else {
                                    val +=  current;
                                }
                            }
                        });
                    } else {
                        var option = $('input_' + data).options[$('input_' + data).selectedIndex];
                        if (option) {
                            val = option.readAttribute('calcValue') ? option.readAttribute('calcValue') : option.innerHTML;
                        }
                    }
                    break;

                case 'number':
                    if ($$("#id_" + data + ' input[type="number"]').length > 1) { //ranges
                        var valArr = [];
                        $$("#id_" + data + ' input[type="number"]').each(function (el) {
                            valArr.push(el.value);
                        });
                        val = valArr.join(' ');
                    } else {
                        if (!$('input_' + data).value.empty() && !isNaN($('input_' + data).value)) {
                            val = parseFloat($('input_' + data).value);
                        }
                    }
                    break;

                case 'combined':
                case 'grading':
                    var valArr = [];
                    combinedObject = {};
                    $$("#id_" + data + ' input[type="text"]').each(function (el) {
                        if (!el.value.empty()) {
                            valArr.push(el.value);
                        }
                        var id = el.id.replace(/_.*/, "");
                        combinedObject[id] = el.value;

                    });
                    $$("#id_" + data + ' input[type="tel"]').each(function (el) {
                        if (!el.value.empty()) {
                            valArr.push(el.value);
                        }
                        var id = el.id.replace(/input_[0-9].*_+/, "");
                        combinedObject[id] = el.value;
                    });
                    val = valArr.join(' ');
                    break;

                case 'datetime':
                    var valArr = [];
                    if (numeric) {
                        valArr.push($("month_" + data).value);
                        valArr.push($("day_" + data).value);
                        valArr.push($("year_" + data).value);
                    } else {
                        $$("#id_" + data + ' input[type="tel"]').each(function (el) {
                            valArr.push(el.value);

                            var id = el.id.replace(/_.*/, "");
                            combinedObject[id] = el.value;
                        });

                        $$("#id_" + data + ' select').each(function (el) {
                            var id = el.id.replace(/_.*/, "");
                            combinedObject[id] = el.value;
                        });
                    }

                    $$("#id_" + data + ' select').each(function (el) {
                        valArr.push(el.value);
                    });

                    //if numeric calculation calculate the number of days in epoch
                    if (numeric) {

                        if(!valArr[0].empty() && !valArr[1].empty() && !valArr[2].empty()) {
                            var hours = mins = ampm = '';
                            if (valArr.length > 4 && !valArr[3].empty() && !valArr[4].empty()) {
                                hours = parseInt(valArr[3]);
                                //convert to 24hours
                                if (valArr.length == 6 && !valArr[5].empty()) {
                                    ampm = valArr[5];
                                    if (ampm == 'PM' && hours != 12) {
                                        hours += 12;
                                    } else if (ampm == 'AM' && hours == 12) {
                                        hours = 0;
                                    }
                                }
                                mins = valArr[4];
                            }
                            var millis = Date.UTC(valArr[2], valArr[0] - 1, valArr[1], hours, mins);
                            val = millis / 60 / 60 / 24 / 1000;
                        } else {
                            val = 0;
                        }
                    } else {
                        if (valArr.length > 2 && !valArr[0].empty() && !valArr[1].empty() && !valArr[0].empty()) {
                            val = valArr[0] + '/' + valArr[1] + '/' + valArr[2];
                        }
                        if (valArr.length > 4 && !valArr[3].empty() && !valArr[4].empty()) {
                            val += ' ' + valArr[3] + ':' + valArr[4];
                            if (valArr.length == 6 && !valArr[5].empty()) val += ' ' + valArr[5]; //ampm
                        }
                    }

                    break;

                case 'time':
                    if (subField == "_duration") {
                        if ($("duration_" + data + "_ampmRange")) {
                            if (numeric) {
                                var duration = $("duration_" + data + "_ampmRange").value;
                                if (duration.indexOf(":") > -1) {
                                    var time = duration.split(":");
                                    var hours = time[0] || 0;
                                    var mins = time[1] || 0;
                                    var millis = Date.UTC('1970', '0', '1', hours, mins);
                                    val = millis / 60 / 60 / 1000;
                                }
                            } else {
                                val = $("duration_" + data + "_ampmRange").value;
                            }
                        }
                        break;
                    }
                    var valArr = [];
                    combinedObject = {};

                    if (numeric) {
                        $$("#id_" + data + ' select').each(function (el) {
                            valArr.push(el.value);
                        });
                        var hour, mins, ampm = '';
                        hours = parseInt(valArr[0]) || 0;
                        if (valArr.length == 3 && !valArr[2].empty()) {
                            ampm = valArr[2];
                            if (ampm == 'PM' && hours != 12) {
                                hours += 12;
                            } else if (ampm == 'AM' && hours == 12) {
                                hours = 0;
                            }
                        }
                        mins = valArr[1];
                        var millis = Date.UTC('1970', '0', '1', hours, mins);
                        val = millis / 60 / 60 / 1000;
                    } else {

                        if ($("input_" + data + "_hourSelect") && !$("input_" + data + "_hourSelect").value.empty() && $("input_" + data + "_minuteSelect") && !$("input_" + data + "_minuteSelect").value.empty()) {
                            val = $("input_" + data + "_hourSelect").value + ":" + $("input_" + data + "_minuteSelect").value;
                            if ($("input_" + data + "_ampm")) {
                                val += " " + $("input_" + data + "_ampm").value;
                            }
                        }

                        if ($("input_" + data + "_hourSelectRange") && !$("input_" + data + "_hourSelectRange").value.empty() && $("input_" + data + "_minuteSelectRange") && !$("input_" + data + "_minuteSelectRange").value.empty()) {
                            val += " - " + $("input_" + data + "_hourSelectRange").value + ":" + $("input_" + data + "_minuteSelectRange").value;
                            if ($("input_" + data + "_ampmRange")) {
                                val += " " + $("input_" + data + "_ampmRange").value;
                            }

                            if ($("duration_" + data + "_ampmRange") && !$("duration_" + data + "_ampmRange").value.empty()) {
                                val += " (" + $("duration_" + data + "_ampmRange").value + ")";
                            }
                        }

                        $$("#id_" + data + ' select').each(function (el) {
                            var id = el.id.replace(/.*_.*_/, "");
                            combinedObject[id] = el.value;
                        });
                    }
                    break;

                case 'birthdate':
                    var valArr = [];
                    if (numeric) {
                        try {
                            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                            var months = monthNames.indexOf($("input_" + data + "_month").value);
                            var days = $("input_" + data + "_day").value;
                            var years = $("input_" + data + "_year").value;
                            var millis = new Date(years, months, days).getTime();
                            val = millis / 60 / 60 / 24 / 1000;
                        } catch (e) {
                            console.log("birthdate error");
                            console.log(e);
                        }
                    } else {
                        $$("#id_" + data + ' select').each(function (el) {
                            valArr.push(el.value);
                        });
                        if (!valArr[0].empty() && !valArr[1].empty() && !valArr[2].empty()) {
                            val = valArr[0] + ' ' + valArr[1] + ' ' + valArr[2];
                        }
                    }
                    break;

                case 'address':
                    var valArr = [];
                    combinedObject = {};
                    $$("#id_" + data + ' input[type="text"]').each(function (el) {
                        if (!el.value.empty()) {
                            valArr.push(el.value);
                        }
                        var id = el.id.replace(/input_[0-9].*?_+/, "");
                        combinedObject[id] = el.value;

                    });
                    $$("#id_" + data + ' select').each(function (el) {
                        if (!el.value.empty()) {
                            valArr.push(el.value);
                        }
                        var id = el.id.replace(/input_[0-9].*_+/, "");
                        combinedObject[id] = el.value;
                    });
                    val = valArr.join(', ');
                    break;

                case 'file':
                    val = $('input_' + data).value;
                    val = val.substring(val.lastIndexOf("\\") + 1);
                    break;

                case 'textarea':
                    if ($('input_' + data) && typeof $('input_' + data).value !== 'undefined') {
                        val = $('input_' + data).value;
                        var rich = $('id_' + data).down('.nicEdit-main');
                        if (rich) {
                            val = val.stripTags().replace(/\s/g, ' ').replace(/&nbsp;/g, ' ');
                        }
                    }
                    break;

                case 'widget':
                    var widgetType = JotForm.getWidgetType(data);
                    switch(widgetType) {
                        case "timer":
                        case "fancyTimer":
                            if(numeric) {
                                val = $('input_' + data).value;
                            } else {
                                var seconds = $('input_' + data).value;
                                var minutes = Math.floor(seconds/60);
                                seconds = seconds -  (minutes*60);
                                seconds = JotForm.addZeros(seconds, 2);
                                val = minutes + ":" + seconds;
                            }
                            break;

                        case "configurableList":
                        case "dynMatrix":
                            var br = JotForm.calculationType(result) === "html" ? "<br/>" : "\n";
                            var json = $('input_' + data).value;
                            try {
                                json = JSON.parse(json);
                                for(var i=0; i<json.length; i++) {
                                    var valArr = [];
                                    for(line in json[i]) {
                                        if(!json[i].hasOwnProperty(line)) continue;
                                        if(!json[i][line].empty()) {
                                            valArr.push(json[i][line]);
                                        }
                                    }
                                    val += valArr.join(",") + br;
                                }
                            } catch(e) {
                                console.log($('input_' + data).value);
                                console.log(calc)
                            }
                            break;

                        case "giftRegistry":
                            val = $('input_' + data).value;
                            if(JotForm.calculationType(result) === "html") {
                                val = val.replace(/\n/g, "<br/>");
                            }
                            break;

                        case "imagelinks":
                        case "links":
                            var br = JotForm.calculationType(result) === "html" ? "<br/>" : "\n";
                            var json = JSON.parse($('input_' + data).value).widget_metadata.value;
                            for(var i=0; i<json.length; i++) {
                                if(json[i].url.replace(/\s/g, "").empty()) continue;
                                var showName = json[i].name && !json[i].name.replace(/\s/g, "").empty();
                                if(JotForm.calculationType(result) === "html") {
                                    if(widgetType === "imagelinks") {
                                        val += '<a href="'+json[i].url+'"><img src="'+json[i].url+'" /></a>';
                                    } else {
                                        val += '<a href="'+json[i].url+'">'+(showName ? json[i].name : json[i].url)+'</a>';
                                    }
                                } else {
                                    val += showName ? json[i].name + ": " : "";
                                    val += json[i].url + br;
                                }
                            }
                            break;

                        case "htmltext":
                            var b64 =  JSON.parse($('input_' + data).value).widget_metadata.value;
                            val = window.atob ? window.atob(b64) : "";
                            if(JotForm.calculationType(result) !== "html") {
                                val = val.strip().replace(/<br>/g, "\n").stripTags().replace(/&nbsp;/g,' ');
                            }
                            break;

                        case "drivingDistance":
                            val = $('input_' + data).value;
                            if(val.indexOf("Distance") > -1) {
                                var matches = val.match(/Distance(.*)/);
                                if (matches.length > 1) {
                                    val = matches[1];
                                }
                            }
                            break;

                        default:
                            val = $('input_' + data).value;
                            break;
                    }

                    break;

                default:
                    if ($('input_' + data) && typeof $('input_' + data).value !== 'undefined') {
                        val = $('input_' + data).value;
                    }
                    break;
            }

            if (numeric && typeof val !== 'number') {
                if(useCommasForDecimals) {
                    if(/\..*\,/.test(val)) { //dot used as units separator before comma
                        val = val.replace(/\./g, "");
                    }
                    val = val.replace(",",".");
                }
                val = val.replace(/-?([^0-9])/g, "$1").replace(/[^0-9\.-]/g, "");
            }

            if (numeric && val < 0) { //ntw 343248 - this is to patch a weirdness in the parser whereby x+-y will not parse
                val = '(' + val + ')';
            }

            if (numeric && val === '') {
                val = 0;
            }
            return val;
        };

        var calculate = function (equation, numeric) {
            var out = '';
            var acceptableFunctions = {
                "abs": Math.abs,
                "acos": Math.acos,
                "acosh": Math.acosh,
                "asin": Math.asin,
                "asinh": Math.asinh,
                "atan": Math.atan,
                "atanh": Math.atanh,
                "atan2": Math.atan2,
                "cbrt": Math.cbrt,
                "ceil": Math.ceil,
                "cos": Math.cos,
                "cosh": Math.cosh,
                "exp": Math.exp,
                "expm1": Math.expm1,
                "floor": Math.floor,
                "fround": Math.fround,
                "hypot": Math.hypot,
                "imul": Math.imul,
                "log": Math.log,
                "log1p": Math.log1p,
                "log10": Math.log10,
                "log2": Math.log2,
                "max": Math.max,
                "min": Math.min,
                "pow": Math.pow,
                "random": Math.random,
                "round": Math.round,
                "sign": Math.sign,
                "sin": Math.sin,
                "sinh": Math.sinh,
                "sqrt": Math.sqrt,
                "tan": Math.tan,
                "tanh": Math.tanh,
                "toSource": Math.toSource,
                "trunc": Math.trunc,
                "E": Math.E,
                "LN2": Math.LN2,
                "LN10": Math.LN10,
                "LOG2E": Math.LOG2E,
                "LOG10E": Math.LOG10E,
                "PI": Math.PI,
                "SQRT1_2": Math.SQRT1_2,
                "SQRT2": Math.SQRT2
            };
            for (var i = 0; i < equation.length; i++) {

                character = equation.charAt(i);

                if (character === '[' && !numeric) {
                    var end = equation.indexOf(']', i);
                    try {
                        var num = calculate(equation.substring(i + 1, end), true);
                        if (num) {
                            if (num.indexOf(",") == -1) { //normal calc string
                                num = new MathProcessor().parse(num);
                                if (JotForm.getInputType(calc.resultField) !== "datetime") {
                                    num = num.toFixed(calc.decimalPlaces);
                                    if (!calc.showEmptyDecimals) {
                                        num = parseFloat(num);
                                    }
                                }
                                if (!isFinite(num)) {
                                    num = 0;
                                }
                            }
                            if(useCommasForDecimals) {
                                num = num.toString().replace(".", ",");
                            }
                            out += num;
                        }
                    } catch (e) {
                        console.log('exception in ' + calc.conditionId + " : " + num + "(" + equation + ")");
                    }
                    i = end;
                } else if (equation.substr(i, 3) === '|*|') {
                    try {
                        i += 3;
                        var end = equation.indexOf('|*|', i);
                        if (end === -1) continue;
                        var specOp = equation.substring(i, end);
                        i += end + 2 - i;
                        if (equation.charAt(i + 1) === '(' || (equation.charAt(i + 1) === '[' && equation.charAt(i + 2) === '(')) {
                            i += (equation.charAt(i + 1) === '[') ? 3 : 2;
                            var endSpecial = -1;
                            var balance = 1;
                            for (var k = i; k < equation.length; k++) {
                                if (equation.charAt(k) === ')') {
                                    balance--;
                                    if (balance === 0) {
                                        endSpecial = k;
                                        break;
                                    }
                                } else if (equation.charAt(k) === '(') {
                                    balance++;
                                }
                            }

                            if (endSpecial === -1) continue;
                            var args = equation.substring(i, endSpecial);
                            args = args.split(',');
                            var originalArgs = args.slice(0);
                            for (var j = 0; j < args.length; j++) {
                                args[j] = calculate(args[j], true);
                                if (args[j]) {
                                    args[j] = new MathProcessor().parse(args[j]);
                                }
                            }
                            i += endSpecial - i;
                            if (specOp === 'dateString') {
                                var millis = args[0] * 24 * 60 * 60 * 1000 + 30000;
                                var date = new Date(millis);

                                var getUTCStringDate = function(date) {
                                    var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                    var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                                    var day = dayNames[date.getUTCDay()];
                                    var month = monthNames[date.getUTCMonth()];
                                    var dayOfMonth = JotForm.addZeros(date.getUTCDate(), 2);
                                    var year = date.getUTCFullYear();
                                    return day+" "+month+" "+dayOfMonth+" "+year;
                                };
                                out += getUTCStringDate(date);

                                if (equation.charAt(i) === ']') {
                                    i++;
                                } else {
                                    equation = equation.substr(0, i + 1) + '[' + equation.substr(i + 1);
                                }
                            } else if (specOp === 'date') {
                                if (args.length > 2) {
                                    var millis = Date.UTC(args[0], args[1] - 1, args[2]);
                                    out += millis / 60 / 60 / 24 / 1000;
                                }
                            } else if (specOp === 'nth') {
                                var n = args[0];
                                args = args.splice(1);
                                args = args.sort(function (a, b) {
                                    if (parseInt(a) > parseInt(b)) return 1;
                                    if (parseInt(b) > parseInt(a)) return -1;
                                    return 0;
                                });
                                args = args.reverse();
                                out += args[parseInt(n) - 1];
                            } else if (specOp === 'avg' || specOp === 'avgNoZero') {
                                var len = sum = 0;
                                for (var j = 0; j < args.length; j++) {
                                    if (parseFloat(args[j]) > 0) {
                                        len++;
                                        sum += parseFloat(args[j]);
                                    }
                                }
                                out += specOp === 'avg' ? sum / args.length : sum / len;
                            } else if (specOp === 'count') {
                                var field = originalArgs[0];
                                field = field.replace(/[\{\}]/g, '');
                                var type = JotForm.getInputType(field);
                                var len = $$("#id_" + field + ' input[type="' + type + '"]:checked').length;
                                out += len;
                            } else if (specOp === 'commaSeparate') {
                                if (typeof args[0] == "number") {
                                    args[0] = args[0].toFixed(calc.decimalPlaces);
                                    var parts = args[0].toString().split(".");
                                    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                    out += parts.join(".");
                                } else {
                                    out += args[0];
                                }
                            } else {
                                out += acceptableFunctions[specOp].apply(undefined, args);
                            }

                        } else if (specOp === 'random') {
                            out += Math.random();
                        } else {
                            out += acceptableFunctions[specOp];
                        }
                    } catch (e) {
                        console.log(e);
                    }
                } else if (character === '{') {
                    var end = equation.indexOf('}', i);
                    var qid = equation.substring(i + 1, end);
                    try {
                        var val = getValue(qid, numeric);
                    } catch (e) {
                        console.log("error catching value");
                        console.log(e);
                    }
                    if (val === '' && numeric) return false;
                    out += val;

                    i += end - i;
                } else {
                    out += character;
                }
            }
            return out;
        };

        var output = calculate(calc.equation);
        if (!(typeof output== "string" && output.length > 1) && parseFloat(output) === 0 && $('input_' + result) && $('input_' + result).readAttribute('defaultValue') != null) {
            output = $('input_' + result).readAttribute('defaultValue');
        }

        var resultFieldType = calc.isLabel ? "html" : JotForm.calculationType(result);        

        switch (resultFieldType) {
            case "html":
                try {

                    if(!calc.replaceText) calc.replaceText = "";
                    if(calc.replaceText.indexOf(":") > -1) {
                        var subfield = calc.replaceText.substr(calc.replaceText.indexOf(":")+1);
                        if(subfield in combinedObject) {
                            output = combinedObject[subfield];
                        }
                    }
                    if (output.empty() && calc.defaultValue) {
                        output = calc.defaultValue;
                    }
                    var spans = $$("." + result + "_" + calc.replaceText.replace(":","\\:"));
                    if (spans.length == 0) {
                        var contents = calc.isLabel ? $('label_' + result).innerHTML :  $('text_' + result).innerHTML;
                        var re = new RegExp("\{" + calc.replaceText + "\(\\[.*?\\]\){0,1}\}", "g");
                        var def = calc.defaultValue || "";
                        contents = contents.replace(re, '<span class="replaceTag ' + result + "_" + calc.replaceText + '" default="'+def+'">' + output + '</span>');
                        calc.isLabel ? $('label_' + result).update(contents) : $('text_' + result).update(contents);
                    } else {
                        spans.each(function (span) {
                            span.update(output);
                        });
                    }
                } catch (e) {
                    console.log(e);
                }

                break;
            case "address":
            case "authnet":
            case "paypalpro":
            case "combined":
            case "time":
            case "braintree":
            case "stripe":
                for (var inputId in combinedObject) {
                    if ($('id_' + result).select('input[id*=' + inputId + '], select[id*=' + inputId + ']').length > 0) {
                        $('id_' + result).select('input[id*=' + inputId + '], select[id*=' + inputId + ']').first().value = combinedObject[inputId];
                    }
                }
                if ($('input_' + result + '_full') && $('input_' + result + '_full').readAttribute("masked") == "true") { //mask if phone is masked
                    JotForm.setQuestionMasking('#input_' + result + '_full', "textMasking", $('input_' + result + '_full').readAttribute("maskValue"));
                }
                break;

            case "datetime":
                if (combinedObject && "year" in combinedObject) {
                    for (var inputId in combinedObject) {
                        if ($('id_' + result).select('input[id*=' + inputId + '], select[id*=' + inputId + ']').length > 0) {
                            $('id_' + result).select('input[id*=' + inputId + '], select[id*=' + inputId + ']').first().value = combinedObject[inputId];
                        }
                    }
                } else {
                    try {
                        if ((typeof output == "number" && output > 0) || (typeof output == "string" && output.replace(/\s/g, "").length > 0 && output !== "0")) {
                            var date = new Date(Math.round(output * 60 * 60 * 24 * 1000));
                            var year = date.getUTCFullYear();
                            var month = JotForm.addZeros(date.getUTCMonth() + 1, 2);
                            var day = JotForm.addZeros(date.getUTCDate(), 2);

                            if (!isNaN(year)) $("year_" + result).value = year;
                            if (!isNaN(month)) $("month_" + result).value = month;
                            if (!isNaN(day)) $("day_" + result).value = day;
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }
                if ($('lite_mode_' + result)) {
                    var date = new Date($("year_" + result).value, ($("month_" + result).value - 1), $("day_" + result).value);
                    if(date.getTime()) {
                        JotForm.formatDate({date: date, dateField: $('id_' + result)});
                    }
                }

                break;
            case "number":
                output = output.replace(/[^\-0-9\.]/g, "");
                $('input_' + result).value = output;
                break;
            case "radio":
                var radios = $$("#id_" + result + ' input[type="radio"]');
                $A(radios).each(function (rad) {
                    rad.checked = false;
                    if (rad.value == output.strip()) {
                        rad.checked = true;
                    }
                });
                break;
            case "checkbox":
                var checks = $$("#id_" + result + ' input[type="checkbox"]');
                var outputs = output.split(",");
                outputs = outputs.collect(function (out) {
                    return out.strip();
                });
                $A(checks).each(function (chk) {
                    chk.checked = false;
                    if (outputs.include(chk.value)) {
                        chk.checked = true;
                    }
                });
                break;
            case "select":
                $('input_' + result).setValue(output.strip());
                break;

            case "matrix":
                if ("resultSubField" in calc) {
                    if ($(calc.resultSubField)) {
                        $(calc.resultSubField).value = output;
                    }
                }
                break;

            case "textarea":
                output = output.replace(/<br>|<br\/>/gi, "\r\n");
                if (output && output.length > 0) {
                    $('input_' + result).removeClassName('form-custom-hint').removeAttribute('spellcheck');
                }
                var richArea = $("id_" + result).down('.nicEdit-main');
                if (richArea) {
                    richArea.innerHTML = output;
                    richArea.setStyle({'color': ''});
                }
                $('input_' + result).value = output;
                break;

            default:
                if ($('input_' + result).hinted === true) { //IE8&9 make sure inserted value is not hinted
                    $('input_' + result).clearHint();
                }

                $('input_' + result).value = output;

                if (output && output.length === 0 && $('input_' + result).hintClear) { //IE8&9 if value is empty reapply hint
                    $('input_' + result).hintClear();
                }

                if ($('input_' + result).readAttribute("masked") == "true") {
                    JotForm.setQuestionMasking("#input_" + result, "textMasking", $('input_' + result).readAttribute("maskValue"));
                }
        }

        var infiniteLoop = function () {
            // prevent calculation&condition infinite loop by limiting the nuber of times
            // a calculation can be run on an element in a 500ms period
            var timestamp = new Date().getTime();
            var msPart = timestamp % 1000;
            if (msPart < 500) {
                msPart = "0";
            } else {
                msPart = "1";
            }
            var secPart = parseInt(timestamp / 1000);
            var antiLoopKey = 'input_' + result + '-' + secPart + '-' + msPart;

            //create global antiLoop variable if not created yet
            if (!("__antiLoopCache" in window)) {
                window.__antiLoopCache = {};
            }
            if (antiLoopKey in window.__antiLoopCache) {
                window.__antiLoopCache[antiLoopKey]++;
                if (window.__antiLoopCache[antiLoopKey] > 9) {
                    return true; //only allow same calc to trigger nine times in half a second - multiple are needed for things like sliders that change quickly
                }
            } else {
                window.__antiLoopCache[antiLoopKey] = 1;
            }
            return false; //not infinite loop
        }

        if (infiniteLoop()) {
            return;
        }

        if ($('id_' + result).hasClassName("form-line-error")) {
            $('id_' + result).select("select[class*='required'], textarea[class*='required'], input[class*='required']").each(function (el) {
                if (el.validateInput) {
                    el.validateInput();
                }
            });
        }

        var triggerMe;
        var eventType;

        if (resultFieldType == "checkbox" || resultFieldType == "radio") {
            eventType = "click";
            triggerMe = $('id_' + result)
        } else if (resultFieldType == "select") {
            eventType = "change";
            if ($('input_' + result)) {
                triggerMe = $('input_' + result);
            }
        } else {
            eventType = "keyup";
            triggerMe = $('input_' + result) ? $('input_' + result) : $('id_' + result).select('input').first();
        }

        if (!triggerMe) return;
        if (document.createEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(eventType, true, true);
            triggerMe.dispatchEvent(evt);
        }
        if (triggerMe.fireEvent) {
            triggerMe.fireEvent('on' + eventType);
        }
    },

    getWidgetType: function(qid) {
        try {
            if(!$("id_"+qid || $("id_"+qid).down("iframe"))) return false;
            if($('input_' + qid).value.indexOf("widget_metadata") > 1) {
                return JSON.parse($('input_' + qid).value).widget_metadata.type;
            }
            var iframe = $("id_"+qid).down("iframe");
            var src = iframe.src;
            var reg = new RegExp( 'jotform.io/(.*)/');
            var widget = reg.exec(src);
            if(!widget || widget.length < 2 || !widget[1]) return false;
            return widget[1];
        } catch(e) {
            console.error("get widget type error");
            return false;
        }
    },

    widgetsWithConditions: [],

    /**
     * When widget value is updated check whether to trigger conditions
     */
    triggerWidgetCondition: function (id) {
        if (JotForm.widgetsWithConditions.include(id)) {
            if (document.createEvent) {
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('change', true, true);
                $('input_' + id).dispatchEvent(evt);
            } else if ($('input_' + id).fireEvent) {
                return $('input_' + id).fireEvent('onchange');
            }
        }
    },

    /**
     * Sets all events and actions for form conditions
     */
    setConditionEvents: function () {
        try {
            $A(JotForm.conditions).each(function (condition) {

                if (condition.disabled == true) return; //go to next condition

                if (condition.type == 'field' || condition.type == 'calculation' || condition.type == 'require' || condition.type == 'mask') {

                    var fields = [];
                    $A(condition.terms).each(function (term) {
                        fields.push(term.field);

                        //add dyanmic {fields} to array to trigger events
                        if (condition.type == "field" && "value" in term && typeof term.value == "string") {
                            var val = term.value;
                            try {
                                val.replace(/\{.*?\}/gi, function (match, contents, offset, s) {
                                    var stripped = match.replace(/[\{\}]/g, "");
                                    var elements = $$('input[name$="_' + stripped + '"]');
                                    if (elements.length > 0) {
                                        var element = elements[0];
                                        var id = element.id;
                                        id = id.replace(/input_/, "");
                                        fields.push(id);
                                    }
                                });
                            } catch (e) {
                                console.log(condition);
                            }
                        }
                    });

                    $A(fields).each(function (id) {

                        switch (JotForm.getInputType(id)) {
                            case "widget":
                                JotForm.setFieldConditions('input_' + id, 'change', condition);
                                JotForm.widgetsWithConditions.push(id);
                                break;
                            case "combined":
                            case "email":
                                JotForm.setFieldConditions('id_' + id, 'autofill', condition);
                                break;
                            case "address":
                                JotForm.setFieldConditions('id_' + id, 'autofill', condition);
                                JotForm.setFieldConditions('input_' + id + '_country', 'change', condition);
                                break;
                            case "datetime":
                                JotForm.setFieldConditions('id_' + id, 'date:changed', condition);
                                break;
                            case "birthdate":
                                JotForm.setFieldConditions('input_' + id + '_day', 'change', condition);
                                JotForm.setFieldConditions('input_' + id + '_month', 'change', condition);
                                JotForm.setFieldConditions('input_' + id + '_year', 'change', condition);
                                break;
                            case "time":
                                JotForm.setFieldConditions('input_' + id + '_hourSelect', 'change', condition);
                                JotForm.setFieldConditions('input_' + id + '_minuteSelect', 'change', condition);
                                JotForm.setFieldConditions('input_' + id + '_ampm', 'change', condition);
                            case "select":
                            case "file":
                                if ($('input_' + id)) {
                                    JotForm.setFieldConditions('input_' + id, 'change', condition);
                                } else {
                                    $('id_' + id).select('select').each(function (el) {
                                        JotForm.setFieldConditions(el.id, 'change', condition);
                                    });
                                }
                                break;
                            case "checkbox":
                            case "radio":
                                JotForm.setFieldConditions('id_' + id, 'click', condition);
                                break;
                            case "number":
                                JotForm.setFieldConditions('input_' + id, 'number', condition);
                                break;
                            case "autocomplete": // Neil: Set custom event for autocomplete fields (classname: "form-autocomplete")
                                JotForm.setFieldConditions('input_' + id, 'autocomplete', condition);
                                break;
                            case "grading":
                                JotForm.setFieldConditions('id_' + id, 'keyup', condition);
                                break;
                            case "text":
                                JotForm.setFieldConditions('input_' + id, 'autofill', condition);
                                break;
                            case "hidden":
                                if ($('input_' + id + "_donation")) {
                                    JotForm.setFieldConditions('input_' + id + "_donation", 'keyup', condition);
                                } else {
                                    JotForm.setFieldConditions('input_' + id, 'keyup', condition);
                                }
                                break;

                            default: // text, textarea, dropdown
                                JotForm.setFieldConditions('input_' + id, 'keyup', condition);
                        }
                    });

                } else {


                    if (document.get.mode == "edit" || document.get.mode == "inlineEdit") { //only run page condition on last page that a condition field exists so we don't jump prematurely based on populated data

                        var isLaterPage = function (current, testing) {
                            var nexts = $$('.form-pagebreak-next');
                            for (var i = 0; i < nexts.length; i++) {
                                var btn = nexts[i];
                                if (btn == current) return true;
                                if (btn == testing) return false;
                            }
                        };


                        var highestPage = false;
                        $A(condition.terms).each(function (term) {
                            var id = term.field.toString();
                            if (id.indexOf("_") !== -1) {
                                id = id.split("_")[0];
                            }

                            var nextButton = JotForm.getSection($('id_' + id)).select('.form-pagebreak-next')[0];
                            if (!nextButton) {
                                return;
                            }
                            var pageNumber = parseInt(nextButton.id.substring(nextButton.id.lastIndexOf("_") + 1));
                            if (!highestPage || isLaterPage(highestPage, nextButton)) {
                                highestPage = nextButton;
                            }
                        });

                        if (highestPage) {
                            highestPage.observe('mousedown', function () {
                                JotForm.checkCondition(condition);
                            });
                        }
                    } else {
                        $A(condition.terms).each(function (term) {
                            var id = term.field.toString();

                            // if this is a product quantity option (e.g. 4_quantity_1009_0)
                            if (id.indexOf("_") !== -1) {
                                id = id.split("_")[0];
                            }

                            if(!$('id_' + id)) {
                                return;
                            }

                            var nextButton = JotForm.getSection($('id_' + id)).select('.form-pagebreak-next')[0];
                            if (!nextButton) {
                                return;
                            }

                            nextButton.observe('mousedown', function () {
                                // JotForm.warn('Checking ' + $('label_' + id).innerHTML.strip());
                                JotForm.checkCondition(condition);
                            });
                        });
                    }
                }
            });

            $H(JotForm.fieldConditions).each(function (pair) {
                var field = pair.key;
                var event = pair.value.event;
                var conds = pair.value.conditions;

                // JotForm.info("Has Condition:", field, $(field));
                // If field is not found then continue
                if (!$(field)) {
                    return;
                }
                if (event == "autocomplete") { // if event type is trigger by autocomplete, listen to blur and keyup events
                    $(field).observe('blur', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('blur');
                    $(field).observe('keyup', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('keyup');
                } else if (event == "number") {
                    $(field).observe('change', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('change');
                    $(field).observe('keyup', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('keyup');
                } else if (event == "autofill") {
                    $(field).observe('blur', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('blur');
                    $(field).observe('keyup', function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    }).run('keyup');

                    if (!(!Prototype.Browser.IE9 && !Prototype.Browser.IE10 && Prototype.Browser.IE)) {
                        $(field).observe('change', function () {
                            $A(conds).each(function (cond) {
                                JotForm.checkCondition(cond);
                            });
                        }).run('change');
                    }
                } else {
                    $(field).observe(event, function () {
                        $A(conds).each(function (cond) {
                            JotForm.checkCondition(cond);
                        });
                    });
                    if (!$(field).id.match(/input_[0-9]+_quantity_[0-9]+_[0-9]+/)) { // b#652068 (do not auto-run condition events on quantity fields)
                        $(field).run(event);
                    }
                }
            });
        } catch (e) {
            JotForm.error(e);
        }
    },

    /**
     * Sets field values to be duplicated before encryption
     * These fields are needed by some payment gateways
     * for example, braintree gets the first email field on the form
     * but it should be unencrypted, so we duplicate the fields
     * before encryption (at JotForm.encryptAll)
     */

    setFieldsToPreserve: function (param) {

        // gateways that need these fields
        var gateways = [
            "braintree",
            "dwolla",
            "stripe",
            "paypal",
            "paypalpro",
            "paypalexpress",
            "authnet"
        ];

        if (gateways.indexOf($$('input[name="simple_fpc"]')[0].getAttribute('data-payment_type')) == -1) {
            return;
        }

        var additionalPaymentFields = [{
            type: "phone",
            pattern: /Phone|Contact/i
        }, {
            type: "email",
            pattern: /email|mail|e-mail/i
        }, {
            type: "company",
            pattern: /company|organization/i
        }];

        var fields = $$('.form-line[data-type*="email"], .form-line[data-type*="textbox"], .form-line[data-type*="phone"]');
        // arrange all fields by id
        sortedFields = fields.sort(function (a, b) {
            return Number(a.id.replace("id_", "")) - Number(b.id.replace("id_", ""));
        });

        var fieldsToPreserve = {};
        // get the first field that matches the regex and type
        sortedFields.each(function (field) {
            if (Object.keys(fieldsToPreserve).length == 3) {
                throw $break;
            }
            additionalPaymentFields.each(function (reg) {

                var fieldType = field.getAttribute('data-type').replace('control_', '');
                /*
                 valid form field type
                 email =>  email and textbox
                 phone =>  phone field and textbox
                 company => textbox only
                 */
                if (fieldType == 'textbox' || fieldType == reg.type) {

                    var label = field.down('label').innerHTML.strip();
                    var fieldId = field.id.replace('id_', '');

                    if (reg.pattern.exec(label) && !fieldsToPreserve[reg.type]) {
                        fieldsToPreserve[reg.type] = fieldId;
                        JotForm.fieldsToPreserve.push(fieldId);
                    }
                }
            });
        });
    },

    /**
     * Changes payment strings upon form load
     * @param {type} text
     * @returns {undefined}
     */

    changePaymentStrings: function (text) {
        if ($('coupon-header') && text.couponEnter) {
            $('coupon-header').innerHTML = text.couponEnter;
        }
        if ($('shipping-text') && text.shippingShipping) {
            $('shipping-text').innerHTML = text.shippingShipping;
        }
        if ($('tax-text') && text.taxTax) {
            $('tax-text').innerHTML = text.taxTax;
        }
        if ($('subtotal-text') && text.totalSubtotal) {
            $('subtotal-text').innerHTML = text.totalSubtotal;
        }
        if ($('total-text') && text.totalTotal) {
            $('total-text').innerHTML = text.totalTotal;
        }
    },

    handleSubscriptionPrice: function () {
        // safari fix (input focus bug)
        if (navigator.userAgent.toLowerCase().indexOf('safari/') > -1) {
            $$('.form-product-custom_price').each(function (inp) {
                // form-product-custom_price
                inp.onclick = function (e) {
                    e.preventDefault();
                };
            })
        }
        var inputs = $$('input[data-price-source]');
        if (inputs.length < 1) {
            return;
        }
        var priceSources = [];
        var events = {};
        inputs.each(function (inp) {
            var sourceId = inp.getAttribute('data-price-source');
            var source = $('input_' + sourceId);

            if (!source) {
                return;
            }

            if (!events[sourceId]) {
                events[sourceId] = [];
            }

            var getVal = function () {
                var val = source.value;
                if (typeof val !== 'number') {
                    val = val.replace(/[^0-9\.]/gi, "");
                }
                return !isNaN(val) && val > 0 ? val : 0;
            }
            // collect source fields
            priceSources.push(source);

            // collect events
            events[sourceId].push(function() {
                inp.value = getVal();
            });
        });

        // attach events to source fields
        priceSources.each(function (source) {
            var id = source.id.replace('input_', '');
            source.onkeyup = function () {
                events[id].each(function (evt) {
                    evt();
                });
                JotForm.countTotal(); // re-count total
            };

        });
    },

    /*
     * Handles payment donations
     */

    handleDonationAmount: function () {
        // donation amount input
        var donationField = $$('input[id*="_donation"]')[0];
        // default
        JotForm.paymentTotal = donationField.value || 0;
        // observe changes
        donationField.observe('keyup', function () {
            JotForm.paymentTotal = this.value;
        })
        // if donation gets its amount from a calculation widget
        if ($$('input[id*="_donation"]')[0].getAttribute('data-custom-amount-field') > 0) {
            var calcField = $('input_' + donationField.getAttribute('data-custom-amount-field'));
            // if calculation widget does not exist
            if (!calcField) {
                return;
            }

            var getVal = function () {
                var val = calcField.value;
                if (typeof val !== 'number') {
                    val = val.replace(/[^0-9\.]/gi, "");
                }
                return !isNaN(val) && val > 0 ? val : 0;
            }


            // get value from calculation widget
            setTimeout(function () {
                donationField.value = getVal();
                donationField.triggerEvent('keyup');
            }, 1000);
            // observe calc widget value changes
            // prototype can't observe changes initiated by a js function to a field value
            // so we use Form.element.Observer which checks for changes every 'x' milliseconds
            new Form.Element.Observer(
                calcField,
                0.5,  // 500 milliseconds
                function (el, value) {
                    donationField.value = getVal();
                    donationField.triggerEvent('keyup');
                }
            );
            // if donation field requires a minimum amount
        } else if (donationField.hasAttribute('data-min-amount')) {
            var currency = donationField.nextSibling.textContent.strip();
            var minAmount = parseFloat(donationField.readAttribute('data-min-amount'));
            donationField.validateMinimum = function () { // called at setFieldValidation
                var val = this.getValue();
                if (isNaN(val) || val < minAmount) {
                    return JotForm.errored(donationField, "Minimum amount is " + minAmount + " " + currency);
                } else {
                    return JotForm.corrected(donationField);
                }
            };
        }

    },

    /**
     * Checks whether form should process a payment
     * @returns {Boolean}
     */

    isPaymentSelected: function () {
        var selected = false;
        var paymentFieldId = $$('input[name="simple_fpc"]')[0].value;
        var paymentField = $('id_' + paymentFieldId);

        if ($$('input[name="simple_fpc"]').length < 1) {
            return false;
        }
        // if with payment field but hidden by condition
        // or inside conditionally-hidden (not collapsed) form collapse section
        if (paymentField && (paymentField.getStyle('display') === "none"
            || !JotForm.isVisible(paymentField) && JotForm.getSection(paymentField).id)
        ) {
            return false;
        }
        // if this is a multi-item product or subscription
        if (window.productID) {
            // check if at least one product is selected
            $H(window.productID).each(function (pair) {
                var elem = $(pair.value);
                if (elem.checked) {
                    // get quantity field
                    if (!!elem.up().select('[id*="_quantity_"]').length) {
                        var quantityField = elem.up().select('[id*="_quantity_"]')[0];
                    }
                    if (!quantityField || quantityField.getValue() > 0) {
                        selected = true;
                        throw $break;
                    }
                }
            });
            // if this is a donation
        } else if ($('input_' + paymentFieldId + '_donation')) {
            var elem = $('input_' + paymentFieldId + '_donation');
            if (/^\d+(?:\.\d+)?$/.test(elem.getValue())) {
                selected = elem.getValue() > 0;
            }
            // if this is a hidden single item
        } else {

            var productField = $$('input[name*="q' + paymentFieldId + '"][type="hidden"]');

            if (productField.length < 1) {
                return false;
            }

            if (productField[0].readAttribute('selected') === 'false') {
                productField[0].remove();
                return false;
            }

            return true;
        }
        return selected;
    },

    /**
     * Toggles between paypal button and regular submit button
     * @param {type} show
     * @returns {unresolved}
     */

    togglePaypalButtons: function (show) {
        var paymentFieldId = $$('input[name="simple_fpc"]')[0].value;
        // if this is paypal pro and credit card payment is selected
        if ($('input_' + paymentFieldId + '_paymentType_express')
            && !$('input_' + paymentFieldId + '_paymentType_express').checked) {
            show = false;
        }
        // if checkout button is not to be used
        if ($$('.paypal-button').length < 1 || !$('use_paypal_button')) {
            return;
        }
        // replace all submit buttons with express checkout buttons
        $$('.form-submit-button').each(function (btn) {
            if (show) {
                if (btn.up().down('.paypal-button')) {
                    btn.up().down('.paypal-button').show();
                    btn.hide();
                }
            } else {
                if (btn.up().down('.paypal-button')) {
                    btn.up().down('.paypal-button').hide();
                }
                btn.show();
            }
        });
    },

    /*
     * Handles toggling between PayPal checkout buttons
     * and ordinary submit buttons
     * @returns {undefined}
     */

    handlePaypalButtons: function () {
        var products = window.productID;
        var requiredPayment = false;
        var paymentFieldId = $$('input[name="simple_fpc"]')[0].value;
        // check if payment is required
        if (products) {
            $H(products).each(function (p) {
                // if required
                if ($(p.value).getAttribute('class').indexOf('[required]') > -1) {
                    requiredPayment = true;
                    throw $break;
                }
            });
        } else if ($('input_' + paymentFieldId + '_donation')) {
            requiredPayment = $('input_' + paymentFieldId + '_donation').getAttribute('class').indexOf('required') > -1;
        }
        // toggle upon form load
        JotForm.togglePaypalButtons(requiredPayment || JotForm.isPaymentSelected());

        // set button trigger if payment is not required
        if (!requiredPayment) {
            $H(products).each(function (p) {
                $(p.value).observe('click', function () {
                    JotForm.togglePaypalButtons(JotForm.isPaymentSelected());
                });
            });
        }
    },

    /*
     * Checks whether form is embedded or not
     * Sends url of the form's parent page
     * @returns {undefined}
     */
    isFormEmbedded: function () {
        var form = $$('.jotform-form')[0];
        if (window !== window.top) {
            form.insert(new Element('input', {
                type: 'hidden',
                name: 'embeddedForm'
            }).putValue(document.referrer));
            console.log(document.referrer);
        }
    },

    /**
     * Handles Paypal Express actions
     * @returns {undefined}
     */

    handlePaypalExpress: function () {
        if (typeof _paypalExpress !== "function" || $('express_category').getAttribute('data-digital_goods') === "No") {
            return;
        }
        var paypalExpress = new _paypalExpress();
        paypalExpress.init();
    },

    /**
     * Handles Braintree payments
     */

    handleBraintree: function () {
        // skip on edit mode
        if (["edit", "inlineEdit", "submissionToPDF"].indexOf(document.get.mode) > -1
            && document.get.sid) {
            return;
        }
        if (typeof __braintree !== "function") {
            alert("Braintree payment script didn't work properly. Form will be reloaded");
            location.reload();
            return;
        }
        var JF_braintree = __braintree();
        JF_braintree.init();
    },

    handleSquare: function () {
        // skip on edit mode
        if (["edit", "inlineEdit", "submissionToPDF"].indexOf(document.get.mode) > -1
            && document.get.sid) {
            return;
        }

        // force https on standalone forms
        if (window === window.top) {
            if (window.location.protocol !== 'https:') {
                window.location.href = window.location.href.replace('http', 'https');
            }
        }

        if (typeof __square !== "function") {
            alert("Squre payment script didn't work properly. Form will be reloaded");
            location.reload();
            return;
        }
        var JF_square = __square();
        JF_square.init();
    },

    /**
     * Handles the payment subproducts behavior
     */

    handlePaymentSubProducts: function () {

        var heights = [];                   // container for the heights of the products when opened and closed
        var optionValues = [];              // container for the values of the properties when opened and closed
        var sections = $$('.form-section'); // get the sections if there are page breaks
        var productPage = false;            // page where the payment field is

        $$('.form-product-has-subproducts').each(function (sp) {

            var wasHidden = (sp.up(".form-line") && sp.up(".form-line").hasClassName("form-field-hidden")) ? sp.up(".form-line").show() : false;

            // if this form has page breaks,
            if (sections.length > 1) {
                // get the page where the payment field is
                productPage = productPage ? productPage : sections.filter(function (p) {
                    return sp.descendantOf(p) && sp.up('.form-section') === p;
                })[0];
                // if this page is hidden
                if (!productPage.isVisible()) {
                    // show page temporarily
                    productPage.setStyle({'display': 'block'});
                    // get the height of the product
                    heights[sp.id] = [sp.parentNode.getHeight(), $$('label[for="' + sp.id + '"]')[0].getHeight()];
                    // hide the page
                    productPage.setStyle({'display': 'none'});
                } else {
                    heights[sp.id] = [sp.parentNode.getHeight(), $$('label[for="' + sp.id + '"]')[0].getHeight()];
                }
            } else {
                heights[sp.id] = [sp.parentNode.getHeight(), $$('label[for="' + sp.id + '"]')[0].getHeight()];
            }

            showSubProducts(sp);
            sp.observe('click', function () {
                showSubProducts(this);
            });

            if(wasHidden) {
                sp.up(".form-line").hide();
            }
        });

        function showSubProducts(el) {

            var productSpan = el.parentNode;

            if (!el.checked) {
                productSpan.shift({
                    height: heights[el.id][1],
                    duration: 0.3
                });
                // clear the values array
                optionValues[el.id] = [];

                $$('#' + el.id + '_subproducts select,' + '#' + el.id + '_subproducts input[type="text"]').each(function (field, i) {
                    // capture the values
                    var fieldValue = field.tagName === "select" ? field.getSelected().value : field.value;
                    if (fieldValue) {
                        optionValues[el.id].push([field.id, fieldValue]);
                    }
                    // pause calculation functions to avoid potential browser crash
                    field.stopObserving();
                    // clear values
                    if (field.tagName === "SELECT") {
                        field.selectedIndex = 0;
                    } else {
                        field.value = 0;
                    }
                });
            } else {
                productSpan.shift({
                    height: heights[el.id][0] - 10,
                    duration: 0.3
                });
                // populate values
                if (optionValues[el.id] && optionValues[el.id].length > 0) {
                    optionValues[el.id].each(function (vv) {
                        // pause calculation functions to avoid potential browser crash
                        $(vv[0]).stopObserving();
                        if ($(vv[0]).tagName === "SELECT") {
                            $(vv[0]).selectOption(vv[1]);
                        } else {
                            $(vv[0]).value = vv[1];
                        }
                    });
                }
            }
            // resume calculation
            setTimeout(function () {
                JotForm.totalCounter(JotForm.prices)
            }, 300);
        };
    },
    /*
     * sets currency formatting for payment fields
     */

    setCurrencyFormat: function (curr, useDecimal, decimalMark) {
        // currencies without decimal values
        var noDecimal = ['BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA', 'PYG', 'RWF', 'VUV', 'XAF', 'XOF', 'XPF'];
        var decimalPlaces = noDecimal.indexOf(curr) > -1 || !useDecimal ? 0 : 2;
        this.currencyFormat = {
            curr: curr,
            dSeparator: decimalMark == "comma" ? "," : ".",
            tSeparator: decimalMark == "comma" ? "." : ",",
            decimal: decimalPlaces
        };
    },

    /**
     * Calculates the payment total with quantites
     * @param {Object} prices
     */
    countTotal: function (prices) {
        var prices = prices || JotForm.prices;
        var discounted = false;
        // If a coupon is entered and verified
        if (Object.keys(JotForm.discounts).length > 0) {
            discounted = true;
            // if this is a discount for order total
            if (JotForm.discounts.total || JotForm.discounts.shipping) {
                var type = JotForm.discounts.type,
                    rate = JotForm.discounts.rate,
                    minimum = JotForm.discounts.minimum,
                    code = JotForm.discounts.code;

            } else {
                // If for product items
                for (var pid in prices) {
                    for (var kkey in JotForm.discounts) {
                        if (pid.indexOf(kkey) !== -1) {
                            prices[pid].discount = JotForm.discounts[kkey];
                        }
                    }
                }
            }
        } else {
            $H(prices).each(function (p) {
                delete prices[p.key].discount;
            });
        }

        var total = 0;          // total for the whole payment field
        var subTotal = 0;       // subtotal for all items selected, excluding shipping or taxes
        var itemSubTotal = [];  // subtotal for a group of subproducts
        var shippingTotal = 0;  // total shipping cost
        var taxTotal = 0;       // total tax cost
        var taxRate = 0;        // uniform tax rate (percentage) for the non-exempted products
        var decimal = JotForm.currencyFormat.decimal; // number of decimal places to use
        var dSeparator = JotForm.currencyFormat.dSeparator;
        var tSeparator = JotForm.currencyFormat.tSeparator;
        var flatShipping = 0;
        var products = 0;
        var subscriptionCustomPrice = false;

        $H(prices).each(function (pair) {

            if (pair.value.price == "custom") {
                subscriptionCustomPrice = pair.key;
                return;
            }

            var isSetupFee = pair.value.recurring ? true : false; // is there a setup fee for this subscription?
            var isStripe = typeof Stripe === "function";    // is this a stripe payment field
            total = parseFloat(total);                  // total for the whole payment field
            var productShipping = 0;                    // shipping cost for current product
            var price = parseFloat(pair.value.price) || 0;   // price for the individual product
            var taxAmount = 0;                          // tax amount for the individual product
            var subproduct = false;                     // is this a subproduct?
            var parentProductKey;                       // subproduct's parent key (see http://www.jotform.com/help/264-Create-Sub-Products-Based-on-a-Product-Option)
            var recur = pair.value.recurring;           // subscription's recurring payment amount

            // get the parent product id if this is a subproduct
            if (pair.key.split('_').length === 4) {
                subproduct = true;
                // get the parent product key/id
                parentProductKey = pair.key.split('_');
                parentProductKey.pop();
                parentProductKey = parentProductKey.join("_");
                // initalize item subtotal for this subproduct group
                itemSubTotal[parentProductKey] = itemSubTotal[parentProductKey] || 0;
            } else {
                parentProductKey = pair.key;
            }

            // if product has special pricing, use selected option's corresponding price
            if ($(pair.value.specialPriceField)) {
                var specialPriceField = $(pair.value.specialPriceField);
                // if this special priced product option is expanded
                // Note: expanded options are inserted on the form as hidden input fields
                if (pair.value.child && pair.value.specialPriceField.split("_").length === 4) {
                    var idx = pair.value.specialPriceField.split("_")[3];
                    price = parseFloat(pair.value.specialPriceList[idx]);
                } else {
                    if (isNaN($(specialPriceField).options[0].value)
                        || $(specialPriceField).options[0].value > 0
                        || $(specialPriceField.options[0].innerHTML.strip() != "")) {
                        priceIndex = specialPriceField.getSelected().index;
                    } else {
                        priceIndex = specialPriceField.getSelected().index - 1
                    }

                    if (priceIndex > -1) {
                        price = parseFloat(pair.value.specialPriceList[priceIndex]);
                        if ($(pair.key + '_price')) {
                            $(pair.key + '_price').siblings('.freeCurr').each(function (el) {
                                el.style.display = 'inline';
                            });
                        }
                    } else {
                        // for subproducts with special quantity, the default quantity is 0
                        // since we cannot show a zero price, we use the price for the 1st option
                        var defaultSpecial = pair.value.specialPriceList[priceIndex + 1];
                        price = 0;
                    }
                }
            }
            // If there is a coupon, apply the discount rate to the price
            if (pair.value.discount) {
                var discount = pair.value.discount.split('-');
                /*
                 * sample discount values:
                 * 50-percent ( 50% off for this product )
                 * 50-fixed ( $50 off for this product )
                 * 50-percent-first ( 50% off on first payment for this subscription item)
                 * 50-percent-all (50 % off on all payments for this subscription item)
                 * 50-fixed-all ( $50 off on all payments)
                 */

                // if this is a discount for product
                if (!discount[2]) {
                    price = price - ( ( discount[1] === 'fixed' ) ? discount[0] : price * ( discount[0] / 100 ) );
                    price = price < 0 ? 0 : price;
                } else {
                    if (discount[2] === "all") {
                        // calculate discount to recurring charge
                        if (isSetupFee) {
                            recur = recur - ( ( discount[1] === 'fixed' ) ? discount[0] : recur * ( discount[0] / 100 ) );
                            recur = recur < 0 ? 0 : recur;
                        }
                        // if this is Stripe and there is a setup fee
                        if (isStripe && isSetupFee) {
                            // calculate setup fee
                            var setupFee = price - recur;
                            setupFee = setupFee - ( ( discount[1] === 'fixed' ) ? discount[0] : setupFee * ( discount[0] / 100 ) );
                            setupFee = setupFee < 0 ? 0 : setupFee;
                            price = Number(recur) + Number(setupFee);
                        } else {
                            // calculate recurring price
                            price = price - ( ( discount[1] === 'fixed' ) ? discount[0] : price * ( discount[0] / 100 ) );
                            price = price < 0 ? 0 : price;
                        }
                    } else if (discount[2] === "first") {
                        if (isSetupFee) {
                            if (isStripe) {
                                /**
                                 * Neil: Stripe is a special case since their api does not offer a setup fee, so we do a separate charge for the setup fee
                                 * So first payment = recurring charge + separate charge
                                 * Therefore subscription discount for first payment actually applies only to the setup fee (first payment - recurring charge))
                                 */
                                var setupFee = price - recur;
                                setupFee = setupFee - ( ( discount[1] === 'fixed' ) ? discount[0] : setupFee * ( discount[0] / 100 ) );
                                setupFee = setupFee < 0 ? 0 : setupFee;
                                price = Number(recur) + Number(setupFee);

                            } else {
                                price = price - ( ( discount[1] === 'fixed' ) ? discount[0] : price * ( discount[0] / 100 ) );
                                price = price < 0 ? 0 : price;
                            }
                        }
                    } else if (discount[2] === "stripe_native") {
                        // if native stripe coupon is used and there is a setup fee
                        if (isSetupFee) {
                            var setupFee = price - recur;
                            price = recur - ( ( discount[1] === 'fixed' ) ? discount[0] : recur * ( discount[0] / 100 ) );
                            if (!discount[3]) { // if this isn't just a one-time discount, i.e., 10-percent-stripe_native-once
                                recur = price;  // b#593901
                            }
                            price += Number(setupFee);
                        } else {
                            // calculate recurring price
                            price = price - ( ( discount[1] === 'fixed' ) ? discount[0] : price * ( discount[0] / 100 ) );
                            price = price < 0 ? 0 : price;
                        }
                    }
                }

            }

            // If there is no recurring payment (i.e., not a subscription), update the price
            if (!pair.value.recurring) {
                var priceText = $(pair.key + '_price') ? $(pair.key + '_price') : $(pair.key.replace(pair.key.substring(pair.key.lastIndexOf("_")), "") + '_price') || null;
                if (priceText) {
                    var oldPriceText = priceText.innerHTML;
                    if (price == "0" && pair.value.specialPriceList && defaultSpecial) {
                        $(priceText).update(parseFloat(defaultSpecial || 0).formatMoney(decimal, dSeparator, tSeparator));
                    } else if (pair.value.price == "0" && !pair.value.specialPriceList) {
                        $(priceText).update(' Free');
                    } else {
                        $(priceText).parentNode.show();
                        $(priceText).update(parseFloat(price).formatMoney(decimal, dSeparator, tSeparator));
                    }
                }
            } else {
                var setupfeeText = $(pair.key + '_setupfee');
                priceText = $(pair.key + '_price');
                if (priceText) {
                    // if a setup fee is not present, pair.value.price (price) is the subscription's price
                    // otherwise, pair.value.price is the subscription's first payment amount and the subscription's price becomes pair.value.recurring (recur)
                    var priceAmount = isSetupFee ? recur : price;
                    $(priceText).update(parseFloat(priceAmount).formatMoney(decimal, dSeparator, tSeparator));
                }
                if (setupfeeText) {
                    $(setupfeeText).update(parseFloat(price).formatMoney(decimal, dSeparator, tSeparator));
                }
            }

            // If there is a tax, get the total tax rate including location surcharges
            if (pair.value.tax) {
                var tax = pair.value.tax;
                taxRate = parseFloat(tax.rate);
                // if location surcharge dropdown exists and there is a selected value, get the corresponding surcharge value
                if ($$('select[id*="input_' + tax.surcharge.field + '"]').length > 0
                    && $$('select[id*="input_' + tax.surcharge.field + '"]')[0].getSelected().value) {
                    var selectedIndex = $$('select[id*="input_' + tax.surcharge.field + '"]')[0].getSelected().index - 1; // we subtract 1 to the index because the first index has empty value
                    taxRate += tax.surcharge.rates[selectedIndex] ? parseFloat(tax.surcharge.rates[selectedIndex][0]) : 0;
                }
                // if location surcharge text box exists and there is a value;
                if ($$('input[id="input_' + tax.surcharge.field + '"]').length > 0
                    && !$$('input[id="input_' + tax.surcharge.field + '"]')[0].value.empty()) {
                    $H(tax.surcharge.rates).each(function (r) {
                        if (r[1][1].toLowerCase() === $$('input[id="input_' + tax.surcharge.field + '"]')[0].value.toLowerCase()) {
                            taxRate += Number(r[1][0]);
                            throw $break;
                        }
                    });
                }
            }
            // include addon prices for braintree subscriptions
            if (pair.value.addons) {
                price += pair.value.addons;
            }

            if ($(pair.key).checked) {

                products++;

                if ($(pair.value.quantityField) || $(pair.value.specialPriceField)) {
                    //if there is a quantity option and special pricing isn't based on it
                    if ($(pair.value.quantityField) && (pair.value.specialPriceField !== pair.value.quantityField)) {
                        // use different calculation method for custom quantity (textbox) option
                        if ($(pair.value.quantityField).readAttribute('type') == "text") {
                            price = $(pair.value.quantityField).value ? price * Math.abs(parseInt($(pair.value.quantityField).value, 10)) : 0;
                        }
                        else {
                            price = price * parseInt(($(pair.value.quantityField).getSelected().text || 0 ), 10);
                        }
                    }

                    // if this is a subproduct, add the price to the subtotal
                    if (subproduct) {
                        itemSubTotal[parentProductKey] += price;
                    }

                    // update item subtotal if available
                    if ($(parentProductKey + '_item_subtotal') && !isNaN(price)) {
                        if (!subproduct) {
                            $(parentProductKey + '_item_subtotal').update(parseFloat(price).formatMoney(decimal, dSeparator, tSeparator));
                        } else {
                            $(parentProductKey + '_item_subtotal').update(parseFloat(itemSubTotal[parentProductKey]).formatMoney(decimal, dSeparator, tSeparator));
                        }
                    }

                }

                // if this product is taxed, calculate the tax amount
                if (pair.value.tax) {
                    taxAmount = price * (taxRate / 100);
                }
                // add shipping if it is available

                if (pair.value.shipping) {
                    var shipping = pair.value.shipping;
                    if (shipping.firstItem) {
                        var qty = $(pair.value.quantityField) ? ($(pair.value.quantityField).readAttribute('type') === "text" ? parseInt($(pair.value.quantityField).value) : parseInt($(pair.value.quantityField).getSelected().text || 0)) : 1;
                        if (qty === 1) {
                            productShipping = parseFloat(shipping.firstItem);
                        }
                        if (qty > 1) {
                            productShipping = !parseFloat(shipping.addItem) ? parseFloat(shipping.firstItem) : parseFloat(shipping.firstItem) + parseFloat(shipping.addItem) * (qty - 1);
                        }
                    } else if (flatShipping == 0 && shipping.flatRate) {
                        // get flat shipping rate once
                        shippingTotal = flatShipping = parseFloat(shipping.flatRate);
                    }
                }
                taxTotal += taxAmount; // accummulate tax amounts for each product
                if (!flatShipping) {
                    shippingTotal += productShipping;  // accumulate shipping total
                }
                subTotal += price; // accumulate total for all items, without shipping/discount/tax
                total += price + productShipping + taxAmount;   // overall total

            } else {
                if ($(pair.key + '_item_subtotal')) {
                    $(pair.key + '_item_subtotal').update("0.00");
                }
            }
        });
        // add flat rate shipping to total if available
        total = flatShipping > 0 ? total + flatShipping : total;

        if (total === 0 || isNaN(total)) {
            total = "0.00";
        }
        if ($('coupon-button')) {
            var couponInput = $($('coupon-button').getAttribute('data-qid') + '_coupon');
        }
        // if there is a total discount
        if (JotForm.discounts.total) {
            if (subTotal >= minimum) {
                var reduce = type === "fixed" ? rate : (rate / 100) * parseFloat(subTotal);
                subTotal = subTotal > reduce ? subTotal - reduce : 0;
                total = total - reduce;
                couponInput.value = code;
            } else {
                reduce = 0;
                // clear (hidden) coupon input if total is less than required minimum
                couponInput.value = '';
            }
            // insert discount indicator
            $$('.form-payment-total')[0].insert({'top': JotForm.discounts.container});
            $('discount_total').update(parseFloat(reduce).formatMoney(decimal, dSeparator, tSeparator));
        }

        // if there is a shipping discount
        if (JotForm.discounts.shipping && shippingTotal > 0 && subTotal >= minimum) {
            var reduce = type === "fixed" ? rate : (rate / 100) * parseFloat(shippingTotal);
            var oldShippingTotal = shippingTotal;
            shippingTotal = shippingTotal > reduce ? shippingTotal - reduce : 0;
            total = total - (oldShippingTotal - shippingTotal);
        }

        if (subscriptionCustomPrice && $(subscriptionCustomPrice).checked) {
            total = $(subscriptionCustomPrice + '_custom_price').getValue();
        }

        // assign total to global var;
        this.paymentTotal = Number(total);
        // for PaypalPro only
        if ($('creditCardTable')) {
            // if total is zero and a valid coupon has been entered
            if (products > 0 && this.paymentTotal === 0 && discounted) {
                $('creditCardTable').hide();
            } else if ($$('input[id*="paymentType_credit"]')[0].checked) {
                $('creditCardTable').show();
            }
        }
        // update payment subtotal
        if ($("payment_subtotal")) {
            $("payment_subtotal").update(parseFloat(subTotal).formatMoney(decimal, dSeparator, tSeparator));
        }
        // update tax figures
        if ($("payment_tax")) {
            $("payment_tax").update(parseFloat(taxTotal).formatMoney(decimal, dSeparator, tSeparator));
        }
        // update shipping cost total
        if ($("payment_shipping")) {
            $("payment_shipping").update(parseFloat(shippingTotal).formatMoney(decimal, dSeparator, tSeparator));
        }
        // update overall total
        if ($("payment_total")) {
            $("payment_total").update(parseFloat(total).formatMoney(decimal, dSeparator, tSeparator));

            if ($("payment_total").up(".form-line") && $("payment_total").up(".form-line").triggerEvent) {
                $("payment_total").up(".form-line").triggerEvent("keyup");  //b#520074 trigger calculation
            }
        }
    },
    prices: {},
    /**
     * Sets the events for dynamic total calculation
     * @param {Object} prices
     */
    totalCounter: function (prices) {

        // format money function
        Number.prototype.formatMoney = function (c, d, t) {
            /* Fix: 784398 (Erhan)
                JavaScript's decimal point representation is not a thing what we think it is.
                So, we do not directly apply toFixed method on them.
                e.g. Try 1.925.toFixed(2) and 39.925.toFixed(2) on your browser.
                So, we need to add a tailing 1 if last decimal point is 5, and it is gonna be truncated.
            */
            var temp = (typeof this.toString().split('.')[1] !== 'undefined' && this.toString().split('.')[1].length > c && this.toString().charAt(this.toString().length - 1) === '5') ? this.toString() + '1' : this.toString();
            var n = parseFloat(temp),
                c = isNaN(c = Math.abs(c)) ? 2 : c,
                d = d === undefined ? "." : d,
                t = t === undefined ? "," : t,
                s = n < 0 ? "-" : "",
                i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
                j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        };

        // Assign form's initial prices to JotForm.prices object
        // so we can use it later
        JotForm.prices = prices;
        // count total price upon loading the form (Bug:168425)
        document.observe('dom:loaded', JotForm.countTotal(prices));
        $H(prices).each(function (pair) {
            $(pair.key).observe('click', function () {
                JotForm.countTotal(prices);
            });

            // if this is a subscription with custom pricing
            if (pair.value.price == "custom") {
                $(pair.key + '_custom_price').observe('keyup', function () {
                    JotForm.countTotal(prices);
                });
            }

            // if tax is present
            if (pair.value.tax) {
                var surcharge = pair.value.tax.surcharge;
                // observe change event for surcharge location field
                // for dropdowns
                if ($$('select[id*="input_' + surcharge.field + '"]').length > 0) {
                    $$('select[id*="input_' + surcharge.field + '"]')[0].observe('change', function () {
                        setTimeout(JotForm.countTotal(), 500);
                    });
                }
                // for text fields (address:state)
                if ($$('input[id="input_' + surcharge.field + '"]').length > 0) {
                    $$('input[id="input_' + surcharge.field + '"]')[0].observe('keyup', function () {
                        setTimeout(JotForm.countTotal(), 500);
                    });
                }
            }


            var triggerAssociatedElement = function (el) {
                var prodID = $(el).id.match(/input_([0-9]*)_quantity_/) || $(el).id.match(/input_([0-9]*)_custom_/);
                setTimeout(function () {

                    if (prodID && $('id_' + prodID[1])) {
                        $('id_' + prodID[1]).triggerEvent('click');
                    }

                    var productItem = el.up(".form-product-item");
                    if (productItem && productItem.down("input") && productItem.down("input").validateInput) {
                        productItem.down("input").validateInput();
                    }

                }, 100);
            };

            if ($(pair.value.quantityField)) {
                function countQuantityTotal() {
                    if (JotForm.isVisible($(pair.value.quantityField))) {
                        // Neil: temporary fix for 287973
                        // because we run the change event for quantity upon loading (to evaluate the conditions),
                        // the associated product checkbox should not change if quantity did not change value
                        if ($(pair.value.quantityField).tagName !== 'SELECT'
                            || $(pair.value.quantityField).getSelected().index > 0
                            || $(pair.value.quantityField).getValue() === "0") // also trigger uncheck when value is "0"
                        {
                            $(pair.key).checked = !($(pair.value.quantityField).getValue() <= 0) ? true : false;
                        }
                        JotForm.countTotal(prices);
                    }
                }

                $(pair.value.quantityField).observe('change', function () {
                    setTimeout(countQuantityTotal, 50);
                    triggerAssociatedElement(this);

                });
                // calculate total for custom quantity (text box)
                $(pair.value.quantityField).observe('keyup', function () {
                    setTimeout(countQuantityTotal, 50);
                    triggerAssociatedElement(this);
                });
            }
            if ($(pair.value.specialPriceField)) {
                function countSpecialTotal() {
                    if (JotForm.isVisible($(pair.value.specialPriceField))) {
                        // because we run the change event for quantity upon loading (to evaluate the conditions),
                        // the associated product checkbox should not change if quantity did not change value
                        if ($(pair.value.specialPriceField).tagName !== 'SELECT' || $(pair.value.specialPriceField).getSelected().index > 0) {
                            $(pair.key).checked = true;
                        }
                        JotForm.countTotal(prices);
                    }
                }

                $(pair.value.specialPriceField).observe('change', function () {
                    setTimeout(countSpecialTotal, 50);
                    triggerAssociatedElement(this);
                });
                $(pair.value.specialPriceField).observe('keyup', function () {
                    setTimeout(countSpecialTotal, 50);
                });
            }
        });
    },

    /**
     * Holds discount rates from verified coupon codes
     */
    discounts: {},

    /**
     * Handles payment coupon code verification
     */

    handleCoupon: function () {
        var $this = this;
        JotForm.countTotal(JotForm.prices);
        if ($('coupon-button')) {
            var cb = $('coupon-button'),
                cl = $('coupon-loader'),
                cm = $('coupon-message'),
                ci = $('coupon-input');

            cb.innerHTML = this.paymentTexts.couponApply;
            var formID = $$('input[name="formID"]')[0].value;
            // prevent enter from submitting the form on coupon input
            ci.observe('keypress', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    cb.click();
                    ci.blur();
                }
            });

            // reset coupon inputs
            ci.enable();
            $$('input[name="coupon"]')[0].value = "";

            // verify the coupon on click
            cb.observe('click', function () {
                if (ci.value) {
                    cb.hide();
                    cl.show();
                    ci.value = ci.value.replace(/\s/g, "");
                    cb.disable();

                    //Native stripe subscriptions only available for subscriptions
                    var isStripe = (ci.hasAttribute('stripe') && window.paymentType === 'subscription');

                    var a = new Ajax.Jsonp(JotForm.server, {
                        parameters: {
                            action: 'checkCoupon',
                            coupon: ci.value,
                            formID: formID,
                            stripe: isStripe,
                            paymentID: $$('input[name="simple_fpc"]')[0].value
                        },
                        evalJSON: 'force',
                        onComplete: function (t) {
                            t = t.responseJSON || t;
                            if (t.success) {
                                if (t.message.indexOf('{') === -1) {
                                    if (t.message === "expired") {
                                        cm.innerHTML = $this.paymentTexts.couponExpired;
                                    } else {
                                        cm.innerHTML = $this.paymentTexts.couponInvalid;
                                    }
                                    ci.select();
                                    cl.hide();
                                    cb.show();
                                    cb.enable();
                                } else {
                                    cl.hide();
                                    cb.show();
                                    cm.innerHTML = $this.paymentTexts.couponValid;
                                    JotForm.applyCoupon(t.message);
                                }
                            }
                        }
                    });
                } else {
                    $('coupon-message').innerHTML = $this.paymentTexts.couponBlank;
                }
            }.bind(this));
        }
    },
    /**
     *  Applies coupon to prices on the front-end
     *  @param {Object} discount
     */

    applyCoupon: function (discount) {
        var $this = this;
        discount = JSON.parse(discount);
        JotForm.discounts = {};

        var cb = $('coupon-button'),
            cl = $('coupon-loader'),
            cm = $('coupon-message'),
            ci = $('coupon-input'),
            cf = $(cb.getAttribute('data-qid') + '_coupon'); // Hidden input for passing coupon to server (submit)
        cb.stopObserving('click');
        if (cf) {
            cf.value = discount.code;
        }
        cb.enable();
        ci.disable();
        cb.innerHTML = this.paymentTexts.couponChange;
        // When 'Change' button is clicked
        cb.observe('click', function () {
            // Clear hidden coupon input value
            cf.value = '';
            // Remove all original prices
            oldPrice.each(function (op) {
                op.remove();
            });
            // Remove "Discount" indicator container if present
            if (JotForm.discounts.container) {
                JotForm.discounts.container.remove();
            }
            //
            $$('span[id*="_price"]').each(function (field, id) {
                $(field).removeClassName('underlined');
            });
            $$('span[id*="_setupfee"]').each(function (field, id) {
                $(field).removeClassName('underlined');
            });
            // clear discounts object
            JotForm.discounts = {};
            cb.stopObserving('click');
            cm.innerHTML = "";
            cb.innerHTML = $this.paymentTexts.couponApply;
            ci.enable();
            ci.select();
            JotForm.handleCoupon();
        });
        var pair = [], oldPrice = [];
        // if this discount applies to product/subscription items
        // and discount applies to ALL items
        if (discount.products && discount.products.length > 0) {
            if (discount.products.include('all')) {
                discount.products = [];
                for (var key in productID) {
                    discount.products.push(productID[key].slice(-4));
                }
            }
        }
        // if the discount's payment type is product
        if (!discount.paymentType || (discount.paymentType && discount.paymentType === "product")) {
            // if this is a discount for individual items
            if (discount.apply === "product") {

                $A(discount.products).each(function (pid) {
                    JotForm.discounts[pid] = discount.rate + '-' + discount.type;
                    $$('span[id*="_price"]').each(function (field, id) {
                        if (field.id.indexOf(pid) > -1) {
                            $(field).addClassName('underlined');
                        }
                    });

                    if ($$('label[for*="' + pid + '"] span.form-product-details b')[0]) {
                        var priceContainer = $$('label[for*="' + pid + '"] span.form-product-details b')[0];
                        /*  The original price will be decreased by countTotal
                         *  The lines below will copy the unmodified original price and insert it before
                         *  the discounted price
                         */
                        oldPrice[pid] = new Element('span');
                        var span = new Element('span', {style: 'text-decoration:line-through'});
                        span.insert(priceContainer.innerHTML.replace("price", "price_old"));
                        oldPrice[pid].insert({top: '&nbsp'});
                        oldPrice[pid].insert(span);
                        oldPrice[pid].insert({bottom: '&nbsp'});
                        priceContainer.insert({top: oldPrice[pid]});
                    }
                });
            } else if (discount.apply === "total") {
                // if discount is for order total (excluding tax, shipping, etc)
                var discountHTML = $$('.form-payment-total b')[0].innerHTML.replace('Total:', 'Discount:').replace('payment_total', 'discount_total').replace('<span>', '<span> - ');
                // if this is a discount for the order total
                // add discount properties to JotForm.discounts
                // to be evaluated by countTotal
                JotForm.discounts = {
                    total: true,
                    code: discount.code,
                    minimum: discount.minimum,
                    type: discount.type,
                    rate: discount.rate,
                    container: new Element('span').insert(discountHTML + '<br><br>').setStyle({fontSize: '10px'})
                };
            } else {
                JotForm.discounts = {
                    shipping: true,
                    code: discount.code,
                    minimum: discount.minimum,
                    type: discount.type,
                    rate: discount.rate
                };
            }
        } else {

            // Neil: subscription coupons can either be applied to
            // a) first payment only (if first payment is specified)
            // b) all payments -- recurring and first payment

            // if the discount's payment type is subscription
            $A(discount.products).each(function (pid) {
                JotForm.discounts[pid] = discount.rate + '-' + discount.type;
                // specify to which does this discount apply
                if (discount.apply) {
                    JotForm.discounts[pid] += "-" + discount.apply;
                }
                // b#593901 for stripe-native coupons that are good only for one cycle
                if (discount.duration && discount.duration === 1) {
                    JotForm.discounts[pid] += "-once";
                }
                $$('span[id*="_price"]').each(function (field, id) {
                    // if price container is found and there is a setup fee and this discount applies
                    // to ALL payment for the current subscription item
                    // set style underlined, to note that the price was changed because of the discount
                    if (field.id.indexOf(pid) > -1 && $$('span[id*="' + pid + '_setupfee"]').length > 0 && discount.apply === "all") {
                        $(field).addClassName('underlined');
                        throw $break;
                    }
                });

                $$('span[id*="_setupfee"]').each(function (field, id) {
                    if (field.id.indexOf(pid) > -1) {
                        $(field).addClassName('underlined');
                        throw $break;
                    }
                });
            });
        }

        // call countTotal to update the prices
        JotForm.countTotal(JotForm.prices);

    },

    /**
     * Properly sets the public key for Stripe if any
     */
    setStripeSettings: function (pubkey, add_qid) {
        // skip on edit mode (b#439725)
        if ((["edit", "inlineEdit", "submissionToPDF"].indexOf(document.get.mode) > -1
            && document.get.sid) || location.href.indexOf('edit') > -1) {
            return;
        }
        //check if the Stripe v1 library is loaded
        if (
            (pubkey || add_qid) && typeof Stripe === 'function' &&
            typeof Stripe.setPublishableKey === 'function' &&
            typeof _StripeValidation === 'function'
        ) {
            var clean_pubkey = pubkey.replace(/\s+/g, '');
            Stripe.setPublishableKey(clean_pubkey);

            //set the validation
            var stripeV = new _StripeValidation();
            stripeV.setAddress_qid(add_qid);
            stripeV.init();
        }
    },

    /**
     * Initialize filepickerIO uploader
     * @param options - the filepickerIO options
     */
    setFilePickerIOUpload: function (options) {
        //check if filepickerIO script is available
        if (
            options && typeof filepicker === "object" &&
            typeof _JF_filepickerIO === "function"
        ) {
            //start the filepickerIO Uploader
            var fp = new _JF_filepickerIO(options);
            fp.init();
        } else {
            console.error("filepicker OR _JF_filepickerIO object library are missing");
        }
    },

    /**
     * Initiates the capctha element
     * @param {Object} id
     */
    initCaptcha: function (id) {
        /**
         * When captcha image requested on foreign pages
         * It gives error on initial load, probably because
         * SCRIPT embed. However when we delay the execution
         * Image request this problems resolves.
         */
        setTimeout(function () {
            // https://submit.jotformpro.com certificate has compatibility issues with IE8 #418400
            var UA = navigator.userAgent.toLowerCase(),
                IE = (UA.indexOf('msie') != -1) ? parseInt(UA.split('msie')[1], 10) : false;
            if (IE && IE < 9) {
                // IE 8 and below
                if (UA.indexOf('windows nt 5.1') != -1 || UA.indexOf('windows xp') != -1 || UA.indexOf('windows nt 5.2') != -1) {
                    // windows XP
                    JotForm.server = "https://www.jotform.com/server.php";
                }
            }

            var a = new Ajax.Jsonp(JotForm.server, {
                parameters: {
                    action: 'getCaptchaId'
                },
                evalJSON: 'force',
                onComplete: function (t) {
                    t = t.responseJSON || t;
                    if (t.success) {
                        $(id + '_captcha').src = 'https://www.jotform.com/server.php?action=getCaptchaImg&code=' + t.num;
                        $(id + '_captcha_id').value = t.num;
                    }
                }
            });
        }, 150);
    },
    /**
     * Relads a new image for captcha
     * @param {Object} id
     */
    reloadCaptcha: function (id) {
        $(id + '_captcha').src = JotForm.url + 'images/blank.gif';
        JotForm.initCaptcha(id);
    },
    /**
     * Zero padding for a given number
     * @param {Object} n
     * @param {Object} totalDigits
     */
    addZeros: function (n, totalDigits) {
        n = n.toString();
        var pd = '';
        if (totalDigits > n.length) {
            for (i = 0; i < (totalDigits - n.length); i++) {
                pd += '0';
            }
        }
        return pd + n.toString();
    },
    /**
     * @param {Object} d
     */
    formatDate: function (d) {
        var date = d.date;
        var month = JotForm.addZeros(date.getMonth() + 1, 2);
        var day = JotForm.addZeros(date.getDate(), 2);
        var year = date.getYear() < 1000 ? date.getYear() + 1900 : date.getYear();
        var id = d.dateField.id.replace(/\w+\_/gim, '');
        $('month_' + id).value = month;
        $('day_' + id).value = day;
        $('year_' + id).value = year;
        if ($('lite_mode_' + id)) {
            var lite_mode = $('lite_mode_' + id);
            var seperator = lite_mode.readAttribute('seperator');
            var format = lite_mode.readAttribute('format');

            var newValue = month + seperator + day + seperator + year;
            if (format == 'ddmmyyyy') {
                newValue = day + seperator + month + seperator + year;
            } else if (format == 'yyyymmdd') {
                newValue = year + seperator + month + seperator + day;
            }
            lite_mode.value = newValue;
        }

        $('id_' + id).fire('date:changed');
    },
    /**
     * Highlights the lines when an input is focused
     */
    highLightLines: function () {

        // Highlight selected line
        $$('.form-line').each(function (l, i) {
            l.select('input, select, textarea, div, table div, button').each(function (i) {

                i.observe('focus', function () {
                    if (JotForm.isCollapsed(l)) {
                        JotForm.getCollapseBar(l).run('click');
                    }
                    if (!JotForm.highlightInputs) {
                        return;
                    }
                    l.addClassName('form-line-active');
                    // for descriptions
                    if (l.__classAdded) {
                        l.__classAdded = false;
                    }
                }).observe('blur', function () {
                    if (!JotForm.highlightInputs) {
                        return;
                    }
                    l.removeClassName('form-line-active');
                });
            });
        });
    },
    /**
     * Gets the container FORM of the element
     * @param {Object} element
     */
    getForm: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        if (element && element.tagName == "BODY") {
            return false;
        }
        if (element.tagName == "FORM") {
            return $(element);
        }
        return JotForm.getForm(element.parentNode);
    },
    /**
     * Gets the container of the input
     * @param {Object} element
     */
    getContainer: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        if (element && element.tagName == "BODY") {
            return false;
        }
        if (element.hasClassName("form-line")) {
            return $(element);
        }
        return JotForm.getContainer(element.parentNode);
    },

    /**
     * Get the containing section the element
     * @param {Object} element
     */
    getSection: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        if (element && element.tagName == "BODY") {
            return false;
        }
        if ((element.hasClassName("form-section-closed") || element.hasClassName("form-section")) && !element.id.match(/^section_/)) {
            return element;
        }
        return JotForm.getSection(element.parentNode);
    },
    /**
     * Get the fields collapse bar
     * @param {Object} element
     */
    getCollapseBar: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        if (element && element.tagName == "BODY") {
            return false;
        }
        if (element.hasClassName("form-section-closed") || element.hasClassName("form-section")) {
            return element.select('.form-collapse-table')[0];
        }
        return JotForm.getCollapseBar(element.parentNode);
    },
    /**
     * Check if the input is collapsed
     * @param {Object} element
     */
    isCollapsed: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        if (element && element.tagName == "BODY") {
            return false;
        }
        if (element.className == "form-section-closed") {
            return true;
        }
        return JotForm.isCollapsed(element.parentNode);
    },
    /**
     * Check if the input is visible
     * @param {Object} element
     */
    isVisible: function (element) {
        element = $(element);
        if (!element.parentNode) {
            return false;
        }

        if (element.hasClassName('always-hidden')) {
            return false;
        }

        if (element && element.tagName == "BODY") {
            return true;
        }

        //exception for rich text editor because element is never visible
        if (element.hasClassName("form-textarea") && element.up('div').down('.nicEdit-main')
            && (element.up('.form-line') && JotForm.isVisible(element.up('.form-line')))) {

            return true;
        }

        if (element.style.display == "none" || element.style.visibility == "hidden") {
            return false;
        }

        return JotForm.isVisible(element.parentNode);
    },

    /**
     * check whether a current section has any widgets visible
     * @param  {object} section [the current section to check with]
     * @return {boolean}        [boolean value]
     */
    sectionHasVisibleiFrameWidgets: function (section) {
        var elements = section.select('.custom-field-frame');
        var hasVisible = false;
        elements.each(function (el) {
            if (JotForm.isVisible(el)) {
                hasVisible = true;
                throw $break;
            }
        });
        return hasVisible;
    },

    /**
     * Emre: to eneable/disable all submit buttons in multi-forms
     */
    enableDisableButtonsInMultiForms: function () {
        var allButtons = $$('.form-submit-button');
        allButtons.each(function (b) {
            if (b.up('ul.form-section')) {
                if (b.up('ul.form-section').style.display == "none") {
                    b.disable();
                } else {
                    if (b.className.indexOf("disabled") == -1 && !b.hasClassName("conditionallyDisabled")) {
                        b.enable();
                    }
                }
            }
        });
    },

    /**
     * Enables back the buttons
     */
    enableButtons: function () {
        setTimeout(function () {
            $$('.form-submit-button').each(function (b) {
                if(!b.hasClassName("conditionallyDisabled")) {
                    b.enable();
                }
                b.innerHTML = b.oldText;
            });
        }, 60);
    },

    disableButtons: function () {
        setTimeout(function () {
            $$('.form-submit-button').each(function (b) {
                b.innerHTML = JotForm.texts.pleaseWait;
                b.addClassName('lastDisabled');
                b.disable();
            });
        }, 60);
    },

    /**
     * Sets the actions for buttons
     * - Disables the submit when clicked to prevent double submit.
     * - Adds confirmation for form reset
     * - Handles the print button
     */
    setButtonActions: function () {

        $$('.form-submit-button').each(function (b) {
            b.oldText = b.innerHTML;
            b.enable(); // enable previously disabled button

            //Emre: to provide sending form with with clicking "enter" button in Multi-page forms
            //JotForm.enableDisableButtonsInMultiForms();
            if (getQuerystring('qp') === "") {
                b.observe('click', function () {
                    setTimeout(function () {
                        //Emre: to display all submit buttons
                        if (!$$('.form-error-message')[0] && !$$('.form-textarea-limit-indicator-error')[0]) { //Emre: when limit text are is used, submit button doesn't work (51335)
                            var allButtons = $$('.form-submit-button');
                            allButtons.each(function (bu) {
                                if (true) { // not for braintree
                                    bu.innerHTML = JotForm.texts.pleaseWait;
                                    //Emre: submit button problem (51335)
                                    bu.addClassName('lastDisabled');
                                    bu.disable();
                                }
                            });
                        }
                    }, 50);
                });
            }
        });

        $$('.form-submit-reset').each(function (b) {
            b.onclick = function () {
                if (!confirm(JotForm.texts.confirmClearForm)) {
                    return false;
                } else if (/chrom(e|ium)/.test(navigator.userAgent.toLowerCase()) && $('coupon-button')) {
                    // #529035 chrome browsers scroll down when pressing clear and if form has coupon field
                    return true;
                }

                //clear all errors after clear form called start feature request 154829
                $$(".form-line-error").each(function (tmp) {
                    tmp.removeClassName("form-line-error");

                });

                $$(".form-error-message", ".form-button-error").each(function (tmp) {
                    tmp.remove();
                });
                //clear all errors after form called end
                //feature request 154940  must reset any form char limits for textareas start

                $$(".form-textarea-limit-indicator > span").each(function (tmp) {
                    var raw = tmp.innerHTML;
                    tmp.innerHTML = raw.replace(raw.substring(0, raw.indexOf("/")), "0");

                });

                //feature request implementation end

                //bugfix 187865  also reset grading tools total field
                $$("span[id^=grade_point_]").each(function (tmp) {
                    tmp.innerHTML = 0;
                });
                $$(".form-grading-error").each(function (tmp) {
                    tmp.innerHTML = ""; //also remove any previous grading errors
                });
                //bugfix end
                //note: TODO: instead of distinctively handling corner cases, it is best to fire a form change event that will trigger correct behaviour -kemal


                //b#423200 ensure that radios/chks are reset to defaults when autofill is enabled
                var autofill = $$('form')[0].readAttribute('data-autofill');
                if (autofill) {
                    setTimeout(function () {
                        for (var inputId in JotForm.defaultValues) {
                            var input = $(inputId);
                            if (input && (input.type == "radio" || input.type == "checkbox")) {
                                input.checked = true;
                            }
                        }

                        //save all the current (empty) data
                        var formID = $$('form').first().readAttribute('id') + $$('form').first().readAttribute('name');
                        var autoFillInstance = AutoFill.getInstance(formID);
                        if (autoFillInstance) {
                            autoFillInstance.saveAllData()
                        }

                    }, 40);
                }

                setTimeout(function () {
                    $$('.custom-hint-group').each(function (element) { //redisplay textarea hints
                        element.hasContent = ( element.value && element.value.replace(/\n/gim, "<br>") != element.readAttribute('data-customhint')) ? true : false;
                        element.showCustomPlaceHolder();
                    });
                }, 30);


                //clear rich text
                setTimeout(function () {
                    $$('.nicEdit-main').each(function (richArea) {
                        var txtarea = richArea.up('.form-line').down('textarea');
                        if (txtarea) {
                            if (txtarea.hasClassName('custom-hint-group') && !txtarea.hasContent) {
                                richArea.setStyle({'color': '#babbc0'});
                            } else {
                                richArea.setStyle({'color': ''});
                            }
                            richArea.innerHTML = txtarea.value;
                        }
                    });
                }, 40);

                //reset payment
                setTimeout(function () {
                    if ($('coupon-button') && $('coupon-button').triggerEvent) {
                        $('coupon-button').triggerEvent("click");
                    }
                    if ($('payment_total')) {
                        JotForm.totalCounter(JotForm.prices);
                    }
                }, 40);

                // reset widget inputs
                setTimeout(function () {
                    $$('input.form-widget').each(function (node) {
                        node.value = '';
                        node.fire('widget:clear', {
                            qid: parseInt(node.id.split('_')[1])
                        });
                    });
                }, 40);

                setTimeout(function () {
                    $$('.currentDate').each(function (el) {
                        var id = el.id.replace(/day_/, "");
                        JotForm.formatDate({date: (new Date()), dateField: $('id_' + id)});
                    });
                    $$('.currentTime').each(function (el) {
                        if (el.up(".form-line")) {
                            var id = el.up(".form-line").id.replace("id_", "");
                            if ($("hour_" + id)) {
                                JotForm.displayLocalTime("hour_" + id, "min_" + id, "ampm_" + id);
                            } else {
                                JotForm.displayLocalTime("input_" + id + "_hourSelect", "input_" + id + "_minuteSelect", "input_" + id + "_ampm")
                            }
                        }
                    });
                }, 40);

                setTimeout(function () {
                    JotForm.runAllConditions();
                }, 50);
            };
        });

        $$('.form-submit-print').each(function (print_button) {

            print_button.observe("click", function () {
                $(print_button.parentNode).hide();
                //nicedit compatibility start:
                var hidden_nicedits_arr = []; //nicedit.js rich text editors require special actions this will hold them to allow us to restore them to later stage
                var nicedit_textarea_to_hide = []; //after print completed textareas will be shown, we do not want nicedit textareas to be shown
                //nicedit compatibility end

                //omer - detecting media print style rules
                /*
                 fileCount = document.styleSheets.length;
                 injectedCss = document.styleSheets[fileCount-1];
                 printStyle = '';

                 for(i=0; i<injectedCss.cssRules.length; i++) {
                 if(injectedCss.cssRules[i].media) {
                 if (injectedCss.cssRules[i].media[0]=="print") {
                 printStyle += injectedCss.cssRules[i].cssText;
                 }
                 }
                 }
                 */
                //omer

                $$('.form-textarea, .form-textbox').each(function (el) {

                    if (!el.type) { // type of slider is undefined
                        el.value = el.value || '0'; // to protect problem when slider has no value
                    }
                    //Emre: to prevent css problem on "Date Time" so <span> must be added(66610)
                    var dateSeparate;
                    if (dateSeparate = el.next('.date-separate')) {
                        dateSeparate.hide();
                    }
                    //Emre: we must specify "width" and "height" to prevent getting new line
                    var elWidth = "";
                    if (el.value.length < el.size) {
                        elWidth = "width:" + el.size * 9 + "px;";
                    }

                    //kemal: 'display:inline-block' added to prevent bug:219794 phone field prints miss aligned. display:inline-block only added el is of Phone Field
                    if (el.id.indexOf("_area") != -1 || el.id.indexOf("_phone") != -1 || (el.id.indexOf("_country") != -1 && el.readAttribute('type') == 'tel')) {
                        elWidth += " display:inline-block;"
                    }

                    //nicedit compatibility start: kemal: richtext editor compatibility: 1st check if el is form-textarea and also is a rich text editor
                    if (el.hasClassName("form-textarea") && "nicEditors" in window) { //"nicEditors" in window added for somehow if this check fails, do not give errors
                        $$("#cid_" + el.id.split("_")[1] + " > div:nth-child(1)").each(function (tmpel) {
                            if (tmpel.readAttribute("unselectable") == "on") {
                                for (var i = 0; i < nicEditors.editors.length; i++) {
                                    nicEditors.editors[i].nicInstances[0].saveContent();
                                }
                                //update richtext value
                                $$("#cid_" + el.id.split("_")[1] + " > div").each(function (richtextdivs) {
                                    richtextdivs.hide();
                                    hidden_nicedits_arr.push(richtextdivs); //push hidden divs to hidden_nicedits_arr to be later shown
                                });
                                nicedit_textarea_to_hide.push(el);// push textarea of nicedit, to be later hidden, because after print process completes we show all textareas by default
                            }
                        });
                    }
                    //nicedit compatibility end


                    /*el.insert({
                     before: new Element('div', {
                     className: 'print_fields'
                     }).update(el.value.replace(/\n/g, '<br>')).setStyle('padding:1px 4px; min-height:18px;' + elWidth)
                     }).hide();*/
                });
                window.print();

                /*$$('.form-textarea, .form-textbox, .date-separate').invoke('show');

                 //nicedit compatibility start: also show hidden richtextEditor divs and hide richtextEditor textareas start
                 for(var i=0; i<hidden_nicedits_arr.length;i++){hidden_nicedits_arr[i].show();}
                 for(var i=0; i<nicedit_textarea_to_hide.length;i++){nicedit_textarea_to_hide[i].hide();}
                 //nicedit compatibility end

                 $$('.print_fields').invoke('remove');*/
                $(print_button.parentNode).show();
            });

        });
    },

    /**
     * These will correct any errors in a tool with a validations
     * especially in hidden mode. Thus it will ignore the said validation
     */
    hasHiddenValidationConflicts: function (input) {
        var hiddenOBJ = input.up('li.form-line');
        return hiddenOBJ && (hiddenOBJ.hasClassName('form-field-hidden') || hiddenOBJ.up('ul.form-section').hasClassName('form-field-hidden'));
    },

    /**
     * Handles the functionality of control_grading tool
     */
    initGradingInputs: function () {

        var _this = this;//JotForm object

        $$('.form-grading-input').each(function (item) {

            //register a blur event to validate the
            item.observe('blur', function () {
                item.validateGradingInputs();
            });
            item.observe('keyup', function () {
                item.validateGradingInputs();
            });

            //create a function that will check the validity of inputs
            //attach it to the items/grading inputs
            item.validateGradingInputs = function () {
                var item = this,
                    id = item.id.replace(/input_(\d+)_\d+/, "$1"),
                    total = 0,
                    _parentNode = $(item.parentNode.parentNode),
                    numeric = /^(\d+[\.]?)+$/,
                    isNotNumeric = false;

                //correct any errors first that is attach in the item obj
                item.errored = false;

                _parentNode.select(".form-grading-input").each(function (sibling) {
                    if (sibling.value && !numeric.test(sibling.value)) {
                        isNotNumeric = true;
                        throw $break;
                    }
                    total += parseFloat(sibling.value) || 0;
                });

                //check if hidden, if so return its valid
                if (_this.hasHiddenValidationConflicts(item)) return JotForm.corrected(item);

                //if not numeric then return an error
                if (isNotNumeric) {
                    return JotForm.errored(item, JotForm.texts.numeric);
                }

                if ($("grade_total_" + id)) {
                    //set the grade error notifier to empty
                    $("grade_error_" + id).innerHTML = "";
                    //set the allowed total to the grade_point notifier
                    var allowed_total = parseFloat($("grade_total_" + id).innerHTML);
                    $("grade_point_" + id).innerHTML = total;

                    if (total > allowed_total) {
                        //do the error display
                        $("grade_error_" + id).innerHTML = ' ' + JotForm.texts.lessThan + ' <b>' + allowed_total + '</b>.';
                        return JotForm.errored(item, JotForm.texts.gradingScoreError + " " + allowed_total);
                    }
                    else {
                        //remove error display
                        return JotForm.corrected(item);
                    }
                } else {
                    return JotForm.corrected(item);
                }
            }
        });
    },
    /**
     * Handles the functionality of control_spinner tool
     */
    initSpinnerInputs: function () {
        var _this = this;//JotForm object

        $$('.form-spinner-input').each(function (item) {

            //register a blur/change event to validate the data
            item.observe('blur', function () {
                item.validateSpinnerInputs();
            }).observe('change', function () {
                item.validateSpinnerInputs();
            });

            //register an event when the carret is clicked
            var c_parent = item.up('table.form-spinner'),
                c_up = c_parent.select('td.form-spinner-up')[0],
                c_down = c_parent.select('td.form-spinner-down')[0];

            c_up.observe('click', function (e) {
                item.validateSpinnerInputs();
            });
            c_down.observe('click', function (e) {
                item.validateSpinnerInputs();
            });

            //create a function that will check the validity of inputs
            //attach it to the items/spinner inputs
            item.validateSpinnerInputs = function () {
                var item = this,
                    id = item.id.replace(/input_(\d+)_\d+/, "$1"),
                    numeric = /^(-?\d+[\.]?)+$/,
                    numericDotStart = /^([\.]\d+)+$/,  //accept numbers starting with dot
                    userInput = item.value || 0;

                //correct any errors first that is attach in the item obj
                item.errored = false;

                //check if hidden, if so return its valid
                if (_this.hasHiddenValidationConflicts(item)) return JotForm.corrected(item);

                if (userInput && !numeric.test(userInput) && !numericDotStart.test(userInput)) {
                    return JotForm.errored(item, JotForm.texts.numeric);
                }
                if(item.hasClassName("disallowDecimals") && userInput % 1 != 0) {
                    return JotForm.errored(item, JotForm.texts.disallowDecimals);
                }

                //read the min and max val total, and check for inputs
                var min_val = parseInt(item.readAttribute('data-spinnermin')) || false,
                    max_val = parseInt(item.readAttribute('data-spinnermax')) || false;

                if (min_val && userInput < min_val) {
                    return JotForm.errored(item, JotForm.texts.inputCarretErrorA + " " + min_val);
                }
                else if (max_val && userInput > max_val) {
                    return JotForm.errored(item, JotForm.texts.inputCarretErrorB + " " + max_val);
                }
                else {
                    //remove error display
                    return JotForm.corrected(item);
                }
            }
        });
    },


    /**
     * Handles the functionality of control_number tool
     */
    initNumberInputs: function () {
        var _this = this;//JotForm object

        $$('.form-number-input').each(function (item) {

            //register a blur/change event to validate the data
            item.observe('blur', function () {
                item.validateNumberInputs();
            }).observe('change', function () {
                item.validateNumberInputs();
            }).observe('keyup', function () {
                item.validateNumberInputs();
            }).observe('keypress', function (event) {

                if(event.metaKey || event.ctrlKey) {
                    return;
                }
                // Backspace, tab, enter, end, home, left, right
                // We don't support the del key in Opera because del == . == 46.
                var controlKeys = [8, 9, 13, 35, 36, 37, 39];
                // IE doesn't support indexOf
                var isControlKey = controlKeys.join(",").match(new RegExp(event.which));
                // Some browsers just don't raise events for control keys. Easy.
                // e.g. Safari backspace.
                if (!event.which || // Control keys in most browsers. e.g. Firefox tab is 0
                    (48 <= event.which && event.which <= 57) || // Always 1 through 9
                    (46 == event.which) || (45 == event.which) || (43 == event.which) || // ., -, +
                    isControlKey) { // Opera assigns values for control keys.

                    if(event.which != 8 && event.which != 0 && event.which != 13 &&
                        (parseInt(this.value.length) >= parseInt(item.readAttribute('maxlength')) ||
                        (event.which < 45 || event.which > 57))) {
                        event.preventDefault();
                    } else {
                        return;
                    }
                } else {
                    event.preventDefault();
                }
            });

            //create a function that will check the validity of inputs
            //attach it to the items/number inputs
            item.validateNumberInputs = function () {
                var item = this,
                    id = item.id.replace(/input_(\d+)_\d+/, "$1"),
                    numeric = /^(-?\d+[\.]?)+$/,
                    numericDotStart = /^([\.]\d+)+$/;  //accept numbers starting with dot

                //correct any errors first that is attach in the item obj
                item.errored = false;

                //check if hidden, if so return its valid
                if (!JotForm.isVisible(item)) return JotForm.corrected(item);

                if (item.value && !numeric.test(item.value) && !numericDotStart.test(item.value) && item.hinted !== true) {
                    return JotForm.errored(item, JotForm.texts.numeric);
                }

                //read the min and max val total, and check for inputs
                var min_val = parseInt(item.readAttribute('data-numbermin')),
                    max_val = parseInt(item.readAttribute('data-numbermax')),
                    max_len = parseInt(item.readAttribute('maxlength'));

                if (max_len && item.value && item.value.length > max_len) {
                    return JotForm.errored(item, JotForm.texts.maxDigitsError + " " + max_len);
                }
                else if (( min_val || min_val == 0 ) && parseInt(item.value) < min_val) {
                    // item.value = min_val;
                    return JotForm.errored(item, JotForm.texts.inputCarretErrorA + " " + min_val);
                }
                else if (( max_val || max_val == 0 ) && parseInt(item.value) > max_val) {
                    // item.value = max_val;
                    return JotForm.errored(item, JotForm.texts.inputCarretErrorB + " " + max_val);
                }
                else {

                    var error = false
                    if (item.up('.form-matrix-table')) {
                        item.up('.form-matrix-table').select('input').each(function (el) {
                            if ((el !== item) && el.hasClassName('form-validation-error')) {
                                error = true;
                            }
                        });

                    }
                    //remove error display
                    if (!error) {
                        return JotForm.corrected(item);
                    }
                }
            }
        });
    },
    /**
     * Handles the pages of the form
     */
    backStack: [],
    currentSection: false,

    handlePages: function () {
        var $this = this;
        var pages = [];
        var last;

        // 345261: by default, back button containers gets its width from the label to maintain alignment
        // if they are wider than half the form, resize them
        if ($$('.form-label-left').length > 0) {
            var labelWidth = parseInt($$('.form-label-left')[0].getStyle('width')),
                formWidth = parseInt($$('.form-all')[0].getStyle('width')),
                backButtonWidth = labelWidth > formWidth / 2 ? formWidth / 2 : labelWidth;
            $$('.form-pagebreak-back-container').each(function (back) {
                // resize only if no custom css has been used
                if (back.style.width === '') {
                    back.style.width = (backButtonWidth - 14) + 'px';
                }
            });
        }

        $$('.form-pagebreak').each(function (page, i) {
            var section = $(page.parentNode.parentNode);
            if (i >= 1) {
                // Hide other pages
                section.hide();
            } else {
                JotForm.currentSection = section;
            }
            pages.push(section); // Collect pages

            section.pagesIndex = i + 1;

            function stopEnterKey(evt) {
                var evt = (evt) ? evt : ((event) ? event : null);
                var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
                if (evt.keyCode == 13 && ["text", "radio", "checkbox", "select-one", "select-multiple"].include(node.type)) {
                    return false;
                }
                if ((evt.keyCode == 13 || evt.which == 32)  && evt.target.hasClassName('form-pagebreak-next') && evt.target.triggerEvent) {
                    evt.target.triggerEvent('mousedown');
                }
            }

            document.onkeypress = stopEnterKey;

            var checkLanguageDropdownPage = function() {
                if(typeof FormTranslation !== 'undefined' && FormTranslation.properties && FormTranslation.properties.firstPageOnly) {
                    var dd = $$(".language-dd").length > 0 ? $$(".language-dd").first() : false;
                    if(!dd) return;
                    JotForm.currentSection === pages.first() ? dd.show() : dd.hide();
                }
            }

            section.select('.form-pagebreak-next').invoke('observe', 'click', function () { // When next button is clicked

                if (JotForm.saving) {
                    return;
                }
                if (JotForm.validateAll(JotForm.getForm(section), section) || getQuerystring('qp') !== "") {

                    if (window.parent && window.parent != window) {
                        window.parent.postMessage('scrollIntoView', '*');
                    }

                    if (JotForm.nextPage) {
                        JotForm.backStack.push(section.hide()); // Hide current
                        JotForm.currentSection = JotForm.nextPage.show();

                        //Emre: to prevent page to jump to the top (55389)
                        if (!$this.noJump) {
                            JotForm.currentSection.scrollIntoView(true);
                        }

                        JotForm.enableDisableButtonsInMultiForms();
                    } else if (section.next()) { // If there is a next page

                        JotForm.backStack.push(section.hide()); // Hide current
                        // This code will be replaced with condition selector
                        JotForm.currentSection = section.next().show();

                        // show widgets - kenneth: already handled under WidgetsServer.js
                        // JotForm.currentSection.select('.form-line').each(function(el) {
                        //     var id = el.id.split("_")[1];
                        //     if(JotForm.getInputType(id) === 'widget') {
                        //         JotForm.showWidget(id);
                        //     }
                        // });

                        //Emre
                        if (!$this.noJump && window.parent == window) {
                            JotForm.currentSection.scrollIntoView(true);
                        }

                        JotForm.enableDisableButtonsInMultiForms();
                    }

                    JotForm.nextPage = false;
                    if (JotForm.saveForm) {
                        JotForm.hiddenSubmit(JotForm.getForm(section));
                    }

                    JotForm.iframeHeightCaller();
                    JotForm.runAllCalculations(true);

                    checkLanguageDropdownPage();

                    if (JotForm.currentSection) {
                        JotForm.currentSection.select(".form-html").each(function (textEl) {
                            if (textEl.innerHTML.match(/google.*maps/gi)) { //google maps hack to get the iframe to redisplay in the right place
                                textEl.innerHTML = textEl.innerHTML;
                            }
                        });
                    }

                } else {
                    try {
                        $$('.form-button-error').invoke('remove');
                        $$('.form-pagebreak-next').each(function (nextButton) {
                            var errorBox = new Element('div', {className: 'form-button-error'});
                            errorBox.insert(JotForm.texts.generalPageError);
                            $(nextButton.parentNode.parentNode).insert(errorBox);
                        });
                    } catch (e) {
                        // couldnt find 'next button'
                    }
                }
            });

            section.select('.form-pagebreak-back').invoke('observe', 'click', function () { // When back button is clicked

                if (window.parent && window.parent != window) {
                    window.parent.postMessage('scrollIntoView', '*');
                }

                if (JotForm.saving) {
                    return;
                }
                section.hide();
                JotForm.currentSection = JotForm.backStack.pop().show();
                //Emre
                if (!$this.noJump && window.parent == window) {
                    JotForm.currentSection.scrollIntoView(true);
                }

                JotForm.nextPage = false;

                JotForm.enableDisableButtonsInMultiForms();

                if (JotForm.saveForm) {
                    JotForm.hiddenSubmit(JotForm.getForm(section));
                }
                //clear if there is an error bar near back-next buttons
                $$('.form-button-error').invoke('remove');

                JotForm.iframeHeightCaller();

                checkLanguageDropdownPage();

                setTimeout(function () {
                    JotForm.runAllCalculations(true); //so newly hidden fields may be excluded
                }, 10);
            });
        });

        // Handle trailing page
        if (pages.length > 0) {
            var allSections = $$('.form-section:not([id^=section_])');
            if (allSections.length > 0) {
                last = allSections[allSections.length - 1];
            }

            // if there is a last page
            if (last) {
                last.pagesIndex = allSections.length;
                pages.push(last); // add it with the other pages
                last.hide(); // hide it until we open it
                var li = new Element('li', {
                    className: 'form-input-wide'
                });
                var cont = new Element('div', {
                    className: 'form-pagebreak'
                });
                var backCont = new Element('div', {
                    className: 'form-pagebreak-back-container'
                });
                var back = $$('.form-pagebreak-back-container')[0].select('button')[0];

                back.observe('click', function () {
                    if (JotForm.saving) {
                        return;
                    }
                    last.hide();
                    JotForm.nextPage = false;
                });

                backCont.insert(back);
                cont.insert(backCont);
                li.insert(cont);
                last.insert(li);
            }
        }
    },
    /**
     * Go straight to page on form load
     */
    jumpToPage: function () {
        var page = document.get.jumpToPage;
        var sections = $$('.form-section:not([id^=section_])');

        if (!(page && page > 1) || page > sections.length) return; //no page to jump to

        sections[0].hide();
        sections[page - 1].show();

        if (page > 2) JotForm.backStack = sections.splice(0, page - 1); //so the back button will go to the previous pages and not the first

        JotForm.runAllCalculations(true); //so newly hidden fields may be excluded
    },
    /**
     * Handles the functionality of Form Collapse tool
     */
    handleFormCollapse: function () {
        var $this = this;
        var openBar = false;
        var openCount = 0;
        $$('.form-collapse-table').each(function (bar) {
            var section = $(bar.parentNode.parentNode);
            //section.setUnselectable();  //ntw - bug#209358  - If anyone knows why this line exists please tell me - prevents selection in firefox under collapses and I cannot see that it performs any other function
            if (section.className == "form-section-closed") {
                section.closed = true;
            } else {
                if (section.select('.form-collapse-hidden').length < 0) {
                    openBar = section;
                    openCount++;
                }
            }
            bar.observe('click', function () {

                if (section.closed) {
                    section.setStyle('overflow:visible; height:auto');
                    var h = section.getHeight();

                    if (openBar && openBar != section && openCount <= 1) {
                        openBar.className = "form-section-closed";
                        openBar.shift({
                            height: 60,
                            duration: 0.5
                        });
                        openBar.select('.form-collapse-right-show').each(function (e) {
                            e.addClassName('form-collapse-right-hide').removeClassName('form-collapse-right-show');
                        });
                        openBar.closed = true;
                    }
                    openBar = section;
                    section.setStyle('overflow:hidden; height:60px');
                    // Wait for focus
                    setTimeout(function () {
                        section.scrollTop = 0;
                        section.className = "form-section";
                    }, 1);

                    section.shift({
                        height: h,
                        duration: 0.5,
                        onStart: function () {
                            // ready every widget if any
                            section.select('.form-line[data-type=control_widget]').each(function (e) {
                                var field = e.id.split('_').last();
                                JotForm.showWidget(field);
                            });
                        },
                        onEnd: function (e) {
                            e.scrollTop = 0;
                            e.setStyle("height:auto;");
                            if (!$this.noJump) {
                                e.scrollIntoView();
                            }
                        },
                        onStep: function (e) {
                            // update frame height if embed
                            if (window.parent && window.parent != window) {
                                window.parent.postMessage('setHeight:' + $$('body')[0].getHeight(), '*');
                            }
                        }
                    });
                    section.select('.form-collapse-right-hide').each(function (e) {
                        e.addClassName('form-collapse-right-show').removeClassName('form-collapse-right-hide');
                    });
                    section.closed = false;

                    if (bar.errored) {
                        bar.select(".form-collapse-mid")[0].setStyle({
                            color: ''
                        }).select('img')[0].remove();
                        bar.errored = false;
                    }

                } else {

                    section.scrollTop = 0;
                    section.shift({
                        height: 60,
                        duration: 0.5,
                        onEnd: function (e) {
                            e.className = "form-section-closed";
                        },
                        onStep: function (e) {
                            // update frame height if embed
                            if (window.parent && window.parent != window) {
                                window.parent.postMessage('setHeight:' + $$('body')[0].getHeight(), '*');
                            }
                        }
                    });

                    //Emre: Added if because of preventing collapse open/close bug
                    if (openBar) {
                        openBar.select('.form-collapse-right-show').each(function (e) {
                            e.addClassName('form-collapse-right-hide').removeClassName('form-collapse-right-show');
                        });
                    }

                    section.closed = true;
                }
            });
        });
    },

    /**
     * Handles Authorize.Net payment validation
     */

    handleAuthNet: function () {
        var thisForm = $$('.jotform-form')[0];
        var paymentFieldId = $$('input[name="simple_fpc"]')[0].value;
        Event.observe(thisForm, 'submit', function (event) {
            // clear errors first
            JotForm.corrected($$('.cc_firstName')[0]);
            // skip edit mode
            if (JotForm.isEditMode()) {
                return true;
            }
            if (JotForm.isPaymentSelected() && JotForm.paymentTotal > 0) {
                var errors;
                $$('#id_' + paymentFieldId + ' [class*="cc"]').each(function (cc) {
                    if (!cc.getValue()) {
                        errors = JotForm.texts.ccMissingDetails;
                        throw $break;
                    }
                });
                // if there are errors
                if (errors) {
                    Event.stop(event);
                    setTimeout(function () {
                        JotForm.errored($$('.cc_firstName')[0], errors);
                        JotForm.enableButtons();
                    }, 500);
                } else {
                    JotForm.corrected($$('.cc_firstName')[0]);
                }
            }
        });
    },

    /**
     *  Handles Paypal Pro payment methods
     *  and field validations
     */
    handlePaypalPro: function () {
        if ($('creditCardTable')) {
            var thisForm = $$('.jotform-form')[0];
            var paymentFieldId = $$('input[name="simple_fpc"]')[0].value;
            Event.observe(thisForm, 'submit', function (event) {

                if (JotForm.isEditMode()) {
                    return true;
                }

                if (JotForm.isPaymentSelected() && JotForm.paymentTotal > 0) {
                    // default error
                    var errors = "";
                    JotForm.corrected($$('.paymentTypeRadios')[0]);
                    // if no payment method is selected
                    if (!$$('.paymentTypeRadios')[0].checked && !$$('.paymentTypeRadios')[1].checked) {
                        errors = "You must select a payment method";
                    }
                    // if payment method is credit card
                    if ($('input_' + paymentFieldId + '_paymentType_credit').checked) {
                        $$('#id_' + paymentFieldId + ' [class*="cc"]').each(function (cc) {
                            if (!cc.getValue()) {
                                errors = "All fields are required";
                                throw $break;
                            }
                        });
                    }
                    // if there are errors
                    if (errors) {
                        JotForm.errored($$('.paymentTypeRadios')[0], errors);
                        Event.stop(event);
                    } else {
                        JotForm.corrected($$('.paymentTypeRadios')[0]);
                    }
                }
            });
            $$('.paymentTypeRadios').each(function (radio) {
                radio.observe('click', function () {
                    if (radio.checked && radio.value === "express") {
                        $('creditCardTable').hide();
                    }
                    // If credit is selected and payment total is greater than zero or if there is no discount coupon
                    if (radio.checked && radio.value === "credit" && ( JotForm.paymentTotal > 0 || Object.keys(JotForm.discounts).length === 0 )) {
                        $('creditCardTable').show();
                    }
                    JotForm.corrected($$('.paymentTypeRadios')[0]);
                    // toggle checkout buttons
                    JotForm.togglePaypalButtons(radio.checked && radio.value === "express");
                });
            });
        }
    },

    /**
     * Creates description boxes next to input boxes
     * @param {Object} input
     * @param {Object} message
     */
    description: function (input, message) {
        // v2 has bugs, v3 has stupid solutions
        if (message == "20") {
            return;
        } // Don't remove this or some birthday pickers will start to show 20 as description

        var lineDescription = false;
        if (!$(input)) {
            var id = input.replace(/[^\d]/gim, '');
            if ($("id_" + id)) {
                input = $("id_" + id);
                lineDescription = true;
            } else if ($('section_' + id)) {
                input = $('section_' + id);
                lineDescription = true;
            } else {
                return;
                /* no element found to display a description */
            }
        }

        if ($(input).setSliderValue) {
            input = $($(input).parentNode);
        }

        var cont = JotForm.getContainer(input);
        if (!cont) {
            return;
        }
        var right = false;

        var bubble = new Element('div', {className: 'form-description'});
        var arrow = new Element('div', {className: 'form-description-arrow'});
        var arrowsmall = new Element('div', {className: 'form-description-arrow-small'});
        var content = new Element('div', {className: 'form-description-content'});
        var indicator;

        if ("desc" in document.get && document.get.desc == 'v2') {
            right = true;
            cont.insert(indicator = new Element('div', {className: 'form-description-indicator'}));
            bubble.addClassName('right');
        }

        content.insert(message);
        bubble.insert(arrow).insert(arrowsmall).insert(content).hide();

        cont.insert(bubble);

        if ((cont.getWidth() / 2) < bubble.getWidth()) {
            bubble.setStyle('right: -' + ( cont.getWidth() - ( right ? 100 : 20 ) ) + 'px');
        }

        if (right) {
            var h = indicator.measure('height');
            arrow.setStyle('top:' + ((h / 2) - 20) + 'px');
            arrowsmall.setStyle('top:' + ((h / 2) - 17) + 'px');

            $(cont).mouseEnter(function () {
                cont.setStyle('z-index:10000');
                if (!cont.hasClassName('form-line-active')) {
                    cont.addClassName('form-line-active');
                    cont.__classAdded = true;
                }
                bubble.show();
            }, function () {
                if (cont.__classAdded) {
                    cont.removeClassName('form-line-active');
                    cont.__classAdded = false;
                }
                cont.setStyle('z-index:0');
                bubble.hide();
            });
            $(input).observe('keydown', function () {
                cont.setStyle('z-index:0');
                bubble.hide();
            });
        } else {
            if (lineDescription) {
                $(input).mouseEnter(function () {
                    cont.setStyle('z-index:10000');
                    bubble.show();
                }, function () {
                    cont.setStyle('z-index:0');
                    bubble.hide();
                });
            } else {
                $(cont).mouseEnter(function () {
                    cont.setStyle('z-index:10000');
                    bubble.show();
                }, function () {
                    cont.setStyle('z-index:0');
                    bubble.hide();
                });
                $(input).observe('keyup', function () {
                    cont.setStyle('z-index:0');
                    bubble.hide();
                });
                $(input).observe('focus', function () {
                    cont.setStyle('z-index:10000');
                    bubble.show();
                });
                $(input).observe('blur', function () {
                    cont.setStyle('z-index:0');
                    bubble.hide();
                });
            }
        }
    },

    /**
     * do all validations at once and stop on the first error
     * @param {Object} form
     * @param {string} scopeSelector, used for selector scopes on following selectors :
     *   form-textarea-limit-indicator-error and form-datetime-validation-error
     */
    validateAll: function (form, scopeSelector) {

        var _log = function () {
            if (window.location.href.indexOf('stripeDebug') !== -1) {
                console.log.apply(console, arguments);
            }
        }

        if (getQuerystring('qp') !== "") {
            return true;
        }
        var ret = true;

        if (scopeSelector == undefined) {
            scopeSelector = $$('body')[0];
        }

        scopeSelector.select('.form-textarea-limit-indicator-error').each(function(limitErr) {
            if(JotForm.isVisible(limitErr)) {
                _log('set to false because .form-textarea-limit-indicator-error');
                ret = false;
            }
        });

        if (scopeSelector.select('.form-datetime-validation-error').first()) {
            _log('set to false because .form-datetime-validation-error');
            ret = false;
        }

        //validation fo spinners,number when the form is submitted
        var spinnerNumberInputs = scopeSelector.select('.form-spinner-input, .form-number-input, .form-grading-input');
        if (spinnerNumberInputs.length > 0) {
            spinnerNumberInputs.each(function(input) {
                var qid = input.id.split('_')[1];
                var type = input.readAttribute('data-type');
                switch (type) {
                    case 'input-number':
                        //call the validator function to validate the data
                        ret = (!input.validateNumberInputs()) ? false : ret;
                    break;
                    case 'input-spinner':
                        ret = (!input.validateSpinnerInputs()) ? false : ret;
                    break;
                    case 'input-grading': //deprecated
                        ret = (!input.validateGradingInputs()) ? false : ret;
                    break;
                }
            });
        }

        if (window.signatureForm) {
            _log('signature form');
            var pads = jQuery(".pad");

            for (var i = 0; i < pads.length; i++) {
                var pad = pads[i];
                if (jQuery(pad).attr("data-required") === "true") {
                    if (jQuery(pad).parent().parent().parent().is(":visible")) {
                        var w = jQuery(pad).parent().parent()
                        if (jQuery(pad).jSignature('getData', 'base30')[1].length == 0 && !jQuery(pad).hasClass('edit-signature')) {
                            ret = false;
                            if (w.find(".form-line-error").length == 0) {
                                var preLink = ( JotForm.url.search("https") == -1 ) ? "http://cdn.jotfor.ms/" : "https://cdn.jotfor.ms/";
                                w.append('<div class="form-line-error" style="float:left;margin-top:5px;">' +
                                    '<div class="form-error-message">' +
                                    '<img src="' + preLink + 'images/exclamation-octagon.png" align="left" style="margin-right:5px;">' +
                                    '<div class="form-error-arrow">' +
                                    '<div class="form-error-arrow-inner"></div>' +
                                    '</div>' +
                                    JotForm.texts.required +
                                    '</div></div>');
                            }
                        } else {
                            w.find(".form-line-error").remove();
                        }
                    }
                }
            }
        }

        if (window.JCFServerCommon !== undefined) {
            _log('widgets detected');
            var widgetInputs = $$('.widget-required, .widget-errored');
            widgetInputs.each(function (el) {
                if (JotForm.isVisible(el)) {
                    if ($(JotForm.currentSection) && $(JotForm.currentSection).select('.form-section').length > 0) {
                        if (el.up('.form-section').id === $(JotForm.currentSection).select('.form-section')[0].id) {
                            if (el.value.length === 0) {
                                ret = false;
                            }
                        }
                    } else {
                        if (el.up('.form-section').visible()) {
                            if (el.value.length === 0) {
                                ret = false;
                            }
                        }
                    }
                }
            });
        }

        var c = "";
        if (form && form.id) {
            c = "#" + form.id + " ";
        }

        $$(c + '*[class*="validate"]').each(function (input) {


            if (JotForm.payment && input.up('.form-line')) { //b#486482 only run on first payment input as that will iterate over all of the others
                var dataType = input.up('.form-line').getAttribute('data-type');
                if (dataType == "control_" + JotForm.payment) {
                    if (input.up('.form-line').select(input.tagName + '[class*="validate"]').first() != input) {
                        return;
                    }
                }
            }

            _log('looping inputs with validation :');
            _log(input);
            if (input.validateInput === undefined) {
                _log('no required continuing');
                return;
                /* continue; */
            }
            if (!(!!input.validateInput && input.validateInput())) {
                ret = JotForm.hasHiddenValidationConflicts(input);
                _log('ret setted ' + ret);
            }
        });
        _log('final ret value ' + ret);
        return ret;
    },

    /**
     * When an input is errored
     * @param {Object} input
     * @param {Object} message
     */
    errored: function (input, message) {

        input = $(input);

        if (input.errored) {
            return false;
        }

        if (input.runHint) {
            input.runHint();
        }
        /*else{
         //input.select();
         }*/

        if (this.url.search("https") == -1) {
            var preLink = "http://cdn.jotfor.ms/";
        } else {
            var preLink = "https://cdn.jotfor.ms/";
            // var preLink = "https://www.jotform.com/";
        }

        if (JotForm.isCollapsed(input)) {

            var collapse = JotForm.getCollapseBar(input);
            if (!collapse.errored) {
                collapse.select(".form-collapse-mid")[0].insert({
                    top: '<img src="' + preLink + 'images/exclamation-octagon.png" align="bottom" style="margin-right:5px;"> '
                }).setStyle({color: 'red'});
                collapse.errored = true;
            }
        }
        var container = JotForm.getContainer(input);

        input.errored = true;
        input.addClassName('form-validation-error');
        container.addClassName('form-line-error');
        var insertEl = container;

        //if(JotForm.debug){
        insertEl = container.select('.form-input')[0];
        if (!insertEl) {
            insertEl = container.select('.form-input-wide')[0];
        }
        if (!insertEl) {
            insertEl = container;
        }
        //}
        insertEl.select('.form-error-message').invoke('remove');

        insertEl.insert(new Element('div', {
            className: 'form-error-message'
        }).insert('<img src="' + preLink + 'images/exclamation-octagon.png" align="left" style="margin-right:5px;"> ' + message).insert(
            new Element('div', {className: 'form-error-arrow'}).insert(new Element('div', {className: 'form-error-arrow-inner'}))));

        JotForm.iframeHeightCaller();

        return false;
    },

    /**
     * When an input is corrected
     * @param {Object} input
     */
    corrected: function (input) {
        input = $(input);
        input.errored = false;

        var container = JotForm.getContainer(input);
        if (!container) {
            return true;
        }
        container.select(".form-validation-error").invoke('removeClassName', 'form-validation-error');
        container.removeClassName('form-line-error');
        container.select('.form-error-message').invoke('remove');

        if (JotForm.isCollapsed(input)) {
            var collapse = JotForm.getCollapseBar(input);
            if (collapse.errored && (collapse.up('.form-section-closed') && collapse.up('.form-section-closed').select('.form-validation-error').length == 0)) {
                collapse.select(".form-collapse-mid")[0].setStyle({
                    color: ''
                }).select('img')[0].remove();
                collapse.errored = false;
            }
        }

        setTimeout(function () {
            if ($$('.form-error-message').length == 0) {
                JotForm.hideButtonMessage();
            }
        }, 100);

        JotForm.iframeHeightCaller();

        return true;
    },

    hideButtonMessage: function () {
        $$('.form-button-error').invoke('remove');
    },

    showButtonMessage: function () {
        this.hideButtonMessage();

        $$('.form-submit-button').each(function (button) {
            var errorBox = new Element('div', {className: 'form-button-error'});
            errorBox.insert('<p>' + JotForm.texts.generalError + '</p>');
            $(button.parentNode.parentNode).insert(errorBox);
        });
    },

    disableGoButton: function () {
        if (navigator.appVersion.indexOf("iPhone") != -1 || navigator.appVersion.indexOf("iPad") != -1 || navigator.appVersion.indexOf("Android") != -1) {
            $$('input').each(function (input) {
                input.observe('keypress', function (e) {
                    var code = (e.keyCode ? e.keyCode : e.which);
                    if (code === 13) {
                        e.preventDefault();
                    }
                });
            });
        }
    },

    /**
     * Sets all validations to forms
     */
    validator: function () {

        if (this.debugOptions && this.debugOptions.stopValidations) {
            this.info('Validations stopped by debug parameter');
            return true;
        }
        var $this = this;

        $A(JotForm.forms).each(function (form) { // for each JotForm form on the page
            if (form.validationSet) {
                return;
                /* continue; */
            }

            form.validationSet = true;
            // Set on submit validation
            form.observe('submit', function (e) {
                try {
                    if ($$('.form-submit-button') && $$('.form-submit-button').length > 0) {
                        //only submit form if a submit button is visible
                        var aSubmitIsVisible = false;
                        $$('.form-submit-button').each(function (el) {
                            if (JotForm.isVisible(el.parentNode)) {
                                aSubmitIsVisible = true;
                                return;
                            }
                        });
                        if (!aSubmitIsVisible) {
                            JotForm.enableButtons();
                            e.stop();
                        }
                    }

                    if (!JotForm.validateAll(form)) {
                        JotForm.enableButtons();
                        JotForm.showButtonMessage();

                        if (JotForm.onSubmissionError) {
                            if (JotForm.onSubmissionError == "jumpToSubmit") {
                                var visSubmit = [];
                                $$('.form-submit-button').each(function (but) {
                                    if (JotForm.isVisible(but)) {
                                        visSubmit.push(but);
                                    }
                                    ;
                                });
                                if (visSubmit.length > 0) {
                                    if (visSubmit[visSubmit.length - 1].up('.form-line')) {
                                        visSubmit[visSubmit.length - 1].up('.form-line').scrollIntoView(false);
                                    } else {
                                        visSubmit[visSubmit.length - 1].scrollIntoView(false);
                                    }
                                }
                            } else if (JotForm.onSubmissionError == "jumpToFirstError") {
                                var firstError = $$('.form-error-message').first();
                                if (JotForm.isCollapsed(firstError)) {
                                    JotForm.getCollapseBar(firstError).run('click');
                                }
                                if (firstError && firstError.up('.form-line')) {
                                    setTimeout(function () { // #874165, delay scroll to wait for iframe height change
                                        $$('.form-error-message').first().up('.form-line').scrollIntoView();
                                    }, 500);
                                }
                            }
                        }

                        $$('.custom-hint-group').each(function (elem) { //redisplay textarea hints
                            elem.showCustomPlaceHolder();
                        });

                        e.stop();
                        return;
                    }

                    //if 'other' not checked disable corresponding textbox
                    $$('.form-radio-other,.form-checkbox-other').each(function (el) {
                        if (!el.checked && el.next()) {
                            el.next().disable();
                        }
                    });

                    JotForm.runAllCalculations(true);

                    $$('textarea.form-textarea:first-child').each(function (el) {
                        if (el.value) {
                            function escapeHtml(text) {
                                return text
                                    .replace(/&/g, "&amp;")
                                    .replace(/</g, "&lt;")
                                    .replace(/>/g, "&gt;")
                                    .replace(/"/g, "&quot;")
                                    .replace(/'/g, "&#039;");
                            }

                            el.value = escapeHtml(el.value);
                            textEl = el.clone();
                            textEl.writeAttribute("disabled", "true");
                            textEl.innerHTML = el.value;
                            el.up().appendChild(textEl);
                            el.hide();
                        }
                    });

                    if ($$('input, select, textarea').length > 900) { //collapse matrices for long forms
                        $$('.form-matrix-table').each(function (matrixTable) {
                            var matrixObject = {};
                            matrixTable.select("input, select").each(function (input) {
                                var ids = input.id.split("_");
                                var x = ids[2];
                                var y = ids[3];
                                if (input.type == "radio") {
                                    if (input.checked) {
                                        matrixObject[x] = input.value;
                                    } else if (!(x in matrixObject)) {
                                        matrixObject[x] = false;
                                    }
                                } else {
                                    if (!(x in matrixObject)) {
                                        matrixObject[x] = {};
                                    }
                                    if (input.type == "checkbox") {
                                        matrixObject[x][y] = input.checked ? input.value : false;
                                    } else {
                                        matrixObject[x][y] = input.value;
                                    }
                                }
                                input.writeAttribute("disabled", "true");
                            });

                            try {
                                var name = matrixTable.down('input, select').readAttribute("name").split("[")[0];
                                var matrixArea = new Element("textarea").setStyle({display: 'none'});
                                matrixTable.insert({after: matrixArea});
                                matrixArea.value = JSON.stringify(matrixObject);
                                matrixArea.writeAttribute("name", name);
                            } catch (e) {
                                console.log(e);
                            }
                        });
                    }

                    if(JotForm.isEncrypted) {
                        JotForm.encryptAll(e, function(submitForm){
                            if (submitForm) {
                                form.submit();
                            }
                        });
                    }

                    if (JotForm.autoFillDeployed) {
                        if (typeof window.localStorage !== 'undefined') {
                           window.localStorage.clear();
                        }
                    }

                } catch (err) {
                    JotForm.error(err);
                    e.stop();
                    return;
                }

                //enable any disabled(readonly) time dropdowns so they are submitted with the form
                $$('.time-dropdown').each(function (el) {
                    el.enable();
                });
                $$('.form-checkbox, .form-radio').each(function (el) {
                    el.enable();
                });
                $$('.conditionallyDisabled').each(function (el) {
                    el.enable();
                });

                // We will clear the contents of hidden fields, users don't want see the hidden fields on subscriptions
                if (JotForm.clearFieldOnHide !== "dontClear") {
                    $$('.form-field-hidden input', '.form-field-hidden select', '.form-field-hidden textarea').each(function (input) {
                        if (input.name == "simple_fpc") { // do not clear this field's value
                            return;
                        }

                        //b#490576 if we are in edit mode retain hidden values
                        if (document.get.mode == "edit" || document.get.mode == "inlineEdit") {
                            return;
                        }

                        if (input.tagName == 'INPUT' && ['checkbox', 'radio'].include(input.type)) {
                            input.checked = false;
                        } else {
                            input.clear();
                        }
                    });
                }

                if (JotForm.compact && JotForm.imageSaved == false) {
                    e.stop();
                    window.parent.saveAsImage();
                    // JotForm.enableButtons();
                    $(document).observe('image:loaded', function () {
                        var block;
                        $(document.body).insert(block = new Element('div').setStyle('position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);'));
                        block.insert('<table height="100%" width="100%"><tr><td align="center" valign="middle" style="font-family:Verdana;color:#fff;font-size:16px;">Please Wait...</td></tr></table>');
                        setTimeout(function () {
                            form.submit();
                        }, 1000);
                    });
                    return;
                }
            });

            // for each validation element
            $$('#' + form.id + ' *[class*="validate"]').each(function (input) {
                JotForm.setFieldValidation(input);
            });

            $$('.form-upload').each(function (upload) {

                try {

                    var required = !!upload.validateInput;
                    var exVal = upload.validateInput || Prototype.K;

                    upload.validateInput = function () {

                        //clean any errors first if any
                        upload.errored = false;

                        if (exVal() !== false) { // Make sure other validation completed

                            if (!upload.files) {
                                return true;
                            } // If files are not provied then don't do checks

                            var acceptString = upload.readAttribute('accept') || upload.readAttribute('file-accept') || "";
                            var maxsizeString = upload.readAttribute('maxsize') || upload.readAttribute('file-maxsize') || "";
                            var minsizeString = upload.readAttribute('minsize') || upload.readAttribute('file-minsize') || "";

                            var accept = acceptString.strip().toLowerCase().split(/\s*\,\s*/gim);
                            var maxsize = parseInt(maxsizeString, 10) * 1024;
                            var minsize = parseInt(minsizeString, 10) * 1024;

                            var file = upload.files[0];
                            if (!file) {
                                return true;
                            } // No file was selected

                            //Emre: to prevent extension of file problem in firefox7 (47183)
                            if (!file.fileName) {
                                file.fileName = file.name;
                            }

                            var ext = "";
                            if (JotForm.getFileExtension(file.fileName)) {
                                ext = JotForm.getFileExtension(file.fileName);
                            }
                            // allow file uploads with no file extension #567813
                            /*if (!ext){
                             return JotForm.errored(upload, JotForm.texts.noUploadExtensions);
                             }*/

                            if (acceptString != "*" && !accept.include(ext) && !accept.include(ext.toLowerCase())) {
                                return JotForm.errored(upload, JotForm.texts.uploadExtensions + '<br/>' + acceptString);
                            }

                            //check if validation if real image is set to yes
                            //if so check again if the meta data is correct and only if the extension is correct
                            var validateImage = upload.readAttribute('data-imagevalidate') || false;
                            var validatedImageExt = "jpeg, jpg, png, gif, bmp";
                            if ((accept.include(ext) || accept.include(ext.toLowerCase()) ) && //for the accepted extensions
                                validateImage && ( validateImage === 'yes' || validateImage === 'true' ) &&
                                (validatedImageExt.include(ext) || validatedImageExt.include(ext.toLowerCase()) ) && //for the accepted valid images
                                typeof window.FileReader != 'undefined' //only for modern browsers that supports it
                            ) {
                                //initiate the FileReader
                                var binary_reader = new FileReader();
                                binary_reader.onloadend = function (e) {
                                    function ab2str(buf) {
                                        var binaryString = '',
                                            bytes = new Uint8Array(buf),
                                            length = bytes.length;
                                        for (var i = 0; i < length; i++) {
                                            binaryString += String.fromCharCode(bytes[i]);
                                        }
                                        return binaryString;
                                    }

                                    var args = {
                                        filename: file.name,
                                        size: file.size,
                                        //convert string to binary
                                        binary: ab2str(e.target.result)
                                    };
                                    ImageInfo.loadInfo(args, function () {
                                        var info = ImageInfo.getAllFields(file.name);
                                        if (info.format === 'UNKNOWN') {
                                            return JotForm.errored(upload, "You have uploaded an invalid image file type.");
                                        }
                                    });
                                }
                                //read file as buffer array (binaryString is deprecated)
                                binary_reader.readAsArrayBuffer(file);
                            }

                            //Emre: to prevent file.fileSize being undefined in Firefox 7 (48526)
                            //Emre: to prevent file upload not to work in Firefox 3.
                            if (!file.fileSize) {
                                file.fileSize = file.size;
                            }

                            if (file.fileSize > maxsize) {
                                return JotForm.errored(upload, JotForm.texts.uploadFilesize + ' ' + maxsizeString + 'Kb');
                            }
                            if (file.fileSize < minsize) {
                                return JotForm.errored(upload, JotForm.texts.uploadFilesizemin + ' ' + minsizeString + 'Kb');
                            }

                            return JotForm.corrected(upload);
                        }
                    };

                    if (!required) {
                        upload.addClassName('validate[upload]');
                        upload.observe('blur', upload.validateInput);
                    }
                } catch (e) {

                    JotForm.error(e);

                }

            });
        });
    },

    dateFromField: function(field) {
        var offset = "";
        if(field.indexOf("-") > -1 || field.indexOf("+") > -1) {
            offset = field.split(/[\+\-]/)[1];
            offset = field.indexOf("-") > -1 ? "-"+offset : ""+offset;
            field = field.split(/[\+\-]/)[0];
        }
        field = field.replace(/[{}]/g, '');
        if(!$('year_'+field) || !$('year_'+field).value) return false;
        var year = $('year_'+field).value;;
        var month = $('month_'+field).value;
        var day = $('day_'+field).value;
        var date = new Date(year, month-1, day);
        if(offset.length) {
            date.setDate(date.getDate() + parseInt(offset, 10));
        }
        return date;
    },

    /*
     * set validation function on field
     */
    setFieldValidation: function (input) {
        var $this = this;
        var reg = {
            email: /^\S[a-z0-9\/.!#$%&'*+\/=?\^_`{|}~\-]*(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])$/i,
            alphanumeric: /^[\u00C0-\u1FFF\u2C00-\uD7FFa-zA-Z0-9\s]+$/,
            numeric: /^(-?\d+[\.]?)+$/,
            numericDotStart: /^([\.]\d+)+$/,  //accept numbers starting with dot
            currency: /^-?[\$\£\€]?\d*,?\d*(\.\d\d)?¥?$/,
            alphabetic: /^[\u00C0-\u1FFF\u2C00-\uD7FFa-zA-Z\s]+$/,
            cyrillic: /^[абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ\s]*$/,
            url: /(http|ftp|https){0,1}:{0,1}[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
        };
        var validations = input.className.replace(/.*validate\[(.*)\].*/, '$1').split(/\s*,\s*/);

        input.validateInput = function (deep) {
            if (document.get.ignoreValidation && document.get.ignoreValidation === "true") {
                return true;
            }

            if (!JotForm.isVisible(input)) {
                return true; // if it's hidden then user cannot fill this field then don't validate
            }

            if (!$(input.parentNode).hasClassName('form-matrix-values')
                && !input.hasClassName('form-subproduct-option')
                && !(input.id.match(/_quantity_/) || input.id.match(/_custom_/))) // do not clean product options (bugfix#461798)
            {
                JotForm.corrected(input); // First clean the element
            }
            var vals = validations;

            if (input.hinted === true) {
                input.clearHint();
                setTimeout(function () {
                    input.hintClear();
                }, 150);
            } // Clear hint value if exists

            //change where it deploys
            //to first check the data  of this inputs before going to the next with a validate[*] class
            if (input.readAttribute('data-type') === 'input-spinner' && input.value) {
                return input.validateSpinnerInputs();
            }
            else if (input.readAttribute('data-type') === 'input-grading' && input.value) {
                return input.validateGradingInputs();
            }
            else if (input.readAttribute('data-type') === 'input-number' && input.value) {
                return input.validateNumberInputs();
            }
            // check minimum donation amount
            else if (input.readAttribute('data-min-amount')) {
                return input.validateMinimum();
            }

            if (input.up('.form-line').down('.form-textarea-limit-indicator-error')) {
                // JotForm.handleTextareaLimits handles this better
                input.triggerEvent('change');
                return;
            }

            if (vals.include('disallowFree')) {
                var freeEmails = ['gmail', 'aim', 'outlook', 'hotmail', 'yahoo', 'mail', 'inbox'];
                for (var i = 0; i < freeEmails.length; i++) {
                    if (input.value.toLowerCase().indexOf("@" + freeEmails[i] + ".") > -1) {
                        return JotForm.errored(input, JotForm.texts.freeEmailError);
                    }
                }
            }

            if (vals.include('minSelection')) {
                var minSelection = parseInt(input.readAttribute('data-minSelection'));
                var numberChecked = 0;
                input.up('.form-line').select('input[type=checkbox]').each(function (check) {
                    if (check.checked) numberChecked++;
                });
                if (numberChecked > 0 && numberChecked < minSelection) {
                    return JotForm.errored(input, JotForm.texts.minSelectionsError + minSelection + '.');
                }
            }

            if (vals.include('maxSelection')) {
                var maxSelection = parseInt(input.readAttribute('data-maxSelection'));
                var numberChecked = 0;
                input.up('.form-line').select('input[type=checkbox]').each(function (check) {
                    if (check.checked) numberChecked++;
                });
                if (numberChecked > maxSelection) {
                    return JotForm.errored(input, JotForm.texts.maxSelectionsError + maxSelection + '.');
                }
            }

            if (vals.include('disallowPast')) {
                var id = input.id.split('_').last();
                var inputtedDate = JotForm.getDateValue(id).split('T')[0];
                var dat = new Date();
                var month = (dat.getMonth() + 1 < 10) ? '0' + (dat.getMonth() + 1) : dat.getMonth() + 1;
                var day = (dat.getDate() < 10) ? '0' + dat.getDate() : dat.getDate();
                var currentDate = dat.getFullYear() + "-" + month + "-" + day;

                if (JotForm.checkValueByOperator('before', JotForm.strToDate(currentDate), JotForm.strToDate(inputtedDate))) {
                    return JotForm.errored(input, JotForm.texts.pastDatesDisallowed);
                }
            }

            if (vals.include('limitDate')) {

                try {
                    var id = input.id.split('_').last();
                    var lim = JotForm.dateLimits[id];

                    if (lim !== false && !($("year_" + id).value == "" || $("month_" + id).value == "" || $("day_" + id).value == "")) {

                        //custom
                        if ("custom" in lim && lim.custom !== false && Array.isArray(lim.custom)) {
                            for (var j = 0; j < lim.custom.length; j++) {

                                var year = $("year_" + id).value;
                                var month = JotForm.addZeros($("month_" + id).value, 2);
                                var day = JotForm.addZeros($("day_" + id).value, 2);

                                if(lim.custom[j].indexOf("{") > -1) {
                                    var custom = JotForm.dateFromField(lim.custom[j]);
                                    custom = JotForm.addZeros(custom.getFullYear(),2)+"-"+JotForm.addZeros(custom.getMonth()+1,2)+"-"+JotForm.addZeros(custom.getDate(), 2);
                                    if(custom===year+"-"+month+"-"+day) return JotForm.errored(input, JotForm.texts.dateLimited);
                                    return;
                                }

                                if ((lim.custom[j] === year + "-" + month + "-" + day) || //full date
                                    (typeof lim.custom[j] == "string" && lim.custom[j].length === 5 && lim.custom[j] === (month + "-" + day)) || //day and month
                                    (typeof lim.custom[j] == "string" && lim.custom[j].length === 2 && lim.custom[j] == day)) { //day
                                    return JotForm.errored(input, JotForm.texts.dateLimited);
                                }
                            }
                        }

                        var date = new Date($("year_" + id).value, ($("month_" + id).value - 1), $("day_" + id).value);

                        //ranges
                        if ("ranges" in lim && lim.ranges !== false && Array.isArray(lim.ranges)) {
                            for (var j = 0; j < lim.ranges.length; j++) {
                                var range = lim.ranges[j].split(">");
                                var startDate;
                                if(range[0].indexOf("{") > -1) {
                                    startDate = JotForm.dateFromField(range[0]);
                                } else {
                                    var start = range[0].split("-");
                                    startDate = new Date(start[0], parseInt(start[1])-1, start[2]);
                                }
                                var endDate;
                                if(range[1].indexOf("{") > -1) {
                                    endDate = JotForm.dateFromField(range[1]);
                                } else {
                                    var end = range[1].split("-");
                                    endDate = new Date(end[0], parseInt(end[1])-1, end[2]);
                                }
                                if(endDate) {
                                    endDate.setDate(endDate.getDate() + 1);
                                    if (date.getTime() >= startDate.getTime() && date.getTime() < endDate.getTime()) {
                                        return JotForm.errored(input, JotForm.texts.dateLimited);
                                    }
                                }
                            }
                        }

                        //days
                        var dayOfWeek = JotForm.getDayOfWeek(date);
                        if ("days" in lim, dayOfWeek in lim.days && lim.days[dayOfWeek] == false) {
                            return JotForm.errored(input, JotForm.texts.dateLimited);
                        }

                        //future
                        if ("future" in lim && lim.future === false) {
                            var now = new Date();
                            if (date > now) {
                                return JotForm.errored(input, JotForm.texts.dateLimited);
                            }
                        }

                        //past
                        if ("past" in lim && lim.past === false) {
                            var now = new Date();
                            var yesterday = new Date();
                            yesterday.setDate(now.getDate() - 1);
                            if (date < yesterday) {
                                return JotForm.errored(input, JotForm.texts.dateLimited);
                            }
                        }

                        //start
                        if ("start" in lim && lim.start != false && lim.start != "") {
                            var start = lim.start.split("-");
                            if (start.length == 3) {
                                var startDate = new Date(start[0], start[1] - 1, start[2]);
                                if (date < startDate) {
                                    return JotForm.errored(input, JotForm.texts.dateLimited);
                                }
                            } else if(lim.start.indexOf('{') > -1) {
                                var startDate = JotForm.dateFromField(lim.start);
                                if (date < startDate) {
                                    return JotForm.errored(input, JotForm.texts.dateLimited);
                                }
                            }
                        }

                        //end
                        if ("end" in lim && lim.end != false && lim.end != "") {
                            var end = lim.end.split("-");
                            if (end.length == 3) {
                                var endDate = new Date(end[0], end[1] - 1, end[2]);
                                if (date > endDate) {
                                    return JotForm.errored(input, JotForm.texts.dateLimited);
                                }
                            } else if(lim.end.indexOf('{') > -1) {
                                var endDate = JotForm.dateFromField(lim.end);
                                if (date > endDate) {
                                    return JotForm.errored(input, JotForm.texts.dateLimited);
                                }
                            }
                        }

                    }
                } catch (e) {
                    console.log(e);
                }
            }

            if(vals.include('validateLiteDate')) {
                if(input.hasClassName("invalidDate")) {
                    var format = input.readAttribute("placeholder")
                    return JotForm.errored(input, JotForm.texts.dateInvalid.replace("{format}", format));
                }
            }

            //Emre confirmation email (36639)
            if (vals.include("Email_Confirm")) {
                //console.log("if (vals.include(\"Email_Confirm\")) {");
                var idEmail = input.id.replace(/.*_(\d+)(?:_confirm)?/gim, '$1'); //confirm email id is like "input_4_confirm"
                if (($('input_' + idEmail).value != $('input_' + idEmail + '_confirm').value)) {
                    return JotForm.errored(input, JotForm.texts.confirmEmail);
                } else if (($('input_' + idEmail + '_confirm').value) && (!reg.email.test($('input_' + idEmail + '_confirm').value))) {
                    return JotForm.errored(input, JotForm.texts.email);
                }
            }
            if (vals.include("required")) {
                if (input.tagName == 'INPUT' && input.readAttribute('type') == "file") { // Upload
                    if (input.value.empty() && !input.uploadMarked) {
                        return JotForm.errored(input, JotForm.texts.required);
                    } else {
                        return JotForm.corrected(input);
                    }
                } else if (input.tagName == "INPUT" && (input.readAttribute('type') == "radio" || input.readAttribute('type') == "checkbox")) {

                    if ($(input.parentNode).hasClassName('form-matrix-values')) { // This is in a matrix

                        var ty = input.readAttribute('type');
                        var matrixRows = {};
                        var oneChecked = false;
                        var oneEmpty = false;
                        input.up('table').select('input').each(function (e) {
                            if (!(e.name in matrixRows)) {
                                matrixRows[e.name] = false;
                            }
                            if (matrixRows[e.name] !== true) {
                                matrixRows[e.name] = e.checked;
                            }
                            if (matrixRows[e.name] === true) {
                                oneChecked = true;
                            }
                            if ('value' in e && e.value.strip(" ").empty()) {
                                oneEmpty = true;
                            }
                        });
                        if (vals.include("requireOneAnswer")) {
                            if (!oneChecked)
                                return JotForm.errored(input, JotForm.texts.requireOne);
                        } else if (vals.include('requireEveryCell') && oneEmpty) {
                            return JotForm.errored(input, JotForm.texts.requireEveryCell);
                        } else if (!$H(matrixRows).values().all()) {
                            return JotForm.errored(input, JotForm.texts.requireEveryRow);
                        } else {
                            return JotForm.corrected(input);
                        }

                    } else {

                        if(input.next() && input.next().hasClassName("form-"+input.type+"-other-input")) { //b#641595 if other is checked box should be filled
                            if(input.checked && input.next().value == "") {
                                return JotForm.errored(input, JotForm.texts.required);
                            }
                        }

                        var baseInputName = input.name.substr(0, input.name.indexOf('['));
                        var otherInputName = baseInputName + '[other]';
                        var checkboxArray = [];
                        // If 'Other' input exists;
                        if (document.getElementsByName(otherInputName)[0]) {
                            // Assign all checkboxes including 'Other' to array
                            checkboxArray = $A(document.getElementsByName(baseInputName + '[]'));
                            checkboxArray[checkboxArray.length] = document.getElementsByName(otherInputName)[0];
                            // Validate each checkbox
                            if (!checkboxArray.map(function (e) {
                                    return e.checked;
                                }).any()) {
                                return JotForm.errored(input, JotForm.texts.required);
                            }
                        } else {
                            var cont = JotForm.getContainer(input);
                            if (JotForm.payment && cont.getAttribute('data-type').match(JotForm.payment)) {
                                if (!$A(document.getElementsByName(input.name)).map(function (e) {
                                        if (JotForm.isVisible(e)) {
                                            // if this is an sub product checkbox (expanded)
                                            if (e.readAttribute('type') === "checkbox" && e.value.indexOf('_expanded') > -1) {
                                                // if not selected
                                                if (!e.checked) {
                                                    return false;
                                                } else {
                                                    // check if any of the quantities are filled
                                                    return $A($$('#' + e.id + '_subproducts .form-subproduct-quantity')).map(function (cb) {
                                                        return cb.getSelected().value > 0 || cb.value > 0;
                                                    }).any();
                                                }
                                            } else {
                                                return e.checked;
                                            }
                                        }
                                    }).any())
                                {
                                    // for paypalpro payment type radio
                                    if (input.hasClassName('paymentTypeRadios')) {
                                        return JotForm.errored(input, "Please select payment method.");
                                    }

                                    return JotForm.errored(input, JotForm.texts.required);
                                }
                            } else {
                                if(cont.select("input:checked").length === 0) {
                                    return JotForm.errored(input, JotForm.texts.required);
                                }

                            }
                        }

                    }
                } else if ((input.tagName == "INPUT" || input.tagName == "SELECT") && $(input.parentNode).hasClassName('form-matrix-values')) {
                    var matrixRows = {};
                    var oneEntry = false;
                    var oneEmpty = false;

                    input.up('table').select(input.tagName).each(function (e) {
                        if (!(e.name in matrixRows)) {
                            matrixRows[e.name] = false;
                        }
                        if (matrixRows[e.name] !== true) {
                            matrixRows[e.name] = (e.value && !e.value.strip(" ").empty());
                        }
                        if (matrixRows[e.name] === true) {
                            oneEntry = true;
                        }
                        if ('value' in e && e.value.strip(" ").empty()) {
                            oneEmpty = true;
                        }
                    });
                    if (vals.include("requireEveryRow") && !$H(matrixRows).values().all()) {
                        return JotForm.errored(input, JotForm.texts.requireEveryRow);
                    } else if (vals.include("requireOneAnswer") && !oneEntry) {
                        return JotForm.errored(input, JotForm.texts.requireOne);
                    } else if (vals.include('requireEveryCell') && oneEmpty) {
                        return JotForm.errored(input, JotForm.texts.requireEveryCell);
                    } else {
                        return JotForm.corrected(input);
                    }
                } else if ((input.tagName === "INPUT" || input.tagName === "SELECT") && input.hasClassName('form-subproduct-option')) {
                    // if this is a subproduct quantity option
                    if (input.hasClassName('form-subproduct-quantity')) {
                        var qID = input.id.replace(/_[0-9]*_[0-9]*$/, '');
                        // if the corresponding checkbox is  checked
                        if ($(qID.replace(/_quantity/, '')).checked) {
                            // if any of the quantities are greater than 0
                            if ($A($$('[id*="' + qID + '"]')).map(function (vl) {
                                    return (vl.getSelected().value > 0 || vl.value > 0);
                                }).any()) {
                                return JotForm.corrected(input); // corrected
                            } else {
                                return JotForm.errored(input, JotForm.texts.required); // errored
                            }
                        }
                    }
                } else if (input.name && input.name.include("[")) {
                    try {
                        var cont = $this.getContainer(input);
                        // Ozan, bugfix: 133419, both input and select fields should be selected
                        var checkValues = cont.select('input,select[name*=' + input.name.replace(/\[.*$/, '') + ']').map(function (e) {
                            // If this is an address field and country is not United States or Canada
                            // then don't require state name
                            if (e.hasClassName('form-address-state')) {
                                var country = cont.select('.form-address-country')[0].value;
                                if (country != 'United States' && country != 'Canada' && country != 'Please Select') {
                                    e.removeClassName('form-validation-error');
                                    e.__skipField = true;
                                    return false;
                                }
                            } else {
                                if (e.__skipField) {
                                    e.__skipField = false;
                                }
                            }
                            // if this is a donation box
                            if (e.id.match(/_donation/)) {
                                return e.getValue() == 0 ;
                            }

                            // If this is a custom quantity textbox
                            if (e.id.match(/input_[0-9]+_quantity_[0-9]+_[0-9]+/) && e.type == 'text') {

                                var cb = $(((e.id.replace('_quantity', '')).match(/input_[0-9]+_[0-9]+/))[0]);
                                var allProducts = $$('[id*="' + e.id.match(/input_[0-9]*/)[0] + '"][type="' + cb.getAttribute('type') + '"]');
                                // if this is a subproduct quantity
                                if (e.id.split("_").length === 6) {
                                    var subProductQty = $$('[id*="' + e.id.replace(/_[0-9]*_[0-9]*$/, "") + '"]');
                                }

                                if ((cb.checked && !subProductQty && (isNaN(e.value) || e.value == 0 || e.value.empty())) // if a product is selected and qty is not valid
                                    || (!allProducts.map(function (c) {
                                        return c.checked
                                    }).any()) // if there are no products selected
                                    || (cb.checked && subProductQty && !subProductQty.map(function (q) {
                                        return q.value > 0
                                    }).any()) // if this is a subproduct and none of the subproduct quantity are filled
                                ) {
                                    e.addClassName('form-validation-error');
                                    return true;
                                }
                            }
                            var innerVals = e.className.replace(/.*validate\[(.*)\].*/, '$1').split(/\s*,\s*/);
                            if (innerVals.include('required') && JotForm.isVisible(e)) {
                                if (e.value.empty() || e.value.strip() == 'Please Select') {
                                    e.addClassName('form-validation-error');
                                    return true;
                                } else {
                                    if(JotForm.getContainer(e).hasClassName("form-datetime-validation-error")) {
                                        return JotForm.errored(input, 'Enter a valid date');
                                    }
                                }
                            }
                            e.removeClassName('form-validation-error');
                            return false;
                        });
                        // skip payment field validation on edit mode (b#446215)
                        if (JotForm.payment && cont.getAttribute('data-type').match(JotForm.payment)
                            && ["edit", "inlineEdit", "submissionToPDF"].indexOf(document.get.mode) > -1
                            && document.get.sid) {
                            return JotForm.corrected(input);
                        }

                        if (checkValues.any()) {
                            // override required validation if payment item is selected and total is zero
                            if (JotForm.payment && cont.getAttribute('data-type').match(JotForm.payment)){
                                if (JotForm.isPaymentSelected() && JotForm.paymentTotal == 0) {
                                    console.log("I corrected this.");
                                    return JotForm.corrected(input);
                                }
                            }
                            return JotForm.errored(input, JotForm.texts.required);
                        }
                    } catch (e) {
                        // This can throw errors on internet explorer
                        JotForm.error(e);
                        return JotForm.corrected(input);
                    }
                }
                if (input.__skipField) {
                    return JotForm.corrected(input);
                }
                if (input.tagName.toLowerCase() === 'textarea' && input.hasClassName('form-custom-hint') && !input.up('div').down('.nicEdit-main')) {
                    return JotForm.errored(input, JotForm.texts.required);
                }
                if (input.hasClassName("form-textarea") && input.up('div').down('.nicEdit-main')) { //rich text area
                    var val = input.up('div').down('.nicEdit-main').innerHTML.stripTags().replace(/\s/g, '').replace(/&nbsp;/g, '');
                    if (val.empty() || (input.readAttribute("data-customhint") && input.readAttribute("data-customhint") == input.up('div').down('.nicEdit-main').innerHTML)) {
                        return JotForm.errored(input, JotForm.texts.required);
                    }
                } else if(JotForm.getContainer(input).getAttribute('data-type') === "control_datetime") {
                    if(!input.value || input.value.strip(" ").empty()) {
                        return JotForm.errored(input, JotForm.texts.required);
                    }
                    if(input.id && input.id.indexOf("lite_mode_") > -1) { //litemode
                        var seperator = input.readAttribute('seperator');
                        var format = input.readAttribute('format').toLowerCase();
                        if(input.value.length !== ((seperator.length*2) + format.length)){
                            return JotForm.errored(input, JotForm.texts.dateInvalid.replace("{format}", format));
                        }
                    }
                    if(JotForm.getContainer(input).hasClassName("form-datetime-validation-error")) {
                        return JotForm.errored(input, 'Enter a valid date');
                    }
                } else if ((!input.value || input.value.strip(" ").empty() || input.value.replace('<br>', '').empty() || input.value == 'Please Select') && !(input.readAttribute('type') == "radio" || input.readAttribute('type') == "checkbox") && !$(input.parentNode).hasClassName('form-matrix-values')) {
                    return JotForm.errored(input, JotForm.texts.required);
                }

                vals = vals.without("required");

            } else if (input.value.empty()) {
                // if field is not required and there is no value
                // then skip other validations
                return true;
            }

            if (!vals[0]) {
                return true;
            }

            switch (vals[0]) {
                case "Email":
                    if (!reg.email.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.email);
                    }
                    break;
                case "Alphabetic":
                    if (!reg.alphabetic.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.alphabetic);
                    }
                    break;
                case "Numeric":
                    if (!reg.numeric.test(input.value) && !reg.numericDotStart.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.numeric);
                    }
                    break;
                case "AlphaNumeric":
                    if (!reg.alphanumeric.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.alphanumeric);
                    }
                    break;
                case "Cyrillic":
                    if (!reg.cyrillic.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.cyrillic);

                    }
                    break;
                case "Url":
                    if (!reg.url.test(input.value)) {
                        return JotForm.errored(input, JotForm.texts.url);
                    }
                    break;
                case "Currency":
                    if(input.up(".form-matrix-table")) {
                        if(input.up(".form-matrix-table").select("input").collect(function(inp) { return !reg.currency.test(inp.value) }).any()) {
                            return JotForm.errored(input, JotForm.texts.currency);
                        }
                    } else {
                        if (!reg.currency.test(input.value)) {
                            return JotForm.errored(input, JotForm.texts.currency);
                        }
                    }
                    break;
                case "Fill Mask":
                    if (input.readAttribute("masked") == "true" && !jQuery(input).inputmask("isComplete")) {
                        return JotForm.errored(input, JotForm.texts.fillMask);
                    }
                    break;

                default:
                // throw ("This validation is not valid (" + vals[0] + ")");
            }
            return JotForm.corrected(input);
        };
        var validatorEvent = function (e) {
            setTimeout(function () { // to let focus event to work
                if ($this.lastFocus && ($this.lastFocus == input || $this.getContainer($this.lastFocus) != $this.getContainer(input))) {
                    input.validateInput();
                } else if (input.type == "hidden" || input.type == 'file') {
                    input.validateInput(); // always run on hidden/upload elements
                }
            }, 10);
        };

        if (input.type == 'hidden' || input.type == 'file') {
            input.observe('change', validatorEvent);
        } else {
            input.observe('blur', validatorEvent);
        }
        if (input.type == 'checkbox' || input.type == 'radio') {
            input.observe('click', function () {
                input.validateInput();
            });

            if(input.next() && input.next().hasClassName("form-"+input.type+"-other-input")) {
                input.next().observe('keyup', function() {
                    input.validateInput();
                });
            }
        }

        if (input.hasClassName("form-textarea") && input.up('div').down('.nicEdit-main')) { //rich text area
            input.up('div').down('.nicEdit-main').observe('blur', validatorEvent);
        }

        if (input.up('.form-spinner')) {
            var spinnerEvent = function () {
                input.validateInput();
            };
            input.up('.form-spinner').down('.form-spinner-up').observe('click', spinnerEvent);
            input.up('.form-spinner').down('.form-spinner-down').observe('click', spinnerEvent);
        }
    },


    /**
     * Initiate facebook login operations
     * Check if user is already loggedin
     * watch login events to automatically populate fields
     * disable submits until login is completed
     */
    FBInit: function () {
        // Disable the Submit's here, form will not submit until integration is completed
        JotForm.FBNoSubmit = true;
        // Check if user is logged-in or not
        FB.getLoginStatus(function (response) {
            //Emre: facebook changed "response" properties (57298)
            if (response.authResponse) { // user is already logged in
                JotForm.FBCollectInformation(response.authResponse.userID);
            } else {    // user is not logged in. "JotForm.FBCollectInformation" is binded to facebook login event.
                FB.Event.subscribe('auth.login', function (response) {
                    JotForm.FBCollectInformation(response.authResponse.userID);
                });
            }
        });
    },
    /**
     * Request the logged-in users information from Facebook and populate hidden fields
     * Enable submit buttons and remove description
     */
    FBCollectInformation: function (id) {
        JotForm.FBNoSubmit = false; // Enable submit buttons

        // Seek through all hidden FB inputs on the form to collect Requested
        // User information fields. Merge all field data with fields ID so we can put the
        // Associated data into correct input.
        // f is for form field id in DOM, d is for facebook db column name.
        var fls = $$('.form-helper').collect(function (el) {
            var f = "";
            var d = el.readAttribute('data-info').replace("user_", ""); // Remove user_ prefix because it's not in the
            // Some permission names are different than FB users table
            // So we have to fix them
            switch (d) {
                case "can_be_anyvalue": // for demoing
                    f = "place correct one here";
                    break;
                case "sex":
                    f = "gender";
                    break;
                case "about_me":
                    f = "bio";
                    break;
                default:
                    f = d;
            }
            return [f, el.id];
        });
        // Convert fls array to key value pair for easier and faster matching
        var fields = {};
        var getPhoto = false;
        $A(fls).each(function (p) {
            if (p[0] == "pic_with_logo") {
                getPhoto = {
                    fieldID: p[1]
                };
            }
            if (p[0] !== "username") { // username is already deprecated
                fields[p[0]] = p[1];
            }
        });

        var params = $H(fields).keys().without("pic_with_logo"); // remove photo from params, we'll do a separate call for it

        var callback = function (input, user_id) {
            JotForm.bringOldFBSubmissionBack(id);
            var hidden = new Element('input', {type: 'hidden', name: 'fb_user_id'}).setValue(id);
            var form = JotForm.getForm(input);
            form.insert({top: hidden});
        };

        try {
            FB.api('/' + id, {fields: params}, function (res) {
                var input;
                $H(res).each(function (pair) {
                    if ($(fields[pair.key])) {
                        input = $(fields[pair.key]);
                        switch (pair.key) {
                            case "location":
                                input.value = pair.value.name;
                                break;
                            case "website":
                                input.value = pair.value.split(/\s+/).join(", ");
                                break;
                            default:
                                input.value = pair.value;
                        }
                    }
                });
                // get profile photo if requested
                if (getPhoto) {
                    FB.api('/' + id + '/picture', function (res) {
                        if (res.data.url && $(getPhoto.fieldID)) {
                            $(getPhoto.fieldID).value = res.data.url;
                        }
                        callback(input, id);
                    });
                } else {
                    callback(input, id);
                }
            });
        } catch (e) {
            console.error(e);
        }
        // Hide label description and display Submit buttons
        // Because user has completed the FB login operation and we have collected the info
        $$('.fb-login-buttons').invoke('show');
        $$('.fb-login-label').invoke('hide');
    },

    bringOldFBSubmissionBack: function (id) {

        var formIDField = $$('input[name="formID"]')[0];

        var a = new Ajax.Jsonp(JotForm.url + 'server.php', {
            parameters: {
                action: 'bringOldFBSubmissionBack',
                formID: formIDField.value,
                fbid: id
            },
            evalJSON: 'force',
            onComplete: function (t) {
                var res = t.responseJSON;
                if (res.success) {
                    JotForm.editMode(res, true, ['control_helper', 'control_fileupload']); // Don't reset fields
                }
            }
        });
    },

    setCustomHint: function (elem, value) {
        var element = $(elem) || null,
            new_value = value.replace(/<br>/gim, "\n") || "";//replace any br to \n

        //add a class to the control to denote that is using a custom hint
        //as well as write the custom hint into the data-hint attrib
        element.addClassName('custom-hint-group').writeAttribute('data-customhint', value).writeAttribute('customhinted', "true");

        //set that the control has no content
        //check if it has a content, especially default data
        element.hasContent = ( element.value && element.value.replace(/\n/gim, "<br>") != value ) ? true : false;

        //function to show the custom placeholder
        element.showCustomPlaceHolder = function () {
            if (!this.hasContent) {
                this.value = new_value;
                //exclude spellcheck onto the control
                this.writeAttribute("spellcheck", "false").addClassName('form-custom-hint');
            }
        };

        //function to hide the custom placeholder
        element.hideCustomPlaceHolder = function () {
            if (!this.hasContent) {
                this.value = "";
                //exclude spellcheck onto the control
                this.removeClassName('form-custom-hint').removeAttribute('spellcheck');
            }
        };

        //add events to the control
        element.observe('focus', function (e) {
            this.hideCustomPlaceHolder();
        }).observe('blur', function (e) {
            this.showCustomPlaceHolder();
        }).observe('keyup', function (e) {
            //this will determine if the control has a value
            this.hasContent = ( this.value.length > 0 && this.value !== new_value) ? true : false;
        }).observe('paste', function (e) {
            $this = this;
            setTimeout(function () {
                $this.hasContent = ( $this.value.length > 0 && $this.value !== new_value) ? true : false;
            }, 2);
        });

        // special case for rich text
        if (element && element.type === "textarea" && element.hasAttribute('data-richtext')) {
            setTimeout(function () {
                var editor = $$('#id_' + element.id.replace('input_', '') + ' .nicEdit-main')[0] || null;
                var editorInstance = nicEditors.findEditor(element.id);
                if (editor) {
                    // set place holder color
                    if (!element.hasContent) {
                        editor.setStyle({'color': '#babbc0'});
                    }
                    editor.observe('blur', function () {
                        if (!editorInstance.getContent()) {
                            editor.setStyle({'color': '#babbc0'});
                            editorInstance.setContent(new_value);
                        }
                    });
                    editor.observe('focus', function () {
                        editor.setStyle({'color': ''});
                        if (editorInstance.getContent() === new_value) {
                            editorInstance.setContent('');
                        }
                        ;
                    });
                }
            }, 1000);
        }

        //catch the submission of a form, and remove all custom placeholder
        //since we are using the said trick, this needs to be done
        element.up('form.jotform-form').observe('submit', function () {
            this.select('.custom-hint-group').each(function (elem) {
                elem.hideCustomPlaceHolder();
            });
        });

        //initiate the custom placeholders
        element.showCustomPlaceHolder();

    },

    /*
     ** Return true if field has any kind of content - user inputted or otherwise and does not have error
     */
    fieldHasContent: function (id) {

        if ($('id_' + id).hasClassName('form-line-error')) return false;
        if ($('id_' + id).select('.form-custom-hint').length > 0) return false;

        var type = JotForm.getInputType(id);
        switch (type) {
            case "address":
            case "combined":
                return $$('#id_' + id + ' input').collect(function (e) {
                    return e.value;
                }).any();
            case "number":
                return $$('#id_' + id + ' input').collect(function (e) {
                    return e.value.length > 0;
                }).any();
            case "birthdate":
                return JotForm.getBirthDate(id);
            case "datetime":
                var date = JotForm.getDateValue(id);
                return !(date == "T00:00" || date == '');
            case "time":
                return JotForm.get24HourTime(id);
            case "checkbox":
            case "radio":
                return $$('#id_' + id + ' input').collect(function (e) {
                    return e.checked;
                }).any();
            case "select":
                return $$('#id_' + id + ' select').collect(function (e) {
                    return e.value;
                }).any();
            case "grading":
                return $$('input[id^=input_' + id + '_]').collect(function (e) {
                    return e.value;
                }).any();
            case "signature":
                return jQuery("#id_" + id).find(".pad").jSignature('getData', 'base30')[1].length > 0;
            case "slider":
                return $('input_' + id).value > 0;
            case "file":
                if ($$('#id_' + id + ' input')[0].readAttribute('multiple') === 'multiple') {
                    return $('id_' + id).select('.qq-upload-list li').length > 0;
                } else {
                    return $('input_' + id).value;
                }
                break;
            default:
                if ($('input_' + id) && $('input_' + id).value) {
                    return $('input_' + id).value;
                } else {
                    return false;
                }

        }
    },

    /*
     ** Show progress bar on screen and set up listeners
     */
    setupProgressBar: function () {
        JotForm.progressBar = new ProgressBar("progressBar", {'height': '20px', 'width': '95%'});
        var countFields = ['select', 'radio', 'checkbox', 'file', 'combined', 'email', 'address', 'combined', 'datetime', 'time',
            'birthdate', 'number', 'radio', 'number', 'radio', 'autocomplete', 'radio', 'text', 'textarea', 'signature', 'div', 'slider'];
        var totalFields = 0;
        var completedFields = 0;

        var updateProgress = function () {
            completedFields = 0;
            $$('.form-line').each(function (el) {
                var id = el.id.split("_")[1];
                var type = JotForm.getInputType(id);
                if ($A(countFields).include(type)) {
                    if (JotForm.fieldHasContent(id)) {
                        completedFields++;
                    }
                }
            });

            var percentage = parseInt(100 / totalFields * completedFields);
            if (isNaN(percentage)) percentage = 0;
            JotForm.progressBar.setPercent(percentage);
            $('progressPercentage').update(percentage + '% ');
            $('progressCompleted').update(completedFields);
            if (percentage == 100) {
                $('progressSubmissionReminder').show();
            } else {
                $('progressSubmissionReminder').hide();
            }
        };

        var setListener = function (el, ev) {
            $(el).observe(ev, function () {
                updateProgress();
            });
        };

        $$('.form-line').each(function (el) {
            var id = el.id.split("_")[1];
            var type = JotForm.getInputType(id);
            if (!countFields.include(type)) {
                return;
            }

            totalFields++;
            switch (type) {
                case 'radio':
                case 'checkbox':
                    setListener($('id_' + id), 'click');
                    break;

                case 'select':
                case 'file':
                    setListener($('id_' + id), 'change');
                    break;

                case 'datetime':
                    setListener($('id_' + id), 'date:changed');
                    $$("#id_" + id + ' select').each(function (el) {
                        setListener($(el), 'change');
                    });
                    break;

                case 'time':
                case 'birthdate':
                    $$("#id_" + id + ' select').each(function (el) {
                        setListener($(el), 'change');
                    });
                    break;

                case 'address':
                    setListener($('id_' + id), 'keyup');
                    break;

                case 'number':
                    setListener($('id_' + id), 'keyup');
                    setListener($('id_' + id), 'click');
                    break;

                case 'signature':
                    setListener($('id_' + id), 'click');
                    break;

                default:
                    setListener($('id_' + id), 'keyup');
                    break;
            }
        });
        $('progressTotal').update(totalFields);

        updateProgress();
    },

    setupRichArea: function(qid) {
        if(!(!Prototype.Browser.IE9 && !Prototype.Browser.IE10 && Prototype.Browser.IE)) {
            if(!JotForm.isVisible(qid)) {
                $('id_'+qid).up('.form-section') && $('id_'+qid).up('.form-section').show();
                JotForm.showField(qid);
            }
            new nicEditor({iconsPath : location.protocol + '//www.jotform.com/images/nicEditorIcons.gif?v2'}).panelInstance('input_'+qid);
            JotForm.updateAreaFromRich(qid);
        }
    },

    updateAreaFromRich: function (id) {
        try {
            var rich = $('id_' + id).down('.nicEdit-main');
            var txtarea = $('id_' + id).down('textarea');
            if (rich && txtarea) {
                rich.observe('keyup', function () {
                    txtarea.value = rich.innerHTML;
                    if (txtarea.triggerEvent) txtarea.triggerEvent('keyup');
                });
            }
        } catch (e) {
            console.error(e);
        }
    },


    /**
     * Responsible on handling AutoFill feature,
     * this will also help to ensure that it will not conflict
     * on customHint trick if any
     */
    autoFillInitialize: function (params) {
        //if edit mode do not init
        if (this.isEditMode()) {
            return;
        }

        //initialize autoFill plugin for jquery
        var formID = $$('input[name="formID"]')[0].value;
        params.name = 'form_' + formID;
        var _form = 'form#' + formID;
        var form = $$(_form)[0];

        //write an attribute to the form denoting that it uses a autoFill
        form.writeAttribute('data-autofill', 'true');

        /**
         * Will handle conflicts of the autoFill
         * especially custom hints, grading total computation
         */
        var _conflicts = {
            _handleCustomHint: function (data) {
                //get the data that was generated in the autoFill plugin
                var pfields = data.protectedfields;
                var pfieldsdata = data.protectedfieldsdata;
                var inc = 0;

                //loop through the stored data
                $H(pfieldsdata).each(function (_fielddata) {

                    var _field = pfields[inc];
                    var field = $(_field);
                    var fieldata = _fielddata[1];

                    //get the value on where the data is restored
                    var value = ( fieldata.newinputvalue ) ? fieldata.newinputvalue.replace(/\n/gim, "<br>") : false;

                    if (field.hasAttribute('data-customhint') || field.hasAttribute('customhinted')) {
                        //get the value of the element
                        var hint = field.readAttribute('data-customhint');

                        // alert('customhinted:' + hint " | " + value);
                        if (hint && value && hint != value) {
                            field.removeClassName('form-custom-hint');
                            field.hasContent = true;
                        }
                    }
                    else if (field.hasAttribute('hinted') || field.hinted) //this is for IE relateds
                    {
                        //get the old input value and compare it to the newvalue of the input
                        //if not match turn the color of the hint to black
                        //seems to be a bug when using the .hint() function in IE
                        var hint = ( fieldata.oldinputvalue ) ? fieldata.oldinputvalue.replace(/\n/gim, "<br>") : false;

                        // alert('hinted:' + hint " | " + value);
                        if (hint && value && hint != value) {
                            field.setStyle({color: "#000"});
                        }
                    }

                    inc++;
                });
            },
            /**
             * Will handle the total of grading inputs if set
             */
            _handleGradingTotal: function (data) {
                if ($$('.form-grading-input').length > 0 && $("grade_total_" + id)) {
                    var total = 0, id = null;
                    $$('.form-grading-input').each(function (input) {
                        id = input.id.replace(/input_(\d+)_\d+/, "$1"),
                            total += parseFloat(input.value) || 0;
                    });

                    $("grade_point_" + id).innerHTML = total;
                }
            },
            /*
             * Move text from textfield to rich text div
             */
            _handleRichText: function (data) {
                $$('.nicEdit-main').each(function (richArea) {
                    var txtarea = richArea.up('.form-line').down('textarea');
                    if (txtarea) {
                        richArea.innerHTML = txtarea.value;
                    }
                });
            },
            _handleStarRating: function (data) {
                $$(".form-star-rating").each(function (rating) {
                    rating.setRating(rating.down("input").value);
                });
            },
            _handlePaymentTotal: function() {
                if ($('payment_total')) {
                    JotForm.totalCounter(JotForm.prices);
                }
            }
        };

        //initiate jquery autoFill
        jQuery(_form).autoFill({
            timeout: ( Number(params.timeout) > 0 ) ? params.timeout : 4,
            excludeFields: ["formID", "simple_spc", "temp_upload_folder"],
            ttl: params.ttl,
            allowBindOnChange: (params.bindChange && params.bindChange == 'on') ? true : false,
            onBeforeSave: function () {
            },
            onSave: function () {
            },
            onRelease: function () {
            },
            onBeforeRestore: function () {
            },
            onRestore: function (data) {
                //check for custom hints
                var restoredDatas = this.restoredData[0];
                // console.log( restoredDatas );
                if (restoredDatas) {
                    //resolve conflicts in customHint if any
                    _conflicts._handleCustomHint(restoredDatas);

                    //resolve grading total computation if any
                    _conflicts._handleGradingTotal(restoredDatas);

                    _conflicts._handleRichText(restoredDatas);

                    _conflicts._handleStarRating(restoredDatas);

                    _conflicts._handlePaymentTotal(restoredDatas);
                }
            }
        });

        this.runAllConditions();

        this.autoFillDeployed = true;

    },

    runAllConditions: function () {
        $H(JotForm.fieldConditions).each(function (pair) {
            var field = pair.key;
            var event = pair.value.event;
            if (!$(field)) {
                return;
            }
            if (["autofill", "number", "autocomplete"].include(event)) event = "keyup";
            $(field).run(event);
        });
        if (JotForm.isEditMode()) {
            JotForm.ignoreInsertionCondition = null;
        }
    },

    /**
     * Set masking for an specific question question
     * supports input type='text' only
     */
    setQuestionMasking: function (toSelector, type, maskValue, unmask) {

        if(!maskValue) return;

        maskValue = maskValue.replace(/&#39;/g, "'");
        var unmask = ( unmask ) ? unmask : false
            , extendedMask = {};

        //extend the definitions to accept other characters
        extendedMask['#'] = {
            validator: "[0-9]",
            cardinality: 1
        };

        //include more mask options for specific questions
        if (type === "textMasking") {
            extendedMask['@'] = {
                validator: "[A-Za-z\u0410-\u044F\u0401\u0451\u4E00-\u9FFF]",
                cardinality: 1
            };
        }

        jQuery.extend(jQuery.inputmask.defaults.definitions, extendedMask);

        //initiate masking for phones.
        if (unmask) {
            jQuery(toSelector).inputmask('remove');
        }
        else {
            jQuery(toSelector).inputmask(maskValue, {"placeholder": "_"});
            jQuery(toSelector).attr('maskValue', maskValue);
        }
    },

    /**
     * Helper that will handle input masking
     * this depends on the users masking format
     */
    setInputTextMasking: function (elem, maskValue, unmask) {
        setTimeout(function () { //wait for prepopulations to be run before setting the mask
            JotForm.setQuestionMasking("#" + elem, 'textMasking', maskValue, unmask);
        }, 10);
    },

    /**
     * Will handle the Phone Validation
     * this depends on the users masking format
     */
    setPhoneMaskingValidator: function (elem, maskValue, unmask) {
        setTimeout(function () { //wait for prepopulations to be run before setting the mask
            JotForm.setQuestionMasking("#" + elem, 'phoneMasking', maskValue, unmask);
        }, 10);
    },

    /**
     * will load external script file
     * currently it is used to import editMode function
     */
    loadScript: function () {

        var toLoad = arguments.length;
        var callback;
        var hasCallback = arguments[toLoad - 1] instanceof Function;
        var script;

        function onloaded() {
            toLoad--;
            if (!toLoad) {
                callback();
            }
        }

        if (hasCallback) {
            toLoad--;
            callback = arguments[arguments.length - 1];
        } else {
            callback = function () {
            }; // noop
        }
        for (var i = 0; i < toLoad; i++) {
            script = document.createElement('script');
            script.src = arguments[i];
            //script.onload = script.onerror = onloaded; //hidden field (uploadedBefore) loading twice #417671

            if (typeof(script.addEventListener) != 'undefined') {
                script.addEventListener('load', callback, false);
            } else {
                //for IE8
                var handleScriptStateChangeIE8 = function () {
                    if (script.readyState == 'loaded') {
                        callback();
                    }
                }
                script.attachEvent('onreadystatechange', handleScriptStateChangeIE8);
            }

            (
                document.head ||
                document.getElementsByTagName('head')[0]
            ).appendChild(script);
        }
    },
    /**
     * will load external stylesheet file
     */
    loadStyleSheet: function (url, onLoad) {
        var link = document.createElement('link');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', url);
        (document.head || document.getElementsByTagName('head')[0]).appendChild(link);

        if (link.readyState) { //IE
            link.onreadystatechange = function() {
                if (link.readyState == "loaded" || link.readyState == "complete") {
                    link.onreadystatechange = null;
                    onLoad && onLoad();
                }
            };
        } else {
            //if safari and not chrome, fire onload instantly - chrome has a safari string on userAgent
            //this is a bug fix on safari browsers, having a problem on onload of an element
            if (navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i)) {
                onLoad && onLoad();
            } else {
                link.onload = function() {
                    onLoad && onLoad();
                };
            }
        }
    },
    /**
     * Checks if a certain stylesheet
     * already loaded
     */
    isStyleSheetLoaded: function(stlesheetName) {
        var found = false;
        var styleSheets = document.styleSheets;
        for (var s in styleSheets) {
            var styleSheet = styleSheets[s];
            if (styleSheet.href && !!~styleSheet.href.indexOf(stlesheetName)) {
                found = true;
                break;
            }
        }
        return found;
    },

    track: function (w, d) {
        var self = this;

        if($$('#event_tracking_image').length > 0) {
            return;
        }
        // var JotFormTrackerObject = window['JotFormTrackerObject'];
        // var _buildSourceOptions = JotFormTrackerObject['options'];
        var _form = $$('.jotform-form')[0];
        var _formID = _form.getAttribute('id');
        var _referer;
        var _location;

        try {
            _referer = encodeURIComponent(document.referrer);
        } catch (e) {
            _referer = 'undefined'
        }

        try {
            _location = encodeURIComponent(window.top.location.href);
        } catch (e) {
            _location = 'undefined'
        }

        var _screenHeight = window.screen.height;
        var _screenWidth = window.screen.width;

        if (!_formID) {
            return false;
        }
        if (_form) {
            var uuid = generateUUID();
            insertAfter(createImageEl(uuid), _form);
            createEventID(uuid);
        }
        function insertAfter(newNode, referenceNode) {
            referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
        }

        function createImageEl(uuid) {
            var base = '//events.jotform.com/';
            if (self.jsForm) {
                base = base + 'jsform/';
            } else {
                base = base + 'form/';
            }
            var src = base + _formID + '/';
            var resolutionStr;
            if (_screenHeight && _screenWidth) {
                resolutionStr = _screenWidth + 'x' + _screenHeight;
            }
            src = src + '?ref=' + encodeURIComponent(_referer);
            if (resolutionStr) {
                src = src + '&res=' + encodeURIComponent(resolutionStr);
            }
            if (uuid) {
                src = src + '&eventID=' + encodeURIComponent(uuid);
            }

            src = src + '&loc=' + encodeURIComponent(_location);

            var img = new Image();
            img.id = "event_tracking_image";
            img.src = src;
            img.style.display = 'none';
            return img;
        }

        function createEventID(uuid) {
            var inputEl = document.createElement('input');
            inputEl.setAttribute('type', 'hidden');
            inputEl.setAttribute('name', 'event_id');
            inputEl.value = uuid;
            _form.appendChild(inputEl);
        }

        function generateUUID() {
            return 1 * new Date() + '_' + _formID + '_' + randomString(7);
        }

        function randomString(len) {
            charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var randomString = '';
            for (var i = 0; i < len; i++) {
                var randomPoz = Math.floor(Math.random() * charSet.length);
                randomString += charSet.substring(randomPoz, randomPoz + 1);
            }
            return randomString;
        }
    },
    /**
     * Let us do some actions or process when a form
     * embedded via a 3rd party applications
     */
    additionalActionsFormEmbedded: function() {
        var self = this;
        var integration = getQuerystring('embeddedvia');
        if (integration) {
            if (integration === 'weebly') {
                // make all forms responsive for weebly integration
                if (!self.isStyleSheetLoaded('mobile.responsive.min.css')) {
                    var styleSheetUrl = 'https://widgets.jotform.io/mobileResponsive/mobile.responsive.min.css';
                    self.loadStyleSheet(styleSheetUrl, function() {
                        self.handleIFrameHeight();
                    });
                }
            }
        }
    },
    changeSubmitURL: function(submitURL) {
      if (submitURL.length > 0) {
        for (var i = this.forms.length - 1; i >= 0; i--) {
          var form = this.forms[i];
          form.action = form.action.replace(/\/\/submit\..*?\//, '//' + submitURL + '/');
        };
      }
    },
    handleChinaCensorship: function() {
      this.getClientCountry(function(location) {
        var country = location.country;
        if ((country.length > 0 && country.toLowerCase() === 'cn')) {
          this.changeSubmitURL('china.jotfor.ms');
        }
      }.bind(this));
    },
    handlePreview: function(filled) {
        $A(JotForm.forms).each(function (form) {
            var previewInput = document.createElement('input');
            previewInput.setAttribute('type', 'hidden');
            previewInput.setAttribute('name', 'preview');
            previewInput.value = 'true';
            form.appendChild(previewInput);

            if (filled === true) {
                var script = document.createElement('script');
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', '//cdn.jotfor.ms/js/form-tester.js?rev=' + new Date().getTime());
                form.appendChild(script);
            }
        });
    },
    getClientCountry: function(callback) {
      new Ajax.Request('//china.jotfor.ms/opt/geo.ip.php', {
        evalJSON: 'force',
        onComplete: function(res) {
          if (res.status === 200) {
            callback(res.responseJSON);
          } else {
            callback({ country: '' });
          }
        }
      });
    }
};
function getQuerystring(key, default_) {
    if (default_ == null) default_ = "";
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    var qs = regex.exec(window.location.href);
    if (qs == null)
        return default_;
    else
        return qs[1];
}
// We have to put this event because it's the only way to catch FB load
window.fbAsyncInit = JotForm.FBInit.bind(JotForm);
