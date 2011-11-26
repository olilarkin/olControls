/* ol.pngknob.js - a javascript to load a png stitched knob image
v2.0

http://www.olilarkin.co.uk	

*/


// Initialisation ----------------------------
//-------------------------------------------
inlets = 1;
outlets = 1;

autowatch = 0;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

var imagefile = ""; // path of image or filename
var img = new Image(); // create a new Image
var frames; // number of frames in the stitched image
var frameHeight = img.size[1]/frames;
var yoffset = 0; // the y offset for the current frame
//var brgb = [1.,1.,1.,1.];
//var frgb = [0.,0.,0.,0.];
var pos = 0; // 0-1 for position of knob
var last_x = 0;
var last_y = 0;
var vmin = 0.;
var vmax = 1.;
var vreset = 0.;
var readout = 0;
var dp = 2;
var type = 1; //0 = int, 1 = float
var dispval = vreset;
var val = vreset; // the value that is input/output/displayed
var font = "Arial";
var fontsize = 10;
var width, height;

//declareattribute("brgb", null, "setbrgb", 1); 
//declareattribute("frgb", null, "setfrgb", 1); 
declareattribute("readout", null, "setreadout", 1);
declareattribute("type", null, "settype", 1);
declareattribute("font",null,"setfont",1);
declareattribute("fontsize",null,"setfontsize",1);
declareattribute("vreset",null,null,1);
declareattribute("vmin",null,null,1);
declareattribute("vmax",null,null,1);

//declareattribute("font",null,null,1);
frames = jsarguments[2];
loadImage(jsarguments[1]);

set(vreset);

function paint()
{	
	if(type) //if float
	{
		dispval = val.toFixed(dp); 
	}
	else // if int
	{
		dispval = val.toFixed(0); 
		if (val > -0.5 && val < 0.) dispval = 0.; // avoid -0
	}	

	var str = "" + dispval + "";

	with(mgraphics)
	{
		
		if(readout)
		{
			select_font_face(font);
			set_font_size(fontsize);
			//set_source_rgba(frgb);			
			move_to((img.size[0]/2) - text_measure(str)[0] / 2 ,frameHeight+text_measure(str)[1]);
			text_path(str);
			fill();
		}

		//save();
		image_surface_draw(img, [0, yoffset,img.size[0],frameHeight], [0, 0,img.size[0],frameHeight] );
		//restore();
	}		

}

function loadImage(s)
{
	imagefile = s;
	img.freepeer();
	img = new Image(s);
	frameHeight = img.size[1]/frames;
	
	//post("" + s + "," + img.size[1] + "," + frames + " ");
	
	if(img.size[1]/frameHeight != frames) post("check number of frames");
	else onresize();
}

function msg_float(v)
{
	val = Math.min(Math.max(vmin,v),vmax);

	pos = (val - vmin) / (vmax - vmin);
	
	var frame = Math.floor(pos*(frames-1));
	
	yoffset = Math.floor(frameHeight*frame);
	
	if(frame>frames/2) yoffset = yoffset;
	
	notifyclients();
	bang();
}

function set(v)
{
	val = Math.min(Math.max(vmin,v),vmax);
 
	pos = (val - vmin) / (vmax - vmin);

	var frame = Math.floor(pos*(frames-1));
	
	yoffset = Math.floor(frameHeight*frame);
	if(frame>frames/2) yoffset = yoffset;
	
	notifyclients();
	mgraphics.redraw();
}

function bang()
{
	mgraphics.redraw();
	outlet(0,val);
}

function notifydeleted()
{
	img.freepeer();
}
notifydeleted.setlocal = 1;

// function setbrgb(r,g,b,a) 
// {
// 	brgb = [r,g,b,a];
// 	mgraphics.redraw();
// }
// setbrgb.local = 1;

// function setfrgb(r,g,b,a) 
// {
// 	frgb = [r,g,b,a];
// 	mgraphics.redraw();
// }
// setfrgb.local = 1;

function settype(v)
{
	type = v;
	mgraphics.redraw();
}

function setreadout(v)
{
	readout = v;
	onresize();
}

function setfontsize(v)
{
	if(v > 5)
	{
		fontsize = v;
	}
	else fontsize = 5;
		
	onresize();
}

function setfont(v)
{
	font = v;
	onresize();
}

function setdp(v)
{
	dp = v;
	mgraphics.redraw();
}

function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
	var f,dy;

	dy = y - last_y;
	if (shift) { 
		f = pos - dy*0.001; 
	} else {
		f = pos - dy*0.01;
	}
	msg_float(f * (vmax - vmin) + vmin); 
	last_x = x;
	last_y = y;
}
ondrag.local = 1; 

function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	last_x = x;
	last_y = y;
}
onclick.local = 1; 

function ondblclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
	last_x = x;
	last_y = y;
	msg_float(vreset); // reset dial?
}
ondblclick.local = 1;

function onresize()
{
	if(readout) box.size(img.size[0],frameHeight + (fontsize * 2));
	else box.size(img.size[0],frameHeight);
	
	width = box.rect[2]-box.rect[0];
	height = box.rect[3]-box.rect[1];
	
	mgraphics.redraw();
}
onresize.local = 1; //private