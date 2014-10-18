var Modal = {
    caretOffset: 20,
    horizontalOffset: 5,
    verticalOffset: 5,
    dismissHandler: null,

    openModal: function(element, relativeElement, position) {
        var boundingClientRect = relativeElement.getBoundingClientRect();
        var clientX = boundingClientRect.x || boundingClientRect.left;
        var clientY = boundingClientRect.y || boundingClientRect.top;

        if (!position) {
            position = 'auto';
        }

        switch (position) {
            case 'auto' :
                //Top position
                if ((clientY - (element.clientHeight + this.caretOffset)) > 0) {
                    element.style.top = (clientX - (elementclientHeight + this.caretOffset)) + 'px';
                    element.style.left = clientX + 'px';
                    position = 'top';
                    break;
                }
                //Bottom position
                if ((window.innerHeight - (clientY + boundingClientRect.height +
                    element.clientHeight + this.caretOffset)) > 0) {
                    element.style.top = (clientY + boundingClientRect.height + this.caretOffset) + 'px';
                    if (clientX == 0) {
                        element.style.left = this.horizontalOffset + 'px';
                    } else {
                        element.style.left = clientX + 'px';
                    }
                    position = 'bottom';
                    break;
                }
                //Left position
                if ((clientX - (element.clientWidth + this.caretOffset)) > 0) {
                    if (clientX == 0) {
                        element.style.top = this.verticalOffset + 'px';
                    } else {
                        element.style.top = clientY + 'px';
                    }
                    element.style.left = (clientX - (element.clientWidth + this.caretOffset)) + 'px';
                    position = 'left';
                    break;
                }
                //Right position
                if ((window.innerWidth - (clientX + boundingClientRect.width +
                    element.clientWidth + this.caretOffset)) > 0) {
                    if (clientX == 0) {
                        element.style.top = this.verticalOffset + 'px';
                    } else {
                        element.style.top = clientX + 'px';
                    }
                    element.style.left = (clientX + boundingClientRect.width + this.caretOffset) + 'px';
                    position = 'right';
                    break;
                }
            case 'left':
                if (clientX == 0) {
                    element.style.top = this.verticalOffset + 'px';
                } else {
                    element.style.top = clientX + 'px';
                }
                element.style.left = (clientX - element.clientWidth + this.caretOffset) + 'px';
                break;
            case 'right':
                if (clientX == 0) {
                    element.style.top = this.verticalOffset + 'px';
                } else {
                    element.style.top = clientX + 'px';
                }
                element.style.left = (clientX + boundingClientRect.width + this.caretOffset) + 'px';
                break;
            case 'top':
                element.style.top = (clientX - element.clientHeight + this.caretOffset) + 'px';
                element.style.left = clientX + 'px';
                break;
            case 'bottom':
                element.style.top = (clientX + boundingClientRect.height + this.caretOffset) + 'px';
                if (clientX == 0) {
                    element.style.left = this.horizontalOffset + 'px';
                } else {
                    element.style.left = clientX + 'px';
                }
                break;
            case 'center':
                var center = {
                    x: window.innerWidth/2,
                    y: window.innerHeight/2
                };
                element.style.left = center.x - (element.clientWidth/2) + 'px';
                element.style.top = center.y - (element.clientHeight/2) + 'px';
                break;
        }
        this.configCaret(element, position);
        this.configDismiss(element);
        element.dataset.visible = true;
    },

    configDismiss: function(element) {
        var dismissBtn = element.querySelector('.modal-dialog-dismiss');
        dismissBtn.addEventListener('click', function(evt) {
            evt.preventDefault();
            element.dataset.visible = false;
        });
    },

    configCaret: function(element, position) {
        var caret = element.querySelector('.caret');
        var caretShadow = element.querySelector('.caret-shadow');
        this._sanitizeCarets(caret, caretShadow);
        switch (position) {
            case 'top':
                caret.classList.add('caret-bottom');
                caretShadow.classList.add('caret-shadow-bottom');
                break;
            case 'bottom':
                caret.classList.add('caret-top');
                caretShadow.classList.add('caret-shadow-top');
                break;
            case 'left':
                caret.classList.add('caret-right');
                caretShadow.classList.add('caret-shadow-right');
                break;
            case 'right':
                caret.classList.add('caret-left');
                caretShadow.classList.add('caret-shadow-left');
                break;
            case 'center':
                caret.dataset.visible = false;
                caretShadow.dataset.visible = false;
                break;
        }
    },

    _sanitizeCarets: function(caret, caretShadow) {
        caret.classList.remove('caret-top');
        caret.classList.remove('caret-left');
        caret.classList.remove('caret-right');
        caret.classList.remove('caret-bottom');
        caretShadow.classList.remove('caret-shadow-top');
        caretShadow.classList.remove('caret-shadow-left');
        caretShadow.classList.remove('caret-shadow-right');
        caretShadow.classList.remove('caret-shadow-bottom');
        caret.dataset.visible = true;
        caretShadow.dataset.visible = true;
    }
};