var Dictation = function(speechRecognition, lang) {
  if (speechRecognition === undefined || lang === undefined) {
    return undefined;
  }

  this.recognition = speechRecognition;
  this.recognition.lang = lang;

  this.recognition.onspeechend = function() {
    this.stop();
  };
};

Dictation.prototype.setLanguage = function(language) {
  this.recognition.lang = language;
};

Dictation.prototype.getLastTranscript = function() {
  return this.lastTranscript;
};

Dictation.prototype.start = function(successCallback, failureCallback) {
  var success = function(event) {
    this.lastTranscript = event.results[0][0].transcript;
    successCallback(this.lastTranscript);
  };
  this.recognition.onresult = success.bind(this);

  this.recognition.onerror = function(event) {
    failureCallback(event.error);
  };

  this.recognition.start();
};

Dictation.prototype.stop = function() {
  this.recognition.stop();
};
