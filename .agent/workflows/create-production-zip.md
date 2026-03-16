---
description: create production zip bundle for cpanel
---

When the user requests to create a zip file or a production bundle for the website to be uploaded to a server (like cPanel) or just a deployment zip:

1. Create a ZIP archive of the `Marterm.com.tr` directory.
2. Ensure you **EXCLUDE** the `.git` folder, as well as `.DS_Store` and development files like workflows.
3. Use the following command to generate the clean output:

// turbo
4. Run: `zip -r marterm-website-production.zip . -x "*.git*" "*.DS_Store*" "DEVLOG.md" "README.md" ".agent/*"`
