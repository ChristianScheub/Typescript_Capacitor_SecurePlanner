# Secure Planner

Last Edit: 03.2024 <br>
Language: Typescript React Capacitor<br>
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner) 
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)
 [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner) 
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ChristianScheub_Typescript_Capacitor_SecurePlanner&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=ChristianScheub_Typescript_Capacitor_SecurePlanner)


With this app, it is possible to securely store ToDo Lists locally with AES & Triple DES encryption, edit/delete them and search them.
It is also possible to decrypt the ToDo Lists using native biometrics (e.g. fingerprint sensor). (More on this under Security)
In addition to the security factor, the aim of this app is to enable the best possible organization of various ToDo elements. This is implemented through the mini dashboards in the overview etc., prioritization, categories and end dates for the individual ToDos.

Google Play Store: https://play.google.com/store/apps/details?id=de.scheub.securePlaner
<br />
Apple App Store: https://apps.apple.com/de/app/secureplanner/id6478185630
<br><br><br>

Deutsche Kurzbeschreibung:
Mit dieser App ist es möglich To DO Listen mit AES-Verschlüsselung & TripleDES sicher lokal zu speichern, sie zu bearbeiten/löschen und sie zu durchsuchen.
Zudem ist es möglich mithilfe der Native Biometric (z.B. Fingerabdruck Sensor) die Listen zu entschlüsseln. (Mehr dazu unter Security)
Neben dem Sicherheitsfaktor ist es das Ziel dieser App, die bestmögliche Organisation der verschiedenen ToDo-Elemente zu ermöglichen. Dies wird durch die Mini-Dashboards in der Übersicht etc., die Priorisierung und Deadlines für die einzelnen ToDos umgesetzt.

| App Store Screen 1                                                      | App Store Screen 2                                                      |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| <img src="images/screens/screen1.jpeg" alt="Start Screen" height="300"> | <img src="images/screens/screens2.PNG" alt="Start Screen" height="300"> |

| Start Screen                                                            | ToDo List Overview                                                                         | ToDo List Edit                                                                     | Settings                                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| <img src="images/screens/screen7.jpeg" alt="Start Screen" height="300"> | <img src="images/screens/screen3_overallList.jpeg" alt="ToDo Lists Overview" height="300"> | <img src="images/screens/screen4_ToDoList.jpeg" alt="ToDo List Edit" height="300"> | <img src="images/settingsScreen.png" alt="Settings" height="300"> |

## Security

First of all: All To Do Lists are stored encrypted with AES256.

- The user's password is first hashed using PBKDF2 with 60,001 iterations and a fixed salt. (With medium security setting only 20,000 and if you select low none at all as there is no password)
- This hash is then passed through 2,000 iterations using PBKDF2 with a different salt for each ToDo list. (With medium security setting only 500 and if you select low none at all as there is no password)
- The resulting hash is then used for AES256 encryption.
- In addition, the data is encrypted with a SHA256 hash based on the device ID using TripleDES.
- No data is transferred to a cloud or similar.
- All data is processed and stored locally on the device.
  <img src="images/encryptionDataFlow.png" alt="Encryption Engine Work Flow">
  The security measures described below all refer to the high security setting, which is also the default setting.

### Justification

- Why is PBKDF2 performed twice?

  - So that it is possible to use a different salt for each ToDo list. This increases the protection against rainbow table attacks.
  - In addition, the recommended number of iterations for PBKDF2 can still be carried out without extremely poor performance. This increases protection against Brutal Force Attacks.
  - Such a high number of iterations in combination with different salts for each ToDo list has proven to be very slow and impractical on current devices (e.g. iPhone 14).
  - Furthermore, if a single ToDo list is decrypted, the others are not threatened.

