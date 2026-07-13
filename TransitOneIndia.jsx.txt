import{useState,useEffect,useRef,useCallback}from"react"
const CITIES=["Surat","Ahmedabad","Mumbai","Delhi","Bangalore","Hyderabad","Pune","Chennai","Kolkata","Jaipur","Lucknow","Kochi"]
const CITY_ICONS={Surat:"🏙️",Ahmedabad:"🌆",Mumbai:"🌉",Delhi:"🕌",Bangalore:"💻",Hyderabad:"💎",Pune:"🎓",Chennai:"🌊",Kolkata:"🎨",Jaipur:"🏰",Lucknow:"🕍",Kochi:"⛵"}
const ROUTES=[
{id:1,no:"BRTS-1",from:"Udhna Darwaja",to:"Sachin GIDC Naka",dur:"35 min",fare:"₹15",buses:14,next:"4 min",city:"Surat",type:"Electric",stops:14,distance:"10.2 km",freq:"Every 4 min",source:"Sitilink"},
{id:2,no:"BRTS-2",from:"ONGC Colony",to:"Sarthana Jakat Naka",dur:"55 min",fare:"₹20",buses:12,next:"5 min",city:"Surat",type:"Electric",stops:18,distance:"19.7 km",freq:"Every 5 min",source:"Sitilink"},
{id:3,no:"BRTS-3",from:"Adajan Patiya",to:"Jahangirpura",dur:"30 min",fare:"₹15",buses:10,next:"4 min",city:"Surat",type:"Electric",stops:11,distance:"7.5 km",freq:"Every 4 min",source:"Sitilink"},
{id:4,no:"BRTS-4",from:"Adajan Patiya",to:"Pal R.T.O.",dur:"28 min",fare:"₹15",buses:10,next:"4 min",city:"Surat",type:"Electric",stops:10,distance:"8.2 km",freq:"Every 4 min",source:"Sitilink"},
{id:5,no:"CT-101",from:"Surat Railway Station",to:"Kapodra",dur:"40 min",fare:"₹15",buses:8,next:"8 min",city:"Surat",type:"AC",stops:14,distance:"13 km",freq:"Every 8 min",source:"Sitilink"},
{id:6,no:"CT-102",from:"Surat Railway Station",to:"Kamrej",dur:"55 min",fare:"₹20",buses:6,next:"10 min",city:"Surat",type:"AC",stops:17,distance:"16 km",freq:"Every 10 min",source:"Sitilink"},
{id:7,no:"CT-146",from:"Surat Railway Station",to:"GAIL Colony Vesu",dur:"40 min",fare:"₹20",buses:6,next:"9 min",city:"Surat",type:"AC",stops:8,distance:"12 km",freq:"Every 9 min",source:"Sitilink"},
{id:8,no:"BRTS-A1",from:"APMC Vasna",to:"Thaltej",dur:"40 min",fare:"₹15",buses:14,next:"4 min",city:"Ahmedabad",type:"Electric",stops:13,distance:"12 km",freq:"Every 4 min"},
{id:9,no:"AMTS-31",from:"Geeta Mandir",to:"Naroda GIDC",dur:"45 min",fare:"₹15",buses:12,next:"5 min",city:"Ahmedabad",type:"CNG",stops:16,distance:"14 km",freq:"Every 5 min"},
{id:10,no:"BEST-1",from:"Colaba Depot",to:"CST Mumbai",dur:"25 min",fare:"₹15",buses:20,next:"3 min",city:"Mumbai",type:"Electric",stops:8,distance:"4 km",freq:"Every 3 min"},
{id:11,no:"BEST-2",from:"Bandra Station (W)",to:"Andheri Station",dur:"30 min",fare:"₹15",buses:18,next:"3 min",city:"Mumbai",type:"Electric",stops:9,distance:"8 km",freq:"Every 3 min"},
{id:12,no:"DTC-181",from:"New Delhi Railway Station",to:"Dwarka Sector 21",dur:"60 min",fare:"₹25",buses:20,next:"3 min",city:"Delhi",type:"Electric",stops:18,distance:"22 km",freq:"Every 3 min"},
{id:13,no:"DTC-182",from:"Kashmere Gate ISBT",to:"Saket",dur:"55 min",fare:"₹25",buses:18,next:"3 min",city:"Delhi",type:"Electric",stops:16,distance:"20 km",freq:"Every 3 min"},
{id:14,no:"BMTC-500C",from:"Kempegowda Bus Station",to:"Kempegowda Airport",dur:"75 min",fare:"₹35",buses:8,next:"8 min",city:"Bangalore",type:"AC",stops:15,distance:"40 km",freq:"Every 8 min"},
{id:15,no:"BMTC-335E",from:"Majestic",to:"Electronic City Phase 2",dur:"65 min",fare:"₹30",buses:10,next:"7 min",city:"Bangalore",type:"AC",stops:18,distance:"30 km",freq:"Every 7 min"},
{id:16,no:"TSRTC-1",from:"MGBS",to:"Hitech City",dur:"45 min",fare:"₹20",buses:15,next:"5 min",city:"Hyderabad",type:"Electric",stops:14,distance:"16 km",freq:"Every 5 min"},
{id:17,no:"PMPML-1",from:"Swargate Bus Stand",to:"Hinjewadi IT Park",dur:"65 min",fare:"₹30",buses:12,next:"7 min",city:"Pune",type:"Electric",stops:18,distance:"22 km",freq:"Every 7 min"},
{id:18,no:"MTC-M70",from:"Koyambedu Bus Terminus",to:"Tambaram Bus Stand",dur:"60 min",fare:"₹25",buses:18,next:"4 min",city:"Chennai",type:"Electric",stops:20,distance:"22 km",freq:"Every 4 min"},
{id:19,no:"CTC-1",from:"Howrah Station",to:"Salt Lake Sector V",dur:"55 min",fare:"₹20",buses:16,next:"5 min",city:"Kolkata",type:"Electric",stops:18,distance:"18 km",freq:"Every 5 min"},
{id:20,no:"JCT-1",from:"Sindhi Camp Bus Stand",to:"Amber Fort Stop",dur:"40 min",fare:"₹20",buses:10,next:"7 min",city:"Jaipur",type:"CNG",stops:12,distance:"14 km",freq:"Every 7 min"},
]
const BUSES=[
{id:"SL-EV-0101",route:"BRTS-1",driver:"Rajesh Kumar",conductor:"Mohan Lal",speed:42,stop:"Udhna Darwaja BRTS",next:"Sahara Darwaja BRTS",delay:0,occupancy:67,fuel:"Electric",battery:78,status:"On Time",rating:4.8,city:"Surat"},
{id:"SL-EV-0201",route:"BRTS-2",driver:"Suresh Desai",conductor:"Lalji Baria",speed:44,stop:"ONGC Colony BRTS",next:"Sarthana Jakat Naka",delay:3,occupancy:89,fuel:"Electric",battery:61,status:"Delayed",rating:4.2,city:"Surat"},
{id:"SL-EV-0301",route:"BRTS-3",driver:"Dhruv Patel",conductor:"Kavita Shah",speed:47,stop:"Adajan Patiya BRTS",next:"Pal R.T.O. BRTS",delay:0,occupancy:34,fuel:"Electric",battery:95,status:"On Time",rating:4.7,city:"Surat"},
{id:"SL-CT-1011",route:"CT-101",driver:"Jayesh Trivedi",conductor:"Komal Desai",speed:35,stop:"Kapodra BRTS",next:"Udhna Darwaja",delay:0,occupancy:45,fuel:"CNG",battery:null,status:"On Time",rating:4.7,city:"Surat"},
{id:"SL-CT-1021",route:"CT-102",driver:"Nitin Shah",conductor:"Rekha Patel",speed:40,stop:"Kamrej Bus Stop",next:"Laskana",delay:5,occupancy:72,fuel:"CNG",battery:null,status:"Delayed",rating:4.3,city:"Surat"},
{id:"AMTS-EV-A101",route:"BRTS-A1",driver:"Rajesh Solanki",conductor:"Hansa Patel",speed:45,stop:"Vastrapur BRTS",next:"Thaltej BRTS",delay:0,occupancy:48,fuel:"Electric",battery:88,status:"On Time",rating:4.7,city:"Ahmedabad"},
{id:"BEST-EV-0011",route:"BEST-1",driver:"Sanjay More",conductor:"Anita Desai",speed:29,stop:"Bandra Station (W)",next:"Khar Road",delay:2,occupancy:78,fuel:"Electric",battery:71,status:"Delayed",rating:4.3,city:"Mumbai"},
{id:"BEST-EV-0021",route:"BEST-2",driver:"Ramesh Kadam",conductor:"Pooja Patil",speed:57,stop:"Dadar",next:"Matunga",delay:0,occupancy:82,fuel:"Electric",battery:68,status:"On Time",rating:4.4,city:"Mumbai"},
{id:"DTC-EV-1811",route:"DTC-181",driver:"Amit Singh",conductor:"Ritu Sharma",speed:55,stop:"Connaught Place",next:"India Gate",delay:0,occupancy:45,fuel:"Electric",battery:80,status:"On Time",rating:4.9,city:"Delhi"},
{id:"DTC-EV-1821",route:"DTC-182",driver:"Harpreet Singh",conductor:"Gurpreet Kaur",speed:51,stop:"Chandni Chowk",next:"Red Fort",delay:0,occupancy:58,fuel:"Electric",battery:91,status:"On Time",rating:4.6,city:"Delhi"},
{id:"BMTC-AC-500C",route:"BMTC-500C",driver:"Venkat Rao",conductor:"Lakshmi V",speed:31,stop:"MG Road",next:"Indiranagar",delay:5,occupancy:92,fuel:"Electric",battery:61,status:"Delayed",rating:4.5,city:"Bangalore"},
{id:"BMTC-EV-335E",route:"BMTC-335E",driver:"Kiran Kumar",conductor:"Anitha Gowda",speed:35,stop:"Whitefield Gate",next:"Marathahalli",delay:7,occupancy:94,fuel:"Electric",battery:43,status:"Delayed",rating:4.0,city:"Bangalore"},
{id:"TSRTC-EV-101",route:"TSRTC-1",driver:"Ravi Reddy",conductor:"Padma Rao",speed:49,stop:"Hitech City",next:"Madhapur",delay:0,occupancy:63,fuel:"Electric",battery:82,status:"On Time",rating:4.8,city:"Hyderabad"},
{id:"PMPML-EV-101",route:"PMPML-1",driver:"Prakash Bhosle",conductor:"Swati Jadhav",speed:36,stop:"Shivajinagar",next:"Kothrud",delay:0,occupancy:42,fuel:"Electric",battery:77,status:"On Time",rating:4.7,city:"Pune"},
{id:"MTC-EV-M701",route:"MTC-M70",driver:"Murugan S",conductor:"Meena T",speed:44,stop:"Anna Salai",next:"T Nagar",delay:4,occupancy:81,fuel:"Electric",battery:54,status:"Delayed",rating:4.4,city:"Chennai"},
{id:"CTC-EV-0101",route:"CTC-1",driver:"Prosenjit Das",conductor:"Rimpa Dey",speed:28,stop:"Esplanade",next:"Park Street",delay:0,occupancy:55,fuel:"Electric",battery:79,status:"On Time",rating:4.5,city:"Kolkata"},
{id:"JCT-CNG-0101",route:"JCT-1",driver:"Mahesh Sharma",conductor:"Sunita Joshi",speed:33,stop:"Sindhi Camp",next:"MI Road",delay:6,occupancy:77,fuel:"CNG",battery:null,status:"Delayed",rating:4.1,city:"Jaipur"},
]
const COMPLAINTS=[
{id:"C1001",type:"Overcrowding",route:"BEST-1",city:"Mumbai",date:"Today 09:14",status:"Open",priority:"High",desc:"Bus extremely overcrowded at Bandra Station."},
{id:"C1002",type:"Driver Rash Driving",route:"BRTS-1",city:"Surat",date:"Today 08:32",status:"In Progress",priority:"High",desc:"Driver was speeding near Udhna overbridge."},
{id:"C1003",type:"AC Not Working",route:"DTC-181",city:"Delhi",date:"Yesterday",status:"Resolved",priority:"Medium",desc:"AC not functioning for entire journey."},
{id:"C1004",type:"Dirty Bus",route:"BRTS-A1",city:"Ahmedabad",date:"Yesterday",status:"Open",priority:"Low",desc:"Bus interior was dirty, seats had stains."},
{id:"C1005",type:"Wrong Fare Charged",route:"BMTC-500C",city:"Bangalore",date:"2 days ago",status:"In Progress",priority:"Medium",desc:"Conductor charged ₹40 instead of ₹35."},
]
const DRIVERS=[
{id:"SL-D001",name:"Rajesh Kumar",city:"Surat",vehicle:"SL-EV-0101",route:"BRTS-1",trips:2840,rating:4.8,license:"HMV",exp:"8 yrs",status:"On Duty",phone:"98765 43210",joined:"Mar 2016",accidents:0},
{id:"SL-D002",name:"Dhruv Patel",city:"Surat",vehicle:"SL-EV-0301",route:"BRTS-3",trips:1450,rating:4.7,license:"HMV",exp:"4 yrs",status:"On Duty",phone:"76543 21098",joined:"Feb 2020",accidents:0},
{id:"AMD-D001",name:"Rajesh Solanki",city:"Ahmedabad",vehicle:"AMTS-EV-A101",route:"BRTS-A1",trips:1120,rating:4.7,license:"HMV",exp:"3 yrs",status:"On Duty",phone:"94321 09876",joined:"Apr 2021",accidents:0},
{id:"MUM-D001",name:"Ramesh Kadam",city:"Mumbai",vehicle:"BEST-EV-0021",route:"BEST-2",trips:1980,rating:4.4,license:"HMV",exp:"6 yrs",status:"On Duty",phone:"92109 87654",joined:"Feb 2018",accidents:0},
{id:"DEL-D001",name:"Amit Singh",city:"Delhi",vehicle:"DTC-EV-1811",route:"DTC-181",trips:3210,rating:4.9,license:"HMV",exp:"11 yrs",status:"On Duty",phone:"99887 76655",joined:"Jan 2013",accidents:0},
{id:"BLR-D001",name:"Venkat Rao",city:"Bangalore",vehicle:"BMTC-AC-500C",route:"BMTC-500C",trips:2100,rating:4.5,license:"LMV-HMV",exp:"7 yrs",status:"On Duty",phone:"87654 32109",joined:"Jun 2017",accidents:0},
{id:"HYD-D001",name:"Ravi Reddy",city:"Hyderabad",vehicle:"TSRTC-EV-101",route:"TSRTC-1",trips:2340,rating:4.8,license:"HMV",exp:"7 yrs",status:"On Duty",phone:"84321 09876",joined:"Jul 2017",accidents:0},
{id:"PNQ-D001",name:"Prakash Bhosle",city:"Pune",vehicle:"PMPML-EV-101",route:"PMPML-1",trips:1560,rating:4.7,license:"HMV",exp:"5 yrs",status:"On Duty",phone:"82109 87654",joined:"Oct 2019",accidents:0},
{id:"CHN-D001",name:"Murugan S",city:"Chennai",vehicle:"MTC-EV-M701",route:"MTC-M70",trips:1980,rating:4.4,license:"HMV",exp:"6 yrs",status:"On Duty",phone:"80987 65432",joined:"Jan 2018",accidents:1},
{id:"KOL-D001",name:"Prosenjit Das",city:"Kolkata",vehicle:"CTC-EV-0101",route:"CTC-1",trips:1870,rating:4.5,license:"HMV",exp:"6 yrs",status:"On Duty",phone:"78765 43210",joined:"Mar 2018",accidents:0},
]
const CITY_STOPS={
Surat:["Surat Railway Station","Surat Airport","Udhna Darwaja BRTS","Udhna Circle","Katargam BRTS","Varachha Road","Sarthana Junction","Kapodra","Kamrej Road","Pandesara","Sachin GIDC Naka","Adajan Patiya","City Light","Althan","Pal R.T.O.","ONGC Colony","Piplod","Lal Darwaja","Athwagate","Rander Road","Jahangirpura","Bhatar Road","VIP Circle Kapodra","Dabholi","Limbayat","Kim","Mota Varachha","Saroli","Singanpur","Bhaiya Nagar","Gaushala","Hirabaug","Kamrej","Vesu","Dumas Road","Nana Varachha"],
Ahmedabad:["Ahmedabad Railway Station","Geeta Mandir Bus Stand","BRTS Paldi","Jamalpur","Vastrapur","Thaltej BRTS","Motera","Naranpura","Memnagar","Vastral","Sarkhej","Chandkheda","Gota","Maninagar","Naroda","Isanpur","Nikol","Odhav","Bapunagar","Rakhial","Dariapur","Shahpur","Khanpur","Ellis Bridge","Law Garden","Navrangpura","Ambawadi","Income Tax","SP Ring Road","Bopal","Satellite Road","Bodakdev","Airport Ahmedabad"],
Mumbai:["Chhatrapati Shivaji Terminus","Mumbai Central","Dadar Bus Depot","Andheri Bus Depot","Bandra Station (W)","Colaba","Nariman Point","Fort","Mahalaxmi","Worli","Andheri Station","Borivali","Churchgate","Marine Lines","Khar Road","Santa Cruz","Vile Parle","Jogeshwari","Sion","Kurla West","Ghatkopar East","Lower Parel","Elphinstone Road","Dharavi","Matunga","Mahim","IT Park Powai"],
Delhi:["New Delhi Railway Station","Hazrat Nizamuddin","Kashmere Gate ISBT","Anand Vihar ISBT","IGI Airport T1","IGI Airport T3","Rajiv Chowk","Connaught Place","Chandni Chowk","India Gate","Lajpat Nagar","Nehru Place","Saket","Hauz Khas","AIIMS","INA","Red Fort","Janpath","Dwarka Sector 21","Dwarka Sector 14","Janakpuri","Rohini Sector 18","GTB Nagar","Mukherjee Nagar","Vasant Kunj","Qutub Minar","RK Puram"],
Bangalore:["Kempegowda Bus Station","Kempegowda Airport","Shivajinagar Bus Stand","Banashankari Bus Stand","MG Road","Brigade Road","Indiranagar 100ft Road","Whitefield Main Gate","Whitefield Gate","EPIP Zone","ITPL","Marathahalli Bridge","Electronic City Phase 1","Electronic City Phase 2","Koramangala 5th Block","HSR Layout","BTM Layout","Silk Board Junction","Hebbal Flyover","Yeshwanthpur","Rajajinagar","Malleswaram"],
Hyderabad:["MGBS","Jubilee Bus Station","Hyderabad Airport","Secunderabad Junction","Hitech City","Madhapur","Old City Charminar","Abids","Koti","Mehdipatnam","Gachibowli","Financial District","Kondapur","Ameerpet","Begumpet","Dilsukhnagar","LB Nagar","Uppal","Nagole","Kukatpally","KPHB Colony","Miyapur"],
Pune:["Pune Railway Station","Shivajinagar Bus Stand","Swargate Bus Stand","Pune Airport","Hinjewadi IT Park","Kothrud","Deccan Gymkhana","FC Road","Hadapsar","Magarpatta","Aundh","Baner Road","Wakad","Pimpri","Chinchwad","Koregaon Park","Viman Nagar","Kharadi"],
Chennai:["Chennai Central","Chennai Egmore","Koyambedu Bus Terminus","Tambaram Bus Stand","Chennai Airport","T Nagar","Anna Salai","Guindy","Velachery","Tambaram","Perambur","Anna Nagar","Mogappair","Ambattur","Parrys Corner","Broadway","George Town"],
Kolkata:["Howrah Station","Sealdah Station","Esplanade","Park Street","Salt Lake Sector V","Newtown","Jadavpur","Garia","Tollygunge","Gariahat","Kalighat","Ballygunge","Dakshineswar","Dum Dum","Lake Town"],
Jaipur:["Sindhi Camp Bus Stand","Jaipur Railway Station","Jaipur Airport","MI Road","Albert Hall","Raja Park","Vaishali Nagar","Mansarovar","Malviya Nagar","Amber Fort Stop","Bani Park","Vidyadhar Nagar","Civil Lines Jaipur"],
Lucknow:["Lucknow Railway Junction","Alambagh Bus Stand","Kaiserbagh","Amausi Airport","Hazratganj","Charbagh","Aminabad","Gomti Nagar","Indira Nagar","Mahanagar","IT City Lucknow"],
Kochi:["Ernakulam Junction","KSRTC Bus Stand Kochi","MG Road Kochi","Aluva Junction","Cochin Airport","Vytilla Hub","Kakkanad","Infopark","Kalamassery","Edappally","Kaloor","Marine Drive"],
}
const TIMETABLE=[
{time:"05:30",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0101"},
{time:"06:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"On Time",dur:"35 min",bus:"SL-EV-0101"},
{time:"06:30",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"On Time",dur:"35 min",bus:"SL-EV-0102"},
{time:"07:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Departed",dur:"35 min",bus:"SL-EV-0101"},
{time:"07:30",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Running +3m",dur:"38 min",bus:"SL-EV-0102"},
{time:"08:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"On Time",dur:"35 min",bus:"SL-EV-0101"},
{time:"09:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0102"},
{time:"10:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0101"},
{time:"12:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0102"},
{time:"14:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0101"},
{time:"16:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0102"},
{time:"18:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0101"},
{time:"20:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0102"},
{time:"22:00",from:"Udhna Darwaja",to:"Sachin GIDC Naka",status:"Scheduled",dur:"35 min",bus:"SL-EV-0101"},
]
const NOTIFS=[
{ico:"🚌",text:"Route BRTS-1 bus arriving in 4 min at Udhna Darwaja",time:"Just now",unread:true},
{ico:"⚠️",text:"Route BMTC-500C delayed 5 min — traffic on MG Road",time:"4 min ago",unread:true},
{ico:"✅",text:"Your Monthly Pass renewed successfully",time:"1 hr ago",unread:false},
{ico:"📊",text:"Your June trip summary: 142 trips, ₹280 saved",time:"Today 8 AM",unread:false},
{ico:"🔧",text:"CT-102 Kamrej: Scheduled maintenance Sunday 11PM–4AM",time:"Yesterday",unread:false},
]
const TICKER=["🚌 BRTS-1 Surat (Sitilink): On Time · Next at Udhna Darwaja in 4 min","⚡ BMTC-500C Bangalore: 5 min delay near MG Road · AI rerouting","🎉 New city live: Chandigarh — 340 buses on TransitOne!","🚨 CT-102 Surat: Rerouted via Laskana — road work till 6 PM","📊 2.4 million passengers tracked across 127 cities today","🔋 Green: 38% of TransitOne fleet now fully electric","🏆 TransitOne wins Best Smart City Solution 2026"]
const TABS=["Home","Live Map","Journey","Routes","Schedule","Search","Passenger","Payment","Cities","Admin","Analytics"]
const G="linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)"
const G2="linear-gradient(135deg,#10b981,#059669)"
const S=(n,d)=>({background:`rgba(255,255,255,${n})`,border:`1px solid rgba(255,255,255,${d})`})

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#07080f;--bg2:#0d0f1a;--g1:rgba(255,255,255,.04);--g2:rgba(255,255,255,.07);--b1:rgba(255,255,255,.07);--b2:rgba(255,255,255,.13);--t1:#eef0ff;--t2:#9aa3c7;--t3:#525d85;--a:#6366f1;--a2:#818cf8;--gr:#10b981;--am:#f59e0b;--rd:#ef4444;--pk:#ec4899;--r:14px;--r2:10px}
html,body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--t1);min-height:100vh;overflow-x:hidden;line-height:1.5}
button,select,input,textarea{font-family:'Inter',sans-serif}
::-webkit-scrollbar{width:3px;height:3px}::-webkit-scrollbar-thumb{background:var(--b2);border-radius:3px}
.nav{position:sticky;top:0;z-index:200;background:rgba(7,8,15,.9);backdrop-filter:blur(28px);border-bottom:1px solid var(--b1);display:flex;align-items:center;height:56px;padding:0 16px;gap:10px}
.logo{display:flex;align-items:center;gap:8px;cursor:pointer;flex-shrink:0}
.logo-ico{width:30px;height:30px;background:${G};border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px}
.logo-nm{font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:14px;background:${G};-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.ntabs{flex:1;display:flex;gap:1px;overflow-x:auto;scrollbar-width:none}.ntabs::-webkit-scrollbar{display:none}
.nt{padding:6px 10px;border-radius:6px;cursor:pointer;font-size:11px;font-weight:500;color:var(--t3);border:none;background:transparent;white-space:nowrap;transition:all .18s}
.nt:hover{color:var(--t2);background:var(--g1)}.nt.on{color:var(--t1);background:var(--g2);border:1px solid var(--b2)}
.nib{width:30px;height:30px;border-radius:6px;background:var(--g1);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;position:relative;transition:background .18s;flex-shrink:0}
.nib:hover{background:var(--g2)}.ndot{position:absolute;top:4px;right:4px;width:6px;height:6px;border-radius:50%;background:var(--rd);border:1.5px solid var(--bg)}
.nsign{padding:6px 12px;border-radius:7px;background:${G};border:none;color:#fff;font-size:11px;font-weight:700;cursor:pointer;flex-shrink:0;white-space:nowrap}
.ticker{background:rgba(99,102,241,.07);border-bottom:1px solid var(--b1);padding:5px 16px;display:flex;align-items:center;gap:7px;font-size:11px;color:var(--t2)}
.tlive{background:var(--rd);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:3px;letter-spacing:.1em;flex-shrink:0;animation:blink 1.6s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(8px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px;animation:fi .18s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.modal{background:var(--bg2);border:1px solid var(--b2);border-radius:var(--r);padding:22px;max-width:460px;width:100%;max-height:88vh;overflow-y:auto;position:relative;box-shadow:0 8px 40px rgba(0,0,0,.6)}
.mx{position:absolute;top:12px;right:12px;width:26px;height:26px;border-radius:6px;background:var(--g2);border:1px solid var(--b1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:13px;color:var(--t2)}
.hero{position:relative;min-height:82vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 16px;overflow:hidden;text-align:center}
.hbg{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% -5%,rgba(99,102,241,.2),transparent 58%),radial-gradient(ellipse 55% 55% at 90% 90%,rgba(236,72,153,.12),transparent)}
.hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.04) 1px,transparent 1px);background-size:52px 52px;mask-image:radial-gradient(ellipse at center,black 25%,transparent 72%)}
.hbadge{display:inline-flex;align-items:center;gap:7px;padding:5px 14px;border-radius:100px;background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.28);font-size:10.5px;font-weight:700;color:var(--a2);margin-bottom:20px;letter-spacing:.08em;text-transform:uppercase}
.pulse{width:6px;height:6px;border-radius:50%;background:var(--gr);animation:pulse 2s infinite;flex-shrink:0}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.6)}}
.ht{font-family:'Space Grotesk',sans-serif;font-size:clamp(28px,5.5vw,64px);font-weight:800;line-height:1.06;letter-spacing:-.035em;margin-bottom:14px;max-width:820px}
.gt{background:${G};-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hs{font-size:clamp(13px,1.7vw,17px);color:var(--t2);max-width:540px;line-height:1.8;margin-bottom:32px}
.scard{width:100%;max-width:680px;background:var(--g2);backdrop-filter:blur(28px);border:1px solid var(--b2);border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:9px;position:relative;z-index:2}
.irow{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.inp{background:rgba(255,255,255,.05);border:1px solid var(--b1);border-radius:var(--r2);padding:10px 12px;color:var(--t1);font-size:13px;outline:none;transition:border .18s;width:100%}
.inp::placeholder{color:var(--t3)}.inp:focus{border-color:var(--a)}select.inp{cursor:pointer}
.pbtn{width:100%;padding:12px;border-radius:var(--r2);background:${G};border:none;color:#fff;font-size:13px;font-weight:800;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:opacity .18s,transform .12s}
.pbtn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}.pbtn:disabled{opacity:.4;cursor:not-allowed}
.sbtn{padding:8px 16px;border-radius:var(--r2);background:var(--g2);border:1px solid var(--b2);color:var(--t1);font-size:12px;font-weight:600;cursor:pointer;transition:all .18s}
.sbtn:hover{background:rgba(255,255,255,.1)}
.sec{padding:44px 16px;max-width:1220px;margin:0 auto;width:100%}
.sh{margin-bottom:26px}.ey{font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--a2);margin-bottom:7px}
.st{font-family:'Space Grotesk',sans-serif;font-size:clamp(20px,2.8vw,32px);font-weight:800;letter-spacing:-.02em;margin-bottom:8px}
.ss{color:var(--t2);font-size:13px;max-width:500px;line-height:1.7}
.card{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);transition:all .22s}
.card:hover{border-color:var(--b2);background:var(--g2)}
.sgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.sc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px;text-align:center;transition:all .28s}
.sc:hover{transform:translateY(-3px);border-color:var(--b2)}
.rgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}
.rc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:15px;transition:all .2s;cursor:pointer}
.rc:hover{border-color:var(--b2);background:var(--g2);transform:translateY(-2px)}
.badge{padding:3px 8px;border-radius:100px;font-size:9.5px;font-weight:700}
.bac{background:rgba(99,102,241,.18);color:var(--a2)}.bel{background:rgba(16,185,129,.18);color:var(--gr)}.bna{background:rgba(245,158,11,.15);color:var(--am)}
.mcanv{width:100%;height:420px;position:relative;background:linear-gradient(155deg,#060c1e,#0b1228,#0d1736);overflow:hidden;border-radius:var(--r);border:1px solid var(--b1)}
.mgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,.055) 1px,transparent 1px);background-size:38px 38px}
.bm{position:absolute;transform:translate(-50%,-50%);cursor:pointer}
.bd{width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.8);display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:800;color:#fff}
.bok{background:var(--gr)}.blate{background:var(--rd)}
.bripple{position:absolute;inset:-7px;border-radius:50%;border:1px solid currentColor;animation:ripple 2.4s infinite}
@keyframes ripple{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.6);opacity:0}}
.blbl{position:absolute;top:15px;left:50%;transform:translateX(-50%);background:rgba(6,7,14,.9);border:1px solid var(--b1);border-radius:3px;padding:1px 5px;font-size:8px;font-weight:700;white-space:nowrap;color:var(--t2)}
.al{display:grid;grid-template-columns:185px 1fr;gap:14px;min-height:540px}
.asb{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:10px;display:flex;flex-direction:column;gap:2px}
.an{padding:8px 10px;border-radius:6px;cursor:pointer;font-size:11.5px;font-weight:500;color:var(--t2);transition:all .18s;display:flex;align-items:center;gap:7px}
.an:hover,.an.on{background:rgba(99,102,241,.14);color:var(--a2)}
.amain{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px;overflow:auto}
.tbl{width:100%;border-collapse:collapse}
.tbl th{text-align:left;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);padding:8px 10px;border-bottom:1px solid var(--b1)}
.tbl td{padding:9px 10px;font-size:11.5px;border-bottom:1px solid rgba(255,255,255,.03)}
.tbl tr:last-child td{border-bottom:none}.tbl tbody tr:hover td{background:rgba(255,255,255,.02)}
.sb{padding:3px 8px;border-radius:100px;font-size:9.5px;font-weight:700;display:inline-flex;align-items:center;gap:3px}
.sb-ok{background:rgba(16,185,129,.14);color:var(--gr)}.sb-late{background:rgba(239,68,68,.14);color:var(--rd)}.sb-am{background:rgba(245,158,11,.14);color:var(--am)}.sb-lo{background:rgba(99,102,241,.14);color:var(--a2)}.sb-prog{background:rgba(245,158,11,.14);color:var(--am)}
.kc{background:rgba(255,255,255,.03);border-radius:var(--r2);padding:12px}
.pl{display:grid;grid-template-columns:185px 1fr;gap:14px}
.psb{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:10px;display:flex;flex-direction:column;gap:2px}
.pm{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px}
.chat{display:flex;flex-direction:column;height:400px;background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);overflow:hidden}
.chat-h{padding:11px 15px;border-bottom:1px solid var(--b1);display:flex;align-items:center;gap:9px;background:var(--g2)}
.chat-b{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:8px}
.cm{max-width:78%;padding:8px 12px;border-radius:11px;font-size:12px;line-height:1.6}
.cm.ai{background:var(--g2);border:1px solid var(--b1);align-self:flex-start;border-radius:3px 11px 11px 11px}
.cm.user{background:rgba(99,102,241,.18);border:1px solid rgba(99,102,241,.24);align-self:flex-end;border-radius:11px 3px 11px 11px}
.chat-ir{display:flex;gap:7px;padding:10px;border-top:1px solid var(--b1)}
.chat-inp{flex:1;background:rgba(255,255,255,.05);border:1px solid var(--b1);border-radius:8px;padding:8px 11px;color:var(--t1);font-size:12px;outline:none}
.chat-inp:focus{border-color:var(--a)}
.abar{background:linear-gradient(90deg,rgba(239,68,68,.14),transparent);border:1px solid rgba(239,68,68,.24);border-radius:var(--r2);padding:10px 13px;display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:11px}
.abar.warn{background:linear-gradient(90deg,rgba(245,158,11,.12),transparent);border-color:rgba(245,158,11,.22)}
.abar.info{background:linear-gradient(90deg,rgba(16,185,129,.1),transparent);border-color:rgba(16,185,129,.2)}
.ld{display:flex;gap:5px;justify-content:center;padding:16px}
.ldd{width:6px;height:6px;border-radius:50%;background:var(--a);animation:ld .68s infinite}
.ldd:nth-child(2){animation-delay:.12s}.ldd:nth-child(3){animation-delay:.24s}
@keyframes ld{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
.sch-g{border-radius:var(--r);overflow:hidden;border:1px solid var(--b1)}
.sch-row{display:grid;grid-template-columns:80px 1fr 1fr 80px 130px;align-items:center;padding:10px 14px;background:var(--g1);border-bottom:1px solid rgba(255,255,255,.03)}
.sch-row:hover{background:var(--g2)}.sch-row:last-child{border-bottom:none}
.sch-hdr{background:var(--bg2)!important;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--t3);border-bottom:1px solid var(--b1)!important}
.cg{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px}
.cc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r2);padding:13px;text-align:center;cursor:pointer;transition:all .18s}
.cc:hover,.cc.on{border-color:var(--a);background:rgba(99,102,241,.07)}
.ang{display:grid;grid-template-columns:repeat(2,1fr);gap:13px}
.anc{background:var(--g1);border:1px solid var(--b1);border-radius:var(--r);padding:20px}
.prg{display:flex;flex-direction:column;gap:9px}
.pri{display:flex;flex-direction:column;gap:4px}
.prb{height:5px;background:var(--b1);border-radius:3px}
.prf{height:100%;border-radius:3px;transition:width 1.2s ease}
.bch{display:flex;align-items:flex-end;gap:6px;height:130px}
.bg{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
.bb{width:100%;border-radius:5px 5px 0 0;min-width:16px}
.foot{background:var(--bg2);border-top:1px solid var(--b1);padding:40px 16px 18px}
.fg{max-width:1220px;margin:0 auto;display:grid;grid-template-columns:2fr repeat(3,1fr);gap:30px;margin-bottom:30px}
.flo{font-family:'Space Grotesk',sans-serif;font-size:16px;font-weight:800;background:${G};-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:8px}
.fd{font-size:12px;color:var(--t3);line-height:1.7;max-width:240px;margin-bottom:13px}
.fl{display:block;font-size:12px;color:var(--t3);margin-bottom:7px;cursor:pointer}.fl:hover{color:var(--t2)}
.fct{font-size:10.5px;font-weight:800;letter-spacing:.11em;text-transform:uppercase;color:var(--t2);margin-bottom:10px}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(20,24,48,.97);border:1px solid var(--b2);border-radius:var(--r2);padding:12px 20px;font-size:13px;color:var(--t1);z-index:999;box-shadow:0 8px 32px rgba(0,0,0,.5);max-width:400px;text-align:center;cursor:pointer;animation:fi .22s ease;white-space:nowrap}
.np{position:absolute;top:48px;right:10px;width:300px;background:var(--bg2);border:1px solid var(--b2);border-radius:var(--r);box-shadow:0 8px 32px rgba(0,0,0,.5);z-index:400;overflow:hidden;animation:fi .18s ease}
.npi{padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.03);cursor:pointer;transition:background .15s;font-size:12px}
.npi:hover{background:var(--g1)}.npi:last-child{border-bottom:none}
.otp-box{width:42px;height:50px;text-align:center;font-size:20px;font-weight:800;font-family:'Space Grotesk',sans-serif;background:var(--g2);border:2px solid var(--b1);border-radius:var(--r2);color:var(--t1);outline:none;transition:border .15s}
.otp-box:focus{border-color:var(--a)}
@keyframes pop{0%{transform:scale(0)}80%{transform:scale(1.15)}100%{transform:scale(1)}}
@media(max-width:900px){.sgrid{grid-template-columns:repeat(2,1fr)}.al{grid-template-columns:1fr}.asb{flex-direction:row;flex-wrap:wrap}.pl{grid-template-columns:1fr}.psb{flex-direction:row;flex-wrap:wrap}.fg{grid-template-columns:1fr 1fr;gap:22px}.ang{grid-template-columns:1fr}.irow{grid-template-columns:1fr}}
@media(max-width:600px){.ntabs{display:none}.rgrid{grid-template-columns:1fr}.fg{grid-template-columns:1fr}.sgrid{grid-template-columns:repeat(2,1fr)}}
`

const _q={current:[]};let _ql=[];
function useUtrQ(){const[q,setQ]=useState(_q.current);useEffect(()=>{const cb=n=>setQ([...n]);_ql.push(cb);return()=>{_ql=_ql.filter(l=>l!==cb)}},[]);const push=e=>{_q.current=[e,..._q.current];_ql.forEach(l=>l(_q.current))};const upd=(id,p)=>{_q.current=_q.current.map(e=>e.id===id?{...e,...p}:e);_ql.forEach(l=>l(_q.current))};return{q,push,upd}}

function UtrAdmin(){
  const{q,upd}=useUtrQ();const[filt,setFilt]=useState("all");const[sel,setSel]=useState(null);const[note,setNote]=useState("");const[busy,setBusy]=useState(false);
  const shown=filt==="all"?q:q.filter(e=>e.status===filt);
  const counts={pending:q.filter(e=>e.status==="pending").length,approved:q.filter(e=>e.status==="approved").length,rejected:q.filter(e=>e.status==="rejected").length};
  const act=async(id,dec)=>{setBusy(true);await new Promise(r=>setTimeout(r,600));upd(id,{status:dec,adminNote:note||( dec==="approved"?"Payment verified.":"Could not verify UTR."),reviewedAt:new Date().toLocaleString("en-IN")});setSel(null);setNote("");setBusy(false)};
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
      <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800}}>UTR Payment Queue</div><div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>Review and approve UPI payments</div></div>
      {counts.pending>0&&<div style={{padding:"4px 12px",borderRadius:100,background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",fontSize:11,fontWeight:700,color:"var(--am)"}}>⏳ {counts.pending} pending</div>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:14}}>
      {[{l:"Total",v:q.length,c:"var(--a2)"},{l:"Pending",v:counts.pending,c:"var(--am)"},{l:"Approved",v:counts.approved,c:"var(--gr)"}].map(k=>(
        <div key={k.l} className="kc"><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:k.c,marginBottom:2}}>{k.v}</div><div style={{fontSize:10,color:"var(--t3)"}}>{k.l}</div></div>
      ))}
    </div>
    <div style={{display:"flex",gap:7,marginBottom:13}}>
      {["all","pending","approved","rejected"].map(f=><button key={f} onClick={()=>setFilt(f)} style={{padding:"5px 12px",borderRadius:100,background:filt===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${filt===f?"var(--a)":"var(--b1)"}`,color:filt===f?"var(--a2)":"var(--t2)",fontSize:11,cursor:"pointer"}}>{f.charAt(0).toUpperCase()+f.slice(1)}</button>)}
    </div>
    {shown.length===0?<div style={{textAlign:"center",padding:"40px",color:"var(--t3)"}}>
      <div style={{fontSize:32,marginBottom:10}}>⏳</div><div style={{fontSize:13,color:"var(--t2)"}}>No {filt==="all"?"submissions yet":"entries in this category"}</div>
      <div style={{fontSize:11,marginTop:5}}>When passengers submit UTR numbers, they appear here.</div>
    </div>:<table className="tbl">
      <thead><tr><th>Ticket</th><th>UTR</th><th>Name</th><th>Pass</th><th>Amount</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{shown.map(e=><tr key={e.id}>
        <td style={{fontSize:10,color:"var(--t3)",fontFamily:"monospace"}}>{e.id}</td>
        <td style={{fontWeight:800,fontSize:12,color:"var(--a2)",fontFamily:"monospace"}}>{e.utr}</td>
        <td style={{fontWeight:600}}>{e.name}</td>
        <td style={{fontSize:11}}>{e.pass}</td>
        <td style={{fontWeight:700,color:"var(--gr)"}}>{e.amount}</td>
        <td style={{fontSize:10,color:"var(--t3)"}}>{e.submittedAt}</td>
        <td><span className={`sb ${e.status==="approved"?"sb-ok":e.status==="rejected"?"sb-late":"sb-am"}`}>● {e.status}</span></td>
        <td><button className="sb sb-lo" style={{cursor:"pointer",border:"none"}} onClick={()=>{setSel(e);setNote("")}}>Review</button></td>
      </tr>)}</tbody>
    </table>}
    {sel&&<div style={{marginTop:14,background:"var(--bg2)",border:"1px solid var(--b2)",borderRadius:"var(--r)",padding:18}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800}}>Review — {sel.utr}</div>
        <button className="mx" onClick={()=>setSel(null)}>✕</button>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:13}}>
        {[["UTR",sel.utr],["Name",sel.name],["Pass",sel.pass],["Amount",sel.amount],["Phone",sel.phone||"—"],["Submitted",sel.submittedAt]].map(([l,v])=>(
          <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:7,padding:"8px 10px"}}>
            <div style={{fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{l}</div>
            <div style={{fontSize:12,fontWeight:700,wordBreak:"break-all"}}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{marginBottom:11}}>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Admin Note (optional)</div>
        <input className="inp" placeholder="Add note visible to passenger" value={note} onChange={e=>setNote(e.target.value)}/>
      </div>
      {sel.status==="pending"?<div style={{display:"flex",gap:9}}>
        <button onClick={()=>act(sel.id,"approved")} disabled={busy} style={{flex:1,padding:"11px",borderRadius:"var(--r2)",background:"var(--gr)",border:"none",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",opacity:busy?.6:1}}>✅ Approve</button>
        <button onClick={()=>act(sel.id,"rejected")} disabled={busy} style={{flex:1,padding:"11px",borderRadius:"var(--r2)",background:"rgba(239,68,68,.15)",border:"1px solid rgba(239,68,68,.35)",color:"var(--rd)",fontSize:13,fontWeight:800,cursor:"pointer",opacity:busy?.6:1}}>❌ Reject</button>
      </div>:<div style={{textAlign:"center",fontSize:12,color:"var(--t3)"}}>Already {sel.status}.</div>}
    </div>}
  </div>)
}

function UtrForm({selPass,city,onSuccess,onBack}){
  const{push,q}=useUtrQ();const[utr,setUtr]=useState("");const[name,setName]=useState("");const[phone,setPhone]=useState("");const[status,setStatus]=useState("idle");const[err,setErr]=useState("");const[ticket,setTicket]=useState(null);
  const PRICES={"Single Trip":"₹25","Day Pass":"₹80","Monthly Pass":"₹500","Annual Pass":"₹4,999","Student Pass":"₹300","Senior Pass":"₹250"};
  const price=PRICES[selPass]||"₹25";const valid=/^[0-9]{12}$/.test(utr.trim());
  useEffect(()=>{if(!ticket)return;const f=q.find(e=>e.id===ticket.id);if(!f)return;if(f.status==="approved")setStatus("approved");if(f.status==="rejected")setStatus("rejected")},[q,ticket]);
  const submit=async()=>{
    if(!utr.trim()){setErr("Enter UTR number");setStatus("err");return}
    if(!valid){setErr("UTR must be exactly 12 digits");setStatus("err");return}
    if(!name.trim()){setErr("Enter name used for payment");setStatus("err");return}
    if(q.some(e=>e.utr===utr.trim())){setErr("This UTR already submitted");setStatus("err");return}
    setStatus("submitting");await new Promise(r=>setTimeout(r,900));
    const e={id:"UTR-"+Date.now(),utr:utr.trim(),name:name.trim(),phone:phone||"—",pass:selPass,city:city==="All Cities"?"All Routes":city,amount:price,submittedAt:new Date().toLocaleString("en-IN",{dateStyle:"medium",timeStyle:"short"}),status:"pending",adminNote:""};
    push(e);setTicket(e);setStatus("pending");
  };
  if(status==="approved"&&ticket)return(<div style={{textAlign:"center",padding:"10px 0"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(16,185,129,.15)",border:"2px solid var(--gr)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:38,animation:"pop .4s ease"}}>✅</div>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Payment Approved!</div>
    <div style={{color:"var(--t2)",fontSize:13,marginBottom:20}}>UTR <strong style={{color:"var(--a2)"}}>{ticket.utr}</strong> verified. Your <strong style={{color:"var(--a2)"}}>{selPass}</strong> is now active!</div>
    <div style={{display:"flex",gap:9,justifyContent:"center"}}><button className="pbtn" style={{maxWidth:200,padding:"10px 0",fontSize:12}} onClick={onSuccess}>📲 View QR Ticket</button></div>
  </div>);
  if(status==="rejected"&&ticket)return(<div style={{textAlign:"center",padding:"10px 0"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(239,68,68,.13)",border:"2px solid var(--rd)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:36}}>❌</div>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Payment Rejected</div>
    <div style={{color:"var(--t2)",fontSize:13,marginBottom:18}}>Admin could not verify UTR <strong style={{color:"var(--rd)"}}>{ticket.utr}</strong>.</div>
    <div style={{display:"flex",gap:9,justifyContent:"center"}}><button className="pbtn" style={{maxWidth:200,padding:"10px 0",fontSize:12}} onClick={()=>{setStatus("idle");setUtr("");setTicket(null)}}>🔄 Try Again</button><button className="sbtn" style={{fontSize:12}} onClick={onBack}>← Back</button></div>
  </div>);
  if(status==="pending"&&ticket)return(<div style={{textAlign:"center",padding:"10px 0"}}>
    <div style={{width:80,height:80,borderRadius:"50%",background:"rgba(245,158,11,.12)",border:"2px solid var(--am)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:36}}>⏳</div>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:6}}>Awaiting Admin Verification</div>
    <div style={{color:"var(--t2)",fontSize:13,marginBottom:20}}>UTR <strong style={{color:"var(--am)"}}>{ticket.utr}</strong> submitted. Admin will verify and activate your pass shortly.</div>
    <div style={{background:"rgba(245,158,11,.07)",border:"1px solid rgba(245,158,11,.22)",borderRadius:"var(--r)",padding:16,marginBottom:18,textAlign:"left"}}>
      {[["Ticket ID",ticket.id],["UTR",ticket.utr],["Pass",ticket.pass+" — "+ticket.city],["Amount",ticket.amount],["Submitted",ticket.submittedAt]].map(([l,v])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.05)"}}>
          <span style={{fontSize:11,color:"var(--t3)"}}>{l}</span><span style={{fontSize:11.5,fontWeight:700,color:"var(--am)"}}>{v}</span>
        </div>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontSize:12,color:"var(--t2)",marginBottom:18}}>
      <span style={{width:8,height:8,borderRadius:"50%",background:"var(--am)",display:"inline-block",animation:"pulse 1.8s infinite"}}/>Listening for admin approval…
    </div>
    <button className="sbtn" style={{fontSize:12}} onClick={onBack}>← Back to Payment</button>
  </div>);
  return(<div style={{maxWidth:500,margin:"0 auto"}}>
    <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:20}}>
      <button onClick={onBack} style={{width:30,height:30,borderRadius:7,background:"var(--g2)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
      <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:800}}>Submit UTR for Verification</div><div style={{fontSize:11,color:"var(--t3)"}}>Admin will verify and activate your pass</div></div>
    </div>
    <div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",padding:"11px 13px",marginBottom:16,fontSize:11.5,color:"var(--t2)",lineHeight:1.7}}>
      <strong style={{color:"var(--a2)"}}>UTR</strong> is a 12-digit number after every UPI payment. Find it in your UPI app under <strong>Payment History → Transaction Details</strong>.
    </div>
    <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"11px 13px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div><div style={{fontSize:10,color:"var(--t3)",marginBottom:2}}>Paying for</div><div style={{fontSize:13,fontWeight:700}}>{selPass}</div><div style={{fontSize:11,color:"var(--t2)"}}>To: TransitOne India · transitone@upi</div></div>
      <div style={{fontSize:17,fontWeight:800,color:"var(--a2)"}}>{price}</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:11,marginBottom:13}}>
      <div>
        <div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>UTR Number <span style={{color:"var(--rd)"}}>*</span> <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>12 digits</span></div>
        <div style={{position:"relative"}}>
          <input className="inp" maxLength={12} placeholder="e.g. 432156789012" value={utr} onChange={e=>{setUtr(e.target.value.replace(/\D/g,""));setStatus("idle");setErr("")}} style={{fontSize:16,fontWeight:700,letterSpacing:".1em",paddingRight:50,borderColor:status==="err"?"var(--rd)":valid?"var(--gr)":"var(--b1)"}}/>
          {utr.length>0&&<div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:11.5,color:valid?"var(--gr)":"var(--t3)",fontWeight:700}}>{utr.length}/12{valid?" ✓":""}</div>}
        </div>
        <div style={{height:3,background:"var(--b1)",borderRadius:2,marginTop:5,overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,transition:"width .18s,background .18s",width:`${(utr.length/12)*100}%`,background:utr.length===12?"var(--gr)":utr.length>=8?"var(--am)":"var(--a)"}}/></div>
      </div>
      <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Payer Name <span style={{color:"var(--rd)"}}>*</span></div><input className="inp" placeholder="Name shown in UPI app" value={name} onChange={e=>{setName(e.target.value);setStatus("idle");setErr("")}}/></div>
      <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Mobile <span style={{fontSize:10,color:"var(--t3)",fontWeight:400}}>(optional)</span></div><input className="inp" placeholder="10-digit mobile" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))}/></div>
    </div>
    {err&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"9px 12px",marginBottom:12,fontSize:12,color:"var(--rd)"}}>⚠️ {err}</div>}
    <button className="pbtn" onClick={submit} disabled={status==="submitting"} style={{opacity:status==="submitting"?.65:1}}>
      {status==="submitting"?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Submitting…</span>:"📤 Submit UTR for Verification"}
    </button>
    <div style={{fontSize:10,color:"var(--t3)",marginTop:8,textAlign:"center"}}>🔒 Your UTR is only used to verify payment.</div>
  </div>)
}

