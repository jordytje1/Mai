const mongoose = require("mongoose");
const { DEFAULTSETTINGS: defaults } = require("../configuration");

const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  guildName: String,
  prefix: {
    "type": String,
    "default": defaults.prefix
  },
  logChannel: {
    "type": String,
    "default": defaults.logChannel
  },
  welcomeMessage: {
    "type": String,
    "default": defaults.welcomeMessage
  },
  expsysteme:{
    "type": Boolean,
    "default": false
  },
  serveurstats:{
    "type": Boolean,
    "default": false
  }, 
  invitations:{
    "type": Boolean,
    "default": defaults.invitations
  },
  rankcard :{
    "type": String,
    "default": defaults.rankcard
  },
  salonranks :{
    "type": String,
    "default": ""
  },
  modLogs :{
    "type": String,
    "default": ""
  },
  premium:{
    "type": Boolean,
    "default": false
  },
  reactionroles:{
    "type": Array,
    "default":[]
  },
  modRoles:{
    "type": Array,
    "default":[]
  },
  filter:{
    "type": Array,
    "default":[]
  },
  ignoreChannel:{
    "type": Array,
    "default":[]
  },
  links:{
    "type": Array,
    "default":[]
  },
  commandes:{
    "type": Array,
    "default":[]
  },
  shop:{
    "type": Array,
    "default":[]
  },
  kickauto:{
    "type": Boolean,
    "default": defaults.kickauto
  },
});

module.exports = mongoose.model("Guild", guildSchema);
