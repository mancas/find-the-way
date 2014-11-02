var Filter = function() {
    this._filters = [];
    this.forEach = Array.prototype.forEach;
    this.some = Array.prototype.some;
    this.baseURL = 'http://www.googlemapsmarkers.com/v1/';
    this.colors = [
        'e51c23',
        'e91e63',
        '9c27b0',
        '3f51b5',
        '5677fc',
        '03a9f4',
        '00bcd4',
        '009688',
        '259b24',
        '8bc34a',
        'cddc39',
        'ffeb3b',
        'ffc107',
        'ff9800',
        'ff5722',
        '795548'
    ];
    this.useLabels = false;
    this.labelCount = 0;
    this._availableColors = this.colors;
}

Filter.prototype.getFilters = function() {
   return this._filters;
}

Filter.prototype.addFilter = function(filter) {
    this._filters.push(filter);
    if (filter.type === 'activity') {
        this._assignIcon(filter);
    }
}

Filter.prototype._assignIcon = function(filter) {
    if (this._availableColors.length == 0) {
        this._availableColors = this.colors;
        this.useLabels = true;
        this.labelCount++;
    }

    if (this.useLabels) {
        filter.icon = this.baseURL + this.labelCount + '/' + this._availableColors.shift();
    } else {
        filter.icon = this.baseURL + this._availableColors.shift();
    }
}

Filter.prototype.removeFilter = function(filter) {
    this.some.call(this._filters, function(element, index) {
        if (this.equals(filter, element)) {
            this._filters.splice(index, 1);
            return true;
        }

        return false;
    }.bind(this));
}

Filter.prototype.exists = function(filter) {
    var exists = this.some.call(this._filters, function(element) {
        if (filter.value === element.value) {
            return true;
        }

        return false;
    }.bind(this));

    return exists;
}

Filter.prototype.getFilterIfExists = function(value) {
    var found;
    this.forEach.call(this._filters, function(filter) {
        console.info(value === filter.value, filter);
        if (value === filter.value) {
            found = filter;
            return;
        }
    }.bind(this));

    return found;
}

Filter.prototype.activeFilters = function() {
    var filters = [];
    this.forEach.call(this._filters, function(filter) {
        if (filter.active) {
            filters.push(filter);
        }
    }.bind(this));

    return filters;
}

Filter.prototype.toggleFilter = function(value) {
    this.some.call(this._filters, function(filter) {
        if (value === filter.value) {
            filter.active = !filter.active;
            return true;
        }

        return false;
    }.bind(this));
}

Filter.prototype.getFiltersByType = function(type) {
    var filters = [];
    this.forEach.call(this._filters, function(filter) {
        if (filter.type === type) {
            filters.push(filter);
        }
    }.bind(this));

    return filters;
}

Filter.prototype.equals = function(x, y) {
    if (x === y) {
        return true;
    }

    if (! (x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        if (x.hasOwnProperty(p)) {
            if (!y.hasOwnProperty(p)) {
                return false;
            }

            if (x[p] === y[p]) {
                continue;
            }

            if (typeof(x[p]) !== 'object') {
                return false;
            }

            // Checks arrays
            if (! this.equals(x[p], y[p])) {
                return false;
            }
        }
    }

    for (var p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }

    return true;
}