export default function TransitOne(){
const[tab,setTab]=useState("Home")
const[from,setFrom]=useState("")
const[to,setTo]=useState("")
const[city,setCity]=useState("All Cities")
const[planCity,setPlanCity]=useState("Surat")
const[selBus,setSelBus]=useState(null)
const[plan,setPlan]=useState(null)
const[planning,setPlanning]=useState(false)
const[ticker,setTicker]=useState(0)
const[mapTick,setMapTick]=useState(0)
const[notifOpen,setNotifOpen]=useState(false)
const[adminSec,setAdminSec]=useState("Overview")
const[passSec,setPassSec]=useState("Dashboard")
const[payStep,setPayStep]=useState("select")
const[selPass,setSelPass]=useState("Monthly Pass")
const[payMethod,setPayMethod]=useState("UPI")
const[rSearch,setRSearch]=useState("")
const[rFilter,setRFilter]=useState("All")
const[chat,setChat]=useState([{r:"ai",t:"👋 Hi! I'm TransitOne AI. Ask me about routes, fares, stops or schedules across India."}])
const[chatMsg,setChatMsg]=useState("")
const[chatBusy,setChatBusy]=useState(false)
const[sos,setSos]=useState(false)
const[toast,setToast]=useState("")
const[busModal,setBusModal]=useState(null)
const[routeModal,setRouteModal]=useState(null)
const[shareMsg,setShareMsg]=useState("")
const[signModal,setSignModal]=useState(false)
const[signRole,setSignRole]=useState("passenger")
const[signTab,setSignTab]=useState("login")
const[signMethod,setSignMethod]=useState("password")
const[signEmail,setSignEmail]=useState("")
const[signPass2,setSignPass2]=useState("")
const[signName,setSignName]=useState("")
const[signPhone2,setSignPhone2]=useState("")
const[signOtp,setSignOtp]=useState("")
const[otpSent,setOtpSent]=useState(false)
const[otpTimer,setOtpTimer]=useState(0)
const[adminCode,setAdminCode]=useState("")
const[signDone,setSignDone]=useState(false)
const[signBusy,setSignBusy]=useState(false)
const[signErr,setSignErr]=useState("")
const[complaintFilter,setComplaintFilter]=useState("All")
const[showCForm,setShowCForm]=useState(false)
const[cType,setCType]=useState("")
const[cRoute,setCRoute]=useState("")
const[cDesc,setCDesc]=useState("")
const[cSubmitted,setCSubmitted]=useState(false)
const[showLForm,setShowLForm]=useState(false)
const[lItem,setLItem]=useState("")
const[lCat,setLCat]=useState("")
const[lRoute,setLRoute]=useState("")
const[lDesc,setLDesc]=useState("")
const[lSubmitted,setLSubmitted]=useState(false)
const[mapFilter,setMapFilter]=useState("All")
const chatEnd=useRef(null)
useEffect(()=>{const t1=setInterval(()=>setTicker(n=>n+1),3600);const t2=setInterval(()=>setMapTick(n=>n+1),1600);return()=>{clearInterval(t1);clearInterval(t2)}},[])
useEffect(()=>{chatEnd.current?.scrollIntoView({behavior:"smooth"})},[chat])
useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(""),3500);return()=>clearTimeout(t)}},[toast])
useEffect(()=>{if(otpTimer>0){const t=setTimeout(()=>setOtpTimer(s=>s-1),1000);return()=>clearTimeout(t)}},[otpTimer])
const nav=t=>{setTab(t);setNotifOpen(false)}
const fmtOcc=n=>n>80?"var(--rd)":n>60?"var(--am)":"var(--gr)"
const bType=t=>t==="Electric"?"bel":t==="AC"?"bac":"bna"
const busPos=BUSES.filter(b=>mapFilter==="All"||b.status===mapFilter||(mapFilter==="Electric"&&b.fuel==="Electric")||(mapFilter==="CNG"&&b.fuel==="CNG")).map((b,i)=>({...b,x:10+(i*13)+Math.sin(mapTick/4+i*1.3)*4,y:16+(i*10)+Math.cos(mapTick/5+i*0.9)*5}))
const filtRoutes=ROUTES.filter(r=>(city==="All Cities"||r.city===city)&&(rFilter==="All"||r.type===rFilter)&&(!rSearch||r.no.toLowerCase().includes(rSearch.toLowerCase())||r.from.toLowerCase().includes(rSearch.toLowerCase())||r.to.toLowerCase().includes(rSearch.toLowerCase())))
const planBuses=BUSES.filter(b=>b.city===planCity)

