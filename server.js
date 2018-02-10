

var http = require("http"),
	fs = require('fs'),
	url = require("url"),
    path = require("path"),

	port = 8080;

var fileReq = '';
var jsonFile = '/nytimes.json';

http.createServer(function(request, response){
	var filePath = request.url;

	//use regular expressions to match specific index for /details or specific date for /date
	var match = filePath.match(/details\/(\d+)/);
	var date_match = filePath.match(/(\d{4})-(\d{2})-(\d{2})/) || filePath.match(/(\d{4})-(\d{2})/)
	|| filePath.match(/(\d{4})/);
	
	//set the appropriate file request and filepath
	//all ajax requests have the filePath pointing to nytimes.json
	if (match){
		var index = match[1];
		fileReq = '/details/' + index;
		filePath = jsonFile;
	}

	if (date_match){
		var dateReq = date_match[0];
		fileReq = '/date/' + dateReq;
		filePath = jsonFile;
	}

	if (filePath == '/articles' || filePath == '/authors' ||
		filePath == '/urls' || filePath == '/tags' || filePath == '/images' ||  filePath == '/details'
		|| filePath == '/date'){
		
		fileReq = filePath;
		filePath = jsonFile;
	}

	//home page is index.html
	if (filePath == '/'){
		filePath = '/index.html';
	}


	filePath = __dirname + filePath;

	var extname = path.extname(filePath);
	var contentType = 'text/html';

	switch (extname) {
    case '.js':
        contentType = 'text/javascript';
        break;
    case '.css':
        contentType = 'text/css';
        break;
    case '.json':
    	contentType = 'application/json; charset=utf-8';
    	break;
	}

	fs.stat(filePath, function(err, stats){
		 if (err){
		 	//if filePath not found, write appropriate error msg to client
		 	if (err.code === 'ENOENT' ) {
			      response.writeHead(404, {'Content-Type': 'text/plain'});
			      response.write('404 No such URL: ' + filePath);
			      response.end();
		      return;
		    }

		    // other error
		    console.error(err);
		    return;
		 }
		 else {
		 	
	        fs.readFile(filePath, function(error, data) {
	            if (error) {
	               console.log(error);
	            }
	            else {

	            	//readFile is successful
	            	response.writeHead(200, { 'Content-Type': contentType });

	            	//on ajax request, parse the JSON from the jsonFile and extract specific parts,
	            	//add these to an array to prepare for sending back to client
	            	if (fileReq=='/articles'){

	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    					var item = json_parsed[results].results[res];
		    					
		    					//create new JSON to add to arr
		    					var articles = new Object();
		    					articles.published_date = item.published_date;
		    					articles.title = item.title;
		    					articles.abstract = item.abstract;
		    					articles.short_url = item.short_url; 
		    					
		    					arr.push(articles);
		    				
		    				}
		    			}
		    			//format the data before sending back to client
		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq=='/authors'){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    				
		    					var byline = json_parsed[results].results[res].byline;
		    					var substr1 = ' And ';
		    					var substr2 = ' De La ';

		 						//convert names to camel case but leave 'and' and 'de la' lowercase
		    					var capitalize = byline.toString().replace(/\w\S*/g, function(txt){
		    						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		    						
		    					capitalize = capitalize.replace(substr1, substr1.toLowerCase());
		    					capitalize = capitalize.replace(substr2, substr2.toLowerCase());

		    					var authors = new Object();
		    					authors.byline = capitalize;
		    					
		    					arr.push(authors);
 
		    				}
		    			}
		    	
		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq=='/urls'){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

						var map = {};

		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    					var item = json_parsed[results].results[res];

				    			var key = new Date(item.published_date);
				    			
				    			//add short_urls to unique key published_date in map	
		    					if (key in map)
		    						map[key].push(item.short_url);
		    					else
		    						map[key] = [item.short_url];

		    				}
		    			}
		    			//create a new map object for the api
		    			for (key in map){
		    				var map_obj = new Object();
		    				map_obj.published_date = key;
		    				for (val in map[key])
		    					map_obj.short_url = map[key];
		    				arr.push(map_obj);
		    			}

		    			//sort by date, latest date first
		    			arr = arr.sort(function(a, b){
						    var keyA = new Date(a.published_date),
						        keyB = new Date(b.published_date);
						    // Compare the 2 dates
						    if(keyA < keyB) return 1;
						    if(keyA > keyB) return -1;
						    return 0;
						});

		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq=='/tags'){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    				
		    					var item = json_parsed[results].results[res];
		    					var tags = new Object();
		    					tags.des_facet = item.des_facet;
		    					//tags.des_facet.count = 0;
		    					arr.push(tags);
		    					
		    				}
		    			}
		    			console.log(arr);

		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq== '/details/' + index){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

	            		var details_list = [];
		    			for (results in json_parsed){
		    				
		    					var item = json_parsed[results].results[index];

		    					//create an object if article at specified index exists
		    					if (item){

			    					var details_obj = new Object();
			    					details_obj.index = index;
			    					details_list.push(item.section);
			    					details_list.push(item.subsection);
			    					details_list.push(item.title);
			    					details_list.push(item.abstract);
			    					details_list.push(item.byline);
			    					details_list.push(item.published_date);
			    					details_list.push(item.des_facet);
			    					details_obj.details = details_list;
			    		
			    					arr.push(details_obj);

		    				}
		    					
		    			}

		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq== '/details'){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

	            		var details_list = [];
		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    					var item = json_parsed[results].results[res];
		    					
		    					var details_obj = new Object();
		    					details_obj.index = res;
		    					details_list.push(item.section);
		    					details_list.push(item.subsection);
		    					details_list.push(item.title);
		    					details_list.push(item.abstract);
		    					details_list.push(item.byline);
		    					details_list.push(item.published_date);
		    					details_list.push(item.des_facet);
		    					details_obj.details = details_list;

		    				}
		    				arr.push(details_obj);
		    				
		    			}

		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq== '/images'){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

	            		
		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    					var item = json_parsed[results].results[res];
		    					var img = new Object();
		    					img.title = item.title;
		    					
		    					img.url = item.url;
		    					
		    					for (i in item.multimedia){

		    						//want to find smallest image representation
		    						if (item.multimedia[i].format.indexOf('Standard Thumbnail')>-1){
		    							img.img_url = item.multimedia[i].url;
		    							img.caption = item.multimedia[i].caption;
		    						}
		    						else{
		    							if (!img.img_url){
		    								if (item.multimedia[i].format.indexOf('thumbLarge')>-1){
		    									img.img_url = item.multimedia[i].url;
		    									img.caption = item.multimedia[i].caption;
		    								}
		    								if (!img.img_url){
		    									if (item.multimedia[i].format.indexOf('Normal')>-1){
			    									img.img_url = item.multimedia[i].url;
			    									img.caption = item.multimedia[i].caption;
			    								}
			    								if (!img.img_url){
		    										if (item.multimedia[i].format.indexOf('mediumThreeByTwo210')>-1){
			    										img.img_url = item.multimedia[i].url;
			    										img.caption = item.multimedia[i].caption;
			    									}
			    									if (!img.img_url){
		    											if (item.multimedia[i].format.indexOf('superJumbo')>-1){
			    											img.img_url = item.multimedia[i].url;
			    											img.caption = item.multimedia[i].caption;
			    										}

		    										}
			    								
		    									}
		    								}
		    							}
		    							
		    						}
		    						
		    					}
		    					//if thumbnail or caption doesn't exist, set fields to empty strings
		    					if (!(img.img_url || img.caption) ){
		    						img.img_url = '';
		    						img.caption = '';
		    					}
		    				
		    					arr.push(img);
		    				}	
		    				
		    			}

		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);

	            	}

	            	if (fileReq== '/date/' + dateReq){
	            		
	            		var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

	            		
		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    					
		    					var item = json_parsed[results].results[res];
		    					
		    					if (item.published_date.indexOf(dateReq)>-1){
		    						var articles = new Object();
		    						articles.published_date = item.published_date;
		    						articles.title = item.title;
		    						arr.push(articles);
		    						
		    					}
	               				 
		    				}
		    			}
		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);
		    		}

		    		if (fileReq == '/date'){
		    			var arr = [];
	            		var json_parsed = JSON.parse(data.toString('utf8').trim()); 

	            		
		    			for (results in json_parsed){
		    				for (var res=0; res < json_parsed[results].results.length; res++){
		    				
		    					var item = json_parsed[results].results[res];
		    				
	    						var articles = new Object();
	    						articles.published_date = item.published_date;
	    						articles.title = item.title;
	    						arr.push(articles);
	               				 
		    				}
		    			}
		    			data = JSON.stringify(arr, null, 2);
		    			console.log(data);
		    		}
	            	                
	                
	                response.write(data);
	                response.end(); 
	                //clear the fileReq after ajax call so that other files can be properly loaded
	                fileReq = '';
	                                 
	            }
	        });

	    }
	});
}).listen(port);

// Console will print the message on server startup
console.log('Server listening on http://127.0.0.1:%s', port);