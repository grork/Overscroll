Overscroller
=========
This is a simple WinJS control to allow a twitter-style pull to refresh in a Windows Store WWA (e.g. HTML/CSS/JS) application.

### Basic Usage ###
The basic control is in `Codevoid.Controls.Overscroll`, which you can just use in your HTML, after including Overscroll.js & Overscroll.css

You can use this in your mark up like so:

    <div data-win-control="Codevoid.Controls.Overscroll">
    <!-- your content -->
    </div>
    

### Configuration ####
There are a number of configuration options you can set on the control through the `data-win-options` attribute.

#### snapInterval ####
This sets the interval for the mandatory snap point interval. See MSDN's documentation on [-ms-scroll-snap-points-x](http://msdn.microsoft.com/en-us/library/windows/apps/hh466031.aspx) for more details.

This is the string literal you would place in the `snapInterval` property.

Example:

    { snapInterval: "150px" }

#### refreshPercent ####
This controls how far into the overscroll region (as a percentage of the whole overscoll area), ranging from 0 to 1.0 (0% to 100%)

Example:

    { refreshPercent: 0.5 } // 50%!
    
#### refreshIndicatorSelector ####
This is the query selector that is used to find where in the overscrol region the `<progress />` element is for displaying the progress.

This element will have it's `value` property set & controlled as part of othe overscroll

### Being notified & Handling overscroll ###
Overscroll is  signified by the control instance itself raising an `overscrolled` event, which can be listened to with `addEventListener` on the control itself. ** This is not a DOM event **, it is a native JavaScript event provided by the `WinJS.Utilities.eventMixin` mixin.

When this event is raised, one should start their refresh work. When they're work is complete, calling `resetOverscrollState` will return the UI back to the bottom of the overscroll area.

Example usage:

    var scroller = document.getElementById("scroller").winControl;
    scroller.addEventListener("overscrolled", function (e) {
        WinJS.Promise.timeout(3000).done(function () {
            e.detail.source.resetOverscrollState();
        });
    });