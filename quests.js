export const WORLD = {
  HomeScene: {
    title: "Maison de Tekos",
    size: [960, 640],
    floor: 0xe9dfbb,
    walls: [
      [0, 0, 960, 40], [0, 600, 960, 40], [0, 0, 40, 640], [920, 0, 40, 640],
      [160, 140, 640, 30]
    ],
    objects: [
      { id: "bed", type: "furniture", x: 170, y: 250, w: 180, h: 100, label: "Lit" },
      { id: "desk", type: "furniture", x: 650, y: 250, w: 170, h: 90, label: "Bureau" },
      { id: "home_exit", type: "portal", x: 430, y: 550, w: 100, h: 40, label: "Sortir", to: "CampusScene", spawn: "house" }
    ],
    spawns: { default: [480, 420] }
  },
  CampusScene: {
    title: "Campus Tekos",
    size: [1280, 760],
    floor: 0x76bd72,
    roads: [[560, 0, 160, 760], [0, 570, 1280, 120]],
    objects: [
      { id: "tekos_tech", type: "building", x: 70, y: 110, w: 360, h: 260, label: "TEKOS TECH", color: 0x58a8d8 },
      { id: "shop_entrance", type: "portal", x: 205, y: 330, w: 90, h: 45, label: "Entrer", to: "ShopScene", spawn: "entrance" },
      { id: "hospital", type: "building", x: 820, y: 100, w: 370, h: 280, label: "HÔPITAL TEKOS", color: 0xe96363 },
      { id: "hospital_entrance", type: "portal", x: 955, y: 340, w: 100, h: 45, label: "Entrer", to: "HospitalScene", spawn: "entrance" },
      { id: "home", type: "building", x: 130, y: 470, w: 260, h: 170, label: "MAISON DE TEKOS", color: 0xf2c65e },
      { id: "home_entrance", type: "portal", x: 215, y: 610, w: 90, h: 35, label: "Entrer", to: "HomeScene", spawn: "default" }
    ],
    spawns: { house: [260, 520], shop: [250, 420], hospital: [990, 430] }
  },
  ShopScene: {
    title: "Tekos Tech — Boutique",
    size: [1000, 700],
    floor: 0x344258,
    objects: [
      { id: "counter", type: "furniture", x: 90, y: 250, w: 240, h: 90, label: "Accueil" },
      { id: "dora", type: "npc", x: 210, y: 210, label: "DORA", color: 0x4679db },
      { id: "shop_exit", type: "portal", x: 430, y: 635, w: 120, h: 45, label: "Sortie", to: "CampusScene", spawn: "shop" },
      { id: "backroom_door", type: "portal", x: 830, y: 270, w: 80, h: 120, label: "Arrière-boutique", to: "BackroomScene", spawn: "door" },
      { id: "showroom", type: "furniture", x: 520, y: 120, w: 220, h: 150, label: "Showroom" }
    ],
    spawns: { entrance: [480, 560], backroom: [780, 340] }
  },
  BackroomScene: {
    title: "Tekos Tech — Arrière-boutique",
    size: [1050, 720],
    floor: 0x27364b,
    objects: [
      { id: "dom", type: "npc", x: 520, y: 150, label: "DOM", color: 0xd94d78 },
      { id: "training_pc", type: "computer", x: 250, y: 340, w: 150, h: 120, label: "PC GLPI" },
      { id: "terminal", type: "computer", x: 650, y: 340, w: 150, h: 120, label: "Terminal" },
      { id: "shop_door", type: "portal", x: 65, y: 310, w: 70, h: 120, label: "Boutique", to: "ShopScene", spawn: "backroom" }
    ],
    spawns: { door: [180, 370] }
  },
  HospitalScene: {
    title: "Hôpital Tekos",
    size: [1100, 720],
    floor: 0xe7f2f6,
    objects: [
      { id: "hospitalReception", type: "computer", x: 180, y: 270, w: 150, h: 120, label: "PC Accueil" },
      { id: "hospitalRecords", type: "computer", x: 470, y: 270, w: 150, h: 120, label: "Dossiers" },
      { id: "hospitalImaging", type: "computer", x: 760, y: 270, w: 150, h: 120, label: "Imagerie" },
      { id: "hospital_exit", type: "portal", x: 490, y: 650, w: 120, h: 45, label: "Sortie", to: "CampusScene", spawn: "hospital" }
    ],
    spawns: { entrance: [550, 580] }
  }
};
