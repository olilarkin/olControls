inlets = 1;
outlets = 1;

autowatch = 1;

var gWidth = this.box.rect[2] - this.box.rect[0];
var gHeight = this.box.rect[3] - this.box.rect[1];

const kModeEdit = 0;
const kModePlay = 1;
const kNumModes = 2;

const gBallDiameter = 10;
const gBallRadius = 5;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

mgraphics.redraw();

function bpObj(x, y)
{
  this.x = x; 
  this.y = y;
}

var gMode = kModeEdit;
var gDragging = -1;
var gHit = -1;

var frgb = [1, 0., 0., 1.];
declareattribute("frgb", null, null, 1); 

var grgb = [0., 0., 0., 0.2];
declareattribute("grgb", null, null, 1); 

var linewidth = 1;
declareattribute("linewidth", null, null, 1);

var n_horiz_segments = 3;
declareattribute("n_horiz_segments", null, null, 1);

var n_vert_segments = 3;
declareattribute("n_vert_segments", null, null, 1);

var gCursor = new bpObj(0.5,0.5);

var gData = new Array();

function clear()
{
  gData = new Array();
  notifyclients();
  mgraphics.redraw();
}

function mode(v)
{
  if(v >= kModeEdit && v < kNumModes)
  {
    gMode = v;
    mgraphics.redraw();
  }
}

function clip(input, outputMin, outputMax)
{
  if(input < outputMin) return outputMin;
  if(input > outputMax) return outputMax;

  return input;
}

function linearMap(input, inputMin, inputMax, outputMin, outputMax)
{
  var inputSpan = inputMax - inputMin;
  var outputSpan = outputMax - outputMin;

  var inputScaled = input - (inputMin / inputSpan);

  return outputMin + (inputScaled * outputSpan);
}

function msg_float(v)
{
  var trunc = Math.floor(v);
  var frac = v - trunc;
  
  if(trunc >= 0 && trunc < gData.length-1)
  {
    var x = linearMap(frac, 0., 1., gData[trunc].x, gData[trunc+1].x);
    var y = linearMap(frac, 0., 1., gData[trunc].y, gData[trunc+1].y);

    gCursor.x = x;
    gCursor.y = y;
    outlet(0, x, y);
    
    mgraphics.redraw();
  }

  mgraphics.redraw();
}

function msg_int(v)
{
  if(v >= 0 && v < gData.length)
  {
    gCursor.x = gData[v].x;
    gCursor.y = gData[v].y;
    outlet(0, gData[v].x, gData[v].y);
    mgraphics.redraw();
  }
}

function draw_grid()
{
  with (mgraphics) 
  {
    set_line_width(1);
    set_source_rgba(grgb);

    if(n_horiz_segments)
    {
      var xstep = gWidth / n_horiz_segments;
      
      for(i = 1; i < n_horiz_segments; i++)
      {
        move_to(i * xstep, 0);
        line_to(i * xstep, gHeight);
      }
      
      stroke();
    }
    
    if(n_vert_segments)
    {
      var ystep = gHeight / n_vert_segments;
      
      for(i = 1; i < n_vert_segments; i++)
      {
        move_to(0, i * ystep);
        line_to(gWidth, i * ystep);
      }
      
      stroke();
    }
  }
}

function paint()
{
  draw_grid();

  with (mgraphics) 
  {
    if (gData.length)
    {
      set_line_width(linewidth);
      set_source_rgba(frgb);
  
      var x = gData[0].x * gWidth;
      var y = gData[0].y * gHeight;
  
      for(i = 1; i < gData.length; i++)
      {
        var newx = gData[i].x * gWidth;
        var newy = gData[i].y * gHeight;
  
        move_to(x, y);
        line_to(newx, newy);
        stroke();
  
        x = newx;
        y = newy;
      }
      
      for(i = 0; i < gData.length; i++)
      {
        x = gData[i].x * gWidth - gBallRadius;
        y = gData[i].y * gHeight - gBallRadius;
        ellipse(x, y, gBallDiameter, gBallDiameter);
        fill();
      }
    }
    //draw cursor
    
    set_line_width(4);
    
    var alpha = 1.;
    
    if(gMode == kModeEdit)
    {
      alpha = 0.3;
    }
    
    set_source_rgba(0.,0.,0.,alpha);
    
    move_to(gCursor.x * gWidth, (gCursor.y * gHeight) - 10);
    line_to(gCursor.x * gWidth, (gCursor.y * gHeight) + 10);
    move_to((gCursor.x * gWidth) - 10, gCursor.y * gHeight);
    line_to((gCursor.x * gWidth) + 10, gCursor.y * gHeight);
    stroke();
  }
}

