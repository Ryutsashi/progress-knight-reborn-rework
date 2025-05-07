# saveLoad.js refactor

## Progress log

-  Created the temporary `NOTES.md` file to keep track of current progress for the remaining parts of the saveLoad refactor
-  Created `class Serializble` as syntactic sugar for the JSON and base64 conversion pipeline, and added it to index.html
-  `saveGameData()` is now two different methods: `getFullGameState()` and `saveStateToLocalStorage()` and accepts state
-  `loadGameData()` is now two different methods: `loadStateFromLocalStorage()` and returns state

## Existing methods

- [x] [skipped for now] `saveSkipSkillsAndDarkMode()`

	> Ideally:
	> 1. would read from data,
	> 2. or the data would already include it so the whole function could be removed,
	> 3. or would be a UI update method

	Sets `gameData[prop] = value` directly
	
  - `autoPromote = ` checkbox value
  - `autoLearn = ` checkbox value
  - `skippedSkills.push()` checkbox values
  - `darkMode` if body has .dark

---

- [x] [skipped for now] `loadSkipSkillsAndDarkMode()`

	> Ideally would be a UI update method

	Does the oposite of `saveSkipSkillsAndDarkMode()`

	Also calls `toggleLightDarkMode()`

---

- [x] `saveGameData()`

	> Ideally would be either a `saveToLocalStorage()` or `saveToFile()`, and be passed the data to be saved

	Calls `saveSkipSkillsAndDarkMode()` and `saveTownState()`, then puts `gameData` JSON in `localStorage`

---

- [ ] [in progress] `loadGameData()`

	> Ideally would be either a `loadFromLocalStorage()` or `loadFromFile()` or `loadFromInput()`, and return data that would then be parsed as JSON or even `JSON.parse(atob())`

	Parses JSON directly from `localStorage` and if it exists calls `applyVersionMigrationsToData()` and `loadSkipSkillsAndDarkMode()`

	Regardless, calls `loadTownState()`, `calculateRawTownIncome()` and `assignMethods()`

---

- [ ] `resetGameData()`

	Just clears `localStorage` and refreshes the page

---

- [ ] `importGameData()`

	> Ideally, this would only fetch the data from the input box and pass it on to be parsed

	Calls `JSON.parse(atob())` on the value of #importExportBox

	Sets `gameData` directly, calls `saveGameData()` and refreshes the page

---

- [ ] `exportGameData()`

	> Ideally, this would take in the already serialized string data as a parameter and put it in the input box

	This just sets the value of #importExportBox to `btoa(JSON.stringify())`

---

- [ ] `loadGameDataFromFile()`

	> Ideally, this would only load the file and pass it on to be parsed

	Uses a `FileReader` on an `<input type="file">` element to let the user select a file

	On load, uses `JSOn.parse(atob())` on the file text content, sets `gameData` directly, calls `saveGameData()` and refreshes the page

---

- [ ] `downloadGameData()`

	> 

	Specifies `filename`, seriealizes the gameData directly to base 64 through `btoa(JSON.stringify())` and creates a new file `Blob`

	Creates a new `<a>` element, sets its download to `filename`, its `href` to the `createObjectURL(file)` and calls `click()` on it, then revokes the URL of the `Blob`

	Has some support for IE10+ and uses `window.navigator.msSaveOrOpenBlob()` instead of all of the above

