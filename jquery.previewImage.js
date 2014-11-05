/**
 * jquery.previewImage.js v1.0.0
 * http://www.cerocreativo.cl
 *
 * Shows image preview before file upload
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright (c) 2014 Paulo Mendez,
 * http://www.cerocreativo.cl
 * http://www.rockandthemes.com
 *
 */

(function ( $ ) {
	$.fn.previewImage = function(options) {
		var defaults = $.extend({
			// These are the defaults.
			returnType: 	"image", 		//Options: image/background/raw
			prevSlug: 		"prevImage_",
			prevClass: 		"previewImage",	//For aditional css styling
			prevWidth: 		100,
			prevHeight: 	"auto",
			imgTypes: 		['gif','png','jpeg','jpg','bmp'],	// File types array
			imgWidht: 		480,			// Pixels
			imgHeight: 		320,			// Pixels
			imgMpx: 		1,				// MegaPixels
			maxFiles: 		10,				// Files
			maxFileSize: 	2,				// Mb
			oldBrowser: 	"previewImage.js - Browser not supported.",
			//onChange: function(){},
		},options);

		var settings = $.extend( {}, defaults, options );

		return this.each(function() {
			var obj	= $(this);
			if(window.FileReader){

				var previewImageHandler = function(e){
					
					// Fire Change Callback
					//$.isFunction( settings.onChange ) && settings.onChange.call( this );
					//settings.onChange.call(this); // We call it directly cause we made an anonymous function
					obj.trigger({
						type: 		"previewImageChange",
					});		
					// End Callback

					var id 	= this.id;
					var files		= $(this).prop('files');
					if (files.length <= settings.maxFiles) {
						for (var i=0, file; (file=files[i]) && (i < settings.maxFiles); i++){
							var fileName	= file.name,
								fileType	= file.type,
								fileTypeExt	= fileType.split("/").pop();
								fileSize 	= file.size,
								fileSize 	= (fileSize / (1024*1024)).toFixed(2);

							if ($.inArray(fileTypeExt, settings.imgTypes) >= 0) {
								if (fileSize <= settings.maxFileSize) {
									readImg		= new FileReader();
									readImg.onload = function(e){
										var imgPreview	= e.target.result,
											image 		= new Image();
											image.src	= imgPreview;

										image.onload = function(){
											var w = this.width,
												h = this.height;

											if ((w >= settings.imgWidth) || (h >= settings.imgHeight) || (mpx(w,h))){
												if (settings.returnType == "image"){
													var img 	= "<img src='"+imgPreview+"' class='"+settings.prevClass+"' width='"+settings.prevWidth+"' height='"+settings.prevHeight+"' />",
														prev 	= "#"+settings.prevSlug+id;
													$(img).appendTo(prev);
												} else if (settings.returnType == "background"){
													var bgStyle = {
															"background-image":"url("+imgPreview+")",
															"background-size":"auto 100%",
															"background-position":"50% center, 50% center",
															"display":"inline-block",
															"width":settings.prevWidth,
															"height":settings.prevHeight
														},
														elem	= "<span class='"+settings.prevClass+"'></span>",
														prev 	= "#"+settings.prevSlug+id;
														$(elem).css(bgStyle).appendTo(prev);
												} else if (settings.returnType == "raw"){
													obj.trigger({
														type: 		"previewImageReady",
														img:		imgPreview,
														imgname: 	fileName,
														imgsize: 	fileSize,
														imgtype: 	fileType,
														imgwidth: 	w,
														imgheight: 	h
													});													
												}													
											} else {
												error("FileResolutionNotAllowed");
											}
										}
									}
									readImg.readAsDataURL(file);
								} else {
									error("FileTooLarge");
								}
							} else {
								error("FileTypeNotAllowed");
							}
						}
					} else {
						obj.val("");
						error("TooManyFiles");
					}

				function mpx(w,h){
					var mpx		= 1048576,
						total	= w*h/mpx;

					if (total >= settings.imgMpx) {
						return true;
					} else {
						return false;
					}
				}

				}; // Preview Handler
			} else {
				// Old browser not supported alert
				var msg	= settings.oldBrowser;
				if (msg) {
					alert(settings.oldBrowser);
				}
				error("OldBrowser");
			}
			this.onchange = previewImageHandler;

			function error(errorType){
				obj.trigger({
					type: 		"previewImageError",
					errorType:	errorType
				});
			}
		}); // To Here
	};
}(jQuery));