export type ListingBusiness = {
  id: string
  name: string
  category: string
  location: string
  rating: number
  reviewCount: number
  imageLabel: string
  tag?: string
}

export const recommended: ListingBusiness[] = [
  { id: "r1", name: "The Address Barber - Ishbiliyah", category: "Barber", location: "Kilimani, Nairobi", rating: 4.9, reviewCount: 3909, imageLabel: "Elegant interior of The Address Barber" },
  { id: "r2", name: "SENSASIA Stories", category: "Spa & sauna", location: "Westlands, Nairobi", rating: 4.9, reviewCount: 1029, imageLabel: "Luxurious spa room at SENSASIA Stories" },
  { id: "r3", name: "PLAN B | St. Paul's", category: "Barber", location: "Nyali, Mombasa", rating: 5.0, reviewCount: 179, imageLabel: "Modern barbershop interior at PLAN B" },
  { id: "r4", name: "Yin Salon and Spa", category: "Hair Salon", location: "Lavington, Nairobi", rating: 4.9, reviewCount: 498, imageLabel: "Elegant interior of Yin Salon and Spa" },
  { id: "r5", name: "Barberhood Gents Salon", category: "Barber", location: "Milimani, Kisumu", rating: 5.0, reviewCount: 498, imageLabel: "Barberhood Gents Salon" },
  { id: "r6", name: "Backyard Barbers", category: "Barber", location: "Mombasa Road, Nairobi", rating: 5.0, reviewCount: 937, imageLabel: "Modern barber lounge at Backyard Barbers" },
  { id: "r7", name: "YARD Barber and Shop", category: "Barber", location: "Karen, Nairobi", rating: 5.0, reviewCount: 607, imageLabel: "Modern barber chairs at YARD Barber" },
  { id: "r8", name: "Dessange", category: "Hair Salon", location: "Gigiri, Nairobi", rating: 5.0, reviewCount: 217, imageLabel: "Modern salon interior at Dessange" },
  { id: "r9", name: "Beautify Me Ladies Salon & Spa", category: "Hair Salon", location: "Parklands, Nairobi", rating: 4.8, reviewCount: 516, imageLabel: "Elegant interior of Beautify Me" },
  { id: "r10", name: "Smart Cuts Barbershop", category: "Barber", location: "Nakuru Town", rating: 4.6, reviewCount: 26, imageLabel: "Modern interior of Smart Cuts Barbershop" },
  { id: "r11", name: "BOA Beauty Bar Durbanville", category: "Nails", location: "Eldoret Town", rating: 4.6, reviewCount: 8355, imageLabel: "Luxurious pink interior of BOA Beauty Bar" },
  { id: "r12", name: "Senor Gents Salon", category: "Barber", location: "Thika Road, Nairobi", rating: 5.0, reviewCount: 1635, imageLabel: "Stylish barber chairs in Senor Gents Salon" },
  { id: "r13", name: "Maison De Coiffure Beauty Lounge", category: "Beauty Salon", location: "Runda, Nairobi", rating: 4.9, reviewCount: 1425, imageLabel: "Luxurious pedicure stations at Maison De Coiffure" },
  { id: "r14", name: "Kallos House of Beauty", category: "Beauty Salon", location: "Nyeri Town", rating: 5.0, reviewCount: 715, imageLabel: "Luxurious interior of Kallos House of Beauty" },
  { id: "r15", name: "Quality Fix Gents Salon | Jaddaf", category: "Barber", location: "Machakos Town", rating: 4.9, reviewCount: 325, imageLabel: "Luxurious interior of Quality Fix Gents Salon" },
  { id: "r16", name: "The Nest Salon, Sobha Hartland", category: "Hair Salon", location: "Malindi Town", rating: 4.8, reviewCount: 145, imageLabel: "Chic interior of The Nest Salon" },
]