const doPlan=useCallback(async()=>{
  if(!from||!to)return;setPlanning(true);setPlan(null)
  try{
    const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,messages:[{role:"user",content:`You are TransitOne India AI planner. Plan travel from "${from}" to "${to}" in ${planCity}, India. Return ONLY valid JSON no markdown: {"fastest":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"cheapest":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"leastWalk":{"time":"string","fare":"string","transfers":0,"walk":"string","mode":"string","steps":["s1","s2","s3"],"delay":"On Time"},"tip":"string","crowdAlert":"string"}`}]})})
    const d=await r.json();setPlan(JSON.parse((d.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim()))
  }catch{setPlan({error:true})}
  setPlanning(false)
},[from,to,planCity])

const doChat=useCallback(async()=>{
  if(!chatMsg.trim()||chatBusy)return
  const msg=chatMsg.trim();setChatMsg("");setChat(h=>[...h,{r:"user",t:msg}]);setChatBusy(true)
  try{const r=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:350,messages:[{role:"user",content:`You are TransitOne India's helpful AI assistant for public bus transport. Answer concisely. User asks: "${msg}"`}]})});const d=await r.json();setChat(h=>[...h,{r:"ai",t:d.content?.[0]?.text||"Sorry, try again."}])}
  catch{setChat(h=>[...h,{r:"ai",t:"Connection error. Please try again."}])}
  setChatBusy(false)
},[chatMsg,chatBusy])

const resetSign=()=>{setSignModal(false);setSignDone(false);setSignErr("");setSignMethod("password");setSignEmail("");setSignPass2("");setSignName("");setSignPhone2("");setSignOtp("");setOtpSent(false);setOtpTimer(0);setAdminCode("")}

const handleSign=async()=>{
  setSignErr("")
  if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return}
  if(!signEmail||!signPass2){setSignErr("Please enter email and password.");return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signEmail)){setSignErr("Enter a valid email address.");return}
  if(signPass2.length<6){setSignErr("Password must be at least 6 characters.");return}
  if(signTab==="register"&&!signName){setSignErr("Enter your full name.");return}
  setSignBusy(true);await new Promise(r=>setTimeout(r,900));setSignBusy(false);setSignDone(true)
}

const handleSendOtp=async()=>{
  setSignErr("")
  if(!signPhone2||!/^[6-9]\d{9}$/.test(signPhone2)){setSignErr("Enter a valid 10-digit mobile number.");return}
  if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return}
  setSignBusy(true);await new Promise(r=>setTimeout(r,1200));setSignBusy(false);setOtpSent(true);setOtpTimer(30)
}

const handleVerifyOtp=async()=>{
  setSignErr("")
  if(!signOtp||signOtp.length!==6){setSignErr("Enter the 6-digit OTP.");return}
  setSignBusy(true);await new Promise(r=>setTimeout(r,900));setSignBusy(false);setSignDone(true)
}

const Ld=()=><div className="ld"><div className="ldd"/><div className="ldd"/><div className="ldd"/></div>
const BusChip=({b,sel,onClick})=><div onClick={onClick} className={`card ${sel?"":""}`} style={{padding:"9px 11px",cursor:"pointer",minWidth:120,background:sel?"rgba(99,102,241,.12)":"var(--g1)",border:`1px solid ${sel?"var(--a)":"var(--b1)"}`}}>
  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><div style={{width:6,height:6,borderRadius:"50%",background:b.status==="On Time"?"var(--gr)":"var(--rd)"}}/><span style={{fontSize:11,fontWeight:700}}>{b.route}</span></div>
  <div style={{fontSize:10,color:"var(--t3)",marginBottom:2}}>{b.stop}</div>
  <div style={{fontSize:10,color:"var(--t2)"}}>{b.speed}km/h · {b.occupancy}%</div>
</div>

const RC=({r,onClick})=><div className="rc" onClick={onClick}>
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
    <div><div style={{fontSize:9.5,color:"var(--t3)",marginBottom:2}}>{r.city}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:17,fontWeight:800,color:"var(--a2)"}}>{r.no}</div></div>
    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
      <span className={`badge ${bType(r.type)}`}>{r.type}</span>
      {r.source&&<span style={{fontSize:9,color:"var(--gr)",fontWeight:700}}>✅ {r.source}</span>}
    </div>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
    <div style={{width:7,height:7,borderRadius:"50%",background:"var(--a)",flexShrink:0}}/><span style={{fontSize:11.5}}>{r.from}</span>
    <div style={{flex:1,height:1,background:"var(--b2)",position:"relative"}}><span style={{position:"absolute",right:-4,top:-6,fontSize:9,color:"var(--b2)"}}>▸</span></div>
    <div style={{width:7,height:7,borderRadius:"50%",border:"2px solid var(--a)",flexShrink:0}}/><span style={{fontSize:11.5}}>{r.to}</span>
  </div>
  <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
    <div style={{fontSize:10.5,color:"var(--t2)"}}><span style={{display:"block",fontSize:12.5,fontWeight:700,color:"var(--t1)",marginBottom:1}}>{r.dur}</span>Duration</div>
    <div style={{fontSize:10.5,color:"var(--t2)"}}><span style={{display:"block",fontSize:12.5,fontWeight:700,color:"var(--t1)",marginBottom:1}}>{r.fare}</span>Fare</div>
    <div style={{fontSize:10.5,color:"var(--t2)"}}><span style={{display:"block",fontSize:12.5,fontWeight:700,color:"var(--gr)",marginBottom:1}}>{r.next}</span>Next Bus</div>
    <div style={{fontSize:10.5,color:"var(--t2)"}}><span style={{display:"block",fontSize:12.5,fontWeight:700,color:"var(--t1)",marginBottom:1}}>{r.buses}</span>Buses</div>
  </div>
  <div style={{display:"flex",gap:7,marginTop:10}}>
    <button className="sbtn" style={{flex:1,fontSize:10.5,padding:"6px 0"}} onClick={e=>{e.stopPropagation();nav("Live Map")}}>📍 Track</button>
    <button style={{flex:1,padding:"6px 0",borderRadius:"var(--r2)",background:"rgba(99,102,241,.14)",border:"1px solid rgba(99,102,241,.28)",color:"var(--a2)",fontSize:10.5,fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();nav("Payment")}}>🎫 Ticket</button>
  </div>
