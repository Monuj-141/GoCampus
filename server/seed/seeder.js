import mongoose from "mongoose";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Notice from "../models/Notice.js";
import Registration from "../models/Registration.js";

const sampleEvents = [
  {
    title: "Tech Fest 2026",
    category: "Technology",
    date: "September 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Computer Science Department, Block B",
    description:
      "Tech Fest 2026 is a premier campus technology event where students explore cutting-edge engineering, AI innovation, web frameworks, and collaborative open-source projects. Participate in live demos, network with peers, and showcase your creative technical skills.",
    icon: "💻",
    capacity: 150,
    registeredCount: 0,
    status: "upcoming",
    featured: true,
    organizer: "Computer Science Society",
  },
  {
    title: "Annual Sports Day",
    category: "Sports",
    date: "September 20, 2026",
    time: "9:00 AM - 5:00 PM",
    location: "College Sports Complex & Athletics Track",
    description:
      "Annual Sports Day brings together students across all departments for competitive athletics, track events, football, basketball, and badminton tournaments. Celebrate sportsmanship, teamwork, and campus energy.",
    icon: "🏆",
    capacity: 200,
    registeredCount: 0,
    status: "upcoming",
    featured: true,
    organizer: "Campus Athletics Department",
  },
  {
    title: "Campus Hackathon 2026",
    category: "Hackathon",
    date: "October 05, 2026",
    time: "9:00 AM - 9:00 PM (12 Hours)",
    location: "Innovation Hub & Incubation Lab",
    description:
      "A fast-paced 12-hour build sprint where student developer and designer teams tackle real campus and community problems using modern web, mobile, and AI technologies. Top 3 teams receive mentorship, certificates, and exciting prizes.",
    icon: "🚀",
    capacity: 80,
    registeredCount: 0,
    status: "upcoming",
    featured: true,
    organizer: "Google Developer Student Club",
  },
  {
    title: "Freshers Welcome Party",
    category: "Cultural",
    date: "October 10, 2026",
    time: "5:00 PM - 9:00 PM",
    location: "Grand College Auditorium",
    description:
      "A grand celebratory evening to formally welcome new undergraduate and postgraduate students to the campus community. Featuring musical performances, dance choreography, comedy sketches, and campus club showcases.",
    icon: "🎉",
    capacity: 350,
    registeredCount: 0,
    status: "upcoming",
    featured: false,
    organizer: "Student Welfare Committee",
  },
  {
    title: "Inter-College Coding Competition",
    category: "Technology",
    date: "October 18, 2026",
    time: "10:00 AM - 2:00 PM",
    location: "Advanced Computing Lab 301",
    description:
      "Test your problem-solving abilities and algorithmic speed in an intense 4-hour competitive programming showdown. Languages supported include C++, Python, Java, and JavaScript with automated judging on campus test suites.",
    icon: "👨‍💻",
    capacity: 100,
    registeredCount: 0,
    status: "upcoming",
    featured: false,
    organizer: "Coding & Algorithms Club",
  },
  {
    title: "Campus Cultural Festival (Euphoria)",
    category: "Cultural",
    date: "October 25, 2026",
    time: "11:00 AM - 8:00 PM",
    location: "Main Campus Grounds & Open Air Theatre",
    description:
      "Celebrate campus heritage, diversity, music, art, and stage theatre at our flagship cultural fest. Food stalls, battle of the bands, photography exhibitions, and art installations all day long.",
    icon: "🎭",
    capacity: 500,
    registeredCount: 0,
    status: "upcoming",
    featured: true,
    organizer: "Campus Cultural Guild",
  },
];