export const newBusinesses: ListingBusiness[] = [
  { id: "n1", name: "Strands On Fleek Hair & Nail Bar", category: "Hair Salon", location: "Kilimani, Nairobi", rating: 4.9, reviewCount: 94, imageLabel: "Modern salon interior at Strands On Fleek" },
  { id: "n2", name: "Maridadi Skincare Solutions", category: "Nails", location: "Nairobi Central, Nairobi", rating: 4.8, reviewCount: 69, imageLabel: "Relaxing treatment room at Maridadi" },
  { id: "n3", name: "Infinity Spa & Wellness Centre", category: "Beauty Salon", location: "Kileleshwa, Nairobi", rating: 5.0, reviewCount: 33, imageLabel: "Relaxing chaises at Infinity Spa" },
  { id: "n4", name: "Artistic Grooming Parlour", category: "Hair Salon", location: "Kilimani, Nairobi", rating: 4.9, reviewCount: 71, imageLabel: "Modern interior of Artistic Grooming" },
  { id: "n5", name: "Kiki's Nail Club", category: "Nails", location: "Kisumu Town", rating: 4.8, reviewCount: 23, imageLabel: "Modern manicure stations at Kiki's" },
  { id: "n6", name: "Magdy Luxe Salon & Spa", category: "Hair Salon", location: "Kisumu Town", rating: 5.0, reviewCount: 57, imageLabel: "Stylish hair styling stations at Magdy" },
  { id: "n7", name: "The Pod", category: "Beauty Salon", location: "Nakuru Town", rating: 4.9, reviewCount: 106, imageLabel: "Relaxing treatment room at The Pod" },
  { id: "n8", name: "ESPER SALON & SPA", category: "Hair Salon", location: "Nyali, Mombasa", rating: 5.0, reviewCount: 185, imageLabel: "Elegant massage tables at ESPER" },
]

export const newWithTag: ListingBusiness[] = [
  { id: "nt1", name: "Bella Boo Salon & Spa", category: "Nails", location: "Lang'ata, Nairobi", rating: 5.0, reviewCount: 4, imageLabel: "Luxurious pedicure chairs at Bella Boo", tag: "New" },
  { id: "nt2", name: "Tarfah Spa", category: "Beauty Salon", location: "Kisumu Town", rating: 4.4, reviewCount: 14, imageLabel: "Relaxing lounge at Tarfah Spa", tag: "New" },
  { id: "nt3", name: "Jadeel Beauty Spa", category: "Beauty Salon", location: "Kitale Town", rating: 4.5, reviewCount: 31, imageLabel: "Luxurious pedicure room at Jadeel Beauty Spa", tag: "Featured" },
  { id: "nt4", name: "DEssential Beauty Spa", category: "Spa & sauna", location: "Naivasha Town", rating: 4.9, reviewCount: 21, imageLabel: "Relaxing treatment room at DEssential", tag: "Featured" },
  { id: "nt5", name: "Lashes by Agr", category: "Eyebrows & Lashes", location: "Meru Town", rating: 5.0, reviewCount: 21, imageLabel: "Luxurious room at Lashes by Agr", tag: "New" },
  { id: "nt6", name: "Brazil Studio Salon - Sahafa", category: "Hair Salon", location: "Embu Town", rating: 4.3, reviewCount: 6, imageLabel: "Luxurious interior of Brazil Studio Salon", tag: "New" },
  { id: "nt7", name: "Withar Barbershop", category: "Barber", location: "Nanyuki Town", rating: 5.0, reviewCount: 132, imageLabel: "Withar Barbershop", tag: "New" },
]

export const trending: ListingBusiness[] = [
  { id: "t1", name: "Spa By Xenaxia At Movenpick", category: "Spa & sauna", location: "Spring Valley, Nairobi", rating: 4.9, reviewCount: 27, imageLabel: "Tranquil treatment room at Spa By Xenaxia" },
  { id: "t2", name: "Spa by Xenaxia at Fairmont the Norfolk", category: "Massage", location: "Nairobi Central, Nairobi", rating: 4.8, reviewCount: 41, imageLabel: "Relaxation lounge at Spa by Xenaxia" },
  { id: "t3", name: "De Bella Curls Spa, Salon & Barber", category: "Hair Salon", location: "Kilimani, Nairobi", rating: 4.7, reviewCount: 11, imageLabel: "Barber chair at De Bella Curls" },
  { id: "t4", name: "Naurei Atarah", category: "Hair Salon", location: "Kilimani, Nairobi", rating: 4.8, reviewCount: 39, imageLabel: "Chic interior of Naurei Atarah" },
  { id: "t5", name: "Kristals Hair And Beauty Studio", category: "Beauty Salon", location: "Kilimani, Nairobi", rating: 5.0, reviewCount: 24, imageLabel: "Elegant salon interior at Kristals", tag: "Deals" },
  { id: "t6", name: "Pitstop Barbers", category: "Barber", location: "Mombasa Town", rating: 5.0, reviewCount: 7859, imageLabel: "Modern interior of Pitstop Barbers", tag: "Deals" },
]

