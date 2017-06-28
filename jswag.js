/*
 *  JSwag
 *  A JavaScript Library with various different utility
 *  functions that help a user to customize their page with some flashy features
 *
 *  Created by Jacob Justice
 *  Version 0.0.1
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
     *
     */
    autotype: function(word, $element, color, speed, cursor){
        
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
            }, 500);
        };
        
        //Updates the text letter by letter to appear as if it is typing
        var updateText = function(i, word, $el, speed){
                setTimeout(function(){
                        var temp = word.substring(0, i);
                        $el.html(temp);
                        if(i < word.length)
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
        var queue = function(images, data){
                    $element.fadeOut('medium', function(){
                        var current = data.path + "/" + images[data.index].text;
                        $element.attr('src', current);
                        $element.fadeIn('meduim', function(){
                        data.index = (data.index >= images.length - 1) ? 0 : data.index + 1;
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
                    i.css('width', data.width + 'px')
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
        var $div = $('<div>').attr('id', 'jswag_BackdropDimmer');
        $div.css('width', '100vw').css('height', '100vh').css('position', 'fixed').css('background-color', 'rgba(25, 25, 25, .5)').css('z-index', '100');
        
        var $popup = $("<div>").css('position', 'fixed');
        $popup.html($overlay.html()).attr('id', 'jswagPopoverHTML');
        $div.append($popup);
        $("html").prepend($div);
        var h = $popup.css('height');
        var w = $popup.css('width');
        //$("#jswagPopoverHTML").css('left', 'calc(50% - ' + parseInt(w/2) +'px )').css('top', 'calc(50% - ' + parseInt(h/2) +'px )');
        $("#jswagPopoverHTML").css('left', '50%').css('left', '-=' + parseInt(w)/2 + 'px').css('top', '50%').css('top', '-=' + parseInt(h)/2 + 'px');
        $("#" + close).css('cursor', 'pointer').on('click', function(){
            $("#jswag_BackdropDimmer").remove();
        });
         
     },
     
};