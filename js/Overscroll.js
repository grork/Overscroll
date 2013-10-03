(function () {
    var overscrollerClassname = "cv-overscroller";

    WinJS.Namespace.define("Codevoid.Controls", {
        Overscroll: WinJS.Class.mix(WinJS.Class.define(function (element, options) {
            WinJS.UI.setOptions(this, options);
            this.element = element;

            if (!WinJS.Utilities.hasClass(this.element, overscrollerClassname)) {
                WinJS.Utilities.addClass(this.element, overscrollerClassname);
            }

            this._progressElement = element.querySelector(this.refreshIndicatorSelector);

            // Fix up handlers to have correct binds
            this._handleScroll = this._handleScroll.bind(this);
            this._handlePointer = this._handlePointer.bind(this);

            // Cache the size of the refresh indicator container.
            this._overScrollHeaderSize = this.scroller.firstElementChild.clientHeight;

            // Make sure it scrolls to hide the indicator immediately
            this.scroller.scrollTop = this._overScrollHeaderSize;

            // Make sure that the touch points are correct, so that the content snaps
            // to the top of this content.
            this.scroller.style.msScrollSnapPointsY = "snapInterval(" + this._overScrollHeaderSize + "px, " + this.snapInterval + ")";

            // Attach event handlers
            this.scroller.addEventListener("scroll", this._handleScroll);
            this.scroller.addEventListener("MSPointerDown", this._handlePointer);
            this.scroller.addEventListener("MSPointerOver", this._handlePointer);
        }, {
            element: null,
            scroller: {
                get: function () {
                    return this.element;
                },
            },

            /// <summary>
            /// Query selector that finds the refresh indicator to manipulate
            /// </summary>
            refreshIndicatorSelector: ".cv-overscroller-refreshindicator",

            /// <summary>
            /// The interval string to use in snap intervals
            /// </summary>
            snapInterval: "150px",

            /// <summary>
            /// Refresh Ratio -- the ratio over the overscroll area to
            /// reach the refresh limit
            /// </summary>
            refreshPercent: 0.5,

            resetOverscrollState: function resetOverscrollState() {
                this.scroller.style.msScrollSnapPointsY = "";
                WinJS.Utilities.removeClass(this._progressElement, "win-ring win-large");
                this._isOverScrolling = false;
                this.scroller.scrollTop = this._overScrollHeaderSize;
            },

            _progressElement: null,
            _resetScrollTimer: null,
            _isOverScrolling: false,
            _isBeingTouched: false,
            _overScrollHeaderSize: -1,

            _handlePointer: function _handlePointer(e) {
                this._isBeingTouched = e.pointerType === e.MSPOINTER_TYPE_TOUCH;
            },

            _resetResetScrollTimer: function _resetResetScrollTimer() {
                if (this._resetScrollTimer) {
                    this._resetScrollTimer.cancel();
                    this._resetScrollTimer = null;
                }
            },

            _handleScroll: function _handleScroll() {
                // If we're already overscrolling, no point in handling any more scroll information
                if (this._isOverScrolling) {
                    return;
                }

                // Save the current scroll position so we dont ask for it multiple times
                var scrollPosition = this.scroller.scrollTop;

                // If the scroll position is now less than the size of the header, we
                // need to update the progress element, if there is one, we well
                // as handle the mouse mode to scroll / snap back to the the top of the scroll position
                if (scrollPosition < this._overScrollHeaderSize) {
                    var amountVisible = this._overScrollHeaderSize - scrollPosition;
                    var percentVisible = (amountVisible / this._overScrollHeaderSize);

                    // Calculate & update progress towards being past the overscroll limit
                    if (this._progressElement) {
                        this._progressElement.value = percentVisible / this.refreshPercent;;
                    }

                    // If theres already a timer waiting for the mouse scroll to
                    // reset, reset it.
                    this._resetResetScrollTimer();

                    if (percentVisible >= this.refreshPercent) {
                        // We're in 'overscroll' land, so flip the state, and reset lots of things
                        this.scroller.style.msScrollSnapPointsY = "snapInterval(0px, " + this.snapInterval + ")";
                        this._isOverScrolling = true;
                        this._progressElement.removeAttribute("value");

                        // Turn the progress element into a spinner
                        WinJS.Utilities.addClass(this._progressElement, "win-ring win-large");

                        this.dispatchEvent("overscrolled", { source: this });
                    } else {
                        if (!this._isBeingTouched) {
                            this._resetScrollTimer = WinJS.Promise.timeout(1000).then(function () {
                                this.scroller.scrollTop = this._overScrollHeaderSize;
                            }.bind(this));
                        }
                    }
                } else {
                    this._resetResetScrollTimer();
                }
            },
        }), WinJS.Utilities.eventMixin),
    });
})();