</div>


return(<>
<style>{CSS}</style>
<div style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>

{/* TOAST */}
{toast&&<div className="toast" onClick={()=>setToast("")}>{toast}</div>}

{/* BUS MODAL */}
{busModal&&<div className="modal-bg" onClick={()=>setBusModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
  <div className="mx" onClick={()=>setBusModal(null)}>✕</div>
  <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:18}}>
    <div style={{width:44,height:44,borderRadius:"50%",background:busModal.status==="On Time"?"rgba(16,185,129,.2)":"rgba(239,68,68,.2)",border:`2px solid ${busModal.status==="On Time"?"var(--gr)":"var(--rd)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🚌</div>
    <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800}}>{busModal.id}</div><div style={{fontSize:11,color:"var(--t2)"}}>Route {busModal.route} · {busModal.city}</div></div>
    <span className={`sb ${busModal.status==="On Time"?"sb-ok":"sb-late"}`} style={{marginLeft:"auto"}}>● {busModal.status}{busModal.delay>0?` +${busModal.delay}m`:""}</span>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:15}}>
    {[["Driver",busModal.driver],["Conductor",busModal.conductor],["Speed",`${busModal.speed} km/h`],["Occupancy",`${busModal.occupancy}%`],["At Stop",busModal.stop],["Next Stop",busModal.next],["Fuel",busModal.fuel+(busModal.battery?` · ${busModal.battery}%🔋`:"")],["Rating",`★ ${busModal.rating}`]].map(([l,v])=>(
      <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:7,padding:"9px 11px"}}>
        <div style={{fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{l}</div>
        <div style={{fontSize:12,fontWeight:600,wordBreak:"break-all"}}>{v}</div>
      </div>
    ))}
  </div>
  <div style={{display:"flex",gap:8}}>
    <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>{setBusModal(null);nav("Live Map")}}>📍 Track on Map</button>
    <button className="sbtn" style={{fontSize:12}} onClick={()=>{setBusModal(null);setToast("📤 Location copied to clipboard!")}}>📤 Share</button>
  </div>
</div></div>}

{/* ROUTE MODAL */}
{routeModal&&<div className="modal-bg" onClick={()=>setRouteModal(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
  <div className="mx" onClick={()=>setRouteModal(null)}>✕</div>
  <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:16}}>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800,color:"var(--a2)"}}>Route {routeModal.no}</div>
    <span className={`badge ${bType(routeModal.type)}`}>{routeModal.type}</span>
    {routeModal.source&&<span style={{fontSize:9,color:"var(--gr)",fontWeight:700}}>✅ {routeModal.source}</span>}
    <span style={{marginLeft:"auto",fontSize:11,color:"var(--t3)"}}>{routeModal.city}</span>
  </div>
  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:16}}>
    <div style={{width:7,height:7,borderRadius:"50%",background:"var(--a)",flexShrink:0}}/><span style={{fontSize:13,fontWeight:600}}>{routeModal.from}</span>
    <div style={{flex:1,height:1,background:"var(--b2)"}}/><div style={{width:7,height:7,borderRadius:"50%",border:"2px solid var(--a)",flexShrink:0}}/>
    <span style={{fontSize:13,fontWeight:600}}>{routeModal.to}</span>
  </div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
    {[["Duration",routeModal.dur],["Fare",routeModal.fare],["Next Bus",routeModal.next],["Buses",routeModal.buses],["Stops",routeModal.stops],["Distance",routeModal.distance],["Frequency",routeModal.freq]].map(([l,v])=>(
      <div key={l} style={{background:"rgba(255,255,255,.03)",borderRadius:7,padding:"9px 10px"}}>
        <div style={{fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{l}</div>
        <div style={{fontSize:12,fontWeight:700}}>{v}</div>
      </div>
    ))}
  </div>
  <div style={{display:"flex",gap:8}}>
    <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>{nav("Live Map");setRouteModal(null)}}>📍 Track Live</button>
    <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12,background:"var(--gr)"}} onClick={()=>{nav("Payment");setRouteModal(null)}}>🎫 Buy Ticket</button>
    <button className="sbtn" style={{fontSize:12}} onClick={()=>{setRouteModal(null);setToast("⭐ Route saved to Favourites!")}}>⭐</button>
  </div>
</div></div>}

{/* SHARE MODAL */}
{shareMsg&&<div className="modal-bg" onClick={()=>setShareMsg("")}><div className="modal" style={{maxWidth:380}} onClick={e=>e.stopPropagation()}>
  <div className="mx" onClick={()=>setShareMsg("")}>✕</div>
  <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:11}}>📤 Share Journey</div>
  <div style={{background:"rgba(255,255,255,.05)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"11px 13px",fontSize:12.5,color:"var(--t2)",marginBottom:13,lineHeight:1.7}}>{shareMsg}</div>
  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    {["📱 WhatsApp","📧 Email","📋 Copy","🔗 More"].map(s=><button key={s} className="sbtn" style={{fontSize:11}} onClick={()=>{setShareMsg("");setToast(`${s.split(" ")[1]} shared!`)}}>{s}</button>)}
  </div>
</div></div>}

{/* SIGN IN MODAL */}
{signModal&&<div className="modal-bg" onClick={resetSign}><div className="modal" style={{maxWidth:440}} onClick={e=>e.stopPropagation()}>
  <div className="mx" onClick={resetSign}>✕</div>
  {signDone?(<div style={{textAlign:"center",padding:"18px 8px"}}>
    <div style={{width:72,height:72,borderRadius:"50%",background:signRole==="admin"?"rgba(99,102,241,.15)":"rgba(16,185,129,.15)",border:`2px solid ${signRole==="admin"?"var(--a)":"var(--gr)"}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:32,animation:"pop .4s ease"}}>{signRole==="admin"?"⚙️":"✅"}</div>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:19,fontWeight:800,marginBottom:5}}>{signTab==="login"?"Welcome Back!":"Account Created!"}</div>
    <div style={{color:"var(--t2)",fontSize:12.5,marginBottom:18}}>Signed in as <strong style={{color:signRole==="admin"?"var(--a2)":"var(--gr)"}}>{signRole==="admin"?"City Admin 🏙️":"Passenger 🚌"}</strong><br/>Welcome, <strong style={{color:"var(--a2)"}}>{signName||signEmail.split("@")[0]||signPhone2||"Traveller"}</strong>!</div>
    <button className="pbtn" onClick={()=>{resetSign();signRole==="admin"?nav("Admin"):nav("Passenger")}}>{signRole==="admin"?"⚙️ Go to Admin Dashboard":"📊 Go to My Dashboard"}</button>
  </div>):(<>
    {/* Role selector */}
    <div style={{marginBottom:18}}>
      <div style={{fontSize:10.5,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:"var(--t3)",marginBottom:9}}>I am a</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9}}>
        {[{r:"passenger",ico:"🚌",t:"Passenger",s:"Book tickets & track buses"},{r:"admin",ico:"⚙️",t:"City Admin",s:"Manage fleet & routes"}].map(({r,ico,t,s})=>(
          <div key={r} onClick={()=>{setSignRole(r);setSignErr("");setAdminCode("")}} style={{padding:"13px 11px",borderRadius:"var(--r2)",border:`2px solid ${signRole===r?(r==="admin"?"var(--a)":"var(--gr)"):"var(--b1)"}`,background:signRole===r?(r==="admin"?"rgba(99,102,241,.1)":"rgba(16,185,129,.1)"):"var(--g1)",cursor:"pointer",textAlign:"center",transition:"all .2s"}}>
            <div style={{fontSize:26,marginBottom:5}}>{ico}</div>
            <div style={{fontSize:12.5,fontWeight:800,color:signRole===r?(r==="admin"?"var(--a2)":"var(--gr)"):"var(--t1)",marginBottom:2}}>{t}</div>
            <div style={{fontSize:10,color:"var(--t3)"}}>{s}</div>
          </div>
        ))}
      </div>
    </div>
    {/* Login/Register tabs */}
    <div style={{display:"flex",marginBottom:16,background:"var(--g1)",borderRadius:"var(--r2)",border:"1px solid var(--b1)",overflow:"hidden"}}>
      {["login","register"].map(t=><button key={t} onClick={()=>{setSignTab(t);setSignErr("");setSignMethod("password");setOtpSent(false)}} style={{flex:1,padding:"9px 0",border:"none",background:signTab===t?"var(--grad, #6366f1)":"transparent",backgroundImage:signTab===t?"linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899)":"none",color:signTab===t?"#fff":"var(--t2)",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"'Inter',sans-serif"}}>{t==="login"?"Sign In":"Register"}</button>)}
    </div>
    {/* Method selector */}
    {signMethod==="password"&&<>
      <div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",marginBottom:8,textAlign:"center",letterSpacing:".05em",textTransform:"uppercase"}}>Continue with</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:15}}>
        {[{m:"google",ico:"🔵",l:"Google"},{m:"apple",ico:"🍎",l:"Apple"},{m:"otp",ico:"📱",l:"OTP/SMS"}].map(({m,ico,l})=>(
          <button key={m} onClick={()=>{setSignMethod(m);setSignErr("");setOtpSent(false)}} style={{padding:"10px 4px",borderRadius:"var(--r2)",background:"var(--g1)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:18}}>{ico}</span>{l}
          </button>
        ))}
      </div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:12}}>Email & Password</div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:13}}>
        {signTab==="register"&&<input className="inp" placeholder="Full Name *" value={signName} onChange={e=>setSignName(e.target.value)}/>}
        <input className="inp" type="email" placeholder="Email address *" value={signEmail} onChange={e=>setSignEmail(e.target.value)}/>
        {signTab==="register"&&<input className="inp" placeholder="Mobile (10 digits)" maxLength={10} value={signPhone2} onChange={e=>setSignPhone2(e.target.value.replace(/\D/g,""))}/>}
        <input className="inp" type="password" placeholder="Password (min 6 chars) *" value={signPass2} onChange={e=>setSignPass2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSign()}/>
        {signRole==="admin"&&signTab==="register"&&<div><input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/><div style={{fontSize:10,color:"var(--t3)",marginTop:4}}>Contact TransitOne support for your Access Code.</div></div>}
      </div>
      {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"8px 12px",fontSize:12,color:"var(--rd)",marginBottom:11}}>⚠️ {signErr}</div>}
      <button className="pbtn" onClick={handleSign} disabled={signBusy}>{signBusy?<span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><span style={{display:"inline-flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:5,height:5,borderRadius:"50%",background:"#fff",display:"inline-block",animation:`ld .7s ${i*.12}s infinite`}}/>)}</span>Please wait…</span>:signTab==="login"?"Sign In →":"Create Account →"}</button>
      <div style={{textAlign:"center",marginTop:10,fontSize:11.5,color:"var(--t3)"}}>{signTab==="login"?<>No account? <span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={()=>setSignTab("register")}>Register →</span></>:<>Have account? <span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={()=>setSignTab("login")}>Sign In →</span></>}</div>
    </>}
    {/* Google flow */}
    {signMethod==="google"&&<div style={{textAlign:"center",padding:"14px 0"}}>
      <div style={{fontSize:44,marginBottom:12}}>🔵</div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:7}}>Continue with Google</div>
      <div style={{fontSize:12,color:"var(--t2)",marginBottom:18}}>Role: <strong style={{color:signRole==="admin"?"var(--a2)":"var(--gr)"}}>{signRole==="admin"?"City Admin":"Passenger"}</strong></div>
      {signRole==="admin"&&signTab==="register"&&<div style={{marginBottom:12}}><input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/></div>}
      {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"8px 12px",fontSize:12,color:"var(--rd)",marginBottom:11,textAlign:"left"}}>⚠️ {signErr}</div>}
      <button className="pbtn" disabled={signBusy} style={{background:"#4285f4",marginBottom:9}} onClick={async()=>{if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return}setSignBusy(true);await new Promise(r=>setTimeout(r,1400));setSignBusy(false);setSignName("Google User");setSignDone(true)}}>{signBusy?"Connecting…":"🔵 Continue with Google"}</button>
      <button className="sbtn" style={{width:"100%",fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("")}}>← Back</button>
    </div>}
    {/* Apple flow */}
    {signMethod==="apple"&&<div style={{textAlign:"center",padding:"14px 0"}}>
      <div style={{fontSize:44,marginBottom:12}}>🍎</div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:7}}>Continue with Apple</div>
      <div style={{fontSize:12,color:"var(--t2)",marginBottom:18}}>Role: <strong style={{color:signRole==="admin"?"var(--a2)":"var(--gr)"}}>{signRole==="admin"?"City Admin":"Passenger"}</strong></div>
      {signRole==="admin"&&signTab==="register"&&<div style={{marginBottom:12}}><input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/></div>}
      {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"8px 12px",fontSize:12,color:"var(--rd)",marginBottom:11,textAlign:"left"}}>⚠️ {signErr}</div>}
      <button className="pbtn" disabled={signBusy} style={{background:"#1c1c1e",border:"1px solid rgba(255,255,255,.3)",marginBottom:9}} onClick={async()=>{if(signRole==="admin"&&signTab==="register"&&adminCode.trim()!=="ADMIN2026"){setSignErr("Invalid Admin Access Code.");return}setSignBusy(true);await new Promise(r=>setTimeout(r,1400));setSignBusy(false);setSignName("Apple User");setSignDone(true)}}>{signBusy?"Connecting…":"🍎 Continue with Apple"}</button>
      <button className="sbtn" style={{width:"100%",fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("")}}>← Back</button>
    </div>}
    {/* OTP flow */}
    {signMethod==="otp"&&<div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:6}}>{!otpSent?"📱 Enter Mobile Number":"🔢 Enter OTP"}</div>
      <div style={{fontSize:12,color:"var(--t2)",marginBottom:14}}>{!otpSent?<>We'll send a 6-digit OTP. Role: <strong style={{color:signRole==="admin"?"var(--a2)":"var(--gr)"}}>{signRole==="admin"?"City Admin":"Passenger"}</strong></>:<>OTP sent to <strong>+91 {signPhone2}</strong></>}</div>
      {!otpSent?<>
        {signRole==="admin"&&signTab==="register"&&<div style={{marginBottom:10}}><input className="inp" placeholder="Admin Access Code *" value={adminCode} onChange={e=>setAdminCode(e.target.value)}/></div>}
        <div style={{position:"relative",marginBottom:13}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:12.5,color:"var(--t2)",fontWeight:600,pointerEvents:"none"}}>+91</span><input className="inp" style={{paddingLeft:42}} placeholder="10-digit mobile" maxLength={10} value={signPhone2} onChange={e=>setSignPhone2(e.target.value.replace(/\D/g,""))}/></div>
        {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"8px 12px",fontSize:12,color:"var(--rd)",marginBottom:11}}>⚠️ {signErr}</div>}
        <button className="pbtn" onClick={handleSendOtp} disabled={signBusy}>{signBusy?"Sending OTP…":"Send OTP →"}</button>
      </>:<>
        <div style={{display:"flex",gap:7,justifyContent:"center",marginBottom:14}}>
          {[0,1,2,3,4,5].map(i=><input key={i} maxLength={1} value={signOtp[i]||""} onChange={e=>{const v=e.target.value.replace(/\D/g,"");const a=signOtp.split("");a[i]=v;setSignOtp(a.join("").slice(0,6));if(v&&e.target.nextSibling)e.target.nextSibling.focus()}} className="otp-box"/>)}
        </div>
        <div style={{textAlign:"center",fontSize:12,color:"var(--t3)",marginBottom:13}}>{otpTimer>0?<>Resend in <strong style={{color:"var(--am)"}}>{otpTimer}s</strong></>:<span style={{color:"var(--a2)",cursor:"pointer",fontWeight:600}} onClick={handleSendOtp}>Resend OTP →</span>}</div>
        {signErr&&<div style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"8px 12px",fontSize:12,color:"var(--rd)",marginBottom:11}}>⚠️ {signErr}</div>}
        <button className="pbtn" onClick={handleVerifyOtp} disabled={signBusy||signOtp.length<6}>{signBusy?"Verifying…":"✅ Verify & Sign In"}</button>
        <button className="sbtn" style={{width:"100%",marginTop:8,fontSize:12}} onClick={()=>{setOtpSent(false);setSignOtp("")}}>← Change Number</button>
      </>}
      <button className="sbtn" style={{width:"100%",marginTop:8,fontSize:12}} onClick={()=>{setSignMethod("password");setSignErr("");setOtpSent(false)}}>← Other Options</button>
    </div>}
  </>)}
</div></div>}

{/* NAV */}
<nav className="nav">
  <div className="logo" onClick={()=>nav("Home")}><div className="logo-ico">🚌</div><div><div className="logo-nm">TransitOne</div><div style={{fontSize:8,color:"var(--t3)",letterSpacing:".07em",textTransform:"uppercase"}}>India Smart Transit</div></div></div>
  <div className="ntabs">{TABS.map(t=><button key={t} className={`nt ${tab===t?"on":""}`} onClick={()=>nav(t)}>{t}</button>)}</div>
  <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
    <select className="inp" style={{maxWidth:120,fontSize:11,padding:"4px 8px",cursor:"pointer"}} value={city} onChange={e=>setCity(e.target.value)}>
      <option>All Cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}
    </select>
    <div style={{position:"relative"}}>
      <div className="nib" onClick={()=>setNotifOpen(o=>!o)}>🔔<span className="ndot"/></div>
      {notifOpen&&<div className="np">
        <div style={{padding:"11px 14px",borderBottom:"1px solid var(--b1)",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12.5,fontWeight:700}}><span>Notifications</span><span style={{fontSize:10,color:"var(--a2)",cursor:"pointer"}} onClick={()=>setNotifOpen(false)}>Mark all read ✓</span></div>
        {NOTIFS.map((n,i)=><div key={i} className="npi"><div style={{display:"flex",gap:8,alignItems:"flex-start"}}>{n.unread&&<div style={{width:6,height:6,borderRadius:"50%",background:"var(--a)",flexShrink:0,marginTop:4}}/>}<span>{n.ico}</span><div><div style={{lineHeight:1.5}}>{n.text}</div><div style={{fontSize:9.5,color:"var(--t3)",marginTop:2}}>{n.time}</div></div></div></div>)}
      </div>}
    </div>
    <button className="nsign" onClick={()=>setSignModal(true)}>Sign In</button>
  </div>
</nav>

{/* TICKER */}
<div className="ticker"><span className="tlive">LIVE</span>{TICKER[ticker%TICKER.length]}</div>

