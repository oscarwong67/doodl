const io = require('socket.io')();
const randomString = require('random-base64-string');
const Game = require('./game.js');
let words = ["CD","AXE","BOW","BOY","CAR","ELF","EYE","FAT","KEY","OWL","PEN","PIG","RUG","SEA","SUN","ANTS","BABY","BANK","BARN","BEER","BIKE","BIRD","BOAT","BOMB","BOOK","BOWL","BURN","CAKE","CHEF","COLD","CRAB","CORK","DESK","DICE","DUCK","EGGS","FACE","FALL","FARM","FLAG","FIRE","FROG","GIFT","GIRL","HAIR","HAND","HANG","HOOK","JAIL","JUMP","KING","KISS","HOBO","LAKE","LAMP","LAVA","LION","LOVE","MATH","MOON","NECK","POOL","POOP","PULL","PUSH","RAIN","RICE","RING","ROLL","ROPE","ROSE","SHIP","SHOE","SNOW","SOCK","SOUP","TACO","TANK","TAIL","TENT","TIME","TINY","TREE","WIND","WOLF","WARM","XBOX","YAWN","ACORN","ALIEN","ANGEL","ANKEL","ANVIL","APPLE","ARMOR","BACON","BAGEL","BEACH","BEANS","BEARD","BENCH","BERRY","BLOOD","BOOTS","BOOTY","BREAD","BRUSH","CAMEL","CANDY","CEREAL","CHAIR","CHEEK","CHEST","CLOCK","CLOUD","CLOWN","COMET","COUCH","CROWD","CROWN","DANCE","DARTS","DISCO","DONUT","DREAM","DRESS","DRILL","DRINK","DROOL","DRUMS","EARTH","ELBOW","ERUPT","FLINT","FRIES","GHAST","GIANT","GOLEM","GRASS","GRAVE","GUARD","HIPPO","HORSE","IGLOO","JOKER","KIRBY","LEASH","LIGHT","LLAMA","LUIGI","MAGIC","MARIO","MELON","MINER","MONEY","MOOSE","MOUSE","MOVIE","MUSIC","NIGHT","NINJA","OCEAN","PAINT","PANDA","PANTS","PAPER","PARTY","PEPSI","PHONE","PHOTO","PIANO","PIZZA","PLANE","PLANT","PRIZE","PUNCH","PUPPY","PURSE","QUEEN","QUICK","RADAR","RIFLE","RIVER","ROBOT","ROYAL","RULER","SALAD","SALSA","SCARF","SCREW","SHARK","SHEEP","SHOUT","SKIRT","SKULL","SKUNK","SKYPE","SLIME","SLOTH","SMILE","SNAIL","SNAKE","SPOON","SPRAY","SQUID","STAIN","STAMP","STARS","STOOL","STORM","STUMP","SUGAR","SUSHI","SWING","SYRUP","TEARS","TEDDY","THIEF","THORN","THUMB","TIGER","TOOTH","TORCH","TOWEL","TOWER","TRASH","TRUCK","VOMIT","WAGON","WAIST","WATCH","WATER","WHALE","WHEAT","WITCH","YOSHI","ZEBRA","ARCHER","ANCHOR","AUTUMN","BAMBOO","BANANA","BARBIE","BATMAN","BIKINI","BOOGER","BOTTLE","BRANCH","BRIDGE","BUCKET","BURGER","BUTTON","CACTUS","CAMERA","CARROT","CASTLE","CHEESE","CINEMA","COOKIE","COFFEE","CRAYON","CRYING","DESERT","DOMINO","DRAGON","FAMILY","FINGER","FLOWER","FOREST","FROZEN","GALAXY","GRAPES","GUITAR","HAMMER","HOTDOG","JUGGLE","LAPTOP","LETTER","LIZARD","MONKEY","MOTHER","MUDKIP","MUFFIN","NETHER","ORANGE","PENCIL","PICNIC","PICKLE","PILLOW","PIRATE","PISTON","PLANET","POLICE","PORTAL","PRISON","RABBIT","SCHOOL","SHIELD","SHORTS","SKINNY","SPIDER","SPIKES","SPONGE","SPRING","SPROUT","STABLE","SUMMER","SUNSET","TEAPOT","TEMPLE","TENNIS","TETRIS","TOILET","TOMATO","TWITTER","TURTLE","WINDOW","WINTER","WITHER","WIZARD","ZIPPER","ZOMBIE","ALCOHOL","AMERICA","BAGGAGE","BATTERY","BLANKET","CAPTURE","CHICKEN","COCONUT","COMPASS","CHICKEN","CHIMNEY","CREEPER","CUPCAKE","CYCLOPS","DOLPHIN","FRISBEE","FISHING","FOOTBALL","FRISBEE","GARBAGE","GIRAFFE","GLASSES","HAMSTER","ICEBERG","MANSION","MONITOR","MUSCLES","NOODLES","PANCAKE","PEASANT","PENGUIN","PIKACHU","PLUMBER","PRESENT","PYRAMID","PUMPKIN","RAINBOW","RUBBISH","SHOTGUN","SNORLAX","SNOWMAN","SPEAKER","STOMACH","SUNRISE","TOASTER","TORNADO","TRUMPET","UNICORN","VOLCANO","YELLING","BALLOONS","BOOKCASE","BUILDING","CAMPFIRE","CANNIBAL","COMPUTER","CONFUSED","DIAMONDS","DINOSAUR","ELEPHANT","EMERALDS","EYEPATCH","FACEBOOK","FIGHTING","FOOTBALL","GODZILLA","KANGAROO","KEYBOARD","LOLLIPOP","MINEPLEX","MOUNTAIN","MUSHROOM","NINTENDO","NOTEBOOK","PAINTING","POKEBALL","PREGNANT","PRINCESS","SKELETON","SLEEPING","SLIPPERS","SQUIRREL","SUPERMAN","SWIMMING","UMBRELLA","UPPERCUT","WINDMILL","ALLIGATOR","ASTRONAUT","BUMBLEBEE","BUTTERFLY","CHOCOLATE","EXPLOSION","HANDCUFFS","LETTERBOX","LIGHTNING","MICROSOFT","MINECRAFT","MOTORBIKE","RASPBERRY","SIDEBURNS","SNOWFLAKE","SPACESHIP","SPAGHETTI","STAIRCASE","TREEHOUSE","BASKETBALL","BINOCULARS","CALCULATOR","CHARMANDER","CHESTPLATE","HELICOPTER","PLAYSTATION","TELEVISION","STRAWBERRY","SUNGLASSES","WATERMELON","BELLY BUTTON","CAMP FIRE","CHRISTMAS TREE","DOOR KNOB","DRAW MY THING","ENDER DRAGON","FISHING ROD","GOLF CLUB","GRIM REAPER","HARRY POTTER","HOLDING HANDS","HORSE RIDING","HOT AIR BALLOON","ICE CREAM","IRON ORE","MOUNTAIN BIKE","NIGHT TIME","POT OF GOLD","PUMPKIN PIE","SALT AND PEPPER","SHAKING HANDS","STOP SIGN","SWIMMING POOL","TENNIS RACKET","TRAFFIC LIGHTS","TROLL FACE","TOP HAT","UNITED STATES","VIDEO GAME","WATER GUN","ZOMBIE PIGMAN"
];

