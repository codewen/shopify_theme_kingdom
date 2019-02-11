/* ALL THE SCRIPTS IN THIS FILE ARE MADE BY KROWNTHEMES.COM --- REDISTRIBUTION IS NOT ALLOWED! */

(function ($) {

	// We start with the newsletter code (it needs to be wrapped inside a $(window).load() event function in order to get the perfect timeout after the site has completely loaded
	
	$(document).ready( function() {
		$(function() {
		  $("#date").datepicker( {
			minDate: +1,
			maxDate: '+2M'
		  } );
		});

		$("[name='checkout']").click(function() {
			if ($('#date').val() == "" || $('#date').val() === undefined)
			{
			  alert("You must pick a delivery date");
			  return false;
			} else {
			  //$(this).submit();
			  return true;
			}
		  });
		  
	  });


	if ($('#newsletter-box').data('newsletter_check')) {

		function _newsletterTrigger(show, freq) {

			var popupKey = 'popup-' + document.location.hostname,
				popupStorage = localStorage.getItem(popupKey) != null ? JSON.parse(localStorage.getItem(popupKey)) : null;

			if (popupStorage != null) {

				if (popupStorage['show'] != show || popupStorage['freq'] != freq) {

					_newsletterRefreshStorage(popupKey, show, freq);

					// user saw the ad but settings are different - show it!
					_newsletterShow();

				} else {

					// user saw the ad so we need to check if he should see it again

					if (freq == 'every') {

						if (sessionStorage[popupKey] == null || sessionStorage[popupKey] != 'shown') {
							_newsletterShow();
							_newsletterRefreshStorage(popupKey, show, freq);
						}

					} else {

						var shownAt = popupStorage['shown'],
							nowAt = new Date().getTime(),
							inBetween = Math.round((nowAt - shownAt) / 1000);

						if (freq == 'day' && inBetween > 129600) {
							_newsletterShow();
							_newsletterRefreshStorage(popupKey, show, freq);
						} else if (freq == 'week' && inBetween > 907200) {
							_newsletterShow();
							_newsletterRefreshStorage(popupKey, show, freq);
						}

					}

				}

			} else {

				_newsletterRefreshStorage(popupKey, show, freq);

				// user never saw the ad - show it!

				_newsletterShow();

			}

		}

		function _newsletterRefreshStorage(popupKey, show, freq) {

			localStorage.setItem(popupKey, JSON.stringify({
				'show': show,
				'freq': freq,
				'shown': new Date().getTime()
			}));

			sessionStorage[popupKey] = 'shown';

		}

		function _newsletterShow() {
			$('#newsletter-button').trigger('click');
		}

		$(window).load(function () {

			var $newsletterForm = $('#newsletter-box #contact_form'),
				$newsletterButton = $('#newsletter-button'),
				$newsletterText = $('#newsletter-text'),
				$newsletterBox = $('#newsletter-box');

			var oldNewsText = $newsletterText.html();

			var show = $newsletterBox.data('show'),
				freq = $newsletterBox.data('freq'),
				enable = $newsletterBox.data('enable');

			if (show > 0 && enable) {
				setTimeout(function () {
					_newsletterTrigger(show, freq)
				}, parseInt(show * 1000));
			}

			$newsletterForm.submit(function (e) {

				$newsletterForm.fadeOut(200);

				if (!$newsletterForm.hasClass('kill-ajax')) {

					$.ajax({
						type: $newsletterForm.prop('method'),
						url: $newsletterForm.prop('action'),
						data: $newsletterForm.serialize(),
						cache: false,
						error: function (data, text) {
							$newsletterForm.addClass('kill-ajax');
							$newsletterForm.submit();
							/*$newsletterText
								.html('').css('opacity', 0)
								.html('Server error. Please try again!')
								.animate({'opacity': 1}, 200);*/
						},
						success: function (data, text, jqhxr) {

							$newsletterText.html('').css('opacity', 0);

							if ($(data).find('#newsletter-box #contact_form .errors').length > 0) {
								$newsletterText.html($(data).find('#newsletter-box #contact_form .errors').html());
							} else {
								$newsletterText.html($('#newsletter-box').data('newsletter_confirm'));
							}

							$newsletterText.animate({ 'opacity': 1 }, 200);

						}
					})

					e.preventDefault();

				}

			});

			$newsletterButton.on('click', function () {
				$newsletterForm.fadeIn(0);
				$newsletterText.html(oldNewsText);
				$newsletterForm.find('#Email').val('');
			});

		});

	}

	// Continue with everything else from here

	// - global variables

	var $html = $('html'),
		$body = $('body'),
		$sidebar = $('#sidebar'),
		$logo = $('#logo'),
		$meta = $('#meta'),
		$menu = $('#menu'),
		$responsiveMenu = $meta.find('.responsive-menu'),
		$responsiveClose = $('.responsive-close'),
		$options = $('#options'),
		$footer = $('#footer'),
		$content = $('#content'),

		touchM = "ontouchstart" in window,
		iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

	if (touchM) {
		$body.removeClass('no-touch')
			.addClass('touch');
	}

	$footer.removeClass('loading');

	var $overlay = $('#main-overlay');

	var $responsiveMenu = $meta.find('.responsive-menu');
	var $responsiveClose = $('.responsive-close');

	var frontSwiper = null;

	// SECTIONS

	window.KINGDOM = {

		// SIDEBAR

		Sidebar: {

			mount: function () {

				$menu = $('#menu');

				// Menu design tweak

				if ($('#menu').children('.top-menu').length == 2) {
					$('#menu').children('.top-menu').eq(0).addClass('collections');
				}

				// Main menus dropdowns

				var $openedMenu = null;

				$('#menu').find('a').click(function (e) {

					var $this = $(this).parent();

					if ($this.hasClass('submenu')) {

						var $menu = $this,
							$submenu = $this.children('ul');

						if ($menu.hasClass('opened')) {

							$menu.removeClass('opened');
							$submenu.stop().slideUp({
								duration: 150,
								easing: 'easeOutQuad',
								progress: function () {
									$(window).trigger('resize');
								},
								complete: function () {
									setTimeout(function () {
										$(window).trigger('resize');
									}, 100);
								}
							});

							$submenu.attr('aria-expanded', 'false');

						} else {

							$menu.addClass('opened');
							$openedMenu = $submenu;
							$submenu.stop().slideDown({
								duration: 200,
								easing: 'easeInQuad',
								progress: function () {
									$(window).trigger('resize');
								},
								complete: function () {
									$(this).css('overflow', 'visible');
									setTimeout(function () {
										$(window).trigger('resize');
									}, 100);
								}
							});

							$submenu.attr('aria-expanded', 'true');

						}

						e.preventDefault();

					}

				});

				// Responsive menu (open)

				$responsiveMenu = $('#meta').find('.responsive-menu');
				$responsiveClose = $('.responsive-close');

				$responsiveMenu.children('a').on('click', function (e) {

					if (!$responsiveMenu.hasClass('opened')) {
						$responsiveMenu.addClass('opened');
						killFlow('in');
						$menu.css('visibility', 'visible').stop().animate({
							'opacity': 1
						}, 200, function () {
							$responsiveClose.show();
						})
					}

					e.preventDefault();

				});

				// Responsive menu (close)

				$responsiveClose.on('click', function (e) {

					if ($responsiveMenu.hasClass('opened')) {

						$responsiveMenu.removeClass('opened');
						killFlow('out');
						$menu.stop().animate({
							'opacity': 0
						}, 200, function () {
							$(this).css('visibility', 'hidden');
						});
						$responsiveClose.hide();

					}

					e.preventDefault();

				});

				// Scrolling handlers

				$(window).on('scroll.scrollFix resize.scrollFix', function () {

					if ($sizeMobile.css('display') != 'block') {
						scrollElement($('#sidebar'));
						scrollElement($('#content'));
					}

					if ($sizeMobile.css('display') == 'block' && $logo.height() + 40 <= $(window).scrollTop()) {
						$body.addClass('meta-fixed');
					} else {
						$body.removeClass('meta-fixed');
					}

				});

				$(window).on('resize.scrollReFix', function () {
					$sidebar.css('height', 'auto');
					var tempH = $sidebar.outerHeight();
					if (tempH > $(window).height()) {
						$sidebar.css('height', tempH);
					} else {
						$sidebar.css('height', '100%');
					}
				});

				setTimeout(function () {
					$(window).trigger('resize.scrollFix');
					$(window).trigger('resize.scrollReFix');
				}, 100);

				setTimeout(function () {
					$(window).trigger('resize.scrollFix');
					$(window).trigger('resize.scrollReFix');
				}, 1000);

				$('#footer').children().each(function () {
					if (!$.trim($(this).html())) {
						$(this).remove();
					}
				});

			},

			unmount: function () {

				$('#menu').find('a').off('click');
				$(window).off('scroll.scrollFix resize.scrollFix');
				$(window).off('resize.scrollReFix');
				$responsiveMenu.children('a').on('click');
				$responsiveClose.on('click');

			}

		},

		// OVERLAYS

		Overlays: {

			mount: function () {

				$('.overlay-button').each(function () {
					$(this).on('click', function (e) {
						openOverlay($($(this).data('overlay')));
						if ($(this).data('overlay') == '#search-overlay') {
							$('#search-overlay input[type="search"]').focus();
						}
						e.preventDefault();
					});
				});

				$overlay.find('.close.main').on('click', function (e) {
					closeModal();
					e.preventDefault();
				});

				$overlay.children('div').on('click', function (e) {
					closeModal();
				});

				$overlay.find('.simple-overlay-box, #newsletter-box').on('click', function (e) {
					e.stopImmediatePropagation();
				});

				$('#share-overlay').find('a:not(.close)').on('click', function (e) {

					var url = $(this).attr('href'),
						sharePop = window.open(url, $.themeWords.products_page_share_text, 'height=400,width=700');

					if (window.focus) {
						sharePop.focus();
					}

					e.preventDefault();

				});

			},

			unmount: function () {

				$('.overlay-button').each(function () {
					$(this).off('click');
				});
				$overlay.find('.close.main').off('click');
				$overlay.children('div').off('click');
				$('#share-overlay').find('a:not(.close)').off('click');

			}

		},

		// FRONT SLIDER

		HomeSlider: {

			mount: function () {

				initFrontSwiper();

				function initFrontSwiper() {

					var $slider = $('#home-slider'),
						$slides = $slider.find('.slide'),
						$sliderNav = $slider.find('.draw-buttons'),
						$sliderCount = $sliderNav.find('.cur'),

						$homeContent = $('.home-content'),

						firstImg = $slider.find('img')[0],
						$firstSlide = $slides.eq(0);

					if ($slides.length == 1) {
						$slider.addClass('disabled');
					}

					var firstSlider = true;

					frontSwiper = new Swiper('#home-slider', {

						effect: $slider.data('transition') == "fade" ? 'fade' : 'slide',
						mode: 'horizontal',
						loop: $slides.length == 1 ? false : true,
						calculateHeight: false,
						grabCursor: true,
						useCSS3Transforms: true,
						resizeReInit: true,
						updateOnImagesReady: false,
						pagination: '.swiper-pagination',
						paginationClickable: true,
						autoplay: $slider.data('autoplay') && $slides.length > 1 ? parseInt($slider.data('timer')) * 1000 : null,
						autoplayDisableOnInteraction: true,
						speed: 300,
						resistance: false,
						keyboardControl: true,

						onInit: function (swiper) {

							$slider.find('.btn-next').on('click', function (e) {
								swiper.slideNext();
								e.preventDefault();
							});
							$slider.find('.btn-prev').on('click', function (e) {
								swiper.slidePrev();
								e.preventDefault();
							});

							// Search for images and load "load" the first one - when it's ready, continue with the initialization

							if ($firstSlide.find('video').length > 0) {

								// we have video

								window.supports_video_autoplay(function (ok) {

									if (ok && !window.detectFirefoxAndroid()) {

										var video = $firstSlide.find('.video-obj')[0];

										if (video.readyState >= video.HAVE_FUTURE_DATA) {
											$slider.find('.video-obj:not(.active)').addClass('active');
											video.play();
											initSwiperFront(swiper);
										} else {
											video.addEventListener('canplay', function () {
												$slider.find('.video-obj:not(.active)').addClass('active');
												this.play();
												initSwiperFront(swiper);
											});
										}

									} else {

										$firstSlide.find('video').css('display', 'none');

										// we still have image

										if (firstImg.complete || firstImg.naturalWidth > 0) {
											initSwiperFront(swiper);
										} else {

											$(firstImg).attr('src', $(firstImg).attr('src'));

											$(firstImg).on('load', function () {
												initSwiperFront(swiper);
											});

										}

									}

								});

							} else {

								// we have image

								if (firstImg != undefined) {

									if (firstImg.complete || firstImg.naturalWidth > 0) {
										initSwiperFront(swiper);
									} else {
										$(firstImg).on('load', function () {
											initSwiperFront(swiper);
										});
									}

								}

							}

							// Trigger a resize after each image load

							$slider.find('img').on('load', function () {
								$(window).trigger('resize');
							});

						},

						// The two functions below are for the customization of the grabbing mouse cursor

						onTouchStart: function (swiper) {
							$(swiper.container).addClass('grabbing');
						},
						onTouchEnd: function (swiper) {
							$(swiper.container).removeClass('grabbing');
						},

						// Do stuff when slides change

						onSlideChangeStart: function (swiper) {
							$sliderCount.text(calculateSwiperIndex(swiper.activeIndex, swiper.slides.length));
							$(swiper.slides[swiper.activeIndex]).find('.label').css({ 'opacity': 0, 'top': 60 });

						},
						onSlideChangeEnd: function (swiper) {

							if (!firstSlider) {
								animateLabels(swiper, 0);
							}

							$(window).trigger('resize');
							setTimeout(function () {
								$(window).trigger('resize');
							}, 200);

						}

					});

					// Setup slider resizing

					$(window).on('resize.swiperFront', function () {
						if ($sizeMobilest.css('display') == 'block') {
							$slider.height($slider.find('.swiper-slide-active img').height() + $slider.find('.swiper-slide-active .slide-caption').outerHeight());
							if (frontSwiper != null && typeof frontSwiper.onResize == 'function') {
								frontSwiper.onResize();
							}
						} else if ($sizeMobile.css('display') == 'block') {
							$slider.height($slider.find('.swiper-slide-active img').height());
							if (frontSwiper != null && typeof frontSwiper.onResize == 'function') {
								frontSwiper.onResize();
							}
						} else {
							$slider.height($(window).height());
						}
					});

					function initSwiperFront(swiper) {

						var dl = 100;
						if ($body.hasClass('template-index')) {
							var dl = 500;
						}

						$(swiper.slides).find('.slide-img').delay(dl).animate({ 'opacity': 1 }, 300);

						$(window).trigger('resize');
						swiper.onResize();

						setTimeout(function () {
							$(window).trigger('resize');
							swiper.onResize();
							$('#home-slider').addClass('loaded');
						}, 500);

						if ($homeContent != null) {
							setTimeout(function () {
								$homeContent.show();
								window.KINGDOM.Blog.mount();
								$(window).trigger('resize');
							}, 500);
						}

						if ($slides.length > 1) {
							$sliderNav.find('.tot').text($slides.length);
							$sliderNav.delay(1500).fadeIn(200);
						}

						var videoGo = false;
						$(swiper.slides).find('.button').each(function () {
							if ($(this).attr('href').indexOf('vimeo') > 0 || $(this).attr('href').indexOf('youtube') > 0 || $(this).attr('href').indexOf('youtu.be') > 0) {
								videoGo = true;
								if ($(this).attr('href').indexOf('vimeo')) {
									$(this).addClass('popup-vimeo');
								} else {
									$(this).addClass('popup-youtube');
								}
							}
						})

						if (videoGo) {
							$.getScript($.themeAssets.mgnpop, function () {
								$('.popup-vimeo').magnificPopup({
									type: 'iframe'
								});
							});
						}

						animateLabels(swiper, 500);

						firstSlider = false;

					}

				}

				// Animate labels

				function animateLabels(swiper, delay) {

					setTimeout(function () {

						var i = 0;
						$(swiper.slides[swiper.activeIndex]).find('.label').each(function () {
							$(this).stop().delay(i++ * 120 + 300).animate({
								'opacity': $(this).hasClass('b') || $(this).hasClass('d') ? 1 : .7,
								'top': 0
							}, 250).css('visibility', 'visible');
						});

					}, delay);

				}

			},

			unmount: function () {

				$(window).off('resize.swiperFront');
				if (frontSwiper != null) {
					frontSwiper.destroy(true, true);
				}

			}

		},

		// BLOG

		Blog: {

			mount: function () {

				if ($('.blog-grid').length > 0 && $('.blog-grid .post').length > 0) {

					$('.blog-grid').each(function () {
						$(this).isotope({
							itemSelector: '.post'
						});
					})

				}

			},

			unmount: function () {

				//$('.blog-grid').isotope('destroy');

			}

		},

		// VIDEO

		Video: {

			mount: function ($this) {

				if (typeof magnificPopup !== 'undefined') {
					$this.find('.video-lightbox').magnificPopup({
						type: 'iframe'
					});
				} else {
					$.getScript($.themeAssets.mgnpop, function () {
						$this.find('.video-lightbox').magnificPopup({
							type: 'iframe'
						});
					});
				}

			},

			unmount: function () {

				//$('.blog-grid').isotope('destroy');

			}

		},

		// Map

		Contact: {

			mount: function ($elm) {

				if ($elm.find('.contact-map-holder').length > 0) {

					if ($elm.find('.contact-map-object').data('address') != '') {

						if (typeof google !== 'undefined') {
							this._createMap($elm.attr('id'), $elm.find('.contact-map-object'), $elm.find('.contact-map-address-holder'));
						} else {

							if (window.loadingGoogleMapsScript) {
								$elm.ti = setInterval((function ($elm) {
									if (typeof google !== 'undefined') {
										clearInterval($elm.ti);
										this._createMap($elm.attr('id'), $elm.find('.contact-map-object'), $elm.find('.contact-map-address-holder'));
									}
								}).bind(this, $elm), 100);

							} else {

								window.loadingGoogleMapsScript = true;
								$.getScript('https://maps.googleapis.com/maps/api/js?v=3&key=' + $elm.find('.contact-map-holder').data('key')).done((function () {
									this._createMap($elm.attr('id'), $elm.find('.contact-map-object'), $elm.find('.contact-map-address-holder'));
								}).bind(this));

							}
						}

					}

				}

			},

			_createMap: function (id, $mapInsert, $mapAddress) {

				$mapInsert.attr('id', 'contact-map-' + id);

				var coordsKey = 'map-coords-' + $mapInsert.attr('id'),
					coordsStorage = localStorage.getItem(coordsKey) != null ? JSON.parse(localStorage.getItem(coordsKey)) : null,
					mapLat = 0,
					mapLong = 0;

				if (coordsStorage != null && coordsStorage['address'] == $mapInsert.data('address')) {
					mapLat = coordsStorage['lat'];
					mapLong = coordsStorage['long'];
				}

				var geocoder, map, address;

				geocoder = new google.maps.Geocoder();
				address = $mapInsert.data('address');

				var mapOptions = {
					zoom: $mapInsert.data('zoom'),
					center: new google.maps.LatLng(mapLat, mapLong),
					streetViewControl: false,
					scrollwheel: true,
					panControl: false,
					mapTypeControl: false,
					overviewMapControl: false,
					zoomControl: false,
					draggable: true,
					styles: window.lightMapStyle
				};

				map = new google.maps.Map(document.getElementById($mapInsert.attr('id')), mapOptions);

				if (mapLat != 0 || mapLong != 0) {

					var markerOptions = {
						position: new google.maps.LatLng(mapLat, mapLong),
						map: map,
						title: address
					}

					if ($mapInsert.data('marker') != 'none') {
						markerOptions['icon'] = {
							url: $mapInsert.data('marker'),
							scaledSize: new google.maps.Size(60, 60)
						}
					}

					$mapAddress.find('a').attr('href', 'http://www.google.com/maps/place/' + mapLat + ',' + mapLong);
					var contentString = $mapAddress.html();
					var infowindow = new google.maps.InfoWindow({
						content: contentString
					});

					var marker = new google.maps.Marker(markerOptions);
					marker.addListener('click', function () {
						infowindow.open(map, marker);
					});

					if ($(window).width() > 768) {
						map.panBy(150, 150);
					} else {
						map.panBy(-75, -100);
					}

				} else {

					if (geocoder) {

						geocoder.geocode({ 'address': address }, function (results, status) {

							if (status == google.maps.GeocoderStatus.OK) {
								if (status != google.maps.GeocoderStatus.ZERO_RESULTS) {

									map.setCenter(results[0].geometry.location);

									var markerOptions = {
										position: results[0].geometry.location,
										map: map,
										title: address
									}

									if ($mapInsert.data('marker') != 'none') {
										markerOptions['icon'] = {
											url: $mapInsert.data('marker'),
											scaledSize: new google.maps.Size(60, 60)
										}
									}

									$mapAddress.find('a').attr('href', 'http://www.google.com/maps/place/' + results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng());
									var contentString = $mapAddress.html();
									var infowindow = new google.maps.InfoWindow({
										content: contentString
									});

									var marker = new google.maps.Marker(markerOptions);
									marker.addListener('click', function () {
										infowindow.open(map, marker);
									});

									if ($(window).width() > 768) {
										map.panBy(150, 150);
									} else {
										map.panBy(-75, -100);
									}

									localStorage.setItem(coordsKey, JSON.stringify({
										'address': $mapInsert.data('address'),
										'lat': results[0].geometry.location.lat(),
										'long': results[0].geometry.location.lng()
									}));

								} else {
									alert("No results found for the given address");
								}
							} else {
								console.log("Geocode was not successful for the following reason: " + status);
							}

						});

					}

				}

			},

			unmount: function () {

			}

		},

		// GRID

		Grid: {

			mount: function ($this) {

				if ($('.grid-style.' + $this.data('section-id')).length > 0) {
					$('.grid-style.' + $this.data('section-id')).remove();
				}

				var $gridParent;

				if ($this.hasClass('related-products-list')) {

					$gridParent = $('#product-related .content');

					var $productRelated = $('#product-related'),
						$productContent = $('.product-content'),
						$productGallery = $('.product-gallery');

					$productRelated.insertAfter($productContent);
					$this = $('#product-related .content .related-products-list');

					$productContent.css('minHeight', Math.ceil($(window).height()));
					$(window).on('resize', function () {
						$productContent.css('minHeight', Math.ceil($(window).height()));
					});

					$(window).on('scroll', function () {
						if ($(window).scrollTop() + $(window).height() >= $productContent.outerHeight()) {
							$productGallery.css('transform', 'translateY(-' + ($productContent.outerHeight(), $(window).scrollTop() + $(window).height() - $productContent.outerHeight()) + 'px)');
						} else {
							$productGallery.css('transform', 'translateY(' + 0 + ')');
						}
					});

					$productRelated.css('display', 'block');

				} else {
					$gridParent = $('#content');
				}

				var rgbBg = window.hexToRgb($this.data('collections_thumb_bg'));

				$this.parent().prepend('<style class="grid-style ' + $this.data('section-id') + '" type="text/css">.isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.one .caption, .isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.three .caption {background-color: rgba(' + rgbBg.r + ', ' + rgbBg.g + ', ' + rgbBg.b + ', .85);}.isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.two .caption, .isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.four .caption { background-color: ' + $this.data('collections_thumb_bg') + '; } @media all and (max-width: 900px) { .isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.one .caption:after, .isotope-products[data-section-id="' + $this.data('section-id') + '"] .grid-item.one .caption.three .caption:after { border-color: rgba(' + rgbBg.r + ', ' + rgbBg.g + ', ' + rgbBg.b + ', 0); border-bottom-color: ' + $this.data('collections_thumb_bg') + '; } }</style>');

				// Init

				window.fourZet = 999;

				$this.find('.grid-item.four').on('mouseenter', function () {
					$(this).css('zIndex', ++window.fourZet);
				});

				var $gridHolder = $this,
					$gridItems = $this.find('.grid-item');

				var gridLoadingArray = [],
					gridLoadingIndex = 0,
					gridLoadingTerval = null;

				$gridHolder.isotope({
					itemSelector: '.grid-item',
					resizable: false,
					resizesContainer: true,
					transitionDuration: 0
				});

				$gridHolder.children('.grid-item').each(function () {
					$(this).addClass('loaded');
				});

				$gridHolder.addClass('loaded');

			},

			unmount: function ($this) {

				$(window).off('resize.productGrid');
				//$this.isotope('destroy');

			}

		},

		// PRODUCT PAGE

		ProductPage: {

			$productSlider: null,
			$productGallery: null,
			$productContent: null,
			$productSettings: null,
			productSwiper: null,

			mount: function ($product) {

				var _this = {};
				$product.data('po', _this);

				_this.$productSettings = $product.find('.product-settings');

				if (_this.$productSettings.data('gallery-posfix')) {
					window.posFix = 0;
				} else {
					window.posFix = 1;
				}

				if (_this.$productSettings.data('hide-variants') && _this.$productSettings.data('product-available')) {
					this._advancedOptionsSelector($product, JSON.parse($product.find('.product-json')[0].innerHTML));
				}

				/* -------------------------------
			   -----   Truncated description   -----
			   ---------------------------------*/

				if (_this.$productSettings.data('truncated_description')) {

					if ($product.find('div[itemprop="description"]').find('.more').length > 0) {
						$product.find('div[itemprop="description"]').find('.more').remove();
					}

					$product.find('div[itemprop="description"]').append('<a href="#" class="more">' + $.themeWords.products_page_more_description_label + '</a>');

					var $descriptionBox = $product.find('div[itemprop="description"] > div'),
						$more = $('.more'),
						opened = false;

					$descriptionBox.css('height', 'auto');
					if ($descriptionBox.height() <= _this.$productSettings.data('truncated_description_lines_range')) {
						$more.remove();
					} else {
						$descriptionBox.css('height', _this.$productSettings.data('truncated_description_lines_range'));
					}

					$more.off('click').on('click', function (e) {

						if (!opened) {

							opened = true;
							$more.text($.themeWords.products_page_less_description_label);

							$descriptionBox.css('height', 'auto');
							var dH = $descriptionBox.height();
							$descriptionBox.css('height', _this.$productSettings.data('truncated_description_lines_range'));

							$descriptionBox.stop().animate({
								height: dH
							}, {
									duration: 250,
									easing: 'easeInSine',
									progress: function () {
										$(window).trigger('resize');
									},
									complete: function () {
										$(this).css('height', 'auto');
										setTimeout(function () {
											$(window).trigger('resize');
										}, 100);
									}
								});

						} else {

							opened = false;
							$more.text($.themeWords.products_page_more_description_label);

							$descriptionBox.stop().animate({
								height: _this.$productSettings.data('truncated_description_lines_range')
							}, {
									duration: 200,
									easing: 'easeInSine',
									progress: function () {
										$(window).trigger('resize');
									},
									complete: function () {
										setTimeout(function () {
											$(window).trigger('resize');
										}, 100);
									}
								});

						}

						e.preventDefault();

					});

				}

				/* -------------------------------
				-----   Gallery   -----
				--------------------------------*/

				_this.$productContent = $('.product-content');

				// Init swiper - part 1

				_this.$productGallery = $('.product-gallery');
				_this.$productSlider = $('.product-gallery').find('.swiper-container');
				var $productSlides = _this.$productGallery.find('.swiper-slide'),
					firstImg = _this.$productGallery.find('img')[0];

				_this.productSwiper = _this.$productSlider.swiper({

					effect: _this.$productSettings.data('gallery_transition') == "fade" ? 'fade' : 'slide',
					mode: 'horizontal',
					loop: true,
					calculateHeight: false,
					grabCursor: true,
					useCSS3Transforms: true,
					resizeReInit: true,
					updateOnImagesReady: false,
					pagination: '.swiper-pagination',
					autoplay: _this.$productSettings.data('gallery_autoplay') && $productSlides.length > 1 ? parseInt(_this.$productSettings.data('gallery_timer')) * 1000 : null,
					autoplayDisableOnInteraction: true,
					speed: 300,
					resistance: false,
					keyboardControl: true,
					zoom: _this.$productSettings.data('zoom'),
					zoomToggle: false,

					onInit: function (swiper) {

						// On the first init append the custom navigation and bind the proper events

						if (swiper.slides.length - 2 > 1) {
							_this.$productGallery.find('.swiper-container').append('<div class="draw-buttons gal swiper-nav three"><div class="holder"><span class="swiper-no"><span class="cur">1</span><span class="tot">' + (swiper.slides.length - 2) + '</span></span><span class="btn-prev">' + $.themeAssets.arrowLeft + '<a href="#" class="swiper-prev"></a></span><span class="btn-next">' + $.themeAssets.arrowRight + '<a href="#" class="swiper-next"></a></span></div></div>');
						} else {
							_this.$productGallery.find('.swiper-container').append('<div class="draw-buttons gal swiper-nav three" style="pointer-events: none"><div class="holder"><span class="swiper-no"><span class="cur">1</span><span class="tot">' + (swiper.slides.length - 2) + '</span></span></div></div>');
							$(swiper.container).css('pointer-events', 'none');
						}

						_this.$productGallery.find('.swiper-next').on('click', function (e) {
							swiper.slideNext();
							e.preventDefault();
						});
						_this.$productGallery.find('.swiper-prev').on('click', function (e) {
							swiper.slidePrev();
							e.preventDefault();
						});

						// Search for images and load "load" the first one - when it's ready, continue with the initialization

						if (firstImg != undefined) {

							if (firstImg.complete || firstImg.naturalWidth > 0) {
								initSwiperCustom(swiper);
							} else {

								$(firstImg).attr('src', $(firstImg).attr('src'));

								$(firstImg).on('load', function () {
									initSwiperCustom(swiper);
								});

							}

						}

						// Limit scale of images if set by user

						if (_this.$productSettings.data('gallery_max_size') == "false") {

							_this.$productSlider.find('img').each(function () {

								if ($(this)[0].complete || $(this)[0].naturalWidth > 0) {
									$(this).css('max-width', $(this).naturalWidth());
									$(this).css('max-height', $(this).naturalHeight());
								} else {
									$(this).on('load', function () {
										$(this).css('max-width', $(this).naturalWidth());
										$(this).css('max-height', $(this).naturalHeight());
									});
								}

							});

						}

						// Trigger a resize after each image load

						_this.$productSlider.find('img').on('load', function () {
							$(window).trigger('resize');
						});

						// zoom

						if ($('.draw-buttons.zoom').length > 0) {

							$('.draw-buttons.zoom').css('display', 'block');
							$('.draw-buttons.zoom').off('click').on('click', function () {

								if ($(this).hasClass('zoomed')) {
									$(this).removeClass('zoomed');
									_this.$productSlider.removeClass('allow-mouse');
								} else {
									$(this).addClass('zoomed');
									_this.$productSlider.addClass('allow-mouse');
								}

								_this.productSwiper.zoom.gesture.slide = _this.productSwiper.slides.eq(_this.productSwiper.activeIndex);
								_this.productSwiper.zoom.gesture.image = _this.productSwiper.zoom.gesture.slide.find('img');
								_this.productSwiper.zoom.gesture.imageWrap = _this.productSwiper.zoom.gesture.slide.find('.swiper-zoom-container');
								_this.productSwiper.zoom.toggleZoom(_this.productSwiper, null);

							});

						}

					},

					// The two functions below are for the customization of the grabbing mouse cursor

					onTouchStart: function (swiper) {
						$(swiper.container).addClass('grabbing');
					},
					onTouchEnd: function (swiper) {
						$(swiper.container).removeClass('grabbing');
					},

					// Refresh the pagination in the custom navigation

					onSlideChangeStart: function (swiper) {
						_this.$productGallery.find('.cur').text(calculateSwiperIndex(swiper.activeIndex, swiper.slides.length));
						if ($('.draw-buttons.zoom.zoomed').length > 0) {
							$('.draw-buttons.zoomed').removeClass('zoomed');
						}
					}

				});

				// Init swiper - part 2

				function initSwiperCustom(swiper) {

					// Fade in images

					$(swiper.slides).find('img').delay(15).animate({ 'opacity': 1 }, 400);

					// Animate the product page based on it's type

					//?!
					setTimeout(function () {
						$product.removeClass('loading');
					}, 500);

					setTimeout(function () {
						_this.$productGallery.addClass('loaded');
					}, 10);

					// Swipe to product variant if case

					if (_this.productSwiperVariantAlready != undefined) {
						setTimeout(function () {
							swiper.slideTo(_this.productSwiperVariantAlready);
						}, 5)
					}

				}

				/* -------------------------------
				-----   Add to cart   -----
				--------------------------------*/

				if ($product.find('.qty-button').length > 0) {

					var $productQty = $product.find('.quantity-selector');

					if (parseInt($productQty.val()) - 1 < parseInt($productQty.attr('min'))) {
						$product.find('.qty-minus').addClass('disabled');
					}
					if (parseInt($productQty.val()) + 1 > parseInt($productQty.attr('max'))) {
						$product.find('.qty-plus').addClass('disabled');
					}

					$product.find('.qty-minus').on('click', (function ($productQty, $productQtyPlus, e) {
						if (!$(e.target).hasClass('disabled')) {
							var currentQty = parseInt($productQty.val());
							if (currentQty - 1 >= parseInt($productQty.attr('min'))) {
								$productQty.val(currentQty - 1);
								$productQtyPlus.removeClass('disabled');
							}
							if (currentQty - 1 <= parseInt($productQty.attr('min'))) {
								$(e.target).addClass('disabled');
							}
						}
						e.preventDefault();
					}).bind(this, $productQty, $product.find('.qty-plus')));

					$product.find('.qty-plus').on('click', (function ($productQty, $productQtyMinus, e) {
						if (!$(e.target).hasClass('disabled')) {
							var currentQty = parseInt($productQty.val());
							if (currentQty + 1 <= parseInt($productQty.attr('max'))) {
								$productQty.val(currentQty + 1);
								$productQtyMinus.removeClass('disabled');
							}
							if (currentQty + 1 >= parseInt($productQty.attr('max'))) {
								$(e.target).addClass('disabled');
							}
						}
						e.preventDefault();
					}).bind(this, $productQty, $product.find('.qty-minus')));

				}

				if (!$product.find('.product-page').hasClass('onboarding-true')) {
					this.initProductForm($product);
				}

				if ($product.find('.add-to-cart form').length > 0 && $product.find('.add-to-cart').data('type') == 'overlay') {

					var $form = $product.find('.add-to-cart form'),
						$submitText = $product.find('.addToCartText'),
						$submitButton = $product.find('.addToCart'),
						$button = $product.find('.ajaxCartButton'),
						$cartCount = $('#meta .count'),
						$cartQty = $product.find('.add-to-cart .quantity-selector');

					if ($form.attr('action').indexOf('.js') < 0) {
						$form.attr('action', $form.attr('action') + '.js');
					}

					$form.submit(function (e) {

						var oldText = $submitText.html();
						$submitText.html('<i class="fa fa-circle-o-notch fa-spin"></i>');
						$submitButton.css('pointer-events', 'none');

						var itemName = $product.find('.product-title').text(),
							itemPrice = $product.find('.product-price').attr('data-price'),
							itemCurrency = $('meta[itemprop="priceCurrency"]').attr('content'),
							itemId = $product.find('.product-page').data('id');

						$.ajax({
							type: $form.prop('method'),
							url: $form.prop('action'),
							data: $form.serialize(),
							dataType: 'json',
							success: function () {

								if (typeof fbq !== 'undefined') {
									fbq('track', 'AddToCart', {
										content_name: itemName,
										content_ids: [itemId],
										content_type: 'product_group',
										value: itemPrice,
										currency: itemCurrency
									});
								}

								$button.trigger('click');

								setTimeout(function () {
									$submitText.html(oldText);
									$submitButton.css('pointer-events', 'all');
								}, 500);

								if ($cartQty.length > 0) {
									$cartCount.text(parseInt($cartCount.text()) + parseInt($cartQty.val()));
								} else {
									$cartCount.text(parseInt($cartCount.text()) + 1);
								}

							},

							error: function (data) {

								alert(data.responseJSON.description);

								setTimeout(function () {
									$submitText.html(oldText);
									$submitButton.css('pointer-events', 'all');
								}, 100);

							}
						});

						e.preventDefault();

					});

				}

			},
			
			initProductForm: function ($product) {

				var firstVariantEver = true;
				var colorSelected = 0;

				var productSingleObject = JSON.parse($product.find('.product-json')[0].innerHTML),
					productVariants = productSingleObject.variants;

				$product.find('form select.product-variants').on('change', (function (e) {
					this._initProductVariantChange(false, productSingleObject, $product);
				}).bind(this));

				/* customization code: Find option checkbox and attach change event */
				/* Start */
				
				$product.find('.line-item-property-field input[type=checkbox]').on('change', (function (e) {
					//example: color
					var hiddenname = e.currentTarget.getAttribute("hidden-data");
					var hiddenfield = document.getElementById(hiddenname);
					var checkboxes = document.querySelectorAll('[hidden-data="' + hiddenname + '"]');
					var colorName = "";
					var colorCode = "";


					colorSelected = 0;
					for (var i = 0; i < checkboxes.length; i++) {
						if (checkboxes[i].checked)
							colorSelected++;
					}
					
					if (colorSelected > 2) {
						e.preventDefault();
						$(e.currentTarget).prop('checked', false)
						return false;
					}



					hiddenfield.value = "";
					$product.find('#color-selected').empty();
					for (var i = 0; i < checkboxes.length; i++) {
						var x = checkboxes[i];
						if (x.checked) {
							colorSelected++;
							colorName = x.getAttribute("value");
							colorCode = $product.find('label[for=\'' + colorName + '\']').attr("style").split(":")[1];
							$product.find('#color-selected').append("<div class='dot-wrapper'>"
								+ "<label style='background-color:" + colorCode + "'></label>"
								+ "</div>");
							if (hiddenfield.value == "") {
								hiddenfield.value = x.value;
							} else {
								hiddenfield.value = hiddenfield.value + ", " + x.value;
							}
						}
					}
				}).bind(this));
				/* End */
				/* customization code: Find option checkbox and attach change event */


				this._initProductVariantChange(true, productSingleObject, $product);

				$product.find('select.product-variants:not(.styled)').each(function () {

					$(this).styledSelect({
						coverClass: 'regular-select-cover',
						innerClass: 'regular-select-inner'
					}).addClass('styled');

					$(this).parent().append($.themeAssets.arrowDown);

					$(this).on('focusin', function () {
						$(this).parent().addClass('focus');
					}).on('focusout', function () {
						$(this).parent().removeClass('focus');
					});

				});

				var selectLabels = '',
					i = 0;

				$product.find('.product-variant').each(function () {
					$(this).attr('id', 'selector-' + i++);
					selectLabels += '#' + $(this).attr('id') + ' .regular-select-inner:before{content:"' + $(this).find('label').text() + ': ";}';
					$(this).find('label').hide();
				});

				if (selectLabels != '') {
					$('head').append('<style type="text/css">' + selectLabels + '</style>');
				}

				if (productSingleObject.variants.length == 1 && productSingleObject.variants[0].title.indexOf('Default') >= 0) {
					$product.find('.product-variant').hide();
				}

				

			},

			_getProductVariant: function ($product) {

				/* ---- 
					Get current variant
					---- */

				var optionArray = [];

				$product.find('form select.product-variants').each(function () {
					optionArray.push($(this).find(':selected').val())
				});

				return optionArray;

			},

			_initProductVariantChange: function (firstTime, productSingleObject, $product) {

				var variant = null,
					options = this._getProductVariant($product);

				productSingleObject.variants.forEach(function (el) {

					if ($(el)[0].options.equals(options)) {
						variant = $(el)[0];
					}

				});

				this._productSelectCallback(variant, $product, productSingleObject);

				if (!firstTime && $product.find('#productSelect option').length > 1 && !$('body').hasClass('template-index')) {
					this._updateProductVariantState(variant);
				}

			},

			_updateProductVariantState: function (variant) {

				if (!history.pushState || !variant) {
					return;
				}

				var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
				window.history.replaceState({ path: newurl }, '', newurl);

			},

			_productSelectCallback: function (variant, $product, productSingleObject) {

				var _po = $product.data('po');

				var $addToCart = $product.find('.add-to-cart form'),
					$addToCartButton = $addToCart.find('button[type="submit"]'),
					$productPrice = $product.find('.productPrice'),
					$comparePrice = $product.find('.comparePrice'),
					$quantityElements = $product.find('.quantity-selector, label + .js-qty'),
					$quantityElementsHolder = $product.find('.quantity-selector-holder'),
					$addToCartText = $product.find('.addToCartText'),
					$productGallery = $('.product-gallery'),
					$productSlider = $('.product-gallery').find('.swiper-container');

				if (variant) {

					// Set cart value id

					$product.find('#productSelect').find('option[value="' + variant.id + '"]').prop('selected', true);

					// Swipe to variant slide

					var $swiperBullets = $('.swiper-pagination').children('span');

					if (variant.featured_image != null) {

						var newImg = $productGallery.find('.swiper-slide[data-variant-img="' + variant.featured_image.id + '"]');

						if (newImg.length > 0) {
							if (_po.productSwiper != undefined) {
								_po.productSwiper.slideTo(newImg.data('index') - window.posFix);
							} else {
								_po.productSwiperVariantAlready = newImg.data('index') - window.posFix;
							}
						}

					}

					// Edit cart buttons based on stock 

					var $variantQuantity = $product.find('.variant-quantity');

					if (variant.available) {

						$quantityElements.prop('max', 999);
						$addToCartButton.removeClass('disabled').prop('disabled', false);
						$addToCartText.text($('#shopify-section-product-preorder').length > 0 ? $addToCartText.data('text') : window.product_words_add_to_cart_button);
						$variantQuantity.text($('#shopify-section-product-preorder').length > 0 ? $variantQuantity.data('text') : '');
						$quantityElements.show();
						if ($quantityElementsHolder != null) {
							$quantityElementsHolder.show();
						}

					} else {

						$variantQuantity.text(window.product_words_no_products);
						$addToCartButton.addClass('disabled').prop('disabled', true);
						$addToCartText.text(window.product_words_sold_out_variant);
						$quantityElements.hide();
						if ($quantityElementsHolder != null) {
							$quantityElementsHolder.hide();
						}

					}

					// Update price

					$productPrice.html(theme.Currency.formatMoney(variant.price, window.shop_money_format));
					$productPrice.attr('data-price', variant.price / 100);
					if (variant.compare_at_price > variant.price) {
						$comparePrice.html(theme.Currency.formatMoney(variant.compare_at_price, window.shop_money_format)).show();
					} else {
						$comparePrice.hide();
					}

					// Update sku

					if ($product.find('.variant-sku').length > 0) {
						if (variant) {
							$product.find('.variant-sku').text(variant.sku);
						} else {
							$product.find('.variant-sku').empty();
						}
					}

				} else {

					// Disable variant completely 

					$addToCartButton.addClass('disabled').prop('disabled', true);
					$addToCartText.text(window.product_words_unavailable_variant);
					$quantityElements.hide();
					if ($quantityElementsHolder != null) {
						$quantityElementsHolder.hide();
					}

				}

				if ($product.find('.qty-button').length > 0) {

					var $productQty = $product.find('.quantity-selector');
					$product.find('.qty-minus').removeClass('disabled');
					$product.find('.qty-plus').removeClass('disabled');

					if (parseInt($productQty.val()) - 1 < parseInt($productQty.attr('min'))) {
						$product.find('.qty-minus').addClass('disabled');
					}
					if (parseInt($productQty.val()) + 1 > parseInt($productQty.attr('max'))) {
						$product.find('.qty-plus').addClass('disabled');
					}

				}

			},

			_advancedOptionsSelector: function ($product, productJson) {
				var om = {};
				$product.data('om', om);
				var forceMutation = false;
				var $addToCartForm = $product.find('.add-to-cart');
				if (window.MutationObserver && $addToCartForm.length) {
					if (typeof observer === 'object' && typeof observer.disconnect === 'function') {
						observer.disconnect();
					}
					var config = { childList: true, subtree: true };
					var observer = new MutationObserver(function () {
						Shopify.linkOptionSelectors(productJson, $product);
						observer.disconnect();
					});
					if (forceMutation) {
						Shopify.linkOptionSelectors(productJson, $product);
					}
					observer.observe($addToCartForm[0], config);
				}
			},

			unmount: function ($product) {

				var po = $product.data('po');
				$(window).off('resize.removeLater');
				po.productSwiper.destroy(true, true);

			}

		}

	}

	/* -------------------------------
	-----   Responsiveness   -----
	--------------------------------*/

	$body.append('<div><div id="size-mobilest"></div><div id="size-mobile"></div><div id="size-tablet"></div></div>');

	var $sizeTablet = $('#size-tablet'),
		$sizeMobile = $('#size-mobile'),
		$sizeMobilest = $('#size-mobilest'),
		mobileSize = false;

	$(window).on('resize', function () {

		if ($sizeMobile.css('display') == 'block' && !mobileSize) {
			mobileSize = true;
			switchSize();
		} else if ($sizeMobile.css('display') == 'none' && mobileSize) {
			mobileSize = false;
			switchSize();
		}

	}).trigger('resize');

	function switchSize() {

		if (mobileSize) {
			$footer.css('display', 'none').appendTo($body);
			$menu.css({ 'opacity': 0, 'visibility': 'hidden' });
			setTimeout(function () {
				$footer.css('display', 'block');
			}, 100);
		} else {
			$footer.css('display', 'none').appendTo($sidebar);
			$menu.css({ 'opacity': 1, 'visibility': 'visible' });
			$responsiveMenu.removeClass('opened');
			$responsiveClose.hide();
			setTimeout(function () {
				$footer.css('display', 'block');
			}, 100);
		}

	}

	function openOverlay($innerOverlay) {

		killFlow('in');
		$overlay.stop().fadeIn();

		$innerOverlay.stop().css('visibility', 'visible')
			.delay(200).animate({
				'opacity': 1,
				'top': 0
			}, 200, 'easeInQuad')
			.addClass('opened');

	}

	function closeModal() {

		killFlow('out');
		$overlay.stop().fadeOut();

		$overlay.find('.opened').stop().animate({
			'opacity': 0,
			'top': -100
		}, 300, 'easeInQuad', function () {
			$(this).css('visibility', 'hidden');
		}).removeClass('opened');

	}

	// fail safe for mobile devices

	if (window.addEventListener) {
		window.addEventListener('orientationchange', function () {
			setTimeout(function () {
				$(window).trigger('resize');
			}, 1000);
		}, false);
	}

	// stuff

	$('#page-content, .product-content').fitVids();

	$('#options select:not(.styled)').each(function () {
		$(this).styledSelect({
			coverClass: 'simple-select-cover',
			innerClass: 'simple-select-inner'
		}).addClass('styled');
		$(this).parent().append($.themeAssets.arrowDown);
	});

	$('select:not(.styled)').each(function () {

		$(this).styledSelect({
			coverClass: 'regular-select-cover',
			innerClass: 'regular-select-inner'
		}).addClass('styled');

		$(this).parent().append($.themeAssets.arrowDown);

	});

	$('.krown-tabs').each(function () {

		var $titles = $(this).children('.titles').children('h5'),
			$contents = $(this).children('.contents').children('div'),
			$openedT = $titles.eq(0),
			$openedC = $contents.eq(0);

		$openedT.addClass('opened');
		$openedC.stop().slideDown(0);

		$titles.find('a').prop('href', '#').off('click');

		$titles.click(function (e) {

			$openedT.removeClass('opened');
			$openedT = $(this);
			$openedT.addClass('opened');

			$openedC.stop().slideUp(200);
			$openedC = $contents.eq($(this).index());
			$openedC.stop().delay(200).slideDown(200);

			e.preventDefault();

		});

	});

	/* -------------------------------
	-----   Sections   -----
	--------------------------------*/

	window.KINGDOM.Sidebar.mount();
	window.KINGDOM.Overlays.mount();

	if ($body.hasClass('template-index')) {
		window.KINGDOM.HomeSlider.mount();
	}

	if ($body.hasClass('template-blog') || ($body.hasClass('template-index') && $('#home-slider').length == 0 && $('.blog-grid').length > 0)) {
		window.KINGDOM.Blog.mount();
	}

	if ($('.isotope-products').length > 0) {
		$('.isotope-products').each(function () {
			window.KINGDOM.Grid.mount($(this))
		});
	}

	if ($body.hasClass('template-product')) {
		window.KINGDOM.ProductPage.mount($('.reload-product-page'));
	}
	if ($('.mount-product').length > 0) {
		$('.mount-product').each(function () {
			window.KINGDOM.ProductPage.mount($(this));
		});
	}

	if ($('.mount-video').length > 0) {
		$('.mount-video').each(function () {
			window.KINGDOM.Video.mount($(this));
		});
	}

	if ($('.mount-map').length > 0) {
		$('.mount-map').each(function () {
			window.KINGDOM.Contact.mount($(this));
		});
	}

	// Events

	$(document).on('shopify:section:load', function (e) {

		var $section = $(e.target);

		setTimeout(function () {

			if ($section.hasClass('mount-sidebar')) {
				window.KINGDOM.Sidebar.mount();
			}
			if ($section.hasClass('mount-overlay')) {
				window.KINGDOM.Overlays.mount();
			}
			if ($section.attr('id') == 'shopify-section-slideshow') {
				window.KINGDOM.HomeSlider.mount();
			}
			if ($section.hasClass('reload-blog')) {
				window.KINGDOM.Blog.mount();
			}
			if ($section.hasClass('mount-video')) {
				window.KINGDOM.Video.mount($section);
			}
			if ($section.hasClass('mount-map')) {
				window.KINGDOM.Contact.mount($section);
			}
			if ($section.hasClass('reload-isotope')) {
				window.KINGDOM.Grid.mount($section.find('.isotope-products'));
			}
			if ($section.hasClass('featured-image-section')) {
				$(window).trigger('resize');
			}

			if ($section.hasClass('reload-product-page')) {
				window.KINGDOM.ProductPage.mount($section);
			}

		}, 100);

		setTimeout(function () {
			$(window).trigger('resize');
		}, 1000);

	}).on('shopify:section:unload', function (e) {

		var $section = $(e.target);

		if ($section.hasClass('mount-sidebar')) {
			window.KINGDOM.Sidebar.unmount();
		}
		if ($section.hasClass('mount-overlay')) {
			window.KINGDOM.Overlays.unmount();
		}
		if ($section.attr('id') == 'shopify-section-slideshow') {
			window.KINGDOM.HomeSlider.unmount();
		}
		if ($section.hasClass('reload-blog')) {
			window.KINGDOM.Blog.unmount();
		}
		if ($section.hasClass('reload-isotope')) {
			window.KINGDOM.Grid.unmount($section.find('.isotope-products'))
		}
		if ($section.hasClass('reload-product-page')) {
			window.KINGDOM.ProductPage.unmount($section);
		}
		if ($section.hasClass('reload-related')) {
			$('#product-related').remove();
		}

	}).on('shopify:block:select', function (e) {

		var $block = $(e.target);

		if ($block.hasClass('swiper-slide') && frontSwiper != null) {
			frontSwiper.slideTo($block.data('index'));
		}

	}).on('shopify:section:select', function (e) {

		var $section = $(e.target);

		if ($section.hasClass('newsletter-section')) {

			openOverlay($('#shopify-section-popup'));

			$('#newsletter-box').find('.close.main').click(function (e) {
				closeModal();
				e.preventDefault();
			});

		}

		if ($section.hasClass('collection-page')) {

			$('#options select:not(.styled)').each(function () {
				$(this).styledSelect({
					coverClass: 'simple-select-cover',
					innerClass: 'simple-select-inner'
				}).addClass('styled');
				$(this).parent().append($.themeAssets.arrowDown);
			});

		}

		if ($section.hasClass('reload-related')) {
			setTimeout(function () {
				if ($('#product-related').length > 0) {
					$('html, body').animate({ 'scrollTop': $('#product-related').offset().top }, 400);
				}
			}, 200);
		}

	}).on('shopify:section:deselect', function (e) {

		var $section = $(e.target);
		if ($section.hasClass('newsletter-section')) {
			closeModal();
		}

	});

})(jQuery);

