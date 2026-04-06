export const saveWork = (data) => {
  const fileName = prompt("Enter file name:", "guitar-tab-work");
  if (!fileName) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${fileName}.json`;
  a.click();

  URL.revokeObjectURL(url);
};

export const importWork = (event, setters) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);

      if (data.tabRows) setters.setTabRows(data.tabRows);
      if (data.capo !== undefined) setters.setCapo(data.capo);
      if (data.tempo !== undefined) setters.setTempo(data.tempo);
      if (data.playMode) setters.setPlayMode(data.playMode);
    } catch {
      alert("Invalid file format");
    }
  };

  reader.readAsText(file);
};