let games = new Map();

io.on('connection', (client) => {
    client.on('create', (name, rounds) => {
        handleCreate(client, name, rounds);
    });

    client.on('join', (name, key) => {
        handleJoin(client, name, key);
    });

    client.on('leave', (id, name, key) => {
        handleLeave(client, id, name, key);
    });

    /*client.on('disconnect', () => {
        client.emit('selfLeave', client);   //at this point, we have the ID of the client but not which room it left
    });*/

    client.on('ready', (id, name, key) => {
        handleReady(client, id, name, key)
    });

    client.on('startGame', handleStartGame);

    client.on('startRound', handleStartRound);

    client.on('draw', (drawing, key) => {
        handleDraw(client, drawing, key);
    });

    client.on('message', handleMessage);
});

function handleCreate(client, name, rounds) {
    console.log(name + " is creating a lobby");
    //generate a unique key
    let key = randomString(12);
    while (typeof games.get(key) == undefined) {
        key = randomString(12);
    }
    console.log("new game created! key: " + key);

    //join the room, and also update the Map() object of games
    games.set(key, new Game(key));
    games.get(key).setRounds(rounds);
    client.join(key, () => {
        let rooms = Object.keys(client.rooms);
        console.log(rooms); //prints out all rooms that the client is in - first element is the client's ID.
    });
    games.get(key).join(name, client.id);

    console.log("now, having the client join the room...");

    client.emit('selfJoin', client.id, name, key, games.get(key).playerArray, rounds, true, true); //tell client they've joined
    io.sockets.in(key).emit('join', name, key, games.get(key).playerArray); //tell everyone they've joined
}

