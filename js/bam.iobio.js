// wrapper around Thomas Down's original BAM js work 
// to make fetching multiple bams easier and require less callbacks

var Bam = Class.extend({
   
   init: function(bamUri, options) {
      this.bamUri = bamUri;
      this.options = options; // *** add options mapper ***
      // test if file or url
      if (typeof(this.bamUri) == "object") {
         this.sourceType = "file";
         this.bamBlob = new BlobFetchable(bamUri); 
         this.baiBlob = new BlobFetchable(this.options.bai); // *** add if statement if here ***
         this.promises = [];
         this.bam = undefined;
         var me = this;
         makeBam(this.bamBlob, this.baiBlob, function(bam) {
            me.headerStr = bam.header;
            me.provide(bam); 
         });
      } else if ( this.bamUri.slice(0,4) == "http" ) {
         this.sourceType = "url";         
      }
      
      // set iobio servers
      this.iobio = {}
      this.iobio.bamtools = "ws://0.0.0.0:7030";
      this.iobio.samtools = "ws://0.0.0.0:8060";
      this.iobio.bamMerger = "ws://0.0.0.0:8030";
      this.iobio.bamstatsAlive = "ws://0.0.0.0:7100"
      
      return this;
   },
   
   fetch: function( chr, start, end, callback, options ) {
      var me = this;      
      // handle bam has been created yet
      if(this.bam == undefined) // **** TEST FOR BAD BAM ***
         this.promise(function() { me.fetch( chr, start, end, callback, options ); });
      else
         this.bam.fetch( chr, start, end, callback, options );
   },
   
   promise: function( callback ) {
      this.promises.push( callback );
   },
   
   provide: function(bam) {
      this.bam = bam;
      while( this.promises.length != 0 ) 
         this.promises.shift()();
   },
   
   _makeid: function() {
      // make unique string id;
       var text = "";
       var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

       for( var i=0; i < 5; i++ )
           text += possible.charAt(Math.floor(Math.random() * possible.length));

       return text;
   },
   
   _getBamUrl: function(chr, start, end) {
      return this._getBamRegionsUrl([ {'chr':chr,'start':start,'end':end} ]);
   },
   
   _getBamRegionsUrl: function(regions) {
      if ( this.sourceType == "url") {
         var regionStr = "";
         regions.forEach(function(region) { regionStr += " " + region.chr + ":" + region.start + "-" + region.end });
         var url = this.iobio.samtools + "?cmd= view -b " + this.bamUri + regionStr + "&encoding=binary";
      } else {
         // creates a url for a new bam that is sliced from an old bam
         // open connection to iobio webservice that will request this data, since connections can only be opened from browser
         var me = this;
         var connectionID = this._makeid();
         var client = BinaryClient(this.iobio.samtools + '?id=', {'connectionID' : connectionID} );
         client.on('open', function(stream){
            var stream = client.createStream({event:'setID', 'connectionID':connectionID});
            stream.end();
         })
      
         var url = this.iobio.samtools + "?encoding=binary&cmd=view -S -b " + encodeURIComponent("http://client?id="+connectionID);
         var ended = 0;
         var me = this;
         // send data to samtools when it asks for it
         client.on('stream', function(stream, options) {
            stream.write(me.headerStr)
            regions.forEach(function(region){
               me.convert('sam', region.chr, region.start, region.end, function(data,e) {   
                  stream.write(data);
                  ended += 1;
                  if ( regions.length == ended) stream.end();
               }, {noHeader:true});               
            })
         })
      }
      return encodeURI(url);
   },
   
   // *** bamtools functionality ***

   convert: function(format, chr, start, end, callback, options) {
      // Converts between BAM and a number of other formats
      if (!format || !chr || !start || !end)
         return "Error: must supply format, sequenceid, start nucleotide and end nucleotide"
      
      if (format.toLowerCase() != "sam")
         return "Error: format + " + options.format + " is not supported"
      var me = this;   
      this.fetch(chr, start, end, function(data,e) {
         if(options && options.noHeader)
            callback(data, e);
         else {
            me.header(function(h) {
               callback(h + data, e);
            })
         }
      }, { 'format': format })
   },
   
   count: function() {
      // Prints number of alignments in BAM file(s)
   },
   
   coverage: function() {
      // Prints coverage statistics from the input BAM file
   },
   
   filter: function() {
      // Filters BAM file(s) by user-specified criteria
   },
   
   header: function(callback) {
      var me = this;
      if (me.headerStr)
         callback(me.headerStr);
      else if (me.sourceType == 'file')
         me.promise(function() { me.header(callback); })
      else {
         var client = BinaryClient(this.iobio.samtools);
         var url = encodeURI( this.iobio.samtools + '?cmd=view -H ' + this.bamUri)
         client.on('open', function(stream){
            var stream = client.createStream({event:'run', params : {'url':url}});
            var header = ""
            stream.on('data', function(data, options) {
               header += data;
            });
            stream.on('end', function() { 
               me.headerStr = header;
               callback(header);
            });
         });
      }
         
      // need to make this work for URL bams
      // need to incorporate real promise framework throughout
   },
   	
   index: function() {
      // Generates index for BAM file
   },
   
   merge: function() {
      // Merge multiple BAM files into single file
   },
   
   random: function() {
      // Select random alignments from existing BAM file(s), intended more as a testing tool.
   },
   
   resolve: function() {
      // Resolves paired-end reads (marking the IsProperPair flag as needed)
   },
   
   revert: function() {
      // Removes duplicate marks and restores original base qualities
   },
   
   sort: function() {
      // Sorts the BAM file according to some criteria
   },
   
   split: function() {
      // Splits a BAM file on user-specified property, creating a new BAM output file for each value found
   },
   
   stats: function(chr, start, end, callback) {
      // Prints some basic statistics from input BAM file(s)
      var client = BinaryClient(this.iobio.bamstatsAlive);
      var url = encodeURI( this.iobio.bamstatsAlive + '?cmd=-u 1000 -s ' + start + " -l " + parseInt(end-start) + " " + encodeURIComponent(this._getBamUrl(chr,start,end)) );
      client.on('open', function(stream){
         var stream = client.createStream({event:'run', params : {'url':url}});
         var buffer = "";
         stream.on('data', function(data, options) {
            var success = true;
            try {
              var obj = $.parseJSON(buffer + data)
            } catch(e) {
              success = false;
              buffer += data;
            }
            if(success) {
              buffer = "";
              callback(obj); 
            }
         });
      });
   }, 
   
   sampleStats: function(chr, callback, options) {
      // Prints some basic statistics from sampled input BAM file(s)      
      options = $.extend({
         binSize : 10000, // defaults
         binNumber : 50
      },options);
      var me = this;
      
      function goSampling() {      
         var regions = [];
         var length = options.end - options.start;
         if ( length < options.binSize * options.binNumber) {
            regions.push({ 'chr':chr, start:options.start, end:options.end })
         } else {
            for (var i=0; i < options.binNumber; i++) {         
               var regionStart = parseInt(options.start + length/options.binNumber * i);
               regions.push({
                  'chr' : chr,
                  'start' : regionStart,
                  'end' : regionStart + options.binSize
               });
            }
         }
      
         
         var client = BinaryClient(me.iobio.bamstatsAlive);
         var url = encodeURI( me.iobio.bamstatsAlive + '?cmd=-u 1000 -s ' + options.start + " -l " + length + " " + encodeURIComponent(me._getBamRegionsUrl(regions)))
         var buffer = "";
         client.on('open', function(stream){
            var stream = client.createStream({event:'run', params : {'url':url}});
            stream.on('data', function(data, options) {
               var success = true;
               try {
                 var obj = $.parseJSON(buffer + data)
               } catch(e) {
                 success = false;
                 buffer += data;
               }
               if(success) {
                 buffer = "";
                 callback(obj); 
               }               
            });
         });
      }
      
      if ( options.start != undefined && options.end != undefined) {
         goSampling();
      } else  {
         this.header(function(header) {
            var lines = header.split("\n");
            for ( var i=0; i<lines.length; i++) {
               var fields = lines[i].split("\t");
               if (fields[0] == "@SQ") {
                  var name = fields[1].split("SN:")[1];
                  var length = parseInt(fields[2].split("LN:")[1]);
                  if (name == chr) {
                     options.start = 1;
                     options.end = length;
                     goSampling();  
                  }                        
               }
            }
         })
      }
   }   
   
});