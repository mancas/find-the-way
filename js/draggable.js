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
        var elemX = parseInt(this._element.style.left) + incX;
        var elemY = parseInt(this._element.style.top) + incY;

        // Update current position
        this._currentPositionX = evt.clientX;
        this._currentPositionY = evt.clientY;
        elemX = this.checkLeftRight(elemX, this._element.clientWidth);
        elemY = this.checkTopBottom(elemY, this._element.clientHeight);
        this._element.style.left = elemX + 'px';
        this._element.style.top = elemY + 'px';
        return false;
    }
    return true;
};

Draggable.prototype.handleDrop = function(evt) {
    this._dragging = false;
    this._element.classList.remove('dragging');
    return false;
};

Draggable.prototype.checkLeftRight = function(elementX, elementWidth) {
    // Case left side
    if (elementX < 0) {
        return 0;
    } else {
        // Case right side
        if ((elementX + elementWidth) > document.body.clientWidth) {
            return parseInt(document.body.clientWidth) - elementWidth;
        }
    }

    return elementX;
};

Draggable.prototype.checkTopBottom = function(elementY, elementHeight) {
    // Case top side
    if (elementY < 0) {
        return 0;
    } else {
        // Case bottom side
        if ((elementY + elementHeight) > document.body.clientHeight) {
            return parseInt(document.body.clientHeight) - elementHeight;
        }
    }

    return elementY;
};