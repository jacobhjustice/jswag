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
     *  path:       The path of the image folder to display
     *  $element:   The JQuery selector of the HTML element to display on
     *  speed:      The amount of time in miliseconds that should occur between each display
     *  
     */
     
    autogallery: function(path, $element, speed){
        $.ajax({
            url: path,
            success: function (data) {
                var imgs = [];
                var exts = [".jpg", ".jpeg", ".png", ".bmap", ".tif", ".tiff"];
                exts.forEach(function(ext){
                    $(data).find("a:contains(" + ext + ")").each(function () {
                        imgs.push(this);
                    });
                });
                //put imgs into an  endless queue of gallery
                var queue = function(path, $element, speed, collection, index){
                    $element.fadeOut('fast', function(){
                        var current = path + "/" + collection[index].text;
                        $element.attr('src', current);
                        $element.fadeIn('fast', function(){
                            index = (index >= collection.length - 1) ? 0 : index + 1;
                            setTimeout(function(){
                                queue(path, $element, speed, collection, index, queue);
                            }, speed);
                        });
                    });
                };
                queue(path, $element, speed, imgs, 0);
            }  
        });
    }
};