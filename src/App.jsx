import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const CITIES = ["Surat","Ahmedabad","Vadodara","Rajkot","Mumbai","Delhi","Bangalore","Pune","Hyderabad","Jaipur","Lucknow","Chennai","Kolkata","Indore","Bhopal","Nagpur","Chandigarh","Kochi"];
const LANGS  = ["English","हिन्दी","ગુજરાતી","मराठी","தமிழ்","తెలుగు","ಕನ್ನಡ","മലയാളം","বাংলা","ਪੰਜਾਬੀ"];
const CITY_ICONS = {Surat:"🏙️",Ahmedabad:"🌆",Vadodara:"🏛️",Rajkot:"🌇",Mumbai:"🌉",Delhi:"🕌",Bangalore:"💻",Pune:"🎓",Hyderabad:"💎",Jaipur:"🏰",Lucknow:"🕍",Chennai:"🌊",Kolkata:"🎨",Indore:"🏗️",Bhopal:"🌿",Nagpur:"🍊",Chandigarh:"🌳",Kochi:"⛵"};
const CITY_STATS = {Surat:{buses:1240,routes:89,riders:"280K",stops:1180,drivers:1740},Ahmedabad:{buses:2100,routes:142,riders:"520K",stops:1960,drivers:2940},Vadodara:{buses:680,routes:56,riders:"160K",stops:640,drivers:950},Rajkot:{buses:540,routes:44,riders:"120K",stops:510,drivers:756},Mumbai:{buses:4800,routes:380,riders:"1.4M",stops:4420,drivers:6720},Delhi:{buses:6200,routes:495,riders:"1.8M",stops:5900,drivers:8680},Bangalore:{buses:3100,routes:220,riders:"740K",stops:2800,drivers:4340},Pune:{buses:1560,routes:118,riders:"380K",stops:1480,drivers:2184},Hyderabad:{buses:2400,routes:176,riders:"600K",stops:2200,drivers:3360},Jaipur:{buses:890,routes:72,riders:"210K",stops:840,drivers:1246},Lucknow:{buses:760,routes:62,riders:"180K",stops:720,drivers:1064},Chennai:{buses:2800,routes:195,riders:"680K",stops:2600,drivers:3920},Kolkata:{buses:3400,routes:240,riders:"820K",stops:3200,drivers:4760},Indore:{buses:620,routes:51,riders:"150K",stops:590,drivers:868},Bhopal:{buses:540,routes:44,riders:"130K",stops:510,drivers:756},Nagpur:{buses:480,routes:38,riders:"110K",stops:450,drivers:672},Chandigarh:{buses:340,routes:28,riders:"80K",stops:320,drivers:476},Kochi:{buses:560,routes:46,riders:"140K",stops:530,drivers:784}};

const ROUTES = [
  {id:1, no:"101",from:"Railway Station",  to:"Airport",        dur:"45 min",fare:"₹25",buses:8, next:"3 min", city:"Surat",    type:"AC",      stops:14,distance:"22 km",freq:"Every 8 min"},
  {id:2, no:"202",from:"City Mall",        to:"Medical College",dur:"30 min",fare:"₹15",buses:12,next:"7 min", city:"Ahmedabad",type:"Non-AC",  stops:10,distance:"14 km",freq:"Every 5 min"},
  {id:3, no:"303",from:"Bus Depot",        to:"IT Park",        dur:"55 min",fare:"₹30",buses:6, next:"12 min",city:"Mumbai",   type:"Electric",stops:18,distance:"28 km",freq:"Every 10 min"},
  {id:4, no:"404",from:"Metro Station",    to:"University",     dur:"25 min",fare:"₹20",buses:15,next:"2 min", city:"Delhi",    type:"AC",      stops:8, distance:"12 km",freq:"Every 3 min"},
  {id:5, no:"505",from:"Airport",          to:"City Center",    dur:"40 min",fare:"₹35",buses:5, next:"9 min", city:"Bangalore",type:"Electric",stops:12,distance:"20 km",freq:"Every 12 min"},
  {id:6, no:"606",from:"Old City",         to:"New Township",   dur:"35 min",fare:"₹18",buses:10,next:"5 min", city:"Hyderabad",type:"Non-AC",  stops:11,distance:"16 km",freq:"Every 6 min"},
  {id:7, no:"707",from:"Central Market",   to:"Tech Hub",       dur:"50 min",fare:"₹28",buses:7, next:"4 min", city:"Pune",     type:"AC",      stops:16,distance:"24 km",freq:"Every 8 min"},
  {id:8, no:"808",from:"Chandni Chowk",    to:"Saket",          dur:"60 min",fare:"₹22",buses:20,next:"1 min", city:"Delhi",    type:"Non-AC",  stops:22,distance:"18 km",freq:"Every 2 min"},
  {id:9, no:"909",from:"Koramangala",      to:"Whitefield",     dur:"70 min",fare:"₹40",buses:4, next:"15 min",city:"Bangalore",type:"Electric",stops:20,distance:"32 km",freq:"Every 15 min"},
  {id:10,no:"1010",from:"Bandra",          to:"Andheri",        dur:"20 min",fare:"₹12",buses:18,next:"2 min", city:"Mumbai",   type:"AC",      stops:7, distance:"8 km", freq:"Every 3 min"},
  {id:11,no:"1111",from:"Jamalpur",        to:"Vastrapur",      dur:"38 min",fare:"₹18",buses:9, next:"6 min", city:"Ahmedabad",type:"Electric",stops:13,distance:"17 km",freq:"Every 7 min"},
  {id:12,no:"1212",from:"Rajiv Chowk",     to:"Dwarka",         dur:"45 min",fare:"₹22",buses:14,next:"3 min", city:"Delhi",    type:"AC",      stops:15,distance:"21 km",freq:"Every 4 min"},
];

const BUSES = [
  {id:"GJ05BT1234",route:"101",driver:"Rajesh Kumar",   conductor:"Mohan Lal",    speed:42,stop:"Udhna Darwaja",      next:"Surat Railway St.",   delay:0,occupancy:67,fuel:"Electric",battery:78,  status:"On Time", rating:4.8,city:"Surat",    fitness:"Valid till Dec 2026",insurance:"Valid till Mar 2027"},
  {id:"MH01AB5678",route:"303",driver:"Suresh Patil",   conductor:"Priya Nair",   speed:38,stop:"Andheri East",       next:"Kurla West",           delay:3,occupancy:89,fuel:"Diesel",  battery:null,status:"Delayed",  rating:4.2,city:"Mumbai",   fitness:"Valid till Oct 2026",insurance:"Valid till Jan 2027"},
  {id:"DL03CD9012",route:"404",driver:"Amit Singh",     conductor:"Ritu Sharma",  speed:55,stop:"Connaught Place",    next:"India Gate",           delay:0,occupancy:45,fuel:"CNG",     battery:null,status:"On Time", rating:4.9,city:"Delhi",    fitness:"Valid till Feb 2027",insurance:"Valid till Jun 2027"},
  {id:"KA01EF3456",route:"505",driver:"Venkat Rao",     conductor:"Lakshmi V",    speed:31,stop:"MG Road",            next:"Indiranagar",          delay:5,occupancy:92,fuel:"Electric",battery:61,  status:"Delayed",  rating:4.5,city:"Bangalore",fitness:"Valid till Nov 2026",insurance:"Valid till Apr 2027"},
  {id:"GJ01GH7890",route:"202",driver:"Dhruv Patel",    conductor:"Kavita Shah",  speed:47,stop:"BRTS Stand",         next:"Paldi",                delay:0,occupancy:34,fuel:"Electric",battery:95,  status:"On Time", rating:4.7,city:"Ahmedabad",fitness:"Valid till Jan 2027",insurance:"Valid till May 2027"},
  {id:"MH02CD3344",route:"1010",driver:"Sanjay More",   conductor:"Anita Desai",  speed:29,stop:"Bandra Stn",         next:"Khar Road",            delay:2,occupancy:78,fuel:"Diesel",  battery:null,status:"Delayed",  rating:4.3,city:"Mumbai",   fitness:"Valid till Sep 2026",insurance:"Valid till Dec 2026"},
  {id:"PB01EF2211",route:"808",driver:"Harpreet Singh", conductor:"Gurpreet Kaur",speed:51,stop:"Chandni Chowk",      next:"Red Fort",             delay:0,occupancy:58,fuel:"CNG",     battery:null,status:"On Time", rating:4.6,city:"Delhi",    fitness:"Valid till Mar 2027",insurance:"Valid till Jul 2027"},
  {id:"TN02GH4455",route:"909",driver:"Murugan S",      conductor:"Meena T",      speed:44,stop:"Anna Salai",         next:"T Nagar",              delay:4,occupancy:81,fuel:"Electric",battery:54,  status:"Delayed",  rating:4.4,city:"Chennai",  fitness:"Valid till Dec 2026",insurance:"Valid till Apr 2027"},
  {id:"MH03IJ6677",route:"707",driver:"Prakash Bhosle", conductor:"Swati Jadhav", speed:36,stop:"Shivajinagar",       next:"Kothrud",              delay:0,occupancy:42,fuel:"CNG",     battery:null,status:"On Time", rating:4.7,city:"Pune",     fitness:"Valid till Feb 2027",insurance:"Valid till Jun 2027"},
  {id:"TS01KL8899",route:"606",driver:"Ravi Reddy",     conductor:"Padma Rao",    speed:49,stop:"Hitech City",        next:"Madhapur",             delay:0,occupancy:63,fuel:"Electric",battery:82,  status:"On Time", rating:4.8,city:"Hyderabad",fitness:"Valid till Jan 2027",insurance:"Valid till May 2027"},
  {id:"RJ01MN1122",route:"202",driver:"Mahesh Sharma",  conductor:"Sunita Joshi", speed:33,stop:"Sindhi Camp",        next:"MI Road",              delay:6,occupancy:77,fuel:"Diesel",  battery:null,status:"Delayed",  rating:4.1,city:"Jaipur",   fitness:"Valid till Oct 2026",insurance:"Valid till Feb 2027"},
  {id:"WB01OP3344",route:"303",driver:"Prosenjit Das",  conductor:"Rimpa Dey",    speed:28,stop:"Esplanade",          next:"Park Street",          delay:0,occupancy:55,fuel:"CNG",     battery:null,status:"On Time", rating:4.5,city:"Kolkata",  fitness:"Valid till Nov 2026",insurance:"Valid till Mar 2027"},
  {id:"GJ06QR5566",route:"1111",driver:"Nilesh Patel",  conductor:"Hiral Shah",   speed:52,stop:"Jamalpur",           next:"Paldi BRTS",           delay:0,occupancy:29,fuel:"Electric",battery:88,  status:"On Time", rating:4.9,city:"Ahmedabad",fitness:"Valid till Mar 2027",insurance:"Valid till Aug 2027"},
  {id:"DL04ST7788",route:"1212",driver:"Sunil Tiwari",  conductor:"Neha Gupta",   speed:46,stop:"Rajiv Chowk",        next:"Janpath",              delay:2,occupancy:71,fuel:"CNG",     battery:null,status:"Delayed",  rating:4.3,city:"Delhi",    fitness:"Valid till Dec 2026",insurance:"Valid till Apr 2027"},
  {id:"KL01UV9900",route:"505",driver:"Arun Nair",      conductor:"Deepa Pillai", speed:39,stop:"Ernakulam Junction", next:"MG Road Kochi",        delay:0,occupancy:48,fuel:"Electric",battery:73,  status:"On Time", rating:4.6,city:"Kochi",    fitness:"Valid till Feb 2027",insurance:"Valid till Jun 2027"},
  {id:"MH04WX2233",route:"1010",driver:"Ramesh Kadam",  conductor:"Pooja Patil",  speed:57,stop:"Dadar",              next:"Matunga",              delay:0,occupancy:82,fuel:"Diesel",  battery:null,status:"On Time", rating:4.4,city:"Mumbai",   fitness:"Valid till Jan 2027",insurance:"Valid till May 2027"},
  {id:"UP01YZ4455",route:"808",driver:"Alok Srivastava",conductor:"Geeta Verma",  speed:41,stop:"Lucknow Junction",  next:"Hazratganj",           delay:3,occupancy:66,fuel:"CNG",     battery:null,status:"Delayed",  rating:4.2,city:"Lucknow",  fitness:"Valid till Nov 2026",insurance:"Valid till Mar 2027"},
  {id:"GJ07AB6677",route:"101",driver:"Jayesh Trivedi", conductor:"Komal Desai",  speed:53,stop:"Surat Station",      next:"Udhna Circle",         delay:0,occupancy:39,fuel:"Electric",battery:91,  status:"On Time", rating:4.8,city:"Surat",    fitness:"Valid till Apr 2027",insurance:"Valid till Aug 2027"},
  {id:"KA02CD8899",route:"909",driver:"Kiran Kumar",    conductor:"Anitha Gowda", speed:35,stop:"Whitefield Gate",    next:"Marathahalli",         delay:7,occupancy:94,fuel:"Electric",battery:43,  status:"Delayed",  rating:4.0,city:"Bangalore",fitness:"Valid till Sep 2026",insurance:"Valid till Jan 2027"},
  {id:"MP01EF0011",route:"606",driver:"Arvind Dubey",   conductor:"Sarika Tiwari",speed:44,stop:"New Market Bhopal",  next:"Hamidia Road",         delay:0,occupancy:52,fuel:"Diesel",  battery:null,status:"On Time", rating:4.5,city:"Bhopal",   fitness:"Valid till Mar 2027",insurance:"Valid till Jul 2027"},
];

const DRIVERS = [
  {id:"D001",name:"Rajesh Kumar", city:"Surat",    vehicle:"GJ05BT1234",trips:2840,rating:4.8,license:"LMV-HMV",exp:"8 yrs", status:"On Duty", phone:"98765 43210",joined:"Mar 2016",accidents:0},
  {id:"D002",name:"Suresh Patil", city:"Mumbai",   vehicle:"MH01AB5678",trips:1920,rating:4.2,license:"HMV",    exp:"5 yrs", status:"On Duty", phone:"91234 56789",joined:"Aug 2019",accidents:1},
  {id:"D003",name:"Amit Singh",   city:"Delhi",    vehicle:"DL03CD9012",trips:3210,rating:4.9,license:"HMV",    exp:"11 yrs",status:"On Duty", phone:"99887 76655",joined:"Jan 2013",accidents:0},
  {id:"D004",name:"Venkat Rao",   city:"Bangalore",vehicle:"KA01EF3456",trips:2100,rating:4.5,license:"LMV-HMV",exp:"7 yrs", status:"On Duty", phone:"87654 32109",joined:"Jun 2017",accidents:0},
  {id:"D005",name:"Dhruv Patel",  city:"Ahmedabad",vehicle:"GJ01GH7890",trips:1450,rating:4.7,license:"HMV",    exp:"4 yrs", status:"On Duty", phone:"76543 21098",joined:"Feb 2020",accidents:0},
  {id:"D006",name:"Sanjay More",  city:"Mumbai",   vehicle:"MH02CD3344", trips:2670,rating:4.3,license:"HMV",   exp:"9 yrs", status:"Off Duty",phone:"65432 10987",joined:"Nov 2015",accidents:2},
];

const COMPLAINTS = [
  {id:"C1001",type:"Overcrowding",       route:"303",city:"Mumbai",   date:"Today 09:14",  status:"Open",       priority:"High",  desc:"Bus extremely overcrowded, passengers unable to board at Andheri East."},
  {id:"C1002",type:"Driver Rash Driving",route:"101",city:"Surat",    date:"Today 08:32",  status:"In Progress",priority:"High",  desc:"Driver was speeding near Udhna overbridge, unsafe for passengers."},
  {id:"C1003",type:"AC Not Working",     route:"404",city:"Delhi",    date:"Yesterday",    status:"Resolved",   priority:"Medium",desc:"AC was not functioning for entire journey. Temperature was very high."},
  {id:"C1004",type:"Dirty Bus",          route:"202",city:"Ahmedabad",date:"Yesterday",    status:"Open",       priority:"Low",   desc:"Bus interior was dirty, seats had stains, floor not cleaned."},
  {id:"C1005",type:"Wrong Fare Charged", route:"505",city:"Bangalore",date:"2 days ago",   status:"In Progress",priority:"Medium",desc:"Conductor charged ₹40 instead of ₹35 for Airport to City Center."},
  {id:"C1006",type:"Late Arrival",       route:"606",city:"Hyderabad",date:"2 days ago",   status:"Resolved",   priority:"Low",   desc:"Bus arrived 18 minutes late at Old City stop, no announcement made."},
];

