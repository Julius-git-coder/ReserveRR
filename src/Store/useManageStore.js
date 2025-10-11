

// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// const useManageStore = create(
//   persist(
//     (set, get) => ({
//       // State for Announcements
//       announcements: [],
//       addAnnouncement: (announcement) => {
//         console.log("Store: Adding announcement", announcement);
//         set((state) => {
//           const newAnnouncements = [announcement, ...state.announcements];
//           console.log("Store: New announcements array:", newAnnouncements);
//           return { announcements: newAnnouncements };
//         });
//         // Log after state update
//         setTimeout(() => {
//           console.log("Store: Current state after add:", get().announcements);
//         }, 0);
//       },
//       updateAnnouncement: (id, updatedAnnouncement) =>
//         set((state) => ({
//           announcements: state.announcements.map((a) =>
//             a.id === id ? { ...a, ...updatedAnnouncement } : a
//           ),
//         })),
//       deleteAnnouncement: (id) =>
//         set((state) => ({
//           announcements: state.announcements.filter((a) => a.id !== id),
//         })),

//       // State for Assignments
//       assignments: [],
//       addAssignment: (assignment) =>
//         set((state) => ({
//           assignments: [assignment, ...state.assignments],
//         })),
//       updateAssignment: (id, updatedAssignment) =>
//         set((state) => ({
//           assignments: state.assignments.map((a) =>
//             a.id === id ? { ...a, ...updatedAssignment } : a
//           ),
//         })),
//       deleteAssignment: (id) =>
//         set((state) => ({
//           assignments: state.assignments.filter((a) => a.id !== id),
//         })),

//       // State for Events
//       events: [],
//       addEvent: (event) =>
//         set((state) => ({
//           events: [event, ...state.events],
//         })),
//       updateEvent: (id, updatedEvent) =>
//         set((state) => ({
//           events: state.events.map((e) =>
//             e.id === id ? { ...e, ...updatedEvent } : e
//           ),
//         })),
//       deleteEvent: (id) =>
//         set((state) => ({
//           events: state.events.filter((e) => e.id !== id),
//         })),

//       // State for WorkReady Resources
//       workReadyResources: [],
//       addWorkReadyResource: (resource) =>
//         set((state) => ({
//           workReadyResources: [resource, ...state.workReadyResources],
//         })),

//       // State for Roadmap Items
//       roadmapItems: [],
//       addRoadmapItem: (item) =>
//         set((state) => ({
//           roadmapItems: [item, ...state.roadmapItems],
//         })),

//       // State for Resource Library
//       resources: [],
//       addResource: (resource) =>
//         set((state) => ({
//           resources: [resource, ...state.resources],
//         })),

//       // State for Projects
//       projects: [],
//       addProject: (project) =>
//         set((state) => ({
//           projects: [project, ...state.projects],
//         })),

//       // State for Profile Updates
//       profile: {
//         name: "Julius Dagana",
//         email: "julius@example.com",
//         phone: "+233 24 123 4567",
//         location: "Accra, Ghana",
//         github: "juliusdagana",
//         linkedin: "juliusdagana",
//         bio: "Full-stack developer in training with a passion for building web applications.",
//         cohort: "Cohort 2024-B",
//         startDate: "August 2024",
//       },
//       updateProfile: (updatedProfile) =>
//         set((state) => ({
//           profile: { ...state.profile, ...updatedProfile },
//         })),

//       // State for Grading
//       grades: [],
//       addGrade: (grade) =>
//         set((state) => ({
//           grades: [grade, ...state.grades],
//         })),

//       // State for Exercises
//       exercises: [],
//       addExercise: (exercise) =>
//         set((state) => ({
//           exercises: [exercise, ...state.exercises],
//         })),

//       // State for Directory
//       directory: [],
//       addDirectoryEntry: (entry) =>
//         set((state) => ({
//           directory: [entry, ...state.directory],
//         })),

//       // State for Days of Learning
//       daysOfLearning: {
//         completedDays: 0,
//         totalDays: 100,
//         activities: [],
//       },
//       updateDaysOfLearning: (data) =>
//         set((state) => ({
//           daysOfLearning: { ...state.daysOfLearning, ...data },
//         })),

//       // State for Class Materials
//       classMaterials: [],
//       addClassMaterial: (material) =>
//         set((state) => ({
//           classMaterials: [material, ...state.classMaterials],
//         })),

//       // State for Campus Connect Posts
//       posts: [],
//       addPost: (post) =>
//         set((state) => ({
//           posts: [post, ...state.posts],
//         })),

//       // State for Booked Sessions
//       sessions: [],
//       addSession: (session) =>
//         set((state) => ({
//           sessions: [session, ...state.sessions],
//         })),
//     }),
//     {
//       name: "manage-store", // unique name for localStorage
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

// export default useManageStore;
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useManageStore = create(
  persist(
    (set, get) => ({
      // State for Announcements
      announcements: [],
      addAnnouncement: (announcement) => {
        console.log("Store: Adding announcement", announcement);
        set((state) => {
          const newAnnouncements = [announcement, ...state.announcements];
          console.log("Store: New announcements array:", newAnnouncements);
          return { announcements: newAnnouncements };
        });
        setTimeout(() => {
          console.log("Store: Current state after add:", get().announcements);
        }, 0);
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
      addRoadmapItem: (item) =>
        set((state) => ({
          roadmapItems: [item, ...state.roadmapItems],
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
      directory: [],
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
    }),
    {
      name: "manage-store", // unique name for localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useManageStore;