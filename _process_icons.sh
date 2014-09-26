#!/bin/bash

# Optimize icons images
mogrify -resize 128x128 -path img/icons img/_icons/*.png
