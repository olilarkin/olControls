// Initialisation ----------------------------
//-------------------------------------------
inlets = 1;
outlets = 3;

//outlet 1 = in mode 1 + 2 item number clicked, name, value
//outlet 2 = in mode 1 + 2 same when shift clicked 
//outlet 3 = in mode 0 dump selected items to coll on getselected()

setinletassist(0, "messages");
setoutletassist(0, "item clicked, name, value");
setoutletassist(1, "item clicked, name, value (shift)");
setoutletassist(2, "to coll");

var mode = 0; // 0 = select multiple items, 1 = single items can select none, 2 = single items allways one selected

autowatch = 1;

function elementobject(name, value, selected, parent)
{
	this.name = name;
	this.value = value;
	this.selected = selected;
	this.open = true;
	this.parent = parent; //reference to the parent object?
	this.ch = new Array(); //children
}

var root; // the root element
var cpar; // reference to the current parent object

initobjects();

// Constants ----------------------------
//-------------------------------------------
const OS = max.os;
const HYMIN = 2;

// Drawing Variables ----------------------------
//-------------------------------------------

var width, height, maxitems, hpos, offset, hymax; 
var textsize = 9;
var vrowsize = 11;
initdrawing();

var vdrawlines = true;
var dragging = false;
var prevclick = -1;
var autodraw = true;
var border = true;
var sbwidth = 10;
var showindex = 1;
var zerobased = 1;
var woffs = 1; // offset the text
var tfont = "Arial";
var bgoffset = 1;

var collcompat = false;
var autooutput = false;

// Colours ----------------------------
//------------------------------------------- 
var brgb = [0.8,0.8,0.8,1]; // background
var bdrgb = [0.64705882,0.64705882,0.64705882,1]; // frame
var nrgb = [1,0,0,1]; // item number
var lrgb = [0.75,0.75,0.75,1]; // lines
var trgb = [0,0,0,1]; // text 
var srgb = [0,0,0,1]; // scroll bar handle
var sbrgb = [0.70980392,0.70980392,0.70980392,1]; // scroll bar bg
var sirgb = [0.7,0.7,0.7,1.]; // selected item

if (OS == "windows")
{
	tfont = "Tahoma";
	trgb = [0.4,0.4,0.4,1,];
	bgoffset = 2;
}

declareattribute("brgb",null,"setbrgb",1); 
declareattribute("bdrgb",null,"setbdrgb",1); 
declareattribute("nrgb",null,null,1); 
declareattribute("lrgb",null,null,1); 
declareattribute("trgb",null,null,1);
declareattribute("srgb",null,null,1);
declareattribute("sbrgb",null,null,1);
declareattribute("sirgb",null,null,1);
declareattribute("sbwidth",null,"setsbwidth",1);
declareattribute("textsize",null,"settextsize",1);
declareattribute("mode",null,"setmode",1);
declareattribute("showindex",null,"setshowindex",1);
declareattribute("zerobased",null,"setzerobased",1);
declareattribute("autodraw",null,null,1);
declareattribute("tfont",null,null,1);

function setbrgb(r,g,b,a) 
{
	brgb = [r,g,b,a];
	mgraphics.redraw();
}

function setbdrgb(r,g,b,a) 
{
	bdrgb = [r,g,b,a];
	mgraphics.redraw();
}


declareattribute("collcompat",null,null,1); 
declareattribute("autooutput",null,null,1); 

mgraphics.redraw();

// Init functions  ----------------------------
//-------------------------------------------

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;


function initobjects()
{
	root = new elementobject("root", "undefined", false, "undefined");
	cpar = root; 
}

function initdrawing()
{
	width = box.rect[2]-box.rect[0];
	if (OS == "windows") width += 1;
	height = box.rect[3]-box.rect[1];
	maxitems = Math.floor(height / vrowsize); //the max number of elements to display at once.
	hpos = 2; // the position of the scrollbar
	offset = 0; // the offset of items if scrolled down
	hymax = (height-textsize)-2;
}

// Main functions  ----------------------------
//-------------------------------------------

function clear()
{
	initobjects();
	prevclick = -1;
	mgraphics.redraw();
}

// not working
function addparent(name)
{
	cpar.ch[cpar.ch.length] = new elementobject(name, "undefined", false, cpar);
	cpar = cpar.ch[cpar.ch.length-1];
	
	if(autodraw) mgraphics.redraw();
}
// not working
function closeparent()
{
	if(cpar != root) cpar = cpar.parent;
	else post("can't close the root element\n");
}

