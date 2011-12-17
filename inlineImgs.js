function doMagicLinks()
{
	var anchors = document.getElementById("Chat").getElementsByTagName("a");
	for(var i = 0; i < anchors.length; i++)
	{
		var anchor = anchors.item(i);
		
		// Match images
		if(anchor.href.match(/\.(png|jpg|jpeg|gif)$/ig))
			inlineImg(anchor);
			
		if( anchor.href.match(/cl.ly/)){
			var xmlHttp = new XMLHttpRequest();
		    xmlHttp.open( "GET", anchor.href, false );
		    xmlHttp.send( null );
		    var response = xmlHttp.responseText;
			var imgHref = response.split(' class="embed" href="')[1].split('">Direct link</a>')[0];
			anchor.href = imgHref;
			inlineImg(anchor);
		}
		
		// youtube
		if( anchor.href.match(/youtube.com/)){			
			var video = anchor.href.split("v=")[1];
			if(video.indexOf("&") != -1){
					video = video.split("&")[0]
			}
			var iframe = document.createElement("iframe");
			iframe.setAttribute("src", "http://www.youtube.com/embed/" + video);
			iframe.setAttribute("width", "560");
			iframe.setAttribute("height", "315");
			iframe.setAttribute("class", "generated");
			anchor.parentNode.replaceChild(iframe, anchor);
		}
		
		// Match videos
		else if(anchor.href.match(/\.(mov)$/ig))
			inlineVideo(anchor);
	}
}

function getImgF(aElm)
{
	return function() { if(window.event.shiftKey) return true; inlineImg(aElm); return false; };
}

function inlineImg(node)
{
	var img = document.createElement("img");
	img.src = node.href;
	img.setAttribute("txt", node.innerHTML);
	img.setAttribute("class", "inlineImg generated");
	node.parentNode.replaceChild(img, node);
	img.onclick = function() { revertLink(img); return false; };
}

function revertLink(node)
{
	var a = document.createElement("a");
	a.href = node.src;
	a.innerHTML = node.getAttribute("txt");
	node.parentNode.replaceChild(a, node);
	a.onclick = function() { if(window.event.shiftKey) return true; inlineImg(a); return false; };
}

function getVideoF(aElm)
{
	return function() { if(window.event.shiftKey) return true; inlineVideo(aElm); return false; };
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