function inlineIframe(node,video) {
    var attr = {
	      width: '560',
	      height: '315',
	      class: 'generated'
        }

    var attr_key;
	var iframe = document.createElement('iframe');
    iframe.setAttribute('src',video);
    for (attr_key in attr) {
      var attrib = attr[attr_key];
      iframe.setAttribute(attr_key,attrib);
    }

    node.parentNode.replaceChild(iframe, node);
}

function inlineImg(node) {
	var img = document.createElement("img");
	img.src = node.href;
	img.setAttribute("txt", node.innerHTML);
	img.setAttribute("class", "inlineImg generated");
	img.onclick = function() { revertLink(img); return false; };
	node.parentNode.replaceChild(img, node);
	
}

function inlineCloudapp(node, link) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open( "GET", "http://cl.ly/"+link, false );
	xmlHttp.send( null );
	var response = xmlHttp.responseText;
	var imgHref = response.split(' class="embed" href="')[1].split('">Direct link</a>')[0];
	node.href = imgHref;
	inlineImg(node);
}

function inlineVideo(node)
{
	var vwrap = document.createElement("div");
	vwrap.setAttribute("class", "inlineVideo generated");
	vwrap.setAttribute("src", node.href);
	vwrap.setAttribute("txt", node.innerHTML);

	var vid = document.createElement("video");
	vid.setAttribute("controls", "controls");
	vid.setAttribute("autoplay", "autoplay");
	vid.width = window.innerWidth * 0.8;
	vid.src = node.href;
	vwrap.appendChild(vid);
	vwrap.appendChild(document.createElement("br"));

	var close = document.createElement("a");
	close.href = "#";
	close.innerHTML = "(Close)";
	close.onclick = function() { revertVideo(vwrap); return false; };
	vwrap.appendChild(close);
	
	node.parentNode.replaceChild(vwrap, node);
}

function doMagicLinks()
{
	var anchors = document.getElementById("Chat").getElementsByTagName("a");
	for(var i = 0; i < anchors.length; i++)
	{
		var anchor = anchors.item(i);			
        var video_matches = 
          { youtube:
            { regex: /youtube.com\/.*(?:\?|.*&)v=([^&]+)/,
	          embed: 'http://www.youtube.com/embed/',
		      func: function(node, video) { inlineIframe(node, this.embed+video) },
            },
            youtubeshort: 
            { regex: /youtu.be\/(.+)$/,
              embed: 'http://www.youtube.com/embed/',
              func: function(node, video) { inlineIframe(node, this.embed+video) },
            },
            vimeo:
            { regex: /vimeo.com\/([0-9]+)/,
              embed: 'http://player.vimeo.com/video/',
              func: function(node, video) { inlineIframe(node, this.embed+video) },
            },
            cloudapp:
			{ regex: /cl.ly\/(.+)/,
			  func: function(node, link) { inlineCloudapp(node, link) }
		    },
		    video: 
		    { regex: /\.mov/ig,
			  func: function(node, unused) { inlineVideo(node) } 
		    },
		    image:
		    { regex: /\.(png|jpg|jpeg|gif)$/ig,
			  func: function(node, unused) { inlineImg(node) }
			}
          }

		var video_key, match, attr_key;
        
        for (video_key in video_matches) {
          var video_source = video_matches[video_key];
          if (match = video_source.regex.exec(anchor.href)) {
            video_source.func(anchor, match[1]);
          }
        }
		
	}
}

function revertLink(node)
{
	var a = document.createElement("a");
	a.href = node.src;
	a.innerHTML = node.getAttribute("txt");
	node.parentNode.replaceChild(a, node);
	a.onclick = function() { if(window.event.shiftKey) return true; inlineImg(a); return false; };
}

function revertVideo(node)
{
	var a = document.createElement("a");
	a.href = node.getAttribute("src");
	a.innerHTML = node.getAttribute("txt");
	node.parentNode.replaceChild(a, node);
	a.onclick = function() { if(window.event.shiftKey) return true; inlineVideo(a); return false; };
}

var aM = appendMessage;
var aNM = appendNextMessage;

appendMessage = function(html)
{
	aM(html);
	setTimeout(function() { doMagicLinks(); }, 100);
}

appendNextMessage = function(html)
{
	aNM(html);
	setTimeout(function() { doMagicLinks(); }, 100);
}
setTimeout(function() { doMagicLinks(); }, 500);
