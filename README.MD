# Learnix

## Usage

Make sure the `venv` package is installed. Python should come with venv preinstalled.

1. Open up a terminal window in the project's root folder and go to the `server` folder:

        $ cd server

2. Create the virtual environment:

    MacOS/Linux:

        $ python3 -m venv .venv

    Windows:

        > py -3 -m venv .venv

3. Activate the venv

    MacOS/Linux: 
    
        $ . .venv/bin/activate

    Windows:

        > .venv\Scripts\activate

4. Now install the required modules. That includes Flask:

        $ pip install -r requirements.tx

5. Start the server with

        $ flask run

The server should run on port 5000.

6. Open another terminal and go to the client folder

7. Install the necessary packages in package.json

        $ npm install

8. Start the front-end client

        $ npm run dev

The client should run on port 3000.

## Android Usage

Make sure you have [Android Studio](https://developer.android.com/studio/install) installed, Developer Mode is enabled in your Android device, and USB Debugging or Wi-Fi Debugging is enabled on your Android. You can also use an Android Emulator.

Don't forget to re-run `npm install` to install all necessary packages.

1. Navigate to the `client`

2. Add the android platform

        npx cap add android

3. Build the project

        npm run build

4. Sync the web source to the native project

        npx cap sync

5. Open the `client/android` folder in Android Studio and build/run it from there
