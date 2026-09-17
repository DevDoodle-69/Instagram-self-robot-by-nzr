"use strict";
const fs=require("fs"),path=require("path");
const GAP=900000,TTL=28800000;
const TARGETS={"73865837635":"heyy.!! cutie Tanisha~ ✨","75009109335":"heyy.!! cutie Shefaa~ ✨"};
const sessions=new Map();let status={active:false,reason:"",since:0},file=null;
function stateFile(c){if(!file){const d=path.join(path.resolve(__dirname,".."),(c.database&&c.database.dir)||"storage");fs.mkdirSync(d,{recursive:true});file=path.join(d,"afk-state.json")}return file}
function save(c){try{const rows={};for(const[k,v]of sessions)if(Date.now()-v.lastActive<TTL)rows[k]=v;fs.writeFileSync(stateFile(c),JSON.stringify({status,sessions:rows},null,2))}catch(_){}}
function load(c){try{const f=stateFile(c);if(!fs.existsSync(f))return;const d=JSON.parse(fs.readFileSync(f,"utf8"));if(d.status&&d.status.active)status=d.status;for(const[k,v]of Object.entries(d.sessions||{}))if(Date.now()-(v.lastActive||0)<TTL)sessions.set(k,v)}catch(_){}}
function key(e){return `${e.threadID||"dm"}:${e.senderID||"anon"}`}function session(k){let s=sessions.get(k);if(!s||Date.now()-s.lastActive>TTL)s={lastActive:Date.now(),lastNotice:0};s.lastActive=Date.now();sessions.set(k,s);return s}
function me(api){try{return String(api.getCurrentUserID())}catch(_){return""}}
function dur(ms){const m=Math.max(1,Math.floor(ms/60000));if(m<60)return`~${m}min`;const h=Math.floor(m/60),r=m%60;return r?`~${h}h ${r}min`:`~${h}h`}
module.exports={config:{name:"afk",aliases:["away"],author:"Alternative Self-Bot",category:"utility",cooldown:2,role:0,noPrefix:true,noPrefixRole:0,description:{en:"Toggle afk status and auto reply while away"},usage:{en:"{p}afk [reason] or afk"}},
 async onStart({message,args,config,api,event}){load(config);const sender=String(event.senderID||"");if(sender!==me(api)&&config.adminBot.length&&!config.adminBot.includes(sender))return;if(status.active){status={active:false,reason:"",since:0};sessions.clear();save(config);return message.reply("you are back now")}status={active:true,reason:args.join(" ").trim()||"busy",since:Date.now()};save(config);return message.reply(`okay I will tell people you are away because ${status.reason}`)},
 async onMessage({message,event,config,api}){load(config);if(!status.active||!event||!["message","message_reply"].includes(event.type))return;const sender=String(event.senderID||"");if(!sender||sender===me(api))return;const s=session(key(event)),now=Date.now();if(s.lastNotice&&now-s.lastNotice<GAP)return;s.lastNotice=now;const name=TARGETS[sender];const since=status.since?dur(now-status.since):"";let text;if(name){text=`${name}\nI am currently away. Reason: ${status.reason}${since?` (Away for ${since})`:""}`}else{text=`I am currently away. Reason: ${status.reason}${since?` (Away for ${since})`:""}`}await message.reply(text);save(config)}
};
