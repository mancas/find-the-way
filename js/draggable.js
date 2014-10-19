var Draggable = function (element) {
    this._element = element;
    this._element.dataset.draggable = true;
    this._element.addEventListener('mousedown', this.handleDragStart.bind(this), false);
    document.addEventListener('mousemove', this.handleDrag.bind(this), false);
    this._element.addEventListener('mouseup', this.handleDrop.bind(this), false);
};

Draggable.prototype.handleDragStart = function(evt) {
    this._dragging = true;
    this._element.classList.add('dragging');
    this._currentPositionX = evt.clientX;
    this._currentPositionY = evt.clientY;
    return false;
};

Draggable.prototype.handleDrag = function(evt) {
    if (this._dragging) {
        var incX = evt.clientX - this._currentPositionX;
        var incY = evt.clientY - this._currentPositionY;
        this._currentPositionX = evt.clientX;
        this._currentPositionY = evt.clientY;
        var elemX = parseInt(this._element.style.left) + incX;
        elemX = this.checkLeftRight(elemX, this._element.clientWidth);
        var elemY = parseInt(this._element.style.top) + incY;
        this._element.style.left = elemX + 'px';
        this._element.style.top = (parseInt(this._element.style.top) + incY) + 'px';
    }
    return false;
};

Draggable.prototype.handleDrop = function(evt) {
    this._dragging = false;
    this._element.classList.remove('dragging');
    return false;
};

Draggable.prototype.checkLeftRight = function(elementX, elementWidth) {
    //Case left side
    if (elementX < 0) {
        return 0;
    } else {
        console.info(elementX + elementWidth, window.innerWidth);
        if ((elementX + elementWidth) > document.body.clientWidth) {
            return parseInt(document.body.clientWidth) - elementWidth;
        }
    }

    return elementX;
};