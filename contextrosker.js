/* ContextRosker v1.0.1 - 09/03/2015
   http://ikergune.com
   Copyright (c) 2015 Iñigo Gonzalez Vazquez <ingonza85@gmail.com> (@haas85) - Under MIT License */
(function() {
  window.CB = (function() {
    var SEPARATION_CHAR, config, createContent, getAllRobots, getContext, getData, parseValue, sendData, _configuration, _generateDict;
    _configuration = {
      cburl: "http://localhost:10101"
    };
    SEPARATION_CHAR = "%27";
    config = function(data) {
      var key, _results;
      if (data != null) {
        _results = [];
        for (key in data) {
          _results.push(_configuration[key] = data[key]);
        }
        return _results;
      } else {
        return _configuration;
      }
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
        value: JSON.stringify(data).replace(re, SEPARATION_CHAR)
      };
    };
    parseValue = function(value) {
      var re;
      re = new RegExp(SEPARATION_CHAR, 'g');
      return JSON.parse(value.replace(re, '"'));
    };
    sendData = function(entity_id, datatype, attributes, callback) {
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
        data: _generateDict(entity_id, datatype, attributes),
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
    getData = function(entity_id, datatype, isPattern, callback) {
      var options;
      if (datatype == null) {
        datatype = "ROBOT";
      }
      options = {
        url: "" + _configuration.cburl + "/NGSI10/queryContext",
        method: "POST",
        accepts: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain: true,
        data: {
          entities: [
            {
              type: datatype,
              isPattern: isPattern,
              id: entity_id
            }
          ]
        },
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
    _generateDict = function(entity_id, datatype, attributes) {
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
            id: entity_id,
            type: datatype,
            isPattern: "false",
            attributes: attributes
          }
        ],
        updateAction: "APPEND"
      };
    };
    getContext = function(options, callback) {
      var query;
      query = {
        entities: [
          {
            id: options.id || ".*",
            type: options.type || "ROBOT",
            isPattern: options.pattern || "true"
          }
        ]
      };
      options = {
        url: "" + _configuration.cburl + "/NGSI9/discoverContextAvailability",
        method: "POST",
        accepts: "application/json; charset=utf-8",
        dataType: "json",
        crossDomain: true,
        data: query,
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
    getAllRobots = function(callback) {
      var options;
      options = {
        id: ".*",
        type: "ROBOT",
        isPattern: "true"
      };
      return this.getContext(options, callback);
    };
    return {
      config: config,
      createContent: createContent,
      parseValue: parseValue,
      sendData: sendData,
      getData: getData,
      getContext: getContext,
      getAllRobots: getAllRobots
    };
  })();

}).call(this);
