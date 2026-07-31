import { PrismaClient, Role, FieldTeamStatus, AssignmentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data to ensure idempotency
  await prisma.assignment.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.fieldTeam.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Hashed Password
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Create Users
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@vizagops.gov.in',
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const officer = await prisma.user.create({
    data: {
      name: 'Ward Officer User',
      email: 'officer@vizagops.gov.in',
      passwordHash,
      role: Role.WARD_OFFICER,
    },
  });

  const agent = await prisma.user.create({
    data: {
      name: 'Field Agent User',
      email: 'agent@vizagops.gov.in',
      passwordHash,
      role: Role.FIELD_AGENT,
    },
  });

  const citizen = await prisma.user.create({
    data: {
      name: 'Citizen User',
      email: 'citizen@gmail.com',
      passwordHash,
      role: Role.CITIZEN,
    },
  });

  console.log('Seeded Users.');

  // 3. Create Field Teams
  const team1 = await prisma.fieldTeam.create({
    data: {
      name: 'Alpha Response',
      members: ['John Doe', 'Jane Smith'],
      currentLat: 17.6868,
      currentLng: 83.2185,
      availability: FieldTeamStatus.AVAILABLE,
    },
  });

  const team2 = await prisma.fieldTeam.create({
    data: {
      name: 'Bravo Squad',
      members: ['Alice Johnson'],
      currentLat: 17.6890,
      currentLng: 83.2200,
      availability: FieldTeamStatus.BUSY,
    },
  });

  const team3 = await prisma.fieldTeam.create({
    data: {
      name: 'Charlie Unit',
      members: ['Bob Miller'],
      currentLat: 17.7010,
      currentLng: 83.2300,
      availability: FieldTeamStatus.OFFLINE,
    },
  });

  console.log('Seeded Field Teams.');

  // 4. Create Complaints
  const complaint1 = await prisma.complaint.create({
    data: {
      title: 'Pothole on Main Street',
      description: 'Large pothole causing traffic slowdowns.',
      category: 'INFRASTRUCTURE',
      priority: 'HIGH',
      severity: 'MAJOR',
      status: 'OPEN',
      ward: 'Ward 12',
      department: 'Roads',
      latitude: 17.6870,
      longitude: 83.2190,
      source: 'MOBILE_APP',
    },
  });

  const complaint2 = await prisma.complaint.create({
    data: {
      title: 'Streetlight Outage',
      description: 'Streetlight is flickering and went out.',
      category: 'ELECTRICAL',
      priority: 'MEDIUM',
      severity: 'MINOR',
      status: 'PENDING',
      ward: 'Ward 15',
      department: 'Electricity',
      latitude: 17.6900,
      longitude: 83.2250,
      source: 'WEB_PORTAL',
    },
  });

  const complaint3 = await prisma.complaint.create({
    data: {
      title: 'Water Leakage',
      description: 'Pipeline broken near park gate.',
      category: 'WATER_SUPPLY',
      priority: 'HIGH',
      severity: 'CRITICAL',
      status: 'RESOLVED',
      ward: 'Ward 10',
      department: 'Water Works',
      latitude: 17.6950,
      longitude: 83.2280,
      source: 'CIVIC_PORTAL',
    },
  });

  console.log('Seeded Complaints.');

  // 5. Create Assignments
  const assignment1 = await prisma.assignment.create({
    data: {
      complaintId: complaint1.id,
      fieldTeamId: team2.id,
      assignedById: officer.id,
      status: AssignmentStatus.ASSIGNED,
    },
  });

  console.log('Seeded Assignments.');
  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
