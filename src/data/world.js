export const WORLD = {
  HomeScene: {
    title: "Maison de Tekos",
    size: [960, 640],
    palette: { floor: 0xdccf9d, wall: 0x344155, accent: 0x58a6d3 },
    floorPattern: "wood",
    walls: [[0,0,960,40],[0,600,960,40],[0,0,40,640],[920,0,40,640],[160,140,640,30]],
    decorations: [
      {type:"rug",x:480,y:410,w:300,h:120,color:0x5b82b1},
      {type:"plant",x:100,y:210},{type:"plant",x:860,y:210},
      {type:"window",x:480,y:80,w:180,h:70}
    ],
    objects: [
      {id:"bed",type:"furniture",subtype:"bed",x:170,y:250,w:180,h:100,label:"Lit"},
      {id:"desk",type:"furniture",subtype:"desk",x:650,y:250,w:170,h:90,label:"Bureau"},
      {id:"home_exit",type:"portal",x:430,y:550,w:100,h:40,label:"Sortir",to:"CampusScene",spawn:"house"}
    ],
    spawns:{default:[480,420]}
  },

  CampusScene: {
    title:"Campus Tekos",
    size:[1280,760],
    palette:{floor:0x75b96f,road:0xd5c791,accent:0x2cced8},
    floorPattern:"grass",
    roads:[[548,0,184,760],[0,560,1280,130]],
    decorations:[
      {type:"tree",x:475,y:120},{type:"tree",x:805,y:120},
      {type:"tree",x:475,y:320},{type:"tree",x:805,y:320},
      {type:"tree",x:80,y:690},{type:"tree",x:1190,y:690},
      {type:"lamp",x:515,y:185},{type:"lamp",x:765,y:185},
      {type:"lamp",x:515,y:480},{type:"lamp",x:765,y:480},
      {type:"bench",x:450,y:520},{type:"bench",x:830,y:520},
      {type:"flower",x:455,y:240},{type:"flower",x:825,y:240}
    ],
    objects:[
      {id:"tekos_tech",type:"building",x:55,y:90,w:390,h:285,label:"TEKOS TECH",color:0x4e9fd2,windows:3},
      {id:"shop_entrance",type:"portal",x:205,y:335,w:90,h:45,label:"Entrer",to:"ShopScene",spawn:"entrance"},
      {id:"hospital",type:"building",x:820,y:85,w:390,h:300,label:"HÔPITAL TEKOS",color:0xe65a62,windows:3,emblem:"cross"},
      {id:"hospital_entrance",type:"portal",x:965,y:345,w:100,h:45,label:"Entrer",to:"HospitalScene",spawn:"entrance"},
      {id:"home",type:"building",x:115,y:455,w:290,h:190,label:"MAISON DE TEKOS",color:0xf0c356,windows:2},
      {id:"home_entrance",type:"portal",x:210,y:610,w:90,h:35,label:"Entrer",to:"HomeScene",spawn:"default"}
    ],
    spawns:{house:[260,520],shop:[250,420],hospital:[990,430]}
  },

  ShopScene: {
    title:"Tekos Tech — Boutique",
    size:[1000,700],
    palette:{floor:0x344258,wall:0x1d2737,accent:0x00d5e5},
    floorPattern:"tech",
    decorations:[
      {type:"neonLine",x:500,y:78,w:820,color:0xff1478},
      {type:"plant",x:90,y:170},{type:"plant",x:905,y:170},
      {type:"displayWall",x:535,y:105,w:260,h:85},
      {type:"displayWall",x:825,y:105,w:160,h:85}
    ],
    objects:[
      {id:"counter",type:"furniture",subtype:"counter",x:90,y:250,w:240,h:90,label:"ACCUEIL"},
      {id:"dora",type:"npc",x:210,y:210,label:"DORA",color:0x4779dc,hair:0x7b3f2d},
      {id:"shop_exit",type:"portal",x:430,y:635,w:120,h:45,label:"Sortie",to:"CampusScene",spawn:"shop"},
      {id:"backroom_door",type:"portal",x:830,y:270,w:80,h:120,label:"Arrière-boutique",to:"BackroomScene",spawn:"door"},
      {id:"showroom",type:"furniture",subtype:"showroom",x:520,y:160,w:250,h:170,label:"SHOWROOM"}
    ],
    spawns:{entrance:[480,560],backroom:[780,340]}
  },

  BackroomScene: {
    title:"Tekos Tech — Arrière-boutique",
    size:[1050,720],
    palette:{floor:0x27364b,wall:0x151e2d,accent:0xff197a},
    floorPattern:"server",
    decorations:[
      {type:"neonLine",x:525,y:72,w:880,color:0x12d8df},
      {type:"serverRack",x:150,y:130},{type:"serverRack",x:310,y:130},
      {type:"serverRack",x:740,y:130},{type:"serverRack",x:900,y:130},
      {type:"plant",x:505,y:245}
    ],
    objects:[
      {id:"dom",type:"npc",x:520,y:150,label:"DOM",color:0xd94d78,hair:0x84262f},
      {id:"training_pc",type:"computer",x:250,y:390,w:160,h:125,label:"PC GLPI",screen:0x19dfe8},
      {id:"terminal",type:"computer",x:650,y:390,w:160,h:125,label:"TERMINAL",screen:0x55d06e},
      {id:"shop_door",type:"portal",x:65,y:310,w:70,h:120,label:"Boutique",to:"ShopScene",spawn:"backroom"}
    ],
    spawns:{door:[180,370]}
  },

  HospitalScene: {
    title:"Hôpital Tekos",
    size:[1100,720],
    palette:{floor:0xe4eff3,wall:0xd3dde5,accent:0xe84267},
    floorPattern:"hospital",
    decorations:[
      {type:"hospitalBanner",x:550,y:90,w:720,h:80},
      {type:"plant",x:110,y:170},{type:"plant",x:990,y:170},
      {type:"chairRow",x:550,y:540}
    ],
    objects:[
      {id:"hospitalReception",type:"computer",x:160,y:300,w:160,h:130,label:"PC ACCUEIL",screen:0x5ca3d9},
      {id:"hospitalRecords",type:"computer",x:470,y:300,w:160,h:130,label:"DOSSIERS",screen:0xd95572},
      {id:"hospitalImaging",type:"computer",x:780,y:300,w:160,h:130,label:"IMAGERIE",screen:0x8772de},
      {id:"hospital_exit",type:"portal",x:490,y:650,w:120,h:45,label:"Sortie",to:"CampusScene",spawn:"hospital"}
    ],
    spawns:{entrance:[550,580]}
  }
};