function addelement(name, value, selected) 
{
	if(selected === undefined) selected = false;
	cpar.ch[cpar.ch.length] = new elementobject(name, value, selected, cpar);
	
	if(autodraw) mgraphics.redraw();
//	notifyclients();
	prevclick = -1;
}
addelement.immediate = 1;

function checkall()
{
	for(i = 0; i < root.ch.length; i++)
	{
		root.ch[i].selected = 1;
	}
	
	prevclick = -1;
	mgraphics.redraw();
	notifyclients();
	if(autooutput) getselected();
}

function switchone(v)
{
	var a = root.ch[v]
	var state = a.selected;
	checknone();
	a.selected = !state;
	if(a.selected) outlet(0, v, root.ch[v].name,root.ch[v].value);
	else outlet(0,0)
	if(autooutput) getselected();
}

function checknone()
{
	for(i = 0; i < root.ch.length; i++)
	{
		root.ch[i].selected = 0;
	}
	
	prevclick = -1;
	mgraphics.redraw();
	notifyclients();
	if(autooutput) getselected();
}

function searchandcheck(name) // finds named item and sets it to selected
{
	for(i = 0; i < root.ch.length; i++)
	{
		if(root.ch[i].name == name)
		{
			root.ch[i].selected = true;
		}
	}	
	if(autooutput) getselected();
}
searchandcheck.immediate = 1;

function getselected() // returns selected items out 3rd outlet, coll compatible
{
	if(collcompat)
	{
		var a = 0;
		outlet(2,"clear");
		
		for(i = 0; i < root.ch.length; i++)
		{
			if(root.ch[i].selected)
			{
				if(mode == 0) 
				{	
					outlet(2,a++,root.ch[i].name,root.ch[i].value);
				}
				else outlet(2,i,root.ch[i].name,root.ch[i].value);
			}
		}	
	}
	else 
	{
		var selecteditems = "";
		
		for(i = 0; i < root.ch.length; i++)
		{
			if(root.ch[i].selected)
			{
				selecteditems += i;
				selecteditems += " ";
			}
		}
		outlet(2,selecteditems);
	}
}
getselected.immediate = 1;

function setselected()
{
	for(i=0;i<arguments.length;i++)
	{
		root.ch[arguments[i]].selected = true;
	}
	mgraphics.redraw();
}

function paint()
{
	var width = this.box.rect[2] - this.box.rect[0];
	var height = this.box.rect[3] - this.box.rect[1];

	with (mgraphics) 
	{
		bordersize = 1;
		// background
		set_source_rgba(brgb);
		rectangle(bordersize * 0.5, bordersize * 0.5, width - bordersize, height - bordersize);
		set_line_width(bordersize);
		fill_preserve();
		set_source_rgba(sbrgb);
		stroke();
		
		//draw grey lines
		if(vdrawlines)
		{
			set_source_rgba(lrgb);
			
			for(i = 1; i <= maxitems; i++)
			{
				var y = i*vrowsize;
				if(border) y +=1;
				move_to(0, y);
				line_to(width, y);
				stroke();
			}
			
		}
		//draw text items
		iterate(root);

		//draw scrollbar bg
		set_source_rgba(sbrgb);
		rectangle(width-sbwidth, 0, width, height);
		fill();

		//draw a thin line next to the scroll to hide the end of the text
// 		move_to(width-(sbwidth+1), height, 0);
// 		set_source_rgba(brgb);	
// 		line_to(width-(sbwidth+1), 0, 0);
// 		stroke();
		
		//draw scroll bar border
		move_to(width-sbwidth, height, 0);
		set_source_rgba(bdrgb);
		line_to(width-sbwidth, 0, 0);
		stroke();
		
		//draw handle;
		set_source_rgba(srgb);
		rectangle(width-(sbwidth-2), hpos, sbwidth-4, textsize);
		fill();
		
//  		if(border)
//  		{
//  			set_source_rgba(bdrgb);
//  			rectangle(0, height, 0, width, height, 0, width, 0, 0, 0, 0, 0);
// 			stroke();
//  		}
	}
	
}

