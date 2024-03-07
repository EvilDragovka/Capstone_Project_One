# Learnix

"Learnix: Unleashing the Creative Mind"

Are you ready to explore the frontiers of AI-driven creativity? Look no further than Learnix, our cutting-edge Academic Generative AI application. Powered by a fusion of advanced technologies, Learnix is your gateway to a world where imagination meets code.

## 🌟 Features:

Generative Magic: Learnix harnesses the power of Llama 2 70b chat model by Meta to create stunning conversations. Whether you’re an artist, a game developer, or a data scientist, Learnix has you covered.

TypeScript Brilliance: Our proprietary TypeScript engine allows you to input prompts and watch Learnix weave intricate narratives, compose poetry, or even generate code snippets. From Shakespearean sonnets to Pythonic prose, the possibilities are endless.

LangChain Integration: Learnix leverages LangChain, our custom blockchain solution, to securely store and verify generated content. Each masterpiece is cryptographically linked to its creator, ensuring authenticity and provenance.

MySQL-Powered Knowledge: Dive deep into the well of human knowledge with our integrated MySQL database. Learnix draws inspiration from historical texts, scientific papers, and literary classics, infusing its creations with wisdom and context.

Flask of Creativity: The Flask microframework fuels Learnix’s backend, serving up APIs with elegance and speed. Whether you’re querying the model or saving your latest masterpiece, Flask keeps things smooth and efficient. 

React to the Future: Our frontend dances to the rhythm of React, providing a seamless user experience. Interact with the Llama 2 70b chat model through an intuitive interface, tweak parameters, and witness the magic unfold.

Pythonic Enchantment: Llama 2's core is written in Python, the language of choice for AI enthusiasts. Dive into the codebase, extend its capabilities, and contribute to the ever-evolving world of generative creativity.

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

        $ pip install -r requirements.txt

5. Start the server with

        $ flask run

The server should run on port 5000.

6. Open another terminal and go to the client folder

7. Install the necessary packages in package.json

        $ npm install

8. Start the front-end client

        $ npm run dev

The client should run on port 3000.

## Android Usage & Building Application

Make sure you have [Android Studio](https://developer.android.com/studio/install) installed, Developer Mode is enabled in your Android device, and USB Debugging or Wi-Fi Debugging is enabled on your Android. You can also use an Android Emulator.

Don't forget to re-run `npm install` to install all necessary packages.

1. Navigate to the `client` folder

2. Add the android platform

        npx cap add android

3. Build the project

        npm run build

4. Sync the web source to the native project

        npx cap sync

5. Open the `client/android` folder in Android Studio and build/run it from there
