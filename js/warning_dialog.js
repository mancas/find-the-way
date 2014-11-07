var WarningDialog = function warning_dialog(options) {
    if (options.selector === undefined) {
        console.error('Element selector is missed, aborting');
        return;
    }

    this.element = document.querySelector(options.selector);
    this.relativeElement = options.relativeElement ? options.relativeElement : document.body;
    this.position = options.position ? options.position : 'center';
    this.visible = false;
    if (options.draggable) {
        new Draggable(this.element);
    }
};

WarningDialog.prototype.show = function wd_show() {
    Modal.openModal(this.element, this.relativeElement, this.position);
    this.visible = true;
};

WarningDialog.prototype.hide = function wd_hide() {
    Modal.hide(this.element);
    this.visible = false;
};