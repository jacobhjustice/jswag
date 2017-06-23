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
     *  $element:   The JQuery selector of the HTML element to type in
     *  color:      The CSS color property of the word
     *  speed:      The amount of time in miliseconds that should occur between each letter
     *  cursor:     The CSS color property of the cursor
     *
     */
    autotype: function(word, $element, color, speed, cursor){
        
    
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
            images.forEach(function(img){
                var i = $("<img>");
                i.css('height', data.height + 'px').css('width', data.width + 'px').css('margin', ' 10px 20px');
                i.attr('src', data.path + "/" + img.text);
                $element.append(i);
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
    }
};