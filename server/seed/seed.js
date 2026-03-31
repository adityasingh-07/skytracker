require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { sequelize, Airline, Airport, Aircraft, Flight, FlightStatus, Crew } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync (create tables)
    await sequelize.sync({ force: true });
    console.log('✅ Tables created (force reset)');

    // ─── Airlines ───
    const airlines = await Airline.bulkCreate([
      { name: 'Air India', country: 'India' },
      { name: 'IndiGo', country: 'India' },
      { name: 'SpiceJet', country: 'India' },
      { name: 'Emirates', country: 'UAE' },
      { name: 'Singapore Airlines', country: 'Singapore' },
      { name: 'Vistara', country: 'India' },
    ]);
    console.log(`✅ Seeded ${airlines.length} airlines`);

    // ─── Airports ───
    const airports = await Airport.bulkCreate([
      { name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', iata_code: 'DEL' },
      { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', iata_code: 'BOM' },
      { name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', iata_code: 'BLR' },
      { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', iata_code: 'HYD' },
      { name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata', country: 'India', iata_code: 'CCU' },
      { name: 'Chennai International Airport', city: 'Chennai', country: 'India', iata_code: 'MAA' },
      { name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', iata_code: 'DXB' },
      { name: 'Changi Airport', city: 'Singapore', country: 'Singapore', iata_code: 'SIN' },
      { name: 'Cochin International Airport', city: 'Kochi', country: 'India', iata_code: 'COK' },
      { name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', country: 'India', iata_code: 'AMD' },
    ]);
    console.log(`✅ Seeded ${airports.length} airports`);

    // ─── Aircraft ───
    const aircraft = await Aircraft.bulkCreate([
      { model: 'Boeing 737-800', capacity: 189, manufacturer: 'Boeing' },
      { model: 'Airbus A320neo', capacity: 180, manufacturer: 'Airbus' },
      { model: 'Boeing 777-300ER', capacity: 396, manufacturer: 'Boeing' },
      { model: 'Airbus A380', capacity: 555, manufacturer: 'Airbus' },
      { model: 'Boeing 787 Dreamliner', capacity: 296, manufacturer: 'Boeing' },
      { model: 'ATR 72-600', capacity: 72, manufacturer: 'ATR' },
      { model: 'Airbus A321neo', capacity: 220, manufacturer: 'Airbus' },
      { model: 'Embraer E190', capacity: 114, manufacturer: 'Embraer' },
    ]);
    console.log(`✅ Seeded ${aircraft.length} aircraft`);

    // ─── Flights (next 7 days) ───
    const now = new Date();
    const flights = [];

    const flightData = [
      { number: 'AI-101', airline: 0, aircraft: 2, from: 0, to: 1, hourOffset: 2, duration: 2, price: 5500 },
      { number: 'AI-202', airline: 0, aircraft: 4, from: 0, to: 6, hourOffset: 4, duration: 7, price: 28000 },
      { number: '6E-301', airline: 1, aircraft: 1, from: 2, to: 0, hourOffset: 6, duration: 2.5, price: 4200 },
      { number: '6E-402', airline: 1, aircraft: 1, from: 1, to: 2, hourOffset: 8, duration: 1.5, price: 3800 },
      { number: 'SG-501', airline: 2, aircraft: 0, from: 0, to: 3, hourOffset: 10, duration: 2, price: 3500 },
      { number: 'SG-602', airline: 2, aircraft: 5, from: 3, to: 5, hourOffset: 12, duration: 1.5, price: 3200 },
      { number: 'EK-701', airline: 3, aircraft: 3, from: 6, to: 0, hourOffset: 1, duration: 3.5, price: 35000 },
      { number: 'EK-802', airline: 3, aircraft: 3, from: 6, to: 1, hourOffset: 5, duration: 3, price: 32000 },
      { number: 'SQ-901', airline: 4, aircraft: 2, from: 7, to: 0, hourOffset: 3, duration: 5.5, price: 42000 },
      { number: 'SQ-902', airline: 4, aircraft: 4, from: 7, to: 2, hourOffset: 14, duration: 5, price: 38000 },
      { number: 'UK-101', airline: 5, aircraft: 6, from: 0, to: 1, hourOffset: 7, duration: 2, price: 6200 },
      { number: 'UK-202', airline: 5, aircraft: 6, from: 1, to: 0, hourOffset: 16, duration: 2, price: 6000 },
      { number: '6E-503', airline: 1, aircraft: 1, from: 4, to: 0, hourOffset: 9, duration: 2, price: 4500 },
      { number: 'AI-303', airline: 0, aircraft: 0, from: 0, to: 8, hourOffset: 11, duration: 3, price: 5800 },
      { number: 'SG-703', airline: 2, aircraft: 7, from: 9, to: 1, hourOffset: 13, duration: 1.5, price: 3000 },
      { number: '6E-604', airline: 1, aircraft: 1, from: 5, to: 3, hourOffset: 15, duration: 1, price: 2800 },
      { number: 'AI-404', airline: 0, aircraft: 2, from: 1, to: 6, hourOffset: 22, duration: 3.5, price: 26000 },
      { number: 'EK-903', airline: 3, aircraft: 3, from: 6, to: 2, hourOffset: 20, duration: 4, price: 30000 },
      { number: 'UK-303', airline: 5, aircraft: 6, from: 2, to: 3, hourOffset: 18, duration: 1, price: 3600 },
      { number: '6E-705', airline: 1, aircraft: 1, from: 0, to: 4, hourOffset: 19, duration: 2, price: 4100 },
    ];

    for (let day = 0; day < 7; day++) {
      for (const fd of flightData) {
        const dep = new Date(now);
        dep.setDate(dep.getDate() + day);
        dep.setHours(fd.hourOffset, 0, 0, 0);

        const arr = new Date(dep);
        arr.setHours(arr.getHours() + Math.floor(fd.duration));
        arr.setMinutes((fd.duration % 1) * 60);

        // Append day suffix to avoid duplicate flight numbers
        const dayFlightNumber = day === 0 ? fd.number : `${fd.number}-D${day}`;

        flights.push({
          flight_number: dayFlightNumber,
          airline_id: airlines[fd.airline].airline_id,
          aircraft_id: aircraft[fd.aircraft].aircraft_id,
          departure_airport_id: airports[fd.from].airport_id,
          arrival_airport_id: airports[fd.to].airport_id,
          departure_time: dep,
          arrival_time: arr,
          base_price: fd.price + (day * 200), // Slight price variation by day
        });
      }
    }

    const createdFlights = await Flight.bulkCreate(flights);
    console.log(`✅ Seeded ${createdFlights.length} flights`);

    // ─── Flight Statuses ───
    const statuses = [];
    const statusTypes = ['scheduled', 'boarding', 'departed', 'in_air', 'landed', 'delayed'];
    for (const flight of createdFlights) {
      statuses.push({
        flight_id: flight.flight_id,
        status_type: statusTypes[Math.floor(Math.random() * statusTypes.length)],
        delay_reason: null,
        updated_at: new Date(),
      });
    }
    await FlightStatus.bulkCreate(statuses);
    console.log(`✅ Seeded ${statuses.length} flight statuses`);

    // ─── Crew Members (not linked to user accounts) ───
    const crewMembers = await Crew.bulkCreate([
      { name: 'Capt. Rajesh Kumar', role: 'Pilot', certification: 'ATPL' },
      { name: 'Capt. Priya Sharma', role: 'Pilot', certification: 'ATPL' },
      { name: 'FO Amit Patel', role: 'Co-Pilot', certification: 'CPL' },
      { name: 'FO Sneha Reddy', role: 'Co-Pilot', certification: 'CPL' },
      { name: 'Ananya Gupta', role: 'Flight Attendant', certification: 'Cabin Crew' },
      { name: 'Ravi Krishnan', role: 'Flight Attendant', certification: 'Cabin Crew' },
      { name: 'Meera Joshi', role: 'Flight Attendant', certification: 'Cabin Crew' },
      { name: 'Capt. David Singh', role: 'Pilot', certification: 'ATPL' },
      { name: 'FO Neha Verma', role: 'Co-Pilot', certification: 'CPL' },
      { name: 'Sanjay Nair', role: 'Flight Attendant', certification: 'Cabin Crew' },
    ]);
    console.log(`✅ Seeded ${crewMembers.length} crew members`);

    // Assign crew to first 20 flights
    const firstFlights = createdFlights.slice(0, 20);
    for (let i = 0; i < firstFlights.length; i++) {
      const pilot = crewMembers[i % 4]; // Rotate pilots
      const attendant1 = crewMembers[4 + (i % 3)]; // Rotate attendants
      const attendant2 = crewMembers[7 + (i % 3)]; // More attendants
      await firstFlights[i].addCrews([pilot, attendant1, attendant2]);
    }
    console.log('✅ Assigned crew to flights');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
