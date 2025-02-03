#!/bin/bash

# Check if a commit message is provided
if [ -z "$1" ]; then
  echo "Please provide a commit message."
  exit 1
fi

# Git commands
git add . || { echo "Error: Failed to stage changes."; exit 1; }
git commit -m "$1" || { echo "Error: Failed to commit changes."; exit 1; }
git push origin main || { echo "Error: Failed to push changes."; exit 1; }

# Open GitHub Pages website
echo "Update successful! Opening GitHub Pages..."
open "https://litspaceking.github.io/crypto-tracker"

# Trigger JavaScript notification
echo "Running notification..."
# echo "<script>showNotification('Refresh for new update!');</script>" >> index.html
echo "<script>triggerNotification();</script>" >> index.html


# Now push the updated index.html so the change gets reflected
git add index.html
git commit -m "Triggered notification"
git push origin main

#./deploy.sh "Updated styles and added new feature" will it update my website