// Helper functions

function scrollElement($element) {

	$element.parent().height($element.outerHeight());

	var dif = $(window).height() - $element.outerHeight();

	if (dif <= 0) {

		if (-$(window).scrollTop() <= dif) {
			$element.css({ top: dif });
		} else {
			$element.css({ top: Math.ceil(-$(window).scrollTop()) });
		}

	}

}

var bodyOffset = 0,
	iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

function killFlow(dir) {

	if (dir == 'in') {

		$('html').addClass('killflow');

		if (iOS) {
			bodyOffset = $(window).scrollTop();
			$('body').addClass('killflow-ios');
		}

	} else {

		$('html').removeClass('killflow');

		if (iOS) {
			$('body').removeClass('killflow-ios');
			$('body').css('top', 0);
			$('html,body').animate({ 'scrollTop': bodyOffset }, 0);
		}

	}

}

function getBgSrc($elm, $viewport) {

	var desiredDensity = window.devicePixelRatio <= 2 ? window.devicePixelRatio : 2,
		desiredWidth = $viewport.width() * desiredDensity,
		desiredBg = '';

	if (desiredWidth <= 840) {
		desiredBg = $elm.data('src-small');
	} else if (desiredWidth <= 1156) {
		desiredBg = $elm.data('src-medium');
	} else if (desiredWidth <= 1560) {
		desiredBg = $elm.data('src-large');
	} else {
		desiredBg = $elm.data('src-full');
	}

	return desiredBg;

}

function calculateSwiperIndex(index, length) {
	if (index == 0) {
		index = length - 2;
	} else if (index == length - 1) {
		index = 1;
	}
	return index;
}

function resizeGridItem($item, sW, maxImgWidth) {
	var iW = Math.floor(sW / Math.ceil(sW / maxImgWidth));
	$item.width(iW);
}

function getGridSw($grid, $content) {

	var sW = $content.width() + 3,
		sH = $(window).height();

	switch ($grid.data('collections_border')) {
		case "true":
			sW -= 9;
			break;
		case "true tiny":
			sW -= 2;
			break;
		case "true large":
			sW -= 12;
			break;
	}

	return sW;

}