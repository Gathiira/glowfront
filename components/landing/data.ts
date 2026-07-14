export type Review = {
  name: string
  location: string
  text: string
}

export const reviews: Review[] = [
  { name: "Lucy", location: "Nairobi", text: "Great experience, easy to book. Paying for treatments is so convenient — no cash or cards needed!" },
  { name: "Dan", location: "Mombasa", text: "Glowbuddy's reminders make life so much easier. I also found a few good barbershops that I didn't know existed." },
  { name: "Dale", location: "Kisumu", text: "I've been using Glowbuddy for two years and it's by far the best booking platform I've used. Highly recommend it!" },
  { name: "Cameron", location: "Nakuru", text: "Glowbuddy is my go-to app for massages and facials. I can easily find and book places near me — I love it!" },
  { name: "Ciara", location: "Eldoret", text: "Recently moved to a new city and didn't know any salons. Glowbuddy gave me a whole new list to choose from!" },
  { name: "Jonny", location: "Thika", text: "Such a sleek and powerful app. I highly recommend booking your appointments on Glowbuddy." },
  { name: "Anton", location: "Malindi", text: "My clients love booking appointments online with Glowbuddy. The consultation forms and free SMS reminders are so convenient." },
  { name: "Susan", location: "Nyeri", text: "Love this beauty booking app. There are so many great features to explore. The consultation forms and client reminder texts are great – best of all, it's free." },
  { name: "S. Derby", location: "Machakos", text: "Glowbuddy makes it easy to book my salon and beauty appointments anytime I want, rather than having to wait until the salon is open." },
  { name: "C. M.", location: "Kitale", text: "I've had four massage treatments with a specialist I found on the Glowbuddy platform. Booking an appointment is very easy – and the massages are brilliant." },
  { name: "S.", location: "Garissa", text: "I don't have to spend ages calling salons to book appointments, I can just instantly book with Glowbuddy! It's the best salon booking software." },
  { name: "Ivory", location: "Meru", text: "I love the concept of this booking app! It's so easy to browse and find the perfect salons. So glad I discovered it." },
  { name: "Agnesa", location: "Nanyuki", text: "Moving to Glowbuddy has been the best decision for my business. My stylists and clients all love the app. It has completely transformed my operation." },
  { name: "Jess", location: "Naivasha", text: "Absolutely amazing app for booking appointments with salons and spas. Love how easy it is to book at all times of the day/night." },
  { name: "Pamela", location: "Embu", text: "Glowbuddy lets you pick the day, time and stylist, gives a price and timeframe for all services. Perfect." },
  { name: "Jessica", location: "Kilifi", text: "Hands down the best app for online appointment bookings. I can find hundreds of services in my area." },
  { name: "Pat", location: "Lamu", text: "I can conveniently plan for pedicures any time or day. Works brilliantly." },
  { name: "Kristina", location: "Isiolo", text: "Glowbuddy makes it all easy: finding beauty services nearby, appointment scheduling, canceling, or rescheduling." },
  { name: "Antonietta", location: "Voi", text: "I love how I can search for salons close to me that I didn't even know existed." },
  { name: "Sara", location: "Homa Bay", text: "Glowbuddy is so easy to use, with lots of salons and wellness treatments." },
  { name: "Jordan", location: "Bungoma", text: "Great booking app as you can easily book appointments, pay and rate your experience all through this platform." },
  { name: "Emily", location: "Ruiru", text: "Brilliant salon app for discovering new local businesses. Easy to book appointments online." },
  { name: "Yuri", location: "Kikuyu", text: "I wish everyone in the service beauty industry had this system. So easy and convenient to use." },
  { name: "Amanda", location: "Kericho", text: "Easy to use on the go. Once you're signed in, you can book, amend or cancel appointments anytime." },
  { name: "Josie", location: "Nairobi", text: "Love to be able to book online instead of having to ring salons several times." },
  { name: "Kevin", location: "Mombasa", text: "So easy to use and great to find the best salons in my area!" },
  { name: "Nathaniel", location: "Nairobi", text: "This app is great for scheduling and keeping up with my barbers appointments." },
  { name: "Sylvester", location: "Kisumu", text: "I love the slick and sleek look and feel of this booking software." },
]

