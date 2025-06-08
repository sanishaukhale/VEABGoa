// This script populates the 'teamMembers' collection in Firestore with dummy data.
// Make sure to:
// 1. Place your Firebase service account key JSON file (renamed to 'serviceAccountKey.json')
//    in this 'scripts' directory.
// 2. Add 'scripts/serviceAccountKey.json' to your .gitignore file.
// 3. Replace 'YOUR_FIRESTORE_PROJECT_ID' with your actual Firebase Project ID.
// 4. Run `npm install` or `yarn install` to get `firebase-admin`.
// 5. Run this script using `node scripts/populateTeamMembers.js` from your project root.

const admin = require('firebase-admin');

// Path to your service account key JSON file
const serviceAccount = require('./serviceAccountKey.json');

// !! IMPORTANT: Replace with your Firebase Project ID !!
const firebaseProjectId = 'veab-goa';

if (firebaseProjectId === 'YOUR_FIRESTORE_PROJECT_ID') {
    console.error("ERROR: Please replace 'YOUR_FIRESTORE_PROJECT_ID' in scripts/populateTeamMembers.js with your actual Firebase Project ID.");
    process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: firebaseProjectId, // Explicitly setting projectId can help in some environments
});

const db = admin.firestore();

const teamMembersData = [
  {
    name: "Chandrakant Shinde",
    role: "President",
    imageUrl: "team-images/chandrakant_shinde.png", // Ensure this image exists in Firebase Storage
    dataAiHint: "man portrait",
    intro: "Leading VEAB Goa with a passion for environmental conservation and community engagement.",
    profession: "Environmental Leader",
    socials: [
      { platform: "Mail", url: "mailto:president@veabgoa.org" },
      { platform: "LinkedIn", url: "https://linkedin.com/in/chandrakantshinde" }
    ],
    displayOrder: 1,
  },
  {
    name: "Sangam Patil",
    role: "Vice President",
    imageUrl: "team-images/sangam_patil.jpg", // Ensure this image exists
    dataAiHint: "person smiling",
    intro: "Dedicated to wildlife protection and ecological research, supporting VEAB's vision.",
    profession: "Wildlife Biologist",
    socials: [
      { platform: "Mail", url: "mailto:vp@veabgoa.org" },
      { platform: "Twitter", url: "https://twitter.com/sangampatil" }
    ],
    displayOrder: 2,
  },
  {
    name: "Deepak Gawas",
    role: "Secretary",
    imageUrl: "team-images/deepak_gawas.png", // Ensure this image exists
    dataAiHint: "man outdoors",
    intro: "Manages VEAB's operations and outreach, fostering community involvement in conservation.",
    profession: "Community Organizer",
    socials: [
      { platform: "Mail", url: "mailto:secretary@veabgoa.org" }
    ],
    displayOrder: 3,
  },
  {
    name: "Ramesh Zarmekar",
    role: "Treasurer",
    imageUrl: "team-images/ramesh_zarmekar.png", // Ensure this image exists
    dataAiHint: "person professional",
    intro: "Oversees VEAB's financial health, ensuring resources are effectively used for conservation projects.",
    profession: "Finance Manager",
    socials: [
      { platform: "Mail", url: "mailto:treasurer@veabgoa.org" }
    ],
    displayOrder: 4,
  },
];

async function populateTeamMembers() {
  const teamMembersCollection = db.collection('teamMembers');
  let count = 0;

  console.log('Starting to populate teamMembers collection...');

  for (const memberData of teamMembersData) {
    try {
      // Check if a member with the same name already exists to avoid duplicates during re-runs
      const snapshot = await teamMembersCollection.where('name', '==', memberData.name).limit(1).get();
      if (snapshot.empty) {
        await teamMembersCollection.add(memberData);
        console.log(`Added: ${memberData.name}`);
        count++;
      } else {
        console.log(`Skipped (already exists): ${memberData.name}`);
      }
    } catch (error) {
      console.error(`Error adding ${memberData.name}:`, error);
    }
  }

  console.log(`\nFinished populating team members. ${count} new members added.`);
  if (teamMembersData.length - count > 0) {
      console.log(`${teamMembersData.length - count} members were already present.`);
  }
}

populateTeamMembers().catch(error => {
  console.error('An error occurred during script execution:', error);
});
