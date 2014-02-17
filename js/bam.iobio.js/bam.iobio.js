// extending Thomas Down's original BAM js work 

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
            me.setHeader(bam.header);
            me.provide(bam); 
         });
      } else if ( this.bamUri.slice(0,4) == "http" ) {
         this.sourceType = "url";         
      }
      
      // set iobio servers
      this.iobio = {}
      this.iobio.bamtools = "ws://bamtools.iobio.io";
      this.iobio.bamtools = "ws://0.0.0.0:7030";
      // this.iobio.samtools = "ws://samtools.iobio.io";
      this.iobio.samtools = "ws://0.0.0.0:8060";
      // this.iobio.bamReadDepther = "ws://bamReadDepther.iobio.io";
      this.iobio.bamReadDepther = "ws://0.0.0.0:8021";
      this.iobio.bamMerger = "ws://bammerger.iobio.io";
      // this.iobio.bamstatsAlive = "ws://bamstatsalive.iobio.io"
      this.iobio.bamstatsAlive = "ws://0.0.0.0:7100"
      
      return this;
   },
   
   fetch: function( name, start, end, callback, options ) {
      var me = this;      
      // handle bam has been created yet
      if(this.bam == undefined) // **** TEST FOR BAD BAM ***
         this.promise(function() { me.fetch( name, start, end, callback, options ); });
      else
         this.bam.fetch( name, start, end, callback, options );
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
   
   _getBamUrl: function(name, start, end) {
      return this._getBamRegionsUrl([ {'name':name,'start':start,'end':end} ]);
   },
   
   _getBamRegionsUrl: function(regions) {
      if ( this.sourceType == "url") {
         var regionStr = "";
         regions.forEach(function(region) { regionStr += " " + region.name + ":" + region.start + "-" + region.end });
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
      
         var url = this.iobio.samtools + "?protocol=websocket&encoding=binary&cmd=view -S -b " + encodeURIComponent("http://client?&id="+connectionID);
         var ended = 0;
         var me = this;
         // send data to samtools when it asks for it
         client.on('stream', function(stream, options) {
            stream.write(me.header.toStr);
            regions.forEach(function(region){
               me.convert('sam', region.name, region.start, region.end, function(data,e) {   
                  stream.write(data);
                  ended += 1;
                  if ( regions.length == ended) stream.end();
               }, {noHeader:true});               
            })
         })
      }
      return encodeURI(url);
   },
   
   getReferencesWithReads: function(callback) {
      var refs = [];
      var me = this;
      if (this.sourceType == 'url') {
         
      } else {
         this.getHeader(function(header) {
            for (var i=0; i < header.sq.length; i++) {
               if ( me.bam.indices[me.bam.chrToIndex[header.sq[i].name]] != undefined )
                  refs.push( header.sq[i] );
            }
            callback(refs);
         })
      }
   },
   
   // *** bamtools functionality ***

   convert: function(format, name, start, end, callback, options) {
      // Converts between BAM and a number of other formats
      if (!format || !name || !start || !end)
         return "Error: must supply format, sequenceid, start nucleotide and end nucleotide"
      
      if (format.toLowerCase() != "sam")
         return "Error: format + " + options.format + " is not supported"
      var me = this;   
      this.fetch(name, start, end, function(data,e) {
         if(options && options.noHeader)
            callback(data, e);
         else {
            me.getHeader(function(h) {
               callback(h.toStr + data, e);
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
   
   estimateBaiReadDepth: function(cb) {
      var me = this;
      queue()
          .defer(function(callback) { me.getHeader(function(header) { callback(null, header); }) })
          .defer(function(callback) {
               if (me.readDepth)
                  callback(null, me.readDepth)
               else if (me.sourceType == 'url') {
                  var client = BinaryClient(me.iobio.bamReadDepther);
                  var url = encodeURI( me.iobio.bamReadDepther + '?cmd=-i ' + me.bamUri + ".bai")
                  client.on('open', function(stream){
                     var stream = client.createStream({event:'run', params : {'url':url}});
                     var readDepth = {};
                     var currentSequence;
                     stream.on('data', function(data, options) {
                        data = data.split("\n")
                        for (var i=0; i < data.length; i++)  {
                           if ( data[i][0] == '#' ) {
                              currentSequence = data[i].substr(1);
                              readDepth[currentSequence] = [];
                           }
                           else {
                              if (data[i] != "") {
                                 var d = data[i].split("\t");
                                 readDepth[currentSequence].push({ pos:parseInt(d[0]), depth:parseInt(d[1]) });
                              }
                           }                  
                        }
                     });
                     stream.on('end', function() {
                        callback (null, readDepth);
                     });
                  });
               } else if (me.sourceType == 'file') {
                   me.baiBlob.fetch(function(header){
                      if (!header) {
                           return dlog("Couldn't access BAI");
                       }
                   
                       var uncba = new Uint8Array(header);
                       var baiMagic = readInt(uncba, 0);
                       if (baiMagic != BAI_MAGIC) {
                           return dlog('Not a BAI file');
                       }
                       var nref = readInt(uncba, 4);
                   
                       bam.indices = [];
                       var readDepth = {};
                       var p = 8;
                       
                       for (var ref = 0; ref < nref; ++ref) {
                           var bins = [];
                           var blockStart = p;
                           var nbin = readInt(uncba, p); p += 4;
                           if (nbin > 0) readDepth[ref] = [];
                           for (var b = 0; b < nbin; ++b) {
                               var bin = readInt(uncba, p);
                               var nchnk = readInt(uncba, p+4);
                               p += 8;
                               // p += 8 + (nchnk * 16);
                               var byteCount = 0;
                               for (var c=0; c < nchnk; ++c) {
                                  var startBlockAddress = readVob(uncba, p);
                                  var endBlockAddress = readVob(uncba, p+8);
                                  p += 16;
                                  byteCount += (endBlockAddress.block - startBlockAddress.block);
                               }
                              if ( bin >=  4681 && bin <= 37449) {
                                 var position = (bin - 4681 + 1) * 16000;
                                 readDepth[ref][bin-4681] = {pos:position, depth:byteCount};
                                 // readDepth[ref].push({pos:position, depth:byteCount});
                                //bins[bin - 4681] = byteCount;
                              }
                           }
                           var nintv = readInt(uncba, p); p += 4;
                           p += (nintv * 8);
                           
                           if (nbin > 0) {
                              for (var i=0 ; i < readDepth[ref].length; i++) {
                                 if(readDepth[ref][i] == undefined)
                                    readDepth[ref][i] = {pos : (i+1)*16000, depth:0};
                              }
                           }
                       }                       
                       callback(null, readDepth);
                   });
               }
            })
            .awaitAll(function(error, results) {
               me.readDepth = {};
               var readDepth = results[1]
               for (var id in readDepth) {
                 if (readDepth.hasOwnProperty(id))
                   me.readDepth[ me.header.sq[parseInt(id)].name ] = readDepth[id];
               }
               if (cb != undefined)
                  cb(me.readDepth);               
            })
         
   },
   
   getHeader: function(callback) {
      var me = this;
      if (me.header)
         callback(me.header);
      else if (me.sourceType == 'file')
         me.promise(function() { me.getHeader(callback); })
      else {
         var client = BinaryClient(me.iobio.samtools);
         var url = encodeURI( me.iobio.samtools + '?cmd=view -H ' + this.bamUri)
         client.on('open', function(stream){
            var stream = client.createStream({event:'run', params : {'url':url}});
            var rawHeader = ""
            stream.on('data', function(data, options) {
               rawHeader += data;
            });
            stream.on('end', function() {
               me.setHeader(rawHeader);             
               callback( me.header);
            });
         });
      }
         
      // need to make this work for URL bams
      // need to incorporate real promise framework throughout
   },
   
   setHeader: function(headerStr) {
      var header = { sq:[], toStr : headerStr };
      var lines = headerStr.split("\n");
      for ( var i=0; i<lines.length > 0; i++) {
         var fields = lines[i].split("\t");
         if (fields[0] == "@SQ") {
            var name = fields[1].split("SN:")[1];
            var length = parseInt(fields[2].split("LN:")[1]);            
            header.sq.push({name:name, end:1+length});
         }
      }               
      this.header = header;
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
   
   stats: function(name, start, end, callback) {
      // Prints some basic statistics from input BAM file(s)
      var client = BinaryClient(this.iobio.bamstatsAlive);
      var url = encodeURI( this.iobio.bamstatsAlive + '?cmd=-u 1000 -s ' + start + " -l " + parseInt(end-start) + " " + encodeURIComponent(this._getBamUrl(name,start,end)) );
      client.on('open', function(stream){
         var stream = client.createStream({event:'run', params : {'url':url}});
         var buffer = "";
         stream.on('data', function(data, options) {
            if (data == undefined) return;
            var success = true;
            try {
              var obj = JSON.parse(buffer + data)
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
   
   sampleStats: function(callback, options) {
      // Prints some basic statistics from sampled input BAM file(s)      
      options = $.extend({
         binSize : 50000, // defaults
         binNumber : 10,
         start : 1,
      },options);
      var me = this;
      
      function goSampling(SQs) {      
         var regions = [];
         for (var j=0; j < SQs.length; j++) {
            var sqStart = options.start;
            var length = SQs[j].end - sqStart;
            if ( length < options.binSize * options.binNumber) {
               regions.push(SQs[j])
            } else {
               for (var i=0; i < options.binNumber; i++) {   
                  
                  var regionStart = parseInt(sqStart + length/options.binNumber * i);
                  regions.push({
                     'name' : SQs[j].name,
                     'start' : regionStart,
                     'end' : regionStart + options.binSize
                  });
               }
            }
         }      
         
         var client = BinaryClient(me.iobio.bamstatsAlive);
         var regStr = JSON.stringify(regions.map(function(d) { return {start:d.start,end:d.end,chr:d.name};}));
         // var url = encodeURI( me.iobio.bamstatsAlive + '?cmd=-u 30000 -f 2000 -r \'' + regStr + '\' ' + encodeURIComponent(me._getBamRegionsUrl(regions)));
         var url = encodeURI( me.iobio.bamstatsAlive + '?cmd=-u 3000 -r \'' + regStr + '\' ' + encodeURIComponent(me._getBamRegionsUrl(regions)));
         var buffer = "";
         client.on('open', function(stream){
            var stream = client.createStream({event:'run', params : {'url':url}});
            stream.on('data', function(data, options) {
               if (data == undefined) return;
               var success = true;
               try {
                 var obj = JSON.parse(buffer + data)
               } catch(e) {
                 success = false;
                 buffer += data;
               }
               if(success) {
                 buffer = "";
                 callback(obj); 
               }               
            });
            stream.on('end', function() {
               if (options.onEnd != undefined)
                  options.onEnd();
            });
         });
      }
      
      if ( options.sequenceNames != undefined && options.sequenceNames.length == 1 && options.end != undefined) {
         goSampling([{name:options.sequenceNames[0], end:options.end}]);
      } else  if (options.sequenceNames != undefined && options.sequenceNames.length == 1){
         this.getHeader(function(header){
            var sq;
            $(header.sq).each( function(i,d) { 
               if(d.name == options.sequenceNames[0]) 
               sq = d; 
            })
            goSampling([sq]);
         });
      } else {
         this.getHeader(function(header){
            goSampling(header.sq); 
         });
         // this.getReferencesWithReads(function(refs) {            
         //    goSampling(refs);
         // })
      }
   }   
   
});