<main style={{flex:1}}>
{/* ═══ HOME ═══ */}
{tab==="Home"&&<>
<div className="hero">
  <div className="hbg"/><div className="hgrid"/>
  <div className="hbadge"><span className="pulse"/>India's Smart Transit OS · 127 Cities · 2.4M Daily Riders</div>
  <h1 className="ht">One Platform.<br/><span className="gt">Every Bus. Every City.</span></h1>
  <p className="hs">AI-powered public transportation for India. Real-time GPS tracking, smart journey planning, and digital ticketing — across every city, every route.</p>
  <div className="scard">
    <div className="irow">
      <select className="inp" value={from} onChange={e=>setFrom(e.target.value)}>
        <option value="">📍 From — select stop…</option>
        {Object.entries(CITY_STOPS).map(([cn,stops])=><optgroup key={cn} label={`${CITY_ICONS[cn]||"🏙️"} ${cn}`}>{stops.map(s=><option key={s} value={s}>{s}</option>)}</optgroup>)}
      </select>
      <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
        <option value="">🎯 To — destination…</option>
        {Object.entries(CITY_STOPS).map(([cn,stops])=><optgroup key={cn} label={`${CITY_ICONS[cn]||"🏙️"} ${cn}`}>{stops.filter(s=>s!==from).map(s=><option key={s} value={s}>{s}</option>)}</optgroup>)}
      </select>
    </div>
    <button className="pbtn" disabled={!from||!to} onClick={()=>{nav("Journey");doPlan()}}>🧭 Plan My Journey with AI</button>
  </div>
  <div style={{display:"flex",gap:9,flexWrap:"wrap",justifyContent:"center",marginTop:14}}>
    {[["🗺️ Live Map","Live Map"],["🚌 Routes","Routes"],["🔍 Search","Search"],["🎫 My Pass","Passenger"],["🏙️ Cities","Cities"]].map(([l,t])=><button key={t} className="sbtn" onClick={()=>nav(t)}>{l}</button>)}
  </div>
</div>
<div className="sec" style={{paddingTop:0}}>
  <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:32}}>
    {[{ico:"🏙️",v:"127",l:"Cities Live",c:"var(--a)"},{ico:"🚌",v:"84,320",l:"Active Buses",c:"var(--gr)"},{ico:"👥",v:"2.4M",l:"Daily Riders",c:"var(--am)"},{ico:"🗺️",v:"12,800+",l:"Routes",c:"var(--pk)"}].map((s,i)=>(
      <div key={i} className="sc">
        <div style={{fontSize:24,marginBottom:7}}>{s.ico}</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:26,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div>
        <div style={{fontSize:10.5,color:"var(--t3)",fontWeight:600,letterSpacing:".06em",textTransform:"uppercase"}}>{s.l}</div>
      </div>
    ))}
  </div>
  <div className="abar"><span>🚨</span><div><strong>Alert:</strong> CT-102 Surat rerouted via Laskana — road work till 6 PM. Delay: 8 min.</div></div>
  <div className="abar warn"><span>🌧️</span><div><strong>Weather:</strong> Heavy rain Mumbai — BEST-1 & BEST-2 running 5–10 min late.</div></div>
  <div className="sh" style={{marginTop:24}}><div className="ey">Popular Routes</div><div className="st">Most Travelled Today</div><div className="ss">Live status on real routes from Sitilink, DTC, BMTC, BEST and more</div></div>
  <div className="rgrid">{ROUTES.slice(0,6).map(r=><RC key={r.id} r={r} onClick={()=>setRouteModal(r)}/>)}</div>
  <div className="sh" style={{marginTop:36}}><div className="ey">Powered by AI</div><div className="st">Intelligence in Every Journey</div></div>
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))",gap:12}}>
    {[{ico:"🧠",t:"AI Journey Planner",d:"Optimal routes via real-time traffic, weather & crowd data",tag:"94% accuracy"},{ico:"⏱️",t:"Delay Prediction",d:"ML models forecast delays 30 min ahead with push alerts",tag:"30 min forecast"},{ico:"👥",t:"Crowd Intelligence",d:"Know bus occupancy before you leave home",tag:"Live crowding"},{ico:"🔧",t:"Predictive Maintenance",d:"IoT sensor analysis prevents breakdowns before they happen",tag:"IoT sensors"},{ico:"🗺️",t:"Dynamic Rerouting",d:"AI reroutes buses during traffic, accidents or bad weather",tag:"Real-time"},{ico:"🤖",t:"AI Chat",d:"24/7 assistant in 10 Indian languages for routes & fares",tag:"10 languages"}].map((f,i)=>(
      <div key={i} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",padding:"19px",transition:"all .28s"}} className="card">
        <div style={{fontSize:28,marginBottom:10}}>{f.ico}</div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{f.t}</div>
        <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.65,marginBottom:8}}>{f.d}</div>
        <span style={{display:"inline-block",padding:"2px 8px",borderRadius:4,fontSize:9.5,fontWeight:700,background:"rgba(99,102,241,.14)",color:"var(--a2)"}}>{f.tag}</span>
      </div>
    ))}
  </div>
  <div style={{marginTop:32,background:"linear-gradient(135deg,rgba(99,102,241,.12),rgba(236,72,153,.08))",border:"1px solid rgba(99,102,241,.22)",borderRadius:"var(--r)",padding:"32px 26px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:20}}>
    <div>
      <div className="ey">Mobile App</div>
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:"clamp(18px,3vw,28px)",fontWeight:800,marginBottom:9,lineHeight:1.2}}>Track. Pay. Travel.<br/>All from Your Phone.</div>
      <div style={{color:"var(--t2)",fontSize:12.5,marginBottom:18,lineHeight:1.75}}>PWA + Native apps · Offline mode · Push alerts · Works on 2G</div>
      <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
        {[["🍎","App Store","#000"],["🤖","Play Store","#1a2035"],["🌐","Web App","transparent"]].map(([ico,l,bg])=>(
          <button key={l} onClick={()=>setToast(`${l} — Coming Soon! Launching Q3 2026.`)} style={{padding:"8px 16px",borderRadius:9,background:bg,border:"1px solid rgba(255,255,255,.15)",color:"#fff",fontSize:11.5,fontWeight:700,cursor:"pointer"}}>{ico} {l}</button>
        ))}
      </div>
    </div>
    <div style={{fontSize:72,filter:"drop-shadow(0 0 36px rgba(99,102,241,.45))"}}>📱</div>
  </div>
</div>
</>}

{/* ═══ LIVE MAP ═══ */}
{tab==="Live Map"&&<div className="sec">
  <div className="sh"><div className="ey">Live Tracking</div><div className="st">Real-Time Fleet Map</div><div className="ss">Every active bus updated every 5 seconds. Click a bus for full details.</div></div>
  <div style={{display:"flex",gap:8,marginBottom:13,flexWrap:"wrap"}}>
    {["All","On Time","Delayed","Electric","CNG"].map(f=><button key={f} onClick={()=>setMapFilter(f)} style={{padding:"5px 12px",borderRadius:100,background:mapFilter===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${mapFilter===f?"var(--a)":"var(--b1)"}`,color:mapFilter===f?"var(--a2)":"var(--t2)",fontSize:11,cursor:"pointer"}}>{f}</button>)}
  </div>
  <div style={{background:"var(--bg2)",border:"1px solid var(--b1)",borderRadius:"var(--r)",overflow:"hidden"}}>
    <div className="mcanv">
      <div className="mgrid"/>
      {[12,28,44,60,76].map(p=><div key={`h${p}`} style={{position:"absolute",height:2,top:`${p}%`,left:0,right:0,background:"rgba(255,255,255,.055)"}}/>)}
      {[16,32,48,64,80].map(p=><div key={`v${p}`} style={{position:"absolute",width:2,left:`${p}%`,top:0,bottom:0,background:"rgba(255,255,255,.055)"}}/>)}
      {[{nm:"Mumbai",x:22,y:57},{nm:"Delhi",x:48,y:23},{nm:"Bangalore",x:42,y:76},{nm:"Surat",x:25,y:43},{nm:"Chennai",x:46,y:80},{nm:"Kolkata",x:68,y:42}].map(c=>(
        <div key={c.nm} style={{position:"absolute",left:`${c.x}%`,top:`${c.y}%`,fontSize:8.5,color:"rgba(255,255,255,.18)",fontWeight:700,pointerEvents:"none"}}>{c.nm}</div>
      ))}
      {busPos.map(b=>(
        <div key={b.id} className="bm" style={{left:`${b.x}%`,top:`${b.y}%`}} onClick={()=>setBusModal(b)}>
          <div className={`bd ${b.status==="On Time"?"bok":"blate"}`}>{b.status==="On Time"?"✓":"!"}</div>
          <div className="bripple" style={{color:b.status==="On Time"?"var(--gr)":"var(--rd)"}}/>
          <div className="blbl">{b.route}</div>
        </div>
      ))}
      <div style={{position:"absolute",top:12,left:12,right:12,display:"flex",justifyContent:"space-between",gap:9,pointerEvents:"none"}}>
        <div style={{background:"rgba(6,7,14,.88)",backdropFilter:"blur(14px)",border:"1px solid var(--b1)",borderRadius:9,padding:"7px 11px",pointerEvents:"all"}}>
          <div style={{fontSize:11.5,fontWeight:700,marginBottom:2}}>🗺️ {city==="All Cities"?"All India":city}</div>
          <div style={{fontSize:10,color:"var(--t3)"}}>{busPos.length} vehicles · Live</div>
        </div>
        <div style={{background:"rgba(6,7,14,.88)",backdropFilter:"blur(14px)",border:"1px solid var(--b1)",borderRadius:9,padding:"7px 11px",display:"flex",gap:10,alignItems:"center",pointerEvents:"all"}}>
          {[["var(--gr)","On Time"],["var(--rd)","Delayed"],["var(--am)","Maintenance"]].map(([c,l])=><div key={l} style={{display:"flex",alignItems:"center",gap:4,fontSize:10,color:"var(--t2)"}}><div style={{width:7,height:7,borderRadius:"50%",background:c}}/>{l}</div>)}
        </div>
      </div>
      {selBus&&<div style={{position:"absolute",bottom:12,left:12,right:12,background:"rgba(6,7,14,.92)",backdropFilter:"blur(18px)",border:"1px solid var(--b2)",borderRadius:12,padding:13,display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:9}}>
        {[["Vehicle",selBus.id],["Driver",selBus.driver],["Speed",`${selBus.speed}km/h`],["Occupancy",`${selBus.occupancy}%`],["At Stop",selBus.stop],["Next",selBus.next],["Status",`${selBus.status}${selBus.delay>0?` +${selBus.delay}m`:""}`],["Fuel",selBus.fuel+(selBus.battery?` ${selBus.battery}%🔋`:"")]].map(([l,v])=>(
          <div key={l}><div style={{fontSize:8.5,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:2}}>{l}</div><div style={{fontSize:11.5,fontWeight:700}}>{v}</div></div>
        ))}
      </div>}
    </div>
    <div style={{padding:"11px",borderTop:"1px solid var(--b1)",display:"flex",gap:9,overflowX:"auto",scrollbarWidth:"none"}}>
      {busPos.map(b=><BusChip key={b.id} b={b} sel={selBus?.id===b.id} onClick={()=>setSelBus(selBus?.id===b.id?null:b)}/>)}
    </div>
  </div>
</div>}

{/* ═══ JOURNEY ═══ */}
{tab==="Journey"&&<div className="sec">
  <div className="sh"><div className="ey">AI Journey Planner</div><div className="st">Find Your Best Route</div><div className="ss">Real-time AI analyses thousands of route combinations instantly.</div></div>
  <div className="scard" style={{maxWidth:"100%",marginBottom:18}}>
    <div>
      <div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",marginBottom:8,letterSpacing:".07em",textTransform:"uppercase"}}>Select City</div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:12}}>
        {Object.keys(CITY_STOPS).map(ci=><button key={ci} onClick={()=>{setPlanCity(ci);setFrom("");setTo("");setPlan(null)}} style={{padding:"5px 11px",borderRadius:100,background:planCity===ci?"rgba(99,102,241,.22)":"var(--g1)",border:`1px solid ${planCity===ci?"var(--a)":"var(--b1)"}`,color:planCity===ci?"var(--a2)":"var(--t2)",fontSize:11,cursor:"pointer"}}>{CITY_ICONS[ci]||"🏙️"} {ci}</button>)}
      </div>
    </div>
    <div className="irow">
      <div><div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>📍 From Stop</div>
        <select className="inp" value={from} onChange={e=>setFrom(e.target.value)}>
          <option value="">— Select starting stop —</option>
          {(CITY_STOPS[planCity]||[]).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div><div style={{fontSize:10.5,fontWeight:700,color:"var(--t3)",marginBottom:5,textTransform:"uppercase",letterSpacing:".06em"}}>🎯 To Stop</div>
        <select className="inp" value={to} onChange={e=>setTo(e.target.value)}>
          <option value="">— Select destination —</option>
          {(CITY_STOPS[planCity]||[]).filter(s=>s!==from).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
    <div style={{fontSize:10.5,color:"var(--t3)",textAlign:"center"}}>— or type any stop manually —</div>
    <div className="irow">
      <input className="inp" placeholder="📍 Type stop or landmark…" value={from} onChange={e=>setFrom(e.target.value)}/>
      <input className="inp" placeholder="🎯 Type destination…" value={to} onChange={e=>setTo(e.target.value)}/>
    </div>
    {from&&to&&<div style={{background:"rgba(99,102,241,.08)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",padding:"9px 13px",display:"flex",alignItems:"center",gap:10,fontSize:12.5}}>
      <span style={{color:"var(--gr)",fontWeight:700}}>📍 {from}</span>
      <span style={{color:"var(--t3)",flex:1,textAlign:"center"}}>── {planCity} ──</span>
      <span style={{color:"var(--rd)",fontWeight:700}}>🎯 {to}</span>
    </div>}
    <div className="irow">
      <select className="inp"><option>🚌 All Modes</option><option>🚌 Bus Only</option><option>🚇 Metro+Bus</option><option>❄️ AC Only</option><option>⚡ Electric Only</option></select>
      <select className="inp"><option>♿ Any Access</option><option>♿ Wheelchair</option><option>👩 Women Safety</option><option>👴 Senior Citizen</option></select>
    </div>
    <button className="pbtn" onClick={doPlan} disabled={planning||!from||!to}>{planning?"🧠 Planning…":"🧭 Plan Journey with AI"}</button>
  </div>
  {planning&&<Ld/>}
  {plan&&!plan.error&&<>
    {plan.tip&&<div style={{background:"rgba(99,102,241,.09)",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r2)",padding:"12px 14px",fontSize:12,color:"var(--t2)",display:"flex",gap:9,marginBottom:11}}>🤖 <div><strong>AI Tip:</strong> {plan.tip}</div></div>}
    {plan.crowdAlert&&<div style={{background:"rgba(245,158,11,.09)",border:"1px solid rgba(245,158,11,.22)",borderRadius:"var(--r2)",padding:"10px 13px",fontSize:11.5,color:"var(--am)",display:"flex",gap:8,marginBottom:11}}>⚠️ <div><strong>Crowd Alert:</strong> {plan.crowdAlert}</div></div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:11,marginBottom:13}}>
      {[{k:"fastest",l:"⚡ Fastest",c:"var(--a2)",best:true},{k:"cheapest",l:"💸 Cheapest",c:"var(--gr)"},{k:"leastWalk",l:"🚶 Least Walk",c:"var(--am)"}].map(opt=>plan[opt.k]&&(
        <div key={opt.k} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"14px",cursor:"pointer",position:"relative",overflow:"hidden"}} className="card">
          {opt.best&&<div style={{position:"absolute",top:8,right:8,background:"var(--gr)",color:"#fff",fontSize:8.5,fontWeight:800,padding:"2px 7px",borderRadius:4,letterSpacing:".07em"}}>BEST</div>}
          <div style={{fontSize:9.5,fontWeight:800,letterSpacing:".1em",textTransform:"uppercase",color:opt.c,marginBottom:7}}>{opt.l}</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,marginBottom:4}}>{plan[opt.k].time}</div>
          <div style={{fontSize:12.5,color:"var(--gr)",fontWeight:700,marginBottom:7}}>{plan[opt.k].fare} · {plan[opt.k].walk} walk · {plan[opt.k].transfers} transfers</div>
          <div style={{fontSize:10.5,color:"var(--t3)",fontWeight:600,marginBottom:8}}>{plan[opt.k].mode}</div>
          {(plan[opt.k].steps||[]).map((s,i)=><div key={i} style={{fontSize:11,color:"var(--t2)",lineHeight:1.9}}>▸ {s}</div>)}
        </div>
      ))}
    </div>
    <div style={{display:"flex",gap:9,flexWrap:"wrap"}}>
      <button className="pbtn" style={{maxWidth:220,padding:"10px 0",fontSize:12}} onClick={()=>nav("Payment")}>🎫 Buy Ticket</button>
      <button className="sbtn" style={{fontSize:12}} onClick={()=>setShareMsg(`Journey from ${from} to ${to} · ${plan.fastest?.time} · ${plan.fastest?.fare}`)}>📤 Share</button>
      <button className="sbtn" style={{fontSize:12}} onClick={()=>setPlan(null)}>↩ Again</button>
    </div>
  </>}
  {plan?.error&&<div style={{background:"rgba(239,68,68,.08)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"12px 14px",fontSize:12.5,color:"var(--rd)"}}>⚠️ Could not plan this journey. Try different stops.</div>}
  {planBuses.length>0&&(from||to)&&<div style={{marginTop:28}}>
    <div className="sh" style={{marginBottom:14}}><div className="ey">Live Buses</div><div className="st" style={{fontSize:20}}>Buses in {planCity}</div></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:11}}>
      {planBuses.map(b=><div key={b.id} onClick={()=>setBusModal(b)} style={{background:"var(--g1)",border:`1px solid ${b.status==="On Time"?"rgba(16,185,129,.28)":"rgba(239,68,68,.28)"}`,borderRadius:"var(--r)",padding:14,cursor:"pointer"}} className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
          <div><div style={{fontSize:9,color:"var(--t3)",marginBottom:1,textTransform:"uppercase",letterSpacing:".06em"}}>Route {b.route}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:800,color:"var(--a2)"}}>{b.id}</div></div>
          <span style={{padding:"3px 8px",borderRadius:100,fontSize:9.5,fontWeight:700,background:b.status==="On Time"?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)",color:b.status==="On Time"?"var(--gr)":"var(--rd)"}}>● {b.status}</span>
        </div>
        <div style={{background:"rgba(255,255,255,.03)",borderRadius:"var(--r2)",padding:"8px 10px",marginBottom:9}}>
          <div style={{fontSize:11.5,marginBottom:4}}>📍 <span style={{color:"var(--t2)"}}>Now:</span> <strong>{b.stop}</strong></div>
          <div style={{fontSize:11.5}}>▸ <span style={{color:"var(--t2)"}}>Next:</span> <strong>{b.next}</strong></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5}}>
          {[{l:"Speed",v:`${b.speed}km/h`,c:"var(--t1)"},{l:"Load",v:`${b.occupancy}%`,c:fmtOcc(b.occupancy)},{l:"Fuel",v:b.fuel,c:"var(--t2)"},{l:"Rating",v:`★${b.rating}`,c:"var(--am)"}].map(s=>(
            <div key={s.l} style={{background:"rgba(255,255,255,.03)",borderRadius:5,padding:"5px 4px",textAlign:"center"}}>
              <div style={{fontSize:11,fontWeight:800,color:s.c}}>{s.v}</div>
              <div style={{fontSize:8.5,color:"var(--t3)",marginTop:1}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:7,marginTop:9}}>
          <button className="sbtn" style={{flex:1,fontSize:10.5,padding:"6px 0"}} onClick={e=>{e.stopPropagation();nav("Live Map")}}>📍 Track</button>
          <button style={{flex:1,padding:"6px 0",borderRadius:"var(--r2)",background:"rgba(99,102,241,.14)",border:"1px solid rgba(99,102,241,.28)",color:"var(--a2)",fontSize:10.5,fontWeight:600,cursor:"pointer"}} onClick={e=>{e.stopPropagation();nav("Payment")}}>🎫 Ticket</button>
        </div>
      </div>)}
    </div>
  </div>}
  <div style={{marginTop:32}}>
    <div className="sh"><div className="ey">AI Assistant</div><div className="st" style={{fontSize:20}}>Ask TransitOne AI</div></div>
    <div className="chat">
      <div className="chat-h"><div style={{width:28,height:28,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div><div><div style={{fontSize:12.5,fontWeight:700}}>TransitOne AI</div><div style={{fontSize:10,color:"var(--gr)"}}>● Online</div></div></div>
      <div className="chat-b">
        {chat.map((m,i)=><div key={i} className={`cm ${m.r}`}>{m.t}</div>)}
        {chatBusy&&<div className="cm ai"><Ld/></div>}
        <div ref={chatEnd}/>
      </div>
      <div className="chat-ir">
        <input className="chat-inp" placeholder="Ask about routes, fares, stops…" value={chatMsg} onChange={e=>setChatMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doChat()}/>
        <button style={{padding:"8px 14px",borderRadius:8,background:"linear-gradient(135deg,#6366f1,#ec4899)",border:"none",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={doChat} disabled={chatBusy}>Send</button>
      </div>
    </div>
  </div>
</div>}

{/* ═══ ROUTES ═══ */}
{tab==="Routes"&&<div className="sec">
  <div className="sh"><div className="ey">Route Directory</div><div className="st">All {ROUTES.length} Routes</div><div className="ss">Real data from Sitilink, DTC, BMTC, BEST, TSRTC and more.</div></div>
  <div style={{display:"flex",gap:9,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
    <input className="inp" style={{maxWidth:220}} placeholder="🔍 Search route, stop…" value={rSearch} onChange={e=>setRSearch(e.target.value)}/>
    <select className="inp" style={{maxWidth:150}} value={city} onChange={e=>setCity(e.target.value)}>
      <option>All Cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}
    </select>
    {["All","Electric","AC","CNG"].map(f=><button key={f} onClick={()=>setRFilter(f)} style={{padding:"6px 13px",borderRadius:100,background:rFilter===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${rFilter===f?"var(--a)":"var(--b1)"}`,color:rFilter===f?"var(--a2)":"var(--t2)",fontSize:11,cursor:"pointer"}}>{f}</button>)}
    <span style={{fontSize:11,color:"var(--t3)",marginLeft:"auto"}}>{filtRoutes.length} routes</span>
  </div>
  {filtRoutes.length===0?<div style={{textAlign:"center",padding:"48px",color:"var(--t3)"}}>
    <div style={{fontSize:36,marginBottom:10}}>🔍</div><div style={{fontSize:13,color:"var(--t2)"}}>No routes found</div>
    <button className="sbtn" style={{marginTop:11}} onClick={()=>{setRSearch("");setRFilter("All")}}>Clear filters</button>
  </div>:<div className="rgrid">{filtRoutes.map(r=><RC key={r.id} r={r} onClick={()=>setRouteModal(r)}/>)}</div>}
</div>}

