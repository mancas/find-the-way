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
    this.filterTypes = [
        'postal-code',
        'activity'
    ];
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
        if (filter.value == element.value) {
            return true;
        }

        return false;
    }.bind(this));

    return exists;
}

Filter.prototype.getFilterIfExists = function(value) {
    var found = null;
    this.forEach.call(this._filters, function(filter) {
        if (value == filter.value) {
            found = filter;
            return;
        }
    });

    return found;
}

Filter.prototype.getActiveFilters = function() {
    var filters = [];
    this.forEach.call(this._filters, function(filter) {
        if (filter.active) {
            filters.push(filter);
        }
    });

    return filters;
}

Filter.prototype.toggleFilter = function(value) {
    this.some.call(this._filters, function(filter) {
        if (value == filter.value) {
            filter.active = !filter.active;
            return true;
        }

        return false;
    });
}

Filter.prototype.applyFilters = function(markers) {
    var self = this;
    if (this.getActiveFilters().length == 0) {
        this.forEach.call(markers, function(marker) {
            marker.setVisible(true);
        });

        return;
    }

    this.forEach.call(markers, function(marker) {
        var visible = true;
        self.forEach.call(self.filterTypes, function(type) {
            var filters = self.getActiveFiltersByType(type);
            visible = visible && self.shouldApplySomeFilter(marker, filters);
        });
        if (!visible) {
            marker.setVisible(false);
        } else {
            marker.setVisible(true);
        }
   });
}

Filter.prototype.shouldApplySomeFilter = function(marker, filters) {
    // If there is no filters of a specific type then the marker could be visible
    if (filters.length == 0) {
        return true;
    }

    var shouldApplySomeFilter = this.some.call(filters, function(filter) {
        switch (filter.type) {
            case 'activity':
                return marker.ftw_point.actividad == filter.value;
            case 'postal-code':
                return marker.ftw_point.postal == filter.value;
        }
    });

    return shouldApplySomeFilter;
}

Filter.prototype.getFiltersByType = function(type) {
    var filters = [];
    this.forEach.call(this._filters, function(filter) {
        if (filter.type == type) {
            filters.push(filter);
        }
    });

    return filters;
}

Filter.prototype.getActiveFiltersByType = function(type) {
    var filters = [];
    this.forEach.call(this._filters, function(filter) {
        if (filter.type == type && filter.active) {
            filters.push(filter);
        }
    });

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