export interface Presenter {
  slug: string
  name: string
  /** Short show name, e.g. "The Lunch Hive". Omitted when the show isn't known. */
  showName?: string
  /** Full broadcast title */
  showTitle?: string
  /** Human readable slot, e.g. "Weekdays 12pm – 3pm" */
  slotLabel?: string
  /** Exact slug of the show on Aiir's Listen Again site; no link is shown when omitted. */
  onDemand?: string
  shortBio: string
  bio: string[]
  image?: string
  /** 'contain' shows the whole picture (e.g. cut-outs); default crops to fill the frame. */
  imageFit?: 'cover' | 'contain'
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function onDemandSlug(presenter: Presenter): string | undefined {
  return presenter.onDemand
}

/** Presenters in the same order as the original hivefm.org page (bios and photos copied from it). */
export const presenters: Presenter[] = [
  {
    slug: "suzie-sparkles",
    name: "Suzie Sparkles",
    showName: "Rise & Shine",
    showTitle: "Rise & Shine with Suzie Sparkles",
    slotLabel: "Weekdays 7am",
    onDemand: "rise-and-shine-with-suzie-sparkles",
    shortBio: "I'm Suzie, and it's an honour to join the fabulous team here at Hive FM.",
    bio: ["I'm Suzie, and it's an honour to join the fabulous team here at Hive FM. I knocked on the door of my local community station Gravity FM to ask if I could have a go at presenting. Being someone that loves chatting and listening to music I wanted to see if I could do it. It's safe to say I loved and continue to love every second of it. If anyone would have me on air 24/7 believe me I would be there. Join me every weekday morning at 7am for Rise & Shine."],
    image: "/presenters/suzie-sparkles.webp",
  },
  {
    slug: "willie-mac",
    name: "Willie Mac",
    showName: "The Goldmine",
    showTitle: "The Goldmine with Willie Mac",
    slotLabel: "Weekdays 9am",
    shortBio: "I spun my first disc when I was 18 in a hotel in Scotland, and from that moment I was hooked.",
    bio: ["I spun my first disc when I was 18 in a hotel in Scotland, and from that moment I was hooked. Nearly five decades later, music remains my passion. I love working in local radio and I’m proud to be on Grantham’s Hive FM, a community station that is local, vibrant and full of heart. Tune in every weekday morning from 9 as we dig into the Goldmine."],
    image: "/presenters/willie-mac.webp",
  },
  {
    slug: "ashley-coulson",
    name: "Ashley Coulson",
    showName: "The Tartan Tonic",
    showTitle: "The Tartan Tonic with Ashley Coulson",
    slotLabel: "Thursdays 10am",
    onDemand: "the-tartan-tonic-with-ashley-coulson",
    shortBio: "I've been on the airwaves since 2016, hosting numerous radio shows that reflect my wide and varied taste in music.",
    bio: ["I've been on the airwaves since 2016, hosting numerous radio shows that reflect my wide and varied taste in music. After running my own show on Mixcloud, I'm excited to bring my passion for music to Hive FM. With a deep love for unearthing hidden gems and timeless tracks, I'm thrilled to share this eclectic music journey with you. Tune in every Thursday morning from 10am For the Tartan Tonic!"],
    image: "/presenters/ashley-coulson.webp",
  },
  {
    slug: "ian-thacker",
    name: "Ian Thacker",
    showName: "Drivetime",
    showTitle: "Drivetime with Ian Thacker",
    slotLabel: "Weekdays 3pm – 6pm",
    onDemand: "drivetime-with-ian-thacker",
    shortBio: "I made my first radio from a kit in the 70’s, from then on I was hooked.",
    bio: ["I made my first radio from a kit in the 70’s, from then on I was hooked. Back then I was an avid listener to the second incarnation of Radio Caroline, back on the old 319 Metres Medium Wave, so much so that I was listening when they announced that they were sinking! Although I have worked for many years behind the scenes in Local TV, it is wonderful to serve the people of Grantham on Hive FM every weekday with Drivetime between 3pm and 6pm."],
    image: "/presenters/ian-thacker.webp",
  },
  {
    slug: "vince-frank",
    name: "Vince Frank",
    showName: "Soul & Motown Spectacular",
    showTitle: "Soul and Motown Spectacular with Vince Frank",
    slotLabel: "Mondays 6pm",
    onDemand: "soul-and-motown-spectacular-with-vince-frank",
    shortBio: "I have a lifetime love of radio and soul music.",
    bio: ["I have a lifetime love of radio and soul music. For over fifty years I have met many soul music lovers all over the UK and beyond. Away from the music scene, I am a dedicated family man and have been married 53 years to my soulmate Dianne. We have had four children and now have 6 wonderful grandchildren. I am now retired and free to pursue my love of soul music on the radio every Monday at 6pm."],
    image: "/presenters/vince-frank.webp",
  },
  {
    slug: "ian-selby",
    name: "Ian Selby",
    shortBio: "Radio presenting started for me at Bailrigg FM's Lancaster University student radio station, where I presented for 4 years and became…",
    bio: ["Radio presenting started for me at Bailrigg FM's Lancaster University student radio station, where I presented for 4 years and became the station manager. In addition I've presented on several local stations including at nearby Lincoln City Radio. Just when I thought my presenting days were past me, I'm delighted to be making a comeback for our local community radio station here at Hive FM."],
    image: "/presenters/ian-selby.webp",
  },
  {
    slug: "david-barnett",
    name: "David Barnett",
    showName: "Alternative Indie",
    showTitle: "Alternative Indie with David Barnett",
    slotLabel: "Tuesdays 8pm",
    onDemand: "alternative-indie-with-david-barnett",
    shortBio: "After cutting my DJ teeth in clubs on Soul & Motown my musical tastes wandered through Prog Rock, Modern Jazz, singer/songwriters,…",
    bio: ["After cutting my DJ teeth in clubs on Soul & Motown my musical tastes wandered through Prog Rock, Modern Jazz, singer/songwriters, Celtic rock and into Indie, not ignoring on the way much of the popular music of the day. A Saturday morning show on the now defunct “Brecks FM” in East Anglia gave me my radio debut. Alternative Indie focuses on many “unsung” artists (and some famous ones) from the 21st century making melodic and interesting music so join me every Tuesday at 8pm."],
    image: "/presenters/david-barnett.webp",
  },
  {
    slug: "paul-o-reilly",
    name: "Paul O'Reilly",
    showName: "The PM Show",
    showTitle: "The PM Show with Paul and Marie",
    slotLabel: "Wednesday evenings",
    onDemand: "the-pm-show-with-paul-and-marie",
    shortBio: "I’m Paul - recent to radio presenting, but certainly not new to loving music!",
    bio: ["I’m Paul - recent to radio presenting, but certainly not new to loving music! A lifelong fan of just about every genre (with a soft spot for 80s bangers and classic rock riffs), I'm thrilled to co-host The PM Show with Marie Reid on Wednesday evenings.The PM Show is like a musical mystery tour with two friends and no GPS… Together, we bring you a mix of great music, good chat, and that midweek pick-me-up you didn’t know you needed."],
    image: "/presenters/paul-o-reilly.webp",
  },
  {
    slug: "marie-reid",
    name: "Marie Reid",
    showName: "The PM Show",
    showTitle: "The PM Show with Paul and Marie",
    slotLabel: "Wednesdays 6pm – 8pm (2nd–4th weeks)",
    onDemand: "the-pm-show-with-paul-and-marie",
    shortBio: "I'm your friendly neighbourhood novice radio presenter spinning tunes and sharing stories to brighten your day.",
    bio: ["I'm your friendly neighbourhood novice radio presenter spinning tunes and sharing stories to brighten your day. I have an eclectic taste in music and love the 60's, 70's and 80's. The lyrics and words of songs mean as much to me as does the tune. I'm doing a Wednesday evening show 6-8pm on the 2nd, 3rd and 4th week of each month along with Paul O'Reilly. Join us and tune in for good vibes and great chats! The PM Show on 97.2 Hive FM. Great music you can feel in your heart and soul."],
    image: "/presenters/marie-reid.webp",
  },
  {
    slug: "guy-jogoo",
    name: "Guy Jogoo",
    showName: "The Lunch Hive",
    showTitle: "The Lunch Hive with Guy Jogoo",
    slotLabel: "Weekdays 12pm – 3pm",
    onDemand: "the-lunch-hive-with-guy-jogoo",
    shortBio: "My love of radio began as a 12 year old scanning stations on my Binatone Worldstar radio !",
    bio: ["My love of radio began as a 12 year old scanning stations on my Binatone Worldstar radio ! This was later followed up by a stint on hospital radio and then a 42-year career in professional radio that continues to this day. Join me for The Lunch Hive, weekdays midday to 3pm and if you’re into your 80’s music, check out The 80’s Rollback, Wednesdays at 8pm."],
    image: "/presenters/guy-jogoo.webp",
  },
  {
    slug: "shaun-james",
    name: "Shaun James",
    showName: "The Shaun James Music Lounge",
    showTitle: "The Shaun James Music Lounge",
    onDemand: "the-shaun-james-music-lounge",
    shortBio: "I'm a local singer and musician.",
    bio: ["I'm a local singer and musician. You may have seen me over the years in many bands including Reinst80'd, Ska'd 4 Life, Breakout, BFCH and Desperate Oats, as well as my solo projects. Music has always been my passion and I'm looking forward to sharing it with you all on my new radio show."],
    image: "/presenters/shaun-james.webp",
  },
  {
    slug: "roger-church",
    name: "Roger Church",
    showName: "Church on Thursday",
    showTitle: "Church on Thursday with Roger Church",
    slotLabel: "Thursdays 6pm",
    onDemand: "church-on-thursday-with-roger-church",
    shortBio: "Grantham born and bred, a true Lincolnshire Yellow Belly, “A.K.A.",
    bio: ["Grantham born and bred, a true Lincolnshire Yellow Belly, “A.K.A. Master Craftsman”. I started my radio journey in the 1970’s with Grantham hospital’s Radio Witham, where I became assistant manager with the late Brian Clarke, my mentor. I moved on to Grantham community radio, Priory FM and Gravity FM, and have now arrived at my new home, Hive FM where I look forward to entertaining you, Thursdays at 6pm."],
    image: "/presenters/roger-church.webp",
  },
  {
    slug: "steve-healey",
    name: "Steve Healey",
    showName: "Rock of Ages",
    showTitle: "Rock of Ages: The Radio Show with Steve Healey",
    slotLabel: "Sundays 5pm",
    onDemand: "rock-of-ages-the-radio-show-with-steve-healey",
    shortBio: "Steve Healey here!",
    bio: ["Steve Healey here! I am a film production lecturer and have worked in the film industry for many years from Hollyoaks to Hollywood! Music-wise, I love my rock so make sure you join me every Sunday afternoon at 5pm for Rock Of Ages. 2 hours of the biggest names and bands in rock!"],
    image: "/presenters/steve-healey.webp",
  },
  {
    slug: "the-gingerbread-man",
    name: "The Gingerbread Man",
    showName: "The Weekend Warm Up",
    showTitle: "The Gingerbread Man with The Weekend Warm Up",
    slotLabel: "Friday nights",
    onDemand: "the-gingerbread-man-with-the-weekend-warm-up",
    shortBio: "I was cooked up in Grantham nearly 300 years ago by accident.",
    bio: ["I was cooked up in Grantham nearly 300 years ago by accident. Recently brought back to life by Hive FM to entertain you on Friday Nights.... Come take a bite!"],
    image: "/presenters/the-gingerbread-man.webp",
    imageFit: 'contain',
  },
  {
    slug: "nev-eaglen",
    name: "Nev Eaglen",
    showName: "Friday Night Fun",
    showTitle: "Friday Night Fun with Nev Eaglen",
    onDemand: "friday-night-fun-with-nev-eaglen",
    shortBio: "My love for local radio started when Lincolnshire got its own commercial station on 102.2 FM.",
    bio: ["My love for local radio started when Lincolnshire got its own commercial station on 102.2 FM. I have been broadcasting on local radio in Grantham for many years. I started on Priory FM presenting the overnight show and then moved to presenting shows on 97.2 Gravity FM on Friday nights and now I'm back on 97.2 Hive FM."],
    image: "/presenters/nev-eaglen.webp",
  },
  {
    slug: "james-dale",
    name: "James Dale",
    showName: "James Dale at Breakfast",
    showTitle: "James Dale at Breakfast",
    slotLabel: "Weekends from 6am",
    onDemand: "james-dale-at-breakfast",
    shortBio: "Hailing from Grantham, I've always had a passion for radio that sparked during my childhood.",
    bio: ["Hailing from Grantham, I've always had a passion for radio that sparked during my childhood. My love for music led me to pursue DJing, a hobby that blossomed into a thrilling venture. With experience spinning tracks at parties and weddings, I pride myself on creating unforgettable moments and getting people dancing. When I'm not on air or behind the decks, you can find me travelling to new places, seeking inspiration from different cultures and sounds. Tune in for Breakfast at the weekend from 6am."],
    image: "/presenters/james-dale.webp",
  },
  {
    slug: "andy-antony",
    name: "Andy Antony",
    showName: "Tunes at Ten",
    showTitle: "Tunes at Ten with Andy Antony",
    slotLabel: "Saturdays 10am",
    shortBio: "I'm from London and have resided in Grantham since 2017.",
    bio: ["I'm from London and have resided in Grantham since 2017. I’m a member of the St Peter’s Hill Dramatic Society as well as other amazing local groups. I enjoy writing, being in and directing shows that we put on in our wonderful Guildhall. Also I have been a DJ at Hive FM since it began and love meeting Grantham’s people, and going through their memories, and top songs on my Saturday show ‘Tunes at Ten’. I’ve also got a show that covers the Jazz genre on Monday nights 8-10pm. There’s such a vast and varied collection of music here at Hive FM and I love being part of this family."],
    image: "/presenters/andy-antony.webp",
  },
  {
    slug: "ela-watts",
    name: "Ela Watts",
    showName: "Ela's Saturday Shout",
    showTitle: "Ela's Saturday Shout with Ela Watts",
    slotLabel: "Saturdays 12pm",
    onDemand: "elas-saturday-shout-with-ela-watts",
    shortBio: "It may be fun to charter an accountant, but I retired from all that for my favourite volunteer role – community radio presenter.",
    bio: ["It may be fun to charter an accountant, but I retired from all that for my favourite volunteer role – community radio presenter. What a privilege to be part of 97.2 Hive FM, the community radio station for Grantham and beyond. Just tune in to all the fabulous 97.2 Hive FM programmes, and I look forward to your company every Saturday at 12 for Ela's Saturday Shout Out. You know it’s no fun without you."],
    image: "/presenters/ela-watts.webp",
  },
  {
    slug: "matt-colbourne",
    name: "Matt Colbourne",
    shortBio: "I've been presenting for a while now and mostly known for my work at Radio Newark.",
    bio: ["I've been presenting for a while now and mostly known for my work at Radio Newark. I'm also known for my humour and engaging personality, often participating in fun challenges and events on air. I'm a big fan of 80's movies, with 'Stand By Me' being my all-time favourite. I also have a playful side, once having my legs waxed on air to show solidarity with female grooming routines."],
    image: "/presenters/matt-colbourne.webp",
  },
  {
    slug: "rob-jackson",
    name: "Rob Jackson",
    showName: "Country Vibes",
    showTitle: "Rob Jackson with Country Vibes",
    slotLabel: "Sundays 7pm",
    onDemand: "rob-jackson-with-country-vibes",
    shortBio: "Well this is a surprise!",
    bio: ["Well this is a surprise! I've always liked the idea of doing some radio presenting and here I am 'living the dream!' My kids, 31 and 29, won't believe it, particularly when they learn it's a new country music show on Sunday nights at 7:00 pm. My musical tastes have travelled a long way in 60 years and this seems to be where they've found their natural home."],
    image: "/presenters/rob-jackson.webp",
  },
  {
    slug: "lee-everest",
    name: "Lee Everest",
    showName: "Ready for the Weekend",
    showTitle: "Ready for the Weekend with Lee Everest",
    slotLabel: "Friday nights",
    onDemand: "ready-for-the-weekend-with-lee-everest",
    shortBio: "Get into the weekend here with me, Lee Everest.",
    bio: ["Get into the weekend here with me, Lee Everest. I live for dance music and it's my passion. Join me for the greatest club classics and current anthems to kick start your Friday night."],
    image: "/presenters/lee-everest.webp",
  },
  {
    slug: "ian-smith",
    name: "Ian Smith",
    showName: "Ones at One",
    showTitle: "Ian Smith with Ones at One",
    slotLabel: "Sundays 1pm",
    onDemand: "ian-smith-with-ones-at-one",
    shortBio: "I suppose I'd better introduce myself as a presenter here at Hive FM.",
    bio: ["I suppose I'd better introduce myself as a presenter here at Hive FM. Ian Smith's the name and music is my passion as it has been for the last 50 years. It all started behind mobile disco decks and now for the past 15 years from behind the mic in radio studios. I really enjoy live concerts and especially 60s & 70s music. Join me every Sunday at 1:00 pm for Ones at One."],
    image: "/presenters/ian-smith.webp",
  },
  {
    slug: "elvis-stooke",
    name: "Elvis Stooke",
    showName: "Love your Saturday Night Dancefloor",
    showTitle: "Love your Saturday Night Dancefloor with Elvis Stooke",
    slotLabel: "Saturdays 7pm",
    onDemand: "love-your-saturday-night-dancefloor-with-elvis-stooke",
    shortBio: "I love Grantham and I'm passionate about supporting our community.",
    bio: ["I love Grantham and I'm passionate about supporting our community. Radio is a great medium to bring people together with its immediacy and local content. Connecting our people and bringing up to date information on community events is a brilliant way to bring people together. I was involved in presenting on a previous radio station and being able to be a part of the team for Hive FM is the honey to the pot. Join me every Saturday from 7pm for my \"Love Your Saturday Night Dance Floor'. Perfect if you're getting ready to go out, or holding a kitchen disco !"],
    image: "/presenters/elvis-stooke.webp",
  },
  {
    slug: "mark-roberts",
    name: "Mark Roberts",
    showName: "The Sunday Jukebox",
    showTitle: "The Sunday Jukebox with Mark Roberts",
    slotLabel: "Sundays",
    onDemand: "the-sunday-jukebox-with-mark-roberts",
    shortBio: "I am born and bred in Grantham and I attended the National Junior & Central schools.",
    bio: ["I am born and bred in Grantham and I attended the National Junior & Central schools. I have worked for many years as a bus driver in and around Lincolnshire, and my interests are mainly football, particularly Liverpool FC and I also like to attend the Meres to watch Grantham Town as often as possible. I enjoy a wide range of music from brass bands to Rag 'n' Bone Man and everything in between. I have been involved in local radio for over 20 years starting out on hospital radio in Grantham. I live in Grantham with my wife and 2 dogs. My show is 'The Sunday Jukebox'... A request show as I enjoy the interaction with my listener. There will also be the odd quiz to test the grey matter."],
    image: "/presenters/mark-roberts.webp",
  },
  {
    slug: "laura-towning",
    name: "Laura Towning",
    showName: "Laura's Sunday Special",
    showTitle: "Laura's Sunday Special",
    slotLabel: "Sundays 10am",
    onDemand: "lauras-sunday-special",
    shortBio: "I'm Laura and from the age of seven, I used to record my own radio shows on a cassette player in my bedroom.",
    bio: ["I'm Laura and from the age of seven, I used to record my own radio shows on a cassette player in my bedroom. Roll on however many years later, I now have the opportunity to be in a real radio studio. I'm super excited bringing you my Sunday Special every Sunday morning at 10am. It's the perfect way to start your Sunday after a well deserved lie in ! Can't wait for you to join me."],
    image: "/presenters/laura-towning.webp",
  },
  {
    slug: "ady-crampton",
    name: "Ady Crampton",
    showName: "The 70s Soul Show",
    showTitle: "Ady Crampton with The 70's Soul Show",
    onDemand: "ady-crampton-with-the-70s-soul-show",
    shortBio: "Listening to and playing music has always been a large part of my life.",
    bio: ["Listening to and playing music has always been a large part of my life. I bought my first vinyl in 1974 aged 7, by 1983 I was immersed in the UK scooter scene and began attending the rallies which boasted ex-Wigan Casino DJs on their all-nighter line-up. There was so much music that I hadn’t heard before and of course, as there was a record bar in each venue, my record collection increased although never as much as my wants list. I really get a kick out of sharing my passion for music and have enjoyed playing my 70s soul, funk and disco records to the world ever since."],
    image: "/presenters/ady-crampton.webp",
  },
  {
    slug: "harry-chapman",
    name: "Harry Chapman",
    showName: "Early Risers",
    showTitle: "Early Risers with Harry Chapman",
    slotLabel: "Weekdays 6am",
    onDemand: "early-risers-with-harry-chapman",
    shortBio: "This is my first time in radio.",
    bio: ["This is my first time in radio. I'm 15 and love every bit of it. You though, the listener is what really makes it worthwhile! I love people stories, I like telling stories and I love being part of such an amazing community driven team. I'll be here every weekday from 6am with Early Risers. I hope you can join me!"],
    image: "/presenters/harry-chapman.webp",
  },
  {
    slug: "andy-mccall",
    name: "Andy McCall",
    showName: "Classic Floor Fillers",
    showTitle: "Classic Floor Fillers with Andy McCall",
    slotLabel: "Saturdays 10pm",
    onDemand: "classic-floor-fillers-with-andy-mccall",
    shortBio: "I first became involved in community radio when Lincoln Castle Radio got it's first Restricted Service Licence (RSL) in 1988.",
    bio: ["I first became involved in community radio when Lincoln Castle Radio got it's first Restricted Service Licence (RSL) in 1988. In 1990 I joined BBC Radio Lincolnshire's youth programme “Livewire” which I both produced and presented, which led on to being a freelance Broadcast Assistant at the station and also doing some work at Broadcasting House for Radio 4 and BBC News. After that I was involved in the very first RSL to be granted to Gravity FM in 1997. Fast forward to now and I'm delighted to have joined the Hive FM team and look forward to bothering your ears every Saturday night at 10pm with Classic Floor Fillers."],
    image: "/presenters/andy-mccall.webp",
  },
  {
    slug: "paul-green",
    name: "Paul Green",
    showName: "Mr G's Time Travel Groove",
    showTitle: "Mr G's Time Travel Groove with Paul Green",
    slotLabel: "Saturdays 5pm",
    onDemand: "mr-gs-time-travel-groove-with-paul-green",
    shortBio: "Retired Army Veteran and School teacher I've always had a passion for soul and disco music.",
    bio: ["Retired Army Veteran and School teacher I've always had a passion for soul and disco music. I Started DJing in local pubs and clubs throughout the 80s and have a big passion for soul, funk and disco music. Recently i retired from teaching and found myself helping out behind the scenes at Hive FM. You can join me every saturday from 5pm for my Time Travel Groove!"],
    image: "/presenters/paul-green.webp",
  },
  {
    slug: "brian-coulson",
    name: "Brian Coulson",
    shortBio: "A local businessman i started helping out at Granthams Local Radio Station in 2017.",
    bio: ["A local businessman i started helping out at Granthams Local Radio Station in 2017. I have a passion for rock music both new and old, i occasionally help out here at Hive FM"],
    image: "/presenters/brian-coulson.webp",
  },
  {
    slug: "mick-hall",
    name: "Mick Hall",
    showName: "That 90's & 00's Show",
    showTitle: "That 90's and 00's Show with Mick Hall",
    slotLabel: "Wednesdays 10pm",
    onDemand: "that-90s-and-00s-show-with-mick-hall",
    shortBio: "Lockdown was tough, but it also reminded me how much I love music.",
    bio: ["Lockdown was tough, but it also reminded me how much I love music. Back in the day, I got hooked on mobile discos, learning the ropes and later moving onto the pub and club scene. Life, marriage, and the years rolled by, and I stepped away for a while. Fast forward to lockdown—I started doing online sets, which reignited the spark. That led to a regular community radio show, then “That 80’s & 90’s Show” on another station. Now I’m having a blast hosting “That 90’s & 00’s Show,” right here on Hive FM every Wednesday at 10pm."],
    image: "/presenters/mick-hall.webp",
  },
  {
    slug: "keith-copeland-mbe",
    name: "Keith Copeland MBE",
    shortBio: "Part of the Hive FM presenting team.",
    bio: ["Biography coming soon."],
    image: "/presenters/keith-copeland-mbe.webp",
  },
  {
    slug: 'alastair-hawken',
    name: 'Alastair Hawken',
    showName: 'The Buzz',
    showTitle: 'The Buzz with Alastair Hawken',
    slotLabel: 'Saturdays 2pm',
    onDemand: 'the-buzz-with-alastair-hawken',
    shortBio: 'Presenter of The Buzz on Hive FM.',
    bio: ['A full biography is coming soon.'],
  },
]

/** Station team shown on the old site's presenter list but who aren't presenters. */
export const team: TeamMember[] = [
  {
    name: "Rob Dixon (Robby Bobby)",
    role: "Lead Fundraiser and Advertising Specialist",
    bio: "Lead Fundraiser and Advertising Specialist here at Hive FM. Get in touch with me to advertise your business! advertising@hivefm.org",
    image: "/presenters/rob-dixon.webp",
  },
  {
    name: "Susan Swinburn (Queen Bee)",
    role: "CEO, South Lincolnshire Blind Society",
    bio: "CEO of South Lincolnshire Blind Society. The mastermind behind the operation and the reason we're all here.",
    image: "/presenters/susan-swinburn.webp",
  },
]

export function getPresenter(slug: string): Presenter | undefined {
  return presenters.find((p) => p.slug === slug)
}

/**
 * Lower rank shows first: daily weekday shows, then other regular weekly slots,
 * then shows with no fixed slot listed, then presenters with no show listed.
 * Sorting is stable, so ties keep the original hivefm.org order.
 */
function showRank(presenter: Presenter): number {
  if (!presenter.showName) return 3
  if (!presenter.slotLabel) return 2
  return presenter.slotLabel.startsWith('Weekdays') ? 0 : 1
}

/** Swap for an API fetch later; callers already await it. */
export async function getPresenters(): Promise<Presenter[]> {
  return [...presenters].sort((a, b) => showRank(a) - showRank(b))
}