export const cityLinks: { city: string; links: string[] }[] = [
  { city: "Nairobi", links: ["Hair Salons", "Nail Salons", "Eyebrows & Lashes", "Beauty Salons", "Barbers", "Massages", "Spas & Saunas", "Waxing Salons"] },
  { city: "Mombasa", links: ["Hair Salons", "Nail Salons", "Eyebrows & Lashes", "Beauty Salons", "Barbers", "Massages", "Spas & Saunas", "Waxing Salons"] },
  { city: "Kisumu", links: ["Hair Salons", "Nail Salons", "Eyebrows & Lashes", "Beauty Salons", "Barbers", "Massages", "Spas & Saunas", "Waxing Salons"] },
  { city: "Nakuru", links: ["Hair Salons", "Nail Salons", "Eyebrows & Lashes", "Beauty Salons", "Barbers", "Massages", "Spas & Saunas", "Waxing Salons"] },
]

export const countries = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika",
  "Malindi", "Nyeri", "Nanyuki", "Machakos", "Ruiru", "Kikuyu",
  "Kitale", "Kericho", "Garissa", "Meru", "Embu", "Naivasha",
  "Kilifi", "Lamu", "Isiolo", "Voi", "Homa Bay", "Bungoma",
]

export const allCategories = [
  "Beauty Salons", "Eyebrows & Lashes", "Nail Salons", "Hair Salons",
  "Massages", "Waxing Salons", "Medspas", "Barbers", "Spas & Saunas",
  "Tattooing & Piercing",
]

export const businessTestimonials = [
  { name: "Chris Ward", title: "Founder of HUCKLE", location: "Nairobi", text: "Glowbuddy is so easy to manage my team", fullText: "I work with booth renters at my top-rated salon in Nairobi. I love Glowbuddy because it offers my clients a professional appointment booking experience with seamless online booking features, automated reminder emails and texts, advanced POS capabilities and the best payment processing rates I could get for my salon business.", rating: 5 },
  { name: "Pamela B", title: "Salon owner, Nairobi", location: "Nairobi", text: "My clients love it", fullText: "Glowbuddy is the top-rated salon software with all the advanced features you need to operate as a salon business. The marketplace has been incredible for our salon business too, we have hundreds of client reviews and we've increased sales by 31%.", rating: 5 },
  { name: "Alex E", title: "Hair stylist and owner", location: "Mombasa", text: "Powerful Scheduling", fullText: "This appointment scheduling software is very user friendly! I have 3 business locations and Glowbuddy meets all my business needs and more. It's a truly fantastic product, and hands down the best salon scheduling system I've seen.", rating: 5 },
  { name: "Gayle S", title: "Business owner", location: "Kisumu", text: "Smart Salon Software", fullText: "Glowbuddy is the most advanced salon software in beauty and wellness. It comes packed with smart features for appointment scheduling, point-of-sales (POS), marketing features and financial reports all built for salons and beauty businesses.", rating: 5 },
  { name: "Bianca", title: "Business owner", location: "Nakuru", text: "Booking Made Easy", fullText: "I am a freelance makeup artist who has been searching for a salon scheduling app that can make appointment bookings easy. My experience with Glowbuddy has been great thus far, and I don't see myself moving away from it anytime soon.", rating: 5 },
  { name: "Emily P", title: "Salon Owner", location: "Eldoret", text: "Simplify Salon Scheduling", fullText: "Coming from a much more complicated system like MINDBODY or Booksy, Glowbuddy was so wonderfully easy to figure out and implement. Customer service has always been so kind and responsive.", rating: 5 },
  { name: "Warren D", title: "Psychotherapist", location: "Thika", text: "Easy Payments, Bookings", fullText: "Client payments and booking appointments is now a breeze. The 'pay as you go' model is ideal for small companies starting out, but powerful for those already going full steam.", rating: 5 },
  { name: "Kat M", title: "Salon Owner", location: "Malindi", text: "Effortless Salon Management", fullText: "Glowbuddy makes running my salon business so much easier. The booking calendar is the best, it comes with appointment reminders, advanced POS features and leading payment rates. Moving from Treatwell was a great decision.", rating: 5 },
  { name: "Sean-Jordan Baruch", title: "Business owner", location: "Nyeri", text: "Best salon software", fullText: "Glowbuddy is the top salon software. The salon booking system is designed with simplicity for the end-user. It's a genius concept that offers a great service with well priced business software.", rating: 5 },
  { name: "Osama Kaddah", title: "Business owner", location: "Machakos", text: "Boost sales", fullText: "The smart marketing system has shown us an increase of sales and salon client retention, and using the analytics system, we were able to control study analytics in a great way.", rating: 5 },
  { name: "Sally Coles-Robertson", title: "Business owner", location: "Kitale", text: "Smart Analytics", fullText: "The analytics and client payment features on Glowbuddy are ahead of the game. There's so many advantages and I'm a great advocate of Glowbuddy whenever possible.", rating: 5 },
  { name: "Tina A", title: "Owner/Manager", location: "Meru", text: "Ultimate Salon Solution", fullText: "It's the best Salon Booking system with client management & reporting functionality for improved productivity. My team is always satisfied with its functionality and ease of access.", rating: 5 },
  { name: "Jilly", title: "Business owner", location: "Nanyuki", text: "Amazing software", fullText: "Glowbuddy has literally changed my life! I have so much more time to myself and have stopped paying hefty monthly fees when the salon is closed.", rating: 5 },
  { name: "Mary M", title: "Business owner", location: "Naivasha", text: "Recommend to all", fullText: "Amazing scheduling system for salons and spas. One of the most efficient booking systems I have ever used! I definitely recommend this to any business owner.", rating: 5 },
  { name: "Grace Y", title: "Salon Owner", location: "Embu", text: "Online Salon Software", fullText: "I've used salon iris, phorest and other paid salon software and they are nowhere near as good as Glowbuddy. I love their customer service and support.", rating: 5 },
  { name: "Suzanne B", title: "Business owner", location: "Kilifi", text: "Simplify Salon Management", fullText: "The easiest salon software I have ever used! My business runs so smoothly now and I can manage everything on the go. It has all the features a salon needs.", rating: 5 },
  { name: "Carley W", title: "Owner, aesthetician", location: "Lamu", text: "Beauty Industry's Best", fullText: "Glowbuddy is the best software for salons, spas and massage therapists! Having the POS system already integrated to the salon software makes payment easy.", rating: 5 },
]

