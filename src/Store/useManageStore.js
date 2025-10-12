
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

      // State for Roadmap Items - ENHANCED
      roadmapItems: [],
      addRoadmapItem: (item) =>
        set((state) => ({
          roadmapItems: [item, ...state.roadmapItems],
        })),
      updateRoadmapItem: (id, updates) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      deleteRoadmapItem: (id) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.filter((item) => item.id !== id),
        })),

      // Add a week to a roadmap
      addWeekToRoadmap: (roadmapId, weekNumber, topic) => {
        console.log("Store: Adding week", { roadmapId, weekNumber, topic });
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = [
                ...item.weeks,
                {
                  weekNumber: weekNumber,
                  week: weekNumber,
                  topic: topic,
                  current: false,
                  next: false,
                  subTopics: [],
                },
              ];
              console.log("Store: New weeks array:", newWeeks);
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        }));
        setTimeout(() => {
          console.log(
            "Store: Current roadmapItems after add week:",
            get().roadmapItems
          );
        }, 0);
      },

      // Add a subtopic to a specific week
      addSubTopicToWeek: (roadmapId, weekIndex, subTopicName) => {
        console.log("Store: Adding subtopic", {
          roadmapId,
          weekIndex,
          subTopicName,
        });
        console.log("Store: Current state before add:", get().roadmapItems);

        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              console.log("Store: Found matching roadmap item:", item);
              const newWeeks = [...item.weeks];

              if (newWeeks[weekIndex]) {
                console.log(
                  "Store: Found week at index",
                  weekIndex,
                  newWeeks[weekIndex]
                );
                const maxId =
                  newWeeks[weekIndex].subTopics.length > 0
                    ? Math.max(
                        ...newWeeks[weekIndex].subTopics.map((st) => st.id)
                      )
                    : 0;

                const newSubTopic = {
                  id: maxId + 1,
                  name: subTopicName,
                  completed: false,
                };

                console.log("Store: Adding new subtopic:", newSubTopic);
                newWeeks[weekIndex] = {
                  ...newWeeks[weekIndex],
                  subTopics: [...newWeeks[weekIndex].subTopics, newSubTopic],
                };

                console.log("Store: Updated week:", newWeeks[weekIndex]);
              } else {
                console.error(
                  "Store: Week index not found:",
                  weekIndex,
                  "Total weeks:",
                  newWeeks.length
                );
              }

              return { ...item, weeks: newWeeks };
            }
            return item;
          });

          console.log("Store: New roadmapItems:", newRoadmapItems);
          return { roadmapItems: newRoadmapItems };
        });

        setTimeout(() => {
          console.log(
            "Store: Current state after add subtopic:",
            get().roadmapItems
          );
        }, 0);
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
    }),
    {
      name: "manage-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useManageStore;