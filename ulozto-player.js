'use strict';

(function (_window, _document, _body) {

    _window.addEventListener('keydown', keyDownHandler, true);
    _window.addEventListener('keypress', keyPressHandler, true);

    /**
     * Receive all key event and filter only non-form (no to try catching passwords)
     * @param {KeyboardEvent} event
     * @throws {Error}
     */
    function keyDownHandler(event) {
        if (!isAcceptableEvent(event)) {
            return;
        }

        try {
            switch (event.code) {
                case 'Space':
                    spaceHandler(event);
                    break;
            }
        }
        catch (error) {
            if (!(error instanceof NoVideoException)) {
                throw error;
            }
        }
    }

    /**
     * Receive all key event and prevent default behavior on some of there
     * @param {KeyboardEvent} event
     */
    function keyPressHandler(event) {
        if (!isAcceptableEvent(event)) {
            return;
        }

        switch (event.code) {
            case 'Space':
                event.preventDefault();
                break;
        }
    }

    /**
     * Un/pause video
     * @param {KeyboardEvent} event
     * @throws {NoVideoException}
     */
    function spaceHandler(event) {
        const video = getVideoElement();
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    }

    /**
     * Get video element or throw exception if not exists
     * @returns {HTMLVideoElement}
     * @throws {NoVideoException}
     */
    function getVideoElement() {
        const videoElement = _document.querySelector('div.stream-player.is-playing  > video, video#liveHtml5Player');
        if (videoElement === null) {
            throw new NoVideoException();
        }
        return videoElement;
    }

    /**
     * Return true when event acceptable for processing
     * @param {KeyboardEvent} event
     * @returns {boolean}
     */
    function isAcceptableEvent(event) {
        return isVideoEvent(event) && isSimpleEvent(event);
    }

    /**
     * Return true when event not target to form, button or link
     * @param {KeyboardEvent} event
     * @returns {boolean}
     */
    function isVideoEvent(event) {
        return (event.target === _body);
    }

    /**
     * Return true when event is not key-combined shortcut
     * @param {KeyboardEvent} event
     * @returns {boolean}
     */
    function isSimpleEvent(event) {
        return !(event.altKey || event.ctrlKey || event.metaKey || event.shiftKey);
    }

    /**
     * Class of Exception - thrown when no video element currently presented on page
     * @constructor
     */
    function NoVideoException() {
        this.name = 'NoVideoException';
    }

})(window, document, document.body);
