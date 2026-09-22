/**
 * CLIENT CONFIGURATION
 * --------------------
 * Change client-specific content here. Keep quotation marks and commas intact.
 * Ported verbatim from the static site's assets/js/config.js - the only change
 * is `export const config` in place of `window.INVITATION_CONFIG`, and the
 * media paths are rooted at "/media/..." for the bundler's public/ folder.
 */

export const config = {
  site: {
    title: "Saher & Harmeet · Wedding Invitation",
    description:
      "You're warmly invited to celebrate the wedding of Saher & Harmeet 8–11 December 2026, Surat.",
  },

  couple: {
    brideInitial: "S",
    groomInitial: "H",
    bride: {
      name: "Saher",
      relation: "Daughter of",
      parents: "Anil & Mahek Nandwani",
    },
    groom: {
      name: "Harmeet Singh",
      relation: "Son of",
      parents: "Tejpal Singh & Navdeep Kaur Walia",
    },
  },

  copy: {
    bismillah: "Om Shri Ganeshay Namah",
    bismillahTranslation: "With the divine blessings",
    bismillahSanskrit: "॥ ॐ श्री गणेशाय नमः ॥",
    welcomeLine:
      "Grandparents\nLate Ramnarayan & Late Shanti Devi Nandwani\n\nLet us come together to celebrate love, laughter\n& a happily-ever after union of two souls",
    invitation:
      "",
    heroClosing:
      "as they begin their forever\nin love and blessings.",
    welcomeTitle: "A Blessed Beginning",
    welcomeBody:
      "With hearts full of gratitude, we warmly invite you to join us as we celebrate this beautiful beginning with the love, prayers, and blessings of our families.",
    gifts:
      "Your love, blessings, and presence are the greatest gifts we could ever ask for.",
    closing:
      "Nandwani Family, Baweja Family, Madaan Family, Arora Family & Aarya Family",
  },

  wedding: {
    // Use a valid ISO date with the local UTC offset for an accurate countdown.
    isoDate: "2026-12-11T11:30:00+05:30",
    date: "December 11, 2026",
    day: "Friday",
    time: "11:30 AM",
    timezone: "IST",
  },

  media: {
    introVideo: "/media/hero-intro-video.mp4",
    introPoster: "/media/hero-intro-poster.webp",
    music: "/media/background-music.mp3",
  },

  // Main wedding-day timeline (Anand Karaj day - December 11th).
  program: [
    {
      time: "11:30 AM",
      title: "Anand Karaj",
      note: "Sacred wedding ceremony",
    },
    {
      time: "1:00 PM",
      title: "Lunch",
      note: "Sapphire Banquet Hall, Euphoria The Fine Dine",
    },
    {
      time: "6:30 PM",
      title: "Bidaai",
      note: "",
    },
  ],

  venue: {
    name: "Gurudwara Guru Tegh Bahadur Sahib",
    address:
      "Guru Nanak Dev Ji Marg, Bhatar Road, Surat",
    mapUrl: "https://maps.app.goo.gl/Yoer6GYrZmut6dQL6?g_st=ic",
  },

  dressCode: {
    title: "Festive Formal",
    description:
      "Traditional or formal attire is encouraged. Sarees, lehengas, anarkalis, sherwanis, kurtas, suits, and formal dresses are all welcome. We kindly ask guests to avoid overly casual attire and white or ivory.",
    swatches: [
      "#7A1F2B",
      "#234638",
      "#C49A56",
      "#7A4968",
      "#31506B",
    ],
  },

  // Pre-wedding functions, in date order (December 8-10).
  preWeddingEvents: [
    {
      name: "Sunder Kand Path",
      date: "December 8",
      time: "8:00 PM",
      location: "Shri Ram Mandir, Bhatar, Surat followed by Langar Prashad",
      mapLink: "https://maps.app.goo.gl/VypHqawoh9TcGFMKA?g_st=ic",
    },
    {
      name: "Saher's Dhol & Heena Mehfil",
      date: "December 9",
      time: "6:00 PM",
      location: "Rajhans Belizia, Dumas Road, Surat",
      mapLink: "https://maps.app.goo.gl/gb1doFZMG3kX9ugM9?g_st=ic",
    },
    {
      name: "Haldi by the River & Brunch Under the Sun",
      date: "December 10",
      time: "11:30 AM",
      location: "River Side, 72 Villa, Silent Zone, Near New Weekend Address, Opp. Airport, Surat",
      mapLink: "https://maps.app.goo.gl/cL8A42gVckADpZm96?g_st=ic",
    },
    {
      name: "Engagement & Sangeet night",
      date: "December 10",
      time: "7:30 PM",
      location: "72 Villa, Silent Zone, Near New Weekend Address, Opp. Airport, Surat",
      mapLink: "https://maps.app.goo.gl/cL8A42gVckADpZm96?g_st=ic",
    },
  ],

  rsvp: {
    deadline: "Kindly respond by November 15, 2026",
    contact: "For assistance, call +91 98765 43210",
    fields: {
      name: "Your full name",
      email: "Email address",
      attendance: ["Joyfully accepts", "Regretfully declines"],
      guests: ["1 guest", "2 guests", "3 guests", "4 guests"],
      note: "Dietary notes or a message for the couple",
    },
  },

  theme: {
    ivory: "#F1E3CE",       /* warm candlelit cream */
    plum: "#3A070C",        /* deepest burgundy */
    lavender: "#6F0B17",    /* wine red */
    mauve: "#A51520",       /* rose/crimson accent */
    lilac: "#D0B294",       /* warm nude / muted beige */
    champagne: "#C9A35F",   /* antique gold */
  },
};

export default config;