export const businessFaqs = [
  { question: "What makes Glowbuddy the leading platform for businesses in beauty and wellness?", answer: "Glowbuddy is the world's leading booking platform for beauty and wellness businesses. We offer a complete suite of tools including online booking, POS, marketing automation, and client management — all with no upfront costs and transparent pricing. Our marketplace connects you with millions of clients looking to book their next appointment." },
  { question: "How does Glowbuddy help my business grow?", answer: "Glowbuddy helps you grow by listing your business on the world's largest beauty and wellness marketplace, reaching millions of potential clients. Our marketing tools help you retain clients with automated reminders, promotions, and loyalty programs. Partners using Glowbuddy see an average of 26% more clients and 20% more sales." },
  { question: "Are there any hidden costs?", answer: "No. Glowbuddy is transparent with its pricing. You only pay when you get paid — with our pay-as-you-go model. There are no monthly subscription fees, no setup costs, and no hidden charges. You get access to all core features for free." },
  { question: "Is there a minimum commitment or contract?", answer: "No minimum commitment or long-term contract required. You can use Glowbuddy on a month-to-month basis with complete flexibility. Start, pause, or stop anytime — it's entirely up to you." },
  { question: "Does Glowbuddy support businesses of all sizes?", answer: "Absolutely. Glowbuddy is designed for businesses of all sizes — from independent freelancers and single-location salons to multi-location enterprises with hundreds of staff. Our platform scales with your business." },
  { question: "What types of businesses can use Glowbuddy?", answer: "Glowbuddy supports a wide range of beauty and wellness businesses including hair salons, barbershops, nail salons, spas, medspas, massage therapists, fitness studios, tattoo & piercing studios, pet groomers, tanning studios, and more." },
  { question: "How can Glowbuddy help reduce no-shows?", answer: "Glowbuddy reduces no-shows with automated SMS and email reminders, and the option to take deposits or full upfront payments at the time of booking. Partners using these features see up to 89% fewer no-shows." },
  { question: "Can I migrate my data from my previous system to Glowbuddy?", answer: "Yes. Our migration support team can help bring your data from other platforms including MINDBODY, Booksy, Timely, Treatwell, and more. We make the switch as smooth and seamless as possible." },
]

export const gradients = [
  "from-blue-400/20 to-blue-600/10",
  "from-pink-400/20 to-pink-600/10",
  "from-purple-400/20 to-purple-600/10",
  "from-green-400/20 to-green-600/10",
  "from-amber-400/20 to-amber-600/10",
  "from-rose-400/20 to-rose-600/10",
  "from-cyan-400/20 to-cyan-600/10",
  "from-indigo-400/20 to-indigo-600/10",
  "from-teal-400/20 to-teal-600/10",
  "from-orange-400/20 to-orange-600/10",
  "from-violet-400/20 to-violet-600/10",
  "from-fuchsia-400/20 to-fuchsia-600/10",
]
