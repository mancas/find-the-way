var SanitizeUI = {
    inputs: null,
    fakeInput: null,
    fileInput: null,
    uploadBtn: null,
    form: null,
    loadingOverlay: null,
    CSVContainer: null,
    CSVFile: null,
    viewCSVBtn: null,

    init: function() {
        this.inputs = document.querySelectorAll('input');
        this.fakeInput = document.querySelector('#fake-file');
        this.fileInput = document.querySelector('input[name="csv-file"]');
        this.uploadBtn = document.querySelector('.upload');
        this.form = document.querySelector('#file-form');
        this.loadingOverlay = document.querySelector('.loading-overlay');
        this.CSVContainer = document.querySelector('.csv-container');
        this.CSVFile = this.CSVContainer.querySelector('textarea');
        this.viewCSVBtn = document.querySelector('.csv-explain .btn');
        this._setPlaceholders();
        this.bindEvents();
    },

    _setPlaceholders: function() {
        var forEach = Array.prototype.forEach;
        forEach.call(this.inputs, function(element) {
            var placeholder = element.dataset.placeholder;
            element.setAttribute('value', placeholder);
        });
    },

    bindEvents: function() {
        var self = this;
        var openDialog = function() {
            self._openSelectFileDialog();
        };

        var submitForm = function() {
            self._submitForm();
        };

        this.fakeInput.addEventListener('click', openDialog);

        this.uploadBtn.addEventListener('click', openDialog);

        this.fileInput.addEventListener('change', function(evt) {
            var file = evt.target.value;

            if (file.length == 0) {
                console.info(file);
                this.fakeInput.setAttribute('value', this.fakeInput.dataset.placeholder);
                this.uploadBtn.addEventListener('click', openDialog);
                this.uploadBtn.removeEventListener('click', submitForm);
                return;
            }

            this.fakeInput.setAttribute('value', file);

            this.uploadBtn.removeEventListener('click', openDialog);
            this.uploadBtn.addEventListener('click', submitForm);
        }.bind(this));
    },

    _openSelectFileDialog: function() {
        this.fileInput.click();
    },

    _submitForm: function() {
        this.form.submit();
    },

    openLoadingOverlay: function() {
      this.loadingOverlay.dataset.visible = true;
      this.CSVContainer.dataset.visible = false;
    },

    closeLoadingOverlay: function() {
      this.loadingOverlay.dataset.visible = false;
      this.CSVContainer.dataset.visible = true;
    },

    addCSVLine: function(CSVLine) {
      var line = CSVLine + '\n';
      this.CSVFile.textContent = this.CSVFile.textContent + line;
    },

    clearCSV: function() {
        this.CSVFile.textContent = '';
    }
};