const STOPS = [
  /* ── SURAT ── */
  {id:"SRT01",name:"Surat Railway Station",    city:"Surat",    type:"start",routes:["101","GJ05BT1234","GJ07AB6677"],lat:21.2060,lng:72.8360,facilities:["Shelter","Seating","Display Board","Drinking Water","Ticket Counter"]},
  {id:"SRT02",name:"Surat Airport",            city:"Surat",    type:"end",  routes:["101","GJ05BT1234","GJ07AB6677"],lat:21.1141,lng:72.7418,facilities:["Shelter","Seating","Lift","Drinking Water"]},
  {id:"SRT03",name:"Udhna Darwaja",            city:"Surat",    type:"mid",  routes:["101","GJ05BT1234"],              lat:21.1895,lng:72.8290,facilities:["Shelter","Seating"]},
  {id:"SRT04",name:"Udhna Circle",             city:"Surat",    type:"mid",  routes:["101","GJ07AB6677"],              lat:21.1920,lng:72.8310,facilities:["Shelter","Seating"]},
  {id:"SRT05",name:"Sarthana Junction",        city:"Surat",    type:"mid",  routes:["101"],                           lat:21.2180,lng:72.8510,facilities:["Shelter","Seating","Display Board"]},
  {id:"SRT06",name:"Adajan Patiya",            city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1970,lng:72.7990,facilities:["Shelter","Seating"]},
  {id:"SRT07",name:"Varachha Road",            city:"Surat",    type:"mid",  routes:["101"],                           lat:21.2080,lng:72.8760,facilities:["Shelter","Seating"]},
  {id:"SRT08",name:"Katargam BRTS",            city:"Surat",    type:"mid",  routes:["101"],                           lat:21.2250,lng:72.8430,facilities:["Shelter","Seating","Display Board"]},
  {id:"SRT09",name:"Piplod",                   city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1650,lng:72.7880,facilities:["Shelter","Seating"]},
  {id:"SRT10",name:"City Light",               city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1720,lng:72.8010,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"SRT11",name:"Ghod Dod Road",            city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1830,lng:72.8150,facilities:["Shelter","Seating"]},
  {id:"SRT12",name:"Althan",                   city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1560,lng:72.7760,facilities:["Shelter","Seating"]},
  {id:"SRT13",name:"Surat Textile Market",     city:"Surat",    type:"mid",  routes:["101"],                           lat:21.2100,lng:72.8400,facilities:["Shelter","Seating"]},
  {id:"SRT14",name:"Lal Darwaja",              city:"Surat",    type:"mid",  routes:["101"],                           lat:21.1960,lng:72.8340,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── AHMEDABAD ── */
  {id:"AMD01",name:"Ahmedabad Railway Station",city:"Ahmedabad",type:"start",routes:["202","1111","GJ01GH7890","GJ06QR5566"],lat:23.0215,lng:72.5988,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"AMD02",name:"Vastrapur",               city:"Ahmedabad",type:"end",  routes:["1111","GJ01GH7890"],               lat:23.0362,lng:72.5293,facilities:["Shelter","Seating","Display Board"]},
  {id:"AMD03",name:"BRTS Paldi",              city:"Ahmedabad",type:"mid",  routes:["202","GJ01GH7890"],                lat:23.0300,lng:72.5870,facilities:["Shelter","Seating","Display Board","Toilet"]},
  {id:"AMD04",name:"Jamalpur",                city:"Ahmedabad",type:"start",routes:["1111","GJ06QR5566"],               lat:23.0170,lng:72.5820,facilities:["Shelter","Seating"]},
  {id:"AMD05",name:"Paldi BRTS",              city:"Ahmedabad",type:"end",  routes:["1111","GJ06QR5566"],               lat:23.0290,lng:72.5760,facilities:["Shelter","Seating","Display Board"]},
  {id:"AMD06",name:"City Mall Ahmedabad",     city:"Ahmedabad",type:"start",routes:["202"],                             lat:23.0395,lng:72.5355,facilities:["Shelter","Seating"]},
  {id:"AMD07",name:"Medical College Ahmedabad",city:"Ahmedabad",type:"end", routes:["202"],                             lat:23.0658,lng:72.5764,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"AMD08",name:"Maninagar",               city:"Ahmedabad",type:"mid",  routes:["202"],                             lat:22.9933,lng:72.6053,facilities:["Shelter","Seating"]},
  {id:"AMD09",name:"Naroda",                  city:"Ahmedabad",type:"mid",  routes:["202"],                             lat:23.0810,lng:72.6370,facilities:["Shelter","Seating"]},
  {id:"AMD10",name:"Isanpur",                 city:"Ahmedabad",type:"mid",  routes:["202"],                             lat:22.9872,lng:72.6181,facilities:["Shelter","Seating"]},
  {id:"AMD11",name:"Gota",                    city:"Ahmedabad",type:"mid",  routes:["1111"],                            lat:23.1178,lng:72.5348,facilities:["Shelter","Seating"]},
  {id:"AMD12",name:"Chandkheda",              city:"Ahmedabad",type:"mid",  routes:["1111"],                            lat:23.1190,lng:72.5770,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── MUMBAI ── */
  {id:"MUM01",name:"Chhatrapati Shivaji Terminus",city:"Mumbai",type:"start",routes:["303","1010","MH01AB5678","MH04WX2233"],lat:18.9402,lng:72.8356,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet","Lift"]},
  {id:"MUM02",name:"Bus Depot Kurla",          city:"Mumbai",   type:"start",routes:["303","MH01AB5678"],                lat:19.0746,lng:72.8846,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"MUM03",name:"IT Park Powai",            city:"Mumbai",   type:"end",  routes:["303","MH01AB5678"],                lat:19.1196,lng:72.9053,facilities:["Shelter","Seating","Display Board"]},
  {id:"MUM04",name:"Bandra Station (W)",       city:"Mumbai",   type:"start",routes:["1010","MH02CD3344"],              lat:19.0596,lng:72.8295,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"MUM05",name:"Andheri Station",          city:"Mumbai",   type:"end",  routes:["1010","MH04WX2233"],              lat:19.1197,lng:72.8465,facilities:["Shelter","Seating","Display Board","Lift"]},
  {id:"MUM06",name:"Andheri East",             city:"Mumbai",   type:"mid",  routes:["303","MH01AB5678"],               lat:19.1190,lng:72.8480,facilities:["Shelter","Seating","Display Board","Lift"]},
  {id:"MUM07",name:"Kurla West",               city:"Mumbai",   type:"mid",  routes:["303","MH01AB5678"],               lat:19.0746,lng:72.8792,facilities:["Shelter","Seating"]},
  {id:"MUM08",name:"Khar Road",                city:"Mumbai",   type:"mid",  routes:["1010","MH02CD3344"],              lat:19.0726,lng:72.8368,facilities:["Shelter","Seating"]},
  {id:"MUM09",name:"Dadar",                    city:"Mumbai",   type:"mid",  routes:["1010","MH04WX2233"],              lat:19.0178,lng:72.8478,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"MUM10",name:"Matunga",                  city:"Mumbai",   type:"mid",  routes:["1010","MH04WX2233"],              lat:19.0268,lng:72.8557,facilities:["Shelter","Seating"]},
  {id:"MUM11",name:"Dharavi",                  city:"Mumbai",   type:"mid",  routes:["303"],                            lat:19.0414,lng:72.8544,facilities:["Shelter","Seating"]},
  {id:"MUM12",name:"Sion",                     city:"Mumbai",   type:"mid",  routes:["303"],                            lat:19.0411,lng:72.8643,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"MUM13",name:"Ghatkopar East",           city:"Mumbai",   type:"mid",  routes:["303"],                            lat:19.0868,lng:72.9088,facilities:["Shelter","Seating","Display Board"]},
  {id:"MUM14",name:"Vikhroli",                 city:"Mumbai",   type:"mid",  routes:["303"],                            lat:19.1050,lng:72.9237,facilities:["Shelter","Seating"]},

  /* ── DELHI ── */
  {id:"DEL01",name:"New Delhi Railway Station",city:"Delhi",    type:"start",routes:["404","808","1212","DL03CD9012","DL04ST7788"],lat:28.6424,lng:77.2199,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet","Lift"]},
  {id:"DEL02",name:"Indira Gandhi Airport",    city:"Delhi",    type:"end",  routes:["1212"],                            lat:28.5561,lng:77.0999,facilities:["Shelter","Seating","Display Board","Lift","Drinking Water"]},
  {id:"DEL03",name:"Connaught Place",          city:"Delhi",    type:"mid",  routes:["404","808","DL03CD9012"],          lat:28.6315,lng:77.2167,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"DEL04",name:"Delhi University North",   city:"Delhi",    type:"end",  routes:["404","DL03CD9012"],                lat:28.6879,lng:77.2066,facilities:["Shelter","Seating","Display Board"]},
  {id:"DEL05",name:"Chandni Chowk",            city:"Delhi",    type:"start",routes:["808","PB01EF2211"],                lat:28.6506,lng:77.2303,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"DEL06",name:"Saket",                    city:"Delhi",    type:"end",  routes:["808","PB01EF2211"],                lat:28.5212,lng:77.2104,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"DEL07",name:"Rajiv Chowk",              city:"Delhi",    type:"start",routes:["1212","DL04ST7788"],               lat:28.6328,lng:77.2197,facilities:["Shelter","Seating","Display Board","Ticket Counter","Lift"]},
  {id:"DEL08",name:"Dwarka Sector 21",         city:"Delhi",    type:"end",  routes:["1212","DL04ST7788"],               lat:28.5519,lng:77.0586,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"DEL09",name:"India Gate",               city:"Delhi",    type:"mid",  routes:["404","DL03CD9012"],                lat:28.6129,lng:77.2295,facilities:["Shelter","Seating"]},
  {id:"DEL10",name:"Lajpat Nagar",             city:"Delhi",    type:"mid",  routes:["808"],                             lat:28.5676,lng:77.2437,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"DEL11",name:"Nehru Place",              city:"Delhi",    type:"mid",  routes:["808"],                             lat:28.5477,lng:77.2514,facilities:["Shelter","Seating","Display Board"]},
  {id:"DEL12",name:"Red Fort",                 city:"Delhi",    type:"mid",  routes:["808","PB01EF2211"],                lat:28.6562,lng:77.2410,facilities:["Shelter","Seating"]},
  {id:"DEL13",name:"Janpath",                  city:"Delhi",    type:"mid",  routes:["1212","DL04ST7788"],               lat:28.6272,lng:77.2194,facilities:["Shelter","Seating"]},
  {id:"DEL14",name:"RK Puram",                 city:"Delhi",    type:"mid",  routes:["1212"],                            lat:28.5624,lng:77.1735,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── BANGALORE ── */
  {id:"BLR01",name:"Kempegowda Bus Station",   city:"Bangalore",type:"start",routes:["505","909","KA01EF3456","KA02CD8899"],lat:12.9780,lng:77.5710,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"BLR02",name:"Kempegowda Airport",       city:"Bangalore",type:"end",  routes:["505","KA01EF3456"],                lat:13.1986,lng:77.7066,facilities:["Shelter","Seating","Display Board","Lift","Drinking Water"]},
  {id:"BLR03",name:"City Center MG Road",      city:"Bangalore",type:"end",  routes:["505"],                             lat:12.9756,lng:77.6099,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"BLR04",name:"Koramangala 5th Block",    city:"Bangalore",type:"start",routes:["909","KA02CD8899"],                lat:12.9279,lng:77.6271,facilities:["Shelter","Seating","Display Board"]},
  {id:"BLR05",name:"Whitefield Main Gate",     city:"Bangalore",type:"end",  routes:["909","KA02CD8899"],                lat:12.9698,lng:77.7500,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"BLR06",name:"MG Road",                  city:"Bangalore",type:"mid",  routes:["505","KA01EF3456"],                lat:12.9756,lng:77.6099,facilities:["Shelter","Seating","Display Board"]},
  {id:"BLR07",name:"Indiranagar 100ft Road",   city:"Bangalore",type:"mid",  routes:["505","KA01EF3456"],                lat:12.9784,lng:77.6408,facilities:["Shelter","Seating"]},
  {id:"BLR08",name:"Marathahalli Bridge",      city:"Bangalore",type:"mid",  routes:["909","KA02CD8899"],                lat:12.9591,lng:77.6971,facilities:["Shelter","Seating","Display Board"]},
  {id:"BLR09",name:"Whitefield Gate",          city:"Bangalore",type:"mid",  routes:["909","KA02CD8899"],                lat:12.9801,lng:77.7300,facilities:["Shelter","Seating"]},
  {id:"BLR10",name:"Electronic City",          city:"Bangalore",type:"mid",  routes:["505"],                             lat:12.8454,lng:77.6614,facilities:["Shelter","Seating","Display Board"]},
  {id:"BLR11",name:"Bannerghatta Road",        city:"Bangalore",type:"mid",  routes:["505"],                             lat:12.9049,lng:77.5967,facilities:["Shelter","Seating"]},
  {id:"BLR12",name:"HSR Layout",               city:"Bangalore",type:"mid",  routes:["909"],                             lat:12.9116,lng:77.6388,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── HYDERABAD ── */
  {id:"HYD01",name:"Mahatma Gandhi Bus Station",city:"Hyderabad",type:"start",routes:["606","TS01KL8899"],               lat:17.3784,lng:78.4784,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"HYD02",name:"Hitech City",              city:"Hyderabad",type:"end",  routes:["606","TS01KL8899"],                lat:17.4449,lng:78.3808,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"HYD03",name:"Old City Charminar",       city:"Hyderabad",type:"start",routes:["606"],                             lat:17.3616,lng:78.4747,facilities:["Shelter","Seating","Display Board"]},
  {id:"HYD04",name:"New Township Kukatpally",  city:"Hyderabad",type:"end",  routes:["606"],                             lat:17.4849,lng:78.3998,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"HYD05",name:"Madhapur",                 city:"Hyderabad",type:"mid",  routes:["606","TS01KL8899"],                lat:17.4484,lng:78.3876,facilities:["Shelter","Seating"]},
  {id:"HYD06",name:"Ameerpet",                 city:"Hyderabad",type:"mid",  routes:["606"],                             lat:17.4352,lng:78.4488,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"HYD07",name:"Begumpet",                 city:"Hyderabad",type:"mid",  routes:["606"],                             lat:17.4444,lng:78.4700,facilities:["Shelter","Seating"]},
  {id:"HYD08",name:"Secunderabad Junction",    city:"Hyderabad",type:"mid",  routes:["606"],                             lat:17.4344,lng:78.4989,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"HYD09",name:"LB Nagar",                 city:"Hyderabad",type:"mid",  routes:["606"],                             lat:17.3485,lng:78.5515,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"HYD10",name:"Dilsukhnagar",             city:"Hyderabad",type:"mid",  routes:["606"],                             lat:17.3683,lng:78.5272,facilities:["Shelter","Seating"]},

  /* ── PUNE ── */
  {id:"PNQ01",name:"Pune Railway Station",     city:"Pune",     type:"start",routes:["707","MH03IJ6677"],                lat:18.5286,lng:73.8744,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"PNQ02",name:"Hinjewadi IT Park",        city:"Pune",     type:"end",  routes:["707","MH03IJ6677"],                lat:18.5912,lng:73.7389,facilities:["Shelter","Seating","Display Board"]},
  {id:"PNQ03",name:"Shivajinagar",             city:"Pune",     type:"mid",  routes:["707","MH03IJ6677"],                lat:18.5303,lng:73.8476,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"PNQ04",name:"Kothrud",                  city:"Pune",     type:"mid",  routes:["707","MH03IJ6677"],                lat:18.5074,lng:73.8077,facilities:["Shelter","Seating"]},
  {id:"PNQ05",name:"Deccan Gymkhana",          city:"Pune",     type:"mid",  routes:["707"],                             lat:18.5167,lng:73.8407,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"PNQ06",name:"Katraj",                   city:"Pune",     type:"mid",  routes:["707"],                             lat:18.4591,lng:73.8625,facilities:["Shelter","Seating"]},
  {id:"PNQ07",name:"Hadapsar",                 city:"Pune",     type:"mid",  routes:["707"],                             lat:18.5006,lng:73.9288,facilities:["Shelter","Seating","Display Board"]},
  {id:"PNQ08",name:"Wakad",                    city:"Pune",     type:"mid",  routes:["707"],                             lat:18.5986,lng:73.7601,facilities:["Shelter","Seating"]},

  /* ── CHENNAI ── */
  {id:"CHN01",name:"Chennai Central",          city:"Chennai",  type:"start",routes:["TN02GH4455"],                      lat:13.0827,lng:80.2707,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"CHN02",name:"T Nagar",                  city:"Chennai",  type:"end",  routes:["TN02GH4455"],                      lat:13.0418,lng:80.2341,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"CHN03",name:"Anna Salai",               city:"Chennai",  type:"mid",  routes:["TN02GH4455"],                      lat:13.0569,lng:80.2491,facilities:["Shelter","Seating","Display Board"]},
  {id:"CHN04",name:"Egmore",                   city:"Chennai",  type:"mid",  routes:["TN02GH4455"],                      lat:13.0799,lng:80.2597,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"CHN05",name:"Tambaram",                 city:"Chennai",  type:"mid",  routes:["TN02GH4455"],                      lat:12.9249,lng:80.1000,facilities:["Shelter","Seating","Display Board"]},
  {id:"CHN06",name:"Guindy",                   city:"Chennai",  type:"mid",  routes:["TN02GH4455"],                      lat:13.0072,lng:80.2209,facilities:["Shelter","Seating"]},
  {id:"CHN07",name:"Koyambedu Bus Terminus",   city:"Chennai",  type:"start",routes:["TN02GH4455"],                      lat:13.0693,lng:80.1961,facilities:["Shelter","Seating","Display Board","Ticket Counter","Toilet"]},
  {id:"CHN08",name:"Velachery",                city:"Chennai",  type:"mid",  routes:["TN02GH4455"],                      lat:12.9815,lng:80.2187,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── KOLKATA ── */
  {id:"KOL01",name:"Howrah Station",           city:"Kolkata",  type:"start",routes:["WB01OP3344"],                      lat:22.5851,lng:88.3425,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"KOL02",name:"Park Street",              city:"Kolkata",  type:"end",  routes:["WB01OP3344"],                      lat:22.5513,lng:88.3527,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"KOL03",name:"Esplanade",                city:"Kolkata",  type:"mid",  routes:["WB01OP3344"],                      lat:22.5626,lng:88.3510,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"KOL04",name:"Dakshineswar",             city:"Kolkata",  type:"mid",  routes:["WB01OP3344"],                      lat:22.6553,lng:88.3578,facilities:["Shelter","Seating"]},
  {id:"KOL05",name:"Jadavpur",                 city:"Kolkata",  type:"mid",  routes:["WB01OP3344"],                      lat:22.4990,lng:88.3720,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"KOL06",name:"Salt Lake Sector V",       city:"Kolkata",  type:"mid",  routes:["WB01OP3344"],                      lat:22.5745,lng:88.4133,facilities:["Shelter","Seating","Display Board"]},

  /* ── JAIPUR ── */
  {id:"JAI01",name:"Sindhi Camp Bus Stand",    city:"Jaipur",   type:"start",routes:["RJ01MN1122"],                      lat:26.9124,lng:75.7873,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"JAI02",name:"MI Road",                  city:"Jaipur",   type:"end",  routes:["RJ01MN1122"],                      lat:26.9173,lng:75.8235,facilities:["Shelter","Seating","Display Board"]},
  {id:"JAI03",name:"Amber Fort Stop",          city:"Jaipur",   type:"mid",  routes:["RJ01MN1122"],                      lat:26.9855,lng:75.8513,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"JAI04",name:"Jaipur Airport",           city:"Jaipur",   type:"mid",  routes:["RJ01MN1122"],                      lat:26.8242,lng:75.8122,facilities:["Shelter","Seating","Display Board"]},
  {id:"JAI05",name:"Raja Park",                city:"Jaipur",   type:"mid",  routes:["RJ01MN1122"],                      lat:26.8979,lng:75.8186,facilities:["Shelter","Seating"]},
  {id:"JAI06",name:"Malviya Nagar",            city:"Jaipur",   type:"mid",  routes:["RJ01MN1122"],                      lat:26.8560,lng:75.8061,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── LUCKNOW ── */
  {id:"LKO01",name:"Lucknow Railway Junction", city:"Lucknow",  type:"start",routes:["UP01YZ4455"],                      lat:26.8318,lng:80.9185,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"LKO02",name:"Hazratganj",               city:"Lucknow",  type:"end",  routes:["UP01YZ4455"],                      lat:26.8588,lng:80.9420,facilities:["Shelter","Seating","Display Board","Drinking Water"]},
  {id:"LKO03",name:"Charbagh Bus Stand",       city:"Lucknow",  type:"mid",  routes:["UP01YZ4455"],                      lat:26.8285,lng:80.9094,facilities:["Shelter","Seating","Display Board","Ticket Counter"]},
  {id:"LKO04",name:"Alambagh",                 city:"Lucknow",  type:"mid",  routes:["UP01YZ4455"],                      lat:26.8000,lng:80.9031,facilities:["Shelter","Seating"]},
  {id:"LKO05",name:"Amausi Airport",           city:"Lucknow",  type:"mid",  routes:["UP01YZ4455"],                      lat:26.7606,lng:80.8893,facilities:["Shelter","Seating","Display Board"]},
  {id:"LKO06",name:"Gomti Nagar",              city:"Lucknow",  type:"mid",  routes:["UP01YZ4455"],                      lat:26.8617,lng:81.0065,facilities:["Shelter","Seating","Drinking Water"]},

  /* ── KOCHI ── */
  {id:"KOC01",name:"Ernakulam Junction",       city:"Kochi",    type:"start",routes:["KL01UV9900"],                      lat:9.9816,lng:76.2999,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water","Toilet"]},
  {id:"KOC02",name:"MG Road Kochi",            city:"Kochi",    type:"end",  routes:["KL01UV9900"],                      lat:9.9860,lng:76.2900,facilities:["Shelter","Seating","Display Board"]},
  {id:"KOC03",name:"Cochin Airport",           city:"Kochi",    type:"mid",  routes:["KL01UV9900"],                      lat:10.1520,lng:76.4019,facilities:["Shelter","Seating","Display Board","Lift"]},
  {id:"KOC04",name:"Aluva",                    city:"Kochi",    type:"mid",  routes:["KL01UV9900"],                      lat:10.1004,lng:76.3527,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"KOC05",name:"Kakkanad",                 city:"Kochi",    type:"mid",  routes:["KL01UV9900"],                      lat:10.0156,lng:76.3414,facilities:["Shelter","Seating"]},

  /* ── BHOPAL ── */
  {id:"BHO01",name:"Bhopal Railway Station",   city:"Bhopal",   type:"start",routes:["MP01EF0011"],                      lat:23.2599,lng:77.4126,facilities:["Shelter","Seating","Display Board","Ticket Counter","Drinking Water"]},
  {id:"BHO02",name:"Hamidia Road",             city:"Bhopal",   type:"end",  routes:["MP01EF0011"],                      lat:23.2656,lng:77.4028,facilities:["Shelter","Seating","Display Board"]},
  {id:"BHO03",name:"New Market Bhopal",        city:"Bhopal",   type:"mid",  routes:["MP01EF0011"],                      lat:23.2323,lng:77.4192,facilities:["Shelter","Seating","Drinking Water"]},
  {id:"BHO04",name:"DB Mall",                  city:"Bhopal",   type:"mid",  routes:["MP01EF0011"],                      lat:23.2180,lng:77.4343,facilities:["Shelter","Seating"]},
  {id:"BHO05",name:"Karond",                   city:"Bhopal",   type:"mid",  routes:["MP01EF0011"],                      lat:23.2888,lng:77.3875,facilities:["Shelter","Seating"]},
];

/* ── CITY_STOPS lookup: all stops grouped by city for journey planner dropdowns ── */
const CITY_STOPS = {};
STOPS.forEach(s => {
  if (!CITY_STOPS[s.city]) CITY_STOPS[s.city] = [];
  CITY_STOPS[s.city].push(s.name);
});
/* Add remaining cities with their key stops */
Object.assign(CITY_STOPS, {
  Vadodara: ["Vadodara Railway Station","Alkapuri Bus Stand","Sayajigunj","Fatehgunj","Manjalpur","Waghodia Road","GIDC Vadodara","Race Course Road"],
  Rajkot:   ["Rajkot Railway Station","Saurashtra University","150 Ft Ring Road","Trikon Baug","Airport Rajkot","Gondal Road","Mavdi","Aji Dam Road"],
  Indore:   ["Indore Railway Station","Sarwate Bus Stand","MG Road Indore","Vijay Nagar","Palasia","Bhawarkua","Airport Indore","Rau"],
  Nagpur:   ["Nagpur Railway Station","Zero Mile","Sitabuldi","Dharampeth","Hingna Road","Kamptee Road","Airport Nagpur","Wadi"],
  Chandigarh:["Chandigarh Bus Terminal","Sector 17","Sector 22","Sector 43 ISBT","Panchkula Sector 1","Mohali Airport","Sector 8","Rock Garden Stop"],
});

const TIMETABLE = [
  {time:"05:30",from:"Railway Station",to:"Airport",status:"Scheduled"},
  {time:"06:00",from:"Railway Station",to:"Airport",status:"Scheduled"},
  {time:"06:30",from:"Railway Station",to:"Airport",status:"On Time"},
  {time:"07:00",from:"Railway Station",to:"Airport",status:"On Time"},
  {time:"07:30",from:"Railway Station",to:"Airport",status:"Running — 3 min delay"},
  {time:"08:00",from:"Railway Station",to:"Airport",status:"Departed"},
  {time:"08:30",from:"Railway Station",to:"Airport",status:"Departed"},
  {time:"09:00",from:"Railway Station",to:"Airport",status:"On Time"},
  {time:"09:30",from:"Railway Station",to:"Airport",status:"Scheduled"},
  {time:"10:00",from:"Railway Station",to:"Airport",status:"Scheduled"},
];

const MAINTENANCE = [
  {id:"M001",vehicle:"GJ05BT1234",type:"Scheduled Service",date:"Jun 30, 2026",status:"Scheduled",  cost:"₹4,200",tech:"Ram Joshi"},
  {id:"M002",vehicle:"MH01AB5678",type:"Engine Check",      date:"Jun 27, 2026",status:"In Progress",cost:"₹8,500",tech:"Sonu Nair"},
  {id:"M003",vehicle:"DL03CD9012",type:"Tyre Replacement",  date:"Jun 25, 2026",status:"Completed",  cost:"₹12,800",tech:"Ravi Kumar"},
  {id:"M004",vehicle:"KA01EF3456",type:"Battery Service",   date:"Jun 28, 2026",status:"Scheduled",  cost:"₹6,000",tech:"Priya Tech"},
  {id:"M005",vehicle:"GJ01GH7890",type:"AC Service",        date:"Jun 29, 2026",status:"Scheduled",  cost:"₹3,500",tech:"Deepak Shah"},
];

const LANDMARKS = [
  {name:"AIIMS Hospital",   type:"Hospital",  icon:"🏥",city:"Delhi",    route:"404"},
  {name:"Phoenix Mall",     type:"Mall",      icon:"🛍️",city:"Mumbai",   route:"1010"},
  {name:"IIT Bombay",       type:"College",   icon:"🎓",city:"Mumbai",   route:"303"},
  {name:"CST Railway",      type:"Railway",   icon:"🚂",city:"Mumbai",   route:"1010"},
  {name:"Chhatrapati Metro",type:"Metro",     icon:"🚇",city:"Mumbai",   route:"303"},
  {name:"Siddhivinayak",    type:"Temple",    icon:"🛕",city:"Mumbai",   route:"303"},
  {name:"Bengaluru Airport",type:"Airport",   icon:"✈️",city:"Bangalore",route:"505"},
  {name:"Forum Mall",       type:"Mall",      icon:"🛍️",city:"Bangalore",route:"909"},
];

const TICKER_MSGS = [
  "🚌 Route 101 Surat: On Time · Next arrival at Railway Station in 3 min",
  "⚡ Route 505 Bangalore Electric: 2 min delay near MG Road · AI rerouting active",
  "🎉 New city live: Chandigarh — 340 buses now active on TransitOne!",
  "🚨 Route 202 Ahmedabad: Rerouted via Vastrapur — road work till 6 PM today",
  "📊 Live: 2.4 million passengers tracked across 127 cities today",
  "🔋 Green milestone: 38% of TransitOne fleet now fully electric",
  "🌧️ Weather alert: Heavy rain Mumbai — Routes 303 & 1010 running 5 min late",
  "🏆 TransitOne wins Best Smart City Solution — India Urban Tech Summit 2026",
];

const NOTIFS = [
  {icon:"🚌",text:"Route 101 bus arriving in 3 minutes at Railway Station",time:"Just now",  unread:true},
  {icon:"⚠️",text:"Route 505 delayed 5 min — traffic on MG Road, Bangalore",time:"4 min ago", unread:true},
  {icon:"✅",text:"Your Monthly Pass renewed successfully — valid till Jul 27",time:"1 hr ago",  unread:true},
  {icon:"📊",text:"Your June trip summary is ready: 142 trips, ₹280 saved",time:"Today 8 AM",unread:false},
  {icon:"🔧",text:"Maintenance alert: Route 202 off 11PM–4AM this Sunday",time:"Yesterday",  unread:false},
  {icon:"🎉",text:"TransitOne loyalty: You've unlocked Gold Member status!",time:"Jun 25",    unread:false},
];

const TABS = ["Home","Live Map","Journey","Routes","Schedule","Smart Search","Passenger","Payment","Cities","Admin","Analytics"];

/* ═══════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#070810;--bg2:#0c0e1c;--bg3:#101428;--bg4:#141830;
  --g1:rgba(255,255,255,0.04);--g2:rgba(255,255,255,0.07);--g3:rgba(255,255,255,0.10);
  --b1:rgba(255,255,255,0.07);--b2:rgba(255,255,255,0.13);--b3:rgba(255,255,255,0.20);
  --t1:#eef0ff;--t2:#9aa3c7;--t3:#525d85;--t4:#2d3456;
  --a:#6366f1;--a2:#818cf8;--a3:#a5b4fc;
  --gr:#10b981;--gr2:#34d399;--gr3:#6ee7b7;
  --am:#f59e0b;--am2:#fbbf24;
  --rd:#ef4444;--rd2:#f87171;
  --pk:#ec4899;--pk2:#f472b6;
  --cy:#06b6d4;--cy2:#22d3ee;
  --grad:linear-gradient(135deg,#6366f1 0%,#8b5cf6 55%,#ec4899 100%);
  --grad2:linear-gradient(135deg,#10b981,#059669);
  --grad3:linear-gradient(135deg,#f59e0b,#ef4444);
  --grad4:linear-gradient(135deg,#06b6d4,#6366f1);
  --grad5:linear-gradient(135deg,#8b5cf6,#ec4899);
  --r:16px;--r2:12px;--r3:8px;--r4:6px;
  --sh:0 8px 40px rgba(0,0,0,0.55);--sh2:0 4px 20px rgba(0,0,0,0.35);
}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden;line-height:1.5}
button,select,input,textarea{font-family:'Inter',sans-serif}
img{display:block}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--b2);border-radius:4px}

/* ─ NAV */
.nav{position:sticky;top:0;z-index:300;background:rgba(7,8,16,0.90);backdrop-filter:blur(32px);-webkit-backdrop-filter:blur(32px);border-bottom:1px solid var(--b1);display:flex;align-items:center;height:58px;padding:0 18px;gap:10px}
.logo{display:flex;align-items:center;gap:8px;flex-shrink:0;cursor:pointer}
.logo-ico{width:32px;height:32px;background:var(--grad);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
.logo-name{font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:15px;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;white-space:nowrap}
.logo-tag{font-size:8.5px;color:var(--t3);letter-spacing:.07em;text-transform:uppercase;margin-top:-2px}
.nav-tabs{flex:1;display:flex;gap:1px;overflow-x:auto;scrollbar-width:none}
.nav-tabs::-webkit-scrollbar{display:none}
.nt{padding:6px 11px;border-radius:6px;cursor:pointer;font-size:11.5px;font-weight:500;color:var(--t3);border:none;background:transparent;white-space:nowrap;transition:all .18s;letter-spacing:.01em}
.nt:hover{color:var(--t2);background:var(--g1)}
.nt.on{color:var(--t1);background:var(--g2);border:1px solid var(--b2)}
.nav-r{display:flex;align-items:center;gap:6px;flex-shrink:0}
.ncity{padding:4px 9px;border-radius:6px;background:var(--g1);border:1px solid var(--b1);color:var(--t2);font-size:11px;cursor:pointer;outline:none;-webkit-appearance:none}
.nib{width:32px;height:32px;border-radius:7px;background:var(--g1);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;position:relative;transition:background .18s}
.nib:hover{background:var(--g2)}
.ndot{position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:50%;background:var(--rd);border:1.5px solid var(--bg)}
.nsign{padding:6px 13px;border-radius:7px;background:var(--grad);border:none;color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;letter-spacing:.03em;transition:opacity .18s}
.nsign:hover{opacity:.88}

/* ─ TICKER */
.ticker{background:rgba(99,102,241,0.07);border-bottom:1px solid var(--b1);padding:5px 18px;display:flex;align-items:center;gap:7px;font-size:11px;color:var(--t2);overflow:hidden;white-space:nowrap}
.tlive{background:var(--rd);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:3px;letter-spacing:.1em;flex-shrink:0;animation:blink 1.6s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}

/* ─ NOTIF PANEL */
.npanel{position:absolute;top:50px;right:12px;width:310px;background:var(--bg2);border:1px solid var(--b2);border-radius:var(--r);box-shadow:var(--sh);z-index:500;overflow:hidden;animation:fadeIn .18s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
.np-head{padding:12px 15px;border-bottom:1px solid var(--b1);display:flex;justify-content:space-between;align-items:center;font-size:12.5px;font-weight:700}
.np-item{padding:11px 15px;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer;transition:background .15s}
.np-item:hover{background:var(--g1)}
.np-item:last-child{border-bottom:none}
.np-dot{width:6px;height:6px;border-radius:50%;background:var(--a);flex-shrink:0;margin-top:3px}

/* ─ HERO */
.hero{position:relative;min-height:88vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:52px 20px 44px;overflow:hidden;text-align:center}
.h-bg{position:absolute;inset:0;background:radial-gradient(ellipse 100% 80% at 50% -5%,rgba(99,102,241,.20),transparent 58%),radial-gradient(ellipse 55% 55% at 90% 90%,rgba(236,72,153,.13),transparent),radial-gradient(ellipse 60% 60% at 0% 75%,rgba(16,185,129,.09),transparent)}
.h-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);background-size:54px 54px;mask-image:radial-gradient(ellipse at center,black 25%,transparent 72%)}
.h-badge{display:inline-flex;align-items:center;gap:7px;padding:5px 15px;border-radius:100px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.28);font-size:10.5px;font-weight:700;color:var(--a2);margin-bottom:22px;letter-spacing:.08em;text-transform:uppercase}
.pulse{width:6px;height:6px;border-radius:50%;background:var(--gr);animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.6)}}
.h-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(30px,5.5vw,68px);font-weight:800;line-height:1.06;letter-spacing:-.038em;margin-bottom:16px;max-width:860px}
.gtext{background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.h-sub{font-size:clamp(13px,1.7vw,17px);color:var(--t2);max-width:560px;line-height:1.8;margin-bottom:34px}
.scard{width:100%;max-width:700px;background:var(--g2);backdrop-filter:blur(28px);-webkit-backdrop-filter:blur(28px);border:1px solid var(--b2);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:9px;position:relative;z-index:2}
.irow{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.inp{background:rgba(255,255,255,0.05);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 13px;color:var(--t1);font-size:13px;outline:none;transition:border .18s;width:100%}
.inp::placeholder{color:var(--t3)}
.inp:focus{border-color:var(--a)}
select.inp{cursor:pointer;-webkit-appearance:none}
.pbtn{width:100%;padding:13px;border-radius:var(--r2);background:var(--grad);border:none;color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;font-family:'Space Grotesk',sans-serif;letter-spacing:.03em;transition:opacity .18s,transform .12s}
.pbtn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
.pbtn:disabled{opacity:.42;cursor:not-allowed}
.hacts{display:flex;gap:9px;flex-wrap:wrap;justify-content:center;margin-top:5px}
.sbtn{padding:9px 18px;border-radius:var(--r2);background:var(--g2);border:1px solid var(--b2);color:var(--t1);font-size:12.5px;font-weight:600;cursor:pointer;transition:all .18s}
.sbtn:hover{background:var(--g3);border-color:var(--b3)}

/* ─ STATS */
.stats-w{padding:32px 18px;max-width:1260px;margin:0 auto;width:100%}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.sc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px;text-align:center;transition:all .28s;cursor:default}
.sc:hover{transform:translateY(-3px);border-color:var(--b2);background:var(--g2)}
.sc-ico{font-size:24px;margin-bottom:7px}
.sc-val{font-family:'Space Grotesk',sans-serif;font-size:28px;font-weight:800;margin-bottom:2px}
.sc-lbl{font-size:10.5px;color:var(--t3);font-weight:600;letter-spacing:.07em;text-transform:uppercase}
.sc-chg{font-size:10px;color:var(--gr);margin-top:4px}

/* ─ SECTION */
.sec{padding:48px 18px;max-width:1260px;margin:0 auto;width:100%}
.sh{margin-bottom:28px}
.ey{font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:7px}
.st{font-family:'Space Grotesk',sans-serif;font-size:clamp(20px,2.8vw,34px);font-weight:800;letter-spacing:-.025em;margin-bottom:8px}
.ss{color:var(--t2);font-size:13.5px;max-width:520px;line-height:1.75}

/* ─ CARDS */
.card{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);transition:all .22s}
.card:hover{border-color:var(--b2);background:var(--g2)}

/* ─ ROUTE CARD */
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(295px,1fr));gap:12px}
.rc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:16px;transition:all .2s;cursor:pointer}
.rc:hover{border-color:var(--b2);background:var(--g2);transform:translateY(-2px)}
.rc-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:11px}
.rcno{font-family:'Space Grotesk',sans-serif;font-size:18px;font-weight:800;color:var(--a2)}
.badge{padding:3px 8px;border-radius:100px;font-size:9.5px;font-weight:700;letter-spacing:.04em}
.bac{background:rgba(99,102,241,.18);color:var(--a2)}
.bel{background:rgba(16,185,129,.18);color:var(--gr)}
.bna{background:rgba(245,158,11,.15);color:var(--am)}
.rpath{display:flex;align-items:center;gap:6px;margin-bottom:11px}
.rdot{width:7px;height:7px;border-radius:50%;background:var(--a);flex-shrink:0}
.rline{flex:1;height:1px;background:var(--b2);position:relative}
.rline::after{content:'▸';position:absolute;right:-4px;top:-6px;font-size:9px;color:var(--b2)}
.rdot2{width:7px;height:7px;border-radius:50%;border:2px solid var(--a);flex-shrink:0}
.rmeta{display:flex;gap:12px;flex-wrap:wrap}
.rm{font-size:10.5px;color:var(--t2)}
.rm span{display:block;font-size:12.5px;font-weight:700;color:var(--t1);margin-bottom:1px}
.racts{display:flex;gap:7px;margin-top:11px}
.rbtn{flex:1;padding:7px;border-radius:7px;border:1px solid var(--b1);background:var(--g1);color:var(--t2);font-size:10.5px;font-weight:600;cursor:pointer;transition:all .18s}
.rbtn:hover{background:var(--g2);color:var(--t1)}
.rbtn.pri{background:rgba(99,102,241,.14);border-color:rgba(99,102,241,.28);color:var(--a2)}
.rbtn.pri:hover{background:rgba(99,102,241,.22)}

/* ─ MAP */
.mwrap{background:var(--bg3);border:1px solid var(--b1);border-radius:var(--r);overflow:hidden}
.mcanv{width:100%;height:440px;position:relative;background:linear-gradient(155deg,#060c1e,#0b1228,#0d1736);overflow:hidden}
.mgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.055) 1px,transparent 1px);background-size:38px 38px}
.mroad{position:absolute;background:rgba(255,255,255,0.06)}
.bm{position:absolute;transform:translate(-50%,-50%);cursor:pointer}
.bd{width:13px;height:13px;border-radius:50%;border:2px solid rgba(255,255,255,.82);display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:800;color:#fff;transition:transform .3s}
.bd:hover{transform:scale(1.4)}
.bok{background:var(--gr)}
.blate{background:var(--rd)}
.bripple{position:absolute;inset:-7px;border-radius:50%;border:1px solid currentColor;animation:ripple 2.4s infinite}
@keyframes ripple{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
.blbl{position:absolute;top:16px;left:50%;transform:translateX(-50%);background:rgba(6,7,14,.9);border:1px solid var(--b1);border-radius:3px;padding:2px 5px;font-size:8px;font-weight:700;white-space:nowrap;color:var(--t2)}
.mtop{position:absolute;top:13px;left:13px;right:13px;display:flex;justify-content:space-between;gap:9px;pointer-events:none}
.mpill{background:rgba(6,7,14,.88);backdrop-filter:blur(14px);border:1px solid var(--b1);border-radius:9px;padding:7px 11px;pointer-events:all}
.mleg{display:flex;gap:10px;align-items:center}
.leg{display:flex;align-items:center;gap:4px;font-size:10px;color:var(--t2)}
.ldot{width:7px;height:7px;border-radius:50%}
.bpanel{position:absolute;bottom:13px;left:13px;right:13px;background:rgba(6,7,14,.92);backdrop-filter:blur(18px);border:1px solid var(--b2);border-radius:12px;padding:13px;display:grid;grid-template-columns:repeat(4,1fr);gap:9px}
.bpl{font-size:9px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.bpv{font-size:12.5px;font-weight:700}
.blist{padding:12px;border-top:1px solid var(--b1);display:flex;gap:9px;overflow-x:auto;scrollbar-width:none}
.blist::-webkit-scrollbar{display:none}
.bchip{background:var(--g1);border:1px solid var(--b1);border-radius:8px;padding:9px 11px;cursor:pointer;min-width:125px;flex-shrink:0;transition:all .18s}
.bchip:hover,.bchip.sel{background:rgba(99,102,241,.12);border-color:var(--a)}

/* ─ AI FEATURE */
.aig{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.aic{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px;transition:all .28s}
.aic:hover{border-color:rgba(99,102,241,.38);background:var(--g2);transform:translateY(-2px)}
.ai-tag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:9.5px;font-weight:700;background:rgba(99,102,241,.14);color:var(--a2);margin-top:7px;letter-spacing:.04em}

/* ─ PLANNER */
.plang{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;margin-bottom:13px}
.plopt{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:15px;cursor:pointer;transition:all .18s;position:relative;overflow:hidden}
.plopt:hover{border-color:var(--a);background:var(--g2)}
.plopt.best::before{content:'BEST';position:absolute;top:8px;right:8px;background:var(--gr);color:#fff;font-size:8.5px;font-weight:800;padding:2px 7px;border-radius:4px;letter-spacing:.07em}
.pll{font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;margin-bottom:7px}
.plt{font-family:'Space Grotesk',sans-serif;font-size:22px;font-weight:800;margin-bottom:4px}
.plf{font-size:12.5px;color:var(--gr);font-weight:700;margin-bottom:8px}
.plm{font-size:10.5px;color:var(--t3);font-weight:600;margin-bottom:8px}
.pls{font-size:11px;color:var(--t2);line-height:1.9}
.pls::before{content:"▸ "}
.pld{font-size:10px;color:var(--am);margin-top:7px;font-weight:600}
.tip-box{background:rgba(99,102,241,.09);border:1px solid rgba(99,102,241,.2);border-radius:var(--r2);padding:12px 15px;font-size:12px;color:var(--t2);display:flex;gap:9px;margin-bottom:11px;line-height:1.6}
.crowd-box{background:rgba(245,158,11,.09);border:1px solid rgba(245,158,11,.22);border-radius:var(--r2);padding:10px 13px;font-size:11.5px;color:var(--am);display:flex;gap:8px;margin-bottom:11px}

/* ─ STOPS */
.stop-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:11px}
.stop-c{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:14px;transition:all .18s}
.stop-c:hover{border-color:var(--b2);background:var(--g2)}

/* ─ SCHEDULE */
.sch-g{display:flex;flex-direction:column;gap:1px;border-radius:var(--r);overflow:hidden;border:1px solid var(--b1)}
.sch-row{display:grid;grid-template-columns:100px 1fr 1fr 140px;align-items:center;padding:11px 16px;background:var(--g1);border-bottom:1px solid rgba(255,255,255,.03);transition:background .15s}
.sch-row:hover{background:var(--g2)}
.sch-row.hdr{background:var(--bg3);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);border-bottom:1px solid var(--b1)}
.sch-row:last-child{border-bottom:none}

/* ─ SMART SEARCH */
.lm-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:11px}
.lm-c{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:14px;cursor:pointer;transition:all .18s;text-align:center}
.lm-c:hover{border-color:var(--a);background:rgba(99,102,241,.07);transform:translateY(-2px)}
.srcat{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.srcat-btn{padding:7px 14px;border-radius:100px;background:var(--g1);border:1px solid var(--b1);color:var(--t2);font-size:11.5px;cursor:pointer;transition:all .18s;font-family:'Inter',sans-serif}
.srcat-btn.on{background:rgba(99,102,241,.18);border-color:var(--a);color:var(--a2)}
.sr-res{display:flex;flex-direction:column;gap:8px;margin-top:16px}
.sr-item{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:12px 15px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .18s}
.sr-item:hover{border-color:var(--b2);background:var(--g2)}

/* ─ CITY */
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(145px,1fr));gap:9px}
.cc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:13px;text-align:center;cursor:pointer;transition:all .18s}
.cc:hover,.cc.on{border-color:var(--a);background:rgba(99,102,241,.07)}
.clive{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:100px;background:rgba(16,185,129,.12);font-size:9px;font-weight:700;color:var(--gr);margin-top:5px}
.cdetail{margin-top:24px;background:var(--g1);border:1px solid var(--b2);border-radius:var(--r);padding:22px}
.ckpi{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px}
.ckpi-c{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:12px}