function ondrag(x,y,but,cmd,shift,capslock,option,ctrl)
{
  x = clip(x / gWidth, 0., 1.);
  y = clip(y / gHeight, 0., 1.);
  
  if(but)
  {
    if(gMode == kModePlay)
    {
      gCursor.x = x;
      gCursor.y = y;
      outlet(0, x, y);
    }
    
    if(gMode == kModeEdit && gDragging > -1)
    {
      gData[gDragging].x = x;
      gData[gDragging].y = y;
      notifyclients();
    }
  }
  else
  {
    gHit = -1;
    gDragging = -1;
  }
  
  mgraphics.redraw();
}
ondrag.local = 1; 

function onclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
  if(but)
  {
    if(gMode == kModeEdit)
    {
      if(shift)
      {
        if(gHit > -1)
        {
          gData.splice(gHit-1,1);
        }
        else
        {
          x = clip(x / gWidth, 0., 1.);
          y = clip(y / gHeight, 0., 1.);
          gData[gData.length] = new bpObj(x,y);
        }
        notifyclients();
        mgraphics.redraw();
      }
      
      if(gHit > -1)
      {
        gDragging = gHit -1;
      }
      else
      {
        gDragging = -1;
      }
    }
  }
  else
  {
    gHit = -1;
    gDragging = -1;
  }
    
}
onclick.local = 1; 

function ondblclick(x,y,but,cmd,shift,capslock,option,ctrl)
{
}
ondblclick.local = 1;

function onidle(x,y,but,cmd,shift,capslock,option,ctrl)
{
  if(gDragging == -1)
  {
    gHit = hittest(x, y);
  }
}
onidle.local = 1;

function onidleout(x,y,but,cmd,shift,capslock,option,ctrl)
{
  gHit = -1;
  gDragging = -1;
}
onidleout.local = 1;

function hittest(x, y)
{
  var hit = -1;
  
  for(i = 0; i < gData.length; i++)
  {
    var a = (gData[i].x * gWidth) - x;    //x dist
    var b = (gData[i].y * gHeight) - y;   //y dist
    
    if(a == 0) a = 0.0001;  // to prevent nan
    if(b == 0) b = 0.0001;
    var dist = Math.sqrt(a*a+b*b); // distance from mouse
    
    if(dist < gBallDiameter)
    {
      hit = i+1;
      break;
    }
  }
  return hit;
}
hittest.local = 1;

function onresize()
{
	gWidth = box.rect[2]-box.rect[0];
	gHeight = box.rect[3]-box.rect[1];
	
	mgraphics.redraw();
}
onresize.local = 1; //private

function getvalueof()
{
  var data = new Array();
  var dataIdx = 0;
  
  data[dataIdx++] = gData.length;
  
  for(i=0;i<gData.length;i++)
  {
    data[dataIdx++] = gData[i].x;
    data[dataIdx++] = gData[i].y;
  }
  
  return data;
}

function setvalueof()
{
  var dataIdx = 0;
  var dataLength = arguments[dataIdx++];
  
  gData = new Array();
  
  for(i=0;i<dataLength;i++)
  {
    gData[i] = new bpObj(arguments[dataIdx++], arguments[dataIdx++]);
  }
  
  if(gData.length)
  {
    gCursor.x = gData[0].x;
    gCursor.y = gData[0].y;
  }
  
  mgraphics.redraw();
}
