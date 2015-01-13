window.CB = do ->
  _configuration =
    cburl: "http://localhost:10101"

  config = (data) ->
    for key of data
      _configuration[key] = data[key]

  createContent = (topic, type="NotYet", data)->
    data["firosstamp"] = new Date().getTime()
    re = new RegExp '"', 'g'

    name: topic
    type: type
    value: JSON.stringify(data).replace re, "'"

  sendData = (contex_id, datatype="ROBOT", attributes=[], callback)->
    options =
      url: "#{_configuration.cburl}/NGSI10/updateContext"
      method: "POST"
      accepts: "application/json; charset=utf-8"
      dataType: "json"
      crossDomain: true
      data: _generateDict(contex_id, datatype, attributes)
      success: (data) ->
        callback.call callback, data if callback?
      error: (jqXHR, textStatus, errorThrown ) ->
        callback.call callback if callback?
    # console.log options.data
    return $.ajax options

  _generateDict = (contex_id, datatype, attributes=[]) ->
    commands = []
    for attr in attributes
      commands.push attr.name
    attributes.unshift
      name: "COMMAND"
      type: "COMMAND"
      value: commands
    contextElements: [
      id: contex_id
      type: datatype
      isPattern: "false"
      attributes: attributes
    ]
    updateAction: "APPEND"

  config: config
  createContent: createContent
  sendData: sendData