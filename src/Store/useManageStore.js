
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useManageStore = create(
  persist(
    (set, get) => ({
      // Initial directory data
      directory: [
        {
          id: 1,
          name: "Julius Dagana",
          email: "julius@example.com",
          role: "Student",
          github: "juliusdagana",
          cohort: "2024-B",
        },
        {
          id: 2,
          name: "Admin",
          email: "admin@gradea.com",
          role: "Administrator",
          github: "admin",
          cohort: "Staff",
        },
        {
          id: 3,
          name: "Instructor Smith",
          email: "smith@example.com",
          role: "Instructor",
          github: "smith",
          specialty: "Web Development",
        },
        {
          id: 4,
          name: "TA John",
          email: "john@example.com",
          role: "Teaching Assistant",
          github: "johnTA",
          cohort: "2024-A",
        },
      ],

      // Friend requests state
      friendRequests: [],
      sendFriendRequest: (fromId, toId) => {
        const existing = get().friendRequests.find(
          (r) =>
            r.fromId === fromId && r.toId === toId && r.status === "pending"
        );
        if (existing) return; // Already pending

        const newRequest = {
          id: Date.now(),
          fromId,
          toId,
          status: "pending",
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          friendRequests: [...state.friendRequests, newRequest],
        }));
      },
      acceptFriendRequest: (requestId) => {
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: "accepted" } : r
          ),
        }));
      },
      rejectFriendRequest: (requestId) => {
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: "rejected" } : r
          ),
        }));
      },

      // Conversations state
      conversations: {},
      addMessage: (user1Id, user2Id, senderId, text) => {
        const key = [
          Math.min(user1Id, user2Id),
          Math.max(user1Id, user2Id),
        ].join("-");
        const messageId = Date.now();
        const message = {
          id: messageId,
          senderId,
          text,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          conversations: {
            ...state.conversations,
            [key]: [
              ...(state.conversations[key] || []),
              message,
            ],
          },
        }));

        // Add notification to recipient
        const recipientId = user1Id === senderId ? user2Id : user1Id;
        if (recipientId !== senderId) {
          const newNotif = {
            id: Date.now() + 1,
            userId: recipientId,
            type: "message",
            fromUserId: senderId,
            messageId,
            read: false,
            timestamp: new Date().toISOString(),
          };
          get().addNotification(newNotif);
        }
      },

      // Notifications state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),
      markAsRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        })),

      // State for Announcements
      announcements: [],
      addAnnouncement: (announcement) => {
        console.log("Store: Adding announcement", announcement);
        set((state) => {
          const newAnnouncements = [announcement, ...state.announcements];
          console.log("Store: New announcements array:", newAnnouncements);
          return { announcements: newAnnouncements };
        });
      },
      updateAnnouncement: (id, updatedAnnouncement) =>
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === id ? { ...a, ...updatedAnnouncement } : a
          ),
        })),
      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),

      // State for Assignments
      assignments: [],
      addAssignment: (assignment) =>
        set((state) => ({
          assignments: [assignment, ...state.assignments],
        })),
      updateAssignment: (id, updatedAssignment) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, ...updatedAssignment } : a
          ),
        })),
      deleteAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        })),

      // State for Events
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [event, ...state.events],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updatedEvent } : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),

      // State for WorkReady Resources
      workReadyResources: [],
      addWorkReadyResource: (resource) =>
        set((state) => ({
          workReadyResources: [resource, ...state.workReadyResources],
        })),

      // State for Roadmap Items
      roadmapItems: [],
      addRoadmapItem: (item) => {
        console.log("🔷 Store: Adding roadmap item", item);
        set((state) => {
          const newItems = [item, ...state.roadmapItems];
          console.log("🔷 Store: New roadmapItems array:", newItems);
          return { roadmapItems: newItems };
        });
      },
      updateRoadmapItem: (id, updates) => {
        console.log("🔷 Store: Updating roadmap item", { id, updates });
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      deleteRoadmapItem: (id) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.filter((item) => item.id !== id),
        })),

      // Add a week to a roadmap
      addWeekToRoadmap: (roadmapId, weekNumber, topic) => {
        console.log("🔶 Store: Adding week", { roadmapId, weekNumber, topic });
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeek = {
                weekNumber: weekNumber,
                week: weekNumber,
                topic: topic,
                current: false,
                next: false,
                subTopics: [],
              };
              const newWeeks = [...(item.weeks || []), newWeek];
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          return { roadmapItems: newRoadmapItems };
        });
      },

      // Add a subtopic to a specific week
      addSubTopicToWeek: (roadmapId, weekIndex, subTopicName) => {
        console.log("🟢 Store: Adding subtopic START", {
          roadmapId,
          weekIndex,
          subTopicName,
        });
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = JSON.parse(JSON.stringify(item.weeks || []));
              if (weekIndex >= 0 && weekIndex < newWeeks.length) {
                const targetWeek = newWeeks[weekIndex];
                if (!targetWeek.subTopics) {
                  targetWeek.subTopics = [];
                }
                const maxId =
                  targetWeek.subTopics.length > 0
                    ? Math.max(...targetWeek.subTopics.map((st) => st.id))
                    : 0;
                const newSubTopic = {
                  id: maxId + 1,
                  name: subTopicName,
                  completed: false,
                };
                targetWeek.subTopics.push(newSubTopic);
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          return { roadmapItems: newRoadmapItems };
        });
      },

      // Toggle subtopic completion
      toggleSubTopicComplete: (roadmapId, weekIndex, subTopicId) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = [...item.weeks];
              const week = newWeeks[weekIndex];
              if (week) {
                week.subTopics = week.subTopics.map((st) =>
                  st.id === subTopicId
                    ? { ...st, completed: !st.completed }
                    : st
                );
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        })),

      // Delete a subtopic
      deleteSubTopic: (roadmapId, weekIndex, subTopicId) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = [...item.weeks];
              if (newWeeks[weekIndex]) {
                newWeeks[weekIndex].subTopics = newWeeks[
                  weekIndex
                ].subTopics.filter((st) => st.id !== subTopicId);
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        })),

      // Set current week
      setCurrentWeek: (roadmapId, weekIndex) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = item.weeks.map((w, idx) => ({
                ...w,
                current: idx === weekIndex,
                next: idx === weekIndex + 1,
              }));
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        })),

      // State for Resource Library
      resources: [],
      addResource: (resource) =>
        set((state) => ({
          resources: [resource, ...state.resources],
        })),

      // State for Projects
      projects: [],
      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
        })),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      // State for Profile Updates
      profile: {
        name: "Julius Dagana",
        email: "julius@example.com",
        phone: "+233 24 123 4567",
        location: "Accra, Ghana",
        github: "juliusdagana",
        linkedin: "juliusdagana",
        bio: "Full-stack developer in training with a passion for building web applications.",
        cohort: "Cohort 2024-B",
        startDate: "August 2024",
      },
      updateProfile: (updatedProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...updatedProfile },
        })),

      // State for Grading
      grades: [],
      addGrade: (grade) =>
        set((state) => ({
          grades: [grade, ...state.grades],
        })),

      // State for Exercises
      exercises: [],
      addExercise: (exercise) =>
        set((state) => ({
          exercises: [exercise, ...state.exercises],
        })),
      updateExercise: (id, updatedExercise) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, ...updatedExercise } : e
          ),
        })),
      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),

      // State for Directory
      addDirectoryEntry: (entry) =>
        set((state) => ({
          directory: [entry, ...state.directory],
        })),

      // State for Days of Learning
      daysOfLearning: {
        completedDays: 0,
        totalDays: 100,
        activities: [],
      },
      updateDaysOfLearning: (data) =>
        set((state) => ({
          daysOfLearning: { ...state.daysOfLearning, ...data },
        })),

      // State for Class Materials
      classMaterials: [],
      addClassMaterial: (material) =>
        set((state) => ({
          classMaterials: [material, ...state.classMaterials],
        })),
      updateClassMaterial: (id, updatedMaterial) =>
        set((state) => ({
          classMaterials: state.classMaterials.map((m) =>
            m.id === id ? { ...m, ...updatedMaterial } : m
          ),
        })),
      deleteClassMaterial: (id) =>
        set((state) => ({
          classMaterials: state.classMaterials.filter((m) => m.id !== id),
        })),

      // State for Campus Connect Posts
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),

      // State for Booked Sessions
      sessions: [],
      addSession: (session) =>
        set((state) => ({
          sessions: [session, ...state.sessions],
        })),

      // State for Attendance
      attendance: [],
      addAttendance: (attendance) =>
        set((state) => ({
          attendance: [attendance, ...state.attendance],
        })),
      updateAttendance: (id, updatedAttendance) =>
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.id === id ? { ...a, ...updatedAttendance } : a
          ),
        })),
      deleteAttendance: (id) =>
        set((state) => ({
          attendance: state.attendance.filter((a) => a.id !== id),
        })),

      // State for Programs
      programs: [],
      addProgram: (program) =>
        set((state) => ({
          programs: [program, ...state.programs],
        })),
      updateProgram: (id, updatedProgram) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === id ? { ...p, ...updatedProgram } : p
          ),
        })),
      deleteProgram: (id) =>
        set((state) => ({
          programs: state.programs.filter((p) => p.id !== id),
        })),
      addMilestoneToProgram: (programId, milestoneName) => {
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              const newMilestones = [...(p.milestones || [])];
              const maxId =
                newMilestones.length > 0
                  ? Math.max(...newMilestones.map((m) => m.id))
                  : 0;
              newMilestones.push({
                id: maxId + 1,
                name: milestoneName,
                completed: false,
              });
              return { ...p, milestones: newMilestones };
            }
            return p;
          }),
        }));
      },
      adminToggleMilestoneComplete: (programId, milestoneId) =>
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                milestones:
                  p.milestones?.map((m) =>
                    m.id === milestoneId ? { ...m, completed: !m.completed } : m
                  ) || [],
              };
            }
            return p;
          }),
        })),
      requestJoinProgram: (programId, studentId = 1) =>
        set((state) => ({
          programs: state.programs.map((p) => {
            if (
              p.id === programId &&
              !p.pendingRequests?.includes(studentId) &&
              !p.enrolledStudents?.includes(studentId)
            ) {
              return {
                ...p,
                pendingRequests: [...(p.pendingRequests || []), studentId],
              };
            }
            return p;
          }),
        })),
      approveJoinRequest: (programId, studentId = 1) =>
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              const pending =
                p.pendingRequests?.filter((id) => id !== studentId) || [];
              const enrolled = [...(p.enrolledStudents || []), studentId];
              return {
                ...p,
                pendingRequests: pending,
                enrolledStudents: enrolled,
              };
            }
            return p;
          }),
        })),
      rejectJoinRequest: (programId, studentId = 1) =>
        set((state) => ({
          programs: state.programs.map((p) => {
            if (p.id === programId) {
              const pending =
                p.pendingRequests?.filter((id) => id !== studentId) || [];
              return {
                ...p,
                pendingRequests: pending,
              };
            }
            return p;
          }),
        })),
    }),
    {
      name: "manage-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useManageStore;