/* ─ ADMIN */
.al{display:grid;grid-template-columns:190px 1fr;gap:14px;min-height:560px}
.asb{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:11px;display:flex;flex-direction:column;gap:2px}
.an{padding:8px 11px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:500;color:var(--t2);transition:all .18s;display:flex;align-items:center;gap:7px}
.an:hover,.an.on{background:rgba(99,102,241,.13);color:var(--a2)}
.amain{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px;overflow:auto}
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:var(--t3);padding:8px 11px;border-bottom:1px solid var(--b1)}
.tbl td{padding:10px 11px;font-size:12px;border-bottom:1px solid rgba(255,255,255,.03)}
.tbl tr:last-child td{border-bottom:none}
.tbl tbody tr:hover td{background:rgba(255,255,255,.02)}
.sb{padding:3px 8px;border-radius:100px;font-size:9.5px;font-weight:700;display:inline-flex;align-items:center;gap:3px}
.sb-ok{background:rgba(16,185,129,.13);color:var(--gr)}
.sb-late{background:rgba(239,68,68,.13);color:var(--rd)}
.sb-am{background:rgba(245,158,11,.13);color:var(--am)}
.sb-open{background:rgba(239,68,68,.13);color:var(--rd)}
.sb-prog{background:rgba(245,158,11,.13);color:var(--am)}
.sb-done{background:rgba(16,185,129,.13);color:var(--gr)}
.sb-hi{background:rgba(239,68,68,.13);color:var(--rd)}
.sb-md{background:rgba(245,158,11,.13);color:var(--am)}
.sb-lo{background:rgba(99,102,241,.13);color:var(--a2)}
.addbtn{padding:7px 13px;border-radius:7px;background:var(--grad);border:none;color:#fff;font-size:11.5px;font-weight:700;cursor:pointer;transition:opacity .18s}
.addbtn:hover{opacity:.88}
.krow{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:18px}
.kc{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:13px}
.kv{font-family:'Space Grotesk',sans-serif;font-size:20px;font-weight:800;margin-bottom:2px}
.kl{font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.06em}
.kchg{font-size:9.5px;margin-top:4px}
.obar{display:inline-block;width:60px;height:4px;background:var(--b1);border-radius:2px;vertical-align:middle;margin-right:4px;position:relative;overflow:hidden}
.obar::after{content:'';position:absolute;left:0;top:0;height:100%;border-radius:2px;background:var(--gr)}
.ab{padding:3px 8px;border-radius:6px;background:rgba(99,102,241,.14);border:none;color:var(--a2);font-size:10.5px;font-weight:600;cursor:pointer}

/* ─ ANALYTICS */
.ang{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}
.anc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px}
.ant{font-size:13.5px;font-weight:700;margin-bottom:16px}
.bch{display:flex;align-items:flex-end;gap:6px;height:130px}
.bg{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bb{width:100%;border-radius:5px 5px 0 0;min-width:16px}
.bl{font-size:9px;color:var(--t3)}
.bv{font-size:9px;color:var(--t2);font-weight:600}
.dw{display:flex;gap:18px;align-items:center}
.dlg{display:flex;flex-direction:column;gap:7px}
.di{display:flex;align-items:center;gap:6px;font-size:11px}
.dd{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.prg{display:flex;flex-direction:column;gap:9px}
.pri{display:flex;flex-direction:column;gap:4px}
.prm{display:flex;justify-content:space-between;font-size:11.5px}
.prb{height:5px;background:var(--b1);border-radius:3px}
.prf{height:100%;border-radius:3px;transition:width 1.2s ease}

/* ─ PASSENGER */
.pl{display:grid;grid-template-columns:190px 1fr;gap:14px}
.psb{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:11px;display:flex;flex-direction:column;gap:2px}
.pm{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px}
.ppro{display:flex;align-items:center;gap:12px;padding:14px;background:var(--g2);border-radius:var(--r2);margin-bottom:18px}
.ava{width:48px;height:48px;border-radius:50%;background:var(--grad);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.tlist{display:flex;flex-direction:column;gap:7px}
.ti{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:12px;display:flex;align-items:center;gap:11px;transition:background .15s}
.ti:hover{background:rgba(255,255,255,.05)}
.qrbox{background:rgba(255,255,255,.96);border-radius:var(--r);padding:14px;width:fit-content}
.pcard{background:linear-gradient(135deg,#181d3a,#0d1429);border:1px solid var(--b2);border-radius:15px;padding:20px;position:relative;overflow:hidden}
.pcard::before{content:'';position:absolute;top:-40px;right:-40px;width:130px;height:130px;border-radius:50%;background:rgba(99,102,241,.12)}
.pcard::after{content:'';position:absolute;bottom:-30px;left:-30px;width:100px;height:100px;border-radius:50%;background:rgba(236,72,153,.08)}
.fav-l{display:flex;flex-direction:column;gap:7px}
.fav-i{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:11px 14px;display:flex;align-items:center;justify-content:space-between;transition:background .15s}
.fav-i:hover{background:rgba(255,255,255,.05)}
.nr-g{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:9px}
.nr-c{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:13px}
.sos-btn{width:136px;height:136px;border-radius:50%;background:var(--rd);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:3px;margin:0 auto 18px;animation:sospulse 2s infinite;transition:transform .15s,background .2s}
.sos-btn:hover{transform:scale(1.05)}
.sos-btn.act{background:#b91c1c;animation:none}
@keyframes sospulse{0%{box-shadow:0 0 0 0 rgba(239,68,68,.5)}70%{box-shadow:0 0 0 22px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}
.em-g{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}
.em-c{background:rgba(255,255,255,.03);border:1px solid var(--b1);border-radius:var(--r2);padding:13px;text-align:center;cursor:pointer;transition:all .18s}
.em-c:hover{border-color:var(--b2);background:rgba(255,255,255,.05)}

/* ─ PAYMENT */
.pay-g{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin-bottom:18px}
.pt{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:16px;cursor:pointer;text-align:center;transition:all .18s}
.pt.on{border-color:var(--a);background:rgba(99,102,241,.09)}
.pm-g{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin-bottom:18px}
.pmb{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:13px;text-align:center;cursor:pointer;font-size:12.5px;font-weight:600;transition:all .18s}
.pmb:hover{border-color:var(--b2);background:var(--g2)}
.pmb.on{border-color:var(--a);background:rgba(99,102,241,.09)}
.pconf{background:var(--grad);border:none;color:#fff;width:100%;padding:13px;border-radius:var(--r2);font-size:13.5px;font-weight:800;cursor:pointer;font-family:'Space Grotesk',sans-serif;margin-top:8px;transition:opacity .18s}
.pconf:hover{opacity:.88}
.psuc{text-align:center;padding:36px 18px}
.pchk{font-size:62px;margin-bottom:14px;animation:pop .38s ease}
@keyframes pop{0%{transform:scale(0)}80%{transform:scale(1.18)}100%{transform:scale(1)}}

/* ─ CHAT */
.chat{display:flex;flex-direction:column;height:440px;background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);overflow:hidden}
.chat-h{padding:12px 16px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:9px;background:var(--g2)}
.chat-b{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:9px}
.cm{max-width:78%;padding:9px 13px;border-radius:11px;font-size:12.5px;line-height:1.6}
.cm.ai{background:var(--g2);border:1px solid var(--b1);align-self:flex-start;border-radius:3px 11px 11px 11px}
.cm.user{background:rgba(99,102,241,.18);border:1px solid rgba(99,102,241,.24);align-self:flex-end;border-radius:11px 3px 11px 11px}
.chat-ir{display:flex;gap:7px;padding:11px;border-top:1px solid var(--b1)}
.chat-inp{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--b1);border-radius:8px;padding:8px 12px;color:var(--t1);font-size:12.5px;outline:none}
.chat-inp:focus{border-color:var(--a)}
.csend{padding:8px 14px;border-radius:8px;background:var(--grad);border:none;color:#fff;font-size:12.5px;font-weight:700;cursor:pointer;transition:opacity .18s}
.csend:hover{opacity:.88}
.csend:disabled{opacity:.45;cursor:not-allowed}

/* ─ MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(8px);z-index:600;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .18s ease}
.modal{background:var(--bg2);border:1px solid var(--b2);border-radius:var(--r);padding:24px;max-width:560px;width:100%;max-height:85vh;overflow-y:auto;position:relative;box-shadow:var(--sh)}
.modal-x{position:absolute;top:14px;right:14px;width:28px;height:28px;border-radius:6px;background:var(--g2);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px}

/* ─ CITY REGISTER */
.reg-g{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px}
.reg-inp{background:rgba(255,255,255,.05);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 13px;color:var(--t1);font-size:12.5px;outline:none;transition:border .18s;width:100%}
.reg-inp:focus{border-color:var(--a)}
.reg-lbl{font-size:11px;font-weight:600;color:var(--t2);margin-bottom:5px}

/* ─ ALERT BAR */
.abar{background:linear-gradient(90deg,rgba(239,68,68,.14),rgba(239,68,68,.04));border:1px solid rgba(239,68,68,.24);border-radius:var(--r2);padding:10px 14px;display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:12px;line-height:1.5}
.abar.warn{background:linear-gradient(90deg,rgba(245,158,11,.12),rgba(245,158,11,.03));border-color:rgba(245,158,11,.22)}
.abar.info{background:linear-gradient(90deg,rgba(16,185,129,.1),rgba(16,185,129,.02));border-color:rgba(16,185,129,.2)}

/* ─ LOADING */
.ld{display:flex;gap:5px;justify-content:center;padding:18px}
.ldd{width:6px;height:6px;border-radius:50%;background:var(--a);animation:ld .68s infinite}
.ldd:nth-child(2){animation-delay:.12s}
.ldd:nth-child(3){animation-delay:.24s}
@keyframes ld{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}

/* ─ FOOTER */
.foot{background:var(--bg2);border-top:1px solid var(--b1);padding:42px 18px 18px;margin-top:auto}
.fi{max-width:1260px;margin:0 auto}
.fg{display:grid;grid-template-columns:2fr repeat(4,1fr);gap:32px;margin-bottom:32px}
.flo{font-family:'Space Grotesk',sans-serif;font-size:17px;font-weight:800;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:9px}
.fd{font-size:12px;color:var(--t3);line-height:1.72;max-width:250px;margin-bottom:14px}
.fst{display:flex;gap:7px;flex-wrap:wrap}
.fs{padding:6px 12px;border-radius:7px;background:rgba(255,255,255,.05);border:1px solid var(--b1);color:var(--t2);font-size:11px;font-weight:600;cursor:pointer}
.fct{font-size:10.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--t2);margin-bottom:11px}
.fl{display:block;font-size:12px;color:var(--t3);margin-bottom:7px;cursor:pointer;transition:color .18s}
.fl:hover{color:var(--t2)}
.fbtm{display:flex;justify-content:space-between;align-items:center;padding-top:18px;border-top:1px solid var(--b1);font-size:11px;color:var(--t3);flex-wrap:wrap;gap:9px}
.fbdg{display:flex;gap:7px;flex-wrap:wrap}
.fbdgi{padding:4px 9px;border-radius:5px;background:var(--g1);border:1px solid var(--b1);font-size:10px;color:var(--t3)}

/* ─ RESPONSIVE */
@media(max-width:960px){
  .sgrid{grid-template-columns:repeat(2,1fr)}
  .ang{grid-template-columns:1fr}
  .al{grid-template-columns:1fr}.asb{flex-direction:row;flex-wrap:wrap}
  .pl{grid-template-columns:1fr}.psb{flex-direction:row;flex-wrap:wrap}
  .fg{grid-template-columns:1fr 1fr;gap:22px}
  .plang{grid-template-columns:1fr}
  .pay-g{grid-template-columns:1fr}
  .krow{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:600px){
  .irow{grid-template-columns:1fr}
  .hacts{flex-direction:column}
  .fg{grid-template-columns:1fr}
  .bpanel{grid-template-columns:repeat(2,1fr)}
  .nav-tabs{display:none}
  .rgrid{grid-template-columns:1fr}
  .pm-g{grid-template-columns:1fr}
  .reg-g{grid-template-columns:1fr}
  .em-g{grid-template-columns:1fr}
  .krow{grid-template-columns:repeat(2,1fr)}
}
`;

/* ═══════════════════════════════════════════════════════════════
   UTR STEP COMPONENT
═══════════════════════════════════════════════════════════════ */
/* shared UTR queue — lifted into module scope so both UtrStep and
   the Admin panel can read/write the same array via a ref            */
const _utrQueue = { current: [] };
let   _utrListeners = [];
function useUtrQueue() {
  const [q, setQ] = useState(_utrQueue.current);
  useEffect(() => {
    const cb = (newQ) => setQ([...newQ]);
    _utrListeners.push(cb);
    return () => { _utrListeners = _utrListeners.filter(l => l !== cb); };
  }, []);
  const push = (entry) => {
    _utrQueue.current = [entry, ..._utrQueue.current];
    _utrListeners.forEach(l => l(_utrQueue.current));
  };
  const update = (id, patch) => {
    _utrQueue.current = _utrQueue.current.map(e => e.id === id ? {...e,...patch} : e);
    _utrListeners.forEach(l => l(_utrQueue.current));
  };
  return { q, push, update };
}

/* ── UTR ADMIN QUEUE (Admin side) ── */
function UtrAdminQueue() {
  const { q, update } = useUtrQueue();
  const [filter,   setFilter]   = useState("all");   // all|pending|approved|rejected
  const [selEntry, setSelEntry] = useState(null);
  const [adminNote,setAdminNote]= useState("");
  const [acting,   setActing]   = useState(false);

  const displayed = filter === "all" ? q : q.filter(e => e.adminStatus === filter);
  const counts = {
    pending:  q.filter(e=>e.adminStatus==="pending").length,
    approved: q.filter(e=>e.adminStatus==="approved").length,
    rejected: q.filter(e=>e.adminStatus==="rejected").length,
  };

  const act = async (id, decision) => {
    setActing(true);
    await new Promise(r=>setTimeout(r,600));
    update(id, { adminStatus: decision, adminNote: adminNote.trim() || (decision==="approved"?"Payment verified successfully.":"Could not verify this UTR. Please resubmit or contact support."), reviewedAt: new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}) });
    setSelEntry(null); setAdminNote(""); setActing(false);
  };

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>UTR Payment Queue</div>
          <div style={{fontSize:11.5,color:"var(--t3)",marginTop:2}}>Review and approve UPI payment submissions from passengers</div>
        </div>
        {counts.pending>0&&<div style={{padding:"5px 13px",borderRadius:100,background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",fontSize:11.5,fontWeight:700,color:"var(--am)"}}>
          ⏳ {counts.pending} pending
        </div>}
      </div>

      {/* KPI strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:16}}>
        {[{l:"Total Submissions",v:q.length,c:"var(--a2)"},{l:"Pending Review",v:counts.pending,c:"var(--am)"},{l:"Approved Today",v:counts.approved,c:"var(--gr)"}].map(k=>(
          <div key={k.l} style={{background:"rgba(255,255,255,.03)",borderRadius:"var(--r2)",padding:"11px 13px"}}>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:k.c,marginBottom:2}}>{k.v}</div>
            <div style={{fontSize:10,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em"}}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{display:"flex",gap:7,marginBottom:14}}>
        {[["all","All"],["pending","⏳ Pending"],["approved","✅ Approved"],["rejected","❌ Rejected"]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{padding:"6px 13px",borderRadius:100,background:filter===v?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${filter===v?"var(--a)":"var(--b1)"}`,color:filter===v?"var(--a2)":"var(--t2)",fontSize:11.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s"}}>{l}</button>
        ))}
      </div>

      {/* Empty state */}
      {displayed.length===0&&(
        <div style={{textAlign:"center",padding:"44px 18px",color:"var(--t3)"}}>
          <div style={{fontSize:38,marginBottom:11}}>{filter==="pending"?"⏳":"✅"}</div>
          <div style={{fontSize:14,fontWeight:600,color:"var(--t2)",marginBottom:6}}>
            {filter==="pending"?"No pending UTR submissions":"No entries in this category"}
          </div>
          <div style={{fontSize:12}}>
            {filter==="pending"
              ? "When passengers submit UTR numbers after UPI payment, they appear here for review."
              : "Switch filter to see other entries."}
          </div>
        </div>
      )}

      {/* Queue table */}
      {displayed.length>0&&(
        <table className="tbl" style={{marginBottom:18}}>
          <thead>
            <tr>
              <th>Ticket ID</th><th>UTR Number</th><th>Name</th><th>Pass</th>
              <th>Amount</th><th>Submitted</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map(e=>(
              <tr key={e.id} style={{background:selEntry?.id===e.id?"rgba(99,102,241,.06)":"transparent"}}>
                <td style={{fontSize:10.5,color:"var(--t3)",fontFamily:"monospace"}}>{e.id}</td>
                <td style={{fontWeight:800,fontSize:13,color:"var(--a2)",letterSpacing:".08em",fontFamily:"monospace"}}>{e.utr}</td>
                <td style={{fontWeight:600}}>{e.name}</td>
                <td style={{fontSize:11.5}}>{e.pass}<br/><span style={{color:"var(--t3)",fontSize:10}}>{e.city}</span></td>
                <td style={{fontWeight:700,color:"var(--gr)"}}>{e.amount}</td>
                <td style={{fontSize:11,color:"var(--t3)"}}>{e.submittedAt}</td>
                <td>
                  <span className={`sb ${e.adminStatus==="approved"?"sb-ok":e.adminStatus==="rejected"?"sb-late":"sb-am"}`}>
                    ● {e.adminStatus.charAt(0).toUpperCase()+e.adminStatus.slice(1)}
                  </span>
                </td>
                <td>
                  {e.adminStatus==="pending"
                    ? <button className="ab" onClick={()=>{ setSelEntry(e); setAdminNote(""); }}>Review</button>
                    : <button className="ab" style={{opacity:.6}} onClick={()=>setSelEntry(e)}>View</button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ── REVIEW PANEL ── */}
      {selEntry&&(
        <div style={{background:"var(--bg3)",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:20,marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>
              {selEntry.adminStatus==="pending"?"🔍 Review Submission":"📋 Submission Detail"}
            </div>
            <button onClick={()=>setSelEntry(null)} style={{width:28,height:28,borderRadius:6,background:"var(--g2)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
          </div>

          {/* Details grid */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
            {[
              ["Ticket ID",    selEntry.id,       "var(--a2)"],
              ["UTR Number",   selEntry.utr,      "var(--am)"],
              ["Payer Name",   selEntry.name,     "var(--t1)"],
              ["Mobile",       selEntry.phone,    "var(--t2)"],
              ["Email",        selEntry.email,    "var(--t2)"],
              ["Pass Type",    selEntry.pass,     "var(--t1)"],
              ["City/Routes",  selEntry.city,     "var(--t2)"],
              ["Amount",       selEntry.amount,   "var(--gr)"],
              ["Paid To",      "transitone@upi","var(--t2)"],
              ["Submitted At", selEntry.submittedAt,"var(--t3)"],
              ["Passenger Note",selEntry.note,   "var(--t2)"],
              ["Status",       selEntry.adminStatus.toUpperCase(), selEntry.adminStatus==="approved"?"var(--gr)":selEntry.adminStatus==="rejected"?"var(--rd)":"var(--am)"],
            ].map(([l,v,c])=>(
              <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:9.5,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
                <div style={{fontSize:12.5,fontWeight:700,color:c,wordBreak:"break-all"}}>{v}</div>
              </div>
            ))}
          </div>

          {/* Admin verification instructions */}
          {selEntry.adminStatus==="pending"&&(
            <div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.22)",borderRadius:"var(--r2)",padding:"11px 14px",marginBottom:14,fontSize:12,color:"var(--am)",lineHeight:1.7}}>
              <strong>🏦 How to verify:</strong> Open your bank app or Google Pay → check if UTR <strong style={{fontFamily:"monospace",letterSpacing:".08em"}}>{selEntry.utr}</strong> appears in your received payments for <strong>{selEntry.amount}</strong> from <strong>{selEntry.name}</strong>.
            </div>
          )}

          {/* Admin note */}
          {selEntry.adminStatus==="pending"&&(
            <div style={{marginBottom:14}}>
              <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:6}}>Admin Note (optional)</div>
              <input
                className="inp"
                placeholder="Add a note visible to the passenger (e.g. reason for rejection)"
                value={adminNote}
                onChange={e=>setAdminNote(e.target.value)}
              />
            </div>
          )}

          {/* Already reviewed note */}
          {selEntry.adminStatus!=="pending"&&selEntry.adminNote&&(
            <div style={{background:"rgba(255,255,255,.03)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"11px 14px",marginBottom:14}}>
              <div style={{fontSize:10.5,color:"var(--t3)",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>Admin Note</div>
              <div style={{fontSize:12.5,color:"var(--t2)"}}>{selEntry.adminNote}</div>
              {selEntry.reviewedAt&&<div style={{fontSize:10.5,color:"var(--t3)",marginTop:4}}>Reviewed: {selEntry.reviewedAt}</div>}
            </div>
          )}

          {/* Action buttons */}
          {selEntry.adminStatus==="pending"&&(
            <div style={{display:"flex",gap:10}}>
              <button
                onClick={()=>act(selEntry.id,"approved")}
                disabled={acting}
                style={{flex:1,padding:"11px 0",borderRadius:"var(--r2)",background:"var(--grad2)",border:"none",color:"#fff",fontSize:13.5,fontWeight:800,cursor:"pointer",opacity:acting?.6:1,transition:"opacity .18s"}}
              >
                {acting?"Processing…":"✅ Approve — Activate Pass"}
              </button>
              <button
                onClick={()=>act(selEntry.id,"rejected")}
                disabled={acting}
                style={{flex:1,padding:"11px 0",borderRadius:"var(--r2)",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.35)",color:"var(--rd)",fontSize:13.5,fontWeight:800,cursor:"pointer",opacity:acting?.6:1,transition:"opacity .18s"}}
              >
                {acting?"Processing…":"❌ Reject — Notify Passenger"}
              </button>
            </div>
          )}
          {selEntry.adminStatus!=="pending"&&(
            <div style={{textAlign:"center",fontSize:12.5,color:"var(--t3)"}}>
              This submission has already been <strong style={{color:selEntry.adminStatus==="approved"?"var(--gr)":"var(--rd)"}}>{selEntry.adminStatus}</strong>.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */

/* ── UTR SUBMISSION STEP (Passenger side) ── */
function UtrStep({ selPass, city, onSuccess, onBack }) {
  const [utr,    setUtr]    = useState("");
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [email,  setEmail]  = useState("");
  const [note,   setNote]   = useState("");
  const [status, setStatus] = useState("idle"); // idle|submitting|pending|error|invalid|approved|rejected
  const [errMsg, setErrMsg] = useState("");
  const [ticket, setTicket] = useState(null);
  const { push, q, update } = useUtrQueue();

  const PRICES = {"Single Trip":"₹25","Day Pass":"₹80","Monthly Pass":"₹500","Annual Pass":"₹4,999","Student Pass":"₹300","Senior Pass":"₹250"};
  const price  = PRICES[selPass] || "₹25";
  const isValidUtr = v => /^[0-9]{12}$/.test(v.trim());

  /* poll for approval once submitted */
  useEffect(() => {
    if (!ticket) return;
    const found = q.find(e => e.id === ticket.id);
    if (!found) return;
    if (found.adminStatus === "approved") setStatus("approved");
    if (found.adminStatus === "rejected") setStatus("rejected");
  }, [q, ticket]);

  const handleSubmit = async () => {
    const t = utr.trim();
    if (!t)              { setErrMsg("Please enter your UTR number.");                        setStatus("invalid"); return; }
    if (!isValidUtr(t))  { setErrMsg("UTR must be exactly 12 digits — numbers only.");        setStatus("invalid"); return; }
    if (!name.trim())    { setErrMsg("Please enter the name used for payment.");              setStatus("error");   return; }
    if (phone && !/^[6-9]\d{9}$/.test(phone)) { setErrMsg("Enter a valid 10-digit mobile number."); setStatus("error"); return; }

    /* check for duplicate UTR */
    if (q.some(e => e.utr === t)) {
      setErrMsg("This UTR has already been submitted. If you think this is an error, contact support.");
      setStatus("error"); return;
    }

    setStatus("submitting"); setErrMsg("");
    await new Promise(r => setTimeout(r, 900));

    const entry = {
      id:          "UTR-" + Date.now(),
      utr:         t,
      name:        name.trim(),
      phone:       phone || "—",
      email:       email || "—",
      note:        note  || "—",
      pass:        selPass,
      city:        city === "All Cities" ? "All Routes" : city,
      amount:      price,
      submittedAt: new Date().toLocaleString("en-IN", {dateStyle:"medium", timeStyle:"short"}),
      adminStatus: "pending",   // pending | approved | rejected
      adminNote:   "",
    };
    push(entry);
    setTicket(entry);
    setStatus("pending");
  };

  /* ── APPROVED ── */
  if (status === "approved" && ticket) {
    const approved = q.find(e => e.id === ticket.id) || ticket;
    return (
      <div style={{maxWidth:540,margin:"0 auto",textAlign:"center",padding:"10px 0"}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(16,185,129,.15)",border:"2px solid var(--gr)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:42,animation:"pop .4s ease"}}>✅</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,marginBottom:7}}>Payment Approved!</div>
        <div style={{color:"var(--t2)",fontSize:13,marginBottom:22,lineHeight:1.8}}>
          Admin has verified your UTR <strong style={{color:"var(--a2)"}}>{ticket.utr}</strong>.<br/>
          Your <strong style={{color:"var(--a2)"}}>{selPass}</strong> is now <strong style={{color:"var(--gr)"}}>ACTIVE</strong>!
        </div>
        <div style={{background:"linear-gradient(135deg,rgba(16,185,129,.12),rgba(99,102,241,.08))",border:"1px solid rgba(16,185,129,.3)",borderRadius:"var(--r)",padding:20,marginBottom:22,textAlign:"left"}}>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gr)",marginBottom:13}}>✅ Verified Receipt</div>
          {[["Ticket ID",ticket.id,"var(--a2)"],["UTR Number",ticket.utr,"var(--a2)"],["Payer Name",ticket.name,"var(--t1)"],["Pass Type",ticket.pass,"var(--t1)"],["Amount",ticket.amount,"var(--gr)"],["City / Routes",ticket.city,"var(--t1)"],["Paid To","TransitOne India · transitone@upi","var(--t2)"],["Submitted",ticket.submittedAt,"var(--t2)"],["Status","✅ Approved by Admin","var(--gr)"],["Admin Note",approved.adminNote||"Payment verified successfully","var(--t2)"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <span style={{fontSize:11.5,color:"var(--t3)"}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,color:c,textAlign:"right",maxWidth:"58%",wordBreak:"break-all"}}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="pbtn" style={{maxWidth:200,padding:"11px 0",fontSize:12}} onClick={onSuccess}>📲 View QR Ticket</button>
          <button className="sbtn" style={{fontSize:12}} onClick={()=>setToast("📄 Receipt PDF download — ready in 30 seconds. Check your email.")}>📄 Download Receipt</button>
        </div>
      </div>
    );
  }

  /* ── REJECTED ── */
  if (status === "rejected" && ticket) {
    const rej = q.find(e => e.id === ticket.id) || ticket;
    return (
      <div style={{maxWidth:540,margin:"0 auto",textAlign:"center",padding:"10px 0"}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(239,68,68,.13)",border:"2px solid var(--rd)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:40}}>❌</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,marginBottom:7}}>Payment Rejected</div>
        <div style={{color:"var(--t2)",fontSize:13,marginBottom:18,lineHeight:1.8}}>Admin could not verify UTR <strong style={{color:"var(--rd)"}}>{ticket.utr}</strong>.</div>
        {rej.adminNote && <div style={{background:"rgba(239,68,68,.09)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"11px 14px",marginBottom:18,fontSize:12.5,color:"var(--rd)",textAlign:"left"}}>
          <strong>Admin note:</strong> {rej.adminNote}
        </div>}
        <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:22,lineHeight:1.7}}>Please double-check the UTR in your UPI app and resubmit, or contact support.</div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="pbtn" style={{maxWidth:200,padding:"11px 0",fontSize:12}} onClick={()=>{ setStatus("idle"); setUtr(""); setTicket(null); }}>🔄 Try Again</button>
          <button className="sbtn" style={{fontSize:12}} onClick={onBack}>← Back</button>
        </div>
      </div>
    );
  }

  /* ── PENDING (waiting for admin) ── */
  if (status === "pending" && ticket) {
    return (
      <div style={{maxWidth:540,margin:"0 auto",textAlign:"center",padding:"10px 0"}}>
        <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(245,158,11,.12)",border:"2px solid var(--am)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:38}}>⏳</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:21,fontWeight:800,marginBottom:7}}>Awaiting Admin Verification</div>
        <div style={{color:"var(--t2)",fontSize:13,marginBottom:22,lineHeight:1.8}}>
          Your UTR <strong style={{color:"var(--am)"}}>{ticket.utr}</strong> has been submitted.<br/>
          An admin will verify your payment shortly and activate your pass.
        </div>

        {/* Ticket summary */}
        <div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.25)",borderRadius:"var(--r)",padding:18,marginBottom:22,textAlign:"left"}}>
          <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"var(--am)",marginBottom:12}}>📋 Submission Details</div>
          {[["Ticket ID",ticket.id,"var(--a2)"],["UTR Number",ticket.utr,"var(--am)"],["Payer Name",ticket.name,"var(--t1)"],["Pass Type",ticket.pass+" — "+ticket.city,"var(--t1)"],["Amount",ticket.amount,"var(--gr)"],["Submitted At",ticket.submittedAt,"var(--t2)"],["Status","⏳ Pending Admin Review","var(--am)"]].map(([l,v,c])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
              <span style={{fontSize:11.5,color:"var(--t3)"}}>{l}</span>
              <span style={{fontSize:12,fontWeight:700,color:c,textAlign:"right",maxWidth:"58%",wordBreak:"break-all"}}>{v}</span>
            </div>
          ))}
        </div>

        {/* Live pulse indicator */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9,marginBottom:22,color:"var(--t2)",fontSize:12.5}}>
          <span style={{width:9,height:9,borderRadius:"50%",background:"var(--am)",display:"inline-block",animation:"pulse 1.8s infinite"}}/>
          Listening for admin approval… this page updates automatically.
        </div>

        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button className="sbtn" style={{fontSize:12}} onClick={onBack}>← Back to Payment</button>
        </div>
      </div>
    );
  }

  /* ── FORM (idle / error / submitting) ── */
  return (
    <div style={{maxWidth:540,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
        <button onClick={onBack} style={{width:32,height:32,borderRadius:8,background:"var(--g2)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800}}>Submit UTR for Verification</div>
          <div style={{fontSize:11.5,color:"var(--t3)"}}>Admin will verify your UPI payment and activate your pass</div>
        </div>
      </div>

      {/* Info banner */}
      <div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",padding:"12px 14px",marginBottom:18,display:"flex",gap:9,alignItems:"flex-start"}}>
        <span style={{fontSize:17,flexShrink:0}}>ℹ️</span>
        <div style={{fontSize:11.5,color:"var(--t2)",lineHeight:1.7}}>
          <strong style={{color:"var(--a2)"}}>UTR (Unique Transaction Reference)</strong> is a 12-digit number generated after every successful UPI payment. Find it in your UPI app under <strong>Payment History → Transaction Details</strong>.
        </div>
      </div>

      {/* How to find UTR */}
      <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"13px 15px",marginBottom:18}}>
        <div style={{fontSize:11.5,fontWeight:700,marginBottom:9,color:"var(--t2)"}}>📍 Where to find your UTR:</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {[["📱 Google Pay","Profile → Transactions → tap payment → UTR"],["📲 PhonePe","History → tap payment → Transaction ID (UTR)"],["💙 Paytm","Passbook → tap transaction → UTR Number"],["🏦 BHIM / Bank","SMS after payment or bank app → Ref No."]].map(([a,p])=>(
            <div key={a} style={{background:"rgba(255,255,255,.03)",borderRadius:7,padding:"8px 10px"}}>
              <div style={{fontSize:11,fontWeight:700,marginBottom:2}}>{a}</div>
              <div style={{fontSize:10,color:"var(--t3)",lineHeight:1.5}}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Order recap */}
      <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"11px 14px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:"var(--t3)",marginBottom:2}}>Paying for</div>
          <div style={{fontSize:13,fontWeight:700}}>{selPass} — {city==="All Cities"?"All Routes":city}</div>
          <div style={{fontSize:11,color:"var(--t2)",marginTop:2}}>To: TransitOne India · transitone@upi</div>
        </div>
        <div style={{fontSize:19,fontWeight:800,color:"var(--a2)"}}>{price}</div>
      </div>

      {/* Form fields */}
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:14}}>

        {/* UTR */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:5,display:"flex",gap:6,alignItems:"center"}}>
            UTR Number <span style={{color:"var(--rd)"}}>*</span>
            <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>— 12 digits, numbers only</span>
          </div>
          <div style={{position:"relative"}}>
            <input className="inp" maxLength={12} placeholder="e.g. 432156789012"
              value={utr}
              onChange={e=>{ setUtr(e.target.value.replace(/\D/g,"")); setStatus("idle"); setErrMsg(""); }}
              style={{fontSize:17,fontWeight:700,letterSpacing:".1em",paddingRight:52,
                borderColor:status==="invalid"?"var(--rd)":isValidUtr(utr)?"var(--gr)":"var(--b1)"}}
            />
            {utr.length>0&&(
              <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:isValidUtr(utr)?"var(--gr)":"var(--t3)",fontWeight:700}}>
                {utr.length}/12{isValidUtr(utr)?" ✓":""}
              </div>
            )}
          </div>
          <div style={{height:3,background:"var(--b1)",borderRadius:2,marginTop:5,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:2,transition:"width .18s,background .18s",width:`${(utr.length/12)*100}%`,background:utr.length===12?"var(--gr)":utr.length>=8?"var(--am)":"var(--a)"}}/>
          </div>
        </div>

        {/* Name */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Payer Name <span style={{color:"var(--rd)"}}>*</span></div>
          <input className="inp" placeholder="Name shown in your UPI app" value={name}
            onChange={e=>{ setName(e.target.value); setStatus("idle"); setErrMsg(""); }}/>
        </div>

        {/* Phone */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:5}}>
            Mobile Number <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>(optional)</span>
          </div>
          <input className="inp" placeholder="10-digit number for SMS receipt" maxLength={10} value={phone}
            onChange={e=>{ setPhone(e.target.value.replace(/\D/g,"")); setStatus("idle"); setErrMsg(""); }}/>
        </div>

        {/* Email */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:5}}>
            Email <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>(optional)</span>
          </div>
          <input className="inp" type="email" placeholder="For email receipt" value={email}
            onChange={e=>{ setEmail(e.target.value); setStatus("idle"); setErrMsg(""); }}/>
        </div>

        {/* Note */}
        <div>
          <div style={{fontSize:11.5,fontWeight:700,color:"var(--t2)",marginBottom:5}}>
            Note <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>(optional)</span>
          </div>
          <input className="inp" placeholder="Any additional info for admin" value={note}
            onChange={e=>setNote(e.target.value)}/>
        </div>
      </div>

      {/* Error */}
      {(status==="error"||status==="invalid")&&(
        <div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.26)",borderRadius:"var(--r2)",padding:"10px 13px",marginBottom:13,display:"flex",gap:8,fontSize:12.5,color:"var(--rd)"}}>
          <span style={{flexShrink:0}}>⚠️</span><div>{errMsg}</div>
        </div>
      )}

      <button className="pconf" onClick={handleSubmit} disabled={status==="submitting"} style={{opacity:status==="submitting"?.65:1}}>
        {status==="submitting"
          ? <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:9}}>
              <span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>
              Submitting…
            </span>
          : "📤 Submit UTR for Admin Verification"}
      </button>
      <div style={{fontSize:10.5,color:"var(--t3)",marginTop:8,textAlign:"center"}}>
        🔒 Your UTR is used only to verify your payment. We never store sensitive financial data.
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function TransitOne() {
  const [tab,       setTab]       = useState("Home");
  const [from,      setFrom]      = useState("");
  const [planCity,  setPlanCity]  = useState("Surat");
  const [to,        setTo]        = useState("");
  const [city,      setCity]      = useState("All Cities");
  const [selBus,    setSelBus]    = useState(null);
  const [lang,      setLang]      = useState("English");
  const [plan,      setPlan]      = useState(null);
  const [planning,  setPlanning]  = useState(false);
  const [ticker,    setTicker]    = useState(0);
  const [mapTick,   setMapTick]   = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [adminSec,  setAdminSec]  = useState("Overview");
  const [passSec,   setPassSec]   = useState("Dashboard");
  const [payStep,   setPayStep]   = useState("select");
  const [selPass,   setSelPass]   = useState("Monthly");
  const [payMethod, setPayMethod] = useState("UPI");
  const [rFilter,   setRFilter]   = useState("All");
  const [rSearch,   setRSearch]   = useState("");
  const [stopSearch,setStopSearch]= useState("");
  const [srQuery,   setSrQuery]   = useState("");
  const [srCat,     setSrCat]     = useState("All");
  const [chatMsg,   setChatMsg]   = useState("");
  const [chat,      setChat]      = useState([{r:"ai",t:"👋 Hi! I'm TransitOne AI. Ask me anything about routes, fares, schedules, or stops across India."}]);
  const [chatBusy,  setChatBusy]  = useState(false);
  const [sos,       setSos]       = useState(false);
  const [busModal,  setBusModal]  = useState(null);
  const [routeModal,setRouteModal]= useState(null);
  const [regModal,  setRegModal]  = useState(false);
  const [shareMsg,  setShareMsg]  = useState("");
  const [toast,      setToast]      = useState("");
  const [signModal,  setSignModal]  = useState(false);
  const [signRole,   setSignRole]   = useState("passenger"); // passenger | admin
  const [signTab,    setSignTab]    = useState("login");  // login | register
  const [signMethod, setSignMethod] = useState("password"); // password | otp | google | apple
  const [signEmail,  setSignEmail]  = useState("");
  const [signPass,   setSignPass]   = useState("");
  const [signName,   setSignName]   = useState("");
  const [signPhone,  setSignPhone]  = useState("");
  const [signOtp,    setSignOtp]    = useState("");
  const [otpSent,    setOtpSent]    = useState(false);
  const [otpTimer,   setOtpTimer]   = useState(0);
  const [adminCode,  setAdminCode]  = useState("");
  const [signDone,   setSignDone]   = useState(false);
  const [signErr,    setSignErr]    = useState("");
  const [signBusy,   setSignBusy]   = useState(false);
  const [mapFilter,  setMapFilter]  = useState("All");
  const [trafficOn,  setTrafficOn]  = useState(false);
  const [weatherOn,  setWeatherOn]  = useState(false);
  const [stopsOn,    setStopsOn]    = useState(false);
  const [complaintFilter, setComplaintFilter] = useState("All");
  const [schRoute,  setSchRoute]  = useState("101");
  const chatEnd = useRef(null);

  useEffect(() => {
    const t1 = setInterval(() => setTicker(n=>n+1), 3600);
    const t2 = setInterval(() => setMapTick(n=>n+1), 1600);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({behavior:"smooth"}); }, [chat]);
  useEffect(() => { if(toast){ const t=setTimeout(()=>setToast(""),3500); return ()=>clearTimeout(t); } }, [toast]);
  useEffect(() => { if(otpTimer>0){ const t=setTimeout(()=>setOtpTimer(s=>s-1),1000); return ()=>clearTimeout(t); } }, [otpTimer]);

  /* AI Plan */
  const doPlan = useCallback(async () => {
    if (!from || !to) return;
    setPlanning(true); setPlan(null);
    try {
      const r = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1200,
          messages:[{role:"user",content:`You are TransitOne India's AI journey planner. Plan travel from "${from}" to "${to}" in India.
Return ONLY valid JSON, no markdown, no explanation:
{"fastest":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"cheapest":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"leastWalk":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"wheelchair":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"tip":"string","crowdAlert":"string"}`}]
        })
      });
      const d = await r.json();
      setPlan(JSON.parse((d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim()));
    } catch { setPlan({error:true}); }
    setPlanning(false);
  },[from,to]);

  /* AI Chat */
  const doChat = useCallback(async () => {
    if (!chatMsg.trim() || chatBusy) return;
    const msg = chatMsg.trim(); setChatMsg("");
    setChat(h=>[...h,{r:"user",t:msg}]);
    setChatBusy(true);
    try {
      const r = await fetch("/api/claude",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:400,
          messages:[{role:"user",content:`You are TransitOne India's helpful, friendly AI assistant for public bus transport in India. Answer concisely and helpfully. User asks: "${msg}"`}]
        })
      });
      const d = await r.json();
      setChat(h=>[...h,{r:"ai",t:d.content?.[0]?.text||"Sorry, try again."}]);
    } catch { setChat(h=>[...h,{r:"ai",t:"Connection error. Please try again."}]); }
    setChatBusy(false);
  },[chatMsg,chatBusy]);

  /* Sign In / Register handler — email+password */
  const handleSign = async () => {
    const email = signEmail.trim();
    const pass  = signPass.trim();
    const name  = signName.trim();
    const phone = signPhone.trim();
    setSignErr("");
    if (signRole==="admin" && signTab==="register") {
      if (!adminCode.trim()) { setSignErr("Please enter the Admin Access Code provided by TransitOne."); return; }
      if (adminCode.trim() !== "ADMIN2026") { setSignErr("Invalid Admin Access Code. Contact TransitOne support."); return; }
    }
    if (!email || !pass) { setSignErr("Please enter your email and password."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setSignErr("Please enter a valid email address."); return; }
    if (pass.length < 6) { setSignErr("Password must be at least 6 characters."); return; }
    if (signTab==="register") {
      if (!name) { setSignErr("Please enter your full name."); return; }
      if (phone && !/^[6-9]\d{9}$/.test(phone)) { setSignErr("Enter a valid 10-digit mobile number."); return; }
    }
    setSignBusy(true);
    await new Promise(r=>setTimeout(r,1000));
    setSignBusy(false);
    setSignDone(true);
  };

  /* Send OTP */
  const handleSendOtp = async () => {
    const phone = signPhone.trim();
    setSignErr("");
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) { setSignErr("Enter a valid 10-digit Indian mobile number."); return; }
    setSignBusy(true);
    await new Promise(r=>setTimeout(r,1200));
    setSignBusy(false);
    setOtpSent(true);
    setOtpTimer(30);
  };

  /* Verify OTP */
  const handleVerifyOtp = async () => {
    setSignErr("");
    if (!signOtp || signOtp.length !== 6) { setSignErr("Please enter the 6-digit OTP sent to your number."); return; }
    setSignBusy(true);
    await new Promise(r=>setTimeout(r,1000));
    setSignBusy(false);
    setSignDone(true);
  };

  /* Reset sign modal */
  const resetSign = () => {
    setSignModal(false); setSignDone(false); setSignErr(""); setSignMethod("password");
    setSignEmail(""); setSignPass(""); setSignName(""); setSignPhone(""); setSignOtp("");
    setOtpSent(false); setOtpTimer(0); setAdminCode("");
  };

  /* Bus positions (animated) */
  const filteredBuses = mapFilter==="All" ? BUSES :
    mapFilter==="On Time" ? BUSES.filter(b=>b.status==="On Time") :
    mapFilter==="Delayed" ? BUSES.filter(b=>b.status==="Delayed") :
    mapFilter==="Electric" ? BUSES.filter(b=>b.fuel==="Electric") :
    mapFilter==="AC" ? BUSES.filter(b=>b.route==="101"||b.route==="404"||b.route==="1010") : BUSES;
  const busPos = filteredBuses.map((b,i) => ({
    ...b,
    x: 10 + (i*14) + Math.sin(mapTick/4+i*1.3)*4.5,
    y: 18 + (i*11) + Math.cos(mapTick/5+i*0.9)*5,
  }));

  const filtRoutes = ROUTES.filter(r=>
    (city==="All Cities"||r.city===city)&&
    (rFilter==="All"||r.type===rFilter)&&
    (!rSearch||r.no.includes(rSearch)||r.from.toLowerCase().includes(rSearch.toLowerCase())||r.to.toLowerCase().includes(rSearch.toLowerCase())||r.city.toLowerCase().includes(rSearch.toLowerCase()))
  );

  const srResults = LANDMARKS.filter(l=>
    (srCat==="All"||l.type===srCat)&&
    (!srQuery||l.name.toLowerCase().includes(srQuery.toLowerCase())||l.city.toLowerCase().includes(srQuery.toLowerCase()))
  );

  const barData=[{l:"Mon",v:78},{l:"Tue",v:92},{l:"Wed",v:85},{l:"Thu",v:95},{l:"Fri",v:100},{l:"Sat",v:65},{l:"Sun",v:45}];

  /* helpers */
  const nav = (t) => { setTab(t); setNotifOpen(false); };
  const fmtOcc = (n) => n>80?"var(--rd)":n>60?"var(--am)":"var(--gr)";
  const bType = (t) => t==="AC"?"bac":t==="Electric"?"bel":"bna";

  /* ─────────────────────────────────────────────── RENDER */
  return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>

      {/* ══════════ MODALS ══════════ */}
      {busModal && (
        <div className="modal-bg" onClick={()=>setBusModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-x" onClick={()=>setBusModal(null)}>✕</div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:busModal.status==="On Time"?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)",border:`2px solid ${busModal.status==="On Time"?"var(--gr)":"var(--rd)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚌</div>
              <div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800}}>{busModal.id}</div>
                <div style={{fontSize:11.5,color:"var(--t2)"}}>Route {busModal.route} · {busModal.city}</div>
              </div>
              <span className={`sb ${busModal.status==="On Time"?"sb-ok":"sb-late"}`} style={{marginLeft:"auto"}}>● {busModal.status}{busModal.delay>0?` +${busModal.delay}m`:""}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,marginBottom:16}}>
              {[["Driver",busModal.driver],["Conductor",busModal.conductor],["Speed",`${busModal.speed} km/h`],["Occupancy",`${busModal.occupancy}%`],["Current Stop",busModal.stop],["Next Stop",busModal.next],["Fuel",busModal.fuel+(busModal.battery?` · ${busModal.battery}%🔋`:"")],["Rating",`★ ${busModal.rating}`],["Fitness Cert",busModal.fitness],["Insurance",busModal.insurance]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:"var(--r2)",padding:"10px 12px"}}>
                  <div style={{fontSize:9.5,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:12.5,fontWeight:600}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>{setBusModal(null);nav("Live Map");}}>📍 Track on Map</button>
              <button className="sbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>{ setShareMsg(`Bus ${busModal.id} on Route ${busModal.route} is currently at ${busModal.stop}. Tracking via TransitOne India.`); setBusModal(null); }}>📤 Share Location</button>
            </div>
          </div>
        </div>
      )}

      {routeModal && (
        <div className="modal-bg" onClick={()=>setRouteModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-x" onClick={()=>setRouteModal(null)}>✕</div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:"var(--a2)"}}>Route {routeModal.no}</div>
              <span className={`badge ${bType(routeModal.type)}`}>{routeModal.type}</span>
              <span style={{marginLeft:"auto",fontSize:11.5,color:"var(--t3)"}}>{routeModal.city}</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
              <div className="rdot"/><span style={{fontSize:13,fontWeight:600}}>{routeModal.from}</span>
              <div className="rline" style={{flex:1}}/><div className="rdot2"/>
              <span style={{fontSize:13,fontWeight:600}}>{routeModal.to}</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:18}}>
              {[["Duration",routeModal.dur],["Fare",routeModal.fare],["Next Bus",routeModal.next],["Buses Active",routeModal.buses],["Stops",routeModal.stops],["Distance",routeModal.distance],["Frequency",routeModal.freq],["Type",routeModal.type]].map(([l,v])=>(
                <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:"var(--r2)",padding:"10px 12px"}}>
                  <div style={{fontSize:9.5,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:3}}>{l}</div>
                  <div style={{fontSize:12.5,fontWeight:700,color:"var(--t1)"}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>{ nav("Live Map"); setRouteModal(null); }}>📍 Track Live</button>
              <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12,background:"var(--grad2)"}} onClick={()=>{ nav("Payment"); setRouteModal(null); }}>🎫 Buy Ticket</button>
              <button className="sbtn" style={{padding:"10px 14px",fontSize:12}} onClick={()=>{setRouteModal(null);setToast("⭐ Route saved to your Favourites!");}}>⭐ Save</button>
            </div>
          </div>
        </div>
      )}

      {regModal && (
        <div className="modal-bg" onClick={()=>setRegModal(false)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-x" onClick={()=>setRegModal(false)}>✕</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800,marginBottom:6}}>Register Your City</div>
            <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:18}}>Join 127 cities already on TransitOne. Setup takes less than 30 minutes.</div>
            <div className="reg-g">
              {[["City / Town Name","e.g. Surat"],["State","e.g. Gujarat"],["Official Contact Email","admin@city.gov.in"],["Contact Phone","+91 XXXXX XXXXX"],["Fleet Size (approx.)","e.g. 500"],["Total Routes (approx.)","e.g. 45"]].map(([l,p])=>(
                <div key={l}>
                  <div className="reg-lbl">{l}</div>
                  <input className="reg-inp" placeholder={p}/>
                </div>
              ))}
            </div>
            <div style={{marginBottom:14}}>
              <div className="reg-lbl">Authority Type</div>
              <select className="reg-inp" style={{cursor:"pointer"}}>
                <option>Municipal Corporation</option><option>State RTC</option><option>Smart City Authority</option><option>Private Operator</option>
              </select>
            </div>
            <button className="pbtn" onClick={()=>{setRegModal(false);setToast("🚀 Registration submitted! Our team will contact you within 2 business days.");}}>🚀 Submit Registration Request</button>
            <div style={{fontSize:10.5,color:"var(--t3)",marginTop:10,textAlign:"center"}}>Our team will contact you within 2 business days to begin onboarding.</div>
          </div>
        </div>
      )}

      {shareMsg && (
        <div className="modal-bg" onClick={()=>setShareMsg("")}>
          <div className="modal" style={{maxWidth:400}} onClick={e=>e.stopPropagation()}>
            <div className="modal-x" onClick={()=>setShareMsg("")}>✕</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:800,marginBottom:12}}>📤 Share Journey</div>
            <div style={{background:"rgba(255,255,255,.05)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"12px 14px",fontSize:12.5,color:"var(--t2)",marginBottom:14,lineHeight:1.7}}>{shareMsg}</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["📱 WhatsApp","📧 Email","📋 Copy Link","🔗 More"].map(s=>(
                <button key={s} className="sbtn" style={{fontSize:11.5,padding:"7px 13px"}} onClick={()=>{if(s==="📋 Copy Link"){navigator.clipboard?.writeText("https://transitone.in/track");setToast("🔗 Link copied to clipboard!");}setShareMsg("");}}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ TOAST NOTIFICATION ══════════ */}
      {toast && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:"rgba(20,24,48,.97)",border:"1px solid var(--b2)",borderRadius:"var(--r2)",padding:"13px 22px",fontSize:13.5,color:"var(--t1)",zIndex:999,boxShadow:"var(--sh)",maxWidth:420,textAlign:"center",animation:"fadeIn .22s ease",whiteSpace:"nowrap",cursor:"pointer"}} onClick={()=>setToast("")}>
          {toast}
        </div>
      )}

      {/* ══════════ SIGN IN MODAL ══════════ */}
      {signModal && (
        <div className="modal-bg" onClick={resetSign}>
          <div className="modal" style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
            <div className="modal-x" onClick={resetSign}>✕</div>

            {/* ── SUCCESS SCREEN ── */}
            {signDone ? (
              <div style={{textAlign:"center",padding:"20px 10px"}}>
                <div style={{width:76,height:76,borderRadius:"50%",background:signRole==="admin"?"rgba(99,102,241,.15)":"rgba(16,185,129,.15)",border:`2px solid ${signRole==="admin"?"var(--a)":"var(--gr)"}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:36,animation:"pop .4s ease"}}>
                  {signRole==="admin"?"⚙️":"✅"}
                </div>
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>
                  {signTab==="login"?"Welcome Back!":"Account Created!"}
                </div>
                <div style={{color:"var(--t2)",fontSize:13,marginBottom:6}}>
                  Signed in as <strong style={{color:signRole==="admin"?"var(--a2)":"var(--gr)"}}>{signRole==="admin"?"City Admin 🏙️":"Passenger 🚌"}</strong>
                </div>
                <div style={{color:"var(--t2)",fontSize:13,marginBottom:22}}>
                  Welcome, <strong style={{color:"var(--a2)"}}>{signName||signEmail.split("@")[0]||signPhone||"Traveller"}</strong>!
                </div>
                <div style={{display:"flex",gap:9,flexDirection:"column"}}>
                  <button className="pbtn" onClick={()=>{resetSign(); signRole==="admin"?nav("Admin"):nav("Passenger");}}>
                    {signRole==="admin"?"⚙️ Go to Admin Dashboard":"📊 Go to My Dashboard"}
                  </button>
                  {signRole==="passenger"&&<button className="sbtn" style={{fontSize:12}} onClick={()=>{resetSign();nav("Journey");}}>🧭 Plan a Journey</button>}
                </div>
              </div>

            ) : (<>
              {/* ── ROLE SELECTOR ── */}
              <div style={{marginBottom:20}}>
                <div style={{fontSize:11,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:10}}>I am a</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[
                    {r:"passenger",ico:"🚌",title:"Passenger",sub:"Book tickets, track buses, manage pass"},
                    {r:"admin",    ico:"⚙️",title:"City Admin", sub:"Manage fleet, routes, and operations"},
                  ].map(({r,ico,title,sub})=>(
                    <div key={r} onClick={()=>{setSignRole(r);setSignErr("");setAdminCode("");}}
                      style={{padding:"14px 12px",borderRadius:"var(--r2)",border:`2px solid ${signRole===r?(r==="admin"?"var(--a)":"var(--gr)"):"var(--b1)"}`,background:signRole===r?(r==="admin"?"rgba(99,102,241,.1)":"rgba(16,185,129,.1)"):"var(--g1)",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
                      <div style={{fontSize:28,marginBottom:6}}>{ico}</div>
                      <div style={{fontSize:13,fontWeight:800,color:signRole===r?(r==="admin"?"var(--a2)":"var(--gr)"):"var(--t1)",marginBottom:3}}>{title}</div>
                      <div style={{fontSize:10.5,color:"var(--t3)",lineHeight:1.4}}>{sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── LOGIN / REGISTER TABS ── */}
              <div style={{display:"flex",gap:0,marginBottom:18,background:"var(--g1)",borderRadius:"var(--r2)",border:"1px solid var(--b1)",overflow:"hidden"}}>
                {["login","register"].map(t=>(
                  <button key={t} onClick={()=>{setSignTab(t);setSignErr("");setSignMethod("password");setOtpSent(false);}}
                    style={{flex:1,padding:"9px 0",border:"none",background:signTab===t?"var(--grad)":"transparent",color:signTab===t?"#fff":"var(--t2)",fontWeight:700,fontSize:12.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .2s"}}>
                    {t==="login"?"Sign In":"Register"}
                  </button>
                ))}
              </div>

              {/* ── METHOD SELECTOR (for both login & register) ── */}
              {signMethod==="password" && <>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:9,textAlign:"center",letterSpacing:".05em",textTransform:"uppercase"}}>Continue with</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
                  {[
                    {m:"google",ico:"🔵",label:"Google",  bg:"rgba(66,133,244,.12)",  border:"rgba(66,133,244,.3)",  col:"#4285f4"},
                    {m:"apple", ico:"⬛",label:"Apple",   bg:"rgba(255,255,255,.07)", border:"rgba(255,255,255,.2)", col:"var(--t1)"},
                    {m:"otp",   ico:"📱",label:"OTP / SMS",bg:"rgba(16,185,129,.1)",  border:"rgba(16,185,129,.3)",  col:"var(--gr)"},
                  ].map(({m,ico,label,bg,border,col})=>(
                    <button key={m} onClick={()=>{setSignMethod(m);setSignErr("");setOtpSent(false);setSignPhone("");setSignOtp("");}}
                      style={{padding:"11px 4px",borderRadius:"var(--r2)",background:signMethod===m?bg:"var(--g1)",border:`1px solid ${signMethod===m?border:"var(--b1)"}`,color:signMethod===m?col:"var(--t2)",fontSize:11.5,fontWeight:700,cursor:"pointer",fontFamily:"'Inter',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .2s"}}>
                      <span style={{fontSize:20}}>{ico}</span>{label}
                    </button>
                  ))}
                </div>

                {/* ── Email + Password form ── */}
                <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:14,color:"var(--t1)"}}>
                  {signTab==="login"?"Sign In with Email":"Create Account"}
                  <span style={{marginLeft:8,fontSize:10.5,fontWeight:400,color:"var(--t3)"}}>— or choose a method above</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
                  {signTab==="register"&&<input className="inp" placeholder="Full Name *" value={signName} onChange={e=>setSignName(e.target.value)}/>}
                  <input className="inp" type="email" placeholder="Email address *" value={signEmail} onChange={e=>setSignEmail(e.target.value)}/>
                  {signTab==="register"&&<input className="inp" placeholder="Mobile number (10 digits)" maxLength={10} value={signPhone} onChange={e=>setSignPhone(e.target.value.replace(/\D/g,""))}/>}
                  <input className="inp" type="password" placeholder="Password (min. 6 characters) *" value={signPass} onChange={e=>setSignPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSign()}/>
                  {signRole==="admin"&&signTab==="register"&&(
                    <div>
                      <input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/>
                      <div style={{fontSize:10.5,color:"var(--t3)",marginTop:4}}>Contact TransitOne support to get your city's Admin Access Code.</div>
                    </div>
                  )}
                </div>
                {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 13px",fontSize:12.5,color:"var(--rd)",marginBottom:12}}>⚠️ {signErr}</div>}
                <button className="pbtn" onClick={handleSign} disabled={signBusy}>
                  {signBusy
                    ?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Please wait…</span>
                    :signTab==="login"?"Sign In →":"Create Account →"}
                </button>
                <div style={{textAlign:"center",marginTop:11,fontSize:12,color:"var(--t3)"}}>
                  {signTab==="login"
                    ?<>Don't have an account? <span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={()=>setSignTab("register")}>Register →</span></>
                    :<>Already have an account? <span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={()=>setSignTab("login")}>Sign In →</span></>
                  }
                </div>
              </>}

              {/* ── GOOGLE FLOW ── */}
              {signMethod==="google"&&(
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:48,marginBottom:14}}>🔵</div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:8}}>Continue with Google</div>
                  <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:20,lineHeight:1.6}}>
                    You'll be redirected to Google to {signTab==="login"?"sign in":"create your account"} securely.<br/>
                    <span style={{color:signRole==="admin"?"var(--a2)":"var(--gr)",fontWeight:600}}>Role: {signRole==="admin"?"City Admin 🏙️":"Passenger 🚌"}</span>
                  </div>
                  {signRole==="admin"&&signTab==="register"&&(
                    <div style={{marginBottom:14}}>
                      <input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/>
                      <div style={{fontSize:10.5,color:"var(--t3)",marginTop:4,textAlign:"left"}}>Required for Admin registration. Contact TransitOne support.</div>
                    </div>
                  )}
                  {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 13px",fontSize:12.5,color:"var(--rd)",marginBottom:12,textAlign:"left"}}>⚠️ {signErr}</div>}
                  <button className="pbtn" disabled={signBusy} onClick={async()=>{
                    if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return;}
                    setSignBusy(true); setSignErr("");
                    await new Promise(r=>setTimeout(r,1400));
                    setSignBusy(false); setSignName("Google User"); setSignDone(true);
                  }} style={{background:"#4285f4",marginBottom:10}}>
                    {signBusy?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Connecting…</span>:"🔵 Continue with Google"}
                  </button>
                  <button className="sbtn" style={{width:"100%",fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("");}}>← Back</button>
                </div>
              )}

              {/* ── APPLE FLOW ── */}
              {signMethod==="apple"&&(
                <div style={{textAlign:"center",padding:"16px 0"}}>
                  <div style={{fontSize:48,marginBottom:14}}>🍎</div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:8}}>Continue with Apple</div>
                  <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:20,lineHeight:1.6}}>
                    You'll be redirected to Apple ID to {signTab==="login"?"sign in":"create your account"} securely.<br/>
                    <span style={{color:signRole==="admin"?"var(--a2)":"var(--gr)",fontWeight:600}}>Role: {signRole==="admin"?"City Admin 🏙️":"Passenger 🚌"}</span>
                  </div>
                  {signRole==="admin"&&signTab==="register"&&(
                    <div style={{marginBottom:14}}>
                      <input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/>
                      <div style={{fontSize:10.5,color:"var(--t3)",marginTop:4,textAlign:"left"}}>Required for Admin registration.</div>
                    </div>
                  )}
                  {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 13px",fontSize:12.5,color:"var(--rd)",marginBottom:12,textAlign:"left"}}>⚠️ {signErr}</div>}
                  <button className="pbtn" disabled={signBusy} onClick={async()=>{
                    if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return;}
                    setSignBusy(true); setSignErr("");
                    await new Promise(r=>setTimeout(r,1400));
                    setSignBusy(false); setSignName("Apple User"); setSignDone(true);
                  }} style={{background:"#1c1c1e",border:"1px solid rgba(255,255,255,.3)",marginBottom:10}}>
                    {signBusy?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Connecting…</span>:"🍎 Continue with Apple"}
                  </button>
                  <button className="sbtn" style={{width:"100%",fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("");}}>← Back</button>
                </div>
              )}

              {/* ── OTP FLOW ── */}
              {signMethod==="otp"&&(
                <div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:6}}>
                    {!otpSent?"📱 Enter Your Mobile Number":"🔢 Enter OTP"}
                  </div>
                  <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:16,lineHeight:1.6}}>
                    {!otpSent
                      ?<>We'll send a 6-digit OTP to your number. <span style={{color:signRole==="admin"?"var(--a2)":"var(--gr)",fontWeight:600}}>Role: {signRole==="admin"?"City Admin":"Passenger"}</span></>
                      :<>OTP sent to <strong>+91 {signPhone}</strong>. Enter the 6-digit code below.</>
                    }
                  </div>
                  {!otpSent?(
                    <>
                      {signRole==="admin"&&signTab==="register"&&(
                        <div style={{marginBottom:10}}>
                          <input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/>
                        </div>
                      )}
                      <div style={{position:"relative",marginBottom:14}}>
                        <span style={{position:"absolute",left:13,top:"50%",transform:"translateY(-50%)",fontSize:13,color:"var(--t2)",fontWeight:600,pointerEvents:"none"}}>+91</span>
                        <input className="inp" style={{paddingLeft:44}} placeholder="10-digit mobile number" maxLength={10} value={signPhone} onChange={e=>setSignPhone(e.target.value.replace(/\D/g,""))}/>
                      </div>
                      {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 13px",fontSize:12.5,color:"var(--rd)",marginBottom:12}}>⚠️ {signErr}</div>}
                      <button className="pbtn" onClick={()=>{
                        if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return;}
                        handleSendOtp();
                      }} disabled={signBusy}>
                        {signBusy?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Sending OTP…</span>:"Send OTP →"}
                      </button>
                    </>
                  ):(
                    <>
                      {/* 6-digit OTP boxes */}
                      <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
                        {[0,1,2,3,4,5].map(i=>(
                          <input key={i} maxLength={1}
                            value={signOtp[i]||""}
                            onChange={e=>{
                              const val=e.target.value.replace(/\D/g,"");
                              const arr=signOtp.split("");
                              arr[i]=val;
                              setSignOtp(arr.join("").slice(0,6));
                              if(val&&e.target.nextSibling)e.target.nextSibling.focus();
                            }}
                            style={{width:44,height:52,textAlign:"center",fontSize:22,fontWeight:800,fontFamily:"'Space Grotesk',sans-serif",background:"var(--g2)",border:`2px solid ${signOtp[i]?"var(--a)":"var(--b1)"}`,borderRadius:"var(--r2)",color:"var(--t1)",outline:"none",transition:"border .15s"}}
                          />
                        ))}
                      </div>
                      <div style={{textAlign:"center",fontSize:12,color:"var(--t3)",marginBottom:14}}>
                        {otpTimer>0
                          ?<>Resend OTP in <strong style={{color:"var(--am)"}}>{otpTimer}s</strong></>
                          :<span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={handleSendOtp}>Resend OTP →</span>
                        }
                      </div>
                      {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 13px",fontSize:12.5,color:"var(--rd)",marginBottom:12}}>⚠️ {signErr}</div>}
                      <button className="pbtn" onClick={handleVerifyOtp} disabled={signBusy||signOtp.length<6}>
                        {signBusy?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Verifying…</span>:"✅ Verify & Sign In"}
                      </button>
                      <button className="sbtn" style={{width:"100%",marginTop:9,fontSize:12}} onClick={()=>{setOtpSent(false);setSignOtp("");}}>← Change Number</button>
                    </>
                  )}
                  <button className="sbtn" style={{width:"100%",marginTop:9,fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("");setOtpSent(false);}}>← Other Sign In Options</button>
                </div>
              )}

            </>)}
          </div>
        </div>
      )}

      {/* ══════════ NAV ══════════ */}
      <nav className="nav">
        <div className="logo" onClick={()=>nav("Home")}>
          <div className="logo-ico">🚌</div>
          <div><div className="logo-name">TransitOne</div><div className="logo-tag">India Smart Transit OS</div></div>
        </div>
        <div className="nav-tabs">
          {TABS.map(t=><button key={t} className={`nt ${tab===t?"on":""}`} onClick={()=>nav(t)}>{t}</button>)}
        </div>
        <div className="nav-r">
          <select className="ncity inp" value={city} onChange={e=>setCity(e.target.value)}>
            <option>All Cities</option>
            {CITIES.map(c=><option key={c}>{c}</option>)}
          </select>
          <div style={{position:"relative"}}>
            <div className="nib" onClick={()=>setNotifOpen(o=>!o)}>🔔<span className="ndot"/></div>
            {notifOpen && (
              <div className="npanel">
                <div className="np-head"><span>Notifications</span><span style={{fontSize:10,color:"var(--a2)",cursor:"pointer"}} onClick={()=>setNotifOpen(false)}>Mark all read ✓</span></div>
                {NOTIFS.map((n,i)=>(
                  <div key={i} className="np-item" onClick={()=>setNotifOpen(false)}>
                    <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      {n.unread&&<div className="np-dot"/>}
                      <span>{n.icon}</span>
                      <div>
                        <div style={{fontSize:12,lineHeight:1.5}}>{n.text}</div>
                        <div style={{fontSize:9.5,color:"var(--t3)",marginTop:2}}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="nsign" onClick={()=>setSignModal(true)}>Sign In</button>
        </div>
      </nav>

      {/* ══════════ TICKER ══════════ */}
      <div className="ticker">
        <span className="tlive">LIVE</span>
        {TICKER_MSGS[ticker%TICKER_MSGS.length]}
      </div>

      <main style={{flex:1}}>

      {/* ═══════════════════════════ HOME ═══ */}
      {tab==="Home"&&<>
        <div className="hero">
          <div className="h-bg"/><div className="h-grid"/>
          <div className="h-badge"><span className="pulse"/>India's Smart Transit OS · 127 Cities · 2.4M Daily Riders</div>
          <h1 className="h-title">One Platform.<br/><span className="gtext">Every Bus. Every City.</span></h1>
          <p className="h-sub">AI-powered public transportation for India. Real-time GPS tracking, smart journey planning, digital ticketing — across every city, every route, every day.</p>
          <div className="scard">
            <div className="irow">
              <select className="inp" value={from} onChange={e=>setFrom(e.target.value)}>
                <option value="">📍 From — select city stop…</option>
                {Object.entries(CITY_STOPS).map(([cityName,stops])=>(
                  <optgroup key={cityName} label={`${CITY_ICONS[cityName]||"🏙️"} ${cityName}`}>
                    {stops.map(s=><option key={s} value={s}>{s}</option>)}
                  </optgroup>
                ))}
              </select>
              <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
                <option value="">🎯 To — select destination…</option>
                {Object.entries(CITY_STOPS).map(([cityName,stops])=>(
                  <optgroup key={cityName} label={`${CITY_ICONS[cityName]||"🏙️"} ${cityName}`}>
                    {stops.filter(s=>s!==from).map(s=><option key={s} value={s}>{s}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="irow">
              <select className="inp"><option>🕐 Leave Now</option><option>📅 Schedule Later</option><option>⏰ Arrive By</option></select>
              <select className="inp"><option>🚌 All Modes</option><option>❄️ AC Bus Only</option><option>⚡ Electric Bus</option><option>♿ Wheelchair Friendly</option><option>👩 Women's Safety</option><option>🚇 Metro + Bus</option><option>🚂 Train + Bus</option><option>🛺 Bus + Auto</option></select>
            </div>
            <button className="pbtn" disabled={!from||!to} onClick={()=>{nav("Journey");doplan();}}>🧭 Plan My Journey with AI</button>
          </div>
          <div className="hacts" style={{marginTop:14}}>
            <button className="sbtn" onClick={()=>nav("Live Map")}>🗺️ Live Map</button>
            <button className="sbtn" onClick={()=>nav("Routes")}>🚌 Browse Routes</button>
            <button className="sbtn" onClick={()=>nav("Smart Search")}>🔍 Smart Search</button>
            <button className="sbtn" onClick={()=>nav("Passenger")}>🎫 My Pass</button>
            <button className="sbtn" onClick={()=>nav("Cities")}>🏙️ Cities</button>
          </div>
        </div>

        {/* STATS */}
        <div className="stats-w">
          <div className="sgrid">
            {[{ico:"🏙️",val:"127",lbl:"Cities Live",col:"var(--a)",chg:"+3 this month"},{ico:"🚌",val:"84,320",lbl:"Active Buses",col:"var(--gr)",chg:"+1,240 electric"},{ico:"👥",val:"2.4M",lbl:"Daily Riders",col:"var(--am)",chg:"↑ 14% vs last month"},{ico:"🗺️",val:"12,800+",lbl:"Routes",col:"var(--pk)",chg:"Across 18 states"}].map((s,i)=>(
              <div key={i} className="sc">
                <div className="sc-ico">{s.ico}</div>
                <div className="sc-val" style={{color:s.col}}>{s.val}</div>
                <div className="sc-lbl">{s.lbl}</div>
                <div className="sc-chg">{s.chg}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ALERTS */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="abar"><span>🚨</span><div><strong>Emergency Alert:</strong> Route 202 Ahmedabad rerouted via Vastrapur — road work till 6 PM. Expected delay: 8 min.</div></div>
          <div className="abar warn"><span>🌧️</span><div><strong>Weather:</strong> Heavy rain in Mumbai — Routes 303 & 1010 running 5–10 min late. AI rerouting active.</div></div>
          <div className="abar info"><span>🎉</span><div><strong>New City:</strong> Chandigarh is now live on TransitOne — 340 buses, 28 routes, serving 80K daily riders.</div></div>

          {/* POPULAR ROUTES */}
          <div className="sh" style={{marginTop:28}}>
            <div className="ey">Popular Routes</div>
            <div className="st">Most Travelled Right Now</div>
            <div className="ss">Live status on India's busiest bus corridors</div>
          </div>
          <div className="rgrid">
            {ROUTES.slice(0,6).map(r=>(
              <div key={r.id} className="rc" onClick={()=>setRouteModal(r)}>
                <div className="rc-hd">
                  <div><div style={{fontSize:9.5,color:"var(--t3)",marginBottom:2}}>{r.city}</div><div className="rcno">Route {r.no}</div></div>
                  <span className={`badge ${bType(r.type)}`}>{r.type}</span>
                </div>
                <div className="rpath"><div className="rdot"/><span style={{fontSize:12}}>{r.from}</span><div className="rline"/><div className="rdot2"/><span style={{fontSize:12}}>{r.to}</span></div>
                <div className="rmeta">
                  <div className="rm"><span>{r.dur}</span>Journey</div>
                  <div className="rm"><span>{r.fare}</span>Fare</div>
                  <div className="rm"><span style={{color:"var(--gr)"}}>{r.next}</span>Next Bus</div>
                  <div className="rm"><span>{r.freq}</span>Frequency</div>
                </div>
                <div className="racts">
                  <button className="rbtn" onClick={e=>{e.stopPropagation();nav("Live Map");}}>📍 Track</button>
                  <button className="rbtn pri" onClick={e=>{e.stopPropagation();nav("Payment");}}>🎫 Buy Ticket</button>
                  <button className="rbtn" onClick={e=>{e.stopPropagation();setShareMsg(`Travelling on Route ${r.no} from ${r.from} to ${r.to}. Next bus in ${r.next}. Tracked via TransitOne India.`);}}>📤 Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LIVE RUNNING VEHICLES preview */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Live Running Vehicles</div>
            <div className="st">Buses Moving Right Now</div>
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {BUSES.map(b=>(
              <div key={b.id} onClick={()=>setBusModal(b)} style={{background:"var(--g1)",border:`1px solid ${b.status==="On Time"?"rgba(16,185,129,.25)":"rgba(239,68,68,.25)"}`,borderRadius:"var(--r2)",padding:"12px 15px",cursor:"pointer",minWidth:200,transition:"all .18s"}} className="card">
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:6}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:b.status==="On Time"?"var(--gr)":"var(--rd)"}}/>
                  <span style={{fontSize:12,fontWeight:700}}>Route {b.route}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:"var(--t3)"}}>{b.city}</span>
                </div>
                <div style={{fontSize:11,color:"var(--t2)",marginBottom:3}}>📍 {b.stop}</div>
                <div style={{fontSize:11,color:"var(--t3)",marginBottom:3}}>→ {b.next}</div>
                <div style={{display:"flex",gap:8,fontSize:10.5,color:"var(--t2)"}}>
                  <span>{b.speed} km/h</span>
                  <span style={{color:fmtOcc(b.occupancy)}}>{b.occupancy}% full</span>
                  {b.battery&&<span>🔋{b.battery}%</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI FEATURES */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Powered by AI</div>
            <div className="st">Intelligence Built Into Every Journey</div>
            <div className="ss">ML models trained on millions of real trips — making India's commute smarter every day</div>
          </div>
          <div className="aig">
            {[{ico:"🧠",t:"AI Journey Planner",d:"Calculates optimal routes using real-time traffic, weather, crowd density, and personal preferences.",tag:"94% accuracy"},
              {ico:"⏱️",t:"Delay Prediction",d:"ML models forecast delays up to 30 minutes ahead. Get notified before you even leave home.",tag:"30 min forecast"},
              {ico:"👥",t:"Crowd Intelligence",d:"Know bus occupancy before boarding. AI predicts crowding by route, time, and day of week.",tag:"Live crowding"},
              {ico:"🗺️",t:"Dynamic Rerouting",d:"Buses are automatically rerouted when traffic, accidents, or weather affect their scheduled path.",tag:"Real-time"},
              {ico:"🔧",t:"Predictive Maintenance",d:"Sensor data analysed to detect vehicle faults before they cause breakdowns on the road.",tag:"IoT sensors"},
              {ico:"🚗",t:"Traffic Analysis",d:"City-wide traffic pattern analysis helps operators optimise frequency and headways.",tag:"City-level"},
              {ico:"⛽",t:"Fuel Optimisation",d:"AI routing reduces fuel and battery consumption by 18% on average across the entire fleet.",tag:"18% savings"},
              {ico:"🤖",t:"AI Chat Assistant",d:"24/7 chatbot answers route, fare, and schedule questions in 10 Indian languages instantly.",tag:"10 languages"},
            ].map((f,i)=>(
              <div key={i} className="aic">
                <div style={{fontSize:28,marginBottom:11}}>{f.ico}</div>
                <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{f.t}</div>
                <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.65}}>{f.d}</div>
                <div className="ai-tag">{f.tag}</div>
              </div>
            ))}
          </div>
        </div>

        {/* MULTILINGUAL */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Multilingual</div>
            <div className="st">Speaks Your Language</div>
            <div className="ss">Auto-detected from device. Full platform support in 10 languages.</div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
            {LANGS.map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{padding:"7px 15px",borderRadius:100,background:lang===l?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${lang===l?"var(--a)":"var(--b1)"}`,color:lang===l?"var(--a2)":"var(--t2)",fontSize:12.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s"}}>{l}</button>
            ))}
          </div>
          <div style={{padding:"12px 16px",background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.18)",borderRadius:"var(--r2)",fontSize:12.5,color:"var(--t2)"}}>
            🌐 Platform language: <strong style={{color:"var(--a2)"}}>{lang}</strong> — All routes, stops, and announcements display in this language.
          </div>
        </div>

        {/* PASSENGER FEATURES */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Passenger Features</div>
            <div className="st">Everything You Need to Travel Smart</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
            {[["⭐","Favourite Routes","Save your most-used routes"],["📍","Saved Stops","Quick access to stops"],["🗺️","Nearby Stops","Find stops around you"],["🎫","Digital Pass","Monthly/annual passes"],["📲","QR Ticket","Scan at entry gate"],["💳","Online Recharge","Top up your wallet"],["🎓","Student Pass","40% off for students"],["🧓","Senior Pass","50% off for 60+"],["👩","Women Safety Mode","Safe travel features"],["🆘","SOS Button","Emergency alert system"],["🔍","Lost & Found","Report & track lost items"],["📋","Complaint System","Report issues instantly"],["🔔","Live Notifications","Arrival & delay alerts"],["🚌","Arrival Alerts","Get notified when bus nears"],["📤","Share Journey","Share live ETA with family"],["🕐","Trip History","View all past journeys"]].map(([ico,t,d])=>(
              <div key={t} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"14px 13px",transition:"all .2s",cursor:"pointer"}} className="card" onClick={()=>{nav("Passenger");setPassSec(t.includes("SOS")?"SOS & Safety":t.includes("QR")?"QR Ticket":t.includes("Trip")?"Trip History":t.includes("Favourite")?"Favourites":t.includes("Nearby")?"Nearby Stops":t.includes("Complaint")?"Complaints":"Dashboard");}}>
                <div style={{fontSize:24,marginBottom:7}}>{ico}</div>
                <div style={{fontSize:12.5,fontWeight:700,marginBottom:4}}>{t}</div>
                <div style={{fontSize:11,color:"var(--t2)"}}>{d}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PAYMENT */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Payment Methods</div>
            <div className="st">Pay Your Way</div>
          </div>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
            {[["💳","Cards"],["📱","UPI"],["🏦","Net Banking"],["👛","Wallet"],["📅","Monthly Pass"],["📆","Annual Pass"],["🏢","Corporate"]].map(([ico,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:100,fontSize:12.5,fontWeight:600,color:"var(--t2)",cursor:"pointer"}} onClick={()=>nav("Payment")}>{ico} {l}</div>
            ))}
          </div>
        </div>

        {/* APP DOWNLOAD */}
        <div className="sec" style={{paddingTop:0}}>
          <div style={{background:"linear-gradient(135deg,rgba(99,102,241,.12),rgba(236,72,153,.08))",border:"1px solid rgba(99,102,241,.22)",borderRadius:"var(--r)",padding:"34px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:22}}>
            <div>
              <div className="ey">Mobile App</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(19px,3vw,28px)",fontWeight:800,marginBottom:9,lineHeight:1.22}}>Track. Pay. Travel.<br/>All from Your Phone.</div>
              <div style={{color:"var(--t2)",fontSize:12.5,marginBottom:20,lineHeight:1.75}}>PWA + Native apps · Offline mode · Live widgets<br/>Push alerts · Works on 2G · QR ticket scanning</div>
              <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
                <button onClick={()=>setToast("🍎 App Store — Coming Soon! iOS app launching Q3 2026.")} style={{padding:"9px 18px",borderRadius:9,background:"#000",border:"1px solid rgba(255,255,255,.15)",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>🍎 App Store</button>
                <button onClick={()=>setToast("🤖 Google Play — Coming Soon! Android app launching Q3 2026.")} style={{padding:"9px 18px",borderRadius:9,background:"#1a2035",border:"1px solid rgba(255,255,255,.15)",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>🤖 Google Play</button>
                <button onClick={()=>setToast("🌐 You are already using the TransitOne Web App!")} style={{padding:"9px 18px",borderRadius:9,background:"var(--g2)",border:"1px solid var(--b2)",color:"var(--t2)",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>🌐 Web App (PWA)</button>
              </div>
            </div>
            <div style={{fontSize:76,filter:"drop-shadow(0 0 40px rgba(99,102,241,.45))"}}>📱</div>
          </div>
        </div>

        {/* BUSINESS MODEL */}
        <div className="sec" style={{paddingTop:0}}>
          <div className="sh">
            <div className="ey">Business Model</div>
            <div className="st">Built to Scale. Built to Last.</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(195px,1fr))",gap:11}}>
            {[{ico:"🏛️",t:"City Subscription",d:"Monthly SaaS per city, scales with fleet size"},{ico:"📄",t:"Govt Contracts",d:"State & central mobility program agreements"},{ico:"💳",t:"Passenger Plans",d:"Monthly, annual, and premium digital passes"},{ico:"🚛",t:"Fleet Management",d:"API + dashboard for private operators"},{ico:"🏢",t:"Corporate Transit",d:"Employee bus management for IT parks & SEZs"},{ico:"⚡",t:"API Access",d:"Open mobility API for developers & startups"}].map((b,i)=>(
              <div key={i} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"16px 14px"}}>
                <div style={{fontSize:24,marginBottom:7}}>{b.ico}</div>
                <div style={{fontSize:12.5,fontWeight:700,marginBottom:5}}>{b.t}</div>
                <div style={{fontSize:11.5,color:"var(--t2)"}}>{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══════════════════════════ LIVE MAP ═══ */}
      {tab==="Live Map"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Live Tracking</div><div className="st">Real-Time Fleet Map</div><div className="ss">Every active bus updated every 5 seconds. Click any bus for full details.</div></div>
          <div style={{display:"flex",gap:9,marginBottom:13,flexWrap:"wrap"}}>
            {["All","On Time","Delayed","Electric","AC"].map(f=><button key={f} onClick={()=>setMapFilter(f)} style={{padding:"6px 13px",borderRadius:100,background:mapFilter===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${mapFilter===f?"var(--a)":"var(--b1)"}`,color:mapFilter===f?"var(--a2)":"var(--t2)",fontSize:11,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s"}}>{f}</button>)}
            <div style={{marginLeft:"auto",display:"flex",gap:7}}>
              <button onClick={()=>setTrafficOn(v=>!v)} style={{padding:"6px 12px",borderRadius:7,background:trafficOn?"rgba(239,68,68,.18)":"var(--g1)",border:`1px solid ${trafficOn?"var(--rd)":"var(--b1)"}`,color:trafficOn?"var(--rd)":"var(--t2)",fontSize:11,cursor:"pointer",transition:"all .18s"}}>🚦 Traffic {trafficOn?"ON":"OFF"}</button>
              <button onClick={()=>setWeatherOn(v=>!v)} style={{padding:"6px 12px",borderRadius:7,background:weatherOn?"rgba(6,182,212,.18)":"var(--g1)",border:`1px solid ${weatherOn?"var(--cy)":"var(--b1)"}`,color:weatherOn?"var(--cy)":"var(--t2)",fontSize:11,cursor:"pointer",transition:"all .18s"}}>🌧️ Weather {weatherOn?"ON":"OFF"}</button>
              <button onClick={()=>setStopsOn(v=>!v)} style={{padding:"6px 12px",borderRadius:7,background:stopsOn?"rgba(16,185,129,.18)":"var(--g1)",border:`1px solid ${stopsOn?"var(--gr)":"var(--b1)"}`,color:stopsOn?"var(--gr)":"var(--t2)",fontSize:11,cursor:"pointer",transition:"all .18s"}}>📍 Stops {stopsOn?"ON":"OFF"}</button>
            </div>
          </div>
          <div className="mwrap">
            <div className="mcanv">
              <div className="mgrid"/>
              {[12,24,36,50,64,78].map(p=><div key={`h${p}`} className="mroad" style={{height:2,top:`${p}%`,left:0,right:0}}/>)}
              {[15,30,45,60,75,90].map(p=><div key={`v${p}`} className="mroad" style={{width:2,left:`${p}%`,top:0,bottom:0}}/>)}
              {[{nm:"Mumbai",x:20,y:56},{nm:"Delhi",x:47,y:22},{nm:"Bangalore",x:40,y:76},{nm:"Surat",x:24,y:42},{nm:"Ahmedabad",x:23,y:32},{nm:"Chennai",x:44,y:80}].map(c=>(
                <div key={c.nm} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,fontSize:9,color:"rgba(255,255,255,.18)",fontWeight:700,letterSpacing:".05em",pointerEvents:"none"}}>{c.nm}</div>
              ))}
              {busPos.map(b=>(
                <div key={b.id} className="bm" style={{left:`${b.x}%`,top:`${b.y}%`}} onClick={()=>setBusModal(b)}>
                  <div className={`bd ${b.status==="On Time"?"bok":"blate"}`}>{b.status==="On Time"?"✓":"!"}</div>
                  <div className="bripple" style={{color:b.status==="On Time"?"var(--gr)":"var(--rd)"}}/>
                  <div className="blbl">Rt {b.route}</div>
                </div>
              ))}
              <div className="mtop">
                <div className="mpill">
                  <div style={{fontSize:11.5,fontWeight:700,marginBottom:2}}>🗺️ {city==="All Cities"?"All India":city}</div>
                  <div style={{fontSize:10,color:"var(--t3)"}}>{BUSES.length} vehicles · Updated {mapTick%10}s ago</div>
                </div>
                <div className="mpill">
                  <div className="mleg">
                    <div className="leg"><div className="ldot" style={{background:"var(--gr)"}}/>On Time</div>
                    <div className="leg"><div className="ldot" style={{background:"var(--rd)"}}/>Delayed</div>
                    <div className="leg"><div className="ldot" style={{background:"var(--am)"}}/>Maintenance</div>
                  </div>
                </div>
              </div>
              {selBus&&(
                <div className="bpanel">
                  <div><div className="bpl">Vehicle</div><div className="bpv" style={{fontSize:10.5}}>{selBus.id}</div></div>
                  <div><div className="bpl">Driver</div><div className="bpv" style={{fontSize:11.5}}>{selBus.driver}</div></div>
                  <div><div className="bpl">Speed</div><div className="bpv">{selBus.speed} km/h</div></div>
                  <div><div className="bpl">Occupancy</div><div className="bpv" style={{color:fmtOcc(selBus.occupancy)}}>{selBus.occupancy}%</div></div>
                  <div><div className="bpl">At Stop</div><div className="bpv" style={{fontSize:10.5}}>{selBus.stop}</div></div>
                  <div><div className="bpl">Next Stop</div><div className="bpv" style={{fontSize:10.5}}>{selBus.next}</div></div>
                  <div><div className="bpl">Status</div><div className="bpv" style={{color:selBus.status==="On Time"?"var(--gr)":"var(--rd)",fontSize:11}}>{selBus.status}{selBus.delay>0?` +${selBus.delay}m`:""}</div></div>
                  <div><div className="bpl">Fuel</div><div className="bpv" style={{fontSize:11}}>{selBus.fuel}{selBus.battery?` · ${selBus.battery}%🔋`:""}</div></div>
                </div>
              )}
            </div>
            <div className="blist">
              {busPos.map(b=>(
                <div key={b.id} className={`bchip ${selBus?.id===b.id?"sel":""}`} onClick={()=>setSelBus(selBus?.id===b.id?null:b)}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:b.status==="On Time"?"var(--gr)":"var(--rd)"}}/>
                    <span style={{fontSize:11,fontWeight:700}}>Route {b.route}</span>
                  </div>
                  <div style={{fontSize:10,color:"var(--t3)",marginBottom:2}}>{b.stop}</div>
                  <div style={{fontSize:10,color:"var(--t2)"}}>{b.speed}km/h · {b.occupancy}% full</div>
                  <div style={{fontSize:9.5,color:b.status==="On Time"?"var(--gr)":"var(--rd)",marginTop:2,fontWeight:600}}>{b.status}{b.delay>0?` +${b.delay}m`:""}</div>
                </div>
              ))}
              <div style={{flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 8px"}}>
                <button className="sbtn" style={{fontSize:11,whiteSpace:"nowrap"}} onClick={()=>setBusModal(busPos[0])}>View All Details →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ JOURNEY PLANNER ═══ */}
      {tab==="Journey"&&(
        <div className="sec">
          <div className="sh"><div className="ey">AI Journey Planner</div><div className="st">Find Your Best Route</div><div className="ss">Real-time AI analyses thousands of route combinations — traffic, crowd, weather, preferences — in seconds.</div></div>
          <div className="scard" style={{maxWidth:"100%",marginBottom:18}}>

            {/* City selector */}
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:7,letterSpacing:".07em",textTransform:"uppercase"}}>Select City</div>
              <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
                {["Surat","Ahmedabad","Mumbai","Delhi","Bangalore","Hyderabad","Pune","Chennai","Kolkata","Jaipur","Lucknow","Kochi","Bhopal"].map(ci=>(
                  <button key={ci} onClick={()=>{setPlanCity(ci);setFrom("");setTo("");setPlan(null);}}
                    style={{padding:"5px 12px",borderRadius:100,background:planCity===ci?"rgba(99,102,241,.22)":"var(--g1)",border:`1px solid ${planCity===ci?"var(--a)":"var(--b1)"}`,color:planCity===ci?"var(--a2)":"var(--t2)",fontSize:11.5,fontWeight:600,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s"}}>
                    {CITY_ICONS[ci]||"🏙️"} {ci}
                  </button>
                ))}
              </div>
            </div>

            {/* From / To dropdowns with all stops */}
            <div className="irow">
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:5,letterSpacing:".06em",textTransform:"uppercase"}}>📍 From Stop</div>
                <select className="inp" value={from} onChange={e=>setFrom(e.target.value)}>
                  <option value="">— Select starting stop —</option>
                  {(CITY_STOPS[planCity]||[]).map(s=><option key={s} value={s}>{s}</option>)}
                  <optgroup label="── Landmarks & Hospitals ──">
                    {LANDMARKS.filter(l=>l.city===planCity).map(l=><option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
                  </optgroup>
                </select>
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:5,letterSpacing:".06em",textTransform:"uppercase"}}>🎯 To Stop</div>
                <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
                  <option value="">— Select destination stop —</option>
                  {(CITY_STOPS[planCity]||[]).filter(s=>s!==from).map(s=><option key={s} value={s}>{s}</option>)}
                  <optgroup label="── Landmarks & Hospitals ──">
                    {LANDMARKS.filter(l=>l.city===planCity&&l.name!==from).map(l=><option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Or type manually */}
            <div style={{fontSize:11,color:"var(--t3)",textAlign:"center",margin:"4px 0 8px"}}>— or type any stop / landmark manually —</div>
            <div className="irow">
              <input className="inp" placeholder="📍 Type stop or landmark…" value={from} onChange={e=>setFrom(e.target.value)}/>
              <input className="inp" placeholder="🎯 Type destination…" value={to} onChange={e=>setTo(e.target.value)}/>
            </div>

            {/* Options row */}
            <div className="irow">
              <select className="inp"><option>♿ Any Accessibility</option><option>♿ Wheelchair Friendly</option><option>👩 Women's Safety Mode</option><option>👴 Senior Citizen</option></select>
              <select className="inp"><option>🚌 All Modes</option><option>🚌 Bus Only</option><option>🚇 Metro + Bus</option><option>🚂 Train + Bus</option><option>🛺 Bus + Auto</option><option>❄️ AC Only</option><option>⚡ Electric Only</option></select>
            </div>

            {/* From→To preview */}
            {from&&to&&(
              <div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10,fontSize:13}}>
                <span style={{color:"var(--gr)",fontWeight:700}}>📍 {from}</span>
                <span style={{color:"var(--t3)",flex:1,textAlign:"center"}}>──── {planCity} ────</span>
                <span style={{color:"var(--rd)",fontWeight:700}}>🎯 {to}</span>
              </div>
            )}

            <button className="pbtn" onClick={doplan} disabled={planning||!from||!to}>{planning?"🧠 AI Planning Your Route…":"🧭 Plan Journey with AI"}</button>
          </div>
          {!plan&&!planning&&(
            <div style={{marginBottom:22}}>
              <div style={{fontSize:11,color:"var(--t3)",marginBottom:9,fontWeight:700,letterSpacing:".06em",textTransform:"uppercase"}}>Try an example</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[["Railway Station","Airport"],["Bandra","Andheri"],["Connaught Place","Saket"],["MG Road","Whitefield"],["Old City","IT Park"],["Chandni Chowk","Dwarka"]].map(([f,t])=>(
                  <button key={f} style={{padding:"6px 13px",borderRadius:7,background:"var(--g1)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:11.5,cursor:"pointer",fontFamily:"'Inter',sans-serif"}} onClick={()=>{setFrom(f);setTo(t);}}>{f} → {t}</button>
                ))}
              </div>
            </div>
          )}
          {planning&&<div className="ld"><div className="ldd"/><div className="ldd"/><div className="ldd"/></div>}
          {plan&&!plan.error&&(
            <>
              {plan.tip&&<div className="tip-box"><span>🤖</span><div><strong>AI Tip:</strong> {plan.tip}</div></div>}
              {plan.crowdAlert&&<div className="crowd-box"><span>⚠️</span><div><strong>Crowd Alert:</strong> {plan.crowdAlert}</div></div>}
              <div className="plang">
                {[{k:"fastest",l:"⚡ Fastest Route",c:"var(--a2)",best:true},{k:"cheapest",l:"💸 Cheapest Route",c:"var(--gr)"},{k:"leastWalk",l:"🚶 Least Walking",c:"var(--am)"},{k:"wheelchair",l:"♿ Accessible Route",c:"var(--cy)"}].map(opt=>plan[opt.k]&&(
                  <div key={opt.k} className={`plopt ${opt.best?"best":""}`}>
                    <div className="pll" style={{color:opt.c}}>{opt.l}</div>
                    <div className="plt">{plan[opt.k].time}</div>
                    <div className="plf">{plan[opt.k].fare} · {plan[opt.k].walk} walk · {plan[opt.k].transfers} transfer{plan[opt.k].transfers!==1?"s":""}</div>
                    <div className="plm">{plan[opt.k].mode}</div>
                    {(plan[opt.k].steps||[]).map((s,i)=><div key={i} className="pls">{s}</div>)}
                    {plan[opt.k].delay&&<div className="pld">⏱ {plan[opt.k].delay}</div>}
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:9,flexWrap:"wrap",marginBottom:24}}>
                <button className="pbtn" style={{maxWidth:230,padding:"10px 0",fontSize:12}} onClick={()=>nav("Payment")}>🎫 Buy Ticket for This Journey</button>
                <button className="sbtn" style={{fontSize:12}} onClick={()=>setShareMsg(`Journey from ${from} to ${to} planned via TransitOne AI. Estimated time: ${plan.fastest?.time||"–"}, Fare: ${plan.fastest?.fare||"–"}.`)}>📤 Share Journey</button>
                <button className="sbtn" style={{fontSize:12}} onClick={()=>setPlan(null)}>↩ Plan Again</button>
              </div>
            </>
          )}
          {plan?.error&&<div className="tip-box" style={{borderColor:"rgba(239,68,68,.28)",background:"rgba(239,68,68,.07)"}}>⚠️ Could not plan this journey. Check inputs or try different stops.</div>}

          {/* FARE TABLE */}
          <div style={{marginTop:28}}>
            <div className="sh"><div className="ey">Fare Structure</div><div className="st" style={{fontSize:22}}>Distance-Based Fares</div></div>
            <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden"}}>
              <table className="tbl">
                <thead><tr><th>Distance Slab</th><th>Standard Fare</th><th>Student (40% off)</th><th>Senior Citizen (50% off)</th><th>Monthly Pass</th><th>Annual Pass</th></tr></thead>
                <tbody>
                  {[[0,5,"₹10"],[5,10,"₹15"],[10,20,"₹20"],[20,30,"₹25"],[30,999,"₹35"]].map(([f,t,fare])=>(
                    <tr key={f}>
                      <td style={{fontWeight:600}}>{f===0?"Up to 5":f===30?"30+ km":`${f}–${t} km`}</td>
                      <td style={{fontWeight:700,color:"var(--t1)"}}>{fare}</td>
                      <td style={{color:"var(--gr)"}}>₹{Math.floor(parseInt(fare.replace("₹",""))*.6)}</td>
                      <td style={{color:"var(--am)"}}>₹{Math.floor(parseInt(fare.replace("₹",""))*.5)}</td>
                      <td style={{color:"var(--a2)"}}>Unlimited</td>
                      <td style={{color:"var(--pk)"}}>Unlimited</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI CHAT */}
          <div style={{marginTop:32}}>
            <div className="sh"><div className="ey">AI Assistant</div><div className="st" style={{fontSize:22}}>Ask TransitOne AI</div></div>
            <div className="chat">
              <div className="chat-h">
                <div style={{width:30,height:30,borderRadius:"50%",background:"var(--grad)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🤖</div>
                <div><div style={{fontSize:12.5,fontWeight:700}}>TransitOne AI</div><div style={{fontSize:10,color:"var(--gr)"}}>● Online · Replies instantly in {lang}</div></div>
              </div>
              <div className="chat-b">
                {chat.map((m,i)=><div key={i} className={`cm ${m.r}`}>{m.t}</div>)}
                {chatBusy&&<div className="cm ai"><div className="ld" style={{padding:"4px 0"}}><div className="ldd"/><div className="ldd"/><div className="ldd"/></div></div>}
                <div ref={chatEnd}/>
              </div>
              <div className="chat-ir">
                <input className="chat-inp" placeholder="Ask about routes, fares, schedules, stops…" value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doChat()}/>
                <button className="csend" onClick={doChat} disabled={chatBusy}>Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ ROUTES ═══ */}
      {tab==="Routes"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Routes & Stops</div><div className="st">Browse the Full Network</div></div>
          <div style={{display:"flex",gap:9,marginBottom:18,flexWrap:"wrap"}}>
            <input className="inp" style={{maxWidth:230}} placeholder="🔍 Search route, stop, city…" value={rSearch} onChange={e=>setRSearch(e.target.value)}/>
            <select className="inp" style={{maxWidth:170,cursor:"pointer"}} value={city} onChange={e=>setCity(e.target.value)}>
              <option>All Cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
            {["All","AC","Electric","Non-AC"].map(f=>(
              <button key={f} onClick={()=>setRFilter(f)} style={{padding:"7px 14px",borderRadius:100,background:rFilter===f?"rgba(99,102,241,.18)":"var(--g1)",border:`1px solid ${rFilter===f?"var(--a)":"var(--b1)"}`,color:rFilter===f?"var(--a2)":"var(--t2)",fontSize:11.5,cursor:"pointer",fontFamily:"'Inter',sans-serif",transition:"all .18s"}}>{f}</button>
            ))}
          </div>
          <div className="rgrid">
            {filtRoutes.map(r=>(
              <div key={r.id} className="rc" onClick={()=>setRouteModal(r)}>
                <div className="rc-hd">
                  <div><div style={{fontSize:9.5,color:"var(--t3)",marginBottom:2}}>{r.city}</div><div className="rcno">Route {r.no}</div></div>
                  <span className={`badge ${bType(r.type)}`}>{r.type}</span>
                </div>
                <div className="rpath"><div className="rdot"/><span style={{fontSize:12}}>{r.from}</span><div className="rline"/><div className="rdot2"/><span style={{fontSize:12}}>{r.to}</span></div>
                <div className="rmeta">
                  <div className="rm"><span>{r.dur}</span>Duration</div>
                  <div className="rm"><span>{r.fare}</span>Fare</div>
                  <div className="rm"><span style={{color:"var(--gr)"}}>{r.next}</span>Next Bus</div>
                  <div className="rm"><span>{r.buses}</span>Buses</div>
                  <div className="rm"><span>{r.stops}</span>Stops</div>
                  <div className="rm"><span>{r.freq}</span>Frequency</div>
                </div>
                <div className="racts">
                  <button className="rbtn" onClick={e=>{e.stopPropagation();nav("Live Map");}}>📍 Track Live</button>
                  <button className="rbtn pri" onClick={e=>{e.stopPropagation();nav("Payment");}}>🎫 Buy Ticket</button>
                </div>
              </div>
            ))}
            {filtRoutes.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:"44px 18px",color:"var(--t3)"}}>
              <div style={{fontSize:38,marginBottom:11}}>🔍</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--t2)"}}>No routes found</div>
              <div style={{fontSize:12,marginTop:5}}>Try a different city or search term</div>
            </div>}
          </div>

          {/* STOPS */}
          <div style={{marginTop:36}}>
            <div className="sh"><div className="ey">Key Stops</div><div className="st" style={{fontSize:22}}>Stops & Interchanges</div></div>
            <input className="inp" style={{maxWidth:280,marginBottom:14}} placeholder="🔍 Search stops…" value={stopSearch} onChange={e=>setStopSearch(e.target.value)}/>
            <div className="stop-g">
              {STOPS.filter(s=>!stopSearch||s.name.toLowerCase().includes(stopSearch.toLowerCase())||s.city.toLowerCase().includes(stopSearch.toLowerCase())).map(s=>(
                <div key={s.id} className="stop-c">
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                    <div style={{fontSize:12.5,fontWeight:700}}>{s.name}</div>
                    <span style={{fontSize:10,color:"var(--t3)"}}>{s.city}</span>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:9}}>
                    {s.routes.map(r=><span key={r} style={{padding:"2px 7px",borderRadius:4,background:"rgba(99,102,241,.14)",color:"var(--a2)",fontSize:10.5,fontWeight:700}}>{r}</span>)}
                  </div>
                  <div style={{fontSize:10.5,color:"var(--t3)",marginBottom:9}}>🏗️ {s.facilities.join(" · ")}</div>
                  <div style={{display:"flex",gap:7}}>
                    <button className="rbtn" style={{flex:1,fontSize:10.5}} onClick={()=>setToast("📍 Directions — opening in Google Maps…")}>📍 Directions</button>
                    <button className="rbtn pri" style={{flex:1,fontSize:10.5}} onClick={()=>setToast("🔔 Arrival alert set! We'll notify you 5 minutes before the bus arrives.")}>🔔 Set Alert</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ SCHEDULE ═══ */}
      {tab==="Schedule"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Timetable</div><div className="st">Full Schedule & Timetable</div><div className="ss">Live departure boards for every route. Updates in real time.</div></div>
          <div style={{display:"flex",gap:9,marginBottom:18,flexWrap:"wrap"}}>
            <select className="inp" style={{maxWidth:180,cursor:"pointer"}} value={schRoute} onChange={e=>setSchRoute(e.target.value)}>
              {ROUTES.map(r=><option key={r.no} value={r.no}>Route {r.no} — {r.city}</option>)}
            </select>
            <select className="inp" style={{maxWidth:140,cursor:"pointer"}}><option>Today</option><option>Tomorrow</option><option>Sun, Jun 29</option></select>
            <select className="inp" style={{maxWidth:150,cursor:"pointer"}}><option>All Directions</option><option>Outbound</option><option>Inbound</option></select>
          </div>

          {(() => {
            const rt = ROUTES.find(r=>r.no===schRoute)||ROUTES[0];
            return (
              <>
                <div className="abar info"><span>🕐</span><div><strong>Route {rt.no}:</strong> {rt.from} → {rt.to} · {rt.city} · {rt.freq} · {rt.type}</div></div>
                <div className="sch-g">
                  <div className="sch-row hdr"><div>Departure</div><div>From</div><div>To</div><div>Status</div></div>
                  {TIMETABLE.map((t,i)=>(
                    <div key={i} className="sch-row">
                      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:13.5}}>{t.time}</div>
                      <div style={{fontSize:12}}>{t.from}</div>
                      <div style={{fontSize:12}}>{t.to}</div>
                      <div>
                        <span className={`sb ${t.status==="Departed"?"sb-ok":t.status.includes("delay")?"sb-late":t.status==="Scheduled"?"sb-lo":"sb-ok"}`}>
                          ● {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}

          {/* MAINTENANCE */}
          <div style={{marginTop:36}}>
            <div className="sh"><div className="ey">Fleet Maintenance</div><div className="st" style={{fontSize:22}}>Maintenance Schedule</div></div>
            <table className="tbl" style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)"}}>
              <thead><tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Date</th><th>Technician</th><th>Cost</th><th>Status</th></tr></thead>
              <tbody>
                {MAINTENANCE.map(m=>(
                  <tr key={m.id}>
                    <td style={{color:"var(--t3)",fontSize:10.5}}>{m.id}</td>
                    <td style={{fontWeight:600,fontSize:11.5}}>{m.vehicle}</td>
                    <td>{m.type}</td>
                    <td style={{fontSize:11.5}}>{m.date}</td>
                    <td>{m.tech}</td>
                    <td style={{fontWeight:700,color:"var(--am)"}}>{m.cost}</td>
                    <td><span className={`sb ${m.status==="Completed"?"sb-ok":m.status==="In Progress"?"sb-prog":"sb-lo"}`}>● {m.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ SMART SEARCH ═══ */}
      {tab==="Smart Search"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Smart Search</div><div className="st">Find Any Stop, Route, or Landmark</div><div className="ss">Search by bus number, stop name, hospital, mall, college, airport, temple, landmark — or use voice search.</div></div>
          <div style={{display:"flex",gap:9,marginBottom:14}}>
            <input className="inp" style={{flex:1}} placeholder="🔍 Search buses, stops, hospitals, malls, colleges, airports…" value={srQuery} onChange={e=>setSrQuery(e.target.value)}/>
            <button onClick={()=>setToast("🎙️ Voice Search — Feature coming soon! Use text search for now.")} style={{padding:"10px 16px",borderRadius:"var(--r2)",background:"rgba(99,102,241,.15)",border:"1px solid rgba(99,102,241,.3)",color:"var(--a2)",fontSize:12.5,fontWeight:700,cursor:"pointer"}}>🎙️ Voice</button>
          </div>
          <div className="srcat">
            {["All","Hospital","Mall","College","Airport","Railway","Metro","Temple"].map(c=>(
              <button key={c} className={`srcat-btn ${srCat===c?"on":""}`} onClick={()=>setSrCat(c)}>{c}</button>
            ))}
          </div>
          {srResults.length>0?(
            <div className="sr-res">
              {srResults.map((l,i)=>(
                <div key={i} className="sr-item" onClick={()=>{setFrom(l.city+" "+l.type);nav("Journey");}}>
                  <div style={{fontSize:28,flexShrink:0}}>{l.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:700,marginBottom:3}}>{l.name}</div>
                    <div style={{fontSize:11.5,color:"var(--t2)"}}>{l.type} · {l.city}</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:11.5,color:"var(--a2)",fontWeight:700,marginBottom:3}}>Route {l.route}</div>
                    <button className="rbtn pri" style={{fontSize:10.5,padding:"4px 10px"}} onClick={e=>{e.stopPropagation();nav("Routes");}}>View Route →</button>
                  </div>
                </div>
              ))}
            </div>
          ):(
            <div style={{textAlign:"center",padding:"40px 18px",color:"var(--t3)"}}>
              <div style={{fontSize:36,marginBottom:11}}>🔍</div>
              <div style={{fontSize:14,fontWeight:600,color:"var(--t2)"}}>No results found</div>
              <div style={{fontSize:12,marginTop:5}}>Try searching for a hospital, mall, college, or landmark</div>
            </div>
          )}

          {/* LANDMARK CATEGORIES */}
          <div style={{marginTop:32}}>
            <div className="sh"><div className="ey">Browse by Category</div><div className="st" style={{fontSize:22}}>Popular Destinations</div></div>
            <div className="lm-g">
              {[{ico:"🏥",t:"Hospitals",ex:"AIIMS, Apollo, Fortis",cat:"Hospital"},{ico:"🛍️",t:"Malls",ex:"Phoenix, Select City, Infinity",cat:"Mall"},{ico:"🎓",t:"Colleges",ex:"IIT, IIM, BITS Pilani",cat:"College"},{ico:"✈️",t:"Airports",ex:"IGI, CSIA, Kempegowda",cat:"Airport"},{ico:"🚂",t:"Railway Stations",ex:"CSMT, New Delhi, Surat Stn",cat:"Railway"},{ico:"🚇",t:"Metro Stations",ex:"Andheri, Rajiv Chowk, MG Road",cat:"Metro"},{ico:"🕌",t:"Religious Places",ex:"Siddhivinayak, Lotus Temple",cat:"Temple"},{ico:"🏟️",t:"Sports Venues",ex:"Wankhede, Eden Gardens",cat:"Sports"}].map((c,i)=>(
                <div key={i} className="lm-c" onClick={()=>setSrCat(c.cat)}>
                  <div style={{fontSize:30,marginBottom:9}}>{c.ico}</div>
                  <div style={{fontSize:13,fontWeight:700,marginBottom:5}}>{c.t}</div>
                  <div style={{fontSize:11,color:"var(--t3)"}}>{c.ex}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ PASSENGER ═══ */}
      {tab==="Passenger"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Passenger Portal</div><div className="st">My TransitOne</div></div>
          <div className="pl">
            <div className="psb">
              {[["📊","Dashboard"],["🎫","My Pass"],["📲","QR Ticket"],["🕐","Trip History"],["⭐","Favourites"],["📍","Nearby Stops"],["🔔","Notifications"],["📋","Complaints"],["🆘","SOS & Safety"],["🔍","Lost & Found"]].map(([ico,s])=>(
                <div key={s} className={`an ${passSec===s?"on":""}`} onClick={()=>setPassSec(s)}>{ico} {s}</div>
              ))}
            </div>
            <div className="pm">

              {passSec==="Dashboard"&&(
                <>
                  <div className="ppro">
                    <div className="ava">👤</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14.5,fontWeight:800}}>Arjun Mehta</div>
                      <div style={{fontSize:11.5,color:"var(--t2)"}}>arjun.mehta@gmail.com · +91 98765 43210</div>
                      <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                        <span style={{padding:"2px 8px",borderRadius:4,background:"rgba(16,185,129,.15)",color:"var(--gr)",fontSize:10.5,fontWeight:700}}>Monthly Pass Active</span>
                        <span style={{padding:"2px 8px",borderRadius:4,background:"rgba(99,102,241,.15)",color:"var(--a2)",fontSize:10.5,fontWeight:700}}>Gold Member</span>
                      </div>
                    </div>
                  </div>
                  <div className="krow">
                    {[{v:"142",l:"Trips This Month",c:"var(--a)"},{v:"₹280",l:"Savings This Month",c:"var(--gr)"},{v:"18 days",l:"Pass Validity",c:"var(--am)"}].map(k=>(
                      <div key={k.l} className="kc"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
                    ))}
                  </div>
                  <div style={{fontSize:12.5,fontWeight:700,marginBottom:11}}>Recent Trips</div>
                  <div className="tlist">
                    {[{ico:"🚌",from:"Railway Station",to:"IT Park",date:"Today 9:14 AM",route:"101",fare:"₹25",dur:"45 min"},{ico:"⚡",from:"City Mall",to:"Airport",date:"Yesterday 7:32 PM",route:"303",fare:"₹30",dur:"55 min"},{ico:"🚌",from:"University",to:"Metro Station",date:"Jun 25, 3:10 PM",route:"404",fare:"₹20",dur:"25 min"}].map((t,i)=>(
                      <div key={i} className="ti">
                        <div style={{fontSize:22,flexShrink:0}}>{t.ico}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12.5,fontWeight:600}}>{t.from} → {t.to}</div>
                          <div style={{fontSize:11,color:"var(--t2)"}}>Route {t.route} · {t.dur} · {t.date}</div>
                        </div>
                        <div style={{fontSize:12.5,fontWeight:700,color:"var(--a2)"}}>{t.fare}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="My Pass"&&(
                <>
                  <div className="pcard" style={{marginBottom:18}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:9.5,fontWeight:800,letterSpacing:".12em",color:"var(--t3)",marginBottom:7,textTransform:"uppercase"}}>TransitOne India · Monthly Pass</div>
                        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:4}}>Arjun Mehta</div>
                        <div style={{fontSize:12,color:"var(--t2)"}}>Valid: 1 June – 30 June 2026</div>
                        <div style={{fontSize:12,color:"var(--t2)"}}>City: All Surat Routes · Unlimited Rides</div>
                        <div style={{fontSize:11,color:"var(--t3)",marginTop:8}}>Pass ID: T1-SRT-20260601-8821</div>
                      </div>
                      <div style={{fontSize:34}}>🎫</div>
                    </div>
                    <div style={{marginTop:14,paddingTop:11,borderTop:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",fontSize:10.5,color:"var(--t3)"}}>
                      <span>Gold Member · 142 trips used this month</span>
                      <span style={{color:"var(--gr)",fontWeight:700}}>● ACTIVE</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
                    <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>nav("Payment")}>🔄 Renew Pass</button>
                    <button className="sbtn" style={{fontSize:12}} onClick={()=>{setShareMsg("Travelling with TransitOne India Monthly Pass — unlimited rides across all Surat routes till June 30, 2026.");}}>📤 Share Pass</button>
                    <button className="sbtn" style={{fontSize:12}} onClick={()=>setToast("📄 Pass PDF generated — check your downloads folder.")}>📄 Download PDF</button>
                  </div>
                </>
              )}

              {passSec==="QR Ticket"&&(
                <div style={{display:"flex",gap:22,flexWrap:"wrap",alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontSize:12.5,fontWeight:700,marginBottom:11}}>Active QR Ticket</div>
                    <div className="qrbox">
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {Array.from({length:14},(_,row)=>Array.from({length:14},(_,col)=>{
                          const fill=(row+col*3+row*col)%3===0;
                          return fill?<rect key={`${row}-${col}`} x={col*10} y={row*10} width={10} height={10} fill="#000"/>:null;
                        }))}
                        <rect x="0" y="0" width="40" height="40" fill="#000"/><rect x="5" y="5" width="30" height="30" fill="white"/><rect x="10" y="10" width="20" height="20" fill="#000"/>
                        <rect x="100" y="0" width="40" height="40" fill="#000"/><rect x="105" y="5" width="30" height="30" fill="white"/><rect x="110" y="10" width="20" height="20" fill="#000"/>
                        <rect x="0" y="100" width="40" height="40" fill="#000"/><rect x="5" y="105" width="30" height="30" fill="white"/><rect x="10" y="110" width="20" height="20" fill="#000"/>
                      </svg>
                    </div>
                    <div style={{fontSize:11,color:"var(--t3)",textAlign:"center",marginTop:9}}>Scan at bus entry gate<br/>Expires: Today 11:59 PM</div>
                  </div>
                  <div style={{flex:1,minWidth:220}}>
                    <div style={{background:"rgba(255,255,255,.04)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"14px",marginBottom:12}}>
                      <div style={{fontSize:10,color:"var(--t3)",marginBottom:8,fontWeight:700,letterSpacing:".07em",textTransform:"uppercase"}}>Ticket Details</div>
                      {[["Route","101 — Railway St. → Airport"],["Date","Today, 27 June 2026"],["Fare","₹25"],["Type","AC Bus"],["Ticket ID","TKT-20260627-4489-SRT"],["Status","Valid · Not Yet Used"]].map(([l,v])=>(
                        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid var(--b1)",fontSize:11.5}}>
                          <span style={{color:"var(--t3)"}}>{l}</span>
                          <span style={{fontWeight:600,color:l==="Status"?"var(--gr)":"var(--t1)"}}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <button className="pbtn" style={{fontSize:12,padding:"10px 0"}} onClick={()=>nav("Payment")}>+ Buy Another Ticket</button>
                  </div>
                </div>
              )}

              {passSec==="Trip History"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:12.5,fontWeight:700}}>All Trips — June 2026</div>
                    <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("📊 CSV export — downloading your trip history…")}>📊 Export CSV</button>
                  </div>
                  <div style={{marginBottom:14,display:"flex",gap:8}}>
                    {["This Month","Last Month","Last 3 Months"].map(p=><button key={p} onClick={()=>setToast(`📊 Showing trips for: ${p}`)} style={{padding:"5px 11px",borderRadius:7,background:"var(--g1)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:10.5,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>{p}</button>)}
                  </div>
                  <div className="tlist">
                    {[{ico:"🚌",from:"Railway Station",to:"IT Park",date:"Today 9:14 AM",route:"101",fare:"₹25",dur:"45 min"},{ico:"⚡",from:"City Mall",to:"Airport",date:"Yesterday 7:32 PM",route:"303",fare:"₹30",dur:"55 min"},{ico:"🚌",from:"University",to:"Metro Station",date:"Jun 25, 3:10 PM",route:"404",fare:"₹20",dur:"25 min"},{ico:"🚌",from:"Old City",to:"New Township",date:"Jun 24, 8:55 AM",route:"606",fare:"₹18",dur:"35 min"},{ico:"⚡",from:"MG Road",to:"City Center",date:"Jun 22, 6:10 PM",route:"505",fare:"₹35",dur:"40 min"},{ico:"🚌",from:"BRTS Stand",to:"Airport",date:"Jun 20, 11:00 AM",route:"202",fare:"₹15",dur:"30 min"}].map((t,i)=>(
                      <div key={i} className="ti">
                        <div style={{fontSize:22,flexShrink:0}}>{t.ico}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12.5,fontWeight:600}}>{t.from} → {t.to}</div>
                          <div style={{fontSize:11,color:"var(--t2)"}}>Route {t.route} · {t.dur} · {t.date}</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{fontSize:12.5,fontWeight:700,color:"var(--a2)"}}>{t.fare}</div>
                          <div style={{fontSize:9.5,color:"var(--gr)"}}>✓ Completed</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="Favourites"&&(
                <>
                  <div style={{fontSize:12.5,fontWeight:700,marginBottom:13}}>Favourite Routes & Stops</div>
                  <div className="fav-l">
                    {[{t:"route",ico:"🚌",nm:"Route 101 — Railway Station → Airport",city:"Surat",tag:"Daily commute"},{t:"stop",ico:"📍",nm:"Udhna Darwaja Bus Stop",city:"Surat",tag:"Near home"},{t:"route",ico:"⚡",nm:"Route 303 — Bus Depot → IT Park",city:"Mumbai",tag:"Work route"},{t:"stop",ico:"📍",nm:"Surat Railway Station",city:"Surat",tag:"Commute start"}].map((f,i)=>(
                      <div key={i} className="fav-i">
                        <div style={{display:"flex",gap:9,alignItems:"center",flex:1}}>
                          <span style={{fontSize:22}}>{f.ico}</span>
                          <div><div style={{fontSize:12.5,fontWeight:600}}>{f.nm}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{f.city} · {f.tag}</div></div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button className="rbtn" style={{padding:"4px 9px",fontSize:10.5}} onClick={()=>{setFrom(f.nm);nav("Journey");setToast(`🗺️ Planning journey from ${f.nm}…`);}}>Go</button>
                          <button className="rbtn" style={{padding:"4px 9px",fontSize:10.5,color:"var(--rd)"}} onClick={()=>setToast("🗑️ Removed from Favourites.")}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="Nearby Stops"&&(
                <>
                  <div style={{padding:"9px 12px",background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",fontSize:12,color:"var(--a2)",marginBottom:14}}>
                    📍 Based on your last location: Udhna, Surat
                  </div>
                  <div className="nr-g">
                    {[{nm:"Udhna Darwaja",dist:"120m",routes:["101","202"],walk:"2 min"},{nm:"Udhna GIDC",dist:"340m",routes:["303"],walk:"4 min"},{nm:"Udhna Junction",dist:"580m",routes:["101","404","606"],walk:"7 min"},{nm:"Ram Chowk",dist:"720m",routes:["202","505"],walk:"9 min"},{nm:"Limbayat Circle",dist:"950m",routes:["101"],walk:"12 min"},{nm:"Sarthana Nature Park",dist:"1.1km",routes:["202","303"],walk:"14 min"}].map((s,i)=>(
                      <div key={i} className="nr-c">
                        <div style={{fontSize:12.5,fontWeight:700,marginBottom:3}}>{s.nm}</div>
                        <div style={{fontSize:10.5,color:"var(--t3)",marginBottom:7}}>🚶 {s.walk} · {s.dist}</div>
                        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:7}}>
                          {s.routes.map(r=><span key={r} style={{padding:"2px 6px",borderRadius:4,background:"rgba(99,102,241,.14)",color:"var(--a2)",fontSize:10,fontWeight:700}}>{r}</span>)}
                        </div>
                        <button className="rbtn" style={{width:"100%",fontSize:10.5}} onClick={()=>nav("Live Map")}>📍 Track Bus Here</button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="Notifications"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:12.5,fontWeight:700}}>All Notifications</div>
                    <button className="sbtn" style={{fontSize:10.5}} onClick={()=>setToast("✅ All notifications marked as read.")}>Mark All Read</button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:1}}>
                    {NOTIFS.map((n,i)=>(
                      <div key={i} style={{padding:"12px 14px",borderRadius:"var(--r2)",background:n.unread?"rgba(99,102,241,.06)":"rgba(255,255,255,.02)",border:`1px solid ${n.unread?"rgba(99,102,241,.18)":"var(--b1)"}`,marginBottom:2,display:"flex",gap:10,alignItems:"flex-start"}}>
                        {n.unread&&<div style={{width:6,height:6,borderRadius:"50%",background:"var(--a)",flexShrink:0,marginTop:5}}/>}
                        <span style={{fontSize:20,flexShrink:0}}>{n.icon}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12.5,lineHeight:1.5}}>{n.text}</div>
                          <div style={{fontSize:9.5,color:"var(--t3)",marginTop:3}}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="Complaints"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:12.5,fontWeight:700}}>My Complaints</div>
                    <button className="addbtn" onClick={()=>setToast("📋 Complaint form — fill in your details below.")}>+ New Complaint</button>
                  </div>
                  <div className="tlist">
                    {[{id:"C8821",type:"AC Not Working",route:"101",date:"Today 10:00 AM",status:"In Progress",reply:"Our team is investigating — expected resolution by 4 PM."},{id:"C8802",type:"Driver Rash Driving",route:"303",date:"Jun 24",status:"Resolved",reply:"Action taken against driver. Thank you for reporting."}].map((c,i)=>(
                      <div key={i} style={{background:"rgba(255,255,255,.03)",borderRadius:"var(--r2)",padding:"13px",marginBottom:7}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <div style={{fontSize:12.5,fontWeight:700}}>{c.type}</div>
                          <span className={`sb ${c.status==="Resolved"?"sb-done":"sb-prog"}`}>● {c.status}</span>
                        </div>
                        <div style={{fontSize:11,color:"var(--t2)",marginBottom:7}}>Route {c.route} · {c.date} · #{c.id}</div>
                        {c.reply&&<div style={{fontSize:11.5,color:"var(--t3)",background:"rgba(255,255,255,.03)",borderRadius:7,padding:"7px 10px"}}>💬 {c.reply}</div>}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {passSec==="SOS & Safety"&&(
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:12.5,color:"var(--t2)",marginBottom:22,lineHeight:1.7}}>Press the SOS button in an emergency. Your GPS location and bus details will be sent to the nearest police station and TransitOne safety team immediately.</div>
                  <button className={`sos-btn ${sos?"act":""}`} onClick={()=>setSos(v=>!v)}>
                    <span style={{fontSize:34}}>🆘</span>
                    <span style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,.85)"}}>{sos?"ACTIVE":"SOS"}</span>
                  </button>
                  {sos&&<div className="abar" style={{marginBottom:18,justifyContent:"center"}}><span>🚨</span><div><strong>SOS Alert Sent!</strong> Emergency services notified. Stay on the bus. Help is on the way.</div></div>}
                  <div className="em-g" style={{maxWidth:400,margin:"0 auto"}}>
                    {[["📞","Police","100"],["🚑","Ambulance","108"],["🔥","Fire","101"],["👮","Women Helpline","1091"],["🏥","Medical Emergency","102"],["🆘","TransitOne Safety","1800-XXX-XXXX"]].map(([ico,lbl,no])=>(
                      <div key={lbl} className="em-c">
                        <div style={{fontSize:24,marginBottom:5}}>{ico}</div>
                        <div style={{fontSize:12,fontWeight:700}}>{lbl}</div>
                        <div style={{fontSize:11,color:"var(--t3)"}}>{no}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {passSec==="Lost & Found"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontSize:12.5,fontWeight:700}}>Lost & Found Reports</div>
                    <button className="addbtn" onClick={()=>setToast("🔍 Lost item report form — describe your item and we'll search.")}>+ Report Item</button>
                  </div>
                  <div className="tlist">
                    {[{ico:"👜",item:"Black Laptop Bag",route:"101",date:"Jun 26",status:"Found",location:"Surat Depot"},{ico:"📱",item:"Samsung S24 Phone",route:"505",date:"Jun 24",status:"Searching",location:"Pending"},{ico:"🔑",item:"Key Bundle (3 keys)",route:"303",date:"Jun 23",status:"Found",location:"Andheri Depot"}].map((l,i)=>(
                      <div key={i} className="ti">
                        <div style={{fontSize:22}}>{l.ico}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12.5,fontWeight:600}}>{l.item}</div>
                          <div style={{fontSize:11,color:"var(--t2)"}}>Route {l.route} · {l.date} · {l.location}</div>
                        </div>
                        <span className={`sb ${l.status==="Found"?"sb-ok":"sb-am"}`}>● {l.status}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ PAYMENT ═══ */}
      {tab==="Payment"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Ticketing & Payments</div><div className="st">Buy Tickets & Passes</div></div>
          {payStep==="select"&&(
            <>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:11}}>Choose Pass Type</div>
              <div className="pay-g">
                {[{l:"Single Trip",p:"From ₹10",d:"One journey, any route",ico:"🎫",v:"Single use"},{l:"Day Pass",p:"₹80",d:"Unlimited rides today",ico:"🌅",v:"24 hours"},{l:"Monthly Pass",p:"₹500",d:"Unlimited for 30 days",ico:"📅",v:"30 days"},{l:"Annual Pass",p:"₹4,999",d:"Best value — save 17%",ico:"🎖️",v:"365 days"},{l:"Student Pass",p:"₹300",d:"40% off for students",ico:"🎓",v:"30 days"},{l:"Senior Pass",p:"₹250",d:"50% off for 60+",ico:"🧓",v:"30 days"}].map(p=>(
                  <div key={p.l} className={`pt ${selPass===p.l?"on":""}`} onClick={()=>setSelPass(p.l)}>
                    <div style={{fontSize:26,marginBottom:7}}>{p.ico}</div>
                    <div style={{fontSize:13.5,fontWeight:800,marginBottom:3}}>{p.l}</div>
                    <div style={{fontSize:17,fontWeight:800,color:"var(--a2)",marginBottom:4}}>{p.p}</div>
                    <div style={{fontSize:11,color:"var(--t2)",marginBottom:4}}>{p.d}</div>
                    <div style={{fontSize:10.5,color:"var(--t3)"}}>Validity: {p.v}</div>
                    {selPass===p.l&&<div style={{marginTop:7,fontSize:10.5,color:"var(--gr)",fontWeight:700}}>✓ Selected</div>}
                  </div>
                ))}
              </div>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:11,marginTop:22}}>Choose City</div>
              <select className="inp" style={{maxWidth:260,marginBottom:20,cursor:"pointer"}} value={city} onChange={e=>setCity(e.target.value)}>
                <option>All Cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}
              </select>
              <div style={{fontSize:12.5,fontWeight:700,marginBottom:11}}>Payment Method</div>
              <div className="pm-g">
                {[["💳","Credit / Debit Card"],["📱","UPI (GPay, PhonePe, Paytm)"],["🏦","Net Banking"],["👛","TransitOne Wallet"]].map(([ico,lbl])=>(
                  <div key={lbl} className={`pmb ${payMethod===lbl?"on":""}`} onClick={()=>setPayMethod(lbl)}>
                    <div style={{fontSize:22,marginBottom:5}}>{ico}</div>{lbl}
                  </div>
                ))}
              </div>

              {/* ── UPI QR PANEL ── */}
              {payMethod==="UPI (GPay, PhonePe, Paytm)"&&(
                <div style={{background:"linear-gradient(135deg,rgba(99,102,241,.10),rgba(16,185,129,.06))",border:"1px solid rgba(99,102,241,.25)",borderRadius:"var(--r)",padding:"22px",marginBottom:16,display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
                  {/* QR image */}
                  <div style={{background:"#eef1f8",borderRadius:16,padding:14,display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0,boxShadow:"0 4px 24px rgba(0,0,0,0.25)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#c0392b",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:13}}>D</div>
                      <span style={{fontWeight:700,fontSize:15,color:"#333"}}>TransitOne India</span>
                    </div>
                    {/* QR Code placeholder - replace with your actual UPI QR */}
                    <div style={{width:180,height:180,borderRadius:10,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:8,border:"2px solid #e0e0e0",padding:12}}>
                      <svg width="140" height="140" viewBox="0 0 140 140">
                        {Array.from({length:14},(_,row)=>Array.from({length:14},(_,col)=>{const fill=(row+col*3+row*col+row*7)%4===0;return fill?<rect key={`${row}-${col}`} x={col*10} y={row*10} width={10} height={10} fill="#111"/>:null;}))}
                        <rect x="0" y="0" width="40" height="40" fill="#111"/><rect x="5" y="5" width="30" height="30" fill="white"/><rect x="10" y="10" width="20" height="20" fill="#111"/>
                        <rect x="100" y="0" width="40" height="40" fill="#111"/><rect x="105" y="5" width="30" height="30" fill="white"/><rect x="110" y="10" width="20" height="20" fill="#111"/>
                        <rect x="0" y="100" width="40" height="40" fill="#111"/><rect x="5" y="105" width="30" height="30" fill="white"/><rect x="10" y="110" width="20" height="20" fill="#111"/>
                        <circle cx="70" cy="70" r="14" fill="white" stroke="#111" strokeWidth="2"/>
                        <text x="70" y="74" textAnchor="middle" fill="#6366f1" fontSize="9" fontWeight="bold">UPI</text>
                      </svg>
                      <div style={{fontSize:9,color:"#888",textAlign:"center"}}>Scan with any UPI app</div>
                    </div>
                    <div style={{fontSize:11.5,color:"#555",fontWeight:600,textAlign:"center",marginTop:2}}>
                      UPI ID: <strong style={{color:"#333"}}>transitone@upi</strong>
                    </div>
                    <div style={{fontSize:10.5,color:"#888",textAlign:"center"}}>Scan to pay with any UPI app</div>
                  </div>

                  {/* Right side instructions */}
                  <div style={{flex:1,minWidth:200}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:10,color:"var(--t1)"}}>Pay via UPI</div>
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                      {[["1️⃣","Open any UPI app — GPay, PhonePe, Paytm, BHIM"],["2️⃣","Tap 'Scan QR' and scan the code on the left"],["3️⃣",`Enter amount: ${selPass==="Single Trip"?"₹25":selPass==="Day Pass"?"₹80":selPass==="Monthly Pass"?"₹500":selPass==="Annual Pass"?"₹4,999":selPass==="Student Pass"?"₹300":"₹250"}`],["4️⃣","Add note: TransitOne — "+selPass],["5️⃣","Confirm & pay — your pass activates instantly"]].map(([n,t])=>(
                        <div key={n} style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:12.5,color:"var(--t2)"}}>
                          <span style={{flexShrink:0}}>{n}</span><span>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{background:"rgba(255,255,255,.05)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"10px 13px",display:"flex",justify:"space-between",alignItems:"center",gap:12,marginBottom:12}}>
                      <div>
                        <div style={{fontSize:10,color:"var(--t3)",marginBottom:2,textTransform:"uppercase",letterSpacing:".06em"}}>UPI ID</div>
                        <div style={{fontSize:13.5,fontWeight:700,color:"var(--a2)"}}>transitone@upi</div>
                      </div>
                      <button onClick={()=>{navigator.clipboard?.writeText("transitone@upi");}} style={{padding:"5px 11px",borderRadius:6,background:"rgba(99,102,241,.18)",border:"1px solid rgba(99,102,241,.3)",color:"var(--a2)",fontSize:11,fontWeight:700,cursor:"pointer"}}>📋 Copy</button>
                    </div>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {[["G","GPay","#1a73e8"],["P","PhonePe","#5f259f"],["B","Paytm","#00baf2"],["H","BHIM","#00a650"]].map(([l,nm,col])=>(
                        <div key={nm} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:7,background:`${col}18`,border:`1px solid ${col}30`,fontSize:11,fontWeight:600,color:"var(--t2)"}}>
                          <div style={{width:16,height:16,borderRadius:"50%",background:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#fff",fontWeight:800}}>{l}</div>
                          {nm}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Order summary */}
              <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"13px 16px",marginBottom:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div>
                  <div style={{fontSize:11.5,color:"var(--t2)",marginBottom:2}}>Order Summary</div>
                  <div style={{fontSize:13.5,fontWeight:700}}>{selPass} — {city==="All Cities"?"All Routes":city}</div>
                </div>
                <div style={{fontSize:18,fontWeight:800,color:"var(--a2)"}}>{selPass==="Single Trip"?"₹25":selPass==="Day Pass"?"₹80":selPass==="Monthly Pass"?"₹500":selPass==="Annual Pass"?"₹4,999":selPass==="Student Pass"?"₹300":"₹250"}</div>
              </div>
              <button className="pconf" onClick={()=>setPayStep(payMethod==="UPI (GPay, PhonePe, Paytm)"?"utr":"success")}>
                {payMethod==="UPI (GPay, PhonePe, Paytm)"?"✅ I've Paid via UPI — Enter UTR →":"Pay Securely & Get "+selPass+" →"}
              </button>
              <div style={{fontSize:10.5,color:"var(--t3)",marginTop:9,textAlign:"center"}}>🔒 256-bit SSL encryption · PCI-DSS compliant · UPI powered by NPCI</div>
            </>
          )}

          {/* ── UTR VERIFICATION STEP ── */}
          {payStep==="utr"&&(
            <UtrStep
              selPass={selPass}
              city={city}
              onSuccess={()=>setPayStep("success")}
              onBack={()=>setPayStep("select")}
            />
          )}

          {payStep==="success"&&(
            <div className="psuc">
              <div className="pchk">✅</div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,marginBottom:7}}>Payment Verified!</div>
              <div style={{color:"var(--t2)",marginBottom:18}}>Your <strong style={{color:"var(--a2)"}}>{selPass}</strong> is now active. Happy travelling on TransitOne!</div>
              <div style={{display:"inline-block",background:"rgba(16,185,129,.1)",border:"1px solid rgba(16,185,129,.24)",borderRadius:"var(--r2)",padding:"9px 22px",fontSize:12.5,color:"var(--gr)",fontWeight:700,marginBottom:22}}>
                Transaction ID: TXN-{Date.now().toString().slice(-8)} · {payMethod}
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
                <button className="pbtn" style={{maxWidth:210,padding:"10px 0",fontSize:12}} onClick={()=>{nav("Passenger");setPassSec("QR Ticket");}}>📲 View QR Ticket</button>
                <button className="sbtn" style={{fontSize:12}} onClick={()=>setShareMsg("I just bought a TransitOne India pass! Track buses in real time across 127 Indian cities.")}>📤 Share</button>
                <button className="sbtn" style={{fontSize:12}} onClick={()=>setPayStep("select")}>← Buy Another</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════ CITIES ═══ */}
      {tab==="Cities"&&(
        <div className="sec">
          <div className="sh"><div className="ey">City Network</div><div className="st">127 Cities. One Platform.</div><div className="ss">Every city manages their own fleet, routes, and data on TransitOne. Any city can register in minutes.</div></div>
          <div className="cg">
            {CITIES.map(c=>(
              <div key={c} className={`cc ${city===c?"on":""}`} onClick={()=>setCity(c)}>
                <div style={{fontSize:24,marginBottom:6}}>{CITY_ICONS[c]||"🏙️"}</div>
                <div style={{fontSize:12.5,fontWeight:700,marginBottom:2}}>{c}</div>
                <div style={{fontSize:10.5,color:"var(--t3)"}}>{CITY_STATS[c]?.buses?.toLocaleString()||"–"} buses</div>
                <div style={{fontSize:10.5,color:"var(--t3)"}}>{CITY_STATS[c]?.routes||"–"} routes</div>
                <div className="clive">● LIVE</div>
              </div>
            ))}
            <div className="cc" style={{border:"1px dashed var(--b2)",cursor:"pointer"}} onClick={()=>setRegModal(true)}>
              <div style={{fontSize:24,marginBottom:6}}>➕</div>
              <div style={{fontSize:12.5,fontWeight:700,color:"var(--t2)",marginBottom:2}}>Add Your City</div>
              <div style={{fontSize:10.5,color:"var(--t3)"}}>Register as City Admin</div>
            </div>
          </div>

          {city!=="All Cities"&&CITY_STATS[city]&&(
            <div className="cdetail">
              <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:18}}>
                <span style={{fontSize:34}}>{CITY_ICONS[city]||"🏙️"}</span>
                <div>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800}}>{city} City Transport Authority</div>
                  <div style={{fontSize:11.5,color:"var(--t3)"}}>Member since 2023 · Verified Government Partner · ISO 9001:2015</div>
                </div>
                <span className="sb sb-ok" style={{marginLeft:"auto"}}>● LIVE</span>
              </div>
              <div className="ckpi">
                {[{l:"Active Buses",v:CITY_STATS[city].buses.toLocaleString(),c:"var(--a)"},{l:"Routes",v:CITY_STATS[city].routes,c:"var(--gr)"},{l:"Bus Stops",v:(CITY_STATS[city].routes*11).toLocaleString(),c:"var(--am)"},{l:"Daily Riders",v:CITY_STATS[city].riders,c:"var(--pk)"},{l:"Drivers",v:CITY_STATS[city].drivers.toLocaleString(),c:"var(--cy)"},{l:"Electric Buses",v:Math.floor(CITY_STATS[city].buses*.28).toLocaleString(),c:"var(--gr2)"},{l:"On-Time Rate",v:"91.4%",c:"var(--gr)"},{l:"Avg Delay",v:"3.2 min",c:"var(--am)"}].map(m=>(
                  <div key={m.l} className="ckpi-c">
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:19,fontWeight:800,color:m.c,marginBottom:2}}>{m.v}</div>
                    <div style={{fontSize:10.5,color:"var(--t3)"}}>{m.l}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:9,marginTop:16,flexWrap:"wrap"}}>
                <button className="addbtn" onClick={()=>{nav("Admin");setAdminSec("Overview");}}>⚙️ Manage City</button>
                <button className="sbtn" style={{fontSize:11.5}} onClick={()=>nav("Analytics")}>📊 Analytics</button>
                <button className="sbtn" style={{fontSize:11.5}} onClick={()=>nav("Live Map")}>🗺️ Live Map</button>
              </div>
            </div>
          )}

          {/* SCALABILITY */}
          <div style={{marginTop:24,background:"linear-gradient(135deg,rgba(99,102,241,.1),rgba(16,185,129,.06))",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r)",padding:"26px 22px"}}>
            <div className="ey">Scalability Architecture</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:19,fontWeight:800,marginBottom:14}}>Built to Scale to Every City in India & Beyond</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:10}}>
              {[["🏙️","1,000+ Cities","Cloud-ready multi-tenant SaaS"],["🚌","100,000+ Buses","Real-time GPS per vehicle"],["👥","50M+ Users","Microservices + CDN"],["⚡","WebSocket","Sub-second live updates"],["☁️","AWS + Firebase","Auto-scaling infra"],["🔒","JWT + RBAC","5-tier role security"],["📡","REST + WS APIs","Public & private endpoints"],["🌐","10 Languages","Multilingual by default"],["📊","Real-time Analytics","Clickhouse data warehouse"],["🤖","AI/ML Pipeline","TensorFlow + custom models"]].map(([ico,t,s])=>(
                <div key={t} style={{background:"rgba(255,255,255,.04)",borderRadius:"var(--r2)",padding:"12px 11px"}}>
                  <div style={{fontSize:20,marginBottom:5}}>{ico}</div>
                  <div style={{fontSize:11.5,fontWeight:700,marginBottom:3}}>{t}</div>
                  <div style={{fontSize:10.5,color:"var(--t3)"}}>{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ ADMIN ═══ */}
      {tab==="Admin"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Admin Dashboard</div><div className="st">Operations Control Centre</div></div>
          <div className="al">
            <div className="asb">
              {[["📊","Overview"],["🚌","Vehicles"],["👨‍✈️","Drivers"],["🗺️","Routes"],["🛑","Stops"],["👥","Passengers"],["📋","Complaints"],["🔧","Maintenance"],["💰","Revenue"],["✅","UTR Queue"],["🔔","Alerts"],["🏙️","City Reg."],["⚙️","Settings"]].map(([ico,s])=>(
                <div key={s} className={`an ${adminSec===s?"on":""}`} onClick={()=>setAdminSec(s)}>{ico} {s}</div>
              ))}
            </div>
            <div className="amain">

              {adminSec==="Overview"&&(
                <>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:16}}>Today's Operations — {city==="All Cities"?"All India":city}</div>
                  <div className="krow" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                    {[{v:"84,320",l:"Active Vehicles",c:"var(--a)",chg:"↑ 1.2% vs yesterday"},{v:"2.4M",l:"Passengers Today",c:"var(--gr)",chg:"↑ 14% vs last week"},{v:"₹14.2Cr",l:"Today's Revenue",c:"var(--am)",chg:"↑ 8% vs yesterday"},{v:"91.4%",l:"On-Time Rate",c:"var(--gr)",chg:"-0.3% vs avg"},{v:"247",l:"Open Complaints",c:"var(--rd)",chg:"+12 new today"},{v:"1,204",l:"In Maintenance",c:"var(--am)",chg:"82 sched · 22 emergency"}].map(k=>(
                      <div key={k.l} className="kc"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div><div className="kchg" style={{color:"var(--t3)"}}>{k.chg}</div></div>
                    ))}
                  </div>
                  <div className="abar"><span>🚨</span>Route 202 Ahmedabad rerouted — road work active till 6 PM. Drivers notified.</div>
                  <div className="abar warn"><span>⚠️</span>Vehicle MH01AB5678 fuel critically low (12%). Nearest depot: Andheri East (1.2 km).</div>
                  <div className="abar info"><span>✅</span>System health: All 127 cities online · GPS accuracy: 99.2% · Uptime: 99.98%</div>
                </>
              )}

              {adminSec==="Vehicles"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Fleet Management</div>
                    <div style={{display:"flex",gap:7}}>
                      <button className="ab" onClick={()=>setToast("📊 Revenue CSV — downloading…")}>Export CSV</button>
                      <button className="addbtn" onClick={()=>setToast("✅ Add Vehicle — form will appear here in the full backend-connected version.")}>{"+ Add Vehicle"}</button>
                    </div>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>Vehicle ID</th><th>Route</th><th>Driver</th><th>Conductor</th><th>Speed</th><th>Fuel</th><th>Occupancy</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {BUSES.map(b=>(
                        <tr key={b.id}>
                          <td style={{fontWeight:700,fontSize:11}}>{b.id}</td>
                          <td>{b.route}</td>
                          <td>{b.driver}</td>
                          <td style={{color:"var(--t2)"}}>{b.conductor}</td>
                          <td>{b.speed} km/h</td>
                          <td>{b.fuel}{b.battery?` · ${b.battery}%🔋`:""}</td>
                          <td>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <div style={{width:52,height:4,background:"var(--b1)",borderRadius:2,overflow:"hidden"}}>
                                <div style={{height:"100%",borderRadius:2,background:fmtOcc(b.occupancy),width:`${b.occupancy}%`}}/>
                              </div>
                              <span style={{fontSize:11}}>{b.occupancy}%</span>
                            </div>
                          </td>
                          <td><span className={`sb ${b.status==="On Time"?"sb-ok":"sb-late"}`}>● {b.status}{b.delay>0?` +${b.delay}m`:""}</span></td>
                          <td><button className="ab" onClick={()=>setBusModal(b)}>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Drivers"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Driver Management</div>
                    <button className="addbtn" onClick={()=>setToast("✅ Add Driver — form will appear here in the full backend-connected version.")}>{"+ Add Driver"}</button>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>Name</th><th>City</th><th>Vehicle</th><th>Trips</th><th>Rating</th><th>Exp</th><th>Accidents</th><th>Status</th></tr></thead>
                    <tbody>
                      {DRIVERS.map(d=>(
                        <tr key={d.id}>
                          <td style={{color:"var(--t3)",fontSize:10.5}}>{d.id}</td>
                          <td style={{fontWeight:600}}>{d.name}</td>
                          <td>{d.city}</td>
                          <td style={{fontSize:10.5}}>{d.vehicle}</td>
                          <td>{d.trips.toLocaleString()}</td>
                          <td><span style={{color:"var(--am)",fontWeight:700}}>★ {d.rating}</span></td>
                          <td>{d.exp}</td>
                          <td style={{color:d.accidents>0?"var(--rd)":"var(--gr)",fontWeight:600}}>{d.accidents}</td>
                          <td><span className={`sb ${d.status==="On Duty"?"sb-ok":"sb-am"}`}>● {d.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Routes"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Route Management</div>
                    <button className="addbtn" onClick={()=>setToast("✅ Add Route — form will appear here in the full backend-connected version.")}>{"+ Add Route"}</button>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>Route</th><th>From</th><th>To</th><th>City</th><th>Stops</th><th>Distance</th><th>Buses</th><th>Fare</th><th>Type</th><th>Action</th></tr></thead>
                    <tbody>
                      {ROUTES.map(r=>(
                        <tr key={r.id}>
                          <td style={{fontWeight:800,color:"var(--a2)"}}>{r.no}</td>
                          <td style={{fontSize:11.5}}>{r.from}</td>
                          <td style={{fontSize:11.5}}>{r.to}</td>
                          <td>{r.city}</td>
                          <td>{r.stops}</td>
                          <td>{r.distance}</td>
                          <td>{r.buses}</td>
                          <td style={{fontWeight:700}}>{r.fare}</td>
                          <td><span className={`badge ${bType(r.type)}`}>{r.type}</span></td>
                          <td><button className="ab" onClick={()=>setRouteModal(r)}>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Stops"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Stop Management</div>
                    <button className="addbtn" onClick={()=>setToast("✅ Add Stop — form will appear here in the full backend-connected version.")}>{"+ Add Stop"}</button>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>Stop ID</th><th>Name</th><th>City</th><th>Routes</th><th>Facilities</th><th>Coordinates</th></tr></thead>
                    <tbody>
                      {STOPS.map(s=>(
                        <tr key={s.id}>
                          <td style={{color:"var(--t3)",fontSize:10.5}}>{s.id}</td>
                          <td style={{fontWeight:600}}>{s.name}</td>
                          <td>{s.city}</td>
                          <td style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                            {s.routes.map(r=><span key={r} style={{padding:"1px 6px",borderRadius:4,background:"rgba(99,102,241,.14)",color:"var(--a2)",fontSize:10,fontWeight:700}}>{r}</span>)}
                          </td>
                          <td style={{fontSize:10.5,color:"var(--t2)"}}>{s.facilities.join(", ")}</td>
                          <td style={{fontSize:10,color:"var(--t3)"}}>{s.lat}, {s.lng}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Passengers"&&(
                <>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>Passenger Management</div>
                  <div className="krow" style={{marginBottom:18}}>
                    {[{v:"2.4M",l:"Today",c:"var(--a)"},{v:"48.2M",l:"This Month",c:"var(--gr)"},{v:"1.8M",l:"Active Passes",c:"var(--am)"}].map(k=>(
                      <div key={k.l} className="kc"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
                    ))}
                  </div>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>Name</th><th>City</th><th>Pass Type</th><th>Trips This Month</th><th>Joined</th><th>Status</th></tr></thead>
                    <tbody>
                      {[{id:"P001",nm:"Arjun Mehta",city:"Surat",pass:"Monthly",trips:142,joined:"Jan 2024",status:"Active"},{id:"P002",nm:"Priya Shah",city:"Ahmedabad",pass:"Annual",trips:98,joined:"Mar 2023",status:"Active"},{id:"P003",nm:"Rahul Singh",city:"Delhi",pass:"Student",trips:210,joined:"Aug 2024",status:"Active"},{id:"P004",nm:"Lakshmi Nair",city:"Bangalore",pass:"Monthly",trips:67,joined:"Nov 2023",status:"Expired"}].map(p=>(
                        <tr key={p.id}>
                          <td style={{color:"var(--t3)",fontSize:10.5}}>{p.id}</td>
                          <td style={{fontWeight:600}}>{p.nm}</td>
                          <td>{p.city}</td>
                          <td>{p.pass}</td>
                          <td>{p.trips}</td>
                          <td style={{color:"var(--t3)",fontSize:11.5}}>{p.joined}</td>
                          <td><span className={`sb ${p.status==="Active"?"sb-ok":"sb-late"}`}>● {p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Complaints"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Complaint Management</div>
                    <div style={{display:"flex",gap:7}}>
                      {["All","Open","In Progress","Resolved"].map(f=><button key={f} onClick={()=>setComplaintFilter(f)} className="ab" style={{background:complaintFilter===f?"rgba(99,102,241,.28)":"rgba(99,102,241,.14)",color:complaintFilter===f?"#fff":"var(--a2)"}}>{f}</button>)}
                    </div>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>Type</th><th>Route</th><th>City</th><th>Date</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {COMPLAINTS.filter(c=>complaintFilter==="All"||c.status===complaintFilter).map(c=>(
                        <tr key={c.id}>
                          <td style={{color:"var(--t3)",fontSize:10.5}}>{c.id}</td>
                          <td style={{fontWeight:600,fontSize:11.5}}>{c.type}</td>
                          <td>{c.route}</td>
                          <td>{c.city}</td>
                          <td style={{fontSize:11}}>{c.date}</td>
                          <td><span className={`sb ${c.priority==="High"?"sb-hi":c.priority==="Medium"?"sb-md":"sb-lo"}`}>{c.priority}</span></td>
                          <td><span className={`sb ${c.status==="Open"?"sb-open":c.status==="In Progress"?"sb-prog":"sb-done"}`}>● {c.status}</span></td>
                          <td><button className="ab" onClick={()=>setToast("💬 Complaint response form — available in backend-connected admin panel.")}>Respond</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="Maintenance"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Maintenance Schedule</div>
                    <button className="addbtn" onClick={()=>setToast("✅ Schedule Service — form will appear here in the full backend-connected version.")}>{"+ Schedule Service"}</button>
                  </div>
                  <table className="tbl">
                    <thead><tr><th>ID</th><th>Vehicle</th><th>Type</th><th>Date</th><th>Technician</th><th>Cost</th><th>Status</th></tr></thead>
                    <tbody>
                      {MAINTENANCE.map(m=>(
                        <tr key={m.id}>
                          <td style={{color:"var(--t3)",fontSize:10.5}}>{m.id}</td>
                          <td style={{fontWeight:600,fontSize:11}}>{m.vehicle}</td>
                          <td>{m.type}</td>
                          <td style={{fontSize:11.5}}>{m.date}</td>
                          <td>{m.tech}</td>
                          <td style={{fontWeight:700,color:"var(--am)"}}>{m.cost}</td>
                          <td><span className={`sb ${m.status==="Completed"?"sb-done":m.status==="In Progress"?"sb-prog":"sb-lo"}`}>● {m.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}

              {adminSec==="UTR Queue"&&<UtrAdminQueue/>}

              {adminSec==="Revenue"&&(
                <>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>Revenue Overview</div>
                  <div className="krow" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
                    {[{v:"₹14.2Cr",l:"Today",c:"var(--a)"},{v:"₹98Cr",l:"This Month",c:"var(--gr)"},{v:"₹847Cr",l:"This Year",c:"var(--am)"},{v:"₹142Cr",l:"City Subscriptions",c:"var(--pk)"},{v:"₹38Cr",l:"API Revenue",c:"var(--cy)"},{v:"₹27Cr",l:"Corporate Plans",c:"var(--a2)"}].map(k=>(
                      <div key={k.l} className="kc"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
                    ))}
                  </div>
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:11.5,fontWeight:700,marginBottom:9,color:"var(--t2)"}}>Revenue by City (Top 6)</div>
                    <div className="prg">
                      {[["Mumbai","₹3.8Cr",94],["Delhi","₹3.1Cr",88],["Bangalore","₹2.2Cr",72],["Hyderabad","₹1.8Cr",65],["Ahmedabad","₹1.4Cr",56],["Chennai","₹1.2Cr",48]].map(([c,v,p])=>(
                        <div key={c} className="pri">
                          <div className="prm"><span style={{fontWeight:600}}>{c}</span><span style={{color:"var(--t3)"}}>{v}</span></div>
                          <div className="prb"><div className="prf" style={{width:`${p}%`,background:"var(--grad)"}}/></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {adminSec==="Alerts"&&(
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>Emergency Alerts & Broadcasts</div>
                    <button className="addbtn" onClick={()=>setToast("✅ Broadcast Alert — form will appear here in the full backend-connected version.")}>{"+ Broadcast Alert"}</button>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:9}}>
                    {[{type:"Emergency",msg:"Route 202 Ahmedabad rerouted via Vastrapur — road work till 6 PM today.",time:"Today 8:00 AM",col:"var(--rd)",ico:"🚨"},{type:"Weather",msg:"Heavy rain in Mumbai — Routes 303 & 1010 running 5–10 min late. AI rerouting active.",time:"Today 7:30 AM",col:"var(--am)",ico:"🌧️"},{type:"Info",msg:"Chandigarh is now live on TransitOne — 340 buses, 28 routes active.",time:"Yesterday",col:"var(--gr)",ico:"🎉"},{type:"Maintenance",msg:"Route 505 Bangalore: Scheduled maintenance Jun 29 11 PM – 4 AM.",time:"Jun 25",col:"var(--a2)",ico:"🔧"}].map((a,i)=>(
                      <div key={i} style={{background:"rgba(0,0,0,.15)",border:`1px solid ${a.col}28`,borderRadius:"var(--r2)",padding:"12px 15px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
                          <span>{a.ico}</span>
                          <span style={{fontSize:11.5,fontWeight:800,color:a.col}}>{a.type}</span>
                          <span style={{marginLeft:"auto",fontSize:10,color:"var(--t3)"}}>{a.time}</span>
                          <button className="ab" style={{fontSize:10}} onClick={()=>setToast(`✏️ Editing alert: "${a.type}" — edit form will appear in backend-connected version.`)}>Edit</button>
                        </div>
                        <div style={{fontSize:12,color:"var(--t2)"}}>{a.msg}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {adminSec==="City Reg."&&(
                <>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>City Registration Requests</div>
                  <table className="tbl">
                    <thead><tr><th>City</th><th>State</th><th>Authority</th><th>Fleet Size</th><th>Date Applied</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                      {[{city:"Mysuru",state:"Karnataka",auth:"KSRTC",fleet:280,date:"Jun 25, 2026",status:"Under Review"},{city:"Srinagar",state:"J&K",auth:"JKSRTC",fleet:160,date:"Jun 20, 2026",status:"Approved"},{city:"Guwahati",state:"Assam",auth:"ASTC",fleet:210,date:"Jun 15, 2026",status:"Onboarding"},{city:"Visakhapatnam",state:"Andhra Pradesh",auth:"APSRTC",fleet:440,date:"Jun 10, 2026",status:"Live"}].map(r=>(
                        <tr key={r.city}>
                          <td style={{fontWeight:700}}>{r.city}</td>
                          <td>{r.state}</td>
                          <td>{r.auth}</td>
                          <td>{r.fleet}</td>
                          <td style={{fontSize:11}}>{r.date}</td>
                          <td><span className={`sb ${r.status==="Live"?"sb-ok":r.status==="Approved"?"sb-done":r.status==="Onboarding"?"sb-prog":"sb-lo"}`}>● {r.status}</span></td>
                          <td><button className="ab" onClick={()=>setToast(`🏙️ ${r.city} application — ${r.fleet} buses, ${r.auth}. Status: ${r.status}`)}>View</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{marginTop:14}}><button className="sbtn" style={{fontSize:11.5}} onClick={()=>{setRegModal(true);}}>+ Register New City</button></div>
                </>
              )}

              {adminSec==="Settings"&&(
                <>
                  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:14}}>Platform Settings</div>
                  {[["City / Authority Name","Surat Municipal Corporation"],["Admin Email","admin@suratmunicipal.gov.in"],["Support Phone","+91 0261-2420601"],["GPS Update Interval","5 seconds"],["Default Language","Gujarati"],["Fare Currency","INR (₹)"],["Max Seats per Bus","45"],["Maintenance Reminder","7 days before due"]].map(s=>(
                    <div key={s[0]} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid var(--b1)"}}>
                      <div style={{fontSize:12.5,fontWeight:600,color:"var(--t2)"}}>{s[0]}</div>
                      <input className="inp" style={{maxWidth:220,padding:"6px 10px"}} defaultValue={s[1]}/>
                    </div>
                  ))}
                  <div style={{marginTop:18,display:"flex",gap:9}}>
                    <button className="pbtn" style={{maxWidth:180,padding:"10px 0",fontSize:12}} onClick={()=>setToast("✅ Settings saved successfully!")}>Save Changes</button>
                    <button className="sbtn" style={{fontSize:12}} onClick={()=>setToast("🔄 Settings reset to defaults.")}> Reset Defaults</button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ ANALYTICS ═══ */}
      {tab==="Analytics"&&(
        <div className="sec">
          <div className="sh"><div className="ey">Analytics</div><div className="st">Network Intelligence Dashboard</div><div className="ss">Deep insights into ridership, fleet performance, revenue, and city-wide mobility patterns.</div></div>

          <div className="krow" style={{gridTemplateColumns:"repeat(4,1fr)",marginBottom:18}}>
            {[{v:"91.4%",l:"On-Time Rate",c:"var(--gr)"},{v:"3.2 min",l:"Avg Delay",c:"var(--am)"},{v:"₹14.2Cr",l:"Today's Revenue",c:"var(--a)"},{v:"4.7 ★",l:"Passenger Rating",c:"var(--pk)"}].map(k=>(
              <div key={k.l} className="kc"><div className="kv" style={{color:k.c}}>{k.v}</div><div className="kl">{k.l}</div></div>
            ))}
          </div>

          <div className="ang">
            <div className="anc">
              <div className="ant">Weekly Ridership (Millions)</div>
              <div className="bch">
                {barData.map(d=>(
                  <div key={d.l} className="bg">
                    <div className="bv">{d.v}%</div>
                    <div className="bb" style={{height:`${d.v}%`,background:d.v===100?"var(--grad)":`rgba(99,102,241,${.35+d.v/260})`}}/>
                    <div className="bl">{d.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anc">
              <div className="ant">Fleet Fuel Distribution</div>
              <div className="dw">
                <svg width="118" height="118" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="3.8"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3.8" strokeDasharray="38 62" strokeDashoffset="25"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="28 72" strokeDashoffset="-13"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="20 80" strokeDashoffset="-41"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ec4899" strokeWidth="3.8" strokeDasharray="14 86" strokeDashoffset="-61"/>
                  <text x="18" y="20" textAnchor="middle" fill="white" fontSize="4.5" fontWeight="bold">Fleet</text>
                </svg>
                <div className="dlg">
                  {[["#6366f1","CNG","38%"],["#10b981","Electric","28%"],["#f59e0b","Diesel","20%"],["#ec4899","Hybrid","14%"]].map(([c,l,v])=>(
                    <div key={l} className="di"><div className="dd" style={{background:c}}/><span style={{color:"var(--t2)",flex:1}}>{l}</span><span style={{fontWeight:700}}>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="anc">
              <div className="ant">Top Cities by Ridership</div>
              <div className="prg">
                {[["Mumbai",94,"var(--a)"],["Delhi",88,"var(--gr)"],["Bangalore",72,"var(--am)"],["Kolkata",68,"var(--pk)"],["Hyderabad",65,"var(--cy)"],["Ahmedabad",58,"var(--a2)"]].map(([c,p,col])=>(
                  <div key={c} className="pri">
                    <div className="prm"><span style={{fontWeight:600}}>{c}</span><span style={{color:"var(--t3)"}}>{p}%</span></div>
                    <div className="prb"><div className="prf" style={{width:`${p}%`,background:col}}/></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anc">
              <div className="ant">Peak Hour Demand</div>
              <div className="bch">
                {[{l:"6AM",v:35},{l:"8AM",v:95},{l:"10AM",v:58},{l:"12PM",v:52},{l:"2PM",v:42},{l:"5PM",v:100},{l:"7PM",v:78},{l:"9PM",v:38},{l:"11PM",v:14}].map(d=>(
                  <div key={d.l} className="bg">
                    <div className="bb" style={{height:`${d.v}%`,background:d.v>=90?"var(--rd)":d.v>=70?"var(--am)":"rgba(99,102,241,.48)"}}/>
                    <div className="bl">{d.l}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:10.5,color:"var(--t3)",marginTop:7}}>🔴 Rush · 🟡 Moderate · 🟣 Low</div>
            </div>

            <div className="anc">
              <div className="ant">Driver Performance Ratings</div>
              <div className="prg">
                {DRIVERS.map(d=>(
                  <div key={d.id} className="pri">
                    <div className="prm">
                      <span style={{fontWeight:600}}>{d.name}</span>
                      <span style={{color:"var(--am)",fontWeight:700}}>★ {d.rating}</span>
                    </div>
                    <div className="prb"><div className="prf" style={{width:`${(d.rating/5)*100}%`,background:d.rating>=4.7?"var(--gr)":d.rating>=4.4?"var(--am)":"var(--rd)"}}/></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anc">
              <div className="ant">Revenue Breakdown</div>
              <div className="dw">
                <svg width="118" height="118" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="3.8"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.8" strokeDasharray="52 48" strokeDashoffset="25"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#6366f1" strokeWidth="3.8" strokeDasharray="22 78" strokeDashoffset="-27"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="16 84" strokeDashoffset="-49"/>
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ec4899" strokeWidth="3.8" strokeDasharray="10 90" strokeDashoffset="-65"/>
                  <text x="18" y="20" textAnchor="middle" fill="white" fontSize="4.5" fontWeight="bold">₹98Cr</text>
                </svg>
                <div className="dlg">
                  {[["#10b981","Ticket Sales","52%"],["#6366f1","City Subscriptions","22%"],["#f59e0b","Monthly Passes","16%"],["#ec4899","API & Corporate","10%"]].map(([c,l,v])=>(
                    <div key={l} className="di"><div className="dd" style={{background:c}}/><span style={{color:"var(--t2)",flex:1}}>{l}</span><span style={{fontWeight:700}}>{v}</span></div>
                  ))}
                </div>
              </div>
            </div>

            {/* City Comparison */}
            <div className="anc" style={{gridColumn:"span 2"}}>
              <div className="ant">City-Level KPI Comparison</div>
              <table className="tbl">
                <thead><tr><th>City</th><th>Buses</th><th>Daily Riders</th><th>On-Time %</th><th>Avg Delay</th><th>Revenue/Day</th><th>Rating</th></tr></thead>
                <tbody>
                  {[["Mumbai","4,800","1.4M","89.2%","4.1 min","₹3.8Cr","4.5"],["Delhi","6,200","1.8M","92.1%","2.9 min","₹3.1Cr","4.6"],["Bangalore","3,100","740K","91.8%","3.0 min","₹2.2Cr","4.7"],["Surat","1,240","280K","94.3%","2.2 min","₹0.9Cr","4.8"],["Ahmedabad","2,100","520K","90.5%","3.5 min","₹1.4Cr","4.5"]].map(([c,...vals])=>(
                    <tr key={c}>
                      <td style={{fontWeight:700}}>{c}</td>
                      {vals.map((v,i)=><td key={i} style={{color:i===2?"var(--gr)":i===5?"var(--am)":"inherit"}}>{v}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="foot">
        <div className="fi">
          <div className="fg">
            <div>
              <div className="flo">🚌 TransitOne India</div>
              <div className="fd">India's most advanced AI-powered smart public transport OS. Powering 127 cities, 84,000+ buses, and 2.4 million daily journeys — with AI at the core.</div>
              <div className="fst">
                <div className="fs">🍎 App Store</div>
                <div className="fs">🤖 Play Store</div>
                <div className="fs">🌐 PWA</div>
              </div>
            </div>
            <div>
              <div className="fct">Platform</div>
              {["Live Tracking","Journey Planner","Smart Search","Schedule","City Dashboard","Admin Panel","Analytics","API Access"].map(l=><div key={l} className="fl" onClick={()=>nav(l==="Journey Planner"?"Journey":l==="City Dashboard"?"Cities":l==="Smart Search"?"Smart Search":l==="Live Tracking"?"Live Map":l==="Admin Panel"?"Admin":l==="Schedule"?"Schedule":l==="Analytics"?"Analytics":"Home")}>{l}</div>)}
            </div>
            <div>
              <div className="fct">Cities</div>
              {["Mumbai","Delhi","Bangalore","Surat","Hyderabad","Pune","Chennai","Ahmedabad","Kolkata","Jaipur"].map(l=><div key={l} className="fl" onClick={()=>{setCity(l);nav("Cities");}}>{l}</div>)}
            </div>
            <div>
              <div className="fct">Passengers</div>
              {["My Pass","QR Ticket","Trip History","Favourites","Notifications","Complaints","SOS & Safety","Lost & Found"].map(l=><div key={l} className="fl" onClick={()=>{nav("Passenger");setPassSec(l);}}>{l}</div>)}
            </div>
            <div>
              <div className="fct">Company</div>
              {["About TransitOne","Government Partners","Press & Media","Careers","Blog","Privacy Policy","Terms of Service","Contact Us"].map(l=><div key={l} className="fl">{l}</div>)}
            </div>
          </div>
          <div className="fbtm">
            <span>© 2026 TransitOne India Pvt. Ltd. · Built with ❤️ for Bharat · All rights reserved</span>
            <div className="fbdg">
              <div className="fbdgi">🔒 ISO 27001</div>
              <div className="fbdgi">☁️ AWS Partner</div>
              <div className="fbdgi">🇮🇳 Make in India</div>
              <div className="fbdgi">♿ WCAG 2.1 AA</div>
              <div className="fbdgi">🌿 Carbon Neutral</div>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  );

  function doplan() { doPlan(); }
}
