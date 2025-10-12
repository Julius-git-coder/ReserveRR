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

      // State for Roadmap Items - ENHANCED WITH BETTER LOGGING
      roadmapItems: [],
      addRoadmapItem: (item) => {
        console.log("🔷 Store: Adding roadmap item", item);
        set((state) => {
          const newItems = [item, ...state.roadmapItems];
          console.log("🔷 Store: New roadmapItems array:", newItems);
          return { roadmapItems: newItems };
        });
        setTimeout(() => {
          console.log(
            "🔷 Store: Verified roadmapItems after add:",
            get().roadmapItems
          );
        }, 100);
      },
      updateRoadmapItem: (id, updates) => {
        console.log("🔷 Store: Updating roadmap item", { id, updates });
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
        setTimeout(() => {
          console.log(
            "🔷 Store: Verified roadmapItems after update:",
            get().roadmapItems
          );
        }, 100);
      },
      deleteRoadmapItem: (id) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.filter((item) => item.id !== id),
        })),

      // Add a week to a roadmap
      addWeekToRoadmap: (roadmapId, weekNumber, topic) => {
        console.log("🔶 Store: Adding week", { roadmapId, weekNumber, topic });
        console.log(
          "🔶 Store: Current roadmapItems BEFORE:",
          JSON.parse(JSON.stringify(get().roadmapItems))
        );

        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              console.log(
                "🔶 Store: Found matching roadmap, current weeks:",
                item.weeks
              );
              const newWeek = {
                weekNumber: weekNumber,
                week: weekNumber,
                topic: topic,
                current: false,
                next: false,
                subTopics: [],
              };
              const newWeeks = [...(item.weeks || []), newWeek];
              console.log("🔶 Store: New weeks array:", newWeeks);
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          console.log(
            "🔶 Store: New roadmapItems:",
            JSON.parse(JSON.stringify(newRoadmapItems))
          );
          return { roadmapItems: newRoadmapItems };
        });

        setTimeout(() => {
          console.log(
            "🔶 Store: Verified roadmapItems AFTER add week:",
            JSON.parse(JSON.stringify(get().roadmapItems))
          );
        }, 100);
      },

      // Add a subtopic to a specific week
      addSubTopicToWeek: (roadmapId, weekIndex, subTopicName) => {
        console.log("🟢 Store: Adding subtopic START", {
          roadmapId,
          weekIndex,
          subTopicName,
        });
        console.log(
          "🟢 Store: Current state BEFORE:",
          JSON.parse(JSON.stringify(get().roadmapItems))
        );

        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              console.log(
                "🟢 Store: Found matching roadmap item:",
                JSON.parse(JSON.stringify(item))
              );

              // Make a deep copy of weeks
              const newWeeks = JSON.parse(JSON.stringify(item.weeks || []));
              console.log("🟢 Store: Copied weeks array:", newWeeks);
              console.log("🟢 Store: Total weeks:", newWeeks.length);
              console.log(
                "🟢 Store: Trying to access week at index:",
                weekIndex
              );

              if (weekIndex >= 0 && weekIndex < newWeeks.length) {
                const targetWeek = newWeeks[weekIndex];
                console.log(
                  "🟢 Store: Found week at index",
                  weekIndex,
                  ":",
                  targetWeek
                );

                // Ensure subTopics array exists
                if (!targetWeek.subTopics) {
                  targetWeek.subTopics = [];
                }

                console.log(
                  "🟢 Store: Current subTopics:",
                  targetWeek.subTopics
                );

                // Generate new ID
                const maxId =
                  targetWeek.subTopics.length > 0
                    ? Math.max(...targetWeek.subTopics.map((st) => st.id))
                    : 0;

                const newSubTopic = {
                  id: maxId + 1,
                  name: subTopicName,
                  completed: false,
                };

                console.log("🟢 Store: Creating new subtopic:", newSubTopic);
                targetWeek.subTopics.push(newSubTopic);
                console.log(
                  "🟢 Store: Updated subTopics array:",
                  targetWeek.subTopics
                );
                console.log("🟢 Store: Updated week:", targetWeek);
              } else {
                console.error("🔴 Store: Week index OUT OF BOUNDS!", {
                  weekIndex,
                  totalWeeks: newWeeks.length,
                  availableIndexes: newWeeks.map((w, i) => i),
                });
              }

              const updatedItem = { ...item, weeks: newWeeks };
              console.log(
                "🟢 Store: Final updated item:",
                JSON.parse(JSON.stringify(updatedItem))
              );
              return updatedItem;
            }
            return item;
          });

          console.log(
            "🟢 Store: Final newRoadmapItems:",
            JSON.parse(JSON.stringify(newRoadmapItems))
          );
          return { roadmapItems: newRoadmapItems };
        });

        setTimeout(() => {
          const finalState = get().roadmapItems;
          console.log(
            "🟢 Store: Verified state AFTER add subtopic:",
            JSON.parse(JSON.stringify(finalState))
          );

          // Find and log the specific roadmap item
          const targetItem = finalState.find((item) => item.id === roadmapId);
          if (targetItem) {
            console.log(
              "🟢 Store: Target roadmap after update:",
              JSON.parse(JSON.stringify(targetItem))
            );
            if (targetItem.weeks && targetItem.weeks[weekIndex]) {
              console.log(
                "🟢 Store: Target week after update:",
                JSON.parse(JSON.stringify(targetItem.weeks[weekIndex]))
              );
            }
          }
        }, 100);
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