function handleJoin(client, name, key) {
    if (!games.get(key)) {   //if game key was invalid
        client.emit('err', "invalid key");
        return;
    } else if (games.get(key).numPlayers >= 10) {  //if game is full
        client.emit('err', "full game");
        return;
    } else if (games.get(key).started) {
        client.emit('err', 'game in progress');
        return;
    }

    //join the room, and also update the Map() object of games
    client.join(key, () => {
        let rooms = Object.keys(client.rooms);
        console.log(rooms); //prints out all rooms that the client is in - first element is the client's ID.
    });
    games.get(key).join(name, client.id);

    client.emit('selfJoin', client.id, name, key, games.get(key).playerArray, games.get(key).rounds, false, false); //tell client they've joined
    io.sockets.in(key).emit('join', name, key, games.get(key).playerArray); //tell everyone they've joined
}

function handleLeave(client, id, name, key) {
    if (games.get(key)) {
        client.leave(key);  //leave the room
        games.get(key).leave(name, id);  //remove player from games object
        if (games.get(key).numPlayers == 0) { //if no players remaining, delete room from list of games
            games.delete(key);
            return;
        }
        console.log("User " + client.id + " has left room " + key);
        io.sockets.in(key).emit('leave', name, key, games.get(key).playerArray);    //tell everyone client has left
    }

}

function handleReady(client, id, name, key) {
    if (games.get(key)) {
        if (!games.get(key).started) {
            games.get(key).toggleReady(name, id);
            io.sockets.in(key).emit('ready', games.get(key).playerArray);
        }
        if (games.get(key).allReady && games.get(key).numPlayers > 1) {
            emitStart(key);
        }
    }
}

function emitStart(key) {
    if (!games.get(key).started) {
        io.sockets.in(key).emit('start');
        games.get(key).startGame();
    }
}

function handleStartGame(key) {
    games.get(key).startGame();
    io.sockets.in(key).emit('startRound', 1);
}

function handleStartRound(round, key) {
    if (games.get(key)) {
        if (round === (games.get(key).rounds + 1)) {
            //do some stuff to end the game
            io.sockets.in(key).emit('endGame');
            return;
        }
        //toDo: compile scores from previous round
        games.get(key).startRound(round);
        let i = 0;

        //run once first
        let word = words[Math.floor(Math.random() * words.length)];
        games.get(key).startPlayer(i); //toDo: on this call, generate and send a new word
        io.sockets.in(key).emit('startPlayer', i, games.get(key).playerArray, word);
        i++;
        //repeat for rest of players
        let playerInterval = setTimeout(() => {
            if (games.get(key)) {
                if (i < games.get(key).numPlayers) {
                    word = words[Math.floor(Math.random() * words.length)];
                    games.get(key).startPlayer(i);
                    io.sockets.in(key).emit('startPlayer', i, games.get(key).playerArray, word);
                    i++;
                } else {
                    if (timeOut) {
                        clearTimeout(timeOut);
                    }
                    clearInterval(playerInterval);
                    io.sockets.in(key).emit('startRound', round + 1);
                }
            }
        }, 15000);  //every 85 seconds, go to the next player
        let total = 15000 * games.get(key).numPlayers;
        let timeOut = setTimeout(() => {
            clearInterval(playerInterval);
            io.sockets.in(key).emit('startRound', round + 1);
        }, total);  //runs at the end of the round.
    }
}

function handleDraw(client, drawing, key) {
    client.broadcast.emit('draw', drawing);
}

function handleMessage() {

}

const port = 8000;
io.listen(port);
console.log('listening on port ', port);