- Why just use SHA256 for the PBKDF2?

  - Quick answer, simply because of the performance.
  - With a SHA512 hash for the login, a current Android flagship smartphone (from 2023) took an average of 50 seconds and a current iPhone around 15 seconds.
  - Since the performance with SHA256 is significantly better with Android around 10 seconds and iPhone 2-3 seconds, this was used.

- Why AES and TripleDES?
  - AES256 is currently the general recommendation. And since the goal was to use an additional encryption with a different password (here the deviceID), it was the right opportunity to use a different method.
  - So if AES256 or TripleDES have security problems, this can work as a further protection measure.
  - It also increases the effort for attackers as they have to decrypt two different methods.
  - Since it also offers no disadvantages (except performance), e.g. a hack of the TripleDES encryption still leads to the AES encryption having to be decrypted, the advantages were seen to outweigh the disadvantages.

<br />

### Encryption Engine Flow

The encryption and decryption process is also shown here.
The password is already understood to be the PBKDF2 processed hash with 60,001 iterations, as only this is used within the application as soon as it has been generated after opening the app.

Anyone interested is free to take a closer look at this and make suggestions for improvement. The entire encryption/decryption logic takes place in the EncryptionEngine. (Except the logic of the biometric login)
<img src="images/EncryptionEngineFlow.png" alt="Encryption Engine Work Flow" height="600">
<br /><br /><br />

### Security Fingerprint Login

- The password is stored in the KeyStore on Android and in the keychain on iOS if biometric authentication is enabled. These stores are secure according to the OS publisher.
  If this is not used, the password is not saved either.
