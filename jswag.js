/* global $ */


/*
 *  JSwag
 *  A JavaScript Library with various different utility
 *  functions that help a user to customize their page with some flashy features
 *
 *  Created by Jacob Justice
 *  Version 0.0.5
 */

var jswag = {
    
    /*  
     *  Types out a word into an HTML element specified
     *
     *  word:       A string of the word to type out
     *  $element:   The JQuery selector of the HTML element to type in (in order for the cursor to work, needs to have css property of display: inline-block)
     *  color:      The CSS color property of the word
     *  speed:      The amount of time in miliseconds that should occur between each letter
     *  cursor:     A string containing the desired CSS color value of the cursor, or a boolean value of false if no cursor is desired
     *  callback:   An optional callback function to run on completion
     *
     */
    autotype: function(word, $element, color, speed, cursor, callback){
        $element.addClass("JSwagActive_AutoType");
        //Handles the tick mark that visually indicates typing
        var typeBorder = function($el, str, ticksLeft, cursor){
            var css = "1px none white";
            if($el.css('border-right').indexOf("none") != -1)
                css = "1px solid " + cursor;
            setTimeout(function(){
                $el.css('border-right', css);
                if(ticksLeft == undefined||ticksLeft > 0 || css != "1px none white"){
                    if($el.text() != str)
                        typeBorder($el, str, undefined, cursor);
                    else if(ticksLeft == undefined && $el.text() == str)
                        typeBorder($el, str, 3, cursor);
                    else
                        typeBorder($el, str, ticksLeft - 1, cursor);
                }
                else{
                    if(typeof(callback)  == "function")
                        callback();
                }
            }, 500);
        };
        
        //Updates the text letter by letter to appear as if it is typing
        var updateText = function(i, word, $el, speed){
                setTimeout(function(){
                        var temp = word.substring(0, i);
                        $el.html(temp);
                        if(i < word.length && $el.hasClass("JSwagActive_AutoType"))
                            updateText(i+1, word, $el, speed);
                }, speed);
            
        };
        if(cursor != false)
            typeBorder($element, word, undefined, cursor);
        updateText(1, word, $element, speed);
    },
    
    
    /*
     *  Cycles through images in a specified folder to display over an HTML element
     *  
     *  path:       The path of the image folder to display (string)
     *  $element:   The JQuery selector of the HTML element to display on
     *  speed:      The amount of time in miliseconds that should occur between each display (integer)
     *  
     */
    autogallery: function(path, $element, speed){
        $element.addClass("JSwagActive_AutoGallery");
        var queue = function(images, data){
                    $element.fadeOut('medium', function(){
                        var current = data.path + "/" + images[data.index].text;
                        $element.attr('src', current);
                        $element.fadeIn('meduim', function(){
                        data.index = (data.index >= images.length - 1) ? 0 : data.index + 1;
                        if(data.$element.hasClass("JSwagActive_AutoGallery"))
                        setTimeout(function(){
                            queue(images, data);
                        }, data.speed);
                    });
                });
            };
            var data = {
                path: path,
                $element: $element,
                speed: speed,
                index: 0
            };
        jswag.getImages(path, queue, data);      
        
    },
    
    /*
     *  Displays images from a folder inside a specified HTML element
     *  
     *  path:       The path of the image folder to display (string)
     *  $element:   The JQuery selector of the HTML element to display on
     *  height:     The height of each image in the gallery (integer)
     *  width:      The width of each image in the gallery (integer)
     *  
     */
    galleryView: function(path, $element, height, width){
        var display = function(images, data){
            var $div = $("<div>");
            $div.css('margin', '0 auto').css('float', 'middle');
            $element.append($div);
            images.forEach(function(img){
                var i = $("<img>");
                if(height != undefined)
                    i.css('height', data.height + 'px');
                if(width != undefined)
                    i.css('width', data.width + 'px');
                i.css('margin', '10px 20px');
                i.attr('src', data.path + "/" + img.text);
                $div.append(i);
            });
        };
        var data = {
            path: path,
            $element: $element,
            height: height,
            width: width
        };
        jswag.getImages(path, display, data);
    },
    
    /*
     *  Displays images fullscreen from a folder
     *  
     *  path:       The path of the image folder to display (string)
     *  
     */
    fullscreenGallery: function(path){
        $("#JSwagBackdropDimmer").remove();
        var $div = $('<div>').attr('id', 'JSwagBackdropDimmer');
        $div.css('width', '100vw').css('height', '100vh').css('position', 'fixed').css('background-color', 'rgba(25, 25, 25, .5)').css('z-index', '100');
        var $close = $('<div>').attr('id', 'JSwagImageGalleryClose');
        $close.css('cursor', 'pointer').css('font-size', '20px').css('background-color', 'gray').css('width', '25px').css('height', '25px').css('border-radius', '10px').css('position', 'absolute').css('top', '5px').css('right', '5px').css('text-align', 'center').html("X");
        $div.append($close);
        var $img = $("<img>").attr('id', 'JSwagImageGalleryImage');
        $img.css('margin', '0 auto').css('vertical-align', 'middle').css('position', 'absolute').css('width', '300px');
        $div.append($img);
        $div.find("#JSwagImageGalleryImage").css('left', 'calc(50% - 150px)');
        var setImage = function(imgs, data){
            $("#JSwagImageGalleryImage").attr('src', data.path + "/" + imgs[0].text).attr('data-current', '0').attr('data-path', data.path).load(function(){
                $("#JSwagImageGalleryImage").css('top', 'calc( 50% - ' + parseInt($("#JSwagImageGalleryImage").css('height'))/2 + 'px' + ' )');
            });
        };
        jswag.getImages(path, setImage, {path: path});
        
        var $left = $("<div>").attr('id', 'JSwagImageGalleryLeft').css('position', 'absolute').css('left', '5px').css('top', 'calc(50% - 15px)').css('font-size', '30px').css('height', '30px').css('width', '30px').css('background-color', 'gray').css('text-align', 'center').css('cursor', 'pointer').html("<");
        var $right = $("<div>").attr('id', 'JSwagImageGalleryRight').css('position', 'absolute').css('right', '5px').css('top', 'calc(50% - 15px)').css('font-size', '30px').css('height', '30px').css('width', '30px').css('background-color', 'gray').css('text-align', 'center').css('cursor', 'pointer').html(">");
        $left.on('click', function(){
            var newImageLeft = function(imgs, data){
                var index = parseInt($("#JSwagImageGalleryImage").attr('data-current'));
                index = index == 0 ? imgs.length - 1 : index - 1;
                $("#JSwagImageGalleryImage").attr('src', data.path + "/" + imgs[index].text).attr('data-current', index);
            };
            var path = $("#JSwagImageGalleryImage").attr('data-path');
            jswag.getImages(path, newImageLeft, {path:path});
        });
        $right.on('click', function(){
            var newImageRight = function(imgs, data){
                var index = parseInt($("#JSwagImageGalleryImage").attr('data-current'));
                index = index == imgs.length - 1 ? 0 : index + 1;
                $("#JSwagImageGalleryImage").attr('src', data.path + "/" + imgs[index].text).attr('data-current', index);
            };
            var path = $("#JSwagImageGalleryImage").attr('data-path');
            jswag.getImages(path, newImageRight, {path:path});
        });
        $div.append($left).append($right);
        $("html").prepend($div);
        $("#JSwagImageGalleryClose").on('click', function(){
            $("#JSwagBackdropDimmer").remove();
        });
    },
    
    /*
     *  A helper function to find all images inside a folder
     *  
     *  path:       The path of the image folder to display (string)
     *  callback:   The function to run after image data is found
     *  data:       Important callback information
     *  
     */
    getImages: function(path, callback, data){
        $.ajax({
            url: path,
            success: function (page) {
                var imgs = [];
                var exts = [".jpg", ".jpeg", ".png", ".bmap", ".tif", ".tiff"];
                exts.forEach(function(ext){
                    $(page).find("a:contains(" + ext + ")").each(function () {
                        imgs.push(this);
                    });
                });
                callback(imgs, data);
                
            }  
        });
    },
    
    /*
     *  Uses a given HTML div to create a popover element
     *  
     *  $overlay:       A JQuery selector of an HTML script of type text/template that is being overlayed on the screen
     *  close:          The ID of an element inside the overlay that, upon clicking, closes the popup
     *  
     */
     popup: function($overlay, close){
        $("#JSwagBackdropDimmer").remove();
        var $div = $('<div>').attr('id', 'JSwagBackdropDimmer');
        $div.css('width', '100vw').css('height', '100vh').css('position', 'fixed').css('background-color', 'rgba(25, 25, 25, .5)').css('z-index', '100');
        
        var $popup = $("<div>").css('position', 'fixed');
        $popup.html($overlay.html()).attr('id', 'JSwagPopoverHTML');
        $div.append($popup);
        $("html").prepend($div);
        var h = $popup.css('height');
        var w = $popup.css('width');
        $("#JSwagPopoverHTML").css('left', '50%').css('left', '-=' + parseInt(w)/2 + 'px').css('top', '50%').css('top', '-=' + parseInt(h)/2 + 'px');
        $("#" + close).css('cursor', 'pointer').on('click', function(){
            $("#JSwagBackdropDimmer").remove();
        });
         
     },
     
     /*
      *  Fills out a premade HTML template with information
      *  
      *  $template:         The JQuery selector of the HTML script of type "text/template". Fields should be formatted as {{objectProperty}}
      *  templateObject:    An object containing data to will the template with.
      *  
      *  Example:   <script type="text/template" id="SampleTemplate"><h1>{{text}}</h1></script>
      *             var html = jswag.templateHelper($("#SampleTemplate"), {text: "Test Template"});
      *             //The above code sets var html to <h1>Test Template</h1>
      *
      */
     templateHelper: function($template, templateObject){
         var string = $template.html();
         while(string.indexOf("{{") > 0 && string.indexOf("}}") > 0){
             var start = string.indexOf("{{");
             var finish = string.indexOf("}}");
             var prop = string.substring(start + 2, finish);
             var filler = templateObject[prop] != undefined ? templateObject[prop] : "";
             string = string.substr(0, start) + filler + string.substr(finish + 2);
         }
         return string;
     }
};