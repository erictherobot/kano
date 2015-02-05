![Magnium CI Build Status](https://magnum-ci.com/status/2b8aafce819111e1aa3ea86d007fbd7c.png "Magnium CI Build Status")

KANO
====

nodejs + expressjs + mongodb + jade + bootstrap + mocha + API's

Demo
====

https://kanoapp.herokuapp.com

Themes
====

Choosing your base theme color is as easy as changing a value in kano.less

    @brand-kano: #e24e24;

Produces an Orange theme:
![](http://stopbrain.com/content/images/2014/Apr/Screen_Shot_2014_04_06_at_10_43_04_AM.png)

    @brand-kano: #6e5acc;

Produces a Purple theme:
![](http://stopbrain.com/content/images/2014/Apr/Screen_Shot_2014_04_06_at_10_46_43_AM.png)

    @brand-kano: #56AFE1;

Produces a Blue theme:
![](http://stopbrain.com/content/images/2014/Apr/Screen_Shot_2014_04_06_at_10_49_16_AM.png)

    @brand-kano: #1ebf8f;

Produces a Green theme:
![](http://stopbrain.com/content/images/2014/Apr/Screen_Shot_2014_04_06_at_10_58_41_AM.png)

    @brand-kano: #000000;

Produces a Black theme:
![](http://stopbrain.com/content/images/2014/Apr/Screen_Shot_2014_04_06_at_10_56_09_AM.png)

Prerequisites
====

- MongoDB
- NodeJS
- NPM

Installation
====

Clone the repo

    git clone https://github.com/erictherobot/kano.git

Change directory

    cd kano

Install NPM and Dependencies from package.json file

    npm install

Start the app

    node app.js

If you want the app to run continually during development, use https://github.com/remy/nodemon

    nodemon app.js

View your app in a browser of choice visit http://localhost:3000

MongoDB Admin UI
====

Download http://genghisapp.com

Next run from terminal - it will launch a new browser window

    genghisapp

Tests
====

    npm test

Coding Music
====

https://www.youtube.com/watch?v=zXmCOlmucBY

Support
====

Contact erictherobot@gmail.com or twitter @erictherobot

Meanings
====

Kano \k(a)-no\ as a boy's name is of Japanese origin, and the meaning of Kano is "one's masculine power, capability".

====

The Kano model is a theory of product development and customer satisfaction developed in the 1980s by Professor Noriaki Kano, which classifies customer preferences into five categories.

- Must-be Quality
- One-dimensional Quality
- Attractive Quality
- Indifferent Quality
- Reverse Quality

License
====

The MIT License (MIT)

Copyright (c) 2014 Eric The Robot

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
