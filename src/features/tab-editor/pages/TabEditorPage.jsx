import ScreenContainer from "../../../shared/ui/ScreenContainer";

import EditorHeader from "../components/layout/EditorHeader";

import EditorShell from "../components/layout/EditorShell";

import Toolbar from "../components/editor/Toolbar";

import TransportControls from "../components/editor/TransportControls";

import Fretboard from "../components/editor/Fretboard";

import useTabEditor from "../hooks/useTabEditor";

export default function TabEditorPage() {
  const editor =
    useTabEditor();

  return (
    <ScreenContainer>
      <div className="space-y-6">
        <EditorHeader />

        <EditorShell
          sidebar={
            <div className="space-y-6">
              Sidebar
            </div>
          }
          controls={
            <div className="space-y-6">
              <Toolbar
                capo={editor.capo}
                setCapo={
                  editor.setCapo
                }
                tempo={
                  editor.tempo
                }
                setTempo={
                  editor.setTempo
                }
              />

              <TransportControls
                onAddStep={
                  editor.addStep
                }
                onNewRow={
                  editor.addRow
                }
              />
            </div>
          }
          fretboard={
            <Fretboard
              capo={editor.capo}
              selectedNotes={
                editor.selectedNotes
              }
              setSelectedNotes={
                editor.setSelectedNotes
              }
            />
          }
        />
      </div>
    </ScreenContainer>
  );
}