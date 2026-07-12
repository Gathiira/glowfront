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

export const businessTypes = [
  { id: "salon", name: "Salon", description: "Hair stylist working on a client's hair in a chic salon", imageUrl: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop" },
  { id: "barber", name: "Barber", description: "Barber styling a client's hair in a contemporary barbershop", imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop" },
  { id: "nails", name: "Nails", description: "Manicurist applying nail polish to a client's nails", imageUrl: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=300&fit=crop" },
  { id: "spa-sauna", name: "Spa & sauna", description: "Woman relaxing in a spa with a towel wrap and facial mask", imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop" },
  { id: "medspa", name: "Medspa", description: "Aesthetician performing a facial treatment in a modern med spa", imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=300&fit=crop" },
  { id: "massage", name: "Massage", description: "Client receiving a relaxing back massage in a spa environment", imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop" },
  { id: "fitness", name: "Fitness & recovery", description: "Fitness trainer guiding a client through a workout in a gym", imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop" },
  { id: "physical-therapy", name: "Physical therapy", description: "Physical therapist assisting a patient with exercises", imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" },
  { id: "health", name: "Health practice", description: "Healthcare professional consulting with a patient in a clinic", imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=300&fit=crop" },
  { id: "tattoo", name: "Tattoo & piercing", description: "Tattoo artist creating a detailed design on a client's arm", imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=300&fit=crop" },
  { id: "pet-grooming", name: "Pet grooming", description: "Professional pet groomer styling a dog in a clean salon", imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop" },
  { id: "tanning", name: "Tanning studio", description: "Modern tanning studio with sunbeds and ambient lighting", imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=400&h=300&fit=crop" },
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

export type BusinessType = typeof businessTypes[number]
export type BusinessTestimonial = typeof businessTestimonials[number]

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