export const dealsBusinesses: ListingBusiness[] = [
  { id: "d1", name: "The Address Barber - Al Qirawan", category: "Barber", location: "Kilimani, Nairobi", rating: 5.0, reviewCount: 4008, imageLabel: "Inside The Address Barber", tag: "Featured" },
  { id: "d2", name: "The Address Barber - Al Aarid", category: "Barber", location: "Westlands, Nairobi", rating: 4.9, reviewCount: 5646, imageLabel: "Luxury barber chairs at The Address Barber", tag: "Featured" },
  { id: "d3", name: "The Address Barber - Ar Rimal", category: "Barber", location: "Nyali, Mombasa", rating: 5.0, reviewCount: 2641, imageLabel: "Chic interior of The Address Barber", tag: "Featured" },
  { id: "d4", name: "The Address Barber - Al Nuzhah", category: "Barber", location: "Karen, Nairobi", rating: 5.0, reviewCount: 3162, imageLabel: "Modern interior of The Address Barber", tag: "Deals" },
  { id: "d5", name: "The Address Barber - Al Malqa", category: "Hair Salon", location: "Lavington, Nairobi", rating: 5.0, reviewCount: 3917, imageLabel: "Modern barbershop at The Address Barber", tag: "Featured" },
  { id: "d6", name: "The Address Barber - Al Rawdah", category: "Barber", location: "Milimani, Kisumu", rating: 4.9, reviewCount: 2479, imageLabel: "Modern barber station at The Address Barber", tag: "Featured" },
  { id: "d7", name: "Let's Fade - Nairobi Barbers", category: "Barber", location: "Mombasa Road, Nairobi", rating: 5.0, reviewCount: 8114, imageLabel: "Modern barber shop at Let's Fade", tag: "Featured" },
  { id: "d8", name: "L8 Elite Barbershop", category: "Barber", location: "Gigiri, Nairobi", rating: 5.0, reviewCount: 2384, imageLabel: "Modern interior of L8 Elite Barbershop", tag: "Featured" },
  { id: "d9", name: "The Address Barber - Al Ghadir", category: "Barber", location: "Nakuru Town", rating: 5.0, reviewCount: 2103, imageLabel: "Modern interior of The Address Barber", tag: "Deals" },
  { id: "d10", name: "The Address Barber - Qurtubah", category: "Barber", location: "Eldoret Town", rating: 4.9, reviewCount: 2421, imageLabel: "Stylish barber chairs at The Address Barber", tag: "Featured" },
]

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

