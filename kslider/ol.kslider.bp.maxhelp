{
	"patcher" : 	{
		"fileversion" : 1,
		"rect" : [ 25.0, 69.0, 689.0, 392.0 ],
		"bglocked" : 0,
		"defrect" : [ 25.0, 69.0, 689.0, 392.0 ],
		"openrect" : [ 0.0, 0.0, 0.0, 0.0 ],
		"openinpresentation" : 0,
		"default_fontsize" : 12.0,
		"default_fontface" : 0,
		"default_fontname" : "Arial",
		"gridonopen" : 0,
		"gridsize" : [ 10.0, 10.0 ],
		"gridsnaponopen" : 0,
		"toolbarvisible" : 1,
		"boxanimatetime" : 200,
		"imprint" : 0,
		"enablehscroll" : 1,
		"enablevscroll" : 1,
		"devicewidth" : 0.0,
		"boxes" : [ 			{
				"box" : 				{
					"maxclass" : "comment",
					"text" : "arguments :\n\n1 - number of octaves\n2 - starting note (midi value e.g. 60)\n\n",
					"linecount" : 5,
					"numinlets" : 1,
					"id" : "obj-10",
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"fontname" : "Arial",
					"patching_rect" : [ 230.0, 110.0, 150.0, 75.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "seq",
					"numinlets" : 1,
					"id" : "obj-4",
					"fontsize" : 12.0,
					"numoutlets" : 2,
					"outlettype" : [ "int", "bang" ],
					"fontname" : "Arial",
					"patching_rect" : [ 100.0, 140.0, 32.5, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "unpack i i",
					"numinlets" : 1,
					"id" : "obj-3",
					"fontsize" : 12.0,
					"numoutlets" : 2,
					"outlettype" : [ "int", "int" ],
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 300.0, 61.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "noteout",
					"numinlets" : 3,
					"id" : "obj-2",
					"fontsize" : 12.0,
					"numoutlets" : 0,
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 350.0, 51.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "midiin",
					"numinlets" : 1,
					"id" : "obj-5",
					"fontsize" : 12.0,
					"numoutlets" : 1,
					"outlettype" : [ "int" ],
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 130.0, 43.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "newobj",
					"text" : "midiparse",
					"numinlets" : 1,
					"id" : "obj-6",
					"fontsize" : 12.0,
					"numoutlets" : 7,
					"outlettype" : [ "", "", "", "int", "int", "int", "int" ],
					"fontname" : "Arial",
					"patching_rect" : [ 40.0, 170.0, 101.0, 20.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "bpatcher",
					"numinlets" : 1,
					"id" : "obj-1",
					"name" : "ol.kslider.bp.maxpat",
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"args" : [ 6, 36 ],
					"patching_rect" : [ 40.0, 210.0, 620.0, 68.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "autohelp_top_title",
					"text" : "ol.kslider.bp",
					"numinlets" : 1,
					"id" : "obj-110",
					"fontface" : 3,
					"fontsize" : 20.871338,
					"numoutlets" : 0,
					"fontname" : "Arial",
					"patching_rect" : [ 10.0, 9.0, 668.0, 30.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "comment",
					"varname" : "autohelp_top_digest",
					"text" : "a prettier kslider that is MIDI input friendly",
					"numinlets" : 1,
					"id" : "obj-111",
					"fontsize" : 12.754705,
					"numoutlets" : 0,
					"fontname" : "Arial",
					"patching_rect" : [ 10.0, 41.0, 668.0, 21.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "panel",
					"varname" : "autohelp_top_panel",
					"grad1" : [ 0.86, 0.86, 0.75, 1.0 ],
					"numinlets" : 1,
					"id" : "obj-114",
					"bgcolor" : [ 1.0, 0.701961, 0.0, 1.0 ],
					"grad2" : [ 0.78, 0.84, 0.86, 0.7 ],
					"numoutlets" : 0,
					"background" : 1,
					"patching_rect" : [ 5.0, 6.0, 678.0, 58.0 ]
				}

			}
, 			{
				"box" : 				{
					"maxclass" : "message",
					"text" : "read, bang",
					"numinlets" : 2,
					"id" : "obj-7",
					"fontsize" : 12.0,
					"numoutlets" : 1,
					"outlettype" : [ "" ],
					"fontname" : "Arial",
					"patching_rect" : [ 100.0, 110.0, 68.0, 18.0 ]
				}

			}
 ],
		"lines" : [ 			{
				"patchline" : 				{
					"source" : [ "obj-1", 0 ],
					"destination" : [ "obj-3", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-6", 0 ],
					"destination" : [ "obj-1", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-3", 1 ],
					"destination" : [ "obj-2", 1 ],
					"hidden" : 0,
					"midpoints" : [ 91.5, 334.5, 65.5, 334.5 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-3", 0 ],
					"destination" : [ "obj-2", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-5", 0 ],
					"destination" : [ "obj-6", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-4", 0 ],
					"destination" : [ "obj-6", 0 ],
					"hidden" : 0,
					"midpoints" : [ 109.5, 164.5, 49.5, 164.5 ]
				}

			}
, 			{
				"patchline" : 				{
					"source" : [ "obj-7", 0 ],
					"destination" : [ "obj-4", 0 ],
					"hidden" : 0,
					"midpoints" : [  ]
				}

			}
 ],
		"parameters" : 		{
			"obj-1::obj-3" : [ "live.slider", "velocity", 0 ]
		}

	}

}
