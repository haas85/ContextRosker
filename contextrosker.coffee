window.CB = do ->
  _configuration =
    cburl: "http://localhost:10101"

  config = (data) ->
    if data?
      for key of data
        _configuration[key] = data[key]
    else
      _configuration

  createContent = (topic, type="NotYet", data)->
    data["firosstamp"] = new Date().getTime()
    re = new RegExp '"', 'g'

    name    : topic
    type    : type
    value   : JSON.stringify(data).replace re, "'"

  sendData = (contex_id, datatype="ROBOT", attributes=[], callback)->
    options =
      url         : "#{_configuration.cburl}/NGSI10/updateContext"
      method      : "POST"
      accepts     : "application/json; charset=utf-8"
      dataType    : "json"
      crossDomain : true
      data        : _generateDict(contex_id, datatype, attributes)
      success: (data) ->
        callback.call callback, data if callback?
      error: (jqXHR, textStatus, errorThrown ) ->
        callback.call callback if callback?
    return $.ajax options

  _generateDict = (contex_id, datatype, attributes=[]) ->
    commands = []
    for attr in attributes
      commands.push attr.name
    attributes.unshift
      name    : "COMMAND"
      type    : "COMMAND"
      value   : commands

    contextElements: [
      id          : contex_id
      type        : datatype
      isPattern   : "false"
      attributes  : attributes
    ]
    updateAction: "APPEND"

  getContext = (options, callback) ->
    query =
      entities:[
        {
          id        : options.id or ".*"
          type      : options.type or "ROBOT"
          isPattern   : options.pattern or "true"
        }
      ]
    options =
      url: "#{_configuration.cburl}/NGSI9/discoverContextAvailability"
      method: "POST"
      accepts: "application/json; charset=utf-8"
      dataType: "json"
      crossDomain: true
      data: query
      success: (data) ->
        callback.call callback, data if callback?
      error: (jqXHR, textStatus, errorThrown ) ->
        callback.call callback if callback?
    return $.ajax options

  getAllRobots = (callback) ->
    options =
      id        : ".*"
      type      : "ROBOT"
      isPattern   : "true"
    @getContext options, callback

  config: config
  createContent: createContent
  sendData: sendData
  getContext: getContext
  getAllRobots: getAllRobots