export const browseBusinesses: ListingBusiness[] = [
  // Waxing Salons
  { id: "w1", name: "Smooth Finish Wax Studio", category: "Waxing Salons", location: "Kilimani, Nairobi", rating: 4.7, reviewCount: 234, imageLabel: "Modern waxing suite at Smooth Finish" },
  { id: "w2", name: "Bare Wax Lounge", category: "Waxing Salons", location: "Nyali, Mombasa", rating: 4.8, reviewCount: 312, imageLabel: "Cozy waxing room at Bare Wax Lounge" },
  { id: "w3", name: "Sugared & Silky", category: "Waxing Salons", location: "Westlands, Nairobi", rating: 4.6, reviewCount: 145, imageLabel: "Relaxing waxing suite interior" },
  { id: "w4", name: "Brazilian Beauty Wax Bar", category: "Waxing Salons", location: "Milimani, Kisumu", rating: 4.5, reviewCount: 89, imageLabel: "Chic waxing station at Brazilian Beauty" },
  { id: "w5", name: "Wax & Glow Studio", category: "Waxing Salons", location: "Nakuru Town", rating: 4.4, reviewCount: 67, imageLabel: "Bright waxing studio interior" },
  // Medspas
  { id: "m1", name: "DermaCare Medspa", category: "Medspas", location: "Gigiri, Nairobi", rating: 4.9, reviewCount: 456, imageLabel: "Luxurious medspa treatment room" },
  { id: "m2", name: "Rejuvenate Medical Aesthetics", category: "Medspas", location: "Nyali, Mombasa", rating: 4.7, reviewCount: 213, imageLabel: "Modern aesthetics treatment room" },
  { id: "m3", name: "Ageless Medspa & Laser", category: "Medspas", location: "Karen, Nairobi", rating: 4.8, reviewCount: 301, imageLabel: "State-of-the-art laser suite at Ageless" },
  { id: "m4", name: "Elixir Medspa", category: "Medspas", location: "Kisumu Town", rating: 4.6, reviewCount: 78, imageLabel: "Serene medspa interior at Elixir" },
  // Tattooing & Piercing
  { id: "t1", name: "Ink & Needle Tattoo Studio", category: "Tattooing & Piercing", location: "Kilimani, Nairobi", rating: 4.8, reviewCount: 567, imageLabel: "Vibrant tattoo studio at Ink & Needle" },
  { id: "t2", name: "Golden Needle Piercing", category: "Tattooing & Piercing", location: "Mombasa Town", rating: 4.6, reviewCount: 189, imageLabel: "Sterile piercing suite at Golden Needle" },
  { id: "t3", name: "ArtSkin Tattoos", category: "Tattooing & Piercing", location: "Lang'ata, Nairobi", rating: 4.7, reviewCount: 423, imageLabel: "Art-filled tattoo parlor at ArtSkin" },
  { id: "t4", name: "Piercing Paradise", category: "Tattooing & Piercing", location: "Eldoret Town", rating: 4.5, reviewCount: 112, imageLabel: "Modern piercing studio interior" },
  // Eyebrows & Lashes
  { id: "e1", name: "Lash Lounge by Grace", category: "Eyebrows & Lashes", location: "Westlands, Nairobi", rating: 4.9, reviewCount: 345, imageLabel: "Elegant lash studio at Lash Lounge" },
  { id: "e2", name: "Brow & Lash Bar", category: "Eyebrows & Lashes", location: "Nyali, Mombasa", rating: 4.7, reviewCount: 201, imageLabel: "Chic brow bar interior at Brow & Lash" },
  { id: "e3", name: "Fabulous Lashes Studio", category: "Eyebrows & Lashes", location: "Nakuru Town", rating: 4.8, reviewCount: 156, imageLabel: "Luxurious lash extension room" },
  // Massages
  { id: "ma1", name: "Serenity Massage Therapy", category: "Massages", location: "Lavington, Nairobi", rating: 4.9, reviewCount: 278, imageLabel: "Tranquil massage room at Serenity" },
  { id: "ma2", name: "Hands of Healing Massage", category: "Massages", location: "Eldoret Town", rating: 4.6, reviewCount: 134, imageLabel: "Relaxing massage suite at Hands of Healing" },
  { id: "ma3", name: "Aroma Touch Massage", category: "Massages", location: "Thika Town", rating: 4.7, reviewCount: 198, imageLabel: "Aromatic massage room at Aroma Touch" },
  // Additional Hair Salons
  { id: "h1", name: "Crown & Glory Hair Studio", category: "Hair Salons", location: "Thika Town", rating: 4.5, reviewCount: 87, imageLabel: "Modern hair studio at Crown & Glory" },
  { id: "h2", name: "Tresses & Trends Salon", category: "Hair Salons", location: "Nakuru Town", rating: 4.6, reviewCount: 145, imageLabel: "Stylish salon chairs at Tresses & Trends" },
  { id: "h3", name: "Mane Attraction Hair Lounge", category: "Hair Salons", location: "Eldoret Town", rating: 4.7, reviewCount: 234, imageLabel: "Elegant hair lounge interior" },
  // Additional Beauty Salons
  { id: "b1", name: "Glow Beauty Lounge", category: "Beauty Salons", location: "Mombasa Town", rating: 4.6, reviewCount: 312, imageLabel: "Luxurious beauty lounge at Glow" },
  { id: "b2", name: "Radiance Beauty Bar", category: "Beauty Salons", location: "Thika Town", rating: 4.5, reviewCount: 178, imageLabel: "Modern beauty bar interior" },
  { id: "b3", name: "Pure Beauty Studio", category: "Beauty Salons", location: "Eldoret Town", rating: 4.8, reviewCount: 267, imageLabel: "Serene beauty treatment room" },
  // Additional Nail Salons
  { id: "n1", name: "Polished Nail Lounge", category: "Nail Salons", location: "Thika Town", rating: 4.5, reviewCount: 98, imageLabel: "Modern nail lounge at Polished" },
  { id: "n2", name: "Tips & Toes Nail Bar", category: "Nail Salons", location: "Nakuru Town", rating: 4.7, reviewCount: 167, imageLabel: "Chic nail bar at Tips & Toes" },
  { id: "n3", name: "Crystal Nail Studio", category: "Nail Salons", location: "Eldoret Town", rating: 4.6, reviewCount: 134, imageLabel: "Elegant manicure stations at Crystal" },
  // Additional Spas & Saunas
  { id: "s1", name: "Heavenly Spa & Wellness", category: "Spas & Saunas", location: "Thika Town", rating: 4.8, reviewCount: 212, imageLabel: "Luxurious spa suite at Heavenly" },
  { id: "s2", name: "Nordic Sauna House", category: "Spas & Saunas", location: "Eldoret Town", rating: 4.6, reviewCount: 89, imageLabel: "Modern sauna room at Nordic" },
  // Additional Barbers
  { id: "br1", name: "Classic Cuts Barbershop", category: "Barbers", location: "Thika Town", rating: 4.5, reviewCount: 312, imageLabel: "Traditional barber chairs at Classic Cuts" },
  { id: "br2", name: "Gentleman's Choice Barber", category: "Barbers", location: "Nakuru Town", rating: 4.7, reviewCount: 201, imageLabel: "Modern barber lounge at Gentleman's Choice" },
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