{/* ═══ SCHEDULE ═══ */}
{tab==="Schedule"&&<div className="sec">
  <div className="sh"><div className="ey">Schedule</div><div className="st">Live Timetable</div><div className="ss">Real Sitilink BRTS timetable. Select any route to view departures.</div></div>
  <div style={{display:"flex",gap:9,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
    <select className="inp" style={{maxWidth:280}} value={city} onChange={e=>{setCity(e.target.value)}}>
      <option>All Cities</option>{CITIES.map(c=><option key={c}>{c}</option>)}
    </select>
    <select className="inp" style={{maxWidth:200}}>
      <option>Today</option><option>Tomorrow</option><option>This Week</option>
    </select>
    <select className="inp" style={{maxWidth:180}}>
      <option>All Directions</option><option>Outbound</option><option>Inbound</option>
    </select>
  </div>
  <div className="abar info"><span>🕐</span><div><strong>BRTS-1 (Sitilink verified):</strong> Udhna Darwaja → Sachin GIDC Naka · Every 4 min · Electric fleet</div></div>
  <div className="sch-g">
    <div className="sch-row sch-hdr"><div>Departure</div><div>From</div><div>To</div><div>Duration</div><div>Status</div></div>
    {TIMETABLE.map((t,i)=><div key={i} className="sch-row">
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontWeight:800,fontSize:14,color:"var(--a2)"}}>{t.time}</div>
      <div style={{fontSize:11.5}}>{t.from}</div>
      <div style={{fontSize:11.5}}>{t.to}</div>
      <div style={{fontSize:11.5,color:"var(--t2)"}}>{t.dur}</div>
      <div>
        <span className={`sb ${t.status==="Departed"?"sb-ok":t.status.includes("Running")?"sb-prog":t.status==="Scheduled"?"sb-lo":"sb-ok"}`}>● {t.status}</span>
        <div style={{fontSize:9.5,color:"var(--t3)",marginTop:2}}>{t.bus}</div>
      </div>
    </div>)}
  </div>
</div>}

