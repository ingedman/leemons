const table = {
  room: leemons.query('plugins_comunica::room'),
  message: leemons.query('plugins_comunica::message'),
  userAgentConfig: leemons.query('plugins_comunica::userAgentConfig'),
  userAgentInRoom: leemons.query('plugins_comunica::userAgentInRoom'),
  roomMessagesUnRead: leemons.query('plugins_comunica::roomMessagesUnRead'),
};

module.exports = { table };
