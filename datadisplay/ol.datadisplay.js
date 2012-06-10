inlets = 2;
outlets = 1;

autowatch = 1;

mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

mgraphics.redraw();

var gate = 0;

var frgb = [1, 0., 0., 1.];
declareattribute("frgb", null, null, 1); 

var grgb = [0., 0., 0., 0.2];
declareattribute("grgb", null, null, 1); 

var linewidth = 1;
declareattribute("linewidth", null, null, 1);

var orientation = 0; // 0 = left to right / 1 = right to left / 2 = top to bottom / 3 = bottom to top
declareattribute("orientation", null, null, 1);

var stepcount = jsarguments[1];
//declareattribute("stepcount", null, null, 1);

var lowrange = 0.;
declareattribute("lowrange", null, null, 1);

var highrange = 1.;
declareattribute("highrange", null, null, 1);

var n_horiz_segments = 0;
declareattribute("n_horiz_segments", null, null, 1);

var n_vert_segments = 0;
declareattribute("n_vert_segments", null, null, 1);

var gated = 0;
declareattribute("gated", null, null, 1);

var data = new Array(stepcount);
var gatearray = new Array(stepcount);

for(i = 0; i< stepcount;i++)
{
	data[i] = 0.;
	gatearray[i] = 0;
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
	data.unshift((v - lowrange) /(highrange - lowrange));
	data.pop();
	
	if(gated)
	{
  	gatearray.unshift(gate);
	  gatearray.pop();
	}
	
	mgraphics.redraw();
}

function msg_int(v)
{
  if(inlet == 1)
  {
    if(v) gate = 1;
    else gate = 0;
  }
}

function draw_grid()
{
	var width = this.box.rect[2] - this.box.rect[0];
	var height = this.box.rect[3] - this.box.rect[1];
	
	with (mgraphics) 
	{
		set_line_width(1);
		set_source_rgba(grgb);

    if(n_horiz_segments)
    {
      var xstep = width / n_horiz_segments;
      
    	for(i = 1; i < n_horiz_segments; i++)
			{
			  move_to(i * xstep, 0);
				line_to(i * xstep, height);
			}
			
			stroke();
    }
    
    if(n_vert_segments)
    {
      var ystep = height / n_vert_segments;
      
    	for(i = 1; i < n_vert_segments; i++)
			{
			  move_to(0, i * ystep);
				line_to(width, i * ystep);
			}
			
			stroke();
    }
	}
}

function paint()
{
	var width = this.box.rect[2] - this.box.rect[0];
	var height = this.box.rect[3] - this.box.rect[1];
	
	draw_grid();

	with (mgraphics) 
	{
		set_line_width(linewidth);
		set_source_rgba(frgb);

		if(orientation == 0) // left to right
		{
			var xstep = width / (stepcount-1);
			var x = 0;
			var y = height - (height * data[0]);
	
			for(i = 1; i < stepcount; i++)
			{
				var newx = i * xstep;
				var newy = height - (height * data[i]);

	      if(gated)
	      {
	        set_source_rgba(frgb[0], frgb[1], frgb[2], frgb[3] * gatearray[i] );
	      }
	
				move_to(x, y);
				line_to(newx, newy);
				stroke();
	
				x = newx;
				y = newy;
			}
		}
		else if (orientation == 1)  // right to left
		{
			var xstep = width / (stepcount-1);
			var x = width;
			var y = height - (height * data[0]);
	
			for(i = 1; i < stepcount; i++)
			{
				var newx = width - (i * xstep);
				var newy = height - (height * data[i]);
	
		    if(gated)
	      {
	        set_source_rgba(frgb[0], frgb[1], frgb[2], frgb[3] * gatearray[i] );
	      }
	
				move_to(x, y);
				line_to(newx, newy);
	      stroke();
	      
				x = newx;
				y = newy;
			}
		}
		else if (orientation == 2)  // top to bottom
		{
			var ystep = height / (stepcount-1);
			var x = width * data[0];
			var y = 0;
	
			for(i = 1; i < stepcount; i++)
			{
				var newx = width * data[i];
				var newy = i * ystep;
	
		    if(gated)
	      {
	        set_source_rgba(frgb[0], frgb[1], frgb[2], frgb[3] * gatearray[i] );
	      }
	
				move_to(x, y);
				line_to(newx, newy);
	      stroke();
	
				x = newx;
				y = newy;
			}
		}
		else if (orientation == 3)  // bottom to top
		{
			var ystep = height / (stepcount-1);
			var x = width * data[0];
			var y = height;
	
			for(i = 1; i < stepcount; i++)
			{
				var newx = width * data[i];
				var newy = height - (i * ystep);
	
		    if(gated)
	      {
	        set_source_rgba(frgb[0], frgb[1], frgb[2], frgb[3] * gatearray[i] );
	      }
	
				move_to(x, y);
				line_to(newx, newy);
	      stroke();
	
				x = newx;
				y = newy;
			}
		}
		
		//stroke();
	}
}