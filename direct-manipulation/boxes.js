var Boxes = {
    /**
     * Constant for the left mouse button.
     */
    LEFT_BUTTON: 1,

    /**
     * Sets up the given jQuery collection as the drawing area(s).
     */
    setDrawingArea: function (jQueryElements) {
        jQueryElements
            .addClass("drawing-area")
            // "this" is Boxes.
            .mousedown(this.startDraw)
            .mousemove(this.trackDrag)
            
            // We conclude drawing on either a mouseup or a mouseleave.
            .mouseup(this.endDrag)
            .mouseleave(this.endDrag);
    },

    /**
     * Utility function for disabling certain behaviors when the drawing
     * area is in certain states.
     */
    setupDragState: function () {
        $(".drawing-area .box")
            .unbind("mousemove")
            .unbind("mouseleave");
    },

    /**
     * Begins a box draw sequence.
     */
    startDraw: function (event) {
        // We only respond to the left mouse button.
        if (event.which === Boxes.LEFT_BUTTON) {
            // Add a new box to the drawing area.  Note how we use
            // the drawing area as a holder of "local" variables
            // ("this" as standardized by jQuery).
            this.anchorX = event.pageX;
            this.anchorY = event.pageY;
            this.drawingBox = $("<div></div>")
                .appendTo(this)
                .addClass("box")
                .offset({ left: this.anchorX, top: this.anchorY });

            // Take away the highlight behavior while the draw is
            // happening.
            Boxes.setupDragState();
            $("<div></div>").appendTo(this.drawingBox).addClass("cornerR");
        }

    },

    /**
     * Tracks a box as it is rubberbanded or moved across the drawing area.
     */
    trackDrag: function (event) {
        // Don't bother if we aren't tracking anything.
        if (this.drawingBox) { 
            // Calculate the new box location and dimensions.  Note how
            // this might require a "corner switch."

            var newOffset = {
                left: (this.anchorX < event.pageX) ? this.anchorX : event.pageX,
                top: (this.anchorY < event.pageY) ? this.anchorY : event.pageY
            };

            this.drawingBox
                .offset(newOffset)
                .width(Math.abs(event.pageX - this.anchorX))
                .height(Math.abs(event.pageY - this.anchorY));
        }else if (this.resizingBox) {

            // Resizing the object.
            // JD: You have version control---this commented-out code block
            //     does not have to stay here.
           // this.anchorX = this.resizingBox.width + this.resizingBox.position().left;
          //  this.anchorY = this.resizingBox.height + this.resizingBox.position().top;
            var newOffset = {
                left: (this.anchorX < event.pageX) ? this.anchorX : event.pageX,
                top: (this.anchorY < event.pageY) ? this.anchorY : event.pageY
            };
            
                // JD: Take note, what is "this" in this code, from which you are
                //     reading anchorX and anchorY?  Compare it to the "this" in
                //     startMove, which sets anchorX and anchorY.
                console.log("anchorX "+ this.anchorX );
                console.log("anchorY "+ this.anchorY );         
                this.resizingBox
                    // JD: JQuery chains should be indented.
                .offset(newOffset)
                .width(Math.abs(event.pageX - this.anchorX))
                .height(Math.abs(event.pageY - this.anchorY)); 

               
            
        } else if (this.movingBox) {
            // Reposition the object.(possible deletion)
            // JD: 550x550 is unnecessarily hardcoded!  What if the page designer
            //     modifies the position and size of the drawing area?
            if((event.pageX - this.deltaX) > 550 ||(event.pageY - this.deltaY) > 550){ 
                // Deletion movement
                
                var deletionMessage = confirm("Do you want to delet this box?")
                // JD: ^ A missing semicolon---no excuse for that!
                //     And in the line below...let's just say, you should show that
                //     to Dr. Toal and ask him what's wrong with it.
                if ( deletionMessage ==true){

                    $(this.movingBox).remove(); 
                    event.stopPropagation();
                    this.movingBox = null;
                    alert("You deleted the box")

                }else{
                    // JD: I find this a somewhat arbitrary choice for what to do when
                    //     a move is cancelled---but it will not be necessary if you
                    //     modify the user interface as suggested in the feedback.
                    this.movingBox.offset({ left: 75, top: 75 });
                
                }
            }else{
                // Regular movement

                this.movingBox.offset({
                    left: event.pageX - this.deltaX,
                    top: event.pageY - this.deltaY
                });
            }
        }
    },

    /**
     * Concludes a drawing or moving sequence.
     */
    endDrag: function (event) {
        if (this.drawingBox) {
            // Finalize things by setting the box's behavior.
            this.drawingBox
                .mousemove(Boxes.highlight)
                .mouseleave(Boxes.unhighlight)
                .mousedown(Boxes.startMove);
            
            // All done.
            this.drawingBox = null;
        } else if (this.resizingBox) { 
            // Change state to "not-moving-anything" by clearing out
            // this.movingBox.
            this.resizingBox.offset({
                    left: (this.anchorX < event.pageX) ? this.anchorX : event.pageX,
                    top: (this.anchorY < event.pageY) ? this.anchorY : event.pageY
                });
            this.resizingBox = null;
            this.movingBox = null;

        } else if (this.movingBox) { 
            // Change state to "not-moving-anything" by clearing out
            // this.movingBox.
            this.movingBox = null;
        }

        // In either case, restore the highlight behavior that was
        // temporarily removed while the drag was happening.
        $(".drawing-area .box")
            .removeClass("box-highlight")
            .mousemove(Boxes.highlight)
            .mouseleave(Boxes.unhighlight);
    },

    /**
     * Indicates that an element is highlighted.
     */
    highlight: function () {
        $(this).addClass("box-highlight");
        $(this).find(".cornerR").addClass("cornerR-highlight");
    },

    /**
     * Indicates that an element is unhighlighted.
     */

    unhighlight: function () {
        $(this).removeClass("box-highlight");
        $(this).find(".cornerR").removeClass("cornerR-highlight");

    },

    /**
     * Begins a box move sequence.
     */
    startMove: function (event) {
        // We only move using the left mouse button.
        if (event.which === Boxes.LEFT_BUTTON) {
            // Take note of the box's current (global) location.
            var jThis = $(this),//jThis is the current box
                startOffset = jThis.offset(),
                // Grab the drawing area (this element's parent).
                // We want the actual element, and not the jQuery wrapper
                // that usually comes with it.
                parent = jThis.parent().get(0);//pic 1

            // Set the drawing area's state to indicate that it is
            // in the middle of a move.
            //get coordinates within drawing area

            // JD: This conditoin can be made much more readable than it currently is.
            if(Math.abs(event.pageX - (jThis.position().left + $(this).width())) < 20 && Math.abs(event.pageY - (jThis.position().top + $(this).height())) < 20){
                //alert(true);
                parent.resizingBox = jThis;
                // JD: See my comment in line 86.
                this.anchorX = startOffset.left;
                this.anchorY = startOffset.top;
                parent.deltaX = event.pageX - startOffset.left;
                parent.deltaY = event.pageY - startOffset.top;
                
            }else{
                // ^JD: You really shouldn't be producing code spaced like the line
                //      above anymore, at your level.
                parent.movingBox = jThis;
                parent.deltaX = event.pageX - startOffset.left;
                parent.deltaY = event.pageY - startOffset.top;
            }
        

            // Take away the highlight behavior while the move is
            // happening.
            Boxes.setupDragState();

            // Eat up the event so that the drawing area does not
            // deal with it.
            event.stopPropagation();//pic 2 prevent the mousedown to cascade to drawing area and so on ...
        }
    }

};
