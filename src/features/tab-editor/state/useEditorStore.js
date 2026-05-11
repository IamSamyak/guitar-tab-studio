import { create } from "zustand";

export const useEditorStore =
  create((set) => ({
    capo: 0,
    tempo: 90,

    playMode: "chord",

    selectedNotes: [],

    currentRow: 0,

    editingStepIndex: null,

    tabRows: [
      {
        name: "Section 1",
        steps: [],
      },
    ],

    /* =========================
       SETTERS
    ========================= */

    setCapo: (capo) =>
      set({ capo }),

    setTempo: (tempo) =>
      set({ tempo }),

    setPlayMode: (
      playMode
    ) =>
      set({ playMode }),

    setSelectedNotes: (
      selectedNotes
    ) =>
      set({ selectedNotes }),

    setCurrentRow: (
      currentRow
    ) =>
      set({ currentRow }),

    setEditingStepIndex: (
      editingStepIndex
    ) =>
      set({
        editingStepIndex,
      }),

    /* =========================
       ADD STEP
    ========================= */

    addStep: () =>
      set((state) => {
        if (
          state.selectedNotes
            .length === 0
        ) {
          return {};
        }

        const updated = [
          ...state.tabRows,
        ];

        const row = {
          ...updated[
            state.currentRow
          ],
        };

        if (
          state.editingStepIndex !==
          null
        ) {
          const steps = [
            ...row.steps,
          ];

          steps[
            state
              .editingStepIndex
          ] =
            state.selectedNotes;

          row.steps = steps;
        } else {
          row.steps = [
            ...row.steps,
            state.selectedNotes,
          ];
        }

        updated[
          state.currentRow
        ] = row;

        return {
          tabRows: updated,

          selectedNotes: [],

          editingStepIndex:
            null,
        };
      }),

    /* =========================
       ADD ROW
    ========================= */

    addRow: () =>
      set((state) => ({
        tabRows: [
          ...state.tabRows,
          {
            name: `Section ${
              state.tabRows
                .length + 1
            }`,
            steps: [],
          },
        ],

        currentRow:
          state.tabRows.length,

        selectedNotes: [],

        editingStepIndex:
          null,
      })),
  }));