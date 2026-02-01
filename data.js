const AppData = {
    courses: [
        {
            id: 1,
            name: "Advanced Algorithm Design",
            code: "CS401",
            faculty: "Dr. Alan Turing",
            schedule: "Mon, Wed (10:00 AM - 11:30 AM)",
            location: "Block C, Room 402",
            description: "In-depth study of complex algorithms, data structures, and computational complexity.",
            credits: 4,
            image: "bg-blue-500/20",
            category: "Computer Science"
        },
        {
            id: 2,
            name: "Web Technologies & Frameworks",
            code: "CS305",
            faculty: "Prof. Tim Berners-Lee",
            schedule: "Tue, Thu (02:00 PM - 03:30 PM)",
            location: "Lab 2, IT Building",
            description: "Modern web development using Next.js, React, and server-side technologies.",
            credits: 3,
            image: "bg-purple-500/20",
            category: "Computer Science"
        },
        {
            id: 3,
            name: "Database Management Systems",
            code: "CS208",
            faculty: "Dr. Edgar Codd",
            schedule: "Fri (09:00 AM - 12:00 PM)",
            location: "Block A, Room 105",
            description: "Fundamental concepts of relational databases, SQL, and database design.",
            credits: 4,
            image: "bg-green-500/20",
            category: "Computer Science"
        },
        {
            id: 4,
            name: "Artificial Intelligence",
            code: "CS502",
            faculty: "Dr. Marvin Minsky",
            schedule: "Wed, Fri (01:00 PM - 02:30 PM)",
            location: "Block B, Room 201",
            description: "Introduction to machine learning, neural networks, and expert systems.",
            credits: 3,
            image: "bg-orange-500/20",
            category: "Computer Science"
        },
        {
            id: 5,
            name: "Machine Learning Foundations",
            code: "CS601",
            faculty: "Dr. Andrew Ng",
            schedule: "Mon, Thu (04:00 PM - 05:30 PM)",
            location: "Digital Hall 1",
            description: "Supervised and unsupervised learning, regressive models, and neural network basics.",
            credits: 4,
            image: "bg-red-500/20",
            category: "Computer Science"
        },
        {
            id: 6,
            name: "Cyber Security & Ethics",
            code: "CS410",
            faculty: "Kevin Mitnick",
            schedule: "Sat (10:00 AM - 01:00 PM)",
            location: "Security Lab B",
            description: "Ethical hacking, network security protocols, and digital forensics.",
            credits: 3,
            image: "bg-gray-500/20",
            category: "Computer Science"
        }
    ],

    announcements: [
        { title: "Mid-Semester Examination Schedule", date: "Feb 10, 2026", category: "Exams", urgent: true },
        { title: "New Lab Equipment Arrived", date: "Feb 05, 2026", category: "Academic", urgent: false },
        { title: "Hackathon 2026 Registration Open", date: "Feb 01, 2026", category: "Events", urgent: true }
    ],

    assignments: [
        { title: "Neural Network Implementation", subject: "Artificial Intelligence", due: "Feb 05", priority: "High" },
        { title: "SQL Complex Queries", subject: "Database Systems", due: "Feb 08", priority: "Medium" }
    ]
};
