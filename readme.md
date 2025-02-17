## how to find circular dependencies

npx madge --circular --extensions tsx ./

## set up

- `npm i -g eas-cli`
- `eas whoami` to check what account from expo you are using
- `eas login` to login using your expo account

## change version number on ios and android folder

- change the version on the `app.json` file
- after that, run: `npx expo prebuild`

## build commands

- for development: `eas build --profile=development --platform=ios`
- for testing: `eas build --profile=preview --platform=ios`
- for prod: `eas build --platform=ios`
- for building locally: `eas build --platform=ios --local`
- for running a previous build `eas build:run`

IMPORTANT: the profiles can be found on the file `eas.json` on the root folder

## submit build to the App Store Connect

After creating a prod build, we can submit that build to app store connect, so we can publish it or use in test-flight:

- ios: `eas submit -p ios`
- Choose: Select a build from EAS
- Choose the build id you created, and want to publish
- Reuse this App Store Connect API Key? Yes