function iterate(ary)
{	
	var len;
	if(ary.ch.length > maxitems) len =  maxitems;
	else len = ary.ch.length;
	
	for(i=0;i < len;i++)
	{
		var texty = i*vrowsize + vrowsize - 2;
		var textx = 3;//should change when multi level
		var j = i + offset;

		if (ary.ch[j].selected)
		{
			mgraphics.set_source_rgba(sirgb);
			y1 = (texty + bgoffset - vrowsize + 2);
			mgraphics.rectangle(0, y1, width, vrowsize-1);
			mgraphics.fill();
		}
		
		with (mgraphics) 
		{
			select_font_face(tfont);
			set_font_size(textsize);
			move_to(textx, texty + woffs);	
			set_source_rgba(nrgb);
			
			if(showindex)
			{	
				var ind = j
				var t;
				
				if(ary.ch.length > 100)
				{
					if(!zerobased) 
					{
						ind += 1;
						if(j < 9) t = "00";
						else if(j < 99) t = "0";
						else t = "";
					}
					else
					{
						if(j < 10) t = "00";
						else if(j < 100) t = "0";
						else t = "";	
					}
					
					text_path(t + "" + ind);
					fill();
					var offs = text_measure("002")[0] + 2;
					move_to(textx+offs, texty + woffs);
				}
				else
				{
					if(!zerobased) 
					{
						ind += 1;
						if(j < 9) t = "0";
						else t = "";
					}
					else
					{
						if(j < 10) t = "0";
						else t = "";	
					}
					
					text_path(t + "" + ind);
					fill();
					var offs = text_measure("02")[0] + 2;
					move_to(textx+offs, texty + woffs);
				}
			}
			set_source_rgba(trgb);			
			text_path(ary.ch[j].name);	
			fill();
		}
	}
}

// Mouse ----------------------------
//-------------------------------------------
function onclick(x,y,but,mod1,shift,capslock,option,ctrl)
{
	if (x > width-sbwidth) 
	{
		dragging = true;
		ondrag(x, y);
	}
	else if(x < width-sbwidth && y > 0) 
	{
		dragging = false;
		var whichclick = Math.floor(((y - 1) / vrowsize) + offset);

	//needs to be updated for multiple levels
		if (root.ch.length > 0 && whichclick < root.ch.length) 
		{
			if(mode == 0)
			{	
				if(shift && prevclick > -1)
				{
					if(prevclick < whichclick)
					{
						for(i=prevclick;i<=whichclick;i++)
						{
							root.ch[i].selected = 1;
						}
					}
					else if(whichclick < prevclick)
					{
						for(i=whichclick;i<=prevclick;i++)
						{
							root.ch[i].selected = 1;
						}
					}
				}
				else root.ch[whichclick].selected = !root.ch[whichclick].selected;
				
				prevclick = whichclick;
			}
			else
			{
				var a = root.ch[whichclick];
				
				if(shift) 
				{
					checknone();
					a.selected = 1;
					outlet(1, whichclick, a.name,a.value)
				}
				else
				{
					var state = a.selected;
					checknone();
					if(mode == 1) a.selected = !state;
					else a.selected = 1;
					
					if(a.selected) outlet(0, whichclick, a.name,a.value);
					else outlet(0,-1);
				}
			}
	}
		notifyclients();
		if(autooutput) getselected();
	}

	mgraphics.redraw();
}
onclick.local = 1; 

function ondrag(x,y,button,cmd,shift,capslock,option,ctrl)
{
	if (dragging) 
	{	
		if (y < HYMIN) hpos = HYMIN;
		if (y > hymax) hpos = hymax;
		else if (y >= HYMIN && y <= hymax) hpos = y;
	
		if (root.ch.length > maxitems)
		{
			offset = Math.round(((hpos-2) / hymax) * (root.ch.length - maxitems));
		}
	
	}
	
	mgraphics.redraw();
}
ondrag.local = 1;

function scroll(v)
{
	if(v)
	{
		if(offest < (root.ch.length - maxitems)) 
		{
			offset += 1;
		}
	}
	else if (offset > 0);
	{
		offset -= 1;
	}
	mgraphics.redraw();
}



// Getters and setters ----------------------------
//-------------------------------------------

function settextsize(v)
{
	textsize = Math.floor(Math.abs(v));
	vrowsize = textsize + 2;
	initdrawing();
	mgraphics.redraw();
}


function setsbwidth(v)
{
	sbwidth = v;
	mgraphics.redraw();
}

function setmode(v)
{
	mode = v;
	checknone();
	mgraphics.redraw();
}

function setshowindex(v)
{
	if(v == 0 || v == 1)
	{
		showindex = v;
		mgraphics.redraw();
	}
}

function setzerobased(v)
{
	if(v == 0 || v == 1)
	{
		zerobased = v;
		mgraphics.redraw();
	}
}

function onresize(w,h)
{
	box.size(w, h);
	initdrawing();
	mgraphics.redraw();
}
onresize.local = 1; //private