const sampleNotices = [
  {
    title: "Semester Examination Form Submission Deadline",
    category: "Academic",
    department: "Examination Cell",
    date: "September 10, 2026",
    important: true,
    description:
      "All students must complete and verify their semester examination forms before the scheduled deadline.",
    content: `All students enrolled in regular and backlog semester courses are hereby informed that the examination registration portal is now open.

1. Ensure all subject codes and elective selections match your registered coursework.
2. Verify personal details, photograph, and contact credentials before final submission.
3. Admit cards will be generated digitally upon successful approval from your respective Department Head.

Late submissions after September 20, 2026 will incur an administrative fee as per college regulations.`,
    author: "Controller of Examinations",
  },
  {
    title: "Merit & Need-Based Scholarship Applications 2026",
    category: "Scholarship",
    department: "Dean Student Affairs",
    date: "September 15, 2026",
    important: true,
    description:
      "Applications are invited for college alumni, state government, and corporate tuition scholarship programs.",
    content: `Eligible students maintaining a cumulative GPA of 7.5 or above or students seeking financial need assistance are invited to apply for the 2026 Campus Merit Scholarships.

Required Documents:
- Latest Semester Mark Sheets
- Income Certificate / Parental Tax Returns
- Recommendation from Academic Advisor

Submit applications via the student affairs desk or upload documents directly to the scholarship administration portal by September 30, 2026.`,
    author: "Scholarship Committee",
  },
  {
    title: "Campus Placement Drive — Tech & Core Engineering",
    category: "Placement",
    department: "Training & Placement Cell",
    date: "September 20, 2026",
    important: false,
    description:
      "Pre-placement talks and technical screening tests for eligible final-year and pre-final year students.",
    content: `The Training and Placement Cell is pleased to announce recruitment drives for the 2026-2027 batch. Over 25 visiting tier-1 software companies and engineering corporations have confirmed participation.

- Pre-placement talks will be held in Auditorium 2.
- Online technical aptitude tests commence from October 1st.
- All eligible students must maintain an updated campus resume profile with zero active backlogs.`,
    author: "Head, Training & Placement Cell",
  },
  {
    title: "Library 24/7 Extended Hours for Mid-Terms",
    category: "Campus Life",
    department: "Central Library",
    date: "September 22, 2026",
    important: false,
    description:
      "Central Library reading halls and digital study pods will remain open 24/7 with campus shuttle support.",
    content: `To assist students preparing for upcoming mid-term assessments, the Central Library will operate around the clock from September 25 onwards.

- Night cafe refreshments will be accessible at the ground floor atrium.
- Campus security escort vans will be stationed every hour at the library gate.
- Maintain quiet zones and ensure library cards are presented upon entry.`,
    author: "Chief Librarian",
  },
  {
    title: "Inter-Department Athletics Meet Registration",
    category: "Sports",
    department: "Department of Physical Education",
    date: "September 25, 2026",
    important: false,
    description:
      "Trials and registration for 100m, 400m, relay, shot-put, and football inter-department tournaments.",
    content: `Athletic trials for all department teams will be conducted on the Main Stadium turf every evening between 4:30 PM and 6:30 PM.

Students interested in representing their department in team or track events should report with valid college ID cards and standard sports kits. Contact your department sports captain for details.`,
    author: "Director of Physical Education",
  },
];

export const seedData = async () => {
  const usersCount = await User.countDocuments();
  if (usersCount > 0) {
    // Already seeded
    return;
  }

  console.log("[Seed] Seeding initial ConnectCampus database...");

  // 1. Create Admin
  const admin = await User.create({
    name: "Dr. Arvind Sharma",
    email: "admin@connectcampus.edu",
    password: "Admin@123",
    role: "admin",
    studentId: "FAC-ADMIN-01",
    department: "Dean Office",
    year: "Faculty",
    phone: "+91 98765 43210",
    bio: "Campus Dean of Student Welfare and Administrator for ConnectCampus platform.",
    isVerified: true,
  });

  // 2. Create Sample Students
  const rahul = await User.create({
    name: "Rahul Verma",
    email: "rahul@connectcampus.edu",
    password: "Student@123",
    role: "student",
    studentId: "CC2024-CS-042",
    department: "Computer Science",
    year: "3rd Year",
    phone: "+91 98765 11223",
    bio: "Full-stack enthusiast, open-source contributor, and competitive coder.",
    isVerified: true,
  });

  const priya = await User.create({
    name: "Priya Sharma",
    email: "priya@connectcampus.edu",
    password: "Student@123",
    role: "student",
    studentId: "CC2024-IT-018",
    department: "Information Technology",
    year: "2nd Year",
    phone: "+91 98765 44556",
    bio: "Passionate UI/UX designer and student club organizer.",
    isVerified: true,
  });

  // 3. Create Events
  const createdEvents = [];
  for (const eventData of sampleEvents) {
    const ev = await Event.create({
      ...eventData,
      createdBy: admin._id,
    });
    createdEvents.push(ev);
  }

  // 4. Create Notices
  for (const noticeData of sampleNotices) {
    await Notice.create({
      ...noticeData,
      createdBy: admin._id,
    });
  }

  // 5. Create Sample Registrations for Rahul & Priya
  if (createdEvents.length >= 2) {
    const techFest = createdEvents[0];
    const hackathon = createdEvents[2] || createdEvents[1];

    await Registration.create({
      event: techFest._id,
      student: rahul._id,
      status: "confirmed",
      registrationNumber: `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    techFest.registeredCount += 1;
    await techFest.save();

    await Registration.create({
      event: hackathon._id,
      student: rahul._id,
      status: "confirmed",
      registrationNumber: `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    hackathon.registeredCount += 1;
    await hackathon.save();

    await Registration.create({
      event: techFest._id,
      student: priya._id,
      status: "confirmed",
      registrationNumber: `CC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    });
    techFest.registeredCount += 1;
    await techFest.save();
  }

  console.log("[Seed] Successfully seeded initial admin, students, events, notices, and registrations!");
};

export default seedData;