{/* ═══ SEARCH ═══ */}
{tab==="Search"&&<div className="sec">
  <div className="sh"><div className="ey">Smart Search</div><div className="st">Find Anything Instantly</div><div className="ss">Search stops, routes, buses, drivers or landmarks across all cities.</div></div>
  <div style={{position:"relative",marginBottom:20}}>
    <input className="inp" style={{fontSize:15,padding:"14px 50px 14px 16px"}} placeholder="🔍 Search routes, stops, bus IDs, cities…" value={rSearch} onChange={e=>setRSearch(e.target.value)}/>
    <button onClick={()=>setToast("🎙️ Voice search — coming soon!")} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"rgba(99,102,241,.2)",border:"1px solid rgba(99,102,241,.3)",borderRadius:7,padding:"6px 10px",color:"var(--a2)",fontSize:11,cursor:"pointer",fontWeight:700}}>🎙️</button>
  </div>
  {rSearch.length>0&&<>
    {/* Route results */}
    {ROUTES.filter(r=>r.no.toLowerCase().includes(rSearch.toLowerCase())||r.from.toLowerCase().includes(rSearch.toLowerCase())||r.to.toLowerCase().includes(rSearch.toLowerCase())||r.city.toLowerCase().includes(rSearch.toLowerCase())).slice(0,4).map(r=>(
      <div key={r.id} className="card" style={{padding:"12px 15px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>setRouteModal(r)}>
        <div style={{width:36,height:36,borderRadius:9,background:"rgba(99,102,241,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🚌</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:800,color:"var(--a2)",marginBottom:2}}>Route {r.no}</div>
          <div style={{fontSize:11.5,color:"var(--t2)"}}>{r.from} → {r.to} · {r.city} · {r.fare}</div>
        </div>
        <span className={`badge ${bType(r.type)}`}>{r.type}</span>
      </div>
    ))}
    {/* Bus results */}
    {BUSES.filter(b=>b.id.toLowerCase().includes(rSearch.toLowerCase())||b.route.toLowerCase().includes(rSearch.toLowerCase())||b.city.toLowerCase().includes(rSearch.toLowerCase())||b.driver.toLowerCase().includes(rSearch.toLowerCase())).slice(0,3).map(b=>(
      <div key={b.id} className="card" style={{padding:"12px 15px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>setBusModal(b)}>
        <div style={{width:36,height:36,borderRadius:9,background:b.status==="On Time"?"rgba(16,185,129,.15)":"rgba(239,68,68,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🚍</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:800,marginBottom:2}}>{b.id}</div>
          <div style={{fontSize:11.5,color:"var(--t2)"}}>{b.city} · {b.driver} · At: {b.stop}</div>
        </div>
        <span className={`sb ${b.status==="On Time"?"sb-ok":"sb-late"}`}>● {b.status}</span>
      </div>
    ))}
    {/* Stop results */}
    {Object.entries(CITY_STOPS).flatMap(([cn,stops])=>stops.filter(s=>s.toLowerCase().includes(rSearch.toLowerCase())).map(s=>({city:cn,name:s}))).slice(0,4).map((s,i)=>(
      <div key={i} className="card" style={{padding:"12px 15px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12}} onClick={()=>{setFrom(s.name);nav("Journey")}}>
        <div style={{width:36,height:36,borderRadius:9,background:"rgba(16,185,129,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>📍</div>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:2}}>{s.name}</div>
          <div style={{fontSize:11.5,color:"var(--t2)"}}>{CITY_ICONS[s.city]||"🏙️"} {s.city} bus stop</div>
        </div>
        <button style={{padding:"4px 10px",borderRadius:6,background:"rgba(99,102,241,.14)",border:"1px solid rgba(99,102,241,.28)",color:"var(--a2)",fontSize:10.5,cursor:"pointer"}}>Plan →</button>
      </div>
    ))}
    {ROUTES.filter(r=>r.no.toLowerCase().includes(rSearch.toLowerCase())||r.from.toLowerCase().includes(rSearch.toLowerCase())||r.to.toLowerCase().includes(rSearch.toLowerCase())).length===0&&
     BUSES.filter(b=>b.id.toLowerCase().includes(rSearch.toLowerCase())||b.route.toLowerCase().includes(rSearch.toLowerCase())).length===0&&
     Object.entries(CITY_STOPS).flatMap(([cn,stops])=>stops.filter(s=>s.toLowerCase().includes(rSearch.toLowerCase()))).length===0&&
     <div style={{textAlign:"center",padding:"28px",color:"var(--t3)"}}>
       <div style={{fontSize:28,marginBottom:8}}>🔍</div>
       <div style={{fontSize:13,color:"var(--t2)"}}>No results for "{rSearch}"</div>
       <div style={{fontSize:11.5,marginTop:4}}>Try a route number, city name, or stop name</div>
     </div>}
  </>}
  {rSearch.length===0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:11}}>
    {[{ico:"🚌",t:"Routes",d:"All 20 routes",act:()=>nav("Routes")},{ico:"🗺️",t:"Live Map",d:"Track buses now",act:()=>nav("Live Map")},{ico:"⏱️",t:"Schedule",d:"Timetables",act:()=>nav("Schedule")},{ico:"🏙️",t:"Cities",d:"12 cities live",act:()=>nav("Cities")},{ico:"🎫",t:"Buy Pass",d:"Monthly & annual",act:()=>nav("Payment")},{ico:"📊",t:"My Dashboard",d:"Trips & passes",act:()=>nav("Passenger")}].map((c,i)=>(
      <div key={i} onClick={c.act} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",padding:"18px",cursor:"pointer",transition:"all .2s"}} className="card">
        <div style={{fontSize:26,marginBottom:8}}>{c.ico}</div>
        <div style={{fontSize:13,fontWeight:700,marginBottom:3}}>{c.t}</div>
        <div style={{fontSize:11,color:"var(--t3)"}}>{c.d}</div>
      </div>
    ))}
  </div>}
</div>}

{/* ═══ PASSENGER ═══ */}
{tab==="Passenger"&&<div className="sec">
  <div className="sh"><div className="ey">My Account</div><div className="st">Passenger Dashboard</div></div>
  <div className="pl">
    <div className="psb">
      {[["📊","Dashboard"],["🎫","My Pass"],["📱","QR Ticket"],["🗺️","Trip History"],["⭐","Favourites"],["📍","Nearby Stops"],["🔔","Notifications"],["📋","Complaints"],["🚨","SOS & Safety"],["🔍","Lost & Found"]].map(([ico,s])=>(
        <div key={s} className={`an ${passSec===s?"on":""}`} onClick={()=>setPassSec(s)}>{ico} {s}</div>
      ))}
    </div>
    <div className="pm">
      {passSec==="Dashboard"&&<div>
        <div style={{display:"flex",alignItems:"center",gap:13,marginBottom:20,padding:"14px",background:"linear-gradient(135deg,rgba(99,102,241,.12),rgba(236,72,153,.08))",border:"1px solid rgba(99,102,241,.22)",borderRadius:"var(--r)"}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#6366f1,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🧑</div>
          <div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800}}>Traveller</div><div style={{fontSize:11.5,color:"var(--t2)"}}>Member since 2024 · Silver Tier</div><div style={{fontSize:11,color:"var(--a2)",marginTop:2}}>🎟️ Monthly Pass · Active till Jun 30</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
          {[{ico:"🚌",v:"142",l:"Trips This Month",c:"var(--a)"},{ico:"💰",v:"₹280",l:"Saved This Month",c:"var(--gr)"},{ico:"⏱️",v:"38 hrs",l:"Time Saved",c:"var(--am)"},{ico:"🌿",v:"12.4 kg",l:"CO₂ Offset",c:"var(--pk)"}].map((s,i)=>(
            <div key={i} className="kc"><div style={{fontSize:22,marginBottom:5}}>{s.ico}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div><div style={{fontSize:10,color:"var(--t3)"}}>{s.l}</div></div>
          ))}
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:9,textTransform:"uppercase",letterSpacing:".06em"}}>Recent Trips</div>
          {[{r:"BRTS-1",from:"Udhna Darwaja",to:"Sachin GIDC",t:"Today 08:14",fare:"₹15"},{r:"CT-101",from:"Surat Railway Stn",to:"Kapodra",t:"Yesterday 17:42",fare:"₹15"},{r:"DTC-181",from:"Connaught Place",to:"Dwarka Sec 21",t:"Mon 09:30",fare:"₹25"}].map((t,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid var(--b1)"}}>
              <div style={{display:"flex",gap:9,alignItems:"center"}}>
                <div style={{width:32,height:32,borderRadius:8,background:"rgba(99,102,241,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🚌</div>
                <div><div style={{fontSize:12.5,fontWeight:600}}>{t.from} → {t.to}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{t.r} · {t.t}</div></div>
              </div>
              <div style={{fontSize:12.5,fontWeight:700,color:"var(--gr)"}}>{t.fare}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:9}}>
          <button className="pbtn" style={{flex:1,padding:"10px 0",fontSize:12}} onClick={()=>nav("Journey")}>🧭 Plan Journey</button>
          <button className="sbtn" style={{fontSize:12}} onClick={()=>setPassSec("My Pass")}>🎫 My Pass</button>
        </div>
      </div>}

      {passSec==="My Pass"&&<div>
        <div style={{background:"linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)",borderRadius:"var(--r)",padding:"22px",marginBottom:16,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,.07)"}}/>
          <div style={{position:"absolute",bottom:-30,left:20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,.05)"}}/>
          <div style={{fontSize:10,fontWeight:800,letterSpacing:".15em",textTransform:"uppercase",opacity:.7,marginBottom:14}}>TransitOne Monthly Pass</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,marginBottom:4}}>TRANSITONE-2024</div>
          <div style={{opacity:.8,fontSize:12,marginBottom:14}}>Valid: June 1 – June 30, 2026 · All Surat Routes</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div><div style={{fontSize:10,opacity:.7}}>Holder</div><div style={{fontSize:13,fontWeight:700}}>Traveller</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:10,opacity:.7}}>Type</div><div style={{fontSize:13,fontWeight:700}}>Monthly · Unlimited</div></div>
          </div>
        </div>
        <div style={{display:"flex",gap:9,marginBottom:16}}>
          <button className="sbtn" style={{flex:1,fontSize:11}} onClick={()=>setToast("📄 Pass PDF downloading…")}>📄 Download PDF</button>
          <button className="sbtn" style={{flex:1,fontSize:11}} onClick={()=>setShareMsg("Travelling with TransitOne India Monthly Pass — unlimited rides across all Surat routes till June 30, 2026.")}>📤 Share Pass</button>
          <button className="pbtn" style={{flex:1,padding:"8px 0",fontSize:11}} onClick={()=>nav("Payment")}>🔄 Renew</button>
        </div>
        <div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:14}}>
          <div style={{fontSize:11.5,fontWeight:700,marginBottom:9}}>Pass Benefits</div>
          {["✅ Unlimited rides on all Surat Sitilink routes","✅ Priority boarding at BRTS stations","✅ 10% discount on GSRTC inter-city buses","✅ Free Wi-Fi at all BRTS stops","✅ Monthly trip report to email"].map((b,i)=><div key={i} style={{fontSize:11.5,color:"var(--t2)",padding:"5px 0",borderBottom:i<4?"1px solid var(--b1)":"none"}}>{b}</div>)}
        </div>
      </div>}

      {passSec==="QR Ticket"&&<div style={{textAlign:"center"}}>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:14}}>Your QR Boarding Pass</div>
        <div style={{display:"inline-flex",background:"#fff",borderRadius:14,padding:16,marginBottom:14}}>
          <svg width="160" height="160" viewBox="0 0 140 140">
            {Array.from({length:14},(_,row)=>Array.from({length:14},(_,col)=>{const f=(row+col*3+row*col+row*7)%4===0;return f?<rect key={`${row}-${col}`} x={col*10} y={row*10} width={10} height={10} fill="#111"/>:null}))}
            <rect x="0" y="0" width="40" height="40" fill="#111"/><rect x="5" y="5" width="30" height="30" fill="white"/><rect x="10" y="10" width="20" height="20" fill="#111"/>
            <rect x="100" y="0" width="40" height="40" fill="#111"/><rect x="105" y="5" width="30" height="30" fill="white"/><rect x="110" y="10" width="20" height="20" fill="#111"/>
            <rect x="0" y="100" width="40" height="40" fill="#111"/><rect x="5" y="105" width="30" height="30" fill="white"/><rect x="10" y="110" width="20" height="20" fill="#111"/>
            <circle cx="70" cy="70" r="14" fill="white" stroke="#111" strokeWidth="2"/>
            <text x="70" y="74" textAnchor="middle" fill="#6366f1" fontSize="9" fontWeight="bold">T1</text>
          </svg>
        </div>
        <div style={{fontSize:11,color:"var(--t3)",marginBottom:5}}>Scan at boarding gate · Valid today only</div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800,marginBottom:2}}>TRANSIT-2026-001</div>
        <div style={{fontSize:12,color:"var(--t2)",marginBottom:16}}>Monthly Pass · All Surat Routes · Jun 1–30</div>
        <div style={{display:"flex",gap:9,justifyContent:"center"}}>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("📲 QR saved to gallery!")}>Save QR</button>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("🔄 New QR generated!")}>Refresh</button>
        </div>
      </div>}

      {passSec==="Trip History"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:14,fontWeight:700}}>Trip History</div>
          <div style={{display:"flex",gap:7}}>
            {["This Month","Last Month"].map(p=><button key={p} onClick={()=>setToast(`📊 Showing: ${p}`)} style={{padding:"4px 10px",borderRadius:6,background:"var(--g1)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:10,cursor:"pointer"}}>{p}</button>)}
          </div>
        </div>
        {[{r:"BRTS-1",fr:"Udhna Darwaja",to:"Sachin GIDC Naka",t:"Today, 08:14",fare:"₹15",bus:"SL-EV-0101",dur:"33 min"},{r:"CT-101",fr:"Surat Rly Stn",to:"Kapodra",t:"Yesterday, 17:42",fare:"₹15",bus:"SL-CT-1011",dur:"38 min"},{r:"DTC-181",fr:"Connaught Place",to:"Dwarka Sec 21",t:"Mon 09:30",fare:"₹25",bus:"DTC-EV-1811",dur:"58 min"},{r:"BMTC-500C",fr:"Majestic",to:"Airport",t:"Sun 05:45",fare:"₹35",bus:"BMTC-AC-500C",dur:"71 min"},{r:"BEST-1",fr:"Colaba Depot",to:"CST Mumbai",t:"Sat 08:00",fare:"₹15",bus:"BEST-EV-0011",dur:"24 min"}].map((t,i)=>(
          <div key={i} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"12px 13px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                <div style={{width:32,height:32,borderRadius:8,background:"rgba(99,102,241,.14)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🚌</div>
                <div><div style={{fontSize:12.5,fontWeight:700}}>Route {t.r}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{t.t} · {t.dur} · {t.bus}</div></div>
              </div>
              <div style={{fontWeight:700,color:"var(--gr)",fontSize:13}}>{t.fare}</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:7,fontSize:11.5,color:"var(--t2)"}}>
              <span>📍 {t.fr}</span><span style={{color:"var(--b2)"}}>→</span><span>🎯 {t.to}</span>
            </div>
          </div>
        ))}
        <button className="sbtn" style={{width:"100%",fontSize:11,marginTop:4}} onClick={()=>setToast("📊 CSV export downloading…")}>📊 Export CSV</button>
      </div>}

      {passSec==="Favourites"&&<div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:13}}>Saved Routes & Stops</div>
        {[{ico:"📍",nm:"Udhna Darwaja BRTS",sub:"Surat · BRTS-1, BRTS-2"},
          {ico:"⭐",nm:"BRTS-1 Full Route",sub:"Udhna Darwaja → Sachin GIDC Naka"},
          {ico:"📍",nm:"Kempegowda Bus Station",sub:"Bangalore · BMTC-500C, BMTC-335E"},
          {ico:"⭐",nm:"DTC-181",sub:"New Delhi Rly → Dwarka Sector 21"}].map((f,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"11px 0",borderBottom:"1px solid var(--b1)"}}>
            <div style={{width:34,height:34,borderRadius:9,background:"rgba(245,158,11,.13)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{f.ico}</div>
            <div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:600}}>{f.nm}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{f.sub}</div></div>
            <div style={{display:"flex",gap:6}}>
              <button style={{padding:"4px 9px",borderRadius:6,background:"rgba(99,102,241,.14)",border:"1px solid rgba(99,102,241,.28)",color:"var(--a2)",fontSize:10.5,cursor:"pointer"}} onClick={()=>{setFrom(f.nm);nav("Journey")}}>Go</button>
              <button style={{padding:"4px 9px",borderRadius:6,background:"var(--g1)",border:"1px solid var(--b1)",color:"var(--rd)",fontSize:10.5,cursor:"pointer"}} onClick={()=>setToast("🗑️ Removed from Favourites.")}>✕</button>
            </div>
          </div>
        ))}
      </div>}

      {passSec==="Nearby Stops"&&<div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>Nearby Bus Stops</div>
        <div style={{fontSize:11.5,color:"var(--t3)",marginBottom:13}}>Based on your last known location · Surat</div>
        {[{nm:"Udhna Darwaja BRTS",dist:"0.2 km",routes:["BRTS-1","BRTS-2"],eta:"4 min"},{nm:"Kapodra BRTS",dist:"0.6 km",routes:["CT-101","CT-104"],eta:"8 min"},{nm:"Katargam BRTS",dist:"1.1 km",routes:["BRTS-1","CT-107"],eta:"12 min"},{nm:"VIP Circle Kapodra",dist:"1.4 km",routes:["BRTS-4","CT-108"],eta:"15 min"}].map((s,i)=>(
          <div key={i} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"12px 13px",marginBottom:9}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontSize:13,fontWeight:700}}>📍 {s.nm}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{s.dist} away · Next bus in {s.eta}</div></div>
              <div style={{textAlign:"right",fontSize:13,fontWeight:800,color:"var(--gr)"}}>{s.eta}</div>
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:9}}>
              {s.routes.map(r=><span key={r} style={{padding:"2px 8px",borderRadius:4,background:"rgba(99,102,241,.14)",color:"var(--a2)",fontSize:10.5,fontWeight:700}}>{r}</span>)}
            </div>
            <div style={{display:"flex",gap:7}}>
              <button className="sbtn" style={{flex:1,fontSize:10.5,padding:"6px 0"}} onClick={()=>setToast("🔔 Arrival alert set! 5 min notice.")}>🔔 Set Alert</button>
              <button className="sbtn" style={{flex:1,fontSize:10.5,padding:"6px 0"}} onClick={()=>setToast("📍 Opening in Maps…")}>📍 Directions</button>
            </div>
          </div>
        ))}
      </div>}

      {passSec==="Notifications"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:14,fontWeight:700}}>Notifications</div>
          <button className="sbtn" style={{fontSize:10.5}} onClick={()=>setToast("✅ All marked as read.")}>Mark All Read</button>
        </div>
        {NOTIFS.map((n,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:"1px solid var(--b1)"}}>
            {n.unread&&<div style={{width:7,height:7,borderRadius:"50%",background:"var(--a)",marginTop:4,flexShrink:0}}/>}
            <span style={{fontSize:20}}>{n.ico}</span>
            <div style={{flex:1}}><div style={{fontSize:12.5,lineHeight:1.6,marginBottom:3}}>{n.text}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>{n.time}</div></div>
          </div>
        ))}
      </div>}

      {passSec==="Complaints"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:14,fontWeight:700}}>My Complaints</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setShowCForm(f=>!f)}>{showCForm?"✕ Cancel":"+ New Complaint"}</button>
        </div>
        {showCForm&&!cSubmitted&&<div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",padding:16,marginBottom:16}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>📋 File a New Complaint</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:13}}>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Complaint Type *</div>
              <select className="inp" value={cType} onChange={e=>setCType(e.target.value)}>
                <option value="">— Select type —</option>
                {["AC Not Working","Overcrowding","Driver Rash Driving","Wrong Fare Charged","Late Arrival","Dirty Bus","Rude Behaviour","Pass Not Accepted","GPS Issue","Accident/Safety","Breakdown","Other"].map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Route *</div>
              <select className="inp" value={cRoute} onChange={e=>setCRoute(e.target.value)}>
                <option value="">— Select route —</option>
                {ROUTES.map(r=><option key={r.id} value={r.no}>{r.no} — {r.from} → {r.to} ({r.city})</option>)}
              </select>
            </div>
            <div className="irow">
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Date</div><input className="inp" type="date"/></div>
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Your Mobile</div><input className="inp" placeholder="+91 XXXXX XXXXX"/></div>
            </div>
            <div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                <span style={{fontSize:11,fontWeight:700,color:"var(--t2)"}}>Description *</span>
                <span style={{fontSize:10,color:cDesc.length>=10?"var(--gr)":"var(--t3)"}}>{cDesc.length}/200</span>
              </div>
              <textarea className="inp" rows={3} placeholder="Describe the issue (min. 10 chars)…" maxLength={200} value={cDesc} onChange={e=>setCDesc(e.target.value)} style={{resize:"vertical"}}/>
            </div>
            {cType&&<div style={{background:["Accident/Safety","Driver Rash Driving","Overcrowding"].includes(cType)?"rgba(239,68,68,.08)":["AC Not Working","Wrong Fare Charged","Breakdown"].includes(cType)?"rgba(245,158,11,.08)":"rgba(16,185,129,.08)",border:`1px solid ${["Accident/Safety","Driver Rash Driving","Overcrowding"].includes(cType)?"rgba(239,68,68,.25)":["AC Not Working","Wrong Fare Charged","Breakdown"].includes(cType)?"rgba(245,158,11,.25)":"rgba(16,185,129,.25)"}`,borderRadius:"var(--r2)",padding:"8px 12px",fontSize:11,display:"flex",gap:7,alignItems:"center"}}>
              <span>{["Accident/Safety","Driver Rash Driving","Overcrowding"].includes(cType)?"🔴 High Priority — review in 2 hrs":["AC Not Working","Wrong Fare Charged","Breakdown"].includes(cType)?"🟡 Medium Priority — review in 24 hrs":"🟢 Standard Priority — review in 48 hrs"}</span>
            </div>}
          </div>
          <button className="pbtn" disabled={!cType||!cRoute||cDesc.length<10} onClick={()=>setCSubmitted(true)}>📤 Submit Complaint</button>
        </div>}
        {cSubmitted&&<div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.25)",borderRadius:"var(--r)",padding:16,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>✅</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:6}}>Complaint Submitted!</div>
          <div style={{fontSize:12,color:"var(--t2)",marginBottom:12}}>Tracking ID: <strong style={{color:"var(--a2)"}}>C-2026-{Date.now().toString().slice(-4)}</strong></div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>{setCSubmitted(false);setShowCForm(false);setCType("");setCRoute("");setCDesc("")}}>File Another</button>
        </div>}
        <div style={{display:"flex",gap:7,marginBottom:13}}>
          {["All","Open","In Progress","Resolved"].map(f=><button key={f} onClick={()=>setComplaintFilter(f)} style={{padding:"4px 10px",borderRadius:100,background:complaintFilter===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${complaintFilter===f?"var(--a)":"var(--b1)"}`,color:complaintFilter===f?"var(--a2)":"var(--t2)",fontSize:10.5,cursor:"pointer"}}>{f}</button>)}
        </div>
        {COMPLAINTS.filter(c=>complaintFilter==="All"||c.status===complaintFilter).map(c=>(
          <div key={c.id} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"12px 13px",marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
              <div><div style={{fontSize:12.5,fontWeight:700}}>{c.type}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>Route {c.route} · {c.city} · {c.date}</div></div>
              <span className={`sb ${c.status==="Resolved"?"sb-ok":c.status==="In Progress"?"sb-prog":"sb-am"}`}>● {c.status}</span>
            </div>
            <div style={{fontSize:11.5,color:"var(--t2)",lineHeight:1.6}}>{c.desc}</div>
          </div>
        ))}
      </div>}

      {passSec==="SOS & Safety"&&<div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:15,fontWeight:800,marginBottom:5}}>🚨 Emergency & Safety</div>
        <div style={{fontSize:12,color:"var(--t2)",marginBottom:16,lineHeight:1.7}}>In danger? Press SOS. Your location and bus details are instantly sent to our emergency team and local police.</div>
        <button onClick={()=>setSos(s=>!s)} style={{width:"100%",padding:"22px",borderRadius:"var(--r)",background:sos?"rgba(239,68,68,.18)":"linear-gradient(135deg,#ef4444,#dc2626)",border:`2px solid ${sos?"var(--rd)":"transparent"}`,color:"#fff",fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,cursor:"pointer",marginBottom:16,letterSpacing:"-.01em",transition:"all .25s",boxShadow:sos?"0 0 0 4px rgba(239,68,68,.3)":"none"}}>
          🆘 {sos?"SOS SENT — Help Coming":"Press for Emergency SOS"}
        </button>
        {sos&&<div style={{background:"rgba(239,68,68,.09)",border:"1px solid rgba(239,68,68,.25)",borderRadius:"var(--r2)",padding:"13px",marginBottom:16,fontSize:12,lineHeight:1.8}}>
          <div style={{fontWeight:800,marginBottom:6,color:"var(--rd)"}}>🆘 SOS ACTIVATED</div>
          <div>📍 Location shared with Emergency Response Team</div>
          <div>🚔 Nearest police station alerted</div>
          <div>🚌 Bus driver notified</div>
          <div>📞 Emergency contact informed</div>
        </div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
          {[{ico:"📞",t:"Emergency Helpline",s:"Call 112",sub:"Police / Ambulance"},{ico:"🚌",t:"Transit Emergency",s:"Call 1800-xxx-xxxx",sub:"Free 24/7"},{ico:"👩",t:"Women Helpline",s:"Call 1091",sub:"24/7 support"},{ico:"🆘",t:"Share Location",s:"Send to contacts",sub:"Family / Friends"}].map((s,i)=>(
            <div key={i} style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r2)",padding:"13px",textAlign:"center",cursor:"pointer"}} onClick={()=>setToast(`📞 Calling ${s.s}…`)}>
              <div style={{fontSize:26,marginBottom:6}}>{s.ico}</div>
              <div style={{fontSize:12,fontWeight:700,marginBottom:2}}>{s.t}</div>
              <div style={{fontSize:11.5,color:"var(--a2)",fontWeight:600,marginBottom:2}}>{s.s}</div>
              <div style={{fontSize:10,color:"var(--t3)"}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>}

      {passSec==="Lost & Found"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:14,fontWeight:700}}>Lost & Found</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setShowLForm(f=>!f)}>{showLForm?"✕ Cancel":"+ Report Lost Item"}</button>
        </div>
        {showLForm&&!lSubmitted&&<div style={{background:"var(--g1)",border:"1px solid var(--b1)",borderRadius:"var(--r)",padding:16,marginBottom:16}}>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>🔍 Report Lost Item</div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:13}}>
            <div className="irow">
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Item Name *</div><input className="inp" placeholder="e.g. Black iPhone 14" value={lItem} onChange={e=>setLItem(e.target.value)}/></div>
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Category *</div>
                <select className="inp" value={lCat} onChange={e=>setLCat(e.target.value)}>
                  <option value="">— Select —</option>
                  {["Phone","Wallet / Purse","Bag / Backpack","Keys","Laptop","Jewellery","ID / Documents","Umbrella","Clothing","Water Bottle","Spectacles","Watch","Other"].map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Route Lost On *</div>
              <select className="inp" value={lRoute} onChange={e=>setLRoute(e.target.value)}>
                <option value="">— Select route —</option>
                {ROUTES.map(r=><option key={r.id} value={r.no}>{r.no} — {r.from} → {r.to} ({r.city})</option>)}
              </select>
            </div>
            <div className="irow">
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Date Lost</div><input className="inp" type="date"/></div>
              <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Your Mobile *</div><input className="inp" placeholder="+91 XXXXX XXXXX"/></div>
            </div>
            <div><div style={{fontSize:11,fontWeight:700,color:"var(--t2)",marginBottom:5}}>Description</div><textarea className="inp" rows={3} placeholder="Color, brand, any identifying features…" value={lDesc} onChange={e=>setLDesc(e.target.value)} style={{resize:"vertical"}}/></div>
          </div>
          <button className="pbtn" disabled={!lItem||!lCat||!lRoute} onClick={()=>setLSubmitted(true)}>📤 Submit Report</button>
        </div>}
        {lSubmitted&&<div style={{background:"rgba(16,185,129,.08)",border:"1px solid rgba(16,185,129,.25)",borderRadius:"var(--r)",padding:16,marginBottom:16,textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>✅</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:6}}>Report Submitted!</div>
          <div style={{fontSize:12,color:"var(--t2)",marginBottom:4}}>Report ID: <strong style={{color:"var(--a2)"}}>LF-{Date.now().toString().slice(-4)}</strong></div>
          <div style={{fontSize:11.5,color:"var(--t3)",marginBottom:12}}>Depot staff will contact you on your mobile if found.</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>{setLSubmitted(false);setShowLForm(false);setLItem("");setLCat("");setLRoute("");setLDesc("")}}>Report Another</button>
        </div>}
        <div style={{fontSize:13,fontWeight:700,marginBottom:9}}>Recent Reports</div>
        {[{ico:"📱",nm:"Black iPhone 14",r:"BRTS-1",dt:"Today",s:"Searching"},{ico:"💼",nm:"Brown Leather Wallet",r:"DTC-181",dt:"Yesterday",s:"Found"},{ico:"🎒",nm:"Blue Backpack",r:"BMTC-500C",dt:"2 days ago",s:"Searching"}].map((i,idx)=>(
          <div key={idx} style={{display:"flex",gap:10,padding:"10px 0",borderBottom:"1px solid var(--b1)"}}>
            <div style={{width:34,height:34,borderRadius:9,background:"rgba(99,102,241,.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{i.ico}</div>
            <div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:600}}>{i.nm}</div><div style={{fontSize:10.5,color:"var(--t3)"}}>Route {i.r} · {i.dt}</div></div>
            <span className={`sb ${i.s==="Found"?"sb-ok":"sb-am"}`}>● {i.s}</span>
          </div>
        ))}
      </div>}
    </div>
  </div>
</div>}

{/* ═══ PAYMENT ═══ */}
{tab==="Payment"&&<div className="sec">
  <div className="sh"><div className="ey">Payment</div><div className="st">Buy Your Pass</div><div className="ss">Secure UPI payment — UTR verified by admin before activation.</div></div>
  {payStep==="select"&&<>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:11,marginBottom:20}}>
      {[{t:"Single Trip",p:"₹25",d:"Valid for one journey",ico:"🎫"},{t:"Day Pass",p:"₹80",d:"Unlimited rides, 24 hrs",ico:"🌅"},{t:"Monthly Pass",p:"₹500",d:"Unlimited rides, 30 days",ico:"📅"},{t:"Annual Pass",p:"₹4,999",d:"Best value · 365 days",ico:"🏆"},{t:"Student Pass",p:"₹300",d:"30 days · Student ID req.",ico:"🎓"},{t:"Senior Pass",p:"₹250",d:"60+ years · 30 days",ico:"👴"}].map(p=>(
        <div key={p.t} onClick={()=>setSelPass(p.t)} style={{background:selPass===p.t?"rgba(99,102,241,.12)":"var(--g1)",border:`2px solid ${selPass===p.t?"var(--a)":"var(--b1)"}`,borderRadius:"var(--r)",padding:"18px",cursor:"pointer",transition:"all .2s",textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:9}}>{p.ico}</div>
          <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>{p.t}</div>
          <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,color:"var(--a2)",marginBottom:5}}>{p.p}</div>
          <div style={{fontSize:11,color:"var(--t3)"}}>{p.d}</div>
          {selPass===p.t&&<div style={{marginTop:9,fontSize:10,color:"var(--a2)",fontWeight:700}}>✓ SELECTED</div>}
        </div>
      ))}
    </div>
    <div style={{maxWidth:480}}>
      <div style={{fontSize:11,fontWeight:700,color:"var(--t3)",marginBottom:9,textTransform:"uppercase",letterSpacing:".08em"}}>Payment Method</div>
      <div style={{display:"flex",gap:9,marginBottom:16}}>
        {["UPI","UTR Verify","Cash"].map(m=><button key={m} onClick={()=>setPayMethod(m)} style={{flex:1,padding:"10px 0",borderRadius:"var(--r2)",background:payMethod===m?"rgba(99,102,241,.18)":"var(--g1)",border:`1px solid ${payMethod===m?"var(--a)":"var(--b1)"}`,color:payMethod===m?"var(--a2)":"var(--t2)",fontSize:12,fontWeight:700,cursor:"pointer"}}>{m==="UPI"?"📲 UPI":m==="UTR Verify"?"🔐 UTR Verify":"💵 Cash at Stop"}</button>)}
      </div>
      {payMethod==="UPI"&&<div style={{textAlign:"center"}}>
        <div style={{marginBottom:11,fontSize:12,color:"var(--t2)"}}>Scan QR or pay to <strong style={{color:"var(--a2)"}}>transitone@upi</strong></div>
        <div style={{display:"inline-flex",background:"#fff",borderRadius:12,padding:14,marginBottom:14}}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {Array.from({length:14},(_,row)=>Array.from({length:14},(_,col)=>{const f=(row+col*3+row*col+row*7)%4===0;return f?<rect key={`${row}-${col}`} x={col*10} y={row*10} width={10} height={10} fill="#111"/>:null}))}
            <rect x="0" y="0" width="40" height="40" fill="#111"/><rect x="5" y="5" width="30" height="30" fill="white"/><rect x="10" y="10" width="20" height="20" fill="#111"/>
            <rect x="100" y="0" width="40" height="40" fill="#111"/><rect x="105" y="5" width="30" height="30" fill="white"/><rect x="110" y="10" width="20" height="20" fill="#111"/>
            <rect x="0" y="100" width="40" height="40" fill="#111"/><rect x="5" y="105" width="30" height="30" fill="white"/><rect x="10" y="110" width="20" height="20" fill="#111"/>
            <circle cx="70" cy="70" r="14" fill="white" stroke="#111" strokeWidth="2"/>
            <text x="70" y="74" textAnchor="middle" fill="#6366f1" fontSize="9" fontWeight="bold">UPI</text>
          </svg>
        </div>
        <div style={{fontSize:11.5,color:"var(--t3)",marginBottom:13}}>Pay to: <strong style={{color:"var(--a2)"}}>transitone@upi</strong></div>
        <button className="pbtn" style={{maxWidth:260,margin:"0 auto"}} onClick={()=>setPayStep("utr")}>✅ I've Paid — Enter UTR →</button>
      </div>}
      {payMethod==="UTR Verify"&&<button className="pbtn" onClick={()=>setPayStep("utr")}>🔐 Submit UTR Number →</button>}
      {payMethod==="Cash"&&<div style={{background:"rgba(245,158,11,.08)",border:"1px solid rgba(245,158,11,.22)",borderRadius:"var(--r2)",padding:"13px",fontSize:12,color:"var(--t2)",lineHeight:1.8}}>
        💵 Pay cash at any TransitOne counter or BRTS station ticket window. Carry exact change. Show ticket ID at boarding.
      </div>}
    </div>
  </>}
  {payStep==="utr"&&<UtrForm selPass={selPass} city={city} onSuccess={()=>{setPayStep("select");nav("Passenger");setPassSec("QR Ticket")}} onBack={()=>setPayStep("select")}/>}
</div>}

{/* ═══ CITIES ═══ */}
{tab==="Cities"&&<div className="sec">
  <div className="sh"><div className="ey">City Network</div><div className="st">127 Cities on TransitOne</div><div className="ss">Expanding across India. Real-time fleet management for every city.</div></div>
  <div className="cg" style={{marginBottom:24}}>
    {CITIES.map(c=>{const cnt=ROUTES.filter(r=>r.city===c).length;return(
      <div key={c} className="cc" onClick={()=>{setCity(c);nav("Routes")}} style={{textAlign:"center"}}>
        <div style={{fontSize:26,marginBottom:7}}>{CITY_ICONS[c]||"🏙️"}</div>
        <div style={{fontSize:12.5,fontWeight:700,marginBottom:3}}>{c}</div>
        <div style={{fontSize:10,color:"var(--t3)",marginBottom:7}}>{cnt} route{cnt!==1?"s":""} · Live</div>
        <span style={{padding:"2px 8px",borderRadius:4,background:"rgba(16,185,129,.12)",color:"var(--gr)",fontSize:9.5,fontWeight:700}}>● Active</span>
      </div>
    )})}
    {["Chandigarh","Nagpur","Vadodara","Rajkot","Indore","Coimbatore","Patna","Bhubaneswar"].map(c=>(
      <div key={c} className="cc" style={{opacity:.55}}>
        <div style={{fontSize:26,marginBottom:7}}>🏙️</div>
        <div style={{fontSize:12.5,fontWeight:700,marginBottom:3}}>{c}</div>
        <div style={{fontSize:10,color:"var(--t3)",marginBottom:7}}>Onboarding…</div>
        <span style={{padding:"2px 8px",borderRadius:4,background:"rgba(245,158,11,.12)",color:"var(--am)",fontSize:9.5,fontWeight:700}}>● Soon</span>
      </div>
    ))}
  </div>
  <div style={{background:"linear-gradient(135deg,rgba(99,102,241,.1),rgba(236,72,153,.06))",border:"1px solid rgba(99,102,241,.2)",borderRadius:"var(--r)",padding:"24px"}}>
    <div className="ey">Expand to Your City</div>
    <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,marginBottom:9}}>Bring TransitOne to Your City</div>
    <div style={{color:"var(--t2)",fontSize:13,marginBottom:16,lineHeight:1.8}}>Municipality or transit authority? Partner with us. Full fleet management, real-time tracking, and AI optimization — deployed in 30 days.</div>
    <button className="pbtn" style={{maxWidth:200,padding:"10px 0",fontSize:12}} onClick={()=>setToast("🏙️ City registration form — team will contact you within 2 business days.")}>🚀 Register Your City</button>
  </div>
</div>}

{/* ═══ ADMIN ═══ */}
{tab==="Admin"&&<div className="sec">
  <div className="sh"><div className="ey">Admin Panel</div><div className="st">City Operations</div></div>
  <div className="al">
    <div className="asb">
      {[["📊","Overview"],["🚌","Vehicles"],["👨‍✈️","Drivers"],["🗺️","Routes"],["📍","Stops"],["👥","Passengers"],["📋","Complaints"],["🔧","Maintenance"],["💰","Revenue"],["💳","UTR Queue"],["🚨","Alerts"],["🏙️","City Reg."],["⚙️","Settings"]].map(([ico,s])=>(
        <div key={s} className={`an ${adminSec===s?"on":""}`} onClick={()=>setAdminSec(s)}>{ico} {s}</div>
      ))}
    </div>
    <div className="amain">
      {adminSec==="Overview"&&<div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:16,fontWeight:800,marginBottom:16}}>Fleet Overview — {city==="All Cities"?"All India":city}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:18}}>
          {[{ico:"🚌",l:"Active Buses",v:BUSES.filter(b=>b.status==="On Time").length,t:BUSES.length,c:"var(--gr)"},{ico:"⚠️",l:"Delayed Buses",v:BUSES.filter(b=>b.status==="Delayed").length,t:BUSES.length,c:"var(--rd)"},{ico:"👨‍✈️",l:"On-Duty Drivers",v:DRIVERS.filter(d=>d.status==="On Duty").length,t:DRIVERS.length,c:"var(--a2)"},{ico:"🗺️",l:"Active Routes",v:ROUTES.length,t:ROUTES.length,c:"var(--am)"}].map((s,i)=>(
            <div key={i} className="kc">
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:18}}>{s.ico}</span><span style={{fontSize:10,color:"var(--t3)"}}>{s.v}/{s.t}</span></div>
              <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:22,fontWeight:800,color:s.c,marginBottom:3}}>{s.v}</div>
              <div style={{fontSize:10,color:"var(--t3)"}}>{s.l}</div>
              <div style={{height:3,background:"var(--b1)",borderRadius:2,marginTop:7,overflow:"hidden"}}><div style={{height:"100%",width:`${(s.v/s.t)*100}%`,background:s.c,borderRadius:2}}/></div>
            </div>
          ))}
        </div>
        <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:13,fontWeight:700,marginBottom:10}}>Fleet Status by City</div>
        <div className="prg">
          {[["Surat","var(--gr)",78],["Delhi","var(--a2)",82],["Mumbai","var(--am)",71],["Bangalore","var(--pk)",65],["Hyderabad","var(--cy,#06b6d4)",88]].map(([c,col,pct])=>(
            <div key={c} className="pri">
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:"var(--t2)"}}>{c}</span><span style={{color:col,fontWeight:700}}>{pct}% on time</span></div>
              <div className="prb"><div className="prf" style={{width:`${pct}%`,background:col}}/></div>
            </div>
          ))}
        </div>
      </div>}

      {adminSec==="Vehicles"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:13,fontWeight:700}}>Fleet Management</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("➕ Add Vehicle form — available in backend-connected version.")}>+ Add Vehicle</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Vehicle ID</th><th>Route</th><th>Driver</th><th>Speed</th><th>Occupancy</th><th>Fuel</th><th>Status</th><th>City</th></tr></thead>
          <tbody>{BUSES.filter(b=>city==="All Cities"||b.city===city).map(b=>(
            <tr key={b.id} onClick={()=>setBusModal(b)} style={{cursor:"pointer"}}>
              <td style={{fontFamily:"monospace",fontSize:10,color:"var(--a2)",fontWeight:700}}>{b.id}</td>
              <td style={{fontWeight:700}}>{b.route}</td>
              <td style={{fontSize:11}}>{b.driver}</td>
              <td>{b.speed} km/h</td>
              <td><span style={{color:fmtOcc(b.occupancy),fontWeight:700}}>{b.occupancy}%</span></td>
              <td><span className={`badge ${b.fuel==="Electric"?"bel":b.fuel==="AC"?"bac":"bna"}`}>{b.fuel}</span></td>
              <td><span className={`sb ${b.status==="On Time"?"sb-ok":"sb-late"}`}>● {b.status}</span></td>
              <td style={{fontSize:11}}>{b.city}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {adminSec==="Drivers"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:700}}>Driver Management</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("➕ Add Driver — available in backend version.")}>+ Add Driver</button>
        </div>
        <div style={{display:"flex",gap:7,marginBottom:12,flexWrap:"wrap"}}>
          {["All Cities",...[...new Set(DRIVERS.map(d=>d.city))]].map(ci=>(
            <button key={ci} onClick={()=>setCity(ci)} style={{padding:"4px 10px",borderRadius:100,background:city===ci?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${city===ci?"var(--a)":"var(--b1)"}`,color:city===ci?"var(--a2)":"var(--t2)",fontSize:10.5,cursor:"pointer"}}>{ci}</button>
          ))}
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Name</th><th>City</th><th>Route</th><th>Vehicle</th><th>Trips</th><th>Rating</th><th>Exp</th><th>Accidents</th><th>Status</th></tr></thead>
          <tbody>{DRIVERS.filter(d=>city==="All Cities"||d.city===city).map(d=>(
            <tr key={d.id}>
              <td style={{fontSize:9,color:"var(--t3)",fontFamily:"monospace"}}>{d.id}</td>
              <td style={{fontWeight:600}}>{d.name}</td>
              <td style={{fontSize:11}}>{d.city}</td>
              <td style={{color:"var(--a2)",fontWeight:700,fontSize:11}}>{d.route}</td>
              <td style={{fontSize:9.5,fontFamily:"monospace"}}>{d.vehicle}</td>
              <td>{d.trips.toLocaleString()}</td>
              <td><span style={{color:d.rating>=4.7?"var(--gr)":d.rating>=4.4?"var(--am)":"var(--rd)",fontWeight:700}}>★{d.rating}</span></td>
              <td style={{fontSize:11}}>{d.exp}</td>
              <td style={{color:d.accidents>1?"var(--rd)":d.accidents>0?"var(--am)":"var(--gr)",fontWeight:700,textAlign:"center"}}>{d.accidents}</td>
              <td><span className={`sb ${d.status==="On Duty"?"sb-ok":"sb-am"}`}>● {d.status}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {adminSec==="Routes"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:13,fontWeight:700}}>Route Management</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("➕ Add Route — available in backend version.")}>+ Add Route</button>
        </div>
        <table className="tbl">
          <thead><tr><th>Route</th><th>From</th><th>To</th><th>City</th><th>Stops</th><th>Buses</th><th>Fare</th><th>Type</th><th>Source</th><th>Action</th></tr></thead>
          <tbody>{ROUTES.filter(r=>city==="All Cities"||r.city===city).map(r=>(
            <tr key={r.id}>
              <td style={{fontWeight:800,color:"var(--a2)",fontFamily:"monospace"}}>{r.no}</td>
              <td style={{fontSize:11}}>{r.from}</td>
              <td style={{fontSize:11}}>{r.to}</td>
              <td style={{fontSize:11}}>{r.city}</td>
              <td>{r.stops}</td>
              <td>{r.buses}</td>
              <td style={{fontWeight:700}}>{r.fare}</td>
              <td><span className={`badge ${bType(r.type)}`}>{r.type}</span></td>
              <td style={{fontSize:9.5,color:"var(--gr)",fontWeight:700}}>{r.source||"—"}</td>
              <td><button className="sb sb-lo" style={{cursor:"pointer",border:"none"}} onClick={()=>setRouteModal(r)}>View</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {adminSec==="Complaints"&&<div>
        <div style={{fontSize:13,fontWeight:700,marginBottom:11}}>Complaint Management</div>
        <div style={{display:"flex",gap:7,marginBottom:13}}>
          {["All","Open","In Progress","Resolved"].map(f=><button key={f} onClick={()=>setComplaintFilter(f)} style={{padding:"4px 10px",borderRadius:100,background:complaintFilter===f?"rgba(99,102,241,.2)":"var(--g1)",border:`1px solid ${complaintFilter===f?"var(--a)":"var(--b1)"}`,color:complaintFilter===f?"var(--a2)":"var(--t2)",fontSize:10.5,cursor:"pointer"}}>{f}</button>)}
        </div>
        <table className="tbl">
          <thead><tr><th>ID</th><th>Type</th><th>Route</th><th>City</th><th>Date</th><th>Priority</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>{COMPLAINTS.filter(c=>complaintFilter==="All"||c.status===complaintFilter).map(c=>(
            <tr key={c.id}>
              <td style={{fontFamily:"monospace",fontSize:10,color:"var(--t3)"}}>{c.id}</td>
              <td style={{fontSize:11,fontWeight:600}}>{c.type}</td>
              <td style={{color:"var(--a2)",fontWeight:700,fontSize:11}}>{c.route}</td>
              <td style={{fontSize:11}}>{c.city}</td>
              <td style={{fontSize:10.5,color:"var(--t3)"}}>{c.date}</td>
              <td><span style={{padding:"2px 7px",borderRadius:4,fontSize:9.5,fontWeight:700,background:c.priority==="High"?"rgba(239,68,68,.15)":c.priority==="Medium"?"rgba(245,158,11,.15)":"rgba(16,185,129,.15)",color:c.priority==="High"?"var(--rd)":c.priority==="Medium"?"var(--am)":"var(--gr)"}}>{c.priority}</span></td>
              <td><span className={`sb ${c.status==="Resolved"?"sb-ok":c.status==="In Progress"?"sb-prog":"sb-am"}`}>● {c.status}</span></td>
              <td><button className="sb sb-lo" style={{cursor:"pointer",border:"none"}} onClick={()=>setToast(`💬 Responding to ${c.id}: ${c.type}`)}>Respond</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>}

      {adminSec==="UTR Queue"&&<UtrAdmin/>}

      {adminSec==="Revenue"&&<div>
        <div style={{fontSize:13,fontWeight:700,marginBottom:14}}>Revenue Overview</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:16}}>
          {[{l:"Today Revenue",v:"₹2,84,320",c:"var(--gr)"},{l:"This Month",v:"₹48.2L",c:"var(--a2)"},{l:"Annual",v:"₹5.8Cr",c:"var(--am)"},{l:"Pass Renewals",v:"3,420",c:"var(--pk)"}].map((s,i)=>(
            <div key={i} className="kc"><div style={{fontSize:10,color:"var(--t3)",marginBottom:4,textTransform:"uppercase",letterSpacing:".06em"}}>{s.l}</div><div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:20,fontWeight:800,color:s.c}}>{s.v}</div></div>
          ))}
        </div>
        <div style={{fontSize:11.5,fontWeight:700,marginBottom:9}}>Revenue by City</div>
        <div className="bch">
          {[["Surat",88,"var(--a)"],["Mumbai",95,"var(--gr)"],["Delhi",72,"var(--am)"],["Bangalore",81,"var(--pk)"],["Hyderabad",65,"var(--cy,#06b6d4)"],["Pune",58,"var(--a2)"],["Chennai",74,"var(--gr)"]].map(([c,h,col])=>(
            <div key={c} className="bg">
              <div style={{fontSize:9,color:"var(--t3)"}}>{h}%</div>
              <div className="bb" style={{height:`${h}%`,background:col}}/>
              <div style={{fontSize:9,color:"var(--t3)",transform:"rotate(-30deg)",transformOrigin:"center",marginTop:3}}>{c}</div>
            </div>
          ))}
        </div>
        <button className="sbtn" style={{marginTop:14,fontSize:11}} onClick={()=>setToast("📊 Revenue CSV downloading…")}>📊 Export CSV</button>
      </div>}

      {adminSec==="Alerts"&&<div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:13}}>
          <div style={{fontSize:13,fontWeight:700}}>Active Alerts</div>
          <button className="sbtn" style={{fontSize:11}} onClick={()=>setToast("📢 Broadcast alert form — available in backend version.")}>+ Broadcast Alert</button>
        </div>
        {[{type:"Route Disruption",msg:"CT-102 Surat rerouted via Laskana — road work till 6 PM",sev:"High",time:"2 hrs ago"},{type:"Weather Alert",msg:"Heavy rain Mumbai — BEST-1, BEST-2 delayed 5–10 min",sev:"Medium",time:"30 min ago"},{type:"Maintenance",msg:"BMTC-500C Bangalore scheduled maintenance Sunday 11PM",sev:"Low",time:"3 hrs ago"},{type:"Crowd Alert",msg:"BRTS-1 Surat: High occupancy — next bus in 4 min",sev:"Medium",time:"5 min ago"}].map((a,i)=>(
          <div key={i} className={`abar ${a.sev==="High"?"":a.sev==="Medium"?"warn":"info"}`} style={{marginBottom:8}}>
            <span>{a.sev==="High"?"🚨":a.sev==="Medium"?"⚠️":"ℹ️"}</span>
            <div style={{flex:1}}><div style={{fontWeight:700,fontSize:12,marginBottom:2}}>{a.type}</div><div style={{fontSize:11.5,color:"var(--t2)"}}>{a.msg}</div></div>
            <div style={{fontSize:10,color:"var(--t3)",flexShrink:0}}>{a.time}</div>
          </div>
        ))}
      </div>}

      {adminSec==="Settings"&&<div>
        <div style={{fontSize:13,fontWeight:700,marginBottom:16}}>System Settings</div>
        {[["🔔","Push Notifications","Send delay/route alerts to passengers"],["🗺️","Live Tracking","Real-time GPS broadcast (5s interval)"],["🤖","AI Journey Planner","Enable AI-powered route suggestions"],["📊","Analytics Dashboard","Collect anonymized usage data"],["🔐","Two-Factor Auth","Require 2FA for admin logins"],["🌙","Maintenance Mode","Temporarily disable public access"]].map(([ico,t,d],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid var(--b1)"}}>
            <div style={{display:"flex",gap:11,alignItems:"center"}}>
              <span style={{fontSize:18}}>{ico}</span>
              <div><div style={{fontSize:12.5,fontWeight:600}}>{t}</div><div style={{fontSize:11,color:"var(--t3)"}}>{d}</div></div>
            </div>
            <div style={{width:40,height:22,borderRadius:11,background:i<4?"var(--gr)":"var(--b2)",display:"flex",alignItems:"center",justifyContent:i<4?"flex-end":"flex-start",padding:"2px",cursor:"pointer"}} onClick={()=>setToast(`⚙️ ${t} toggled`)}>
              <div style={{width:18,height:18,borderRadius:"50%",background:"#fff"}}/>
            </div>
          </div>
        ))}
        <div style={{display:"flex",gap:9,marginTop:16}}>
          <button className="pbtn" style={{maxWidth:160,padding:"10px 0",fontSize:12}} onClick={()=>setToast("✅ Settings saved!")}>Save Changes</button>
          <button className="sbtn" style={{fontSize:12}} onClick={()=>setToast("🔄 Settings reset to defaults.")}>Reset Defaults</button>
        </div>
      </div>}

      {!["Overview","Vehicles","Drivers","Routes","Complaints","UTR Queue","Revenue","Alerts","Settings"].includes(adminSec)&&<div style={{textAlign:"center",padding:"40px 20px",color:"var(--t3)"}}>
        <div style={{fontSize:36,marginBottom:12}}>⚙️</div>
        <div style={{fontSize:14,color:"var(--t2)",fontWeight:600,marginBottom:6}}>{adminSec}</div>
        <div style={{fontSize:12}}>Full {adminSec} management available in the backend-connected version.</div>
        <button className="sbtn" style={{marginTop:14,fontSize:11}} onClick={()=>setToast(`➕ ${adminSec} — form will appear in full version.`)}>+ Add New Entry</button>
      </div>}
    </div>
  </div>
</div>}

