
$(document).ready(function () {

	$('#get-articles').click(function(){
		
    	$.ajax({ 
	        type: 'GET', 
	        url: '/articles', 
	        dataType: 'json', 
	        success: function (data) { 

    			var json = JSON.stringify(data);
    			var json_parsed = $.parseJSON(json);
    			
    			var article = "";
    			for (key in json_parsed){
    				article += '<strong>' + json_parsed[key].title + '</strong>' + '\n'
    				+ json_parsed[key].published_date + '\n'
    				+ json_parsed[key].abstract + '\n'
    				+ json_parsed[key].short_url + '\n'
    				+ '<p/>';
    				
    			}

    			$('#show-data').html('<pre>' + article + '</pre>');

	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});


	$('#get-authors').click(function(){
		
    	$.ajax({ 
	        type: 'GET', 
	        url: '/authors', 
	        contentType: "application/json; charset=utf-8",
	        dataType: 'json', 
	        success: function (data) { 


	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);

    			var authors = "";
    			for (key in json_parsed){
    				authors += json_parsed[key].byline.replace('By ', '') + '\n';
    				
    			}

    			$('#show-data').html('<pre>' + authors + '</pre>');
	        	
	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	$('#get-urls').click(function(){
		
    	$.ajax({ 
	        type: 'GET', 
	        url: '/urls', 
	        dataType: 'json', 
	        success: function (data) { 


	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);
    			
    			var data = "";

    			//print the published_date and all its short urls
    			for (key in json_parsed){
    				data += '<p/>' + json_parsed[key].published_date + '\n';
    				for (val in json_parsed[key].short_url){
    					
    					data+='\t<a href=' + json_parsed[key].short_url[val] + '> '
    						 + json_parsed[key].short_url[val] + ' </a>\n';
    				}
    			}
    		
    			$('#show-data').html('<pre>' + data + '</pre>');
	        	
	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	$('#get-tags').click(function(){
		
    	$.ajax({ 
	        type: 'GET', 
	        url: '/tags', 
	        dataType: 'json', 
	        success: function (data) { 

	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);

    			var tags = {};
    			for (key in json_parsed){
    				
    				for (val in json_parsed[key].des_facet){

    					var tag = json_parsed[key].des_facet[val];
    					//keep track of occurences of each tag 
    					if (tag in tags){
    						tags[tag] += 1;
    					}
    					else{
    						tags[tag] = 1;
    					}
    				}
    				
    			}
    			//change tag font size based on occurences of tag
    			var tagcloud = '';
    			var count = 0;
    			for (key in tags){
    				count++;

    				if (tags[key] >= 5){
    					tagcloud+= '<t5>' + key + '</t5> ';
    				}
    				else{
    					tagcloud+= '<t' + tags[key] +'>' + key + '</t' + tags[key] + '> ';
    				}
    				if (count%5==0){
    					tagcloud+='\n';
    				}
    			
    			}
    			$('#show-data').html('<pre>' + tagcloud + '</pre>');

	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	$('#get-details').click(function(){

		var index = 2;
		
    	$.ajax({ 
	        type: 'GET', 
	        url: '/details/' + index, 
	        dataType: 'json', 
	        success: function (data) { 


	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);

    			var details = '';

    			for (key in json_parsed){
    				
    				var len = json_parsed[key].details.length;

    				//first print all details except tags, then loop through tags
    				//to print tags on separate lines
    				for (var i=0; i<len-1; i++)
    					details+= json_parsed[key].details[i] +'\n';
    				
    				for (tag in json_parsed[key].details[len-1]){
    					details+= json_parsed[key].details[len-1][tag] + '\n';
    				}
    				
    			}
    			$('#show-data').html('<pre>' + details + '</pre>');

	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	$('#get-images').click(function(){

    	$.ajax({ 
	        type: 'GET', 
	        url: '/images', 
	        dataType: 'json', 
	        success: function (data) { 


	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);

    			var imgs = '';

    			for (key in json_parsed){
    				//link with placeholder title if no thumbnail
    				if (json_parsed[key].img_url==''){
    					imgs+= '<a href=' + json_parsed[key].url + '>'
    						+ json_parsed[key].title + '</a>' + '\n';
    				}
    				else{
    					imgs+=('<a href=' + json_parsed[key].url + '>'
    						+ '<img src=' + json_parsed[key].img_url + ' width=75 height=75' 
    						+ 'alt="' + json_parsed[key].caption + '">'
    						+ '</a>\n');
    				}

    			}
    			$('#show-data').html('<pre>' + imgs + '</pre>');

	        	
	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	$('#get-date').click(function(){

    	$.ajax({ 
	        type: 'GET', 
	        url: '/date/2016-06-21', 
	        dataType: 'json', 
	        success: function (data) { 


	        	var json = JSON.stringify(data);
    			var json_parsed = JSON.parse(json);

    			var article = "";
    			for (key in json_parsed){
    				article += '<strong>' + json_parsed[key].title + '</strong>' + '\n'
    				+ json_parsed[key].published_date + '\n'
    				+ '<p/>';

    			}
    			
    			$('#show-data').html('<pre>' + article + '</pre>');

    			console.log(json_parsed);

	        },
	        error: function (jqXHR, textStatus){
	        	alert(textStatus + ' ');
	        }
	    });
	});

	
});
