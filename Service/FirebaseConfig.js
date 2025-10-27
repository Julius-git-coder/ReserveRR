



import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  serverTimestamp,
  onSnapshot,
  getCountFromServer,
  orderBy,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyDn4JOWuD1ppfPa_mxaOXAg0VUrNOKyA",
  authDomain: "grade-a6b87.firebaseapp.com",
  projectId: "grade-a6b87",
  storageBucket: "grade-a6b87.firebasestorage.app",
  messagingSenderId: "835138846017",
  appId: "1:835138846017:web:01dab3e25834d9a8def5c0",
  measurementId: "G-T1NY5N1Y3G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Signup (Unique Admin ID - Chosen by Admin; auto-creates team)
async function adminSignup(email, password, adminId) {
  try {
    // Check if adminId (teamId) is unique
    const teamRef = doc(db, "teams", adminId);
    const teamSnap = await getDoc(teamRef);
    if (teamSnap.exists()) {
      throw new Error("Admin ID already exists. Please choose a unique ID.");
    }
    // Create user with Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const uid = user.uid;
    // Store admin data in unified /users collection
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      email: email,
      role: "admin",
      teamId: adminId,
      adminId: adminId,
      createdAt: serverTimestamp(),
    });
    // Create team document
    await setDoc(teamRef, {
      adminId: uid,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    // Add admin to own team members
    await setDoc(doc(db, "teams", adminId, "members", uid), {
      uid: uid,
      email: email,
      joinedAt: serverTimestamp(),
    });
    console.log("Admin created successfully");
    return user;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

// Student Signup (Assignment to Admin Team via adminId as teamId)
async function studentSignup(email, password, adminId) {
  try {
    // Find team by adminId
    const teamRef = doc(db, "teams", adminId);
    const teamSnap = await getDoc(teamRef);
    if (!teamSnap.exists()) {
      throw new Error("No admin found with this ID. Signup denied.");
    }
    const adminUid = teamSnap.data().adminId;
    // Create student user with Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const studentUid = userCredential.user.uid;
    // Store student data in unified /users collection
    await setDoc(doc(db, "users", studentUid), {
      uid: studentUid,
      email: email,
      role: "student",
      teamId: adminId,
      createdAt: serverTimestamp(),
    });
    // Add student to team's members subcollection
    await setDoc(doc(db, "teams", adminId, "members", studentUid), {
      uid: studentUid,
      email: email,
      joinedAt: serverTimestamp(),
    });
    console.log("Student assigned to admin team successfully");
    return userCredential.user;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

// Login function
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Get User Profile from Firestore (unified in 'users' collection)
async function getUserProfile(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      let profile = userDocSnap.data();
      // Map createdAt to startDate if present
      if (profile.createdAt) {
        profile.startDate = profile.createdAt.toDate().toLocaleDateString();
      }
      // Add defaults based on role
      if (profile.role === "admin") {
        profile.name = profile.name || "";
        profile.phone = profile.phone || "";
        profile.location = profile.location || "";
        profile.github = profile.github || "";
        profile.linkedin = profile.linkedin || "";
        profile.bio = profile.bio || "";
        profile.cohort = "Staff";
      } else if (profile.role === "student") {
        profile.name = profile.name || "";
        profile.phone = profile.phone || "";
        profile.location = profile.location || "";
        profile.github = profile.github || "";
        profile.linkedin = profile.linkedin || "";
        profile.bio = profile.bio || "";
        profile.cohort = profile.cohort || "2024-B";
      }
      return profile;
    }
    // If no profile found, return null
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Save User Profile to Firestore (unified in 'users' collection)
async function saveUserProfile(uid, profile) {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...profile,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// Admin Dashboard (Display Total Students via team members count)
async function getStudentCount(teamId) {
  const membersCol = collection(db, "teams", teamId, "members");
  const snapshot = await getCountFromServer(membersCol);
  return snapshot.data().count;
}

function loadAdminDashboard(teamId, callback) {
  const membersCol = collection(db, "teams", teamId, "members");
  onSnapshot(membersCol, () => {
    getStudentCount(teamId).then((count) => callback(count));
  });
}

// Sending Team-Wide Message (to /teams/{teamId}/teamMessages)
async function sendTeamMessage(teamId, message) {
  try {
    await addDoc(collection(db, "teams", teamId, "teamMessages"), {
      message: message,
      sender: "admin", // Or admin's name/ID
      timestamp: serverTimestamp(),
      isTeamMessage: true,
    });
    console.log("Team message sent");
  } catch (error) {
    console.error("Error sending team message:", error);
  }
}

// Sending Private Message to Specific Student
async function sendPrivateMessage(senderUid, receiverUid, message) {
  try {
    await addDoc(collection(db, "privateMessages"), {
      senderUid: senderUid,
      receiverUid: receiverUid,
      message: message,
      timestamp: serverTimestamp(),
      isPrivate: true,
    });
    console.log("Private message sent");
  } catch (error) {
    console.error("Error sending private message:", error);
  }
}

// Get list of students for admin (for private messaging; excludes admin self)
async function getAdminStudents(teamId) {
  const membersCol = collection(db, "teams", teamId, "members");
  const snapshot = await getDocs(membersCol);
  return snapshot.docs
    .map((doc) => ({ uid: doc.id, ...doc.data() }))
    .filter((member) => member.uid !== teamId); // Exclude admin (admin UID != teamId, but filter if needed)
}

// Listening to Messages for Students (Team + Private Sent and Received for full conversations)
function listenToStudentMessages(studentUid, teamCallback, privateCallback) {
  return getDoc(doc(db, "users", studentUid))
    .then((userDoc) => {
      if (!userDoc.exists()) {
        console.warn("No student document found");
        return () => {};
      }
      const userData = userDoc.data();
      const teamId = userData.teamId;
      const unsubscribes = [];
      // Listen to team messages
      if (teamId && teamCallback) {
        const teamQuery = query(
          collection(db, `teams/${teamId}/teamMessages`),
          orderBy("timestamp", "desc")
        );
        const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          teamCallback(messages); // Newest first due to desc order
        });
        unsubscribes.push(unsubscribeTeam);
      }
      // Listen to private messages - combined sent and received
      if (privateCallback) {
        const allPrivateMessagesRef = { sent: [], received: [] };
        const updatePrivateMessages = () => {
          const combined = [
            ...allPrivateMessagesRef.sent,
            ...allPrivateMessagesRef.received,
          ].sort(
            (a, b) =>
              (a.timestamp || new Date(0)) - (b.timestamp || new Date(0))
          );
          privateCallback(combined.reverse()); // Newest first
        };
        // Listen to sent messages
        const sentQuery = query(
          collection(db, "privateMessages"),
          where("senderUid", "==", studentUid)
        );
        const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
          allPrivateMessagesRef.sent = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeSent);
        // Listen to received messages
        const receivedQuery = query(
          collection(db, "privateMessages"),
          where("receiverUid", "==", studentUid)
        );
        const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
          allPrivateMessagesRef.received = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeReceived);
      }
      return () => unsubscribes.forEach((unsub) => unsub());
    })
    .catch((error) => {
      console.error("Error setting up student message listeners:", error);
      return () => {};
    });
}

// Listening to Messages for Admins (Team + Private Sent and Received for full conversations)
function listenToAdminMessages(adminUid, teamCallback, privateCallback) {
  return getDoc(doc(db, "users", adminUid))
    .then((userDoc) => {
      if (!userDoc.exists()) {
        console.warn("No admin document found");
        return () => {};
      }
      const userData = userDoc.data();
      const teamId = userData.teamId;
      const unsubscribes = [];
      // Listen to team messages
      if (teamId && teamCallback) {
        const teamQuery = query(
          collection(db, `teams/${teamId}/teamMessages`),
          orderBy("timestamp", "desc")
        );
        const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          teamCallback(messages); // Newest first due to desc order
        });
        unsubscribes.push(unsubscribeTeam);
      }
      // Listen to private messages - combined sent and received
      if (privateCallback) {
        const allPrivateMessagesRef = { sent: [], received: [] };
        const updatePrivateMessages = () => {
          const combined = [
            ...allPrivateMessagesRef.sent,
            ...allPrivateMessagesRef.received,
          ].sort(
            (a, b) =>
              (a.timestamp || new Date(0)) - (b.timestamp || new Date(0))
          );
          privateCallback(combined.reverse()); // Newest first
        };
        // Listen to sent messages
        const sentQuery = query(
          collection(db, "privateMessages"),
          where("senderUid", "==", adminUid)
        );
        const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
          allPrivateMessagesRef.sent = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeSent);
        // Listen to received messages
        const receivedQuery = query(
          collection(db, "privateMessages"),
          where("receiverUid", "==", adminUid)
        );
        const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
          allPrivateMessagesRef.received = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeReceived);
      }
      return () => unsubscribes.forEach((unsub) => unsub());
    })
    .catch((error) => {
      console.error("Error setting up admin message listeners:", error);
      return () => {};
    });
}

// Export functions and Firebase instances
export {
  auth,
  db,
  adminSignup,
  studentSignup,
  login,
  loadAdminDashboard,
  getStudentCount,
  sendTeamMessage,
  sendPrivateMessage,
  getAdminStudents,
  listenToStudentMessages,
  listenToAdminMessages,
  onAuthStateChanged,
  signOut,
  getUserProfile,
  saveUserProfile,
};