{/* ═══ ANALYTICS ═══ */}
{tab==="Analytics"&&<div className="sec">
  <div className="sh"><div className="ey">Analytics</div><div className="st">Platform Intelligence</div><div className="ss">Real-time insights across all cities and routes.</div></div>
  <div className="ang">
    <div className="anc">
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>📊 Fleet Performance</div>
      <div className="prg">
        {[["On-Time Rate","var(--gr)",78],["Occupancy Avg","var(--am)",71],["Electric Fleet","var(--a2)",38],["Satisfaction","var(--pk)",88],["Pass Penetration","var(--cy,#06b6d4)",62]].map(([l,c,v])=>(
          <div key={l} className="pri">
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:"var(--t2)"}}>{l}</span><span style={{color:c,fontWeight:700}}>{v}%</span></div>
            <div className="prb"><div className="prf" style={{width:`${v}%`,background:c}}/></div>
          </div>
        ))}
      </div>
    </div>
    <div className="anc">
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>📈 Daily Ridership (Week)</div>
      <div className="bch">
        {[["Mon",68,"var(--a)"],["Tue",82,"var(--a)"],["Wed",91,"var(--gr)"],["Thu",77,"var(--a)"],["Fri",95,"var(--gr)"],["Sat",55,"var(--am)"],["Sun",42,"var(--am)"]].map(([d,h,col])=>(
          <div key={d} className="bg">
            <div style={{fontSize:9,color:"var(--t3)"}}>{h}%</div>
            <div className="bb" style={{height:`${h}%`,background:col}}/>
            <div style={{fontSize:9,color:"var(--t3)",marginTop:3}}>{d}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="anc">
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>🏙️ Top Cities by Ridership</div>
      <div className="prg">
        {[["Mumbai","var(--gr)",2400000],["Delhi","var(--a2)",2100000],["Bangalore","var(--am)",1800000],["Surat","var(--pk)",1200000],["Hyderabad","var(--cy,#06b6d4)",980000]].map(([c,col,v])=>(
          <div key={c} className="pri">
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:3}}><span style={{color:"var(--t2)"}}>{c}</span><span style={{color:col,fontWeight:700}}>{(v/1000000).toFixed(1)}M/day</span></div>
            <div className="prb"><div className="prf" style={{width:`${(v/2400000)*100}%`,background:col}}/></div>
          </div>
        ))}
      </div>
    </div>
    <div className="anc">
      <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:800,marginBottom:14}}>⚡ Sustainability</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:9}}>
        {[{ico:"🌿",v:"48.2T",l:"CO₂ Saved Today",c:"var(--gr)"},{ico:"⚡",v:"38%",l:"Electric Fleet",c:"var(--a2)"},{ico:"🌍",v:"17,620T",l:"CO₂ Saved YTD",c:"var(--gr)"},{ico:"🔋",v:"94%",l:"Avg Battery Health",c:"var(--am)"}].map((s,i)=>(
          <div key={i} className="kc" style={{textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:5}}>{s.ico}</div>
            <div style={{fontFamily:"'Space Grotesk',sans-serif",fontSize:18,fontWeight:800,color:s.c,marginBottom:2}}>{s.v}</div>
            <div style={{fontSize:9.5,color:"var(--t3)"}}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>}

</main>

{/* FOOTER */}
<footer className="foot">
  <div className="fg">
    <div><div className="flo">🚌 TransitOne India</div><div className="fd">AI-powered public transportation OS for India. Real-time tracking, smart journey planning, digital ticketing — 127 cities, 84,320 buses.</div>
      <div style={{display:"flex",gap:7}}>
        {[["🍎","App Store"],["🤖","Play Store"],["🌐","Web App"]].map(([ico,l])=>(
          <button key={l} onClick={()=>setToast(`${l} — Coming Q3 2026!`)} style={{padding:"5px 10px",borderRadius:7,background:"rgba(255,255,255,.06)",border:"1px solid var(--b1)",color:"var(--t2)",fontSize:10,cursor:"pointer"}}>{ico} {l}</button>
        ))}
      </div>
    </div>
    <div><div className="fct">Platform</div>{["Live Map","Journey Planner","Route Directory","Schedule","Smart Search"].map(l=><span key={l} className="fl" onClick={()=>nav(l.split(" ")[0]==="Live"?"Live Map":l.split(" ")[0])}>{l}</span>)}</div>
    <div><div className="fct">For Passengers</div>{["My Pass","QR Ticket","Trip History","Complaints","Lost & Found"].map(l=><span key={l} className="fl" onClick={()=>{nav("Passenger");setPassSec(l)}}>{l}</span>)}</div>
    <div><div className="fct">Support</div>{["Help Centre","Contact Us","Privacy Policy","Terms of Service","Register City"].map(l=><span key={l} className="fl" onClick={()=>setToast(`📄 ${l} — opening…`)}>{l}</span>)}</div>
  </div>
  <div style={{borderTop:"1px solid var(--b1)",paddingTop:16,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:9}}>
    <div style={{fontSize:11,color:"var(--t3)"}}>© 2026 TransitOne India · AI-Powered Smart Transit · Built with ❤️ for India</div>
    <div style={{fontSize:11,color:"var(--t3)",display:"flex",gap:14}}>
      <span style={{cursor:"pointer"}} onClick={()=>setToast("🔒 Data encrypted · DPDP Act compliant")}>🔒 Privacy</span>
      <span style={{cursor:"pointer"}} onClick={()=>setToast("⚡ 99.98% uptime · 5-second GPS updates")}>⚡ Status: All Systems Live</span>
    </div>
  </div>
</footer>

</div>
</>)
}