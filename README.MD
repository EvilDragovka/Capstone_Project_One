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

4. Now install flask:

        $ pip install flask

5. Start the server with

        $ flask run

The server should run on port 5000.

6. Open another terminal and go to the client folder

7. Install the necessary packages in package.json

        $ npm install

8. Start the front-end client

        $ npm run dev

The client should run on port 3000.