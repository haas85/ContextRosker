/* ContextRosker v1.0.1 - 13/01/2015
   http://ikergune.com
   Copyright (c) 2015 Iñigo Gonzalez Vazquez <ingonza85@gmail.com> (@haas85) - Under MIT License */
(function() {
  window.CB = (function() {
    var config, createContent, sendData, _configuration, _generateDict;
    _configuration = {
      cburl: "http://localhost:10101"
    };
    config = function(data) {
      var key, _results;
      _results = [];
      for (key in data) {
        _results.push(_configuration[key] = data[key]);
      }
      return _results;
    };
    createContent = function(topic, type, data) {
      var re;
      if (type == null) {
        type = "NotYet";
      }
      data["firosstamp"] = new Date().getTime();
      re = new RegExp('"', 'g');
      return {
        name: topic,
        type: type,
        value: JSON.stringify(data).replace(re, "'")
      };
    };
    sendData = function(contex_id, datatype, attributes, callback) {
      var options;
      if (datatype == null) {
        datatype = "ROBOT";
      }
      if (attributes == null) {
        attributes = [];
      }
      options = {
        url: "" + _configuration.cburl + "/NGSI10/updateContext",
        method: "POST",
        accepts: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain: true,
        data: _generateDict(contex_id, datatype, attributes),
        success: function(data) {
          if (callback != null) {
            return callback.call(callback, data);
          }
        },
        error: function(jqXHR, textStatus, errorThrown) {
          if (callback != null) {
            return callback.call(callback);
          }
        }
      };
      return $.ajax(options);
    };
    _generateDict = function(contex_id, datatype, attributes) {
      var attr, commands, _i, _len;
      if (attributes == null) {
        attributes = [];
      }
      commands = [];
      for (_i = 0, _len = attributes.length; _i < _len; _i++) {
        attr = attributes[_i];
        commands.push(attr.name);
      }
      attributes.unshift({
        name: "COMMAND",
        type: "COMMAND",
        value: commands
      });
      return {
        contextElements: [
          {
            id: contex_id,
            type: datatype,
            isPattern: "false",
            attributes: attributes
          }
        ],
        updateAction: "APPEND"
      };
    };
    return {
      config: config,
      createContent: createContent,
      sendData: sendData
    };
  })();

}).call(this);
