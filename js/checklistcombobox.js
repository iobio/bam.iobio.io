
 (function( $ ) {

      var proto = $.ui.autocomplete.prototype,
        initSource = proto._initSource;

      function filter( array, term ) {
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
        return $.grep( array, function(value) {
          return matcher.test( $( "<div>" ).html( value.label || value.value || value ).text() );
        });
      }

      $.extend( proto, {
        _initSource: function() {
          if ( this.options.html && $.isArray(this.options.source) ) {
            this.source = function( request, response ) {
              response( filter( this.options.source, request.term ) );
            };
          } else {
            initSource.call( this );
          }
        },

        _renderItem: function( ul, item) {
          return $( "<li></li>" )
            .data( "item.autocomplete", item )
            .append( $( "<a></a>" )[ this.options.html ? "html" : "text" ]( item.label ) )
            .appendTo( ul );
        }
      });

      })( jQuery );
  (function( $ ) {
    $.widget( "custom.combobox", {
      _create: function() {
        var me = this;
        this.wrapper = $( "<span>" )
          .addClass( "custom-combobox" )
          .insertAfter( this.element );

        this.element.addClass("combobox-original-ul");
        this.element.hide();
        this._createAutocomplete();
        this._createShowAllButton(); 
        me.change = false;
  
        $(".ui-autocomplete").on('click', ".combobox-checkbox", function(e) {        
          // me.change = true;
          var $ul = $(".combobox-original-ul");
          var $a = $(e.currentTarget);

          me.change = true;       
          $ul.trigger('checklistchange', [$a, $a.parent().text()]);
        })    

        $(".ui-autocomplete").on('mouseenter', ".ui-menu-item", function(e) {        
          var $a = $(e.currentTarget).find(".combobox-checkbox");
          var $ul = $(".combobox-original-ul");
          $ul.trigger('checklistmouseover', [$a, $a.parent().text()]);
        });
        $(".ui-autocomplete").on('mouseleave', ".ui-menu-item", function(e) {        
          var $a = $(e.currentTarget).find(".combobox-checkbox");
          var $ul = $(".combobox-original-ul");
          $ul.trigger('checklistmouseout', [$a, $a.parent().text()]);
        });
      },
 
      _createAutocomplete: function() {
        var selected = this.element.children( ":selected" ),
          value = selected.val() ? selected.text() : "",
          me = this;
 
        this.input = $( "<input>" )        
          .appendTo( this.wrapper )
          .val( value )
          .attr( "title", "" )
          .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
          .Watermark("Select References")
          .autocomplete({
            delay: 0,
            minLength: 0,
            source: $.proxy( this, "_source" ),
            html: true
          })
          .tooltip({
            tooltipClass: "ui-state-highlight"
          });      
 
        this._on( this.input, {
          autocompleteselect: function( event, ui ) {                         
            ui.item.option.selected = true;
            this._trigger( "select", event, {
              item: ui.item.option
            });
          },
 
          autocompletechange: "_removeIfInvalid",
          autocompletefocus: function( event, ui ) {
            return false;
          },          
          autocompleteclose: function (event, ui) {            
            var $ul = $(".combobox-original-ul");
            var $a = $(".combobox-checkbox");
            $ul.children().each(function() {
              var origCheckbox = this;
              $a.each(function() {                            
                if ($(this).parent().text() == $(origCheckbox).text()) { 
                  if ($(this).is(':checked'))
                    $(origCheckbox).attr("data-checked", 'checked')
                  else
                    $(origCheckbox).attr("data-checked", '')
                }
              });
            });          
          
            if (me.change) {
              var $ul = $(".combobox-original-ul");
              $ul.trigger('checklistclose');
              me.change = false;
            }
          }
        });
      },
 
      _createShowAllButton: function() {
        var input = this.input,
          wasOpen = false;
 
        $( "<a>" )
          .attr( "tabIndex", -1 )
          .attr( "title", "Select references to sample" )          
          .appendTo( this.wrapper )
          .button({
            icons: {
              primary: "ui-icon-triangle-1-s"
            },
            text: false
          })
          .removeClass( "ui-corner-all" )
          .addClass( "custom-combobox-toggle ui-corner-right" )
          .mousedown(function() {
            wasOpen = input.autocomplete( "widget" ).is( ":visible" );
          })
          .click(function() {
            input.focus();
 
            // Close if already visible
            if ( wasOpen ) {
              return;
            }
 
            // Pass empty string as value to search for, displaying all results
            input.autocomplete( "search", "" );
          });
      },
 
      _source: function( request, response ) {
        var me = this;
        var term = request.term.split(",").pop();
        var matcher = new RegExp( $.ui.autocomplete.escapeRegex(term), "i" );
        response( this.element.children( "li" ).map(function() {
          var text = $( this ).text();          
          if ( ( !term || matcher.test(text) ) ) {
            var checked = '';
            if ($(this).attr('data-checked') == 'checked') checked = "checked='checked'";
            return "<label><input class='combobox-checkbox' type='checkbox' " + checked + "/>" + text + "</label>" ;
          }
        }) );
      },      
 
      _removeIfInvalid: function( event, ui ) {        
        // Selected an item, nothing to do
        if ( ui.item ) {
          return;
        }
 
        // Search for a match (case-insensitive)
        var value = this.input.val(),
          valueLowerCase = value.toLowerCase(),
          valid = false;
        this.element.children( "option" ).each(function() {
          if ( $( this ).text().toLowerCase() === valueLowerCase ) {
            this.selected = valid = true;
            return false;
          }
        });
 
        // Found a match, nothing to do
        if ( valid ) {
          return;
        }
 
        // Remove invalid value
        this.input
          .val( "" )          
        this.element.val( "" );
        this._delay(function() {
          this.input.tooltip( "close" ).attr( "title", "" );
        }, 2500 );
        this.input.data( "ui-autocomplete" ).term = "";
        $.Watermark.ShowAll();
      },
 
      _destroy: function() {
        this.wrapper.remove();
        this.element.show();
      },

      getToBeSelected: function() {        
        // return text of elems
        var toBeSelected = $(".combobox-checkbox:checked").parent().map(function() { return $(this).text() }).toArray();
        var selected = this.getSelected();
        selected.forEach(function(d){
          var index = toBeSelected.indexOf(d);
          if ( index != -1 )
            toBeSelected.splice(index, 1)
        })
        return toBeSelected;
      },

      getSelected: function() {
        // get elems
        var elems = this.element.children("[data-checked='checked']").toArray();
        // return text of elems
        return elems.map(function(d) { return $(d).text() ;});        
      },

      getOptions: function() {
        // get elems
        var elems = this.element.children("input [type='checkbox']").toArray();
        // return text of elems
        return elems.map(function(d) { return $(d).text() ;});
      }

    });
  })( jQuery );

    (function($) {
    var map=new Array();
    $.Watermark = {
      ShowAll:function(){
        for (var i=0;i<map.length;i++){
          if(map[i].obj.val()==""){
            map[i].obj.val(map[i].text);          
            map[i].obj.css("color",map[i].WatermarkColor);
          }else{
              map[i].obj.css("color",map[i].DefaultColor);
          }
        }
      },
      HideAll:function(){        
        for (var i=0;i<map.length;i++){
          if(map[i].obj.val()==map[i].text)
            map[i].obj.val("");         
        }
      }
    }
    
    $.fn.Watermark = function(text,color) {
      if(!color)
        color="#aaa";
      return this.each(
        function(){   
          var input=$(this);
          var defaultColor=input.css("color");
          map[map.length]={text:text,obj:input,DefaultColor:defaultColor,WatermarkColor:color};
          function clearMessage(){
            if(input.val()==text)
              input.val("");
            input.css("color",defaultColor);
          }

          function insertMessage(){
            if(input.val().length==0 || input.val()==text){
              input.val(text);
              input.css("color",color); 
            }else
              input.css("color",defaultColor);        
          }

          input.focus(clearMessage);
          input.blur(insertMessage);                
          input.change(insertMessage);
          
          insertMessage();
        }
      );
    };
  })(jQuery);