- Only the first PBKDF2 hash from the first derivation is used. No password in plain text or similar. This is also the reason for the significantly faster login with a biometric login.
- The password hash is encrypted with TripleDES as it does not usually need to be decrypted frequently.
- The password hash is encrypted with a SHA256 hash from the deviceID/identifier of the device provided by Capacitor before it is stored. (Just to be safe and independent of OS security.)

  <i>On iOS, the identifier is a UUID that uniquely identifies a device to the app’s vendor ([read more](https://developer.apple.com/documentation/uikit/uidevice/1620059-identifierforvendor)).

  On Android 8+, **the identifier is a 64-bit number (expressed as a hexadecimal string)**, unique to each combination of app-signing key, user, and device ([read more](https://developer.android.com/reference/android/provider/Settings.Secure#ANDROID_ID)).</i>

### Security Export/Import

- When the ToDo lists are exported, they are no longer encrypted with the SHA256 hash of the DeviceID. However, they are encrypted using AES with a specific word which is hard-coded here.

- As before, the ToDo lists are also encrypted with PBKDF2 and should only be decryptable with the user's password.

- When importing the data, the data must be decrypted with the user's password, otherwise it should not be visible.

### Note on the security measures

- The secure encryption of data/ToDo lists cannot be guaranteed.
- The application has been developed to be as secure as possible from the developer's point of view.
- It is open to anyone to review the security measures here and report any security vulnerabilities identified here. (This is why the application is open source)
- The Crypto-JS node package is used for encryption. If this has security gaps or similar, the data here is insecure!

## Distribution

- Android/iOS: The app is distributed in the Google Play Store and Apple App Store with the help of Capacitor.
- Windows: With the help of Electron, it is distributed in the Microsoft App Store as MSI. Installation. (Without support for Windows Hello/fingerprint scanner)
- Mac: It is possible to use the Electron app from the repo. However, it is recommended to simply download the iOS app from the Apple App Store for M1 MacBooks. This app also supports Touch ID etc. directly.

## Testing

The Jest testing framework is used for testing.
The tests here are always written in Typescript.

The goal is actually to have about 80% test coverage of the lines. This number appears to be enough as this is a freetime project.

| File                                                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s |
| -------------------------------------------------------- | ------- | -------- | ------- | ------- | ----------------- |
| All files                                                | 63.33   | 51.89    | 58.47   | 64.24   |
| src                                                      | 70      | 50       | 60      | 77.77   |
| App.tsx                                                  | 100     | 75       | 100     | 100     | 27                |
| darkModeDetector.ts                                      | 40      | 0        | 50      | 50      | 8-11              |
| i18n.ts                                                  | 100     | 100      | 100     | 100     |
| index.tsx                                                | 100     | 100      | 100     | 100     |
| src/custom_components/enums                              | 0       | 0        | 0       | 0       |
| SecurityLevel.enum.ts                                    | 0       | 0        | 0       | 0       |
| priority.enum.ts                                         | 0       | 0        | 0       | 0       |
| src/custom_components/featureFlags                       | 100     | 100      | 100     | 100     |
| featureFlags.ts                                          | 100     | 100      | 100     | 100     |
| src/custom_components/handleNotes/editNote/container     | 55.67   | 37.5     | 38.09   | 55.67   |
| container-editNote.tsx                                   | 55.67   | 37.5     | 38.09   | 55.67   | ...21-243,267-274 |
| src/custom_components/handleNotes/editNote/screen        | 55.55   | 64.28    | 42.85   | 55.55   |
| screen-editNote.tsx                                      | 55.55   | 64.28    | 42.85   | 55.55   | 128-195           |
| ...mponents/handleNotes/editNote/screen/ui/dateWithClock | 100     | 100      | 100     | 100     |
| dateWithClock.tsx                                        | 100     | 100      | 100     | 100     |
| ...components/handleNotes/editNote/screen/ui/progressBar | 100     | 100      | 100     | 100     |
| progressBar.tsx                                          | 100     | 100      | 100     | 100     |
| ...onents/handleNotes/editNote/screen/ui/progressBarMenu | 71.42   | 50       | 40      | 71.42   |
| progressBarMenu.tsx                                      | 75      | 50       | 50      | 75      | 51,64             |
| progressBarScreen.tsx                                    | 69.23   | 50       | 33.33   | 69.23   | 45-75             |
| ...stom_components/handleNotes/editToDoElement/container | 1.47    | 0        | 0       | 1.47    |
| container-editToDo.tsx                                   | 1.47    | 0        | 0       | 1.47    | 25-199            |
| ...custom_components/handleNotes/editToDoElement/screens | 60      | 100      | 50      | 60      |
| screen-editToDo-TooMuch.tsx                              | 33.33   | 100      | 0       | 33.33   | 32-34             |
| screen-editToDo.tsx                                      | 71.42   | 100      | 60      | 71.42   | 80-85             |
| ...nts/handleNotes/editToDoElement/screens/ui/dataPicker | 80      | 50       | 66.66   | 80      |
| dataPicker.tsx                                           | 80      | 50       | 66.66   | 80      | 42                |
| ...dleNotes/editToDoElement/screens/ui/priorityIndicator | 100     | 100      | 100     | 100     |
| priorityIndicator.tsx                                    | 100     | 100      | 100     | 100     |
| src/custom_components/handleNotes/viewNote/container     | 89.28   | 62.96    | 86.66   | 90.56   |
| container-viewNote.tsx                                   | 91.17   | 85.71    | 87.5    | 90.9    | 33,40,70          |
| getNotes.ts                                              | 86.36   | 38.46    | 85.71   | 90      | 30,38             |
| src/custom_components/handleNotes/viewNote/screen        | 100     | 66.66    | 100     | 100     |
| screen-viewNote.tsx                                      | 100     | 66.66    | 100     | 100     | 54-67             |
| ...components/notNotesRelated/encryption_modal/container | 36.36   | 25.8     | 31.25   | 36.36   |
| container-encryption-modal.tsx                           | 36.36   | 25.8     | 31.25   | 36.36   | ...09,123-141,155 |
| ...om_components/notNotesRelated/encryption_modal/screen | 100     | 87.5     | 100     | 100     |
| screen-encryption-modal.tsx                              | 100     | 87.5     | 100     | 100     | 62                |
| src/custom_components/notNotesRelated/navBar/container   | 84      | 60       | 83.33   | 84      |
| container-navBar.tsx                                     | 84      | 60       | 83.33   | 84      | 27,46-48          |
| src/custom_components/notNotesRelated/navBar/screen      | 100     | 83.33    | 100     | 100     |
| screen-navBar.tsx                                        | 100     | 83.33    | 100     | 100     | 48                |
| src/custom_components/notNotesRelated/settings/container | 0.91    | 0        | 0       | 0.93    |
| container_settings.tsx                                   | 0.91    | 0        | 0       | 0.93    | 17-221            |
| src/custom_components/notNotesRelated/settings/screen    | 100     | 72.72    | 100     | 100     |
| screen_settings.tsx                                      | 100     | 72.72    | 100     | 100     | 48-71             |
| ...om_components/notNotesRelated/welcomeScreen/container | 46.66   | 45       | 14.28   | 63.63   |
| container-welcomeScreen.tsx                              | 46.66   | 45       | 14.28   | 63.63   | 22-23,28-29       |
| .../notNotesRelated/welcomeScreen/container/SubContainer | 57.81   | 18.75    | 46.66   | 60.65   |
| container-welcome1.tsx                                   | 100     | 100      | 100     | 100     |
| container-welcome2.tsx                                   | 100     | 100      | 100     | 100     |
| container-welcome3.tsx                                   | 60      | 25       | 33.33   | 66.66   | 24,29-34          |
| container-welcome4.tsx                                   | 50      | 25       | 66.66   | 50      | 34-54             |
| container-welcome5.tsx                                   | 50      | 0        | 25      | 53.33   | 16,20-30          |
| ...stom_components/notNotesRelated/welcomeScreen/screens | 90.9    | 50       | 83.33   | 90.9    |
| screen-welcome1.tsx                                      | 100     | 50       | 100     | 100     | 19                |
| screen-welcome2.tsx                                      | 100     | 100      | 100     | 100     |
| screen-welcome3.tsx                                      | 100     | 100      | 100     | 100     |
| screen-welcome4.tsx                                      | 100     | 50       | 100     | 100     | 58-72             |
| screen-welcome5.tsx                                      | 66.66   | 50       | 50      | 66.66   | 56                |
| .../notNotesRelated/welcomeScreen/screens/ui/continueBtn | 100     | 100      | 100     | 100     |
| continue-button.tsx                                      | 100     | 100      | 100     | 100     |
| ...esRelated/welcomeScreen/screens/ui/passwordInputField | 100     | 100      | 100     | 100     |
| passwordInputField.tsx                                   | 100     | 100      | 100     | 100     |
| ...notNotesRelated/welcomeScreen/screens/ui/progressDots | 100     | 100      | 100     | 100     |
| progressDots.tsx                                         | 100     | 100      | 100     | 100     |
| ...ts/notNotesRelated/welcomeScreen/screens/ui/radioBtns | 100     | 100      | 100     | 100     |
| security-radioBtn.tsx                                    | 100     | 100      | 100     | 100     |
| string-radioBtn.tsx                                      | 100     | 100      | 100     | 100     |
| src/custom_components/services/encryptionEngine          | 72.22   | 33.33    | 88.88   | 72.22   |
| encryptionEngine.ts                                      | 72.22   | 33.33    | 88.88   | 72.22   | ...12,123,153,186 |
| src/custom_components/services/equals                    | 100     | 100      | 100     | 100     |
| equals.ts                                                | 100     | 100      | 100     | 100     |
| src/custom_components/services/fingerprintLogic          | 98      | 80       | 100     | 98      |
| fingerprintLogic.ts                                      | 98      | 80       | 100     | 98      | 63                |
| src/custom_components/services/formatDate                | 100     | 100      | 100     | 100     |
| formatDate.ts                                            | 100     | 100      | 100     | 100     |
| src/custom_components/services/progressToDoListService   | 73.33   | 83.33    | 55.55   | 81.48   |
| progressToDoListService.ts                               | 73.33   | 83.33    | 55.55   | 81.48   | 79-88             |
| src/custom_components/services/toDoListHandler           | 100     | 100      | 100     | 100     |
| IToDoListService.ts                                      | 0       | 0        | 0       | 0       |
| toDoListHandler.ts                                       | 100     | 100      | 100     | 100     |
| ...custom_components/services/toDoListHandler/Categories | 100     | 100      | 100     | 100     |
| categories.ts                                            | 100     | 100      | 100     | 100     |
| src/custom_components/services/toDoListHandler/Filter    | 100     | 100      | 100     | 100     |
| toDoListFilter.ts                                        | 100     | 100      | 100     | 100     |
| ...ustom_components/services/toDoListHandler/Persistence | 71.42   | 50       | 57.14   | 73.58   |
| toDoListPersistence.ts                                   | 71.42   | 50       | 57.14   | 73.58   | ...52,68-73,83-89 |
| src/custom_components/services/toDoListHandler/Sorter    | 86.66   | 88.46    | 100     | 86.66   |
| toDoListSort.ts                                          | 86.66   | 88.46    | 100     | 86.66   | 6,29              |
| src/custom_components/types                              | 0       | 0        | 0       | 0       |
| ToDoItem.types.ts                                        | 0       | 0        | 0       | 0       |
| ToDoList.types.ts                                        | 0       | 0        | 0       | 0       |
| ToDoListKey.types.ts                                     | 0       | 0        | 0       | 0       |
| src/modules/app_configuration                            | 100     | 100      | 100     | 100     |
| app_texts.ts                                             | 100     | 100      | 100     | 100     |
| src/modules/legal                                        | 100     | 71.42    | 100     | 100     |
| codeToTextParser.tsx                                     | 100     | 100      | 100     | 100     |
| datenschutz.tsx                                          | 100     | 50       | 100     | 100     | 16-32             |
| impressum.tsx                                            | 100     | 50       | 100     | 100     | 16-32             |
| src/modules/legal/usedLibs                               | 100     | 100      | 100     | 100     |
| container_usedLibList.tsx                                | 100     | 100      | 100     | 100     |
| screen_usedLibList.tsx                                   | 100     | 100      | 100     | 100     |
| src/modules/ui/floatingBtn                               | 100     | 100      | 100     | 100     |
| floatingBtn.tsx                                          | 100     | 100      | 100     | 100     |
| src/modules/ui/progress/progressCircle                   | 100     | 100      | 100     | 100     |
| progressCircle.tsx                                       | 100     | 100      | 100     | 100     |

## Architecture

The components used are divided into four categories:

- `UI-Elements`
- `View-Componets`
- `Container-Componets`
- `ServiceLayer`

Note: Some of the modules are used from other Web Apps like the Encryption Engine or the Impressum/Imprint Modules.
As a result of the use from the modules, some files have an the name "note" instead of "todoList" inside and there is also one configuration file:

- `app_texts`: Contains texts such as the description, imprint text, data protection text etc.

In addition, the separation is not 100% sharp, partly because of these modules, but also because the final architecture only turned out that way during development.

`UI-Elements`
At the topmost level, UI-Elements are the fundamental building blocks of our interface. These are the atomic components that include buttons, input fields, and other basic interactive elements. They are styled and abstracted to be reusable across the application.

`View-Components`
View-Components are composed of UI-Elements and form parts of the application's screens. They are responsible for presenting data and handling user interactions. These components are often reusable within different parts of the application and can communicate with Container-Components for dynamic data fetching.

`Container-Components`
Container-Components serve as the data-fetching and state management layer in our architecture. They connect View-Components to the Service Layer, managing the application state and providing data to the components as necessary. They may also handle complex user interactions, form submissions, and communicate with services to send or receive data.

`Service Layer`
The Service Layer is the foundation of our application's client-side architecture. It abstracts all the handling wth the ToDo Lists (LocalStorage handling included), the fingerprint logic (e.g. password storage in secure storage), helpful functions (e.g. formatDate,equals) and the encryption engine logic.

There is a large ToDo List service which is also subdivided into smaller services. This design was considered practicable here to make this very large service easy to maintain in the future. This was not necessary for the others and they are simple export functions.

![Secure Banner Architecture](images/SecurePlannerArchitecture_Layers.png)
Note: The App.tsx, the interfaces and props are hidden here to make it easy to keep an overview.

## Troubleshooting

### While generate Electron App for Windows/Mac/LNX

```
node_modules/builder-util-runtime/out/httpExecutor.d.ts:9:5 - error TS2411: Property '"accept-charset"' of type 'string | string[]' is not assignable to 'string' index type 'string'.

9     [key: string]: string;
      ~~~~~~~~~~~~~~~~~~~~~~
```

For whatever reason, this NPM module is not 100% compatible. The easy fix is to simply change the location in the error so that the file type matches.
Just adjust the module inside the Electron folder under node_modules by adjust the line:

```
export interface RequestHeaders extends OutgoingHttpHeaders {
    [key: string]: string | string[]|number | undefined;
}
```

is adapted to this:
export interface RequestHeaders extends OutgoingHttpHeaders {
[key: string]: string | string[];
}

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test -- --coverage --watchAll`

Returns the complete test coverage rate in the form of a table for all files.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npx cap sync`

This command will synchronize the iOS and Android project and bring it up to the current status of the web app.

### `npx cap open ios`

This command will open XCode with the current Capacitor project so that you can build the app directly.

### `npx cap open android`

This command will open Android Studio with the current Capacitor project so that you can build the app directly.

### `./node_modules/.bin/license-checker --json --production --out licenses.json`

Generate the JSON with the licenses of the NPM packages used.
This can then replace the existing license json under modules/legal/usedLibs.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Used NPM Modules

According to the command npm list
You can see the deeper NPM modules used and which of these are used in the licenses.json.

├── @babel/core@7.23.9

├── @babel/plugin-proposal-private-property-in-object@7.21.11

├── @babel/preset-env@7.23.9

├── @capacitor-community/electron@5.0.1

├── @capacitor/android@5.7.0

├── @capacitor/app@5.0.7

├── @capacitor/cli@5.7.0

├── @capacitor/core@5.7.0

├── @capacitor/device@5.0.7

├── @capacitor/filesystem@5.2.1

├── @capacitor/ios@5.7.0

├── @capacitor/share@5.0.7

├── @emotion/react@11.11.3

├── @emotion/styled@11.11.0

├── @mui/material@5.15.7

├── @testing-library/jest-dom@5.17.0

├── @testing-library/react@13.4.0

├── @testing-library/user-event@13.5.0

├── @types/crypto-js@4.2.2

├── @types/jest@27.5.2

├── @types/node@16.18.79

├── @types/react-datepicker@6.0.1

├── @types/react-dom@18.2.19

├── @types/react@18.2.55

├── babel-jest@29.7.0

├── bootstrap-icons@1.11.3

├── bootstrap@5.3.2

├── capacitor-native-biometric@4.2.2

├── crypto-js@4.2.0

├── electron-builder@24.9.1

├── i18next-browser-languagedetector@7.2.0

├── i18next@23.8.2

├── license-checker@25.0.1

├── react-bootstrap@2.10.0

├── react-datepicker@6.1.0

├── react-dom@18.2.0

├── react-i18next@14.0.5

├── react-icons@4.12.0

├── react-router-dom@6.22.0

├── react-scripts@5.0.1

├── react-swipeable@7.0.1

├── react@18.2.0

└── typescript@4.9.5
